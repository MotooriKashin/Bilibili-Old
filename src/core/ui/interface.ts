import { CustomElementsInterface } from "../../utils/customelement";
import html from '../../html/ui-interface.html';
import { svg } from "../../utils/svg";
import { Menuitem } from "./menu";

export class BiliOldInterface extends HTMLElement implements CustomElementsInterface {
    /** 跟节点 */
    protected _box: HTMLDivElement;
    /** 标题栏 */
    protected _tool: HTMLDivElement;
    /** 关闭按钮 */
    protected _close: HTMLDivElement;
    /** 菜单栏 */
    protected _menu: HTMLDivElement;
    /** 项目栏 */
    _item: HTMLDivElement;
    /** 显示设置 */
    protected showing = false;
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this._box = <HTMLDivElement>root.children[0];
        this._tool = <HTMLDivElement>root.children[0].children[0];
        this._close = <HTMLDivElement>root.children[0].children[0].children[0];
        this._menu = <HTMLDivElement>root.children[0].children[1].children[0].children[0];
        this._item = <HTMLDivElement>root.children[0].children[1].children[0].children[1];

        this._close.innerHTML = svg.fork;
        this._close.addEventListener("click", () => this.hide());
    }
    show() {
        document.body.contains(this) || document.body.appendChild(this);
        this._box.style.display = 'block';
        this.showing = true;
    }
    hide() {
        this._box.style.display = '';
        this.showing = false;
    }
    addMenu(menu: Menuitem) {
        this._menu.appendChild(menu);
        const sets = menu.show();
        // 修改显示函数
        menu.show = () => {
            this._item.replaceChildren(...sets);
            return sets;
        }
    }
}
customElements.get("bili-old") || customElements.define("bili-old", BiliOldInterface);