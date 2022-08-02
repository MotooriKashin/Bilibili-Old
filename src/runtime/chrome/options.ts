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
import { saveConfig, setting } from "../setting";
import { doWhile } from "../do_while";

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
            sessionStorage.setItem("setting", setting);
        })
        /** 用于初始化设置时临时禁用回调的标记 */
        let disableSettingCallback = true;
        doWhile(() => sessionStorage.getItem("setting"), () => {
            const SETTING: any[] = [];
            settingDefault.forEach(d => {
                let tag = false;
                if (d.type !== "list") {
                    Reflect.has(setting, d.key) && ((<any>d).value = Reflect.get(setting, d.key));
                    d = new Proxy(d, {
                        set: (t, p, v, r) => {
                            if (p === "value") {
                                if (!tag) {
                                    (<any>setting)[d.key] = v;
                                    return true;
                                }
                                tag = false;
                            }
                            return Reflect.set(t, p, v, r);
                        }
                    });
                    // 先赋值再修改才能枚举到哦~
                    (<any>setting)[d.key] = (<any>d).value;
                    Object.defineProperty(setting, d.key, {
                        set: v => {
                            tag = true;
                            (<any>d).value = v;
                        },
                        get: () => (<any>d).value
                    });
                } else {
                    const obj = Reflect.has(setting, d.key) && JSON.parse(JSON.stringify(setting[d.key]));
                    const bak: any = {};
                    (<any>setting)[d.key] = new Proxy(bak, {});
                    d.list.forEach((t, i, a) => {
                        obj && obj[t.key] && ((<any>t).value = obj[t.key]);
                        a[i] = new Proxy(t, {
                            set: (t, p, v, r) => {
                                if (p === "value") {
                                    if (!tag) {
                                        (<any>setting)[d.key][t.key] = v;
                                        return true
                                    }
                                    tag = false;
                                }
                                return Reflect.set(t, p, v, r);
                            }
                        });
                        bak[t.key] = (<any>a)[i].value;
                        Object.defineProperty(bak, t.key, {
                            get: () => (<any>a)[i].value,
                            set: v => {
                                tag = true;
                                (<any>a)[i].value = v;
                            }
                        });
                        (<any>setting)[d.key][t.key] = (<any>t).value;
                    });
                }
                SETTING.push(d);
            });
            SETTING.forEach((e: any) => {
                const target = <HTMLDivElement>this.$item.querySelector(`.item${e.menu}`);
                this.$showSetting[e.key] = e.menu;
                this.$showSetting[e.menu] = e.menu;
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
                        this.$showSetting[f.key] = e.menu;
                        this.$initItem(<HTMLDivElement>target.querySelector(`.con1${e.key}`)?.nextSibling, <any>f);
                    })
                }
                else {
                    this.$initItem(<HTMLDivElement>target.querySelector(`.con1${e.menu}`)?.nextSibling, e);
                }
            });
            location.hash ? showSetting(location.hash.substring(1)) : showSetting("common");
            setTimeout(() => {
                document.querySelector<any>("#loading").style.display = "none";
                this.style.opacity = "";
                toast.info("Bilibili Old设置界面", "调整设置后可能需要刷新页面才会生效哦~")
            }, 300);
            disableSettingCallback = false;
        });
        window.addEventListener("message", ev => {
            if (ev.data.$type == "showSetting") {
                location.hash = ev.data.data;
                this.$menu.querySelector<HTMLDivElement>(`.${this.$showSetting[ev.data.data]}`)?.click();
                this.$item.querySelector(`.con1${ev.data.data}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                this.$item.querySelector(`.con2${ev.data.data}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            if (ev.data.$type == "setValue") {
                chrome.storage.local.set(ev.data.data);
            }
        })
    }
    $showSetting: Record<string, string> = {};
    $initItem(node: HTMLDivElement, info: any) {
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
                                saveConfig();
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