import { mutex } from "../../variable/mutex";
import { createElements } from "../create_element";
import { htmlVnode } from "../html_vnode";
import floatQuote from "./float_quote.html";


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
customElements.get(`float-quote${mutex}`) || customElements.define(`float-quote${mutex}`, FloatQuote);