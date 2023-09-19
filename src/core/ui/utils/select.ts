import { CustomElementsInterface } from "../../../utils/customelement";
import html from '../../../html/select.html';
import { Scrollbar } from "../../../utils/scrollbar";

export class SelectMenu extends HTMLElement implements CustomElementsInterface {
    private _text: HTMLSpanElement;
    private _list: HTMLUListElement;
    private $value: string = '';
    private $candidate: string[] = [];
    private $styles: Record<string, string> = {};
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this._text = <HTMLSpanElement>root.children[0].children[0].children[0];
        this._list = <HTMLUListElement>root.children[0].children[2];

        new Scrollbar(this._list, false, true, true);
    }
    /** 当前值 */
    get value() {
        return this.$value;
    }
    set value(v) {
        if (this.$value === v) return;
        this.$value = v || '';
        this._text.textContent = v || '';
        v && this.$styles[v] && this._text.setAttribute('style', this.$styles[v]);
    }
    /** 候选值 */
    get candidate() {
        return this.$candidate;
    }
    set candidate(v) {
        this.$candidate = v;
        this._list.replaceChildren(...v.map((d, i, t) => {
            const li = document.createElement('li');
            li.className = 'selectmenu-list-row';
            li.addEventListener('click', e => {
                this.value = d;
                this.dispatchEvent(new Event('change'));
                e.stopPropagation();
            });
            const span = document.createElement('span');
            span.textContent = d;
            this.$styles[d] && span.setAttribute('style', this.$styles[d]);
            li.appendChild(span);
            return li;
        }))
    }
    /** 候选值对应的行内应该 格式 => 候选值: 样式 */
    get styles() {
        return this.$styles;
    }
    set styles(v) {
        this.$styles = v;
        this.candidate = this.candidate;
    }
    /** 刷新值 */
    update(value: Value) {
        Object.entries(value).forEach(d => this[<'value'>d[0]] = d[1]);
    }
}
customElements.get(`select-${_MUTEX_}`) || customElements.define(`select-${_MUTEX_}`, SelectMenu);

interface Value {
    /** 当前值 */
    value?: SelectMenu['value'];
    /** 候选值 */
    candidate?: SelectMenu['candidate'];
    /** 候选值对应的行内应该 格式 => 候选值: 样式 */
    styles?: SelectMenu['styles'];
}
export { Value as ISelectMenuValue }