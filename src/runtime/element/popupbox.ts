import { createElements } from "./create_element";
import { htmlVnode } from "./html_vnode";
import html from "./popupbox.html";
import svg from "../../images/svg/fork.svg";
import { mutex } from "../variable/mutex";

/** 配置数据 */
interface Value {
    /** 子节点 */
    children: DocumentFragment;
    /** 样式 */
    style: string;
    /** 关闭按钮，false表示点击节点外自动关闭 */
    fork: boolean;
}
/**
 * 监听节点外的点击后移除该节点  
 * **需要主动调用`observe`启动监听**
 * @param node 目标节点
 */
export class ClickRemove {
    cancel: () => void;
    observe: () => void;
    constructor(node: HTMLElement) {
        node.addEventListener("click", e => e.stopPropagation());
        function remove() {
            node.remove();
            document.removeEventListener("click", remove);
        }
        this.cancel = () => document.removeEventListener("click", remove);
        this.observe = () => {
            setTimeout(() => {
                document.addEventListener("click", remove);
            }, 100);
        }
    }
}
export class PopupBox extends HTMLElement {
    _children: DocumentFragment;
    /** 样式 */
    _style: string;
    /** 关闭按钮，false表示点击节点外自动关闭 */
    _fork: boolean;
    _observe: ClickRemove;
    __contain: HTMLDivElement;
    __fork: HTMLDivElement;
    /** 弹窗 */
    constructor(obj: Partial<Value>) {
        super();
        const { children, style, fork } = obj;
        const root = this.attachShadow({ mode: "closed" });
        root.appendChild(createElements(htmlVnode(html.replace('<div class="fork"></div>', `<div class="fork">${svg}</div>`))));
        this.__contain = <HTMLDivElement>root.children[0].children[0];
        this.__fork = <HTMLDivElement>root.children[0].children[1];
        this._observe = new ClickRemove(this);
        Object.defineProperties(obj, {
            children: {
                get: () => this._children,
                set: v => {
                    if (this._children === v) return;
                    this._children = v;
                    this.$children();
                }
            },
            style: {
                get: () => this._style,
                set: v => {
                    if (this._style === v) return;
                    this._style = v;
                    this.$style();
                }
            },
            fork: {
                get: () => this._fork,
                set: v => {
                    if (this._fork === v) return;
                    this._fork = v;
                    this.$fork();
                }
            }
        });
        this._children = obj.children = children || document.createDocumentFragment();
        this._style = obj.style = style || "";
        this._fork = obj.fork = fork || false;
        this.__fork.addEventListener("click", () => this.remove());
        document.body.appendChild(this);
    }
    timer = 0;
    $children() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.__contain.replaceChildren(this._children);
        }, 250);
    }
    $style() {
        this.__contain.setAttribute("style", this._style);
    }
    $fork() {
        if (this._fork) {
            this._observe.cancel();
            this.__fork.style.display = "";
        } else {
            this._observe.observe();
            this.__fork.style.display = "none";
        }
    }
}
customElements.get(`popup-box${mutex}`) || customElements.define(`popup-box${mutex}`, PopupBox);