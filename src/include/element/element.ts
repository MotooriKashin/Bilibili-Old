namespace API {
    /**
     * 节点相对文档的偏移
     * @param node 目标节点
     * @returns 偏移量
     */
    export function offset(node: HTMLElement) {
        const result = {
            top: 0,
            left: 0
        };
        const onwer = node.ownerDocument;
        if (node === onwer.body) {
            result.top = node.offsetTop;
            result.left = node.offsetLeft;
        } else {
            let rect: DOMRect = <any>undefined;
            try {
                rect = node.getBoundingClientRect();
            } catch { }
            if (!rect || !onwer.documentElement.contains(node)) {
                rect && (result.top = rect.top, result.left = rect.left);
                return result;
            }
            result.top = rect.top + onwer.body.scrollTop - onwer.documentElement.clientTop;
            result.left = rect.left + onwer.body.scrollLeft - onwer.documentElement.clientLeft;
        }
        return result;
    }
    /**
     * 创建script元素组
     * @param elements 虚拟script组
     * @returns script元素组
     */
    function createScripts(elements: Vdom[]) {
        return elements.reduce((s, d) => {
            s.push(<HTMLScriptElement>createElement(d))
            return s;
        }, <HTMLScriptElement[]>[])
    }
    /**
     * 依次创建脚本
     * @param scripts 脚本组
     */
    function loopScript(scripts: HTMLScriptElement[]) {
        return new Promise((r, j) => {
            const prev = scripts.shift();
            if (prev) {
                if (prev.src) {
                    prev.addEventListener("load", () => r(loopScript(scripts)));
                    prev.addEventListener("abort", () => r(loopScript(scripts)));
                    prev.addEventListener("error", () => r(loopScript(scripts)));
                    return document.body.appendChild(prev);
                }
                document.body.appendChild(prev);
                r(loopScript(scripts));
            } else r(undefined);
        });
    }
    /**
     * 添加脚本到DOM
     * @param elements script元素字符串（序列）
     */
    export function appendScripts(elements: string) {
        return loopScript(createScripts(htmlVnode(elements)));
    }
    const dushes = [
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
    /** 清扫全局环境 */
    export function clearWindow() {
        dushes.forEach(d => {
            try {
                Reflect.deleteProperty(window, d);
            } catch (e) { (<any>window)[d] = undefined; debug("清扫全局环境", d) }
        });
    }
}