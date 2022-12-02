import { CustomElementsInterface } from "../../../utils/customelement";
import html from '../../../html/input.html';

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
interface Value {
    /** 输入框值 */
    value?: InputArea['value'];
    /** input标签属性 */
    prop?: InputArea['prop'];
    /** 候选值 */
    candidate?: InputArea['candidate'];
}
export class InputArea extends HTMLElement implements CustomElementsInterface {
    private _input: HTMLInputElement;
    private _ul: HTMLUListElement;
    private $prop: HTMLInputAttribudeMap = {};
    private $value: string | FileList = '';
    private $candidate: string[] = [];
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this._input = <HTMLInputElement>root.children[0].children[0];
        this._ul = <HTMLUListElement>root.children[0].children[1];
        this._input.addEventListener('change', () => {
            this.$value = this.$prop.type === 'file' ? this._input.files! : this._input.value;
            this.dispatchEvent(new Event('change'));
        });
    }
    /** input标签属性 */
    get prop() {
        return this.$prop;
    }
    set prop(v) {
        this.$prop = v;
        Object.entries(v).forEach(d => this._input.setAttribute(...d));
    }
    /** 输入框值 */
    get value() {
        return this.$value;
    }
    set value(v) {
        if (this.$value === v) return;
        this.$value = v || '';
        this._input.value = <string>this.$value;
    }
    /** 候选值 */
    get candidate() {
        return this.$candidate;
    }
    set candidate(v) {
        this.$candidate = v;
        this._ul.replaceChildren(...v.map((d, i, t) => {
            const li = document.createElement('li');
            li.className = 'input-list-row';
            li.addEventListener('click', e => {
                this.value = d;
                e.stopPropagation();
                this.dispatchEvent(new Event('change'));
            });
            const span = document.createElement('span');
            span.textContent = d;
            const div = document.createElement('div');
            div.className = 'cancel';
            div.addEventListener('click', e => {
                t.splice(i, 1);
                li.remove();
                e.stopPropagation();
            });
            li.append(span, div);
            return li;
        }))
    }
    /** 刷新值 */
    update(value: Value) {
        Object.entries(value).forEach(d => this[<'value'>d[0]] = d[1]);
    }
}
customElements.get(`input-${_MUTEX_}`) || customElements.define(`input-${_MUTEX_}`, InputArea);

export { Value as IInputAreaValue }