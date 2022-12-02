import { CustomElementsInterface } from "../../../utils/customelement";
import html from '../../../html/popupbox.html';
import { svg } from "../../../utils/svg";

/** 对节点添加点击事件监听，点击节点意外的地方自动移除改节点。注意：需要主动调用`enable`方法开始监听 */
export class ClickOutRemove {
    /** 已启用监听 */
    private enabled = false;
    constructor(private target: HTMLElement) {
        // 阻止事件冒泡
        target.addEventListener("click", e => e.stopPropagation());
    }
    /** 移除节点 */
    private remove = () => {
        this.target.remove();
        // document.removeEventListener("click", this.remove);
    }
    /** 停止监听 */
    disable = () => {
        if (this.enabled) {
            document.removeEventListener("click", this.remove);
            this.enabled = false;
        }
        return this;
    }
    /** 开始监听 */
    enable = () => {
        this.enabled || setTimeout(() => {
            document.addEventListener("click", this.remove, { once: true });
            this.enabled = true
        }, 100);
        return this;
    }
}
export class PopupBox extends HTMLElement implements CustomElementsInterface {
    private _contain: HTMLDivElement;
    private _fork: HTMLDivElement;
    private clickOutRemove: ClickOutRemove;
    private $fork = true;
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this._contain = <HTMLDivElement>root.children[0].children[0];
        this._fork = <HTMLDivElement>root.children[0].children[1];
        this._fork.innerHTML = svg.fork;
        this._fork.addEventListener("click", () => this.remove());
        this.clickOutRemove = new ClickOutRemove(this);
        document.body.appendChild(this);
    }
    append(...nodes: (string | Node)[]): void {
        this._contain.append(...nodes);
    }
    appendChild<T extends Node>(node: T): T {
        this._contain.appendChild(node);
        return node;
    }
    replaceChildren(...nodes: (string | Node)[]): void {
        this._contain.replaceChildren(...nodes)
    }
    setAttribute(qualifiedName: string, value: string): void {
        this._contain.setAttribute(qualifiedName, value);
    }
    getAttribute(qualifiedName: string): string | null {
        return this._contain.getAttribute(qualifiedName);
    }
    get style() {
        return this._contain.style;
    }
    get innerHTML() {
        return this._contain.innerHTML;
    }
    set innerHTML(v) {
        this._contain.innerHTML = v;
    }
    /** 设置是否显示关闭按钮，不显示则点击节点外部自动关闭 */
    get fork() {
        return this.$fork;
    }
    set fork(v) {
        this.$fork = v;
        this._fork.style.display = v ? '' : 'none';
        if (v) {
            this.clickOutRemove.disable();
        } else {
            this.clickOutRemove.enable();
        }
    }
}
customElements.get(`popupbox-${_MUTEX_}`) || customElements.define(`popupbox-${_MUTEX_}`, PopupBox);