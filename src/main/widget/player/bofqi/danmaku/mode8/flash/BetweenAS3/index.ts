import { Mode8 } from "../..";
import { target, type DisplayObject } from "../display/DisplayObject";
import { Point } from "../geom/Point";
import { generateBezierPoints } from "./bezier";

/**
 * 使用指定方法对物件进行移动
 * 
 * @param object 要移动的物件
 * @param dest 移动目标数值
 * @param src 移动来源数值
 * @param duration 移动时间
 */
export function tween(object: DisplayObject, dest: ITweenOption, src?: ITweenOption, duration = 1) {
    const keyframes: Keyframe[] = [];
    const keyframeAnimationOptions: KeyframeAnimationOptions = { fill: 'forwards', duration: duration * 1e3 };
    src && keyframes.push(toKeyframes(src));
    keyframes.push(toKeyframes(dest));
    return new Tween(object, keyframes, keyframeAnimationOptions);
}

/**
 * 使用指定方法对物件进行移动
 * 
 * @param object 要移动的物件
 * @param dest 移动目标数值
 * @param duration 移动时间
 * @param easing 移动函数
 */
export function to(object: DisplayObject, dest: ITweenOption, duration = 1) {
    return tween(object, dest, undefined, duration);
}

/**
 * 以贝赛尔曲线对物件进行移动
 * 
 * @param object 要移动的物件
 * @param dest 移动目标数值
 * @param src 移动起始数值
 * @param control 贝赛尔曲线控制点
 * @param duration 移动时间
 */
export function bezier(object: DisplayObject, dest: Point, src?: Point, control = <{ x: number[], y: number[] }>{}, duration = 1) {
    // 根据时长按每秒 30 点动态计算，限制在 10~50 之间
    const count = Math.max(10, Math.min(50, Math.ceil((duration) * 30)));
    const keyframes: Keyframe[] = [];
    const keyframeAnimationOptions: KeyframeAnimationOptions = { fill: 'forwards', duration: duration * 1e3 };
    src || (src = new Point(object.x, object.y));
    generateBezierPoints(src, dest, zipKeyed(control), count).forEach(({ x, y }) => {
        keyframes.push({ '--x': `${x}px`, '--y': `${y}px` });
    });
    return new Tween(object, keyframes, keyframeAnimationOptions);
}

// TODO：`Iterator.zipKeyed`的临时替代，[Joint Iteration](https://github.com/tc39/proposal-joint-iteration)实装后更换
function zipKeyed({ x, y }: { x: number[], y: number[] }) {
    return x.map((x, i) => {
        return { x, y: y[i]! }
    });
}

/**
* 复制指定效果并按时间拉伸
*
* @param src 复制来源效果
* @param scale 时间轴缩放比例
*/
export function scale(src: ITween, scale: number) {
    return src.scale(scale);
}

/**
* 复制指定效果并延迟执行
*
* @param src 复制来源效果
* @param delay 以秒为单位的延迟时间
*/
export function delay(src: ITween, delay: number) {
    return src.delay(delay);
}

/**
* 将指定效果反向
*
* @param src 复制来源效果
*/
export function reverse(src: Tween) {
    return src.reverse();
}

/**
 * 重复指定效果
 *
 * @param src 复制来源效果
 * @param times 效果执行次数
 */
export function repeat(src: Tween, times: number) {
    return src.repeat(times);
}

/**
 * 取出指定效果时间
 *
 * @param src 复制来源效果
 * @param from 起始时间(秒)
 * @param to 结束时间(秒)
 */
export function slice(src: Tween, from: number, to: number) {
    return src.slice(from, to);
}

/**
 * 串行执行效果
 *
 * @param srcs 串行来源效果
 */
export function serial(...tweens: Tween[]) {
    return new Serial(tweens);
}

/**
 * 并行执行效果
 *
 * @param srcs 并行来源效果
 */
export function parallel(...tweens: Tween[]) {
    return new Parallel(tweens);
}

function toKeyframes(object: ITweenOption) {
    const keyframe = <Keyframe>{};
    Object.entries(object).forEach(([key, value]) => {
        switch (key) {
            case 'x': case 'y': {
                keyframe[`--${key}`] = `${value}px`;
                break;
            }
            case 'alpha': {
                keyframe['opacity'] = value;
                break;
            }
            case 'rotationX': {
                keyframe['--rotate-x'] = `${value}deg`;
                break;
            }
            case 'rotationY': {
                keyframe['--rotate-y'] = `${value}deg`;
                break;
            }
            case 'rotationZ': {
                keyframe['--rotate-z'] = `${value}deg`;
                break;
            }
            case 'fontsize': {
                keyframe['fontSize'] = `${value}px`;
                break;
            }
        }
    });
    return keyframe;
}

class Tween implements ITween {
    #object: DisplayObject;
    #keyframes: Keyframe[];
    #keyframeAnimationOptions: KeyframeAnimationOptions;
    /** 动画效果实例 */
    #animation?: Animation;
    /** 当前时间 */
    #currentTime = 0;
    #stopOnComplete = true;
    /** 设置是否重复播放效果 (true则不重复播放) */
    get stopOnComplete() {
        return this.#stopOnComplete
    }
    set stopOnComplete(v) {
        this.#stopOnComplete = v;
        this.#keyframeAnimationOptions.iterations = v ? 1 : Infinity;
    }
    durantion = 0;
    constructor(object: DisplayObject, keyframes: Keyframe[], keyframeAnimationOptions: KeyframeAnimationOptions) {
        this.#object = object;
        this.#keyframes = keyframes;
        this.#keyframeAnimationOptions = keyframeAnimationOptions;

        this.durantion = (<number>this.#keyframeAnimationOptions.duration || 0) + (<number>this.#keyframeAnimationOptions.delay || 0);
    }

    /** 开始播放效果 */
    play() {
        if (this.#animation) {
            this.#animation.currentTime = this.#currentTime;
            this.#animation.play();
        } else {
            const animation = this.#animation = this.#object[target].animate(this.#keyframes, this.#keyframeAnimationOptions);
            Mode8.animation.add(animation);
            animation.currentTime = this.#currentTime;
            animation.finished.then(() => {
                Mode8.animation.delete(animation);
            });
        }
    }
    /**
     * 跳跃至指定时间并开始播放效果
     * @param time 以秒为单位的时间
     */
    gotoAndPlay(time: number) {
        this.#currentTime = time * 1000;
        this.play();
    }
    /** 终止播放效果 */
    stop() {
        this.#animation?.finish();
    }
    /**
     * 跳跃至指定时间并停止播放效果
     * @param time 以秒为单位的时间
     */
    gotoAndStop(time: number) {
        this.#currentTime = time * 1000;
        this.#animation?.pause();
    }
    /** 切换播放/暂停 */
    togglePause() {
        if (this.#animation) {
            this.#animation.playState === 'running' ? this.#animation.pause() : this.#animation.play();
        } else {
            this.play();
        }
    }

    scale(scale: number) {
        const [keyframes, keyframeAnimationOptions] = [structuredClone(this.#keyframes), structuredClone(this.#keyframeAnimationOptions)];
        if (keyframeAnimationOptions.duration) {
            (<number>keyframeAnimationOptions.duration) *= scale;
        }
        if (keyframeAnimationOptions.delay) {
            keyframeAnimationOptions.delay *= scale;
        }

        return new Tween(this.#object, keyframes, keyframeAnimationOptions);
    }
    delay(delay: number) {
        const [keyframes, keyframeAnimationOptions] = [structuredClone(this.#keyframes), structuredClone(this.#keyframeAnimationOptions)];
        keyframeAnimationOptions.delay = (keyframeAnimationOptions.delay || 0) + delay * 1e3;
        return new Tween(this.#object, keyframes, keyframeAnimationOptions);
    }
    reverse() {
        const [keyframes, keyframeAnimationOptions] = [structuredClone(this.#keyframes), structuredClone(this.#keyframeAnimationOptions)];
        keyframeAnimationOptions.direction = keyframeAnimationOptions.direction === 'reverse' ? 'normal' : 'reverse';
        return new Tween(this.#object, keyframes, keyframeAnimationOptions);
    }
    repeat(times: number) {
        const [keyframes, keyframeAnimationOptions] = [structuredClone(this.#keyframes), structuredClone(this.#keyframeAnimationOptions)];
        keyframeAnimationOptions.iterations = times;
        return new Tween(this.#object, keyframes, keyframeAnimationOptions);
    }
    slice(from: number, to: number) {
        const [keyframes, keyframeAnimationOptions] = [structuredClone(this.#keyframes), structuredClone(this.#keyframeAnimationOptions)];
        from *= 1000, to *= 1000;
        const len = to - from;
        if (keyframeAnimationOptions.delay! <= from) {
            from -= (keyframeAnimationOptions.delay || 0);
        } else {
            keyframeAnimationOptions.delay! -= from;
        }
        keyframeAnimationOptions.rangeStart = <any>(from / (<number>keyframeAnimationOptions.duration || 1000));
        keyframeAnimationOptions.rangeEnd = <any>(len / (<number>keyframeAnimationOptions.duration || 1000));

        return new Tween(this.#object, keyframes, keyframeAnimationOptions);
    }
}

class Serial implements ITween {
    #tweens: ITween[] = [];
    #stopOnComplete = true;
    /** 设置是否重复播放效果 (true则不重复播放) */
    get stopOnComplete() {
        return this.#stopOnComplete
    }
    set stopOnComplete(v) {
        this.#stopOnComplete = v;
        this.#tweens.forEach(d => {
            d.stopOnComplete = v;
        });
    }
    durantion = 0;
    constructor(tweens: ITween[]) {
        tweens.forEach(d => {
            const n = d.delay(this.durantion / 1e3);
            this.#tweens.push(n);
            this.durantion = n.durantion;
        });

    }
    play() {
        this.#tweens.forEach(d => { d.play() });
    }
    gotoAndPlay(time: number) {
        this.#tweens.forEach(d => { d.gotoAndPlay(time) });
    }
    stop() {
        this.#tweens.forEach(d => { d.stop() });
    }
    gotoAndStop(time: number) {
        this.#tweens.forEach(d => { d.gotoAndStop(time) });
    }
    togglePause() {
        this.#tweens.forEach(d => { d.togglePause() });
    }

    scale(scale: number) {
        return new Serial(this.#tweens.map(d => d.scale(scale)));
    }
    delay(delay: number) {
        return new Serial(this.#tweens.map(d => d.delay(delay)));
    }
    reverse() {
        return new Serial(this.#tweens.map(d => d.reverse()));
    }
    repeat(times: number) {
        return new Serial(this.#tweens.map(d => d.repeat(times)));
    }
    slice(from: number, to: number) {
        return new Serial(this.#tweens.map(d => d.slice(from, to)));
    }
}

class Parallel implements ITween {
    #tweens: ITween[];
    #stopOnComplete = true;
    /** 设置是否重复播放效果 (true则不重复播放) */
    get stopOnComplete() {
        return this.#stopOnComplete
    }
    set stopOnComplete(v) {
        this.#stopOnComplete = v;
        this.#tweens.forEach(d => {
            d.stopOnComplete = v;
        });
    }
    durantion = 0;
    constructor(tweens: ITween[]) {
        this.#tweens = tweens;

        tweens.forEach(({ durantion }) => {
            // 并行取最长的子组件时长为整体时长
            this.durantion > durantion || (this.durantion = durantion);
        });
    }
    play() {
        this.#tweens.forEach(d => { d.play() });
    }
    gotoAndPlay(time: number) {
        this.#tweens.forEach(d => { d.gotoAndPlay(time) });
    }
    stop() {
        this.#tweens.forEach(d => { d.stop() });
    }
    gotoAndStop(time: number) {
        this.#tweens.forEach(d => { d.gotoAndStop(time) });
    }
    togglePause() {
        this.#tweens.forEach(d => { d.togglePause() });
    }

    scale(scale: number) {
        return new Parallel(this.#tweens.map(d => d.scale(scale)));
    }
    delay(delay: number) {
        return new Parallel(this.#tweens.map(d => d.delay(delay)));
    }
    reverse() {
        return new Parallel(this.#tweens.map(d => d.reverse()));
    }
    repeat(times: number) {
        return new Parallel(this.#tweens.map(d => d.repeat(times)));
    }
    slice(from: number, to: number) {
        return new Parallel(this.#tweens.map(d => d.slice(from, to)));
    }
}

/** 目前只支持坐标移动，但理论上应该支持其他属性？ */
interface ITweenOption {
    /** 移动X轴座标 */
    x?: number;
    /** 移动Y轴座标 */
    y?: number;
    /** 透明度变化 */
    alpha?: number;
    /** Z轴旋转角度变化 */
    rotationZ?: number;
    /** X轴旋转角度变化 */
    rotationX?: number;
    /** Y轴旋转角度变化 */
    rotationY?: number;
    /** 字体大小变化 */
    fontsize?: number;
}

interface ITween {
    /** 设置是否重复播放效果 (true则不重复播放) */
    stopOnComplete: boolean;
    /** 开始播放效果 */
    play(): void;
    /**
     * 跳跃至指定时间并开始播放效果
     * @param time 以秒为单位的时间
     */
    gotoAndPlay(time: number): void;
    /** 终止播放效果 */
    stop(): void;
    /**
     * 跳跃至指定时间并停止播放效果
     * @param time 以秒为单位的时间
     */
    gotoAndStop(time: number): void;
    /** 切换播放/暂停 */
    togglePause(): void;

    /** 当前动画耗时 */
    durantion: number;
    /**
    * 复制指定效果并按时间拉伸
    * @param scale 时间轴缩放比例
    */
    scale(scale: number): ITween;
    /**
    * 复制指定效果并延迟执行
    * @param delay 以秒为单位的延迟时间
    */
    delay(delay: number): ITween;
    /**
    * 将指定效果反向
    */
    reverse(): ITween;
    /**
     * 重复指定效果
     * @param times 效果执行次数
     */
    repeat(times: number): ITween;
    /**
     * 取出指定效果时间
     * @param from 起始时间(秒)
     * @param to 结束时间(秒)
     */
    slice(from: number, to: number): ITween;
}