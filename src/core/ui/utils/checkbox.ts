import { CustomElementsInterface } from "../../../utils/customelement";
import html from '../../../html/checkbox.html';

export class CheckBox extends HTMLElement implements CustomElementsInterface {
    private _input: HTMLInputElement;
    private _text: HTMLLabelElement;
    static get observedAttributes() {
        return [
            'label',
            'value'
        ];
    }
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this._input = <HTMLInputElement>root.children[0];
        this._text = <HTMLLabelElement>root.children[1];
        this._input.addEventListener('change', () => {
            this.setAttribute('value', <any>this._input.checked);
            this.dispatchEvent(new Event('change'));
        });
    }
    /** 是否选中 */
    get value() {
        return this.getAttribute('value') === 'true' ? true : false;
    }
    set value(v) {
        v || (v = false);
        this.setAttribute('value', <any>v);
    }
    /** 标签 */
    get label() {
        return this.getAttribute('label');
    }
    set label(v) {
        v || (v = '');
        this.setAttribute('label', v!);
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;
        switch (name) {
            case 'label':
                this._text.textContent = newValue;
                break;
            case 'value':
                this._input.checked = newValue === 'false' ? false : true;
                break;
            default:
                break;
        }
    }
    /** 刷新值 */
    update(value: Value) {
        Object.entries(value).forEach(d => this[<'value'>d[0]] = d[1]);
    }
}
customElements.get(`checkbox-${_MUTEX_}`) || customElements.define(`checkbox-${_MUTEX_}`, CheckBox);

export class CheckBoxs extends HTMLDivElement implements CustomElementsInterface {
    protected $value: string[] = [];
    protected checkboxs: Record<string, CheckBox> = {};
    get value() {
        return this.$value;
    }
    set value(v) {
        v.forEach(d => {
            if (!this.$value.includes(d)) {
                if (this.checkboxs[d]) {
                    this.checkboxs[d].value = true;
                } else {
                    this.update(Object.keys(this.checkboxs).concat(d));
                    this.checkboxs[d].value = true;
                }
            }
        });
        this.$value.forEach(d => {
            v.includes(d) || (this.checkboxs[d].value = false);
        });
        this.$value = [...v];
    }
    update(labels: string[]) {
        labels.forEach(d => {
            if (!this.checkboxs[d]) {
                const checkbox = new CheckBox();
                checkbox.update({ label: d });
                checkbox.addEventListener('change', () => {
                    if (checkbox.value) {
                        this.$value.includes(d) || this.$value.push(d);
                    } else {
                        const i = this.$value.indexOf(d);
                        i >= 0 && this.$value.splice(i, 1);
                    }
                    this.dispatchEvent(new Event('change'));
                });
                this.appendChild(checkbox);
                this.checkboxs[d] = checkbox;
            }
        });
        this.$value.forEach(d => {
            if (!labels.includes(d)) {
                this.checkboxs[d]?.remove();
                const i = this.$value.indexOf(d);
                i >= 0 && this.$value.splice(i, 1);
            }
        })
    }
}
customElements.get(`checkboxs-${_MUTEX_}`) || customElements.define(`checkboxs-${_MUTEX_}`, CheckBoxs, { extends: 'div' });

interface Value {
    /** 是否选中 */
    value?: CheckBox['value'];
    /** 标签 */
    label?: CheckBox['label'];
}
export { Value as ICheckBoxValue }