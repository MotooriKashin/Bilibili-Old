import { CustomElementsInterface } from "../../../utils/customelement";
import html from '../../../html/switch.html';

export class SwitchButton extends HTMLElement implements CustomElementsInterface {
    private _bar: HTMLSpanElement;
    private _knob: HTMLSpanElement;
    private _circle: HTMLElement;
    private $value = false;
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this._bar = <HTMLSpanElement>root.children[0].children[0];
        this._knob = <HTMLSpanElement>root.children[0].children[1];
        this._circle = <HTMLElement>root.children[0].children[1].children[0];

        root.children[0].addEventListener('click', e => {
            this.value = !this.$value;
            e.stopPropagation();
            this.dispatchEvent(new Event('change'));
        });
    }
    get value() {
        return this.$value;
    }
    set value(v) {
        if (this.$value === v) return;
        if (v) {
            this._bar.setAttribute("checked", "checked");
            this._knob.setAttribute("checked", "checked");
            this._circle.setAttribute("checked", "checked");
        } else {
            this._bar.removeAttribute("checked");
            this._knob.removeAttribute("checked");
            this._circle.removeAttribute("checked");
        }
        this.$value = v;
    }
    /** 刷新值 */
    update(value?: boolean) {
        value === undefined || (this.value = value);
        return this;
    }
}
customElements.get(`switch-${_MUTEX_}`) || customElements.define(`switch-${_MUTEX_}`, SwitchButton);