interface modules {
    /**
     * 重写页面工具集
     */
    readonly "rewrite.js": string;
}
class Rewrite {
    url = new URL(location.href);
    __INITIAL_STATE__: Record<string, any> = {};
    /**
     * 旧版脚本序列，初始化请复制给`scripts`！
     */
    script: { type?: string; src?: string; text?: string; defer?: string; crossorigin?: string; charset?: string; }[] = [];
    /**
     * 重写页面前需要清理的全局变量污染
     */
    dush = [
        "__INITIAL_STATE__",
        "__PGC_USERSTATE__",
        "__BILI_CONFIG__",
        "__mobxGlobals",
        "__mobxInstanceCount",
        "_babelPolyfill",
        "BilibiliPlayer",
        "BiliJsBridge",
        "LazyLoad",
        "lazyload",
        "regeneratorRuntime",
        "ownKeys",
        "asyncGeneratorStep",
        "Bjax",
        "BPlayer",
        "BwpElement",
        "BwpMediaSource",
        "bbComment",
        "bPlayer",
        "EmbedPlayer",
        "GrayManager",
        "PlayerAgent",
        "PlayerSetOnline",
        "abtest",
        "ad_rp",
        "ad_url",
        "bPlayer",
        "bsourceFrom",
        "dashjs",
        "deltaFilter",
        "directiveDispatcher",
        "ep",
        "flashChecker",
        "flvjs",
        "getAuthorInfo",
        "getCookie",
        "getIEVersion",
        "gqs",
        "heimu",
        "insertLink",
        "insertScript",
        "iris",
        "isBiliPlayer",
        "isEmbedPlayer",
        "isInit",
        "jsurl",
        "jsUrls",
        "loadLink",
        "loadScript",
        "loginInfoCallbacks",
        "md",
        "nano",
        "nanoWidgetsJsonp",
        "player",
        "playerInfo",
        "player_fullwin",
        "player_widewin",
        "rec_rp",
        "regeneratorRuntime",
        "reportConfig",
        "reportFistAdFs",
        "reportObserver",
        "setSize",
        "setSizeStyle",
        "spmReportData",
        "vd",
        "videoWidgetsJsonP",
        "webAbTest",
        "webpackJsonp",
        "__getClientLogo",
        "_arrayLikeToArray",
        "_arrayWithHoles",
        "_arrayWithoutHoles",
        "_asyncToGenerator2",
        "_classCallCheck",
        "_createClass",
        "_createForOfIteratorHelper",
        "_defineProperties",
        "_defineProperty",
        "_iterableToArray",
        "_iterableToArrayLimit",
        "_nonIterableRest",
        "_nonIterableSpread",
        "_objectSpread",
        "_slicedToArray",
        "_toConsumableArray",
        "_typeof",
        "_unsupportedIterableToArray",
        "el",
        "BiliCm",
        "BiliHeader",
        "webpackJsonpwebpackLogReporter",
        "webpackLogReporter",
        "core",
        "__getClientLogo",
        "_arrayLikeToArray",
        "_arrayWithoutHoles",
        "_iterableToArray",
        "_nonIterableSpread",
        "_toConsumableArray",
        "_unsupportedIterableToArray",
        "AttentionList",
        "UserStatus",
        "biliQuickLogin",
        "clearImmediate",
        "jvsCert",
        "loadLoginStatus",
        "mOxie",
        "moxie",
        "o",
        "onLoginInfoLoaded",
        "plupload",
        "recaptcha",
        "setImmediate",
        "setTid",
        "show1080p",
        "showCoopModal",
        "showPay",
        "swfobject",
        "tabSocket",
        "__BiliUser__",
        "___grecaptcha_cfg",
        "__core-js_shared__",
    ];
    /**
     * 旧版网页框架  
     * **只在重写页面之外可用！**
     */
    Dom: Document;
    /**
     * 重写完页面执行的回调函数
     */
    loadendCallback: (() => void)[] = [];
    title = document.title;
    /**
     * 添加重写完页面执行的回调函数
     */
    set onload(v: () => void) {
        this.loadendCallback.push(v);
    }
    /**
     * 重写页面工具  
     * 请继承本接口并定义对应页面专属属性和方法。  
     * 1. 在modules接口中拓展旧版网页框架名并于html目录下准备好网页框架（剔除所有script标签）。  
     * 2. 将所有剔除的script**严格依次**以属性键值对像添加进script数组中，内联脚本文本属性名为`text`。  
     * 3. 部分页面需要构造`__INITIAL_STATE__`数据，请在重构页面(`flushDocument`)前准备好并写入window变量下。  
     * 5. 需要页面重构完再执行的回调函数请复制给`onload`属性，可以添加多个，不会相互覆盖，且异步并行回调。  
     * 6. 重写页面要异步等待外源脚本加载完，完成后推送`load``DOMContentLoaded`等标准事件。
     * @param 旧版网页框架名，**请移除其中的script标签**
     */
    constructor(html: keyof modules) {
        document.close(); // 关闭文档流
        document.body?.remove();
        document.replaceChild(document.implementation.createDocumentType('html', '', ''), document.doctype);
        document.documentElement.replaceWith((new DOMParser().parseFromString(API.getModule(html), 'text/html')).documentElement);
        (!this.title.includes("出错")) && (document.title = this.title);
        this.clearWindow();
        this.restorePlayerSetting();
        API.switchVideo(() => this.setActionHandler());
    }
    /**
     * 修复播放器设置
     * 新版播放器修改过播放器设置，这会导致旧版播放器设置读取异常。
     */
    async restorePlayerSetting() {
        let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
        let settings_copy = GM.getValue<Record<string, any>>("bilibili_player_settings", {});
        if (bilibili_player_settings) {
            let settings = <Record<string, any>>JSON.parse(bilibili_player_settings);
            if (settings?.video_status?.autopart !== "") GM.setValue<Record<string, any>>("bilibili_player_settings", settings);
            else if (settings_copy) localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
        } else if (settings_copy) {
            localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
        }
    }
    /**
     * 清洗页面全局变量
     */
    clearWindow() {
        this.dush.forEach(d => {
            try {
                window[d] = undefined;
            } catch (e) { debug.error(`无法删除变量${d}~`) }
        });
        API.EmbedPlayer();
    }
    /**
     * 刷新页面  
     * 将进入脚本插入循环，页面重构完成请通过`onload`属性回调
     */
    flushDocument() {
        !(this.script.length === 0) ? this.loadScript(this.script[0]) : this.loadenEvent();
    }
    /**
     * 脚本插入循环
     * @param obj 脚本属性数据
     */
    loadScript(obj: Record<string, string>) {
        if (obj.defer) { // defer脚本重新追加向最后
            const temp = this.script.shift();
            delete obj.defer
            this.script.push(temp);
            return this.flushDocument();
        }
        const script = document.createElement("script");
        if (obj.text) { // 内联脚本
            script.text = obj.text;
            delete obj.text;
        }
        if (obj.src) { // 外源脚本需等待返回
            script.addEventListener("load", () => {
                this.script.shift();
                this.flushDocument();
            });
            script.addEventListener("error", () => {
                this.script.shift();
                this.flushDocument();
            });
        }
        Object.entries(obj).forEach(d => { script.setAttribute(d[0], d[1]) });
        document.body.appendChild(script);
        if (!obj.src) { // 非外源脚本立刻返回
            this.script.shift();
            this.flushDocument();
        }
    }
    /**
     * 重写完信息通知
     */
    loadenEvent() {
        this.loadendCallback.forEach(async d => d());
        document.dispatchEvent(new ProgressEvent("readystatechange"));
        document.dispatchEvent(new ProgressEvent("DOMContentLoaded"));
        window.dispatchEvent(new ProgressEvent("DOMContentLoaded"));
        window.dispatchEvent(new ProgressEvent("load"));
    }
    /**
     * 添加媒体控制
     */
    setActionHandler() {
        navigator.mediaSession.setActionHandler('play', () => window.player.play());
        navigator.mediaSession.setActionHandler('pause', () => window.player.pause());
        navigator.mediaSession.setActionHandler('seekbackward', () => window.player.seek(window.player.getCurrentTime() - 10));
        navigator.mediaSession.setActionHandler('seekforward', () => window.player.seek(window.player.getCurrentTime() + 10));
        navigator.mediaSession.setActionHandler('previoustrack', () => window.player.prev());
        navigator.mediaSession.setActionHandler('nexttrack', () => window.player.next());
    }
    /**
     * 临时禁用重写并跳转回新版页面
     */
    stop(reason: string) {
        sessionStorage.setItem("disable_rewrite", reason);
        location.reload();
    }
}
API.rewrite = Rewrite;
declare namespace API {
    export let rewrite: typeof Rewrite;
}