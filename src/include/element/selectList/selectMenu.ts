interface modules {
    /** 下拉节点 */
    readonly "selectMenu.html": string;
}
namespace API {
    /** 配置数据 */
    interface Value {
        /** 当前值 */
        value: string | number;
        /** 候选值 */
        candidate: (string | number)[];
        /** 候选值样式 */
        styles: Record<string | number, string>;
    }
    export class SelectMenu extends HTMLElement {
        /** 当前值 */
        value: string | number;
        /** 候选值 */
        candidate: (string | number)[];
        /** 候选值样式 */
        styles: Record<string | number, string>;
        /** 下拉列表 */
        constructor(obj: Partial<Value> = {}) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            const { value, candidate, styles } = obj;
            // 节点骨架
            root.appendChild(createElements(htmlVnode(getModule("selectMenu.html") + getModule("scrollbar.html"))));
            const [txt, list] = [
                <HTMLSpanElement>root.children[0].children[0].children[0],
                <HTMLUListElement>root.children[0].children[2]
            ];
            // 数据绑定
            Object.defineProperties(obj, {
                value: {
                    set: v => {
                        if (this.value === v) return;
                        txt.textContent = v;
                        this.value = v;
                        this.styles && this.styles[v] ? txt.setAttribute("style", this.styles[v]) : txt.removeAttribute("style");
                    },
                    get: () => this.value
                },
                candidate: {
                    set: v => {
                        if (this.candidate === v) return;
                        this.candidate = v;
                        flushList();
                    },
                    get: () => new Proxy(this.candidate, new ProxyHandler(flushList))
                },
                styles: {
                    set: v => {
                        if (this.styles === v) return;
                        this.styles = v;
                        flushList();
                    },
                    get: () => new Proxy(this.styles, new ProxyHandler(flushList))
                }
            });
            /** 刷新候选列表 */
            let mutex = 0;
            const flushList = () => {
                clearTimeout(mutex);
                setTimeout(() => {
                    list.replaceChildren(createElements((<(string | number)[]>obj.candidate).reduce((s, d) => {
                        s.push({
                            tagName: "li",
                            props: { class: "selectmenu-list-row" },
                            children: [{
                                tagName: "span",
                                text: d,
                                props: this.styles && this.styles[d]
                                    ? { style: this.styles[d] }
                                    : undefined
                            }],
                            event: {
                                click: () => {
                                    obj.value = d;
                                }
                            }
                        })
                        return s;
                    }, <Vdom[]>[])))
                });
            }
            // 初始化
            this.styles = obj.styles = styles || {};
            this.candidate = obj.candidate = candidate || [];
            this.value = obj.value = value || "";
        }
    }
    customElements.define("select-menu", SelectMenu);
}