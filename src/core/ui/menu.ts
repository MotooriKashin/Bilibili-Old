import { CustomElementsInterface } from "../../utils/customelement";
import { isArray } from "../../utils/typeof";
import { SettingItem } from "./item";
import { ItemContainer } from "./item-container";

export class Menuitem extends HTMLDivElement implements CustomElementsInterface {
    container: ItemContainer[] = [new ItemContainer()];
    constructor() {
        super();
        this.addEventListener('click', () => {
            this.parentElement?.querySelector('.selected')?.classList.remove('selected');
            this.classList.add('selected');
            this.show();
        });
    }
    /**
     * 初始化菜单项
     * @param name 标题
     * @param svg 图标
     * @returns 默认设置项容器
     */
    init(name: string, svg?: string) {
        this.className = 'menuitem';
        this.innerHTML = (svg ? `<div class="icon">${svg}</div>` : '') + name;
        this.container[0].init(name);
        return this.container[0];
    }
    /**
     * 添加设置分组
     * @param name 分组名称
     * @returns 分组设置项容器
     */
    addCard(name: string) {
        const con = new ItemContainer();
        con.init(name);
        this.container.push(con);
        return con;
    }
    /**
     * 添加设置项到容器
     * @param item 设置项
     * @param i 容器序号
     */
    addSetting(item: SettingItem[] | SettingItem, i: number = 0) {
        isArray(item) || (item = [item]);
        item.forEach(d => {
            d.addEventListener('show', e => {
                Promise.resolve(this.click()).then(() => {
                    d.scrollIntoView({ behavior: "smooth", block: 'start' });
                    e.stopPropagation();
                })
            });
        });
        i = Math.min(this.container.length - 1, i);
        this.container[i].addSetting(item);
    }
    /** 显示容器中的设置 */
    show() {
        return this.container;
    }
}
customElements.get(`menuitem-${_MUTEX_}`) || customElements.define(`menuitem-${_MUTEX_}`, Menuitem, { extends: 'div' });