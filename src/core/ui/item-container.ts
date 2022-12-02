import { CustomElementsInterface } from "../../utils/customelement";
import { SettingItem } from "./item";

export class ItemContainer extends HTMLDivElement implements CustomElementsInterface {
    protected _title: HTMLHeadingElement;
    /** 设置项容器 */
    protected _card: HTMLDivElement;
    constructor() {
        super();
        this.innerHTML = `<div class="contain1">
    <div class="header">
        <h2 class="title"></h2>
    </div>
</div>
<div class="card"></div>`;
        this._title = <HTMLHeadingElement>this.querySelector('.title');
        this._card = <HTMLDivElement>this.querySelector('.card');
    }
    /** 初始化设置项容器 */
    init(title: string) {
        this._title.textContent = title;
    }
    /**
     * 添加设置
     * @param item 设置项
     */
    addSetting(item: SettingItem[]) {
        this._card.append(...item);
    }
}
customElements.get(`item-container-${_MUTEX_}`) || customElements.define(`item-container-${_MUTEX_}`, ItemContainer, { extends: 'div' });