import { addElement } from "./element";
import { getMetux } from "./mutex";

export class Scrollbar {
    private static mutex = getMetux();
    private static prefix = 'scrollbar-' + Scrollbar.mutex;
    private static style: HTMLStyleElement;
    private static thumb = '#999';
    private static track = '#EEE';
    private static init() {
        this.style || (this.style = addElement('style', undefined), document.head);
        this.style.textContent = `.${this.prefix}[data-${this.mutex}="${this.mutex}"]{
    scrollbar-width: none;
    scrollbar-color: ${this.thumb} ${this.track};
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]:hover {
    scrollbar-width: thin;
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]::-webkit-scrollbar {
    width: 0;
    height: 0;
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: ${this.track};
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${this.thumb};
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]:hover::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]::-webkit-scrollbar:hover {
    width: 7px;
    height: 7px;
}`
    }
    /** 备份原始overflow */
    private overflow: string;
    /**
     * 设置滚动条
     * @param ele 目标节点
     * @param x 是否显示横滚动条
     * @param y 是否显示纵滚动条
     * @param side 复制样式到目标节点旁边，用于默认样式不生效的情况，比如ShadowRoot环境
     */
    constructor(private ele: HTMLElement, private x = true, private y = true, private side = false) {
        Scrollbar.style || Scrollbar.init();
        this.overflow = this.ele.style.overflow;
        side && ele.insertAdjacentElement('afterend', <HTMLElement>Scrollbar.style.cloneNode(true));
        this.flesh();
    }
    /** 滑块颜色 */
    get thumb() {
        return Scrollbar.thumb;
    }
    set thumb(v) {
        Scrollbar.thumb = v;
        Scrollbar.init();
    }
    /** 轨道颜色 */
    get track() {
        return Scrollbar.track;
    }
    set track(v) {
        Scrollbar.track = v;
        Scrollbar.init();
    }
    private flesh() {
        document.contains(Scrollbar.style) || document.head.append(Scrollbar.style);
        this.ele.classList.add(Scrollbar.prefix);
        this.ele.setAttribute(`data-${Scrollbar.mutex}`, Scrollbar.mutex);
        switch (this.suffix()) {
            case '-all': {
                this.ele.style.overflow = 'auto auto';
                break;
            }
            case "-x": {
                this.ele.style.overflow = 'auto hidden';
                break;
            }
            case "-y": {
                this.ele.style.overflow = 'hidden auto';
                break;
            }
            case "-none":
            default: {
                this.ele.style.overflow = this.overflow;
                this.remove();
                break;
            }
        }
    }
    private suffix() {
        if (this.x) {
            return this.y ? '-all' : '-x';
        } else {
            return this.y ? '-y' : '-none';
        }
    }
    private remove() {
        this.ele.classList.remove(Scrollbar.prefix);
        this.ele.removeAttribute(`data-${Scrollbar.mutex}`)
    }
    /**
     * 更新滚动条
     * @param x 是否显示横滚动条
     * @param y 是否显示纵滚动条
     * @param thumb 滑块颜色
     * @param track 轨道颜色
     */
    update(x = true, y = true) {
        this.x = x;
        this.y = y;
        this.flesh();
    }
}