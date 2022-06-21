import { createElements } from "../createElement.js";
import { htmlVnode } from "../htmlVnode.js";
import horizontal from "./horizontal.html";


/** 水平线 */
export class HorizontalLine extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.appendChild(createElements(htmlVnode(horizontal)));
    }
}
customElements.get("horizontal-line") || customElements.define("horizontal-line", HorizontalLine);