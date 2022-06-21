import { createElements } from "../createElement.js";
import { htmlVnode } from "../htmlVnode.js";
import buttonSwitch from "./buttonSwitch.html";

/** 配置数据 */
interface Value {
    /** 开关状态 */
    value: boolean;
    /** 回调 */
    callback?: (value: boolean) => void
}
export class ButtonSwitch extends HTMLElement {
    /** 开关值 */
    value: boolean;
    /** 滑块开关 */
    constructor(obj: Partial<Value> = {}) {
        super();
        const root = this.attachShadow({ mode: "closed" });
        // 节点骨架
        root.appendChild(createElements(htmlVnode(buttonSwitch)));
        const [bar, knob, circle] = [
            root.children[0].children[0],
            root.children[0].children[1],
            root.children[0].children[1].children[0]
        ];
        const { value, callback } = obj;
        let initing = true;
        // 数据绑定
        Object.defineProperty(obj, "value", {
            set: v => {
                if (this.value === v) return;
                if (v) {
                    bar.setAttribute("checked", "checked");
                    knob.setAttribute("checked", "checked");
                    circle.setAttribute("checked", "checked");
                } else {
                    bar.removeAttribute("checked");
                    knob.removeAttribute("checked");
                    circle.removeAttribute("checked");
                }
                this.value = v;
                !initing && callback && callback(v);
            },
            get: () => this.value
        });
        // 事件监听
        this.addEventListener("click", () => {
            obj.value = !this.value;
        });
        // 初始化
        this.value = obj.value = value || false;
        initing = false;
    }
}
customElements.get("button-switch") || customElements.define("button-switch", ButtonSwitch);