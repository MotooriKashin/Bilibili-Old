interface modules {
    readonly "horizontal.html": string;
}
namespace API {
    /** 水平线 */
    export class HorizontalLine extends HTMLElement {
        constructor() {
            super();
            const root = this.attachShadow({ mode: "closed" });
            root.appendChild(createElements(htmlVnode(getModule("horizontal.html"))));
        }
    }
    customElements.define("horizontal-line", HorizontalLine);
}