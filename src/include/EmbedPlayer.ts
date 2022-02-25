interface modules {
    /** 重构B站原生脚本video.min.js */
    readonly "EmbedPlayer.js": string;
    readonly "bgray-btn.css": string;
}
interface Window {
    player: {
        /**
         * 实时修改播放器弹幕
         * **本函数直接写入托管的`bilibiliPlayer.js`，使用前请检查是否可用**
         * @param danmaku 弹幕列表
         * @param append 添加弹幕还是替换，默认替换
         */
        setDanmaku: (danmaku: API.danmaku[], append?: boolean) => void;
        /**
         * 实时修改播放器弹幕
         * **本函数直接写入托管的`bilibiliPlayer.js`，使用前请检查是否可用**
         * @param time 弹幕偏移，正相关
         */
        offsetDanmaku: (time: number) => void;
        destroy: () => void;
        stop: () => void;
        play: () => void;
        pause: () => void;
        seek: (s: number) => void;
        getCurrentTime: () => number;
        prev: () => void;
        next: () => void;
        addEventListener: (type: string, listener: any) => void;
        removeEventListener: (type: string) => void;
        updatePlaylist?: (arr: []) => void;
    }
    EmbedPlayer: (player: string, swf: string, playerParams: string, playerType?: string, upgrade?: boolean, callbackFn?: () => void) => void;
    bilibiliPlayer: new (playerParam: Record<string, string>) => Window["player"];
    PlayerMediaLoaded: () => void;
    GrayManager: API.GrayManager;
    pageno: string;
    commentAgent: { seek: (t: number) => void };
}
interface config {
    /**
     * 优先加载的视频流的编码类型
     * avc = 7, hevc = 12, av1 = 13
     */
    codecType: string;
}
namespace API {
    class EmbedPlayer {
        playerParam: Record<string, any>;
        playerType: string;
        upgrade: boolean;
        callbackFn: () => void;
        flashAddEvents = [];
        flashRemoveEvents = [];
        pageno: string = <any>undefined;
        bofqi = <HTMLDivElement>document.querySelector("#bofqi");
        get gray_html5() {
            return !config.noVideo
        }
        set gray_html5(v: boolean) {
            config.noVideo = !v;
        }
        /**
         * 代理EmbedPlayer函数
         * @param player "player"
         * @param swf "//static.hdslb.com/play.swf"
         * @param playerParams url参数式的播放器初始化参数，需要转化为对象格式才能传递给播放器实例
         * @param playerType 播放器类型：flash/HTML5
         * @param upgrade 提升播放器版本，可能只在flash格式下有用
         * @param callbackFn 初始化播放器后的回调函数
         */
        constructor(player: string, swf: string, playerParams: string, playerType?: string, upgrade?: boolean, callbackFn?: () => void) {
            this.playerParam = Format.urlObj(`?${playerParams}`);
            this.playerParam.dashSymbol = true;
            this.playerParam.aid && Reflect.set(window, "aid", this.playerParam.aid);
            this.playerParam.cid && Reflect.set(window, "cid", this.playerParam.cid);
            this.playerType = <string>playerType;
            this.upgrade = <boolean>upgrade;
            this.callbackFn = <() => void>callbackFn;
            this.gray_loader();
        }
        /**
         * 加载外源脚本依赖
         * @param src 外源脚本src
         * @param onload 成功加载后的回调函数
         */
        loadScript(src: string, onload?: () => void) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", () => {
                script.remove();
                onload && onload();
            });
            script.addEventListener("error", (e) => {
                script.remove();
                toast.error("加载播放器脚本失败！", e.message)
            });
            document.body.appendChild(script);
        }
        /** 初始化HTML5播放器节点 */
        loadHtml5Player() {
            if (!this.bofqi) return debug.warn("页面中并不存在播放器节点！", this.playerParam);
            if (!window.bilibiliPlayer) {
                this.loadScript("//static.hdslb.com/player/js/bilibiliPlayer.min.js", () => {
                    this.bofqi.innerHTML = '<div class="player"><div id="bilibiliPlayer"></div></div><div id="player_placeholder"></div>';
                    window.player = new window.bilibiliPlayer(this.playerParam);
                    this.gray_html5_compatible();
                });
            }
            else {
                this.bofqi.innerHTML = '<div class="player"><div id="bilibiliPlayer"></div></div><div id="player_placeholder"></div>';
                window.player = new window.bilibiliPlayer(this.playerParam);
                this.gray_html5_compatible();
            }
        }
        eventMaps = {
            'jwplayerMediaBuffer': 'video_media_buffer',
            'jwplayerMediaBufferFull': 'video_media_buffer_full',
            'jwplayerMediaComplete': 'video_media_ended',
            'jwplayerMediaError': 'video_media_error',
            'jwplayerMediaLoaded': 'video_media_loaded',
            'jwplayerMediaMute': 'video_media_mute',
            'jwplayerMediaSeek': 'video_media_seek',
            'jwplayerMediaTime': 'video_media_time',
            'jwplayerMediaVolume': 'video_media_volume'
        };
        apiMaps = {
            'mukio_reloadAccess': 'reloadAccess',
            // 'jwAddEventListener': 'addEventListener',
            // 'jwRemoveEventListener': 'removeEventListener',
            'jwPlay': 'play',
            'jwPause': 'pause',
            'jwStop': 'stop',
            'jwSeek': 'seek',
            'jwPlaylistPrev': 'prev',
            'jwPlaylistNext': 'next',
            'jwGetBuffer': 'getBufferRate',
            'jwGetDuration': 'getDuration',
            'jwGetFullscreen': 'isFullScreen',
            'jwGetWidth': 'getWidth',
            'jwGetHeight': 'getHeight',
            'jwGetMute': 'isMute',
            'jwSetMute': 'setMute',
            'jwGetPlaylist': 'getPlaylist',
            'jwGetPlaylistIndex': 'getPlaylistIndex',
            'jwGetPosition': 'getCurrentTime',
            'jwGetState': 'getState',
            'jwGetVersion': 'getVersion',
            'jwGetVolume': 'volume',
            'jwSetVolume': 'volume'
        };
        cElement: HTMLDivElement = <any>undefined;
        /**
         * 统一HTML5播放器对外接口
         */
        gray_html5_compatible() {
            this.cElement = <HTMLDivElement>this.bofqi.querySelector("#player_placeholder");
            Object.entries(this.apiMaps).forEach(d => {
                (<any>this.cElement)[d[0]] = function () {
                    if (window.player && "function" == typeof (<any>window.player)[d[1]]) {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        return (<any>window.player)[d[1]].apply(window.player, t)
                    }
                    return !1
                }
            });
            Reflect.set(this.cElement, "jwAddEventListener", (type: any, callback: any) => {
                var callbackString: any = "",
                    _callback;
                try {
                    "function" != typeof callback && (callbackString = new Function(callback))
                } catch (e) {
                    callbackString = function () { }
                }
                (<any>this.eventMaps)[type] && (_callback = callbackString || callback, window.player && window.player.addEventListener && window.player.addEventListener((<any>this.eventMaps)[type], _callback))
            });
            Reflect.set(this.cElement, "jwRemoveEventListener", (e: any) => {
                (<any>this.eventMaps)[e] && window.player && window.player.removeEventListener && window.player.removeEventListener((<any>this.eventMaps)[e])
            });
            "function" == typeof this.callbackFn && (<any>this.cElement).jwAddEventListener("jwplayerMediaLoaded", () => this.callbackFn());
            "function" == typeof window.PlayerMediaLoaded && window.PlayerMediaLoaded();
        }
        /**
         * 检查浏览器flash支持性
         * @returns 支持结果
         */
        flashChecker() {
            let e = !1, t = 0;
            if (!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) && !/Edge/i.test(navigator.userAgent) || /Trident/i.test(navigator.userAgent)) {
                try {
                    var n = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    if (n) {
                        e = !0;
                        var r = n.GetVariable("$version");
                        t = parseInt(r.split(" ")[1].split(",")[0], 10)
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            else if (navigator.plugins && 0 < navigator.plugins.length) {
                var i = (<any>navigator.plugins)["Shockwave Flash"];
                if (i) {
                    e = !0;
                    for (var a = i.description.split(" "), o = 0; o < a.length; ++o)
                        isNaN(parseInt(a[o], 10)) || (t = parseInt(a[o], 10))
                }
            }
            return {
                hasFlash: e,
                flashVersion: t
            }
        }
        /**
         * 初始化flash播放器节点
         */
        gray_loader_flash() {
            // flash播放器已不可用，主动更新全局变量
            this.playerParam.aid && (aid = this.playerParam.aid);
            this.playerParam.cid && (cid = this.playerParam.cid);
            this.flashChecker().hasFlash ? (<any>window).swfobject && (<any>window).swfobject.embedSWF ?
                this.loadFlashPlayer() :
                this.loadScript("//static.hdslb.com/js/swfobject.js", () => this.loadFlashPlayer()) :
                this.getNoFlashTips();
        }
        /**
         * 不支持flash提示
         */
        getNoFlashTips() {
            (<any>window).NoFlashTips ? this.createNoFlashTipsInstance() : this.loadScript("//static.hdslb.com/player/noflashtips/no-flash-tips.min.js", () => this.createNoFlashTipsInstance());
        }
        /**
         * 不支持flash提示内容
         */
        createNoFlashTipsInstance() {
            const msg = {
                backgroundColor: "white",
                msg: "主人，未安装Flash插件，暂时无法观看视频，您可以…",
                msgColor: "#000",
                msgSize: 14,
                btnList: [
                    {
                        title: "下载Flash插件",
                        width: 166,
                        height: 40,
                        type: "flash",
                        theme: "white"
                    }, {
                        title: "使用HTML5播放器",
                        width: 166,
                        height: 40,
                        type: "html5",
                        theme: "blue",
                        onClick: (e: any) => {
                            this.gray_html5 = true,
                                this.loadHtml5Player(),
                                "function" == typeof e && e()
                        }
                    }
                ],
                hasOrText: !1
            };
            config.noVideo && msg.btnList.push({
                title: "下载视频",
                width: 166,
                height: 40,
                type: "download",
                theme: "red",
                onClick: (e) => {
                    download();
                }
            })
            new (<any>window).NoFlashTips(this.bofqi, msg);
            this.bofqi.style.removeProperty("position");
        }
        /**
         * 加载flash播放器脚本
         */
        loadFlashPlayer() {
            this.bofqi.innerHTML = '<div id="player_placeholder" class="player"></div>';
            (<any>window).swfobject.embedSWF(this.upgrade ? "//static.hdslb.com/play_recommend.swf" : "//static.hdslb.com/play.swf", "player_placeholder", "950", "482", "0", "", this.playerParam, {
                bgcolor: "#ffffff",
                allowfullscreeninteractive: "true",
                allowfullscreen: "true",
                quality: "high",
                allowscriptaccess: "always",
                wmode: /Firefox/.test(navigator.userAgent) ? "opaque" : "direct"
            }, {
                class: "player"
            }, () => {
                "function" == typeof this.callbackFn && this.callbackFn();
                "function" == typeof window.PlayerMediaLoaded && window.PlayerMediaLoaded();
                this.gray_flash_compatible();
            });
        }
        /**
         * 统一flash播放器对外接口
         */
        gray_flash_compatible() {
            this.cElement = <HTMLDivElement>this.bofqi.querySelector("#player_placeholder");
            (<any>window).player = {};
            Object.entries(this.apiMaps).forEach(d => {
                (<any>this.cElement)[d[0]] = function () {
                    if (window.player && "function" == typeof (<any>window.player)[d[1]]) {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        return (<any>window.player)[d[1]].apply(window.player, t)
                    }
                    return !1
                };
                (<any>window.player)[d[1]] = () => {
                    if (typeof (<any>this.cElement)[d[0]] === 'function') {
                        return (<any>this.cElement)[d[0]].apply(this.cElement, arguments);
                    }
                };
            });
            Reflect.set(this.cElement, "jwAddEventListener", () => {
                (<any>this.cElement)['jwAddEventListener'].apply(this, arguments);
            });
            Reflect.set(this.cElement, "jwRemoveEventListener", () => {
                (<any>this.cElement)['jwRemoveEventListener'].apply(this, arguments);
            });
            const eventMaps = {
                'video_media_buffer': 'jwplayerMediaBuffer',
                'video_media_buffer_full': 'jwplayerMediaBufferFull',
                'video_media_ended': 'jwplayerMediaComplete',
                'video_media_error': 'jwplayerMediaError',
                'video_media_loaded': 'jwplayerMediaLoaded',
                'video_media_mute': 'jwplayerMediaMute',
                'video_media_seek': 'jwplayerMediaSeek',
                'video_media_time': 'jwplayerMediaTime',
                'video_media_volume': 'jwplayerMediaVolume'
            };
            window.player['addEventListener'] = (type, callback) => {
                try {
                    if (typeof callback !== 'function') {
                        callback = new Function(callback);
                    }
                } catch (e) {
                    callback = function () { };
                }

                if (eventMaps[<keyof typeof eventMaps>type]) {
                    (<any>this.flashAddEvents).push([type, callback]);
                }
            };
            window.player['removeEventListener'] = (type) => {
                if (eventMaps[<keyof typeof eventMaps>type]) {
                    for (var i = this.flashAddEvents.length - 1; i > 0; i--) {
                        if (this.flashAddEvents[i][0] == type) {
                            this.flashAddEvents.splice(i, 1);
                        }
                    }
                }
            }
            Object.entries(eventMaps).forEach(d => {
                (<any>this.cElement)["jwAddEventListener"](d[1], () => { this.callFunction(d[0]) })
            });
        }
        callFunction(type: string) {
            const eventMaps = {
                'video_media_buffer': 'jwplayerMediaBuffer',
                'video_media_buffer_full': 'jwplayerMediaBufferFull',
                'video_media_ended': 'jwplayerMediaComplete',
                'video_media_error': 'jwplayerMediaError',
                'video_media_loaded': 'jwplayerMediaLoaded',
                'video_media_mute': 'jwplayerMediaMute',
                'video_media_seek': 'jwplayerMediaSeek',
                'video_media_time': 'jwplayerMediaTime',
                'video_media_volume': 'jwplayerMediaVolume'
            };
            if (eventMaps[<keyof typeof eventMaps>type]) {
                for (var i = 0; i < this.flashAddEvents.length; i++) {
                    this.flashAddEvents[i] && this.flashAddEvents[i][0] == type && (<any>this.flashAddEvents)[i][1]();
                }
            }
        }
        /**
         * 播放器附加菜单
         * @param type 菜单类型
         * @returns 菜单数据
         */
        loadExtraMenuConfig(type: string) {
            let v = '20161115', exconfig = [];
            if (type === 'flash' || type === 'flash_gray') {
                if (this.gray_html5) {
                    exconfig.push({ label: "HTML5播放器", id: "change_h5" });
                    exconfig.push({ label: "Flash播放器", id: "change_flash", active: true });
                }
            } else {
                exconfig.push({ label: "HTML5播放器", id: "change_h5", active: true });
                exconfig.push({ label: "Flash播放器", id: "change_flash" });
            }
            return { 'ver': v, 'menuItems': exconfig };
        }
        /**
         * 播放器附加菜单回调函数
         * @param id 菜单类型
         */
        clickMenu(id: string) {
            setTimeout(() => {
                if (id === 'change_h5') {
                    this.gray_html5 = true;
                    this.gray_loader()
                }
                else if (id === 'change_flash') {
                    this.gray_html5 = false;
                    window.player && window.player.destroy && window.player.destroy();
                    this.gray_loader();
                }
            });
        }
        /**
         * 根据参数引导播放器类型
         */
        gray_loader() {
            this.init_bgray_btn();
            ("html5" === this.playerType || this.gray_html5) ? this.loadHtml5Player() : this.gray_loader_flash();
        }
        feedback: { show: () => void } = <any>undefined;
        init_bgray_btn() {
            const prt = <HTMLElement>this.bofqi.parentElement;
            const gray = addElement("div", { class: "bgray-btn-wrap" }, prt);
            addCss(getModule("bgray-btn.css") + (prt.classList.contains("movie_play") ? ".movie_play {overflow: visible;} .bgray-btn-wrap {top: -10px;} #bofqi {box-shadow: 0 0 0;}" : ""));
            addElement("div", { class: "bgray-btn show bgray-btn-feedback" }, gray, `播放<br/>问题<br/>反馈`).addEventListener("click", () => {
                this.feedback ? this.feedback.show() : (<any>window).FeedBackInstance ? (this.feedback = new (<any>window).FeedBackInstance(), this.feedback.show()) : ((<any>gray).querySelector(".bgray-btn.show").classList.add("player-feedback-disable"), this.loadScript("//static.hdslb.com/player/feedback/feedback.min.js", () => {
                    gray.querySelector<any>(".bgray-btn.show").classList.remove("player-feedback-disable");
                    this.feedback = (<any>window).FeedBackInstance && new (<any>window).FeedBackInstance();
                    this.feedback && this.feedback.show();
                }));
            });
            addElement("div", { class: "bgray-btn show bgray-btn-help" }, gray, `帮助`).addEventListener("click", () => {
                window.open("//www.bilibili.com/blackboard/help.html#常见播放问题自救方法");
            });
        }
    }
    export class GrayManager extends EmbedPlayer {
        /** 播放器播放时优先选择的编码、浏览器支持的编码类型 */
        codec: {
            preference: number;
            support: Record<number, boolean>;
        }
        constructor(player: string, swf: string, playerParams: string, playerType?: string, upgrade?: boolean, callbackFn?: () => void) {
            super(player, swf, playerParams, playerType, upgrade, callbackFn);
            let codecId = {
                "AVC": 7,
                "HEVC": 12,
                "AV1": 13
            }
            this.codec = {
                preference: codecId[<keyof typeof codecId>config.codecType],
                support: {}
            }
            let mime = {
                "AVC": 'video/mp4;codecs="avc1.640028"',
                "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
                "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"'
            };
            for (let i in mime) {
                this.codec.support[codecId[<keyof typeof codecId>i]] = MediaSource.isTypeSupported(mime[<keyof typeof mime>i]);
            }
            location.href.includes("t=") && (this.playerParam.p = this.GetUrlValue("t"));
            location.href.includes("d=") && (this.playerParam.d = this.GetUrlValue("d"));
            location.href.includes("lastplaytime=") && (this.playerParam.lastplaytime = this.GetUrlValue("lastplaytime"));
        }
        /**
         * 重新加载播放器实例
         * @param playerParams 播放器实例参数，格式同初始化参数
         */
        reload(playerParams: string) {
            if (this.playerParam) {
                try {
                    (<any>window).swfobject && (<any>window).swfobject.removeSWF("player_placeholder"),
                        window.player && window.player.pause(),
                        window.player && window.player.destroy && window.player.destroy(),
                        (this.HashManage.get("page") || this.GetUrlValue("p")) && (window.pageno = this.HashManage.get("page") || this.GetUrlValue("p") || 1,
                            this.pageno = window.pageno)
                } catch (e) {
                    console.log(e)
                }
                this.playerParam = Format.urlObj(`?${playerParams}`) || this.playerParam;
                this.playerParam.dashSymbol = true;
                this.playerParam && (Reflect.set(window, "aid", this.playerParam.aid),
                    Reflect.set(window, "cid", this.playerParam.cid));
                this.gray_loader();
            } else
                window.location.reload();
        }
        /**
         * 监听url哈希修改
         */
        HashManage = {
            p: function (e: any) {
                return (this.p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                }
                    : function (e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    })(e)
            },
            prependHash: "!",
            _change: function (e: any, t: any) {
                var n: any, r = location.hash, i = [], a = "", o = 0, s: Record<string, any> = {};
                r && (r = r.substring(1),
                    this.prependHash && (r = r.replace(new RegExp("^".concat(this.prependHash.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"))), ""))),
                    i = r.split("&");
                for (var u = 0; u < i.length; u++) {
                    var l = i[u].split("=")[0]
                        , d = i[u].split("=")[1];
                    l && (s[l] = decodeURIComponent(d))
                }
                if ("object" === this.p(e)) {
                    n = Object.keys(e).length;
                    for (var f = 0; f < n; f++) {
                        var c = e[n[f]];
                        c ? s[n[f]] = encodeURIComponent(c) : !1 === c && delete s[n[f]]
                    }
                } else if (t)
                    s[e] = encodeURIComponent(t);
                else {
                    if (!1 !== t)
                        return void 0 === e ? s : s[e] || null;
                    delete s[e]
                }
                n = Object.keys(s);
                for (var h = 0; h < n.length; h++)
                    a += 0 !== o ? "&" : this.prependHash,
                        a += "".concat(n[h], "=").concat(s[n[h]]),
                        o += 1;
                return location.hash = a,
                    s
            },
            get: function (e: any) {
                return this._change(e, null)
            },
            set: function (e: any, t: any) {
                return this._change(e, t)
            },
            clear: function () {
                location.hash = ""
            }
        }
        /**
         * 从url中提取参数
         * @param e 参数名
         * @returns 参数值
         */
        GetUrlValue(e: string) {
            var t = new RegExp("(^|&)".concat(e, "=([^&]*)(&|$)"), "i"),
                n = window.location.search.substr(1).match(t);
            if (null != n)
                try {
                    return decodeURIComponent(n[2])
                } catch (e) {
                    return null
                }
            return null
        }
    }
    /** 加载重写后的`video.min.js`，重写页面前调用。 */
    export function loadVideoScript() {
        window.EmbedPlayer = (player: string, swf: string, playerParams: string, playerType?: string, upgrade?: boolean, callbackFn?: () => void) => {
            window.GrayManager = new GrayManager(player, swf, playerParams, playerType, upgrade, callbackFn)
        }
    }
    // 托管播放器脚本`bilibiliPlayer.min.js`
    config.trusteeship && scriptIntercept("bilibiliPlayer.min.js", undefined, () => {
        const text = GM.getResourceText("bilibiliPlayer.js")
        if (!text) setTimeout(() => { toast.error("bilibiliPlayer.js 资源加载失败！您可以在设置中临时关闭“托管原生脚本”。"); displaySetting("trusteeship") })
        return text;
    })
}