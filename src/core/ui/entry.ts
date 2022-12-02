import { CustomElementsInterface } from "../../utils/customelement";
import html from '../../html/ui-entry.html';
import { svg } from "../../utils/svg";

/** 设置入口样式 */
export const UiEntryType: 'new' | 'old' = 'new';
export class BilioldEntry extends HTMLElement implements CustomElementsInterface {
    /** 旧版按钮 */
    protected stage: HTMLDivElement;
    /** 新版按钮 */
    protected gear: HTMLDivElement;
    /** 实际节点 */
    protected root: ShadowRoot;
    /** 实际根节点 */
    static get observedAttributes() {
        return [
            'type'
        ];
    }
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        this.root.innerHTML = html;
        this.stage = <HTMLDivElement>this.root.children[0];
        this.gear = <HTMLDivElement>this.root.children[1];
        this.gear.innerHTML = svg.gear;
        this.stage.remove();
        this.gear.remove();
        this.gear.addEventListener("mouseover", () => this.gear.style.opacity = "0.8");
        this.gear.addEventListener("mouseout", () => this.gear.style.opacity = "0");
    }
    get type() {
        return this.getAttribute('type')!
    }
    set type(v) {
        this.setAttribute('type', v);
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;
        switch (name) {
            case 'type':
                if (newValue === 'old') {
                    this.root.contains(this.gear) && this.gear.remove();
                    this.root.contains(this.stage) || this.root.appendChild(this.stage);
                } else {
                    this.root.contains(this.stage) && this.stage.remove();
                    if (!this.root.contains(this.gear)) {
                        this.root.appendChild(this.gear);
                        setTimeout(() => {
                            this.gear.style.opacity = "0";
                        }, 2e3);
                    }
                }
                break;
            default:
                break;
        }
    }
}
customElements.get("biliold-entry-" + _MUTEX_) || customElements.define("bilibili-entry-" + _MUTEX_, BilioldEntry);