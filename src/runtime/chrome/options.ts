import { ProxyHandler } from "../lib/proxy_handler";
import { addElement } from "../element/add_element";
import { ButtonSwitch } from "../element/button_switch/button_switch";
import { Checkbox } from "../element/checkbox/checkbox";
import { createElement, createElements } from "../element/create_element";
import { FloatQuote } from "../element/float_quote/float_quote";
import { htmlVnode, Vdom } from "../element/html_vnode";
import { InputArea } from "../element/input_area/input_area";
import { PushButton } from "../element/push_button/push_button";
import { SelectMenu } from "../element/select_list/select_menu";
import { SliderBlock } from "../element/slider_block/slider_block";
import { sessionStorage } from "../storage";
import { menu } from "./menu";
import { settingDefault, showSetting } from "./settings";
import { toast } from "../toast/toast";
import SETTING_DEFAULT from "./setting.json";

// 暴露拓展ID
sessionStorage.setItem("bilibili-old", chrome.runtime.id);
class BilibiliOld extends HTMLElement {
    $root: ShadowRoot;
    $menu: HTMLDivElement;
    $item: HTMLDivElement;
    constructor() {
        super();
        this.$root = <ShadowRoot>this.shadowRoot;
        this.$menu = <HTMLDivElement>this.$root.children[2].children[0];
        this.$item = <HTMLDivElement>this.$root.children[2].children[1];
        this.style.opacity = "0";
        // 初始化菜单
        this.$menu.replaceChildren(createElements(menu.reduce((s, d) => {
            s.push(
                {
                    tagName: "div",
                    props: { class: `menuitem ${d.key}` },
                    children: [
                        {
                            tagName: "div",
                            props: { class: "icon" },
                            children: d.svg ? htmlVnode(d.svg) : []
                        },
                        {
                            tagName: "text",
                            text: d.value
                        }
                    ],
                    event: {
                        click: () => {
                            location.hash = d.key;
                            this.$menu.querySelector(`.selected`)?.classList.remove("selected");
                            this.$item.querySelector(`.selected`)?.classList.remove("selected");
                            this.$menu.querySelector(`.${d.key}`)?.classList.add("selected");
                            this.$item.querySelector(`.item${d.key}`)?.classList.add("selected");
                        }
                    }
                }
            )
            return s;
        }, <Vdom[]>[])));
        this.$item.replaceChildren(createElements(htmlVnode(menu.reduce((s, d) => {
            s += `<div class="item${d.key}"><div class="contain1 con1${d.key}">
    <div class="header">
        <h2 class="title">${d.value}</h2>
    </div>
</div>
<div class="card"></div></div>`;
            return s;
        }, ""))));
        chrome.storage.local.get().then(({ setting }) => {
            setting = Object.assign(SETTING_DEFAULT, setting || {});
            sessionStorage.setItem("setting", setting);
            new Proxy(settingDefault, new ProxyHandler(() => {
                const news = settingDefault.reduce((s, f: any) => {
                    this.$showSetting[f.menu] = f.menu;
                    this.$showSetting[f.key] = f.menu;
                    if (f.type == "list") {
                        f.list?.forEach((e: any) => {
                            if (Reflect.has(setting[f.key], e.key)) {
                                s[f.key] || (s[f.key] = {});
                                s[f.key][e.key] = e.value
                            }
                            this.$showSetting[e.key] = f.menu;
                        })
                    } else {
                        if (Reflect.has(setting, f.key)) {
                            s[f.key] = f.value
                        }
                    }
                    return s;
                }, <Record<string, any>>{})
                chrome.storage.local.set({ setting: news });
                sessionStorage.setItem("setting", news);
            })).forEach((e: any) => {
                const target = <HTMLDivElement>this.$item.querySelector(`.item${e.menu}`);
                if (e.type == "list") {
                    target.appendChild(createElements(htmlVnode(
                        `<div class="contain1 con1${e.key}">
                            <div class="header">
                                <h2 class="title">${e.name}</h2>
                            </div>
                        </div>
                        <div class="card"></div>`
                    )));
                    e.list?.forEach((f: any) => {
                        typeof f.value === "function" || (f.value = setting[e.key][f.key]);
                        this.$initItem(<HTMLDivElement>target.querySelector(`.con1${e.key}`)?.nextSibling, <any>f, setting, setting[e.key] && setting[e.key][f.key]);
                    })
                }
                else {
                    typeof e.value === "function" || (e.value = setting[e.key]);
                    this.$initItem(<HTMLDivElement>target.querySelector(`.con1${e.menu}`)?.nextSibling, e, setting, setting[e.key]);
                }
            });
            location.hash ? showSetting(location.hash.substring(1)) : showSetting("common");
            setTimeout(() => {
                document.querySelector<any>("#loading").style.display = "none";
                this.style.opacity = "";
                toast.info("Bilibili Old设置界面", "调整设置后可能需要刷新页面才会生效哦~")
            }, 300);
        })
        window.addEventListener("message", ev => {
            if (ev.data.$type == "showSetting") {
                location.hash = ev.data.data;
                this.$menu.querySelector<HTMLDivElement>(`.${this.$showSetting[ev.data.data]}`)?.click();
                this.$item.querySelector(`.con1${ev.data.data}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                this.$item.querySelector(`.con2${ev.data.data}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        })
    }
    $showSetting: Record<string, string> = {};
    $initItem(node: HTMLDivElement, info: any, set: Record<string, any>, value: any) {
        const part = node.appendChild(<HTMLDivElement>createElement(htmlVnode(
            `<div class="contain2 con2${info.key}">${info.svg ? `<div class="icon">${info.svg}</div>` : ""}
        <div class="label">${info.label + (info.sub ? `<div class="sub">${info.sub}</div>` : "")}</div>
        <div class="value"></div></div>`)[0]));
        switch (info.type) {
            case "button": part.classList.add("button");
                (<HTMLDivElement>part.lastChild).appendChild(new PushButton(info));
                break;
            case "checkbox": part.classList.add("checkbox");
                const checkbox = addElement("div", undefined, <HTMLDivElement>part.lastChild);
                info.candidate?.forEach((t: any) => {
                    checkbox.appendChild(new Checkbox(new Proxy({ label: t, value: info.value.includes(t) }, {
                        set: (tar, ppt, val, rcv) => {
                            if (ppt === "value") {
                                if (val) {
                                    info.value.includes(t) || (<any[]>info.value).push(t);
                                } else {
                                    const i = info.value.indexOf(t);
                                    i >= 0 && (<any[]>info.value).splice(i, 1);
                                }
                                chrome.storage.local.set({ setting: set });
                                info.callback && info.callback(info.value)
                            }
                            return Reflect.set(tar, ppt, val, rcv);
                        }
                    })))
                });
                break;
            case "input": part.classList.add("input");
                (<HTMLDivElement>part.lastChild).appendChild(new InputArea(info));
                break;
            case "select": part.classList.add("select");
                (<HTMLDivElement>part.lastChild).appendChild(new SelectMenu(info));
                break;
            case "slider": part.classList.add("slider");
                (<HTMLDivElement>part.lastChild).appendChild(new SliderBlock(info));
                break;
            case "switch": part.classList.add("switch");
                (<HTMLDivElement>part.lastChild).appendChild(new ButtonSwitch(info));
                break;
        }
        info.float && new FloatQuote(part, info.float);
    }
}
customElements.get("bilibili-old") || customElements.define("bilibili-old", BilibiliOld);