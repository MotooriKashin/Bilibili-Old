import type { DanmakuElem } from '..';
import { hex8 } from '../../../../../../utils/color';
import style from './index.css' with {type: 'css'};
import { parse } from './parse';

export class Mode7 extends HTMLElement {
    static get is() {
        return 'mode-7';
    }
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    constructor(
        parent: ParentNode,
        private dm: IMode7,
        delay = 0,
    ) {
        super();

        this.#shadowRoot.adoptedStyleSheets.push(style);

        const { fontsize, color, mode7 } = dm;
        this.dataset['delay'] = <any>delay;
        this.dataset['fontsize'] = <any>fontsize;
        this.dataset['color'] = hex8(color);

        if (!mode7) {
            // 只解码一次
            parse(dm);
        }
        if (dm.mode7) {
            const { text, stroked, family, zRotate, yRotate, opacity: [startOpacity = 1, endOpacity = 1], duration, aTime, aDelay, linearSpeedUp, path, startX, startY, endX, endY } = dm.mode7;

            const pre = document.createElement('pre');
            this.#shadowRoot.append(pre);

            pre.textContent = text;
            stroked && this.classList.add('stroked');
            family && (this.dataset['family'] = family);
            // 旋转部分
            pre.dataset['zRotate'] = <any>zRotate;
            pre.dataset['yRotate'] = <any>yRotate;
            // 透明度
            this.dataset['startOpacity'] = <any>startOpacity;
            this.dataset['endOpacity'] = <any>endOpacity;
            // 动画参数
            this.dataset['duration'] = <any>duration;
            this.dataset['aTime'] = <any>aTime;
            this.dataset['aDelay'] = <any>aDelay;
            linearSpeedUp && (this.dataset['linearSpeedUp'] = 'ease-in');
            // 动画
            if (typeof path === 'string') {
                const paths = path.slice(1).toUpperCase().split('L').map(d => <[number, number]>d.split(',').map(d => Number(d)));
                this.style.offsetPath = `shape(${paths.map(([x, y], i) => {
                    switch (i) {
                        case 0: return `from ${x}px ${y}px`;
                        default: return `line to ${x}px ${y}px`;
                    }
                }).join(',')})`;
            } else {
                this.style.offsetPath = `shape(from ${0 < startX && 1 > startX ? `${startX * 100}cqi` : `${startX}px`} ${0 < startY && 1 > startY ? `${startY * 100}cqb` : `${startY}px`}, line to ${0 < endX && 1 > endX ? `${endX * 100}cqi` : `${endX}px`} ${0 < endY && 1 > endY ? `${endY * 100}cqb` : `${endY}px`})`;
            }

            // 监听弹幕运动状态
            this.when('animationend').filter(d => d.animationName === 'mode7-opacity').take(1).subscribe({ next: () => { this.remove(); } });

            parent.append(this);

        }
    }
    connectedCallback() {
        this.dm.$rendered = true;
    }
    disconnectedCallback() {
        delete this.dm.$rendered;
    }
}
customElements.define(Mode7.is, Mode7);

interface IMode7 extends DanmakuElem {
    mode7?: {
        /** 初始行向坐标 */
        startX: number;
        /** 初始块向坐标 */
        startY: number;
        /** 透明度 [初始值, 最终值] */
        opacity: [number, number];
        /** 弹幕生存时间 */
        duration: number;
        /** 弹幕文本 */
        text: string;
        /** z轴旋转角度 */
        zRotate: number;
        /** y轴旋转角度 */
        yRotate: number;
        /** 最终行向坐标 */
        endX: number;
        /** 最终块向坐标 */
        endY: number;
        /** 运行时间/ms */
        aTime: number;
        /** 运动延迟时间/ms */
        aDelay: number;
        /** 弹幕描边 */
        stroked: boolean;
        /** 弹幕字体 */
        family?: string;
        /** 线性加速 */
        linearSpeedUp: boolean;
        /** 路径追踪 */
        path?: string;
    }
}