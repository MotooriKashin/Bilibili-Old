/**
 * 旧版播放器脚本hook
 */
(function () {
    class GrayManager {
        static player: EmbedPlayer;
        constructor(player: EmbedPlayer) {
            GrayManager.player = player;
        }
        loadExtraMenuConfig(type: string) {
            return GrayManager.player.loadExtraMenuConfig(type);
        }
        clickMenu(id: string) {
            return GrayManager.player.clickMenu(id);
        }
    }
    class EmbedPlayer {
        playerParam: Record<string, string>;
        playerType: string;
        upgrade: boolean;
        callbackFn: () => void;
        gray_html5 = true;
        flashAddEvents = [];
        flashRemoveEvents = [];
        bofqi = document.querySelector("#bofqi");
        constructor(player: string, swf: string, playerParams: string, playerType?: string, upgrade?: boolean, callbackFn?: () => void) {
            this.playerParam = API.urlObj(`?${playerParams}`);
            this.playerType = playerType;
            this.upgrade = upgrade;
            this.callbackFn = callbackFn;
            this.gray_html5 ? this.loadHtml5Player() : this.gray_loader_flash();
        }
        loadScript(src: string, onload?: () => void) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", () => {
                script.remove();
                onload();
            });
            document.body.appendChild(script);
        }
        loadHtml5Player() {
            this.playerParam.aid && Reflect.set(window, "aid", this.playerParam.aid);
            this.playerParam.cid && Reflect.set(window, "cid", this.playerParam.cid);
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
        cElement: HTMLDivElement;
        gray_html5_compatible() {
            this.cElement = this.bofqi.querySelector("#player_placeholder");
            Object.entries(this.apiMaps).forEach(d => {
                this.cElement[d[0]] = function () {
                    if (window.player && "function" == typeof window.player[d[1]]) {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        return window.player[d[1]].apply(window.player, t)
                    }
                    return !1
                }
            });
            Reflect.set(this.cElement, "jwAddEventListener", (type, callback) => {
                var callbackString: any = "",
                    _callback;
                try {
                    "function" != typeof callback && (callbackString = new Function(callback))
                } catch (e) {
                    callbackString = function () { }
                }
                this.eventMaps[type] && (_callback = callbackString || callback, window.player && window.player.addEventListener && window.player.addEventListener(this.eventMaps[type], _callback))
            });
            Reflect.set(this.cElement, "jwRemoveEventListener", (e) => {
                this.eventMaps[e] && window.player && window.player.removeEventListener && window.player.removeEventListener(this.eventMaps[e])
            });
            "function" == typeof this.callbackFn && (<any>this.cElement).jwAddEventListener("jwplayerMediaLoaded", () => this.callbackFn());
            "function" == typeof window.PlayerMediaLoaded && window.PlayerMediaLoaded();
            window.GrayManager = window.GrayManager ? Object.assign(window.GrayManager, new GrayManager(this)) : new GrayManager(this);
        }
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
                var i = navigator.plugins["Shockwave Flash"];
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
        gray_loader_flash() {
            this.flashChecker().hasFlash ? (<any>window).swfobject && (<any>window).swfobject.embedSWF ?
                this.loadFlashPlayer() :
                this.loadScript("//static.hdslb.com/js/swfobject.js", () => this.loadFlashPlayer()) :
                this.getNoFlashTips();
        }
        getNoFlashTips() {
            (<any>window).NoFlashTips ? this.createNoFlashTipsInstance() : this.loadScript("//static.hdslb.com/player/noflashtips/no-flash-tips.min.js", () => this.createNoFlashTipsInstance());
        }
        createNoFlashTipsInstance() {
            const config = {
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
                        onClick: (e) => {
                            this.loadHtml5Player(),
                                "function" == typeof e && e()
                        }
                    }
                ],
                hasOrText: !1
            };
            new (<any>window).NoFlashTips(document.querySelector("#bofqi"), config);
        }
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
        gray_flash_compatible() {
            this.cElement = this.bofqi.querySelector("#player_placeholder");
            (<any>window).player = {};
            Object.entries(this.apiMaps).forEach(d => {
                this.cElement[d[0]] = function () {
                    if (window.player && "function" == typeof window.player[d[1]]) {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        return window.player[d[1]].apply(window.player, t)
                    }
                    return !1
                };
                window.player[d[1]] = () => {
                    if (typeof this.cElement[d[0]] === 'function') {
                        return this.cElement[d[0]].apply(this.cElement, arguments);
                    }
                };
            });
            Reflect.set(this.cElement, "jwAddEventListener", () => {
                this.cElement['jwAddEventListener'].apply(this, arguments);
            });
            Reflect.set(this.cElement, "jwRemoveEventListener", (e) => {
                this.cElement['jwRemoveEventListener'].apply(this, arguments);
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

                if (eventMaps[type]) {
                    this.flashAddEvents.push([type, callback]);
                }
            };
            window.player['removeEventListener'] = (type) => {
                if (eventMaps[type]) {
                    for (var i = this.flashAddEvents.length - 1; i > 0; i--) {
                        if (this.flashAddEvents[i][0] == type) {
                            this.flashAddEvents.splice(i, 1);
                        }
                    }
                }
            }
            Object.entries(eventMaps).forEach(d => {
                this.cElement["jwAddEventListener"](d[1], () => { this.callFunction(d[0]) })
            });
            window.GrayManager = window.GrayManager ? Object.assign(window.GrayManager, new GrayManager(this)) : new GrayManager(this);
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
            if (eventMaps[type]) {
                for (var i = 0; i < this.flashAddEvents.length; i++) {
                    this.flashAddEvents[i] && this.flashAddEvents[i][0] == type && this.flashAddEvents[i][1]();
                }
            }
        }
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
        clickMenu(id: string) {
            setTimeout(() => {
                if (id === 'change_h5') {
                    this.loadHtml5Player()
                }
                else if (id === 'change_flash') {
                    window.player && window.player.destroy && window.player.destroy();
                    this.gray_loader_flash();
                }
            });
        }
    }
    Object.defineProperty(window, "EmbedPlayer", {
        set: (v) => {
            delete window.EmbedPlayer;
            if (!API.path.name) return window.EmbedPlayer = v;
            // const script = GM.getResourceText("video.js");
            // if (!script) return window.EmbedPlayer = v;
            // new Function(script)();
            window.EmbedPlayer = (player: string, swf: string, playerParams: string, playerType?: string, upgrade?: boolean, callbackFn?: () => void) => {
                new EmbedPlayer(player, swf, playerParams, playerType, upgrade, callbackFn)
            }
        },
        get: () => undefined,
        configurable: true
    });
    API.scriptIntercept(["bilibiliPlayer.min.js"], URL.createObjectURL(new Blob([GM.getResourceText("bilibiliPlayer.js")])));
})();
interface Window {
    player: {
        /**
         * 实时修改播放器弹幕
         * **本函数直接写入托管的`bilibiliPlayer.js`，使用前请检查是否可用**
         * @param danmaku 弹幕列表
         * @param append 添加弹幕还是替换，默认替换
         */
        setDanmaku: (danmaku: danmaku[], append?: boolean) => void;
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
    }
    EmbedPlayer: (player: string, swf: string, playerParams: string, playerType?: string, upgrade?: boolean, callbackFn?: () => void) => void;
    bilibiliPlayer: new (playerParam: Record<string, string>) => Window["player"];
    PlayerMediaLoaded: () => void;
    GrayManager: {};
}