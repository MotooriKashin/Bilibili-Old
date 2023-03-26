import { jsonCheck } from "../io/api";
import { apiPgcSlideShow } from "../io/api-pgc-slideshow";
import { apiSearchSquare } from "../io/api-search-square";
import { apiWebshowLoc } from "../io/api-webshow-locs";
import { URLS } from "../io/urls";
import { cdn } from "../utils/cdn";
import { DanmakuBase } from "../utils/danmaku";
import { debug } from "../utils/debug";
import { addCss, loadScript, loadStyle } from "../utils/element";
import { cht2chs } from "../utils/format/cht2chs";
import { objUrl, urlObj } from "../utils/format/url";
import { methodHook, propertyHook } from "../utils/hook/method";
import { xhrHook } from "../utils/hook/xhr";
import { poll } from "../utils/poll";
import { BLOD } from "./bilibili-old";
import { switchVideo } from "./observer";
import { localStorage } from "./storage";
import { toast } from "./toast";
import { alert } from "./ui/alert";
import { user } from "./user";

const danmakuProtect = [
    // 96048, // 【幸运星组曲】「らき☆すた動画」
    207527, // 【呆又呆】鹿乃呆? 弹幕呆?
    329896, // 【白屏弹幕】10 years after
    469970, // 【黑屏弹幕】美丽之物【Soundhorizon】
    1474616, // 繁星梅露露(弹幕版)
    4335759, // 【弹幕PV】世界终结舞厅
    384460933, // 【弹幕祭应援】 緋色月下、狂咲ノ絶-1st Anniversary Remix
];

/** 播放器引导 */
class Player {
    /** 播放器启动参数修改回调栈 */
    protected modifyArgumentCallback: ((args: IArguments) => void)[] = [];
    /** 添加播放器启动参数修改命令 */
    addModifyArgument(callback: (args: IArguments) => void) {
        this.modifyArgumentCallback.push(callback);
    }
    /** 捕获的新版播放器 */
    protected nanoPlayer: any;
    protected connect: any;
    protected isConnect: boolean = false;

    /** 已加载播放器 */
    protected playLoaded = false;
    constructor() {
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
        // 嵌入播放器默认宽屏
        window.self === window.top || this.addModifyArgument(args => {
            const obj = urlObj(`?${args[2]}`);
            obj.as_wide = 1;
            args[2] = objUrl('', obj);
        })
    }
    /** 修改播放器启动参数 */
    protected modifyArgument(args: IArguments) {
        while (this.modifyArgumentCallback.length) {
            this.modifyArgumentCallback.shift()?.(args);
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
    protected EmbedPlayer(loadPlayer: Function, isEmbedPlayer = true) {
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
    protected connectPlayer(loadPlayer: Function) {
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
                    volume: { get: () => (<any>window).player?.volume },
                    isInitialized: { value: () => true }
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
    /** 引导旧播放器 */
    loadEmbedPlayer() {
        if (!this.playLoaded) {
            this.playLoaded = true;
            this.EmbedPlayer(() => this.loadplayer());
            this.playerSettings();
        }
    }
    /** 替换新版播放器 */
    loadConnectPlayer() {
        if (!this.playLoaded) {
            this.playLoaded = true;
            this.connectPlayer(() => this.loadplayer());
            this.playerSettings();
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
            user.userStatus!.danmakuProtect && this.danmakuProtect();
        });
    }
    private playbackRateTimer?: number;
    /** 更改播放器速率 */
    playbackRate(playbackRate = 1) {
        clearTimeout(this.playbackRateTimer);
        this.playbackRateTimer = setTimeout(() => {
            const video = document.querySelector<HTMLVideoElement>('#bilibiliPlayer video');
            if (!video) return toast.warning('未找到播放器！请在播放页面使用。');
            video.playbackRate = Number(playbackRate)
        }, 100);
    }
    /** 繁体字幕转简体 */
    private simpleChinese() {
        if (user.userStatus!.simpleChinese) {
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
                                                    toast.warning('字幕：繁 -> 简', `原始语言：${d.lan_doc}`)
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
    /** 弹幕保护计划 */
    private danmakuProtect() {
        if (!(<any>window).player?.appendDm) return;
        const cid = Number(BLOD.cid);
        if (cid && danmakuProtect.includes(cid)) {
            alert('此视频高级弹幕部分丢失，点击确认加载备份弹幕。<br>※ 请在原弹幕加载完后再点确定，以免备份弹幕被覆盖。', '弹幕保护计划', [
                {
                    text: '确定',
                    callback: () => {
                        const msg = toast.list('弹幕保护计划 >>>');
                        GM.fetch(cdn.encode(`/danmaku/${cid}.xml`, ''), { cache: 'force-cache' })
                            .then(d => {
                                msg.push(`> 获取存档：${cid}.xml`);
                                msg.type = 'success';
                                return d.text();
                            })
                            .then(d => {
                                const dm = DanmakuBase.decodeXml(d);
                                (<any>window).player.appendDm(dm, !user.userStatus!.dmContact);
                                msg.push(`> 有效弹幕数：${dm.length}`, `> 加载模式：${user.userStatus!.dmContact ? '与已有弹幕合并' : '清空已有弹幕'}`);
                            })
                            .catch(e => {
                                msg.push(e);
                                msg.type = 'error';
                            })
                            .finally(() => {
                                msg.delay = user.userStatus!.toast.delay;
                            })
                    }
                },
                {
                    text: '取消'
                }
            ], true)
        }
    }
    /** 备份播放器设置 */
    protected playerSettings() {
        const local = localStorage.getItem('bilibili_player_settings');
        if (local) {
            GM.setValue('bilibili_player_settings', local);
        } else {
            GM.getValue('bilibili_player_settings').then(d => {
                d && localStorage.setItem('bilibili_player_settings', d);
            })
        }
    }
    /** 正在更新播放器 */
    protected updating = false;
    /**
     * 加载播放器
     * @param force 强制更新
     */
    async loadplayer(force = false) {
        if (!(<any>window).jQuery) await loadScript(URLS.JQUERY);
        try {
            if (user.userStatus!.bilibiliplayer) {
                if (_UserScript_) {
                    const data = await Promise.all([
                        GM.getValue<string>('bilibiliplayer'),
                        GM.getValue<string>('bilibiliplayerstyle')
                    ]);
                    if (force || !data[0] || !data[1]) {
                        if (this.updating) throw new Error('一次只能运行一个更新实例！');
                        this.updating = true;
                        if (!BLOD.version) throw new Error(`未知错误导致脚本版本异常！version：${BLOD.version}`);
                        const msg = toast.list('更新播放器组件 >>>', '> 可能需要花费一点时间，请不要关闭页面！',
                            '> 如果弹出跨域提醒，推荐【总是允许全部域名】',
                            '> 如果多次更新失败，请禁用【重构播放器】功能！');
                        let i = 1;
                        await Promise.all([
                            GM.fetch(cdn.encode('/chrome/player/video.js'))
                                .then(d => d.text())
                                .then(d => {
                                    data[0] = d;
                                    msg.push(`> 加载播放器组件：${i++}/2`);
                                })
                                .catch(e => {
                                    msg.push(`> 获取播放器组件出错！${i++}/2`, e);
                                    msg.type = 'error';
                                }),
                            GM.fetch(cdn.encode('/chrome/player/video.css'))
                                .then(d => d.text())
                                .then(d => {
                                    data[1] = d;
                                    msg.push(`> 加载播放器组件：${i++}/2`);
                                })
                                .catch(e => {
                                    msg.push(`> 获取播放器组件出错！${i++}/2`, e);
                                    msg.type = 'error';
                                })
                        ]);
                        this.updating = false;
                        msg.delay = user.userStatus!.toast.delay;
                        if (!data[0] || !data[1]) {
                            msg.push('fin <<<');
                            throw new Error('获取播放器组件出错！');
                        }
                        msg.push('> -------加载成功-------');
                        msg.type = 'success';
                        GM.setValue('bilibiliplayer', data[0]);
                        GM.setValue('bilibiliplayerstyle', data[1]);
                    }
                    new Function(data[0])();
                    addCss(data[1], `bilibiliplayer-${BLOD.version}`);
                    GM.setValue('version', BLOD.version);

                } else {
                    await Promise.all([
                        GM.executeScript('player/video.js', true)
                            .then(d => loadScript(d)),
                        GM.insertCSS('player/video.css', true)
                            .then(d => loadStyle(d))
                    ]);
                }
            } else {
                await loadScript(URLS.VIDEO);
                addCss('.bilibili-player-video-progress-detail-img {transform: scale(0.333333);transform-origin: 0px 0px;}', 'detail-img');
            }
        } catch (e) {
            this.updating || toast.error('播放器加载失败！', '已回滚~', e)();
            await loadScript(URLS.VIDEO);
            addCss('.bilibili-player-video-progress-detail-img {transform: scale(0.333333);transform-origin: 0px 0px;}', 'detail-img');
        }
    }
}
/** 播放器组件 */
export const player = new Player();

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