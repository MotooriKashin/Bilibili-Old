import { target } from "./DisplayObject";
import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { Graphics } from "./Graphics";

/**
 * 基本显示列表构造块：一个可显示图形并且也可包含子项的显示列表节点。  
 * Sprite 尤其是基于 Sprite 的 CommentCanvas 在代码弹幕中可能纯粹是一个不带画布功能的父元素，所以这里注释掉了画布相关实现
 */
export class Sprite extends DisplayObjectContainer {
    #svg = this[target].div.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    #graphics = new Graphics(this.#svg);
    /** 指定属于该 Shape 对象的 Graphics 对象，可通过此对象执行矢量绘图命令。 */
    get graphics() {
        return this.#graphics;
    }
}