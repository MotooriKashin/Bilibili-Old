import { createElements } from "../createElement.js";
import { htmlVnode } from "../htmlVnode.js";
import floatQuote from "./floatQuote.html";


/** 浮动信息 */
export class FloatQuote extends HTMLElement {
    constructor(node: HTMLDivElement, data: string) {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.appendChild(createElements(htmlVnode(floatQuote)));
        const real = <HTMLDivElement>root.children[0];
        real.children[1].innerHTML = data;
        node.onmouseover = (ev) => {
            document.body.appendChild(this);
            let rect = real.getBoundingClientRect();
            real.style.left = `${node.getBoundingClientRect().x + ev.offsetX}px`;
            real.style.top = `${node.getBoundingClientRect().y + ev.offsetY - rect.height}px`;
            real.style.width = `${Math.sqrt(rect.width * rect.height) * 4 / 3}px`;
        }
        node.onmouseout = () => { try { this.remove() } catch (e) { } };
        real.onmouseout = () => { try { this.remove() } catch (e) { } };
    }
}
customElements.get("float-quote") || customElements.define("float-quote", FloatQuote);