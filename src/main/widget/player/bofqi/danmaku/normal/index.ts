import stylesheet from "./index.css" with {type: 'css'};
import type { DanmakuElem } from "../index.js";
import { hex8 } from "../../../../../../utils/color.js";
import { log } from "../../../../../../utils/debug.js";

export abstract class Mode extends HTMLElement {
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    protected special = false;
    #width = 0;
    /* 弹幕宽度 */
    get width() {
        return this.#width;
    }
    #height = 0;
    /* 弹幕高度 */
    get height() {
        return this.#height;
    }
    dmid: bigint;
    progress: number;
    constructor(
        parent: ParentNode,
        private dm: DanmakuElem,
        delay = 0,
        style: CSSStyleSheet
    ) {
        super();
        const { action, animation, color, content, fontsize, colorful, id, progress = 0 } = dm;
        this.#shadowRoot.adoptedStyleSheets.push(stylesheet, style);
        this.dmid = id;
        this.progress = progress;
        this.dataset["delay"] = <any>delay;
        this.dataset["fontsize"] = <any>fontsize;
        this.dataset["color"] = hex8(color);
        if (content) {
            const text = content.replace(/(?:\/n|\\n|\n|\r\n)/g, '\n');
            this.#shadowRoot.append(document.createTextNode(text));
            if (text.split('\n').length > 8) {
                // 对上古时期使用换行符排版的普权弹幕特殊处理
                this.special = true;
                this.classList.add('special');
            }
        }
        if (typeof action === 'string') {
            /**
             * @see 文档 {@link https://info.bilibili.co/pages/viewpage.action?pageId=95154953}
             * @see 优先级 {@link https://www.tapd.bilibili.co/20062561/prong/stories/view/1120062561001659710}
             */
            const map = new Map(action.split(';').map(d => <[string, string]>d.split(':')));
            for (const [key, value] of map) {
                switch (key) {
                    case 'picture': {
                        // 图片弹幕
                        const img = document.createElement('img');
                        img.src = `//${value}`;
                        this.#shadowRoot.replaceChildren(img);
                        break;
                    }
                    default: {
                        // 未知弹幕类型
                        log('未知弹幕动作', { id, content, key, value });
                        break;
                    }
                }
            }
        }
        if (typeof animation === 'string') {
            log('未知弹幕属性', { id, content, animation });
        }
        colorful && this.classList.add('colorful');
        // 监听弹幕运动状态
        this.when('animationend').take(1).subscribe({ next: () => { this.remove(); } });
        parent.append(this);

    }
    connectedCallback() {
        const { clientWidth, clientHeight } = this;
        [this.dataset["width"], this.dataset["height"]] = [this.#width, this.#height] = <any>[clientWidth, clientHeight];
        this.dm.$rendered = true;
    }
    disconnectedCallback() {
        delete this.dm.$rendered;
    };
}