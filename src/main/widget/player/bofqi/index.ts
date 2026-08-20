import html from './index.html' with {type: 'text'};
import style from './index.css' with {type: 'css'};
import iconfont from './iconfont.css' with {type: 'css'};
import { durationFormat } from '../../../../utils/time';
import { Danmaku } from './danmaku';
import { DANMAKU_FORBID } from './danmaku/forbid';
import '../../slider';
import { warn } from '../../../../utils/debug';

export class Bofqi extends HTMLElement {
    static get is() {
        return 'bo-f-qi';
    }
    static {
        document.adoptedStyleSheets.push(iconfont);
    }
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    #implement = new AbortController();
    video: HTMLVideoElement;
    danmaku: Danmaku;
    #videoTime: HTMLDivElement;
    #volume: HTMLInputElement;
    quality: HTMLSelectElement;
    #panel: HTMLDivElement;
    stage = {
        playurl: (v: number) => {
            if (v) {
                this.#panel.firstElementChild?.children[0]?.setAttribute('stage', <any>v);
            } else {
                this.#panel.firstElementChild?.children[0]?.removeAttribute('stage');
            }
        },
        player: (v: number) => {
            if (v) {
                this.#panel.firstElementChild?.children[1]?.setAttribute('stage', <any>v);
            } else {
                this.#panel.firstElementChild?.children[1]?.removeAttribute('stage');
            }
        },
        media: (v: number) => {
            if (v) {
                this.#panel.firstElementChild?.children[2]?.setAttribute('stage', <any>v);
            } else {
                this.#panel.firstElementChild?.children[2]?.removeAttribute('stage');
            }
        },
        user: (v: number) => {
            if (v) {
                this.#panel.firstElementChild?.children[3]?.setAttribute('stage', <any>v);
            } else {
                this.#panel.firstElementChild?.children[3]?.removeAttribute('stage');
            }
        },
    };
    #toast: HTMLDivElement;
    protected progress: HTMLInputElement;
    protected poster: HTMLDivElement;
    #time: HTMLDivElement;
    #context: HTMLDivElement;
    #statistic: HTMLDivElement;
    constructor() {
        super();

        this.#shadowRoot.innerHTML = html;
        this.#shadowRoot.adoptedStyleSheets.push(style);

        this.video = this.#shadowRoot.querySelector('video')!;
        this.danmaku = new Danmaku(this.video);
        this.video.insertAdjacentElement('afterend', this.danmaku);

        this.#videoTime = this.#shadowRoot.querySelector('.action>.time')!;
        this.#volume = this.#shadowRoot.querySelector('#volume')!;
        this.quality = this.#shadowRoot.querySelector('#quality')!;
        this.#panel = this.#shadowRoot.querySelector('.panel')!;
        this.progress = this.#shadowRoot.querySelector('#timeline')!;
        this.poster = this.#shadowRoot.querySelector('.progress>.poster')!;
        this.#time = this.#shadowRoot.querySelector('.progress>.time')!;
        this.#toast = this.#shadowRoot.querySelector('.toast')!;
        this.#context = this.#shadowRoot.querySelector('.context')!;
        this.#statistic = this.#shadowRoot.querySelector('#statistic>div')!;

        this.stage.player(1);
    }
    connectedCallback() {
        this.#implement.abort();
        this.#implement = new AbortController();

        /** 拖拽进度条标志 */
        let isDragging = false;

        this.video.when('click').subscribe(() => {
            this.video.paused ? this.video.play().catch(() => { }) : this.video.pause();
        }, { signal: this.#implement.signal });
        this.video.when('command').subscribe(({ command, source }) => {
            switch (command) {
                case '--play-pause': {
                    this.video.paused ? this.video.play().catch(() => { }) : this.video.pause();
                    break;
                }
                case '--toggle-muted': {
                    this.video.muted = !this.video.muted;
                    break;
                }
                case '--toggle-danmaku': {
                    const { value } = (<HTMLElement>source)?.dataset;
                    if (value) {
                        const forbid = Number(value);
                        this.classList.toggle('nodm', Boolean(DANMAKU_FORBID.VISIBLE & (this.danmaku.forbid ^= forbid)));
                        source?.classList.toggle('d', Boolean(forbid & this.danmaku.forbid));
                    }
                    break;
                }
                case '--toggle-loop': {
                    this.video.loop = !this.video.loop;
                    break;
                }
                case '--toggle-webfull': {
                    document.body.style.overflow = this.classList.toggle('webfull') ? 'clip' : '';
                    break;
                }
                case '--toggle-fullscreen': {
                    if (document.fullscreenElement) {
                        document.exitFullscreen().catch(() => { });
                    } {
                        this.requestFullscreen().catch(() => { });
                    }
                    break;
                }
                case '--ratechange': {
                    const rate = Number((<HTMLElement>source).dataset['rate']);
                    if (rate) {
                        this.video.playbackRate = rate;
                    }
                    break;
                }
            }
        }, { signal: this.#implement.signal });
        this.video.when('durationchange').subscribe(() => {
            const { duration } = this.video;
            this.progress.max = <any>duration;
            this.#videoTime.dataset['duration'] = durationFormat({ seconds: Math.floor(duration) });
            this.updateProgressBackground();
        }, { signal: this.#implement.signal });
        this.video.when('timeupdate').subscribe(() => {
            const { currentTime } = this.video;
            if (!isDragging) { // 如果用户正在拖拽，先不让视频进度覆盖滑块位置
                this.progress.valueAsNumber = currentTime;
            }
            this.#videoTime.dataset['current'] = durationFormat({ seconds: Math.floor(currentTime) });
            this.updateProgressBackground();
        }, { signal: this.#implement.signal });
        this.video.when('volumechange').subscribe(() => {
            const { volume } = this.video;
            this.#volume.valueAsNumber = volume;
            this.dataset['volume'] = <any>volume;
        }, { signal: this.#implement.signal });
        this.#volume.when('input').subscribe(() => {
            this.video.volume = this.#volume.valueAsNumber;
        }, { signal: this.#implement.signal });
        this.video.when('loadstart').subscribe(() => {
            this.stage.media(1);
        }, { signal: this.#implement.signal });
        this.video.when('loadedmetadata').subscribe(() => {
            this.#panel.style.display = 'none';
            this.stage.media(2);
        }, { signal: this.#implement.signal });
        this.video.when('emptied').subscribe(() => {
            this.#panel.style.display = '';
            this.stage.media(0);
        }, { signal: this.#implement.signal });
        this.video.when('progress').subscribe(() => {
            this.updateProgressBackground();
        }, { signal: this.#implement.signal });
        this.video.when('contextmenu').subscribe({
            next: e => {
                e.preventDefault();

                const { offsetX, offsetY } = e;
                this.#context.dataset['x'] = <any>offsetX;
                this.#context.dataset['y'] = <any>offsetY;
                this.#context.showPopover();
            }
        }, { signal: this.#implement.signal });
        this.video.when('ratechange').subscribe(() => {
            this.dataset['playbackRate'] = <any>this.video.playbackRate;
        }, { signal: this.#implement.signal });
        this.video.when('waiting').switchMap(e => {
            if (this.video.seeking || this.video.paused || this.video.ended || !this.video.buffered.length) return Observable.from([]);
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 1e3);
                return () => clearTimeout(timer);
            });
        }).subscribe(() => {
            // 全局卡顿/间隙跳跃机制
            const { buffered, currentTime } = this.video;
            for (let i = 0; i < buffered.length; i++) {
                // 容许微小的浮点数误差 (0.001s)
                if (currentTime >= buffered.start(i) - 0.001 && currentTime < buffered.end(i)) {
                    return;
                }
            }

            let nearestStart = 0;

            for (let i = 0; i < buffered.length; i++) {
                const start = buffered.start(i);
                if (start > currentTime) {
                    if (!nearestStart || start < nearestStart) {
                        nearestStart = start;
                    }
                }
            }

            if (nearestStart > 0) {
                const gapSize = nearestStart - currentTime;

                if (gapSize > 0 && gapSize <= nearestStart) {
                    const targetTime = nearestStart + 0.05;
                    // 强制跳过 Gap
                    warn('Gap', currentTime, '->', targetTime);
                    this.video.currentTime = targetTime;
                }
            }
        }, { signal: this.#implement.signal })

        this.progress.when('input').subscribe(() => {
            isDragging = true;
            this.video.currentTime = this.progress.valueAsNumber;
            this.updateProgressBackground();
        }, { signal: this.#implement.signal });
        this.progress.when('change').subscribe(() => {
            isDragging = false;
        }, { signal: this.#implement.signal });
        this.progress.when('pointermove').subscribe(({ offsetX }) => {
            const { clientWidth } = this.progress;
            const radio = Math.max(Math.min(offsetX / clientWidth, 1), 0);
            this.poster.dataset['offset'] = this.#time.dataset['offset'] = <any>(100 * radio);
            const duration = this.video.duration || 0;
            if (duration === 0) {
                this.#time.replaceChildren();
            } else {
                this.#time.textContent = durationFormat({ seconds: Math.floor(duration * radio) });
            }
        }, { signal: this.#implement.signal });

        this.when('pointermove').switchMap(e => {
            this.classList.remove('hide');
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 1e3);
                return () => clearTimeout(timer);
            });
        }).subscribe(() => {
            this.classList.add('hide');
        }, { signal: this.#implement.signal });

        this.#toast.when('animationend').subscribe(({ target }) => {
            if (target instanceof HTMLDivElement) {
                target.remove();
            }
        }, { signal: this.#implement.signal });

        this.danmaku.when('--sort').switchMap<CustomEvent<number>>(e => {
            this.classList.remove('hide');
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<number>>e);
                    subscriber.complete();
                }, 1e3);
                return () => clearTimeout(timer);
            });
        }).subscribe(({ detail }) => {
            this.statistic('Danmaku:', <any>detail);
        }, { signal: this.#implement.signal });

        this.stage.player(2);
    }
    disconnectedCallback() {
        this.#implement.abort();
    }
    identify() {
        this.danmaku.identify();
        delete this.#videoTime.dataset['duration'];
        delete this.#videoTime.dataset['current'];
        delete this.dataset['volume'];
        this.stage.playurl(0);
        this.stage.media(0);
        this.progress.max = '';
        this.progress.style.backgroundImage = '';
        this.progress.valueAsNumber = 0;
        delete this.poster.dataset['offset'];
        delete this.#time.dataset['offset'];
        this.#time.replaceChildren();
        this.#statistic.replaceChildren();
    }
    toast(message: string, timeout = 5e3) {
        this.#toast.insertAdjacentHTML('beforeend', `<div data-duration="${timeout}">${message}</div>`);
    }
    statistic(label: string, value: string, where: 'afterbegin' | 'beforeend' = 'beforeend') {
        const div = this.#statistic.querySelector<HTMLDivElement>(`[data-label="${label}"]`);
        if (div) {
            div.innerHTML = value;
        } else {
            this.#statistic.insertAdjacentHTML(where, `<div data-label="${label}">${value}</div>`);
        }
    }
    /** 更新进度条背景的函数 */
    private updateProgressBackground = () => {
        const { buffered, duration, currentTime } = this.video;
        if (duration) {
            const arr: [number, number][] = [];
            for (let i = 0, len = buffered.length; i < len; i++) {
                arr.push([buffered.start(i) / duration, buffered.end(i) / duration]);
            }
            arr.sort((a, b) => a[0] - b[0] > 0 ? 1 : -1);
            /** 当前最大值，用于还原背景色 */
            let max = currentTime / duration;
            const linear: [string, string, string][] = [['#00a1d6', '0%', `${max * 100}%`]];
            for (const buffer of arr) {
                if (buffer[1] > max) {
                    if (buffer[0] > max) {
                        linear.push(
                            ['transparent', `${max * 100}%`, `${buffer[0] * 100}%`],
                            ['#8adced', `${buffer[0] * 100}%`, `${buffer[1] * 100}%`]
                        );
                    } else {
                        linear.push(['#8adced', `${max * 100}%`, `${buffer[1] * 100}%`]);
                    }
                    max = buffer[1];
                }
            }
            linear.push(['transparent', `${max * 100}%`, '100%']);
            this.progress.style.backgroundImage = `linear-gradient(to right,${linear.map(d => d.join(' ')).join(',')})`;
        }
    }
}
customElements.define(Bofqi.is, Bofqi);