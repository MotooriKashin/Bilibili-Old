import { CustomElementsInterface } from "../../../utils/customelement";
import html from '../../../html/button.html';

export class PushButton extends HTMLElement implements CustomElementsInterface {
    private _button: HTMLDivElement;
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this._button = <HTMLDivElement>root.querySelector('.button');
        this._button.addEventListener('click', e => {
            e.stopPropagation();
            this.dispatchEvent(new Event('change'));
        });
    }
    set text(v: string) {
        this._button.textContent = v;
    }
}
customElements.get(`button-${_MUTEX_}`) || customElements.define(`button-${_MUTEX_}`, PushButton);