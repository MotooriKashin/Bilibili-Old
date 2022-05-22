namespace API {
    /** 函数栈 */
    const funcs: (() => void)[] = [];
    /**
     * 注册重写后第一时间运行  
     * 重写模式下会清空各种回调，必须重新注册
     * @param func 
     */
    export function loadAfterClear(func: () => void) {
        func();
        rebuildType != "重定向" && funcs.push(func);
    }
    const dushs = [
        "__INITIAL_STATE__",
        "__PGC_USERSTATE__",
        "__BILI_CONFIG__",
        "Sentry",
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
    /** 清理全局变量 **必须使用`window.close`或`documentWrite`** */
    export function windowClear() {
        GM.DOM.open();
        dushs.forEach(d => {
            try {
                Reflect.deleteProperty(window, d);
            } catch (e) { (<any>window)[d] = undefined; debug(d) }
        });
        funcs.forEach(d => d());
    }
    /**
     * 使用`document.write`重写页面
     * @param html html框架
     * @param __INITIAL_STATE__ 是否清理`__INITIAL_STATE__`
     */
    export function documentWrite(html: string) {
        GM.DOM.write(html);
        GM.DOM.close();
    }
}