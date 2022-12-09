import { User } from "./core/user";
import { UrlCleaner } from "./core/url";
import { userStatus } from "./core/userstatus";
import { PageIndex } from "./page";
import { ToastContainer } from "./core/toast";
import { Header } from "./page/header";
import { Comment } from "./core/comment";
import { Player } from "./core/player";
import { WebTRC } from "./core/webrtc";
import { PageAV } from "./page/av";
import { PageBangumi } from "./page/bangumi";
import networkMock from './json/networkMock.json';
import { PageWatchlater } from "./page/watchalter";
import { PagePlaylist } from "./page/playlist";
import { PageRanking } from "./page/ranking";
import { PageRead } from "./page/read";
import { PageSearch } from "./page/search";
import { VideoLimit } from "./core/videolimit";
import { PageSpace } from "./page/space";
import { PageMedia } from "./page/media";
import { PageHistory } from "./page/history";
import { PageDynamic } from "./page/dynamic";
import { UI } from "./core/ui";
import { addCss, loadScript, loadStyle } from "./utils/element";
import { Automate } from "./core/automate";
import { localStorage } from "./core/storage";
import { PageLive } from "./page/live";
import { ReportObserver } from "./core/report";
import { VideoInfo } from "./core/video-info";
import { Download } from "./core/download";
import { GM as GMC } from "@blod/extension/utils/gm";
import { xhrHook } from "./utils/hook/xhr";
import { URLS } from "./io/urls";

export class BLOD {
    /** 用户数据管理 */
    user = new User(this);
    /** url净化 */
    urlCleaner = new UrlCleaner();
    /** toastr */
    toast = new ToastContainer();
    /** 解除限制 */
    videoLimit = new VideoLimit(this);
    /** 视频数据 */
    videoInfo = new VideoInfo(this);
    /** 下载 */
    download = new Download(this);
    /** 用户数据加载回调序列 */
    userLoadedCallbacks: ((status: typeof userStatus) => void)[] = [];
    /** 用户数据。确认已异步返回才可用，否则请使用`userLoadedCallback`添加回调 */
    status = userStatus;
    /** 路径拆分 */
    path = location.href.split('/');
    /** bangumi标记 */
    pgc = false;
    get aid() {
        return (<any>window).aid;
    };
    set aid(v) {
        (<any>window).aid = v;
    }
    get cid() {
        return (<any>window).cid;
    };
    set cid(v) {
        (<any>window).cid = v;
    }
    /** bangumi ssid */
    ssid!: number;
    /** bangumi epid */
    epid!: number;
    /** 限制视频 */
    limit?: number;
    /** bangumi特殊背景 */
    bkg_cover?: string;
    /** 东南亚视频标记 */
    th!: boolean;
    /** 播放器已加载 */
    playLoaded = false;
    /** 已模拟APP端取流 */
    networkMocked = false;
    /** 设置界面 */
    ui?: UI;
    /** 是否大会员 */
    isVip = false;
    /** 播放器哈希值 */
    version?: string;
    /** @param GM 提权操作接口 */
    constructor(public GM: typeof GMC) {
        this.version = this.GM.info?.script.version.slice(-40);
        // 初始化用户数据
        this.userLoadedCallback(status => {
            this.status = status;
            this.init();
        });
        // 无需用户数据模块
        this.bpxPlayerProfile();
        this.path[2] == "message.bilibili.com" && Header.message();
        Header.videoOffset();
        /space\.bilibili\.com/.test(location.href) && new PageSpace(this);
        /bangumi\/media\/md/.test(location.href) && new PageMedia(this);
        location.href.includes("www.bilibili.com/account/history") && new PageHistory(this);
        this.path[2] == "live.bilibili.com" && new PageLive(this);
        this.path[2] == "t.bilibili.com" && new PageDynamic(this);
    }
    /** 需要用户数据的模块 */
    protected init() {
        if (this.path[2] == 'www.bilibili.com' && (!this.path[3] || (this.path[3].startsWith('\?') || this.path[3].startsWith('\#') || this.path[3].startsWith('index.')))) {
            this.status.index && new PageIndex(this);
        }
        if (this.status.av && /(\/s)?\/video\/[AaBb][Vv]/.test(location.href)) {
            // SEO重定向
            this.path[3] === "s" && this.urlCleaner.updateLocation(location.href.replace("s/video", "video"));
            this.EmbedPlayer();
            new PageAV(this);
        }
        if (this.status.player && (/\/festival\//.test(location.href) || (/player\./.test(location.href) && !location.href.includes("ancient")))) {
            this.EmbedPlayer();
        }
        if (this.status.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href)) {
            this.EmbedPlayer();
            new PageBangumi(this);
        }
        if (this.status.watchlater && /\/watchlater/.test(location.href)) {
            this.EmbedPlayer();
            new PageWatchlater(this);
        }
        if ((this.status.playlist && /\/medialist\/play\//.test(location.href) && !/watchlater/.test(location.href)) || /\/playlist\/video\/pl/.test(location.href)) {
            this.EmbedPlayer();
            new PagePlaylist(this);
        }
        if (this.status.ranking && /\/v\/popular\//.test(location.href)) {
            new PageRanking(this);
        }
        if (this.status.read && /\/read\/[Cc][Vv]/.test(location.href)) {
            new PageRead(this);
        }
        if (this.status.search && this.path[2] == "search.bilibili.com") {
            new PageSearch(this);
        }
        new Automate(this);
        this.toast.update(this.status.toast);
        this.status.disableReport && new ReportObserver();
        this.status.videoLimit.status && this.videoLimit.enable();
        this.status.fullBannerCover && (Header.fullBannerCover = true);
        this.status.header && new Header(this);
        this.status.comment && new Comment(this);
        this.status.webRTC || WebTRC.disable();
        this.status.album && /t.bilibili.com\/\d+/.test(location.href) && PageSpace.album();
        this.status.development && Reflect.defineProperty(window, 'BLOD', {
            value: this,
            configurable: true
        });
        window.top === window.self && (this.ui = new UI(this));
    }
    /** 播放器引导 */
    EmbedPlayer() {
        if (!this.playLoaded) {
            this.playLoaded = true;
            new Player(this);
        }
    }
    /** 用户数据回调 */
    userLoadedCallback(callback: (status: typeof userStatus) => void) {
        if (this.user) {
            this.user.addCallback(callback);
        } else {
            this.userLoadedCallbacks.push(callback);
        }
    }
    /**
     * 修改xhr响应
     * @param target 目标XMLHttpRequest
     * @param res GM.xmlHttpRequest响应
     * @param v 目标XMLHttpRequest对应的回调
     */
    private defineRes(target: XMLHttpRequest, res: any, v: () => void) {
        Object.defineProperties(target, {
            status: {
                configurable: true,
                writable: true,
                value: res.status
            },
            statusText: {
                configurable: true,
                writable: true,
                value: res.statusText
            },
            response: {
                configurable: true,
                writable: true,
                value: res.response
            },
            responseText: {
                configurable: true,
                writable: true,
                value: res.responseText
            },
            responseXML: {
                configurable: true,
                writable: true,
                value: res.responseXML
            },
            responseURL: {
                configurable: true,
                writable: true,
                value: res.finalUrl
            }
        });
        v();
    }
    /** 模拟APP端取流 */
    networkMock() {
        if (!this.networkMocked) {
            this.networkMocked = true;
            if (_UserScript_) {
                const that = this;
                xhrHook.ultra('.m4s', function (target, args) {
                    const obj: any = {
                        method: <"GET" | "HEAD" | "POST">args[0],
                        url: args[1],
                        headers: {
                            "user-agent": that.status.userAgent
                        },
                        onloadstart: (res: any) => {
                            that.defineRes(this, res, () => { });
                        }
                    }
                    args[2] || (obj.anonymous = true);
                    Object.defineProperties(this, {
                        responseType: {
                            configurable: true,
                            set: v => {
                                obj.responseType = v;
                            },
                            get: () => obj.responseType
                        },
                        onload: {
                            configurable: true,
                            set: v => {
                                obj.onload = (res: any) => {
                                    that.defineRes(this, res, v);
                                }
                            },
                            get: () => obj.onload
                        },
                        onerror: {
                            configurable: true,
                            set: v => {
                                obj.onerror = (res: any) => {
                                    that.defineRes(this, res, v);
                                }
                            },
                            get: () => obj.onerror
                        },
                        timeout: {
                            configurable: true,
                            set: v => {
                                obj.timeout = v
                            },
                            get: () => obj.timeout
                        },
                        ontimeout: {
                            configurable: true,
                            set: v => {
                                obj.ontimeout = (res: any) => {
                                    that.defineRes(this, res, v);
                                }
                            },
                            get: () => obj.ontimeout
                        },
                        onprogress: {
                            configurable: true,
                            set: v => {
                                obj.onprogress = (res: any) => {
                                    that.defineRes(this, res, v.bind(this, new ProgressEvent("progress", {
                                        lengthComputable: res.lengthComputable,
                                        loaded: res.loaded,
                                        total: res.total
                                    })));
                                }
                            },
                            get: () => obj.onprogress
                        },
                        onabort: {
                            configurable: true,
                            set: v => {
                                obj.onabort = (res: any) => {
                                    that.defineRes(this, res, v);
                                }
                            },
                            get: () => obj.onabort
                        },
                        onreadystatechange: {
                            configurable: true,
                            set: v => {
                                obj.onreadystatechange = (res: any) => {
                                    that.defineRes(this, res, v);
                                }
                            },
                            get: () => obj.onreadystatechange
                        },
                        setRequestHeader: {
                            configurable: true,
                            value: (name: string, value: string) => {
                                obj.headers && (obj.headers[name] = value);
                            }
                        },
                        send: {
                            configurable: true,
                            value: (body?: any) => {
                                obj.method === "POST" && body && (obj.data = body);
                                const tar = that.GM.xmlHttpRequest(obj);
                                this.abort = tar.abort.bind(tar);
                                return true;
                            }
                        }
                    })
                })
            } else {
                this.GM.updateSessionRules(networkMock);
            }
        }
    }
    /**
     * 监听设置改动
     * @param key 设置键
     * @param callback 设置项变动时执行的回调，新值将作为第一个参数传入
     * @returns 用于取消监听的回调
     */
    bindStatusChange<T extends keyof typeof userStatus>(key: T, callback: (newValue: (typeof userStatus)[T]) => void) {
        return this.user.bindChange(key, callback);
    }
    /**
     * 链式获取目标对象的值
     * @param key 链式字符串
     * @param obj 目标对象（默认为用户数据）
     * @returns 用户数据
     * @example
     * getStatus('toast.disabled') // userStatus.toast.disabled
     */
    getStatus(key: string, obj: object = this.status) {
        const arr = key.split('.');
        let status: any = obj;
        while (status && arr.length) {
            const d = arr.shift();
            d && (status = status[d]);
        }
        return status;
    }
    /**
     * 链式设置目标对象的值
     * @param key 链式字符串
     * @param value 用户数据
     * @param obj 目标对象（默认为用户数据）
     * @example
     * setStatus('toast.disabled', false) // userStatus.toast.disabled
     */
    setStatus(key: string, value: any, obj: object = this.status) {
        try {
            const arr = key.split('.');
            let target: any = obj;
            key = <any>undefined;
            while (arr.length) {
                key && (target = target[key]);
                key = <any>arr.shift();
            }
            target[key] = value;
        } catch { }
    }
    /** Bilibili快捷登录 */
    biliQuickLogin() {
        (<any>window).biliQuickLogin ? (<any>window).biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => this.biliQuickLogin());
    }
    /** 禁止bpx-player自动播放 */
    protected bpxPlayerProfile() {
        try {
            const bpx_player_profile = localStorage.getItem("bpx_player_profile") || { media: { autoplay: false } };
            bpx_player_profile.media.autoplay = false;
            localStorage.setItem("bpx_player_profile", bpx_player_profile);
        } catch (e) { }
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
            if (_UserScript_) {
                if (this.status.bilibiliplayer) {
                    const data = await Promise.all([
                        this.GM.getValue<string>('bilibiliplayer'),
                        this.GM.getValue<string>('bilibiliplayerstyle')
                    ]);
                    if (force || !data[0] || !data[1]) {
                        if (this.updating) throw new Error('一次只能运行一个更新实例！');
                        this.updating = true;
                        if (!this.version) throw new Error(`未知错误导致脚本版本异常！version：${this.version}`);
                        const msg = [
                            '更新播放器组件中，可能需要花费一点时间，请不要关闭页面！',
                            '如果弹出跨域提醒，推荐【总是允许全部域名】',
                            '如果多次更新失败，请禁用【重构播放器】功能！'
                        ];
                        const toast = this.toast.toast(0, 'warning', ...msg);
                        let i = 1;
                        await Promise.all([
                            this.GM.fetch(`https://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@${this.version}/extension/player/video.js`)
                                .then(d => d.text())
                                .then(d => {
                                    data[0] = d;
                                    msg.push(`加载播放器组件：${i++}/2`);
                                    toast.data = msg;
                                })
                                .catch(e => {
                                    msg.push(`获取播放器组件出错！${i++}/2`, e);
                                    toast.data = msg;
                                    toast.type = 'error';
                                }),
                            this.GM.fetch(`https://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@${this.version}/extension/player/video.css`)
                                .then(d => d.text())
                                .then(d => {
                                    data[1] = d;
                                    msg.push(`加载播放器组件：${i++}/2`);
                                    toast.data = msg;
                                })
                                .catch(e => {
                                    msg.push(`获取播放器组件出错！${i++}/2`, e);
                                    toast.data = msg;
                                    toast.type = 'error';
                                })
                        ]);
                        this.updating = false;
                        toast.delay = this.status.toast.delay;
                        if (!data[0] || !data[1]) throw new Error('获取播放器组件出错！');
                        msg.push('-------加载成功-------');
                        toast.data = msg;
                        toast.type = 'success';
                        this.GM.setValue('bilibiliplayer', data[0]);
                        this.GM.setValue('bilibiliplayerstyle', data[1]);
                    }
                    new Function(data[0])();
                    addCss(data[1], `bilibiliplayer-${this.version}`);
                    this.GM.setValue('version', this.version);

                } else {
                    await loadScript(URLS.VIDEO);
                }
            } else {
                await Promise.all([
                    this.GM.executeScript('player/video.js', true)
                        .then(d => loadScript(d)),
                    this.GM.insertCSS('player/video.css', true)
                        .then(d => loadStyle(d))
                ]);
            }
        } catch (e) {
            this.updating || this.toast.error('播放器加载失败！', '已回滚~', e)();
            await loadScript(URLS.VIDEO);
        }
    }
}

//////////////////////////// 全局定义 ////////////////////////////
declare global {
    /** 脚本编译时生成的唯一标记，用于唯一标志脚本身份 */
    const _MUTEX_: string;
    /** 用户脚本标记，用到GM接口时可能有必要通过此标记判定使用方法 */
    const _UserScript_: boolean;
}