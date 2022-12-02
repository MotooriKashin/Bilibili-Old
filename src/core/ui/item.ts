import { CustomElementsInterface } from "../../utils/customelement";
import { userStatus } from "../userstatus";

export class SettingItem extends HTMLDivElement implements CustomElementsInterface {
    private _value = document.createElement('div');
    /**
     * 新建设置项
     * @param id keyof typeof {@link userStatus}
     * @param title 标题
     * @param sub 副标题
     * @param svg 图标
     */
    init(id: string, title: string, sub?: string, svg?: string) {
        this.innerHTML = `<div class="contain2${id ? ` ${id}` : ''}">${svg ? `<div class="icon">${svg}</div>` : ''}
    <div class="label">${title}${sub ? `<div class="sub">${sub}</div>` : ''}</div>
</div>`;
        this._value.className = 'value';
        this.querySelector('.contain2')?.appendChild(this._value);
    }
    /** 添加值 */
    value<T extends Node>(value: T) {
        this._value.appendChild(value);
    }
}
customElements.get(`item-${_MUTEX_}`) || customElements.define(`item-${_MUTEX_}`, SettingItem, { extends: 'div' });