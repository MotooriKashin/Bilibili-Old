import { ProxyHandler } from "../../lib/proxy_handler";
import { createElements } from "../create_element";
import { htmlVnode, Vdom } from "../html_vnode";
import inputArea from "./input_area.html";
import scrollbar from "../scrollbar.html";
import { mutex } from "../../variable/mutex";


/** input标签属性 */
export interface HTMLInputAttribudeMap {
    /** 文件类型：`type="file"`限定。如：`audio/*` `video/*` `image/*` `MIME_type` */
    accept?: string;
    /** 图片加载时的展示文字，`type="image`限定 */
    alt?: string;
    /** 自动完成输入 */
    autocomplete?: "on" | "off";
    /** 自动焦点 */
    autofocus?: "autofocus";
    /** 自动选中，`type="checkbox" | "radio"`限定 */
    checked?: "checked";
    /** 是否禁用 */
    disabled?: "disabled";
    /** 所属表单节点，以逗号分隔 */
    form?: string;
    /** 表单提交URL，`type="submit" | "image"`限定 */
    formaction?: string;
    /** 表单数据编码，`type="submit" | "image"`限定 */
    formenctypeNew?: string;
    /** 表单提交请求的HTTP方法，`type="submit" | "image"`限定 */
    formmethod?: "GET" | "POST";
    /** 覆盖表单节点的`novalidate`属性 */
    formnovalidate?: "formnovalidate";
    /** 表单处理者，内置值或者表单节点的`framename` */
    formtarget?: "_blank" | "_self" | "_parent" | "_top" | string;
    /** 节点高度：/px，`type="image"`限定 */
    height?: number;
    /** 绑定的<datalist>节点的id */
    list?: string;
    /** 输入上限 */
    max?: number | string;
    /** 输入字符数目上限 */
    maxlength?: number;
    /** 输入下限 */
    min?: number | string;
    /** 多选，`type="file" | "email"`限定 */
    multiple?: "multiple";
    /** 名称 */
    name?: string;
    /** 提示 */
    placeholder?: string;
    /** 只读 */
    readonly?: "readonly";
    /** 禁止空提交 */
    required?: "required";
    /** 节点尺寸，`type="image"`限定 */
    size?: number;
    /** 按钮图片src，`type="image"`限定 */
    src?: string;
    /** 最小单位值 */
    step?: number;
    /** 输入框类型 */
    type?: "button" | "checkbox" | "color" | "date" | "datetime" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week"
    /** 元素的宽度：/px，`type="image"`限定 */
    width?: number;
    /** 校验输入的正则 **字符串形式** */
    pattern?: string;
}
/** 配置数据 */
interface Value {
    /** 输入值 */
    value: string | number;
    /** input元素属性 */
    props: HTMLInputAttribudeMap;
    /** 候选值 */
    candidate: (string | number)[];
    /** 输入回调 */
    change: (v: string | FileList | null) => void;
}
export class InputArea extends HTMLElement {
    /** 输入值 */
    value: string | number;
    /** input元素属性 */
    props: HTMLInputAttribudeMap;
    /** 候选值 */
    candidate: (string | number)[];
    /** 输入框 */
    constructor(obj: Partial<Value> = {}) {
        super();
        const root = this.attachShadow({ mode: "closed" });
        const { value, candidate, props, change } = obj;
        let initing = true;
        // 节点骨架
        root.appendChild(createElements(htmlVnode(inputArea + scrollbar)));
        const [input, ul] = [
            <HTMLInputElement>root.children[0].children[0],
            <HTMLUListElement>root.children[0].children[1]
        ];
        let file = false; // type="file"例外处理
        input.addEventListener("change", () => {
            obj.value = file ? <any>input.files : input.value;
            if (file) {
                !initing && change && change(file ? input.files : input.value);
            }
        });
        // 数据绑定
        Object.defineProperties(obj, {
            value: {
                set: v => {
                    if (file) return;
                    if (this.value === v) return;
                    input.value = v;
                    this.value = v;
                    !initing && change && change(file ? input.files : input.value)
                },
                get: () => file ? input.files : this.value
            },
            props: {
                set: v => {
                    if (this.props === v) return;
                    this.props = v;
                    flushProps();
                },
                get: () => this.props && new Proxy(this.props, new ProxyHandler(flushProps))
            },
            candidate: {
                set: v => {
                    if (this.candidate === v) return;
                    this.candidate = v;
                    flushList();
                },
                get: () => this.candidate && new Proxy(this.candidate, new ProxyHandler(flushList))
            }
        });
        const flushProps = () => Object.entries(<HTMLInputAttribudeMap>obj.props).forEach(d => {
            input.setAttribute(d[0], d[1]);
            if (d[0] === "type") {
                switch (d[1]) {
                    case "file": if (file) break;
                        file = true;
                        ul.setAttribute("style", "display: none;");
                        break;
                    default: if (file) {
                        file = false;
                        ul.removeAttribute("style");
                    }
                }
            }
        });
        let mutex = 0;
        const flushList = () => {
            clearTimeout(mutex);
            mutex = setTimeout(() => {
                ul.replaceChildren(createElements((<(string | number)[]>obj.candidate).reduce((s, d, i, t) => {
                    s.push({
                        tagName: "li",
                        props: { class: "input-list-row" },
                        event: {
                            click: () => {
                                obj.value = d;
                            }
                        },
                        children: [{
                            tagName: "span",
                            text: d
                        }, {
                            tagName: "div",
                            props: { class: "cancel" },
                            event: {
                                click: e => {
                                    t.splice(i, 1);
                                    e.stopPropagation();
                                    e.preventDefault();
                                }
                            }
                        }]
                    })
                    return s;
                }, <Vdom[]>[])));
            });
        }
        this.value = obj.value = value || "";
        this.props = obj.props = props || {};
        this.candidate = obj.candidate = candidate || [];
        initing = false;
    }
}
customElements.get(`input-area${mutex}`) || customElements.define(`input-area${mutex}`, InputArea);