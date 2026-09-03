import { DisplayObject, target } from "./DisplayObject";
import { Graphics } from "./Graphics";

export class Shape extends DisplayObject {
    #svg = this[target].div.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    #graphics = new Graphics(this.#svg);
    /** 指定属于该 Shape 对象的 Graphics 对象，可通过此对象执行矢量绘图命令。 */
    get graphics() {
        return this.#graphics;
    }
}