import { mutex } from "../../variable/mutex";
import { createElements } from "../create_element";
import { htmlVnode } from "../html_vnode";
import pushButton from "./push_button.html";


interface Value {
    /** 按钮标题 */
    button?: string;
    /** 点击回调 */
    func: () => void;
}
export class PushButton extends HTMLElement {
    /** 描述 */
    button: string;
    /** 按钮 */
    constructor(obj: Value) {
        super();
        const root = this.attachShadow({ mode: "closed" });
        const { button, func } = obj;
        // 节点骨架
        root.appendChild(createElements(htmlVnode(pushButton)));
        const node = <HTMLDivElement>root.children[0];
        // 数据绑定
        Reflect.defineProperty(obj, "button", {
            set: v => {
                if (this.button === v) return;
                node.textContent = v;
                this.button = v;
            },
            get: () => this.button
        });
        let timer: number // 过滤短时间重复操作
        node.addEventListener("click", () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func();
            }, 100);
        });
        this.button = obj.button = button || "点击";
    }
}
customElements.get(`push-button${mutex}`) || customElements.define(`push-button${mutex}`, PushButton);