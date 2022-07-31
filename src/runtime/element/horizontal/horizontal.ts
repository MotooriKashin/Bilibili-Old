import { mutex } from "../../variable/mutex";
import { createElements } from "../create_element";
import { htmlVnode } from "../html_vnode";
import horizontal from "./horizontal.html";


/** 水平线 */
export class HorizontalLine extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.appendChild(createElements(htmlVnode(horizontal)));
    }
}
customElements.get(`horizontal-line${mutex}`) || customElements.define(`horizontal-line${mutex}`, HorizontalLine);