import html from './index.html' with {type: 'text'};
import style from './index.css' with {type: 'css'}

export class Footer extends HTMLElement {
    static get is() {
        return 'bili-footer';
    }
    #shadowRoot = this.attachShadow({ mode: 'closed' })
    constructor() {
        super();

        // 初始化页面结构
        this.#shadowRoot.innerHTML = html;
        this.#shadowRoot.adoptedStyleSheets.push(style);
    }
}
customElements.define(Footer.is, Footer);