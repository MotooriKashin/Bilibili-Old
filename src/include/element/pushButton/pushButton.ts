interface modules {
    /** 按钮样式 */
    readonly "pushButton.html": string;
}
namespace API {
    interface Value {
        /** 按钮标题 */
        button?: string;
        /** 点击回调 */
        value: () => void;
    }
    export class PushButton extends HTMLElement {
        /** 描述 */
        button: string;
        /** 按钮 */
        constructor(obj: Value) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            const { button, value } = obj;
            // 节点骨架
            root.appendChild(createElements(htmlVnode(getModule("pushButton.html"))));
            const node = <HTMLDivElement>root.children[0];
            // 数据绑定
            Object.defineProperty(obj, "button", {
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
                setTimeout(() => {
                    value();
                }, 100);
            });
            this.button = obj.button = button || "点击";
        }
    }
    customElements.define("push-button", PushButton);
}