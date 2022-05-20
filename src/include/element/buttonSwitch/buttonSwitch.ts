interface modules {
    /** 滑块样式 */
    readonly "buttonSwitch.html": string;
}
namespace API {
    /** 配置数据 */
    interface Value {
        /** 开关状态 */
        value: boolean;
    }
    export class ButtonSwitch extends HTMLElement {
        /** 开关值 */
        value: boolean;
        /** 滑块开关 */
        constructor(obj: Partial<Value> = {}) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            // 节点骨架
            root.appendChild(createElements(htmlVnode(getModule("buttonSwitch.html"))));
            const [bar, knob, circle] = [
                root.children[0].children[0],
                root.children[0].children[1],
                root.children[0].children[1].children[0]
            ];
            const { value } = obj;
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
                },
                get: () => this.value
            });
            // 事件监听
            this.addEventListener("click", () => {
                obj.value = !this.value;
            });
            // 初始化
            this.value = obj.value = value || false;
        }
    }
    customElements.define("button-switch", ButtonSwitch);
}