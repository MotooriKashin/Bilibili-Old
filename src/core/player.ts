import { BLOD } from "../bilibili-old";
import { jsonCheck } from "../io/api";
import { apiPgcSlideShow } from "../io/api-pgc-slideshow";
import { apiSearchSquare } from "../io/api-search-square";
import { apiWebshowLoc } from "../io/api-webshow-locs";
import { DanmakuBase } from "../utils/danmaku";
import { debug } from "../utils/debug";
import { addCss } from "../utils/element";
import { cht2chs } from "../utils/format/cht2chs";
import { objUrl } from "../utils/format/url";
import { methodHook, propertyHook } from "../utils/hook/method";
import { xhrHook } from "../utils/hook/xhr";
import { poll } from "../utils/poll";
import { switchVideo } from "./observer";
import { localStorage } from "./storage";
import { alert } from "./ui/alert";

const danmakuProtect = [
    469970, // 【黑屏弹幕】美丽之物【Soundhorizon】
    384460933 // 【弹幕祭应援】 緋色月下、狂咲ノ絶-1st Anniversary Remix
];

/** 播放器引导 */
export class Player {
    /** 播放器启动参数修改回调栈 */
    protected static modifyArgumentCallback: ((args: IArguments) => void)[] = [];
    /** 添加播放器启动参数修改命令 */
    static addModifyArgument(callback: (args: IArguments) => void) {
        this.modifyArgumentCallback.push(callback);
    }
    /** 捕获的新版播放器 */
    protected nanoPlayer: any;
    protected connect: any;
    protected isConnect: boolean = false;
    constructor(private BLOD: BLOD) {
        // 3.x播放器
        propertyHook.modify(window, 'nano', (v: any) => {
            debug('捕获新版播放器！')
            const createPlayer = v.createPlayer;
            const that = this;
            propertyHook(v, 'createPlayer', function () {
                debug('新版播放器试图启动！')
                if (that.isEmbedPlayer) throw new Error('爆破新版播放器！');
                that.nanoPlayer = createPlayer.call(v, ...arguments);
                (<any>that).createPlayer(...arguments); // 记录播放器初始化参数
                that.connect = that.nanoPlayer.connect;
                that.nanoPlayer.connect = function () {
                    if (that.isConnect) {
                        debug('允许新版播放器启动！')
                        return that.connect?.();
                    } else {
                        that.isConnect = true;
                        return Promise.resolve(true);
                    }
                }
                return that.nanoPlayer;
            });
            if ((<any>window).player) {
                try {
                    const manifest = (<any>window).player?.getManifest();
                    debug('播放器实例已存在，可能脚本注入过慢！', manifest);
                    manifest && this.createPlayer(manifest);
                } catch (e) {
                    debug('读取播放器启动参数失败！', e);
                }
            }
            return v;
        });
    }
    /** 修改播放器启动参数 */
    protected modifyArgument(args: IArguments) {
        while (Player.modifyArgumentCallback.length) {
            Player.modifyArgumentCallback.shift()?.(args);
        }
    }
    protected initData: Record<string, any> = {};
    protected dataInited = false;
    protected createPlayer(initData: NanoInitData, theme?: Record<string, string>) {
        this.dataInited = true;
        Object.entries(initData).forEach(d => {
            switch (typeof d[1]) {
                case 'bigint':
                case 'boolean':
                case 'number':
                case 'string':
                case 'undefined':
                    this.initData[d[0]] = d[1];
                    break;
                default:
                    break;
            }
        });
        this.initData.as_wide = true; // 需要替换3.x播放器的场合还是强制宽屏启动吧
        this.dataInitedCallback();
    }
    /** 脚本初始化中 */
    // private loading = true;
    /** 旧版播放器已启用 */
    private isEmbedPlayer = false;
    /** 旧版播放器正常引导 */
    EmbedPlayer(loadPlayer: Function, isEmbedPlayer = true) {
        this.nanoPermit = () => { } // 禁止放行新版播放器
        // this.loading = false; // 脚本初始化完成
        this.isEmbedPlayer = isEmbedPlayer; // 旧版播放器正常引导
        // 1.x/2.x播放器
        methodHook(window, 'EmbedPlayer', () => loadPlayer(), d => this.modifyArgument(d));
        if ((<any>window).player?.disconnect) {
            try {
                debug('爆破新版播放器!');
                (<any>window).player.disconnect();
                this.nanoPlayer || (this.nanoPlayer = (<any>window).player);
            } catch { }
        }
        this.switchVideo();
        this.simpleChinese();
    }
    /** 通过hook新版播放器来引导旧版播放器 */
    connectPlayer(loadPlayer: Function) {
        this.EmbedPlayer(loadPlayer, false);
        this.dataInitedCallback(() => {
            // 记录播放器初始化参数后引导播放器
            (<any>window).EmbedPlayer('player', '', objUrl('', <any>this.initData));
            if (this.nanoPlayer) {
                // 为3.x播放器代理player实例方法
                Object.defineProperties(this.nanoPlayer, {
                    addEventListener: { get: () => (<any>window).player?.addEventListener },
                    directiveDispatcher: { get: () => (<any>window).player?.directiveDispatcher },
                    editorCenter: { get: () => (<any>window).player?.editorCenter },
                    exitFullScreen: { get: () => (<any>window).player?.exitFullScreen },
                    getCurrentTime: { get: () => (<any>window).player?.getCurrentTime },
                    getDuration: { get: () => (<any>window).player?.getDuration },
                    next: { get: () => (<any>window).player?.next },
                    ogvUpdate: { get: () => (<any>window).player?.ogvUpdate },
                    pause: { get: () => (<any>window).player?.pause },
                    play: { get: () => (<any>window).player?.play },
                    prev: { get: () => (<any>window).player?.prev },
                    reload: { get: () => (<any>window).player?.reload },
                    seek: { get: () => (<any>window).player?.seek },
                    stop: { get: () => (<any>window).player?.stop },
                    volume: { get: () => (<any>window).player?.volume }
                })
            }
        });
        // 修正播放器样式
        addCss(`#bofqi .player,#bilibili-player .player{width: 100%;height: 100%;display: block;}.bilibili-player .bilibili-player-auxiliary-area{z-index: 1;}`, 'nano-fix');
    }
    /** 不启用旧版播放器允许新版播放器启动 */
    nanoPermit() {
        // this.loading = false;
        if (this.isConnect) {
            debug('允许新版播放器启动！');
            this.connect?.()
        } else {
            this.isConnect = true;
        }
    }
    /** 播放器启动栈 */
    private dataInitedCallbacks: Function[] = [];
    /** 捕获启动数据后启动播放器 */
    private dataInitedCallback(callback?: Function) {
        callback && this.dataInitedCallbacks.push(callback);
        if (this.dataInited) {
            while (this.dataInitedCallbacks.length) {
                this.dataInitedCallbacks.shift()?.();
            }
        }
    }
    private regised = false;
    private switchVideo() {
        if (this.regised) return;
        this.regised = true;
        let cache: any;
        switchVideo(() => {
            if ((<any>window).player.appendTopMessage) {
                const cfg = localStorage.getItem('bilibili_player_settings');
                poll(() => document.querySelector('.bilibili-player-video-message-panel'), () => {
                    if (cache) {
                        (<any>window).player.appendTopMessage(cache)
                    } else if (cfg.message) {
                        const message = Object.keys(cfg.message).filter(d => cfg.message[d]).sort(() => 0.5 - Math.random());
                        if (message[0]) {
                            switch (message[0]) {
                                case 'system':
                                    apiWebshowLoc(4694)
                                        .then(d => {
                                            (<any>window).player.appendTopMessage(cache = d.filter(d => d.name).map(d => {
                                                return {
                                                    url: d.url,
                                                    type: message[0],
                                                    name: d.name
                                                }
                                            }))
                                        })
                                        .catch(e => {
                                            debug.error('播放器通知', e)
                                        });
                                    break;
                                case 'bangumi':
                                    apiPgcSlideShow(531)
                                        .then(d => {
                                            (<any>window).player.appendTopMessage(cache = d.map(d => {
                                                return {
                                                    url: d.blink,
                                                    type: message[0],
                                                    name: d.title
                                                }
                                            }))
                                        })
                                        .catch(e => {
                                            debug.error('播放器通知', e)
                                        });
                                    break;
                                case 'news':
                                    apiSearchSquare()
                                        .then(d => {
                                            (<any>window).player.appendTopMessage(cache = d.map(d => {
                                                return {
                                                    url: d.uri || `//search.bilibili.com/all?keyword=${encodeURIComponent(d.keyword)}`,
                                                    type: message[0],
                                                    name: d.show_name || d.keyword
                                                }
                                            }))
                                        })
                                        .catch(e => {
                                            debug.error('播放器通知', e)
                                        });
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                })
            }
            this.BLOD.status.danmakuProtect && this.danmakuProtect();
        });
    }
    private playbackRateTimer?: number;
    /** 更改播放器速率 */
    playbackRate(playbackRate = 1) {
        clearTimeout(this.playbackRateTimer);
        this.playbackRateTimer = setTimeout(() => {
            const video = document.querySelector<HTMLVideoElement>('#bilibiliPlayer video');
            if (!video) return this.BLOD.toast.warning('未找到播放器！请在播放页面使用。');
            video.playbackRate = Number(playbackRate)
        }, 100);
    }
    /** 繁体字幕转简体 */
    private simpleChinese() {
        if (this.BLOD.status.simpleChinese) {
            xhrHook('x/player/v2?', undefined, res => {
                try {
                    const response = jsonCheck(res.response);
                    if (response?.data?.subtitle?.subtitles?.length) {
                        response.data.subtitle.subtitles.forEach((d: any) => {
                            if (typeof d.subtitle_url === 'string') {
                                switch (d.lan) {
                                    case 'zh-Hant':
                                        xhrHook(d.subtitle_url, undefined, res => {
                                            try {
                                                let response = res.responseType === 'json' ? JSON.stringify(res.response) : res.responseText;
                                                if (response) {
                                                    response = cht2chs(response);
                                                    if (res.responseType === 'json') {
                                                        res.response = JSON.parse(response)
                                                    } else {
                                                        res.response = res.responseText = response;
                                                    }
                                                    this.BLOD.toast.warning('字幕：繁 -> 简', `原始语言：${d.lan_doc}`)
                                                }
                                            } catch (e) {
                                                debug.error('繁 -> 简', e);
                                            }
                                        })
                                        break;
                                    default:
                                        break;
                                }
                            }
                        })
                    }
                } catch { }
            }, false);
        }
    }
    private danmakuProtect() {
        if (!(<any>window).player?.appendDm) return;
        const cid = Number(this.BLOD.cid);
        if (cid && danmakuProtect.includes(cid)) {
            alert('此视频高级弹幕部分丢失，点击确认加载备份弹幕。<br>※ 请在原弹幕加载完后再点确定，以免备份弹幕被覆盖。', '弹幕保护计划', [
                {
                    text: '确定',
                    callback: () => {
                        const data = ['弹幕保护计划 >>>'];
                        const toast = this.BLOD.toast.toast(0, 'info', ...data);
                        this.BLOD.GM.fetch(this.BLOD.cdn.encode(`/danmaku/${cid}.xml`, ''), { cache: 'force-cache' })
                            .then(d => {
                                data.push(`获取存档：${cid}.xml`);
                                toast.data = data;
                                toast.type = 'success';
                                return d.text();
                            })
                            .then(d => {
                                const dm = DanmakuBase.decodeXml(d);
                                (<any>window).player.appendDm(dm, !this.BLOD.status.dmContact);
                                data.push(`有效弹幕数：${dm.length}`, `加载模式：${this.BLOD.status.dmContact ? '与已有弹幕合并' : '清空已有弹幕'}`);
                                toast.data = data;
                            })
                            .catch(e => {
                                data.push(e);
                                debug.error('弹幕保护计划', e);
                                toast.data = data;
                                toast.type = 'error';
                            })
                            .finally(() => {
                                toast.delay = this.BLOD.status.toast.delay;
                            })
                    }
                },
                {
                    text: '取消'
                }
            ], true)
        }
    }
}

interface NanoInitData {
    aid: number;
    cid: number;
    bvid: string;
    revision: number
    featureList: Set<string>,
    enableAV1: boolean;
    enableWMP: boolean;
    enableHEVC: boolean;
    hideBoxShadow: boolean;
    t: number;
    kind: number;
    element: HTMLDivElement;
    auxiliary: HTMLDivElement;
}