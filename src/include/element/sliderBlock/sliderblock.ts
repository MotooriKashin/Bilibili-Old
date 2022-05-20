interface modules {
    /** 滑动条样式 */
    readonly "sliderBlcok.html": string;
}
namespace API {
    /** 配置数据 */
    interface Value {
        /** 默认值 */
        value: number;
        /** 最小值 */
        min: number;
        /** 最大值 */
        max: number;
        /** 刻度数 */
        precision: number;
        /** 提示信息 */
        hint: boolean;
        /** 固化提示 */
        solid: boolean;
        /** 垂直 */
        vertical: boolean;
    }
    export class SliderBlock extends HTMLElement {
        /** 当前值 */
        value: number;
        /** 下限 */
        min: number;
        /** 上限 */
        max: number;
        /** 精细度 */
        precision: number;
        /** 是否在变动时提示当前值 */
        hint: boolean;
        /** 固化提示 */
        solid: boolean;
        /** 刷新节点显示 */
        showChange: () => void;
        /** 垂直 */
        vertical: boolean;
        /** 滑动条 */
        constructor(obj: Partial<Value> = {}) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            const { value, min, max, precision, hint, solid, vertical } = obj;
            // 节点骨架
            root.appendChild(createElements(htmlVnode(getModule("sliderBlcok.html"))));
            const [handle, progress, hinter, wrp] = [
                <HTMLDivElement>root.children[0].children[0].children[0].children[0].children[0],
                <HTMLDivElement>root.children[0].children[0].children[0].children[0].children[1],
                <HTMLDivElement>root.children[0].children[0].children[0].children[0].children[0].children[0],
                <HTMLDivElement>root.children[0].children[0].children[0]
            ];
            /**
             * 鼠标回调
             * @param e 鼠标事件
             */
            const mouseLinster = (e: MouseEvent) => {
                const { pageX, pageY } = e;
                // 偏移量
                const offsetX = this.vertical
                    ? pageY - offset(wrp).top - 7
                    : pageX - offset(wrp).left - 7;
                const allX = wrp.offsetWidth - 14; // 滑轨长度
                const pv = (0 > offsetX ? 0 : offsetX > allX ? allX : offsetX) / allX; // 偏移率
                obj.value = (this.max - this.min) * Math.round(pv * this.precision) / this.precision + this.min; // 精细化值
            }
            this.addEventListener("click", mouseLinster); // 点击滑块条
            /** 移除移动事件监听 */
            const mouseClear = () => {
                window.removeEventListener("mousemove", mouseLinster);
                window.removeEventListener("mouseup", mouseClear);
            }
            handle.addEventListener("mousedown", () => {
                window.addEventListener("mousemove", mouseLinster); // 鼠标移动
                window.addEventListener("mouseup", mouseClear);
            });
            // 鼠标焦点显示
            handle.addEventListener("mouseover", () => this.showChange())
            /** 刷新DOM */
            let nHint = 0; // 隐藏hint延时
            this.showChange = () => {
                const pv = (this.value - this.min) / (this.max - this.min) * 100;
                handle.style.cssText = `left: ${((wrp.offsetWidth - 14) * (this.value - this.min) / (this.max - this.min) + 7) / wrp.offsetWidth * 100}%;`;
                progress.style.cssText = `width: ${pv}%;`;
                if (this.hint) {
                    hinter.textContent = <string><unknown>this.value;
                    if (hinter.style.display !== "block") hinter.style.display = "block";
                    if (this.solid) return;
                    clearTimeout(nHint);
                    nHint = setTimeout(() => hinter.style.display = "", 300);
                };
            }
            Object.defineProperties(obj, {
                value: {
                    get: () => this.value,
                    set: v => {
                        if (this.vertical) v = this.max - v + this.min;
                        // 精细化输入值
                        v = (this.max - this.min) * Math.round(((v - this.min) / (this.max - this.min) * this.precision)) / this.precision + this.min;
                        if (v === this.value) return;
                        this.value = v;
                        this.showChange();
                    }
                },
                min: {
                    get: () => this.min,
                    set: v => {
                        if (v === this.min || v >= this.max) return;
                        this.min = v;
                        if (v > this.value) obj.value = v; // 下限超过当前值
                        this.showChange();
                    }
                },
                max: {
                    get: () => this.max,
                    set: v => {
                        if (v === this.max || v <= this.min) return;
                        this.max = v;
                        if (v < this.value) obj.value = v; // 上限超过当前值
                        this.showChange();
                    }
                },
                precision: {
                    get: () => this.precision,
                    set: v => {
                        if (v === this.precision) return;
                        this.precision = v;
                        obj.value = obj.value; // 精细度变动，修正当前值
                    }
                },
                hint: {
                    get: () => this.hint,
                    set: v => {
                        if (v === this.hint) return;
                        this.hint = v;
                    }
                },
                solid: {
                    get: () => this.solid,
                    set: v => {
                        if (v === this.solid) return;
                        this.solid = v;
                        this.showChange();
                    }
                },
                vertical: {
                    get: () => this.vertical,
                    set: v => {
                        if (v === this.vertical) return;
                        this.vertical = v;
                        this.style.transform = v ? 'rotate(-90deg)' : '';
                    }
                }
            })
            // 初始化
            this.value = obj.value = value || 0;
            this.min = obj.min = min || 0;
            this.max = obj.max = max || 100;
            this.precision = obj.precision = precision || 100;
            this.hint = obj.hint = hint || true;
            this.solid = obj.solid = solid || false;
            this.vertical = obj.solid = vertical || false;
        }
        /** 内置接口。当 custom element首次被插入文档DOM时，被调用。 */
        connectedCallback() {
            // 涉及元素像素的数据只在DOM中才获取得到
            setTimeout(() => this.showChange());
        }
    }
    customElements.define("slider-block", SliderBlock);
}