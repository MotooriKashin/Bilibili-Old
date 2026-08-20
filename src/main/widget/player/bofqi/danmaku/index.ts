import { DANMAKU_FORBID } from './forbid';
import style from './index.css' with {type: 'css'};
import { Mode7 } from './mode7';
import { Mode1 } from './normal/mode1';
import { Space as Mode1Space } from "./normal/mode1/space";
import { Mode4 } from './normal/mode4';
import { Space as Mode4Space } from "./normal/mode4/space";
import { Mode5 } from './normal/mode5';
import { Mode6 } from './normal/mode6';

export class Danmaku extends HTMLElement {
    static get is() {
        return 'bofqi-danmaku';
    }
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    /** 元素生命周期 */
    #implement = new AbortController();
    /** 原始弹幕缓存（未排序） */
    rawDms: DanmakuElem[] = [];
    /** 储存已排序好的弹幕，按 progress 升序，id 升序 */
    #sortedDms: DanmakuElem[] = [];
    /** 弹幕渲染迭代器 */
    #timeline = this.#sortedDms.values();
    /** 最后检查的弹幕 */
    #lastDm?: DanmakuElem;
    /** requestAnimationFrame 的 ID，用于控制循环 */
    #animationFrameId?: number;
    /** 弹幕屏蔽状态 */
    #forbid = 0;
    get forbid() {
        return this.#forbid;
    }
    set forbid(v) {
        this.#forbid = v;
        if (!(DANMAKU_FORBID.VISIBLE & v) && !this.video.paused) {
            this.stopRAF();
            this.startRAF();
        }
    }
    /** 当前视频时间：/ms */
    get currentTime() {
        return Math.floor(this.video.currentTime * 1e3);
    }
    #rate = 1;
    /** 视频播放速率 */
    get rate() {
        return this.#rate;
    }
    #width = 0;
    /** 弹幕区域宽度 */
    get width() {
        return this.#width;
    }
    #height = 0;
    /** 弹幕区域高度 */
    get height() {
        return this.#height;
    }
    /** 弹幕运动速度倍率 */
    get speedConstant() {
        return 512;
    }
    #duration = 4500;
    /* 动画时间 */
    get duration() {
        return this.#duration / this.#speed;
    }
    #speed = 1;
    set speed(v: number) {
        this.#speed = v;
        this.dataset['duration'] = <any>(this.#duration / v);
    }
    /** 弹幕容器大小变化回调 */
    #resizeObserver = new ResizeObserver(entries => {
        for (const { contentBoxSize } of entries) {
            for (const { inlineSize, blockSize } of contentBoxSize) {
                [this.#width, this.#height] = [<any>inlineSize, <any>blockSize];
            }
        }
    });
    constructor(private video: HTMLVideoElement) {
        super();
        this.classList.add('danmaku');
        this.#shadowRoot.adoptedStyleSheets.push(style);

        // 初始化弹幕空间计算器
        Mode1.space = new Mode1Space(this);
        Mode4.space = new Mode4Space(this);
        Mode5.space = new Mode4Space(this);
        Mode6.space = new Mode1Space(this);
    }
    connectedCallback() {
        this.#implement.abort();
        this.#implement = new AbortController();

        this.video.when('playing').subscribe({ next: this.startRAF }, { signal: this.#implement.signal });
        this.video.when('waiting').subscribe({ next: this.stopRAF }, { signal: this.#implement.signal });
        this.video.when('seeked').subscribe({ next: this.flushTimeline }, { signal: this.#implement.signal });
        this.video.when('pause').subscribe({ next: this.stopRAF }, { signal: this.#implement.signal });
        this.video.when('ended').subscribe({
            next: () => {
                this.stopRAF();
                this.flushTimeline();
            }
        }, { signal: this.#implement.signal });

        this.video.when('ratechange').subscribe({
            next: () => {
                this.#rate = this.video.playbackRate;
            }
        }, { signal: this.#implement.signal });
        this.when('--sort').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).subscribe(() => {
            // 弹幕排序
            this.#sortedDms = this.rawDms.toSorted(({ progress: p1 = 0, id: i1 }: DanmakuElem, { progress: p2 = 0, id: i2 }: DanmakuElem) => {
                // 主要排序键：progress time (升序)
                if (p1 > p2) {
                    return 1;
                } else if (p1 < p2) {
                    return -1;
                } else {
                    // 次要排序键：id (升序，确保稳定)
                    return i1 > i2 ? 1 : -1;
                }
            });
            // 重置最后一条弹幕
            this.flushTimeline();
        }, { signal: this.#implement.signal });

        this.#resizeObserver.observe(this);
    }
    disconnectedCallback() {
        this.#implement.abort();
        this.#resizeObserver.unobserve(this);
    }
    /**
     * 弹幕批量插入
     * 
     * @param value 要插入的弹幕
     */
    add(value: DanmakuElem | DanmakuElem[]) {
        this.rawDms = this.rawDms.concat(value);
        this.dispatchEvent(new CustomEvent('--sort', { detail: this.rawDms.length }));
    }
    addXml(value: string) {
        const xml = new DOMParser().parseFromString(value, 'application/xml');
        const items = xml.querySelectorAll('d');
        const dms: DanmakuElem[] = [];
        items.forEach(d => {
            const [progress, mode, fontsize, color, ctime, pool, midHash, id] = d.getAttribute('p')!.split(',');
            const text = d.textContent || (<HTMLAnchorElement>d).text;
            if (text) {
                const dm = <DanmakuElem>{
                    pool: <0>Number(pool),
                    color: Number(color),
                    ctime: Number(ctime),
                    id: BigInt(id!),
                    mode: <1>Number(mode),
                    fontsize: Number(fontsize),
                    progress: Number(progress) * 1000,
                    content: String(text),
                    midHash,
                }
                dms.push(dm);
            }
        });
        this.add(dms);
    }
    identify() {
        this.rawDms.length = 0;
        this.#sortedDms.length = 0;
        this.flushTimeline();
        this.stopRAF();
        this.#shadowRoot.replaceChildren();
        Mode1.space.identify();
        Mode4.space.identify();
        Mode5.space.identify();
        Mode6.space.identify();
    }
    private startRAF = () => {
        if (!this.#animationFrameId) {
            const loop = () => {
                if (!(DANMAKU_FORBID.VISIBLE & this.#forbid)) {
                    this.checkAndExtractDms();
                    this.#animationFrameId = requestAnimationFrame(loop);
                }
            };
            this.#animationFrameId = requestAnimationFrame(loop);
        }
    }
    private stopRAF = () => {
        if (this.#animationFrameId) {
            cancelAnimationFrame(this.#animationFrameId);
            this.#animationFrameId = undefined;
        }
    }
    /** 重置弹幕时间戳锚点 */
    private flushTimeline = () => {
        this.#lastDm = undefined;
        this.#timeline = this.#sortedDms.values();
    }
    private checkAndExtractDms = () => {
        const { currentTime } = this;
        if (this.#lastDm) {
            const progress = this.#lastDm.progress || 0;
            if (progress <= currentTime) {
                this.render(this.#lastDm)
                this.#lastDm = undefined;
            } else {
                return;
            }
        }
        for (const dm of this.#timeline) {
            if (dm.$rendered) {
                // 正在渲染的弹幕直接跳过
                continue;
            }
            const progress = dm.progress || 0;
            if (progress < currentTime - 1000) {
                // 已渲染过的弹幕
                continue;
            } else if (progress <= currentTime) {
                this.render(dm, progress - currentTime);
                continue;
            } else {
                this.#lastDm = dm;
                return;
            }
        }
    }
    /**
     * 渲染弹幕
     * 
     * @param dm 要渲染的弹幕
     * @param delay 实际运动时间延迟
     */
    private render(dm: DanmakuElem, delay = 0) {
        switch (dm.mode) {
            case 1: {
                this.forbid & (DANMAKU_FORBID.VISIBLE ^ DANMAKU_FORBID.NORMAL) || new Mode1(this.#shadowRoot, dm, delay);
                break;
            }
            case 4: {
                this.forbid & (DANMAKU_FORBID.VISIBLE ^ DANMAKU_FORBID.BOTTOM) || new Mode4(this.#shadowRoot, dm, delay);
                break;
            }
            case 5: {
                this.forbid & (DANMAKU_FORBID.VISIBLE ^ DANMAKU_FORBID.TOP) || new Mode5(this.#shadowRoot, dm, delay);
                break;
            }
            case 6: {
                this.forbid & (DANMAKU_FORBID.VISIBLE ^ DANMAKU_FORBID.REVERSE) || new Mode6(this.#shadowRoot, dm, delay);
                break;
            }
            case 7: {
                this.forbid & (DANMAKU_FORBID.VISIBLE ^ DANMAKU_FORBID.ADVANCE) || new Mode7(this.#shadowRoot, dm, delay);
                break;
            }
            case 8:
            case 9:
        }
    }
}
customElements.define(Danmaku.is, Danmaku);
/** 弹幕实例 */
export interface DanmakuElem {
    /** 弹幕id */
    id: bigint;
    /** 弹幕位置：/ms */
    progress?: number;
    /**
     * 弹幕类型
     * | 1 | 4 | 5 | 6 | 7 | 8 | 9 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 普通 | 底部 | 顶部 | 逆向 | 高级 | 代码 | BAS |
     */
    mode: 1 | 4 | 5 | 6 | 7 | 8 | 9;
    /** 弹幕字体 */
    fontsize: number;
    /** 弹幕颜色 */
    color: number;
    /** 弹幕文本内容 */
    content?: string;
    /** 弹幕动作 */
    action?: string;
    /**
     * 弹幕池
     * | 0 | 1 | 2 |
     * | :-: | :-: | :-: |
     * | 普通弹幕 | 字幕弹幕 | 特殊弹幕 |
     */
    pool?: 0 | 1 | 2;
    /**
     * 弹幕属性位
     * | 0 | 1 | 2 |
     * | :=: | :=: | :=: |
     * | 保护弹幕 | 直播弹幕 | 高赞弹幕 |
     */
    attr?: 0 | 1 | 2;
    animation?: string;
    /** 弹幕渐变色 */
    colorful?: DmColorfulType;

    /** 渲染标记 */
    $rendered?: boolean;
}

/** 彩色弹幕类型 */
enum DmColorfulType {
    /** NoneType - 无 */
    NoneType = 0,
    /** VipGradualColor - 大会员渐变色 */
    VipGradualColor = 60001,
    UNRECOGNIZED = -1,
}