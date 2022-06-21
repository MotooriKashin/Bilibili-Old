import { debug } from "../runtime/debug";
import { addElement } from "../runtime/element/addElement";
import { InputArea } from "../runtime/element/inputArea/inputArea";
import { PushButton } from "../runtime/element/pushButton/pushButton";

class BilibiliOld extends HTMLElement {
    $root: ShadowRoot;
    $meta: HTMLDivElement;
    $default: HTMLDivElement;
    $append: HTMLDivElement;
    constructor() {
        super();
        this.$root = <ShadowRoot>this.shadowRoot;
        this.$meta = <HTMLDivElement>this.$root.firstChild;
        this.$default = <HTMLDivElement>this.$root.children[2];
        this.$append = <HTMLDivElement>this.$root.children[3];
        this.$default.appendChild(new PushButton({
            button: "设置选项",
            func() {
                chrome.tabs.create({
                    url: "../options/options.html",
                    active: true
                })
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
        chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            tabs.forEach(tab => {
                try {
                    chrome.tabs.sendMessage(<number>tab.id, { $type: "getPageInfo" }, d => {
                        if (typeof d === "object") {
                            if (d.aid || d.ssid || d.epid || d.playerParam) {
                                d.title && addElement("div", { class: "info" }, this.$append, d.title);
                                if (d.ssid || d.epid) {
                                    addElement("div", { class: "info" }, this.$append, d.ssid ? `ss${d.ssid}` : `ep${d.epid}`);
                                } else {
                                    d.aid && addElement("div", { class: "info" }, this.$append, `av${d.aid}`);
                                }
                                const dl = addElement("div", { class: "item" }, this.$append, "<div>下载当前视频</div>");
                                dl.appendChild(new PushButton({
                                    button: "下载",
                                    func() {
                                        chrome.tabs.sendMessage(<number>tab.id, { $type: "downloadDefault" })
                                    }
                                }));
                                const local = addElement("div", { class: "item" }, this.$append, "<div>播放本地文件</div>");
                                local.appendChild(new PushButton({
                                    button: "加载",
                                    func() {
                                        chrome.tabs.sendMessage(<number>tab.id, { $type: "localMedia" })
                                    }
                                }));
                                const online = addElement("div", { class: "item" }, this.$append, "<div>在线弹幕</div>");
                                online.appendChild(new InputArea({
                                    props: {
                                        placeholder: "视频所在B站页面URL，或者aid/epid等关键参数",
                                        type: "text"
                                    },
                                    change: (v) => {
                                        v && chrome.tabs.sendMessage(<number>tab.id, {
                                            $type: "onlineDanmaku",
                                            url: v
                                        });
                                    }
                                }));
                                const allDm = addElement("div", { class: "item" }, this.$append, "<div>全弹幕装填</div>");
                                allDm.appendChild(new PushButton({
                                    button: "开始",
                                    func() {
                                        chrome.tabs.sendMessage(<number>tab.id, { $type: "allDanmaku" })
                                    }
                                }));
                            }
                        }
                    })
                } catch (e) { debug.error("与内容脚本通信", e) }
            })
        })
    }
}

customElements.get("bilibili-old") || customElements.define("bilibili-old", BilibiliOld);