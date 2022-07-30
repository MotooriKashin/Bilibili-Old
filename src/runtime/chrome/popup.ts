import { debug } from "../debug";
import { addElement } from "../element/add_element";
import { InputArea } from "../element/input_area/input_area";
import { PushButton } from "../element/push_button/push_button";
import { getPageInfo } from "./page_info";

class BilibiliOld extends HTMLElement {
    $root: ShadowRoot;
    $meta: HTMLDivElement;
    $default: HTMLDivElement;
    $append: HTMLDivElement;
    ids: number[] = [];
    constructor() {
        super();
        this.$root = <ShadowRoot>this.shadowRoot;
        this.$meta = <HTMLDivElement>this.$root.firstChild;
        this.$default = <HTMLDivElement>this.$root.children[2];
        this.$append = <HTMLDivElement>this.$root.children[3];
        this.$default.appendChild(new PushButton({
            button: "设置选项",
            func() {
                chrome.runtime.openOptionsPage()
            }
        }));
        this.$default.appendChild(new PushButton({
            button: "B站主页",
            func() {
                chrome.tabs.create({
                    url: "https://www.bilibili.com",
                    active: true
                })
            }
        }));
        this.$default.appendChild(new PushButton({
            button: "问题反馈",
            func() {
                chrome.tabs.create({
                    url: "https://github.com/MotooriKashin/Bilibili-Old/issues",
                    active: true
                })
            }
        }));
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (sender.tab?.id && typeof message === "object" && message.$type === "pageInfo") {
                const d = message.data;
                if (typeof d === "object") {
                    if (d.aid || d.ssid || d.epid || d.playerParam) {
                        const div = addElement("div", undefined, this.$append);
                        d.title && addElement("div", { class: "info" }, div, d.title);
                        if (d.ssid || d.epid) {
                            addElement("div", { class: "info" }, div, d.ssid ? `ss${d.ssid}` : `ep${d.epid}`);
                        } else {
                            d.aid && addElement("div", { class: "info" }, div, `av${d.aid}`);
                        }
                        const dl = addElement("div", { class: "item" }, div, "<div>下载当前视频</div>");
                        dl.appendChild(new PushButton({
                            button: "下载",
                            func() {
                                chrome.tabs.sendMessage(<number>sender.tab?.id, { $type: "downloadDefault" })
                            }
                        }));
                        const local = addElement("div", { class: "item" }, div, "<div>播放本地文件</div>");
                        local.appendChild(new PushButton({
                            button: "加载",
                            func() {
                                chrome.tabs.sendMessage(<number>sender.tab?.id, { $type: "localMedia" })
                            }
                        }));
                        const online = addElement("div", { class: "item" }, div, "<div>在线弹幕</div>");
                        online.appendChild(new InputArea({
                            props: {
                                placeholder: "视频所在B站页面URL，或者aid/epid等关键参数",
                                type: "text"
                            },
                            change: (v) => {
                                v && chrome.tabs.sendMessage(<number>sender.tab?.id, {
                                    $type: "onlineDanmaku",
                                    url: v
                                });
                            }
                        }));
                        const allDm = addElement("div", { class: "item" }, div, "<div>全弹幕装填</div>");
                        allDm.appendChild(new PushButton({
                            button: "开始",
                            func() {
                                chrome.tabs.sendMessage(<number>sender.tab?.id, { $type: "allDanmaku" })
                            }
                        }));
                    }
                }
            }
        })
        chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            tabs.forEach(tab => {
                tab.id && chrome.scripting.executeScript({
                    target: {
                        tabId: tab.id,
                        allFrames: true
                    },
                    func: getPageInfo
                }).catch(d => {
                    debug.error(d);
                });
            })
        });
    }
}

customElements.get("bilibili-old") || customElements.define("bilibili-old", BilibiliOld);