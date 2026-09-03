import { target } from "./flash/display/DisplayObject";
import type { DisplayObjectContainer } from "./flash/display/DisplayObjectContainer";
import type { Stage } from "./flash/display/Stage";
import { TextField } from "./flash/text/TextField";
import { TextFormat } from "./flash/text/TextFormat";

export class CommentField extends TextField {
    #format: TextFormat;
    get align() {
        return this.#format.align;
    }
    set align(v) {
        this.#format.align = v;
        this.defaultTextFormat = this.#format;
    }
    get bold() {
        return this.#format.bold;
    }
    set bold(v) {
        this.#format.bold = v;
        this.defaultTextFormat = this.#format;
    }
    get font() {
        return this.#format.font;
    }
    set font(v) {
        this.#format.font = v;
        this.defaultTextFormat = this.#format;
    }
    get fontsize() {
        return this.#format.size;
    }
    set fontsize(v) {
        this.#format.size = v;
        this.defaultTextFormat = this.#format;
    }
    get color() {
        return this.#format.color;
    }
    set color(v) {
        this.#format.color = v;
        this.defaultTextFormat = this.#format;
    }
    override get htmlText() {
        return this.text;
    }
    override set htmlText(v) {
        this.text = v;
    }
    constructor(text: string, { font = '黑体', fontsize = 25, color = 16777215, x, y, z, alpha, scale, lifeTime = 3, parent, motion, motionGroup }: ICommentField, stage: Stage, delay = 0) {
        super();

        this.#format = new TextFormat(font, fontsize, color);
        this.defaultTextFormat = this.#format;

        this.text = text;

        x === undefined || (this.x = x);
        y === undefined || (this.y = y);
        z === undefined || (this.z = z);
        alpha === undefined || (this.alpha = alpha);
        scale === undefined || (this.scaleX = this.scaleY = scale);

        if (!motionGroup && motion) {
            motionGroup = [motion];
        }

        const id = `mode-8-${crypto.randomUUID()}`; // 生存周期动画（用于动画结束时移除元素）
        const animations: string[] = [];
        const keyframes = [`@keyframes ${id} {}`];
        if (motionGroup) {

            /** 上一个动画用时 */
            let prevTime = 0;
            motionGroup.forEach((motion, i) => {
                /** 当前动画组整体用时 */
                let motionTime = 0;
                for (let [key, { fromValue, toValue = fromValue, lifeTime: duration = lifeTime, startDelay = 0, repeat = 1 }] of Object.entries(motion)) {
                    duration *= 1e3;
                    const id = `mode-8-${crypto.randomUUID()}`;
                    switch (key) {
                        case 'x':
                        case 'y': {
                            animations.push(`${id} ${duration}ms linear ${prevTime + startDelay + delay}ms ${repeat} ${i ? 'forwards' : 'both'} var(--playing)`);
                            keyframes.push(`@keyframes ${id} {
                    from {
                        --${key}: ${fromValue}px;
                    }
                
                    to {
                        --${key}: ${toValue}px;
                    }
                }`);
                            break;
                        }
                        case 'alpha': {
                            animations.push(`${id} ${duration}ms linear ${prevTime + startDelay + delay}ms ${repeat} ${i ? 'forwards' : 'both'} var(--playing)`);
                            keyframes.push(`@keyframes ${id} {
                    from {
                        opacity: ${fromValue};
                    }
                
                    to {
                        opacity: ${toValue};
                    }
                }`);
                            break;
                        }
                        case 'rotationX': {
                            animations.push(`${id} ${duration}ms linear ${prevTime + startDelay + delay}ms ${repeat} ${i ? 'forwards' : 'both'} var(--playing)`);
                            keyframes.push(`@keyframes ${id} {
                    from {
                        --rotate-x: ${fromValue}deg;
                    }
                
                    to {
                        --rotate-x: ${toValue}deg;
                    }
                }`);
                            break;
                        }
                        case 'rotationY': {
                            animations.push(`${id} ${duration}ms linear ${prevTime + startDelay + delay}ms ${repeat} ${i ? 'forwards' : 'both'} var(--playing)`);
                            keyframes.push(`@keyframes ${id} {
                    from {
                        --rotate-y: ${fromValue}deg;
                    }
                
                    to {
                        --rotate-y: ${toValue}deg;
                    }
                }`);
                            break;
                        }
                        case 'rotationZ': {
                            animations.push(`${id} ${duration}ms linear ${prevTime + startDelay + delay}ms ${repeat} ${i ? 'forwards' : 'both'} var(--playing)`);
                            keyframes.push(`@keyframes ${id} {
                    from {
                        --rotate-z: ${fromValue}deg;
                    }
                
                    to {
                        --rotate-z: ${toValue}deg;
                    }
                }`);
                            break;
                        }
                        case 'fontsize': {
                            animations.push(`${id} ${duration}ms linear ${prevTime + startDelay + delay}ms ${repeat} ${i ? 'forwards' : 'both'} var(--playing)`);
                            keyframes.push(`@keyframes ${id} {
                    from {
                        font-size: ${fromValue}px;
                    }
                
                    to {
                        font-size: ${toValue}px;
                    }
                }`);
                            break;
                        }
                    }
                    const keyTime = prevTime + startDelay + duration * repeat;
                    keyTime > motionTime && (motionTime = keyTime); // 取最大属性动画时长为当前动画组整体用时
                }
                prevTime += motionTime;
            });
            lifeTime *= 1e3;
            animations.push(`${id} ${lifeTime > prevTime ? lifeTime : prevTime}ms linear ${delay}ms var(--playing)`);
        } else {
            animations.push(`${id} ${lifeTime}s linear ${delay}ms var(--playing)`);
        }
        keyframes.push(`:host{ animation:${animations.join(', ')}; }`);
        this[target].when('animationend').filter(d => d.animationName === id).take(1).subscribe(() => { this[target].remove(); });
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(keyframes.join('\n\n'));
        this[target].shadowRoot.adoptedStyleSheets.push(sheet);

        parent?.addChild ? parent.addChild(this) : stage.addChild(this);
    }
}

export class ICommentField {
    font?: string;
    fontsize?: number;
    color?: number;

    x?: number;
    y?: number;
    z?: number;
    alpha?: number;
    scale?: number;

    lifeTime?: number;
    parent?: DisplayObjectContainer;

    /** 元件移动策略 */
    motion?: Partial<Record<IMotionAcceptValue, IMotion>>;
    /** 元件移动策略组 可选 此选项填写后motion将失效 */
    motionGroup?: Partial<Record<IMotionAcceptValue, IMotion>>[];
}

type IMotionAcceptValue = 'x' | 'y' | 'alpha' | 'rotationZ' | 'rotationY' | 'rotationX' | 'fontsize';

interface IMotion {
    /** 起始移动属性值 */
    fromValue: number;
    /** 结束移动属性值 如留空则不移动 */
    toValue?: number;
    /** 以秒为单位的移动生存时间 如留空则与整体生存时间一致 */
    lifeTime?: number;
    /** 以毫秒为单位的起始移动延时时间 */
    startDelay?: number;
    /** 补间效果[1] 值：None, Back, Bounce, Circular, Cubic, Elastic, Exponential, Sine, Quintic, Linear */
    easing?: string;
    /** 效果重复次数 */
    repeat?: number;
}