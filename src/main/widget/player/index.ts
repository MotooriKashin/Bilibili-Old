import { playurl as pgc } from '../../../io/api.bilibili.com/pgc/player/web/playurl';
import { playurl as pugv } from '../../../io/api.bilibili.com/pugv/player/web/playurl';
import { HEART_BEAT, heartbeat } from '../../../io/api.bilibili.com/x/click-interface/web/heartbeat';
import { playurl as ugc, type IPlayurl } from '../../../io/api.bilibili.com/x/player/playurl';
import { videoshot, type IVideoshot } from '../../../io/api.bilibili.com/x/player/videoshot';
import { seg } from '../../../io/api.bilibili.com/x/v2/dm/web/seg';
import { view } from '../../../io/api.bilibili.com/x/v2/dm/web/view';
import { DanmakuElem, DmSegMobileReply } from '../../../proto/DmSegMobileReply';
import { port, portMessage } from '../../../utils/bridge';
import { error, log } from '../../../utils/debug';
import { https } from '../../../utils/url';
import { Medal } from '../dialog/index';
import { getItem, removeItem, setItem } from '../storage';
import { Bofqi } from './bofqi/index';
import { Broadcast } from './broadcast';
import { DashPlayer } from './dashPlayer/index';
import { NaivePlayer } from './naivePlayer';
import { ContentType } from './type';
import { upos } from './upos';

export class Player extends Bofqi {
    static override get is() {
        return 'bilibili-player';
    }
    #implement = new AbortController();
    #abortController = new AbortController();
    player?: IPlayer;
    codecid = 0;
    qn = 0;
    #videoshotData?: IVideoshot;
    aid = 0n;
    #cid = 0n;
    get cid() {
        return this.#cid;
    }
    set cid(v) {
        if (v === this.#cid) return;
        this.#broadcast.cid = this.#cid = v;

        this.#start_ts = Math.floor(Date.now() / 1e3);

        this.#abortController.abort();
        this.#abortController = new AbortController();
        this.dispatchEvent(new Event('--playurl'));
        this.dispatchEvent(new Event('--view'));
        this.dispatchEvent(new Event('--videoshot'));
        clearInterval(this.#heartbeat);
        this.noVTReport || setInterval(() => {
            this.video.paused || this.dispatchEvent(new CustomEvent('--heartbeat', { detail: HEART_BEAT.DEFAULT }));
        }, 15e3);
        // 弹幕保护计划
        Medal.clear();
        switch (v) {
            case 66926n:
            case 321744n:
            case 329896n:
            case 469970n:
            case 1474616n: {
                new Medal('检测到弹幕丢失，是否使用备份恢复？', '遗失的弹幕', { label: '替换', callback: () => { this.dispatchEvent(new CustomEvent('--lostDanmaku', { detail: true })) } }, { label: '追加', callback: () => { this.dispatchEvent(new CustomEvent('--lostDanmaku', { detail: false })) } }, { label: '取消' });
                break;
            }
        }
    }
    season_id = 0n;
    ep_id = 0n;
    type?: ContentType;
    #broadcast = new Broadcast(this);
    #online?: number;
    get online() {
        return this.#online;
    }
    set online(payload) {
        this.#online = payload;
        port.postMessage({ type: 'ONLINE_NUMBER', payload });
    }
    #start_ts = Math.floor(Date.now() / 1e3);
    #mid = 0;
    seasonType = 0;
    #heartbeat?: number;
    #history = 0;
    noAudioStream = false;
    noVTReport = false;
    constructor() {
        super();

        this.initSetting();

        import('../../../io/api.bilibili.com/x/web-interface/nav').then(({ data: { isLogin, mid } }) => {
            if (isLogin) {
                this.#mid = mid;
            }
        });
    }
    override connectedCallback() {
        super.connectedCallback();
        this.#implement.abort();
        this.#implement = new AbortController();

        this.quality.when('change').subscribe(() => {
            const qn = Number(this.quality.value);
            if (qn >= 0) {
                setItem('qn', qn);
                this.player?.onQnChange(this.qn = qn);
            } else {
                removeItem('qn');
            }
        }, { signal: this.#implement.signal });
        this.progress.when('pointermove').subscribe(async ({ offsetX }) => {
            const { clientWidth } = this.progress;
            const radio = offsetX / clientWidth;
            const { duration } = this.video;
            if (duration) {
                const v = duration * radio;
                if (this.#videoshotData) {
                    let { index, image, img_x_len, img_x_size, img_y_len, img_y_size } = this.#videoshotData;
                    // 当前时间戳对应的缩略图索引
                    const i = index.findIndex((d, i) => v >= index[i - 1]! && v < d);
                    if (i >= 0) {
                        // 当前图片链接
                        const pic = https(image[Math.floor(i / (img_x_len * img_y_len))]!);
                        if (!img_x_size || !img_y_size) {
                            // 当前缩略图正在加载中
                            const img = new Image();
                            img.setAttribute("crossOrigin", "anonymous");
                            img.src = pic;
                            const res = await img.when('load').first({ signal: this.#abortController.signal });
                            if (!res) return;
                            const { naturalWidth, naturalHeight } = img;
                            img_x_size = naturalWidth / img_x_len;
                            img_y_size = naturalHeight / img_y_len
                        }
                        [this.poster.style.backgroundImage, this.poster.dataset["dx"], this.poster.dataset["dy"], this.poster.dataset["dw"], this.poster.dataset["dh"]] = <[string, string, string, string, string]><unknown>[`url(${pic})`, ((i % (img_x_len * img_y_len)) % img_x_len) * img_x_size, Math.floor((i % (img_x_len * img_y_len)) / img_x_len) * img_y_size, img_x_size, img_y_size];
                    }
                }
            }
        }, { signal: this.#implement.signal });
        this.when('--playurl').switchMap<CustomEvent<((result: boolean) => void) | void>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<((result: boolean) => void) | void>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            if (!this.aid || !this.#cid) return Observable.from([]);
            return new Observable<IPlayurl>(subscriber => {
                const abortController = new AbortController();
                this.stage.playurl(1);
                this.playurl(abortController).then(data => {
                    subscriber.next(data);
                    detail?.(true);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (detail) {
                        detail(false);
                    } else {
                        this.toast(e);
                        this.stage.playurl(3);
                        this.player?.identify();
                        this.player = new NaivePlayer(this, '//s1.hdslb.com/bfs/static/player/media/error.mp4');
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(({ dash, durl, support_formats, quality: qualityReal, is_drm, drm_type }) => {
            if (dash) {
                this.stage.playurl(2);
                if (this.player instanceof DashPlayer) {
                    this.player.flush(dash);
                } else {
                    this.player?.identify();
                    this.player = new DashPlayer(this, dash);
                }
            } else if (durl?.[0]) {
                this.stage.playurl(2);
                this.player?.identify();
                this.player = new NaivePlayer(this, upos(durl[0].url, ...(durl[0].backup_url || [])).toJSON());
            } else {
                this.stage.playurl(3);
                this.player?.identify();
                this.player = new NaivePlayer(this, '//s1.hdslb.com/bfs/static/player/media/error.mp4');
            }

            // 更新画质选项
            this.quality.querySelectorAll('option').forEach(d => { d.remove() });
            let auto = '';
            const df = document.createDocumentFragment();
            const option = document.createElement('option');
            support_formats.forEach(({ quality, display_desc, superscript }) => {
                if (quality === qualityReal) {
                    auto = display_desc;
                }
                const d = <HTMLOptionElement>option.cloneNode();
                d.value = <any>quality;
                quality === this.qn && (d.selected = true);
                superscript && (d.dataset["label"] = superscript);
                d.text = display_desc;
                df.append(d);
            });
            option.value = '0';
            this.qn === 0 && (option.selected = true);
            auto && (option.dataset["label"] = `(${auto})`);
            option.text = '自动';
            df.append(option);
            this.quality.replaceChildren(df);

            if (is_drm) {
                new Medal('此视频被 DRM 加密，暂时无法播放😭', drm_type);
            }
        }, { signal: this.#implement.signal });
        this.when('--view').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            if (!this.aid || !this.#cid) return Observable.from([]);
            return new Observable<DanmakuElem[]>(subscriber => {
                const abortController = new AbortController();
                view(this.#cid, this.aid, { signal: AbortSignal.any([this.#abortController.signal, abortController.signal]) }).then(data => {
                    log(data);
                    const { dmSge, specialDms } = data;
                    const promises: Promise<unknown>[] = [];
                    if (dmSge) {
                        for (let i = 1; i <= dmSge.total; i++) {
                            promises.push(seg(this.#cid, this.aid, i, { signal: AbortSignal.any([this.#abortController.signal, abortController.signal]) }).then(({ elems }) => {
                                subscriber.next(elems);
                            }).catch(e => {
                                if (e.name === "AbortError") return;
                                error(e);
                            }));
                        }
                    }
                    if (specialDms) {
                        for (const url of specialDms) {
                            promises.push(fetch(https(url), { signal: AbortSignal.any([this.#abortController.signal, abortController.signal]) }).then(d => d.bytes()).then(d => DmSegMobileReply.decode(d)).then(({ elems }) => {
                                subscriber.next(elems);
                            }).catch(e => {
                                if (e.name === "AbortError") return;
                                error(e);
                            }));
                        }
                    }
                    Promise.allSettled(promises).finally(() => {
                        subscriber.complete();
                    })
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === "AbortError") return;
                    error(e);
                });
                return () => abortController.abort();
            });
        }).subscribe(elems => {
            this.danmaku.add(<any>elems);
        }, { signal: this.#implement.signal });
        this.when('--videoshot').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            if (!this.aid || !this.#cid) return Observable.from([]);
            return new Observable<IVideoshot>(subscriber => {
                const abortController = new AbortController();
                videoshot(this.aid, this.#cid, { signal: AbortSignal.any([this.#abortController.signal, abortController.signal]) }).then(({ code, message, data }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    const { pvdata } = data;
                    fetch(https(pvdata), { signal: AbortSignal.any([this.#abortController.signal, abortController.signal]) }).then(d => d.arrayBuffer()).then(buffer => {
                        const dataview = new DataView(buffer);
                        const uint = new Uint8Array(buffer.byteLength);
                        data.index = [];
                        for (let i = 0; i < uint.length; i += 2) {
                            const high = dataview.getUint8(i) << 8;
                            const low = dataview.getUint8(i + 1);
                            const index = high | low;
                            data.index.push(index);
                        }
                        subscriber.next(data);
                        subscriber.complete();
                    }).catch(e => {
                        subscriber.complete();
                        if (e.name === "AbortError") return;
                        error(e);
                    });
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === "AbortError") return;
                    error(e);
                });
                return () => abortController.abort();
            });
        }).subscribe(data => {
            this.#videoshotData = data;
        }, { signal: this.#implement.signal });
        this.when('--heartbeat').switchMap(e => {
            return new Observable<CustomEvent<HEART_BEAT>>(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<HEART_BEAT>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            const realtime = Math.floor(this.video.currentTime);
            if (this.noVTReport || !realtime || !this.#cid || this.#history === 2) return Observable.from([]);
            return new Observable(subscriber => {
                const abortController = new AbortController();
                const real_played_time = Math.max(Math.floor(Date.now() / 1e3) - this.#start_ts, 0);
                const type = this.type !== undefined ? 10 : this.ep_id ? 4 : 3;
                heartbeat(this.#cid, detail, realtime, this.#start_ts, real_played_time, realtime, type, this.aid, this.#mid, this.season_id, this.ep_id, this.seasonType, this.#history ? 1 : undefined, { signal: AbortSignal.any([this.#abortController.signal, abortController.signal]) }).then(({ code }) => {
                    subscriber.next(code);
                    subscriber.complete();

                }).catch(e => {
                    subscriber.complete();
                    if (e.name === "AbortError") return;
                    error(e);
                });
                return () => abortController.abort();
            });
        }).subscribe(() => { }, { signal: this.#implement.signal });
        this.when('--lostDanmaku').switchMap(e => {
            return new Observable<CustomEvent<boolean>>(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<boolean>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).subscribe(({ detail }) => {
            import(`./danmaku/${this.#cid}.xml`, { with: { type: 'text' } }).then(d => {
                detail && this.danmaku.identify();
                this.danmaku.addXml(d.default);
            })
        }, { signal: this.#implement.signal });

        this.video.when('playing').subscribe(() => {
            this.dispatchEvent(new CustomEvent('--heartbeat', { detail: HEART_BEAT.PLAYING }));
        }, { signal: this.#implement.signal });
        this.video.when('pause').subscribe(() => {
            this.dispatchEvent(new CustomEvent('--heartbeat', { detail: HEART_BEAT.PAUSE }));
        }, { signal: this.#implement.signal });
        this.video.when('seeked').subscribe(() => {
            this.dispatchEvent(new CustomEvent('--heartbeat', { detail: HEART_BEAT.SEEKED }));
        }, { signal: this.#implement.signal });
        this.video.when('ended').subscribe(() => {
            this.dispatchEvent(new CustomEvent('--heartbeat', { detail: HEART_BEAT.ENDED }));
        }, { signal: this.#implement.signal });
        this.video.when('emptied').subscribe(() => {
            this.dispatchEvent(new CustomEvent('--heartbeat', { detail: HEART_BEAT.ENDED }));
        }, { signal: this.#implement.signal });

        // 注册侧边栏
        portMessage('SIDE_PANEL_SET_OPTIONS', { path: '/sidePanel/player/index.html' });

        // 监听侧边栏消息
        port.when('message').subscribe(({ data: { type, payload } }) => {
            switch (type) {
                case 'SIDE_PANEL_CONNECT': {
                    this.online = this.#online;
                    break;
                }
                case 'BOFQI_SETTING': {
                    setItem('Bofqi_Setting', payload);
                    this.initSetting(payload);
                    break;
                }
            }
        }, { signal: this.#implement.signal });
        port.start();
    }
    override disconnectedCallback() {
        super.disconnectedCallback();
        this.#implement.abort();
    }
    override identify() {
        super.identify();
        this.#cid = 0n;
        this.#abortController.abort();
        this.#abortController = new AbortController();
        this.player?.identify();
        this.player = undefined;
        this.#videoshotData = undefined;
        this.quality.querySelectorAll('option').forEach(d => { d.remove() });
        this.quality.insertAdjacentHTML('beforeend', '<option value="0" selected>自动</option>');
        this.online = undefined;
    }
    private async playurl(abortController: AbortController) {
        if (this.ep_id) {
            if (this.type !== undefined) {
                switch (this.type) {
                    case ContentType.Pugv: {
                        const { code, message, data } = await pugv(this.aid, this.#cid, this.ep_id, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) });
                        if (code) throw new Error(`${code} ${message}`);
                        return data;
                    }
                    default: {
                        throw new Error(`不支持的播放器类型：ContentType.${ContentType[this.type]}`);
                    }
                }
            } else {
                const { code, message, result } = await pgc(this.aid, this.#cid, this.ep_id, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) });
                if (code) throw new Error(`${code} ${message}`);
                return result;
            }
        }
        const { code, message, data } = await ugc(this.aid, this.#cid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) });
        if (code) throw new Error(`${code} ${message}`);
        return data;
    }
    private async initSetting(setting?: Record<string, string>) {
        setting || (setting = await getItem<Record<string, string>>('Bofqi_Setting'));
        setting && Object.entries(setting).forEach(([key, value]) => {
            switch (key) {
                case 'opacity': case 'scale': case 'border': case 'font': {
                    this.danmaku.dataset[key] = value;
                    break;
                }
                case 'speed': {
                    const v = Number(value);
                    if (v) {
                        this.danmaku.speed = v;
                    }
                    break;
                }
                case 'codec': {
                    this.codecid = Number(value);
                    break;
                }
                case 'history': {
                    this.#history = Number(value);
                    break;
                }
            }
        })
    }
}
customElements.define(Player.is, Player);

export interface IPlayer {

    /** 画质切换 */
    onQnChange(qn: number): void;

    identify(): void;
}