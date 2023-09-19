import { CustomElementsInterface } from "../../../utils/customelement";
import html from '../../../html/slider.html';

/**
 * 节点相对文档的偏移
 * @param node 目标节点
 * @returns 偏移量
 */
export function offset(node: HTMLElement) {
    const result = {
        top: 0,
        left: 0
    };
    const onwer = node.ownerDocument;
    if (node === onwer.body) {
        result.top = node.offsetTop;
        result.left = node.offsetLeft;
    } else {
        let rect: DOMRect = <any>undefined;
        try {
            rect = node.getBoundingClientRect();
        } catch { }
        if (!rect || !onwer.documentElement.contains(node)) {
            rect && (result.top = rect.top, result.left = rect.left);
            return result;
        }
        result.top = rect.top + onwer.body.scrollTop - onwer.documentElement.clientTop;
        result.left = rect.left + onwer.body.scrollLeft - onwer.documentElement.clientLeft;
    }
    return result;
}
export class SliderBlock extends HTMLElement implements CustomElementsInterface {
    private _handle: HTMLDivElement;
    private _progress: HTMLDivElement;
    private _hinter: HTMLDivElement;
    private _wrp: HTMLDivElement;
    private $value = 0;
    private $min = 0;
    private $max = 100;
    private $precision = 100;
    private $hint = true;
    private $solid = false;
    private $vertical = false;
    private showChange: () => void;
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this._handle = <HTMLDivElement>root.children[0].children[0].children[0].children[0].children[0];
        this._progress = <HTMLDivElement>root.children[0].children[0].children[0].children[0].children[1];
        this._hinter = <HTMLDivElement>root.children[0].children[0].children[0].children[0].children[0].children[0];
        this._wrp = <HTMLDivElement>root.children[0].children[0].children[0];

        /**
         * 鼠标回调
         * @param e 鼠标事件
         */
        const mouseLinster = (e: MouseEvent) => {
            const { pageX, pageY } = e;
            // 偏移量
            const offsetX = this.$vertical
                ? pageY - offset(this._wrp).top - 7
                : pageX - offset(this._wrp).left - 7;
            const allX = this._wrp.offsetWidth - 14; // 滑轨长度
            const pv = (0 > offsetX ? 0 : offsetX > allX ? allX : offsetX) / allX; // 偏移率
            this.value = (this.$max - this.$min) * Math.round(pv * this.$precision) / this.$precision + this.$min; // 精细化值
            this.dispatchEvent(new Event('change'));
        }
        this.addEventListener("click", mouseLinster); // 点击滑块条
        /** 移除移动事件监听 */
        const mouseClear = () => {
            window.removeEventListener("mousemove", mouseLinster);
            window.removeEventListener("mouseup", mouseClear);
        }
        this._handle.addEventListener("mousedown", () => {
            window.addEventListener("mousemove", mouseLinster); // 鼠标移动
            window.addEventListener("mouseup", mouseClear);
        });
        // 鼠标焦点显示
        this._handle.addEventListener("mouseover", () => this.showChange())
        /** 刷新DOM */
        let nHint = 0; // 隐藏hint延时
        this.showChange = () => {
            const pv = (this.$value - this.$min) / (this.$max - this.$min);
            this._handle.style.cssText = `left: ${(pv * (this._wrp.offsetWidth - 14) + 7) / this._wrp.offsetWidth * 100}%;`;
            this._progress.style.cssText = `width: ${pv * 100}%;`;
            if (this.$hint) {
                this._hinter.textContent = <string><unknown>this.$value;
                if (this._hinter.style.display !== "block") this._hinter.style.display = "block";
                if (this.$solid) return;
                clearTimeout(nHint);
                nHint = setTimeout(() => this._hinter.style.display = "", 300);
            };
        }
    }
    /** 默认值 */
    get value() {
        return this.$value;
    }
    set value(v) {
        if (this.$vertical) v = this.$max - v + this.$min;
        // 精细化输入值
        v = (this.$max - this.$min) * Math.round(((v - this.$min) / (this.$max - this.$min) * this.$precision)) / this.$precision + this.$min;
        if (v === this.$value) return;
        this.$value = v;
        this.showChange();
    }
    /** 最小值 */
    get min() {
        return this.$min;
    }
    set min(v) {
        if (v === this.$min || v >= this.$max) return;
        this.$min = v;
        if (v > this.$value) this.value = v; // 下限超过当前值
        this.showChange();
    }
    /** 最大值 */
    get max() {
        return this.$max;
    }
    set max(v) {
        if (v === this.$max || v <= this.$min) return;
        this.$max = v;
        if (v < this.$value) this.value = v; // 上限超过当前值
        this.showChange();
    }
    /** 刻度数 */
    get precision() {
        return this.$precision;
    }
    set precision(v) {
        if (v === this.$precision) return;
        this.$precision = v;
        this.value = this.$value; // 精细度变动，修正当前值
    }
    /** 提示信息 */
    get hint() {
        return this.$hint;
    }
    set hint(v) {
        if (v === this.$hint) return;
        this.$hint = v;
    }
    /** 固化提示 */
    get solid() {
        return this.$solid;
    }
    set solid(v) {
        if (v === this.$solid) return;
        this.$solid = v;
        this.showChange();
    }
    /** 垂直 */
    get vertical() {
        return this.$vertical;
    }
    set vertical(v) {
        if (v === this.$vertical) return;
        this.$vertical = v;
        this.style.transform = v ? 'rotate(-90deg)' : '';
    }
    connectedCallback(): void {
        this.showChange();
    }
    adoptedCallback(): void {
        this.showChange();
    }
    /** 刷新值 */
    update(value: Value) {
        Object.entries(value).forEach(d => this[<'value'>d[0]] = d[1]);
    }
}
customElements.get(`slider-${_MUTEX_}`) || customElements.define(`slider-${_MUTEX_}`, SliderBlock);

interface Value {
    /** 默认值 */
    value?: number;
    /** 最小值 */
    min?: number;
    /** 最大值 */
    max?: number;
    /** 刻度数 */
    precision?: number;
    /** 提示信息 */
    hint?: boolean;
    /** 固化提示 */
    solid?: boolean;
    /** 垂直 */
    vertical?: boolean;
}
export { Value as ISliderBlockValue }