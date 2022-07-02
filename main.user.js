// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      8.2.0
// @description  恢复Bilibili旧版页面，为了那些念旧的人。
// @author       MotooriKashin, wly5556
// @homepage     https://github.com/MotooriKashin/Bilibili-Old
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://*.bilibili.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM.cookie
// @run-at       document-start
// @license      MIT
// @require      https://fastly.jsdelivr.net/npm/protobufjs@6.11.0/dist/light/protobuf.min.js
// @resource     comment.js https://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@0a9428ec27e073a6263c8f82c5753f28196e42e0/dist/comment.min.js
// @resource     bilibiliPlayer.js https://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c0468a0d8ba0d7d65f4328c42f8b6d8364809fb7/dist/bilibiliPlayer.min.js
// ==/UserScript==


/** 封装脚本管理器提供的API */
Object.defineProperties(GM, {
    GM_xmlHttpRequest: { value: GM_xmlhttpRequest },
    GM_getValue: { value: GM_getValue },
    GM_setValue: { value: GM_setValue },
    GM_deleteValue: { value: GM_deleteValue },
    GM_listValues: { value: GM_listValues },
    GM_getResourceText: { value: GM_getResourceText },
    GM_getResourceURL: { value: GM_getResourceURL },
    DOM: { value: document },
    protobuf: { value: window.protobuf }
});
const modules = {};

/**/modules["apply.json"] = /*** ./src/apply.json ***/
{
	"loadAfterClear": "domWrite.js",
	"windowClear": "domWrite.js",
	"documentWrite": "domWrite.js",
	"observerAddedNodes": "nodeObserver.js",
	"removeObserver": "nodeObserver.js",
	"path": "units.js",
	"title": "units.js",
	"rebuildType": "units.js",
	"pgc": "units.js",
	"ssid": "units.js",
	"epid": "units.js",
	"redirect": "units.js",
	"replaceUrl": "units.js",
	"loadendEvent": "units.js",
	"doWhile": "units.js",
	"getTotalTop": "units.js",
	"addCss": "units.js",
	"loadScript": "units.js",
	"getUrlValue": "units.js",
	"addElement": "units.js",
	"statusCheck": "units.js",
	"url": "url.js",
	"xhr": "xhr.js",
	"AccessKey": "accessKey.js",
	"jsonCheck": "jsonCheck.js",
	"loginExit": "loginExit.js",
	"mediaSession": "MediaMeta.js",
	"setMediaSession": "MediaMeta.js",
	"biliQuickLogin": "quickLogin.js",
	"SegProgress": "segProgress.js",
	"switchVideo": "switchVideo.js",
	"uposReplace": "uposReplace.js",
	"uposWithGM": "uposWithGM.js",
	"urlParam": "urlParam.js",
	"closedCaption": "closedCaption.js",
	"allDanmaku": "allDanmaku.js",
	"loadCommandDm": "commandDm.js",
	"danmaku": "danmaku.js",
	"LocalMedia": "localDanmaku.js",
	"GrayManager": "EmbedPlayer.js",
	"loadVideoScript": "EmbedPlayer.js",
	"playerKeyMap": "playerKeyMap.js",
	"videoFloat": "videoFloat.js",
	"debug": "debug.js",
	"toast": "toast.js",
	"createElement": "createElement.js",
	"createElements": "createElement.js",
	"offset": "element.js",
	"appendScripts": "element.js",
	"clearWindow": "element.js",
	"htmlVnode": "htmlVnode.js",
	"ButtonSwitch": "buttonSwitch.js",
	"Checkbox": "checkbox.js",
	"FloatQuote": "floatQuote.js",
	"HorizontalLine": "horizontal.js",
	"InputArea": "inputArea.js",
	"alert": "alert.js",
	"ClickRemove": "popupbox.js",
	"PopupBox": "popupbox.js",
	"PushButton": "pushButton.js",
	"SelectMenu": "selectMenu.js",
	"SliderBlock": "sliderblock.js",
	"cht2chs": "cht2chs.js",
	"integerFormat": "integerFormat.js",
	"sizeFormat": "sizeFormat.js",
	"subArray": "subArray.js",
	"timeFormat": "timeFormat.js",
	"s2hms": "timeFormat.js",
	"timePass": "timeFormat.js",
	"unitFormat": "unitFormat.js",
	"UrlFormat": "urlFormat.js",
	"objUrl": "urlFormat.js",
	"urlObj": "urlFormat.js",
	"bindKeyMap": "keymap.js",
	"jsonphook": "Node.js",
	"jsonphookasync": "Node.js",
	"scriptBlock": "Node.js",
	"scriptIntercept": "Node.js",
	"removeJsonphook": "Node.js",
	"xhrhook": "open.js",
	"xhrhookAsync": "open.js",
	"removeXhrhook": "open.js",
	"xhrhookUltra": "open.js",
	"webpackhook": "webpackJsonp.js",
	"abv": "abv.js",
	"Base64": "Base64.js",
	"midcrc": "crc32.js",
	"crc32": "crc32.js",
	"bezier": "cubicBezier.js",
	"md5": "md5.js",
	"ProxyHandler": "proxyHandler.js",
	"urlsign": "sign.js",
	"hasOwn": "typeof.js",
	"isArray": "typeof.js",
	"isMap": "typeof.js",
	"isSet": "typeof.js",
	"isDate": "typeof.js",
	"isFunction": "typeof.js",
	"isString": "typeof.js",
	"isSymbol": "typeof.js",
	"isObject": "typeof.js",
	"isPromise": "typeof.js",
	"objectToString": "typeof.js",
	"toTypeString": "typeof.js",
	"toRawType": "typeof.js",
	"saveConfig": "config.js",
	"config": "config.js",
	"getCookies": "cookie.js",
	"setCookie": "cookie.js",
	"readAs": "file.js",
	"saveAs": "file.js",
	"fileRead": "file.js",
	"localStorage": "storage.js",
	"sessionStorage": "storage.js",
	"settingMG": "manage.js",
	"registerMenu": "setting.js",
	"registerSetting": "setting.js",
	"getSetting": "setting.js",
	"showSetting": "setting.js",
	"showSettingEntry": "ui.js",
	"aria2": "aria2.js",
	"pushDownload": "download.js",
	"downloadDefault": "download.js",
	"downloadOther": "download.js",
	"downloadUI": "downloadUI.js",
	"ef2": "ef2.js",
	"playinfoFiter": "playinfoFilter.js",
	"aid": "aid.js",
	"cid": "cid.js",
	"fnval": "fnval.js",
	"uid": "uid.js",
	"urlCleaner": "urlCleaner.js",
	"collection": "collection.js",
	"enLike": "enLike.js",
	"upList": "upList.js",
	"bangumiInitialState": "bangumi-initial-state.js",
	"bstarPlayurl": "bstarPlayurl.js"
}
/*!***********************!*/
/**/modules["domWrite.js"] = /*** ./src/include/domWrite.js ***/
`
    /** 函数栈 */
    const funcs = [];
    /**
     * 注册重写后第一时间运行
     * 重写模式下会清空各种回调，必须重新注册
     * @param func
     */
    function loadAfterClear(func) {
        func();
        API.rebuildType != "重定向" && funcs.push(func);
    }
    API.loadAfterClear = loadAfterClear;
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
    /** 清理全局变量 **必须使用\`window.close\`或\`documentWrite\`** */
    function windowClear() {
        GM.DOM.open();
        dushs.forEach(d => {
            try {
                Reflect.deleteProperty(window, d);
            }
            catch (e) {
                window[d] = undefined;
                API.debug(d);
            }
        });
        funcs.forEach(d => d());
    }
    API.windowClear = windowClear;
    /**
     * 使用\`document.write\`重写页面
     * @param html html框架
     * @param __INITIAL_STATE__ 是否清理\`__INITIAL_STATE__\`
     */
    function documentWrite(html) {
        GM.DOM.write(html);
        GM.DOM.close();
    }
    API.documentWrite = documentWrite;

//# sourceURL=file://@Bilibili-Old/include/domWrite.js`;
/*!***********************!*/
/**/modules["nodeObserver.js"] = /*** ./src/include/nodeObserver.js ***/
`
    const nodelist = [];
    /**
     * 注册节点添加监听
     * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
     * @param callback 添加节点后执行的回调函数
     * @returns 注册编号，用于使用\`removeObserver\`销毁监听
     */
    function observerAddedNodes(callback) {
        try {
            if (typeof callback === "function")
                nodelist.push(callback);
            return nodelist.length - 1;
        }
        catch (e) {
            API.debug.error(e);
        }
    }
    API.observerAddedNodes = observerAddedNodes;
    /**
     * 销毁\`observerAddedNodes\`监听
     * @param id 注册\`observerAddedNodes\`监听是返回的编号
     */
    function removeObserver(id) {
        nodelist.splice(id, 1);
    }
    API.removeObserver = removeObserver;
    const observe = new MutationObserver(d => d.forEach(d => {
        d.addedNodes[0] && nodelist.forEach(async (f) => {
            try {
                f(d.addedNodes[0]);
            }
            catch (e) {
                API.debug.error(d).error(e);
            }
        });
    }));
    API.loadAfterClear(() => {
        try {
            observe.disconnect();
        }
        catch (e) { }
        observe.observe(document, { childList: true, subtree: true });
    });

//# sourceURL=file://@Bilibili-Old/include/nodeObserver.js`;
/*!***********************!*/
/**/modules["units.js"] = /*** ./src/include/units.js ***/
`
    /** URL解构 */
    API.path = location.href.split("/");
    /** 标题记录 */
    API.title = "";
    /** 重构模式 */
    API.rebuildType = API.config.rebuildType;
    /** pgc标记 */
    API.pgc = false;
    /** ssid */
    API.ssid = 0;
    /** epid */
    API.epid = 0;
    /**
     * 重构重定向
     * @param name 判定名
     * @param url url记录
     * @param title title记录
     */
    function redirect(name, url = location.href, title = document.title) {
        API.sessionStorage.setItem("vector", \`\${name} \${url + (title ? (" " + title) : "")}\`);
        location.replace(\`\${location.origin}/favicon.ico\`);
    }
    API.redirect = redirect;
    /**
     * 修改当前URL而不出发重定向
     * **无法跨域操作！**
     * @param url 新URL
     */
    function replaceUrl(url) {
        window.history.replaceState(window.history.state, "", url);
    }
    API.replaceUrl = replaceUrl;
    /** 主动出发页面加载完成事件 */
    function loadendEvent() {
        document.dispatchEvent(new ProgressEvent("readystatechange"));
        document.dispatchEvent(new ProgressEvent("DOMContentLoaded"));
        window.dispatchEvent(new ProgressEvent("DOMContentLoaded"));
        window.dispatchEvent(new ProgressEvent("load"));
    }
    API.loadendEvent = loadendEvent;
    /**
     * 添加条件回调，条件为真时执行回调函数，用于检测函数运行时机
     * @param check 一个返回布尔值的函数，用于轮询，当函数返回值为真时执行回调函数
     * @param callback 待执行的回调函数，check的返回值会作为参数传入
     * @param delay 轮询间隔：/ms，默认100ms
     * @param stop 轮询最大延时：/s，多长时间后终止轮询，不做无谓的等待，默认180s，即3分钟。为0时永不终止直到为真。
     */
    function doWhile(check, callback, delay = 100, stop = 180) {
        let timer = setInterval(() => {
            const d = check();
            if (d) {
                clearInterval(timer);
                callback(d);
            }
        }, delay);
        stop && setTimeout(() => clearInterval(timer), stop * 1000);
    }
    API.doWhile = doWhile;
    /**
     * 节点到页面顶部的距离
     * @param node 目标节点
     * @returns 距离：/px
     */
    function getTotalTop(node) {
        var sum = 0;
        do {
            sum += node.offsetTop;
            node = node.offsetParent;
        } while (node);
        return sum;
    }
    API.getTotalTop = getTotalTop;
    /**
     * 添加css样式
     * @param txt css文本
     * @param id 样式ID，用于唯一标记
     * @param parrent 添加到的父节点，默认为head
     */
    async function addCss(txt, id, parrent) {
        if (!parrent && !document.head) {
            await new Promise(r => doWhile(() => document.body, r));
        }
        parrent = parrent || document.head;
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        id && !parrent.querySelector(\`#\${id}\`) && style.setAttribute("id", id);
        style.appendChild(document.createTextNode(txt));
        parrent.appendChild(style);
    }
    API.addCss = addCss;
    /**
     * 加载外源脚本
     * 支持加载完成后执行回调函数或者返回Promise
     * @param src 外源脚本url
     * @param onload 加载完成后的回调函数
     */
    function loadScript(src, onload) {
        return new Promise((r, j) => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", () => {
                script.remove();
                onload && onload();
                r(true);
            });
            script.addEventListener('error', () => {
                script.remove();
                j();
            });
            document.body.appendChild(script);
        });
    }
    API.loadScript = loadScript;
    /**
     * 从url中提取指定参数
     * @param name 参数名
     * @returns 参数值，不存在返回null
     */
    function getUrlValue(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|\$)", "i");
        const r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURIComponent(r[2]);
        return null;
    }
    API.getUrlValue = getUrlValue;
    /**
     * 创建HTML节点
     * @param tag 节点名称
     * @param attribute 节点属性对象
     * @param parrent 添加到的父节点，默认为body
     * @param innerHTML 节点的innerHTML
     * @param top 是否在父节点中置顶
     * @param replaced 替换节点而不是添加，被替换的节点，将忽略父节点相关参数
     */
    function addElement(tag, attribute, parrent, innerHTML, top, replaced) {
        let element = document.createElement(tag);
        attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
        parrent = parrent || document.body;
        innerHTML && (element.innerHTML = innerHTML);
        replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
        return element;
    }
    API.addElement = addElement;
    /** 检查xhr.status是否符合正常 */
    function statusCheck(status) {
        return (status >= 200 && status < 300) || status === 304;
    }
    API.statusCheck = statusCheck;

//# sourceURL=file://@Bilibili-Old/include/units.js`;
/*!***********************!*/
/**/modules["url.js"] = /*** ./src/include/url.js ***/
`
    class Url {
        constructor() {
            this.access_key = API.config.accessKey.key || undefined;
            /** url的默认参数，即UrlDetail未列出或可选的部分 */
            this.jsonUrlDefault = {
                "api.bilibili.com/pgc/player/web/playurl": { qn: 127, otype: 'json', fourk: 1 },
                "api.bilibili.com/x/player/playurl": { qn: 127, otype: 'json', fourk: 1 },
                "interface.bilibili.com/v2/playurl": { appkey: 9, otype: 'json', quality: 127, type: '' },
                "bangumi.bilibili.com/player/web_api/v2/playurl": { appkey: 9, module: "bangumi", otype: 'json', quality: 127, type: '' },
                "api.bilibili.com/pgc/player/api/playurlproj": { access_key: this.access_key, appkey: 1, build: "2040100", device: "android", expire: "0", mid: "0", mobi_app: "android_i", module: "bangumi", otype: "json", platform: "android_i", qn: 127, ts: this.ts },
                "app.bilibili.com/v2/playurlproj": { access_key: this.access_key, appkey: 1, build: "2040100", device: "android", expire: "0", mid: "0", mobi_app: "android_i", otype: "json", platform: "android_i", qn: 127, ts: this.ts },
                "api.bilibili.com/pgc/player/api/playurltv": { appkey: 6, qn: 127, fourk: 1, otype: 'json', platform: "android", mobi_app: "android_tv_yst", build: 102801 },
                "api.bilibili.com/x/tv/ugc/playurl": { appkey: 6, qn: 127, fourk: 1, otype: 'json', platform: "android", mobi_app: "android_tv_yst", build: 102801 },
                "app.bilibili.com/x/intl/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: API.fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: this.ts },
                "apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: API.fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: this.ts },
                "api.bilibili.com/view": { type: "json", appkey: "8e9fc618fbd41e28" },
                "api.bilibili.com/x/v2/reply/detail": { build: "6042000", channel: "master", mobi_app: "android", platform: "android", prev: "0", ps: "20" },
                "app.bilibili.com/x/v2/activity/index": { appkey: 1, build: 3030000, c_locale: "zh_CN", channel: "master", fnval: API.fnval, fnver: 0, force_host: 0, fourk: 1, https_url_req: 0, mobi_app: "android_i", offset: 0, platform: "android", player_net: 1, qn: 32, s_locale: "zh_CN", tab_id: 0, tab_module_id: 0, ts: this.ts },
                "app.bilibili.com/x/v2/activity/inline": { appkey: 1, build: 3030000, c_locale: "zh_CN", channel: "master", fnval: API.fnval, fnver: 0, force_host: 0, fourk: 1, https_url_req: 0, mobi_app: "android_i", platform: "android", player_net: 1, qn: 32, s_locale: "zh_CN", ts: this.ts },
                "bangumi.bilibili.com/api/season_v5": { appkey: 2, build: "2040100", platform: "android" }
            };
        }
        get ts() {
            return new Date().getTime();
        }
        /**
         * 请求封装好的json请求
         * @param url 请求的url
         * @param detail 请求所需配置数据
         * @param GM 是否使用跨域请求
         * @returns Promise封装的返回值
         */
        getJson(url, detail, GM = false) {
            let obj = { ...(this.jsonUrlDefault[url] || {}), ...detail };
            (Number(Reflect.get(obj, "appkey")) >= 0) && (obj = this.sign(obj));
            return GM ? API.xhr.GM({
                url: API.objUrl(\`//\${url}\`, obj),
                responseType: "json"
            }) : API.xhr({
                url: API.objUrl(\`//\${url}\`, obj),
                responseType: "json",
                credentials: true
            });
        }
        sign(obj) {
            return API.urlObj(\`?\${API.urlsign("", obj, obj.appkey)}\`);
        }
    }
    /** 封装好的默认请求，已填好必须的参数 */
    API.url = undefined;
    Object.defineProperty(API, "url", { get: () => new Url() });

//# sourceURL=file://@Bilibili-Old/include/url.js`;
/*!***********************!*/
/**/modules["xhr.js"] = /*** ./src/include/xhr.js ***/
`
    /** 跨域请求及其值栈 */
    const catches = [];
    /** 请求栈 */
    const Record = {
        default: {}, arraybuffer: {}, blob: {}, document: {}, json: {}, text: {}
    };
    function xhr(details, cache = false) {
        details.method == "POST" && (details.headers = details.headers || {}, !details.headers["Content-Type"] && Reflect.set(details.headers, "Content-Type", "application/x-www-form-urlencoded"));
        if (details.async === false) {
            if (cache && Record[details.responseType || "default"][details.url])
                return Record[details.responseType || "default"][details.url];
            let xhr = new XMLHttpRequest();
            xhr.open(details.method || 'GET', details.url, false);
            details.responseType && (xhr.responseType = details.responseType);
            details.credentials && (xhr.withCredentials = true);
            details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
            details.timeout && (xhr.timeout = details.timeout);
            xhr.send(details.data);
            Promise.resolve().then(() => Record[details.responseType || "default"][details.url] = xhr.response);
            return xhr.response;
        }
        else
            return new Promise((resolve, reject) => {
                if (cache && Record[details.responseType || "default"][details.url])
                    return resolve(Record[details.responseType || "default"][details.url]);
                let xhr = new XMLHttpRequest();
                xhr.open(details.method || 'GET', details.url);
                details.responseType && (xhr.responseType = details.responseType);
                details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
                details.credentials && (xhr.withCredentials = true);
                details.timeout && (xhr.timeout = details.timeout);
                xhr.onabort = details.onabort || reject;
                xhr.onerror = details.onerror || reject;
                details.onloadstart && (xhr.onloadstart = details.onloadstart);
                details.onprogress && (xhr.onprogress = details.onprogress);
                details.onreadystatechange && (xhr.onreadystatechange = details.onreadystatechange);
                xhr.ontimeout = details.ontimeout || reject;
                xhr.onload = details.onload || (() => resolve(xhr.response));
                xhr.addEventListener("load", () => { Promise.resolve().then(() => Record[details.responseType || "default"][details.url] = xhr.response); });
                xhr.send(details.data);
            });
    }
    API.xhr = xhr;
    /**
     * 跨域请求日志
     * @returns 跨域请求及其结果
     */
    xhr.log = () => catches;
    /**
     * \`GM_xmlhttpRequest\`的\`Promise\`封装，用于跨域\`XMLHttpRequest\`请求
     * @param details 以对象形式传递的参数，注意\`onload\`回调会覆盖Promise结果
     * @param cache 是否缓存结果？默认否
     * @returns \`Promise\`托管的请求结果或者报错信息
     */
    xhr.GM = function (details, cache = false) {
        return new Promise((resolve, reject) => {
            if (cache && Record[details.responseType || "default"][details.url])
                return resolve(Record[details.responseType || "default"][details.url]);
            details.method = details.method || 'GET';
            details.onload = details.onload || ((xhr) => {
                Promise.resolve().then(() => Record[details.responseType || "default"][details.url] = xhr.response);
                catches.push([details.url, xhr.response]);
                resolve(xhr.response);
            });
            details.onerror = details.onerror || ((xhr) => {
                catches.push([details.url, xhr.response]);
                reject(xhr.response);
            });
            GM.GM_xmlHttpRequest(details);
        });
    };
    function get(url, details = {}, cache = false) {
        !Reflect.has(details, "credentials") && (details.credentials = true);
        return xhr({ url: url, ...details }, cache);
    }
    xhr.get = get;
    function post(url, data, contentType = "application/x-www-form-urlencoded", details = {}, cache = false) {
        !Reflect.has(details, "credentials") && (details.credentials = true);
        details.headers = { "Content-Type": contentType, ...details.headers };
        return xhr({ url: url, method: "POST", data: data, ...details }, cache);
    }
    xhr.port = post;

//# sourceURL=file://@Bilibili-Old/include/xhr.js`;
/*!***********************!*/
/**/modules["accessKey.js"] = /*** ./src/include/bilibili/accessKey.js ***/
`
    class AccessKey {
        /** 获取账户授权 */
        static async get() {
            if (!API.uid)
                return (API.toast.warning("请先登录！"), API.biliQuickLogin());
            const msg = API.config.accessKey.key ? API.toast.custom(0, "warning", "您正在更新账户授权！") : API.toast.custom(0, "info", "您正在进行账户授权操作！");
            try {
                let data = await API.xhr.GM({
                    url: API.urlsign("https://passport.bilibili.com/login/app/third?api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png", undefined, 3),
                    responseType: "json"
                });
                data = await new Promise((resolve, reject) => {
                    GM.GM_xmlHttpRequest({
                        method: "GET",
                        url: data.data.confirm_uri,
                        onload: (xhr) => resolve(xhr.finalUrl),
                        onerror: (xhr) => reject(xhr),
                    });
                });
                this.data = data = API.urlObj(data);
                API.config.accessKey.key = data.access_key;
                API.config.accessKey.date = API.timeFormat(new Date().getTime(), true);
                const key = API.getSetting("accessKey.action");
                key.label = "撤销授权";
                key.button = "撤销";
                if (msg) {
                    msg.type = "success";
                    msg.data = ["账户授权成功~"];
                    msg.delay = 3;
                }
            }
            catch (e) {
                if (msg) {
                    msg.type = "error";
                    msg.data = ["账户授权出错 ಥ_ಥ", e];
                    msg.delay = 3;
                }
                API.debug.error("账户授权", e);
            }
        }
        /** 撤销账户授权 */
        static async remove() {
            if (!API.config.accessKey.key)
                return;
            const msg = API.toast.custom(0, "info", "您正在撤销账户授权！");
            API.config.accessKey.key = "";
            API.config.accessKey.date = "";
            const key = API.getSetting("accessKey.action");
            key.label = "授权操作";
            key.button = "授权";
            if (msg) {
                msg.type = "success";
                msg.data = ["撤销授权成功~"];
                msg.delay = 3;
            }
        }
    }
    /** 参数缓存 */
    AccessKey.data = GM.GM_getValue("third_login");
    API.AccessKey = AccessKey;

//# sourceURL=file://@Bilibili-Old/include/bilibili/accessKey.js`;
/*!***********************!*/
/**/modules["jsonCheck.js"] = /*** ./src/include/bilibili/jsonCheck.js ***/
`
    /**
     * 检查B站json接口返回值并格式化为json
     * 对于code异常将直接抛出错误！
     * @param data B站接口的response
     * @returns 格式化后的json
     */
    function jsonCheck(data) {
        let result = typeof data === "string" ? JSON.parse(data) : data;
        if ("code" in result && result.code !== 0) {
            let msg = result.msg || result.message || "";
            throw [result.code, msg];
        }
        return result;
    }
    API.jsonCheck = jsonCheck;

//# sourceURL=file://@Bilibili-Old/include/bilibili/jsonCheck.js`;
/*!***********************!*/
/**/modules["loginExit.js"] = /*** ./src/include/bilibili/loginExit.js ***/
`
    /**
     * 代理退出登录功能
     * @param referer 退出后跳转的页面URL
     */
    async function loginExit(referer) {
        if (!API.uid)
            return API.toast.warning("本就未登录，无法退出登录！");
        const msg = API.toast.custom(0, "warning", API.Name, "正在退出登录...");
        try {
            let data = API.jsonCheck(await API.xhr({
                url: "https://passport.bilibili.com/login/exit/v2",
                data: \`biliCSRF=\${API.getCookies().bili_jct}&gourl=\${encodeURIComponent(location.href)}\`,
                method: "POST",
                credentials: true
            }));
            if (data.status) {
                msg && (msg.data = [API.Name, "成功退出登录~"]);
                msg && (msg.type = "success");
                if (referer)
                    return location.replace(referer);
                setTimeout(() => location.reload(), 1000);
            }
            else {
                msg && (msg.data = [API.Name, "操作失败~"]);
                msg && (msg.type = "error");
                msg && (msg.delay = 4);
                API.debug.error("退出登录", data);
            }
        }
        catch (e) {
            msg && (msg.data = [API.Name, "操作失败~"]);
            msg && (msg.type = "error");
            msg && (msg.delay = 4);
            API.debug.error("退出登录", e);
        }
    }
    API.loginExit = loginExit;

//# sourceURL=file://@Bilibili-Old/include/bilibili/loginExit.js`;
/*!***********************!*/
/**/modules["MediaMeta.js"] = /*** ./src/include/bilibili/MediaMeta.js ***/
`
    /** 信息存档 */
    let temp;
    /**
     * 媒体控制器MediaMeta信息
     * @param data MediaMeta数据
     */
    function mediaSession(data) {
        Promise.resolve().then(() => window.GrayManager.setActionHandler());
        const check = JSON.stringify(data);
        if (temp === check)
            return;
        temp = check;
        if (!navigator.mediaSession.metadata)
            navigator.mediaSession.metadata = new MediaMetadata({ ...data });
        else {
            navigator.mediaSession.metadata.title = data.title;
            navigator.mediaSession.metadata.artist = data.artist;
            navigator.mediaSession.metadata.album = data.album;
            navigator.mediaSession.metadata.artwork = data.artwork;
        }
    }
    API.mediaSession = mediaSession;
    /** 设置媒体控制信息 */
    function setMediaSession() {
        API.xhr({
            url: \`https://api.bilibili.com/x/article/cards?ids=av\${API.aid}\`,
            responseType: "json"
        }, true).then(d => {
            if (d.data[\`av\${API.aid}\`]) {
                mediaSession({
                    title: d.data[\`av\${API.aid}\`].title,
                    artist: d.data[\`av\${API.aid}\`].owner.name,
                    album: API.epid ? \`ep\${API.epid}\` : \`av\${API.aid}\`,
                    artwork: [
                        { src: API.cover = d.data[\`av\${API.aid}\`].pic }
                    ]
                });
                API.title = API.epid ? \`ep\${API.epid}\` : \`av\${API.aid}\` + " " + d.data[\`av\${API.aid}\`].title;
            }
        }).catch(e => { API.debug.error("MediaSession", e); });
    }
    API.setMediaSession = setMediaSession;

//# sourceURL=file://@Bilibili-Old/include/bilibili/MediaMeta.js`;
/*!***********************!*/
/**/modules["quickLogin.js"] = /*** ./src/include/bilibili/quickLogin.js ***/
`
    /**
     * 拉起B站快捷登录面板
     */
    function biliQuickLogin() {
        window.biliQuickLogin ? window.biliQuickLogin() : API.loadScript("//static.hdslb.com/account/bili_quick_login.js", () => biliQuickLogin());
    }
    API.biliQuickLogin = biliQuickLogin;

//# sourceURL=file://@Bilibili-Old/include/bilibili/quickLogin.js`;
/*!***********************!*/
/**/modules["segProgress.js"] = /*** ./src/include/bilibili/segProgress.js ***/
`
    class SegProgress {
        constructor(resp) {
            if (!resp || resp.length == 0)
                return;
            this.init(resp);
        }
        async init(view_points) {
            if (!SegProgress.cssInited) {
                SegProgress.cssInited = true;
                API.addCss(\`
                            .bilibili-progress-segmentation-logo{display:inline-block;position:absolute;top:-12px;height:30px;width:1px; transition: opacity .1s}
                            .bilibili-progress-segmentation-logo>img{position: absolute;top:-14px;transform:translate(-50%,-50%) scale(0.7);left:50%;transition:top 0.1s}
                            .bilibili-progress-segmentation-logo>svg{position: absolute;top: -19px;width: 32px;height: 36px;transform: translate(-50%, -50%)}
                            .bilibili-player.mode-widescreen .bilibili-progress-segmentation-logo>img,
                            .bilibili-player.mode-webfullscreen .bilibili-progress-segmentation-logo>img,
                            .bilibili-player.mode-fullscreen .bilibili-progress-segmentation-logo>img{top:-18px;left:50%;transform:translate(-50%,-50%) scale(1)}
                            .bilibili-progress-segmentation{height:29px;position:absolute;top:-12px}
                            .bilibili-progress-segmentation:hover > div > div{border-color:#fb7299;border-style:solid;border-width:0 2px;width:100%;height:3px;top:6px;left:-2px;position:relative;background:#fb7299}
                            .bilibili-progress-segmentation > div{box-sizing:border-box;border-style:solid;border-color:#fb7299;border-left-width:2px;position:absolute;width:100%;height:6px;top:12px}
                            .bilibili-progress-detail-chapter{top:-96px;position:absolute;width:100%;font-size:17px;font-weight:bold;color:#fff;text-shadow:0 0 5px #000}
                            .bilibili-progress-segmentation:last-child > div{border-right-width:2px}
                            .bilibili-player-filter-chapter:hover{color:#00a1d6}
                            .bilibili-player-chapterList{position:relative;height:100%;width:100%;overflow:auto}
                            .bilibili-player-chapterList::-webkit-scrollbar{width:6px}
                            .bilibili-player-chapterList::-webkit-scrollbar-track{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList::-webkit-scrollbar-thumb{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-track{background-color:#edf2f9}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-thumb{background-color:#a2a2a2}
                            .bilibili-player-chapter-info{width:100%;height:72px;margin-top:5px;white-space:normal;font-size:14px;position:relative;cursor:pointer}
                            .bilibili-player-chapter-info > img{position:absolute;left:15px;top:4px;border-radius:2px}
                            .bilibili-player-chapter-info > p{padding-top:5px;margin:0 5px 5px 138px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;height:43px}
                            .bilibili-player-chapter-info:hover > p{color:#00a1d6}
                            .bilibili-player-chapter-info > span{color:#99a2aa}
                            .bilibili-player-chapter-info.active{background-color:#f3f3f3}\`);
            }
            let sliderTracker = document.querySelector(".bilibili-player-video-progress .bpui-slider-tracker"); // 播放进度区域，6px
            let sliderBar = document.getElementsByClassName("bilibili-player-video-progress-bar")[0];
            let handleWidth = document.getElementsByClassName("bpui-slider-handle")[0].clientWidth; // 进度条圆形把手的宽度
            let trackerWrp = document.getElementsByClassName("bpui-slider-tracker-wrp")[0]; // 进度条可控区域，28px
            let videoDuration = window.player.getDuration(); // 视频总时长
            // 创建显示在视频预览缩略图上方的看点标题
            let chptName = document.createElement("div");
            chptName.className = "bilibili-progress-detail-chapter";
            document.querySelector(".bilibili-player-video-progress-detail").appendChild(chptName);
            // 添加分段进度条
            let type = view_points[0].type; // type = 1：赛事看点，type = 2：视频分段
            let segDivs = []; // 存放所有分段Div
            for (let v of view_points) {
                let seg = document.createElement("div");
                if (type == "1") {
                    seg.className = "bilibili-progress-segmentation-logo";
                    let title = document.createElement("div"); // 看点标题
                    title.innerHTML = "-> " + v.content;
                    title.className = "bilibili-progress-detail-chapter";
                    title.style.cssText = "width: auto; transform: translateX(-50%); display: none";
                    let img;
                    if (v.logoUrl) {
                        img = document.createElement("img"); // 看点图标
                        img.id = "segmentation-logo";
                        img.width = 32;
                        img.height = 36;
                        img.src = v.logoUrl;
                    }
                    else {
                        img = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        img.setAttribute("viewBox", "0 -3 32 36");
                        img.innerHTML = \`
                    <defs>
                    <radialGradient id="gradient">
                            <stop offset="10%" stop-color="#ffe78f"></stop>
                            <stop offset="40%" stop-color="#ffe996"></stop>
                            <stop offset="95%" stop-color="#fcecae"></stop>
                        </radialGradient>
                    </defs>
                    <path style="fill: rgb(252, 236, 174); stroke: rgb(252, 236, 174);" d="M 16 32.097 C 13.312 32.106 10.608 30.145 11 25.897 C 11.265 22.744 16 17.097 16 17.097 C 16 17.097 20.822 22.697 21.022 25.897 C 21.322 30.097 18.801 32.088 16 32.097 Z" transform="matrix(-1, 0, 0, -1, 32.021761, 49.196602)"></path>
                    <circle cx="16" cy="22" r="5" fill="url(#gradient)"/>\`;
                    }
                    img.addEventListener("mousemove", e => e.stopPropagation());
                    img.addEventListener("mouseenter", () => {
                        title.style.display = "";
                        img.style.zIndex = "1000";
                    });
                    img.addEventListener("mouseleave", () => {
                        title.style.display = "none";
                        img.style.zIndex = "";
                    });
                    img.addEventListener("click", () => window.player.seek(v.from));
                    seg.appendChild(title);
                    seg.appendChild(img);
                }
                else if (type == "2") {
                    seg.className = "bilibili-progress-segmentation";
                    let duration = view_points[view_points.length - 1].to;
                    let ratio = videoDuration / duration / duration;
                    seg.style.width = (v.to - v.from) * ratio * 100 + "%";
                    seg.style.left = v.from * ratio * 100 + "%";
                    seg.innerHTML = "<div><div></div></div>";
                    seg.onmouseenter = () => chptName.innerHTML = v.content;
                }
                segDivs.push(seg);
                sliderTracker.appendChild(seg);
            }
            if (type == "1") {
                API.addCss(\`#app #bilibiliPlayer .bilibili-player-video-progress-detail > .bilibili-player-video-progress-detail-img {top:-120px}
                            .bilibili-player-video-progress-detail > .bilibili-player-video-progress-detail-time {top:-48px}\`);
                function update() {
                    for (let i = 0; i < segDivs.length; i++) {
                        // 进度条上的鼠标坐标与视频时间点的互算公式，从bilibiliPlayer.js复制过来
                        // 使视频看点标记与点击进度条后实际跳转的时间点准确对应
                        segDivs[i].style.left = view_points[i].to / videoDuration * (trackerWrp.clientWidth - handleWidth) + handleWidth / 2 + "px";
                    }
                }
                setTimeout(() => update(), 500); // 等待进度条完全加载
                chptName.style.top = "-150px";
                let playerArea = document.getElementsByClassName("bilibili-player-area")[0], visibility = true;
                function hide() {
                    if (!visibility)
                        return;
                    visibility = false;
                    for (let i = 0; i < segDivs.length; i++)
                        segDivs[i].style.opacity = "0";
                    setTimeout(() => {
                        for (let i = 0; i < segDivs.length; i++)
                            segDivs[i].style.visibility = "hidden";
                    }, 100);
                }
                playerArea.addEventListener("mouseleave", e => {
                    hide();
                });
                playerArea.addEventListener("mousemove", e => {
                    let clientRect = playerArea.getBoundingClientRect();
                    if (e.pageY < clientRect.top + window.scrollY + clientRect.height * 0.65) {
                        hide();
                    }
                    else {
                        visibility = true;
                        for (let i = 0; i < segDivs.length; i++) {
                            segDivs[i].style.visibility = "";
                            segDivs[i].style.opacity = "1";
                        }
                    }
                });
                // 鼠标与看点图标的交互
                trackerWrp.addEventListener("mousemove", e => {
                    let closestPoint = 1e6;
                    // 鼠标位置->视频时间点
                    let box = sliderBar.getBoundingClientRect();
                    let pos = (e.pageX - (box.left + window.scrollX - document.body.clientLeft) - handleWidth / 2) / (trackerWrp.clientWidth - handleWidth) * videoDuration;
                    0 > pos && (pos = 0);
                    pos > videoDuration && (pos = videoDuration);
                    let thumbnailArea = 80 / (trackerWrp.clientWidth - handleWidth) * videoDuration;
                    let hitArea = trackerWrp.clientWidth > 400 ? thumbnailArea / 10 : thumbnailArea / 20; // 显示标题的鼠标坐标范围
                    for (let i = 0; i < view_points.length; i++) {
                        segDivs[i].style.zIndex = "";
                        if (view_points[i].to >= pos - hitArea && view_points[i].to <= pos + hitArea && Math.abs(view_points[i].to - pos) < closestPoint) {
                            chptName.innerHTML = view_points[i].content;
                            closestPoint = Math.abs(view_points[i].to - pos);
                            segDivs[i].style.zIndex = "1000";
                        }
                    }
                    if (closestPoint == 1e6)
                        chptName.innerHTML = "";
                });
                window.player.addEventListener("video_player_resize", () => update());
                trackerWrp.addEventListener("mouseleave", () => {
                    for (let i = 0; i < segDivs.length; i++) {
                        segDivs[i].className = "bilibili-progress-segmentation-logo";
                    }
                });
            }
            // 添加“视频看点”面板
            let wrapList = document.querySelector("div.bilibili-player-wraplist"); // 获取播放器右侧面板的容器div
            let panels = wrapList.children;
            let chptInfo = null; // 数组，存放每一看点的UI卡片
            let chptPanel = document.createElement("div"); // “视频看点”面板
            chptPanel.style.display = "none";
            chptPanel.className = "bilibili-player-filter-wrap bilibili-player-chapterList";
            wrapList.appendChild(chptPanel);
            let chptBtn = document.createElement("div"); // “视频看点”按钮
            chptBtn.className = "bilibili-player-filter-btn bilibili-player-filter-chapter bpui-component bpui-button bpui-button-type-small button";
            chptBtn.innerHTML = '<span class="bpui-button-text"><span>视频看点</span></span>';
            document.querySelector("div.bilibili-player-filter").appendChild(chptBtn);
            // 用当前播放进度刷新面板
            function refreshState() {
                if (!chptInfo)
                    return;
                let progress = window.player.getCurrentTime();
                for (let i = 0, v; i < view_points.length; i++) {
                    v = view_points[i];
                    if (progress < v.to) {
                        let active = document.querySelector(".bilibili-player-chapter-info.active");
                        active && active.classList.remove("active");
                        chptInfo[i].classList.add("active");
                        break;
                    }
                }
            }
            let timeFormat = (t) => t < 10 ? "0" + t : t;
            chptBtn.onclick = () => {
                let activePanel = document.querySelector("div.bilibili-player-filter-btn.active");
                if (activePanel == chptBtn)
                    return;
                // 切换按钮的激活状态
                activePanel.classList.remove("active");
                chptBtn.classList.add("active");
                for (let i = 0; i < panels.length; i++) {
                    const element = panels[i];
                    if (element.style.display == "block") {
                        element.style.display = "none";
                        break;
                    }
                }
                // 创建各个看点对应的UI卡片
                if (!chptInfo) {
                    chptInfo = [];
                    for (let i = 0, v; i < view_points.length; i++) {
                        v = view_points[i];
                        let dura = v.to - v.from;
                        let div = document.createElement("div");
                        div.className = "bilibili-player-chapter-info";
                        div.innerHTML = \`<img width="112" height="63" src="\${v.imgUrl}"/>
                                        <p class="chapter-name">\${v.content}</p>
                                        <span style="margin-left: 138px">\${timeFormat(Math.floor(v.from / 60))}:\${timeFormat(v.from % 60)}</span>
                                        <span style="margin-right: 5px; float: right;">\${dura >= 60 ? \`\${Math.floor(dura / 60)}分\` : ""}\${dura > 0 ? \`\${dura % 60}秒\` : ""}</span>\`;
                        div.onclick = (jumpto => () => {
                            window.player.seek(jumpto);
                            let active = document.querySelector(".bilibili-player-chapter-info.active");
                            active && active.classList.remove("active");
                            div.classList.add("active");
                        })(v.from);
                        chptInfo[i] = div;
                        chptPanel.appendChild(div);
                    }
                }
                ;
                chptPanel.style.display = "block";
                // 将当前的播放进度对应的UI卡片显示为灰色底色
                refreshState();
            };
            window.player.addEventListener("video_media_seeked", refreshState);
            chptPanel.onmouseenter = refreshState;
            class timer {
                static start() { if (!timer.handle)
                    timer.handle = setInterval(refreshState, 3000); }
                static stop() { if (timer.handle) {
                    clearInterval(timer.handle);
                    timer.handle = null;
                } }
            }
            window.player.addEventListener("video_media_playing", timer.start);
            window.player.addEventListener("video_media_pause", timer.stop);
            if (window.player.getState() == "PLAYING")
                timer.start();
        }
    }
    SegProgress.cssInited = false;
    API.SegProgress = SegProgress;

//# sourceURL=file://@Bilibili-Old/include/bilibili/segProgress.js`;
/*!***********************!*/
/**/modules["switchVideo.js"] = /*** ./src/include/bilibili/switchVideo.js ***/
`
    const switchlist = [];
    /**
     * 注册切P回调
     * 实际上是播放器每次初始化完成时回调，意思是首P也能用。
     * @param callback 切P时的回调函数
     */
    function switchVideo(callback) {
        try {
            if (typeof callback === "function")
                switchlist.push(callback);
        }
        catch (e) {
            API.debug.error("switchVideo.js", e);
        }
    }
    API.switchVideo = switchVideo;
    API.observerAddedNodes((node) => {
        if (/bilibili-player-area video-state-pause/.test(node.className)) {
            switchlist.forEach(async (d) => {
                try {
                    d();
                }
                catch (e) {
                    API.debug.error(d);
                    API.debug.error(e);
                }
            });
        }
    });

//# sourceURL=file://@Bilibili-Old/include/bilibili/switchVideo.js`;
/*!***********************!*/
/**/modules["uposReplace.js"] = /*** ./src/include/bilibili/uposReplace.js ***/
`
    /** upos服务器 */
    const UPOS = {
        "ks3（金山）": "upos-sz-mirrorks3.bilivideo.com",
        "ks3b（金山）": "upos-sz-mirrorks3b.bilivideo.com",
        "ks3c（金山）": "upos-sz-mirrorks3c.bilivideo.com",
        "ks32（金山）": "upos-sz-mirrorks32.bilivideo.com",
        "kodo（七牛）": "upos-sz-mirrorkodo.bilivideo.com",
        "kodob（七牛）": "upos-sz-mirrorkodob.bilivideo.com",
        "cos（腾讯）": "upos-sz-mirrorcos.bilivideo.com",
        "cosb（腾讯）": "upos-sz-mirrorcosb.bilivideo.com",
        "coso1（腾讯）": "upos-sz-mirrorcoso1.bilivideo.com",
        "coso2（腾讯）": "upos-sz-mirrorcoso2.bilivideo.com",
        "bos（腾讯）": "upos-sz-mirrorbos.bilivideo.com",
        "hw（华为）": "upos-sz-mirrorhw.bilivideo.com",
        "hwb（华为）": "upos-sz-mirrorhwb.bilivideo.com",
        "uphw（华为）": "upos-sz-upcdnhw.bilivideo.com",
        "js（华为）": "upos-tf-all-js.bilivideo.com",
        "hk（香港）": "cn-hk-eq-bcache-01.bilivideo.com",
        "akamai（海外）": "upos-hz-mirrorakam.akamaized.net",
    };
    /** 过滤短时间重复通知 */
    let dis = false, timer = 0;
    /**
     * 替换UPOS服务器
     * @param str playurl或包含视频URL的字符串
     * @param uposName 替换的代理服务器名 \`∈ keyof typeof UPOS\`
     */
    function uposReplace(str, uposName) {
        if (uposName === "不替换")
            return str;
        !dis && API.toast.custom(10, "warning", "已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", \`CDN：\${uposName}\`, \`UPOS：\${UPOS[uposName]}\`);
        dis = true;
        clearTimeout(timer);
        timer = setTimeout(() => dis = false, 1e3);
        return str.replace(/:\\\\?\\/\\\\?\\/[^\\/]+\\\\?\\//g, () => \`://\${UPOS[uposName]}/\`);
    }
    API.uposReplace = uposReplace;

//# sourceURL=file://@Bilibili-Old/include/bilibili/uposReplace.js`;
/*!***********************!*/
/**/modules["uposWithGM.js"] = /*** ./src/include/bilibili/uposWithGM.js ***/
`
    /** hook标记，防止重复操作 */
    let isHooking = false;
    /**
     * 修改xhr响应
     * @param target 目标XMLHttpRequest
     * @param res GM.xmlHttpRequest响应
     * @param v 目标XMLHttpRequest对应的回调
     */
    function defineRes(target, res, v) {
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
    /**
     * GM.xmlHttpRequest代理视频请求
     * @param url 视频流url关键词，若为数组，数组间是并的关系，即必须同时满足才会代理
     * @param UserAgent 指定UserAgent
     */
    function uposWithGM(url = ".m4s", UserAgent = API.config.userAgent) {
        if (isHooking)
            return;
        API.xhrhookUltra(url, function (target, args) {
            const obj = {
                method: args[0],
                url: args[1],
                headers: {
                    "user-agent": UserAgent
                },
                onloadstart: (res) => {
                    defineRes(this, res, () => { });
                }
            };
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
                        obj.onload = (res) => {
                            defineRes(this, res, v);
                        };
                    },
                    get: () => obj.onload
                },
                onerror: {
                    configurable: true,
                    set: v => {
                        obj.onerror = (res) => {
                            defineRes(this, res, v);
                        };
                    },
                    get: () => obj.onerror
                },
                timeout: {
                    configurable: true,
                    set: v => {
                        obj.timeout = v;
                    },
                    get: () => obj.timeout
                },
                ontimeout: {
                    configurable: true,
                    set: v => {
                        obj.ontimeout = (res) => {
                            defineRes(this, res, v);
                        };
                    },
                    get: () => obj.ontimeout
                },
                onprogress: {
                    configurable: true,
                    set: v => {
                        obj.onprogress = (res) => {
                            defineRes(this, res, v.bind(this, new ProgressEvent("progress", {
                                lengthComputable: res.lengthComputable,
                                loaded: res.loaded,
                                total: res.total
                            })));
                        };
                    },
                    get: () => obj.onprogress
                },
                onabort: {
                    configurable: true,
                    set: v => {
                        obj.onabort = (res) => {
                            defineRes(this, res, v);
                        };
                    },
                    get: () => obj.onabort
                },
                onreadystatechange: {
                    configurable: true,
                    set: v => {
                        obj.onreadystatechange = (res) => {
                            defineRes(this, res, v);
                        };
                    },
                    get: () => obj.onreadystatechange
                },
                setRequestHeader: {
                    configurable: true,
                    value: (name, value) => {
                        obj.headers && (obj.headers[name] = value);
                    }
                },
                send: {
                    configurable: true,
                    value: (body) => {
                        obj.method === "POST" && body && (obj.data = body);
                        const tar = GM.GM_xmlHttpRequest(obj);
                        this.abort = tar.abort.bind(tar);
                        return true;
                    }
                }
            });
        });
        isHooking = true;
    }
    API.uposWithGM = uposWithGM;

//# sourceURL=file://@Bilibili-Old/include/bilibili/uposWithGM.js`;
/*!***********************!*/
/**/modules["urlParam.js"] = /*** ./src/include/bilibili/urlParam.js ***/
`
    /** 将数据缓存起来，以免重复查询 */
    const catchs = { aid: {}, ssid: {}, epid: {} };
    /**
     * 从url中提取aid/cid/ssid/epid等信息，提取不到就尝试获取
     * @param url B站视频页url，或者提供视频相关参数
     * @param redirect 是否处理Bangumi重定向？注意对于失效视频，请主动置为\`false\`
     * @returns 对于bangumi，会设置\`pgc=true\`
     * @example
     * urlParam(location.href); // 完整url：会自动识别下面这些参数
     * urlParam("av806828803"); // av号
     * urlParam("av806828803?p=1"); // 指定分p
     * urlParam("BV1T34y1o72w"); // bv号
     * urlParam("ss3398"); // ss号
     * urlParam("ep84795"); // ep号
     * urlParam("aid=806828803"); // aid
     * urlParam("aid=806828803&p=1"); // 参数 + 分p
     * urlParam("avid=806828803"); // avid
     * urlParam("bvid=1T34y1o72w"); // bvid
     * urlParam("bvid=BV1T34y1o72w"); // 完整bvid
     * urlParam("ssid=3398"); // ssid
     * urlParam("epid=84795"); // epid
     * urlParam("season_id=3398"); // season_id
     * urlParam("ep_id=84795"); // ep_id
     */
    async function urlParam(url = location.href, redirect = true) {
        url && !url.includes("?") && (url = "?" + url);
        const obj = API.urlObj(url);
        let { aid, cid, ssid, epid, p } = obj;
        let pgc = false;
        !aid && (aid = obj.avid);
        !aid && (url.replace(/[aA][vV]\\d+/, d => aid = d.substring(2)));
        !aid && (url.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/, d => aid = API.abv(d)));
        !aid && obj.bvid && (aid = API.abv(obj.bvid));
        aid && !Number(aid) && (aid = API.abv(aid));
        p = p || 1;
        !ssid && (ssid = obj.seasonId);
        !ssid && (ssid = obj.season_id);
        !ssid && (url.replace(/[sS][sS]\\d+/, d => ssid = d.substring(2)));
        !epid && (epid = obj.episodeId);
        !epid && (epid = obj.ep_id);
        !epid && (url.replace(/[eE][pP]\\d+/, d => epid = d.substring(2)));
        if (!ssid && !epid && aid) {
            if (catchs.aid[aid])
                return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
            if (!cid) {
                try {
                    // 一般view接口：包含番剧重定向但无法突破有区域限制
                    let data = API.jsonCheck(await API.xhr({ url: API.objUrl("https://api.bilibili.com/x/web-interface/view", { "aid": aid }) }, true)).data;
                    if (data.redirect_url)
                        return urlParam(API.objUrl(data.redirect_url, { aid, cid, ssid, epid, p }));
                    catchs.aid[aid] = data.pages;
                    catchs.aid[aid].forEach((d) => d.aid = aid);
                    return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
                }
                catch (e) {
                    API.debug.error("view", e);
                    try {
                        // pagelist接口，无区域限制但无法番剧重定向
                        catchs.aid[aid] = API.jsonCheck(await API.xhr({ url: API.objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": aid }) }, true)).data;
                        catchs.aid[aid].forEach((d) => d.aid = aid);
                        return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
                    }
                    catch (e) {
                        API.debug.error("pagelist", e);
                        try {
                            // 上古view接口：无区域限制但无法番剧重定向，包含部分上古失效视频信息
                            catchs.aid[aid] = API.jsonCheck(await API.xhr({ url: \`//api.bilibili.com/view?appkey=8e9fc618fbd41e28&id=\${aid}&type=json\` }, true)).list;
                            catchs.aid[aid].forEach((d) => d.aid = aid);
                            return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
                        }
                        catch (e) {
                            API.debug.error("appkey", e);
                            try {
                                // BiliPlus接口：含失效视频信息（一般都有备份）
                                let data = API.jsonCheck(await API.xhr({ url: API.objUrl("https://www.biliplus.com/api/view", { "id": aid }) }, true));
                                catchs.aid[aid] = data.list || (data.v2_app_api && data.v2_app_api.pages);
                                catchs.aid[aid].forEach((d) => d.aid = aid);
                                if (redirect && data.v2_app_api && data.v2_app_api.redirect_url)
                                    return urlParam(API.objUrl(data.v2_app_api.redirect_url, { aid, cid, ssid, epid, p }));
                                return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
                            }
                            catch (e) {
                                API.debug.error("biliplus", e);
                            }
                        }
                    }
                }
            }
        }
        if (ssid || epid) {
            if (ssid && catchs.ssid[ssid])
                return catchs.ssid[ssid][p - 1] || catchs.ssid[ssid][0];
            if (epid && catchs.epid[epid])
                return catchs.epid[epid];
            pgc = true;
            const param = { ep_id: epid, season_id: ssid };
            let data = API.jsonCheck(await API.xhr({ url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", param) }, true)).result;
            ssid = data.season_id;
            catchs.ssid[ssid] = [];
            data.episodes.forEach((d) => {
                Object.assign(d, { ssid, pgc, epid: d.ep_id });
                catchs.aid[d.aid] = catchs.aid[d.aid] || [];
                catchs.aid[d.aid].push(d);
                catchs.ssid[ssid].push(catchs.epid[d.ep_id] = d);
            });
            if (epid)
                return catchs.epid[epid];
            return catchs.ssid[ssid][p - 1] || catchs.ssid[ssid][0];
        }
        return { aid, cid, ssid, epid, p, pgc };
    }
    API.urlParam = urlParam;

//# sourceURL=file://@Bilibili-Old/include/bilibili/urlParam.js`;
/*!***********************!*/
/**/modules["closedCaption.css"] = /*** ./src/include/bilibili/CC/closedCaption.css ***/
`/* CC字幕相关样式 */
/*对齐，悬停按钮显示菜单*/
#subtitle-setting-panel>div>* {
    margin-right: 5px;
}

#bilibili-player-subtitle-btn:hover>#subtitle-setting-panel {
    display: block !important;
}

/*滑动选择样式*/
#subtitle-setting-panel input[type="range"] {
    background-color: #ebeff4;
    -webkit-appearance: none;
    height: 4px;
    transform: translateY(-4px);
}

#subtitle-setting-panel input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    background: #fff;
    border-radius: 15px;
    border: 1px solid;
}

/*复选框和其对应标签样式*/
#subtitle-setting-panel input[type="checkbox"] {
    display: none;
}

#subtitle-setting-panel input~label {
    cursor: pointer;
}

#subtitle-setting-panel input:checked~label:before {
    content: '\\2714';
}

#subtitle-setting-panel input~label:before {
    width: 12px;
    height: 12px;
    line-height: 14px;
    vertical-align: text-bottom;
    border-radius: 3px;
    border: 1px solid #d3d3d3;
    display: inline-block;
    text-align: center;
    content: ' ';
}

/*悬停显示下拉框样式*/
#subtitle-setting-panel .bpui-selectmenu:hover .bpui-selectmenu-list {
    display: block;
}

/*滚动条样式*/
#subtitle-setting-panel ::-webkit-scrollbar {
    width: 7px;
}

#subtitle-setting-panel ::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: #EEE;
}

#subtitle-setting-panel ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #999;
}`;
/*!***********************!*/
/**/modules["closedCaption.js"] = /*** ./src/include/bilibili/CC/closedCaption.js ***/
`
    class ClosedCaption {
        constructor() {
            this.element = {}; // 节点集合
            this.data = {}; // 字幕缓存
            this.resizeRate = 100; // 字幕大小倍率
            this.subtitle = []; // 字幕栈
            this.ON = \`<svg width="22" height="28" viewbox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m4.07787,6.88102l14,0a2,2 0 0 1 2,2l0,10a2,2 0 0 1 -2,2l-14,0a2,2 0 0 1 -2,-2l0,-10a2,2 0 0 1 2,-2zm5,5.5a1,1 0 1 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0zm8,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0z"/></svg>\`;
            this.OFF = \`<svg width="22" height="28" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m15.172,21.87103l-11.172,0a2,2 0 0 1 -2,-2l0,-10c0,-0.34 0.084,-0.658 0.233,-0.938l-0.425,-0.426a1,1 0 1 1 1.414,-1.414l15.556,15.556a1,1 0 0 1 -1.414,1.414l-2.192,-2.192zm-10.21,-10.21c-0.577,0.351 -0.962,0.986 -0.962,1.71l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 0.713,-0.958l-1.751,-1.752zm1.866,-3.79l11.172,0a2,2 0 0 1 2,2l0,10c0,0.34 -0.084,0.658 -0.233,0.938l-2.48,-2.48a1,1 0 0 0 -0.287,-1.958l-1.672,0l-1.328,-1.328l0,-0.672a1,1 0 0 1 1,-1l2,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -1.977,1.695l-5.195,-5.195z"/></svg>\`;
            this.color = [
                { value: '16777215', content: '<span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span>' },
                { value: '16007990', content: '<b style="color:#F44336;text-shadow: #000 0px 0px 1px">红色</b>' },
                { value: '10233776', content: '<b style="color:#9C27B0;text-shadow: #000 0px 0px 1px">紫色</b>' },
                { value: '6765239', content: '<b style="color:#673AB7;text-shadow: #000 0px 0px 1px">深紫色</b>' },
                { value: '4149685', content: '<b style="color:#3F51B5;text-shadow: #000 0px 0px 1px">靛青色</b>' },
                { value: '2201331', content: '<b style="color:#2196F3;text-shadow: #000 0px 0px 1px">蓝色</b>' },
                { value: '240116', content: '<b style="color:#03A9F4;text-shadow: #000 0px 0px 1px">亮蓝色</b>' }
            ];
            this.position = [
                { value: 'bl', content: '左下角' },
                { value: 'bc', content: '底部居中' },
                { value: 'br', content: '右下角' },
                { value: 'tl', content: '左上角' },
                { value: 'tc', content: '顶部居中' },
                { value: 'tr', content: '右上角' }
            ];
            this.shadow = [
                { value: '0', content: '无描边', style: '' },
                { value: '1', content: '重墨', style: \`text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px,#000 -1px 0px 1px;\` },
                { value: '2', content: '描边', style: \`text-shadow: #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px;\` },
                { value: '3', content: '45°投影', style: \`text-shadow: #000 1px 1px 2px, #000 0px 0px 1px;\` }
            ];
            this.isON = false; // 是否启用
            this.captions = []; // 字幕集
            this.setting = GM.GM_getValue("subtitle", { backgroundopacity: 0.5, color: 16777215, fontsize: 1, isclosed: false, scale: true, shadow: "0", position: 'bc' });
            this.subtitlePrefer = GM.GM_getValue("subtitlePrefer"); // 默认语言
        }
        /** 绘制字幕面板 */
        initUI() {
            this.element.node = document.createElement("div");
            this.element.node.setAttribute("class", "bilibili-player-video-btn");
            this.element.node.setAttribute("id", "bilibili-player-subtitle-btn");
            this.element.node.setAttribute("style", "display: block;");
            this.element.span = API.addElement("span", {}, this.element.node);
            this.element.span.innerHTML = this.ON;
            this.isON = true;
            this.element.span.onclick = () => {
                if (this.isON)
                    this.iconSwitch();
                else
                    this.iconSwitch(this.caption);
            };
            this.element.table = API.addElement("div", { id: "subtitle-setting-panel", style: "position: absolute; bottom: 28px; right: 30px; background: white; border-radius: 4px; text-align: left; padding: 13px; display: none; cursor: default;" }, this.element.node);
            this.language();
            this.fontsize();
            this.fontcolor();
            this.fontshadow();
            this.fontposition();
            this.fontopacrity();
            API.addCss(API.getModule("closedCaption.css"), "caption");
            this.changeResize();
            this.changePosition();
        }
        /** 切换字幕样式 */
        changeStyle() {
            document.querySelector("#caption-style")?.remove();
            API.addCss(\`span.subtitle-item-background{opacity: \${this.setting.backgroundopacity};}
            span.subtitle-item-text {color:#\${("000000" + this.setting.color.toString(16)).slice(-6)};}
            span.subtitle-item {font-size: \${this.setting.fontsize * this.resizeRate}%;line-height: 110%;}
            span.subtitle-item {\${this.shadow[this.setting.shadow].style}}\`, "caption-style");
            GM.GM_setValue("subtitle", this.setting);
        }
        /** 切换字幕大小 */
        changeResize() {
            this.resizeRate = this.setting.scale ? window.player.getWidth() / 1280 * 100 : 100;
            this.changeStyle();
        }
        /** 切换字幕位置 */
        changePosition() {
            this.contain = document.querySelector(".bilibili-player-video-subtitle>div");
            this.contain.className = 'subtitle-position subtitle-position-'
                + (this.setting.position || 'bc');
            this.contain.style = '';
            GM.GM_setValue("subtitle", this.setting);
        }
        /** 字幕图标切换 */
        iconSwitch(caption) {
            if (caption) {
                this.isON = true;
                this.element.span.innerHTML = this.ON;
                this.setCaption(caption);
                this.text.innerHTML = caption.lan_doc;
                this.element.language.children[2].disabled = false;
            }
            else {
                this.isON = false;
                this.element.span.innerHTML = this.OFF;
                this.setCaption();
                this.text.innerHTML = "关闭";
                this.element.language.children[2].disabled = true;
            }
        }
        /** 字幕选择 */
        language() {
            this.element.language = API.addElement("div", {}, this.element.table);
            this.element.language.innerHTML = \`<div>字幕</div>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 100px;">
            <div class="bpui-selectmenu-txt">关闭</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 180px; overflow: hidden auto; white-space: nowrap;">
            <li class="bpui-selectmenu-list-row" data-value="close">关闭</li>
            </ul></div>
            <button class="bpui-button" style="padding: 0px 8px;">下载</button>
            <a class="bpui-button" href="https://member.bilibili.com/v2#/zimu/my-zimu/zimu-editor?cid=\${API.cid}&aid=\${API.aid}" target="_blank" title="" style="margin-right: 0px; height: 24px; padding: 0px 6px;">添加字幕</a>\`;
            let list = this.element.language.children[1].children[2];
            this.text = this.element.language.children[1].children[0];
            this.element.language.children[2].onclick = () => {
                this.caption.subtitle_url && fetch(this.caption.subtitle_url).then(d => {
                    d.blob().then(d => {
                        API.saveAs(d, \`\${API.title}-\${this.caption.lan_doc}.json\`);
                    });
                });
            };
            list.children[0].onclick = () => {
                this.text.innerHTML = "关闭";
                this.setCaption();
            };
            this.text.innerHTML = this.caption.lan_doc;
            this.captions = this.captions.reverse();
            this.captions.forEach((d) => {
                let temp = API.addElement("div", { class: "bpui-selectmenu-list-row", "data-value": d.lan }, list, d.lan_doc, true);
                temp.onclick = () => {
                    this.text.innerHTML = d.lan_doc;
                    this.iconSwitch(d);
                    GM.GM_setValue("subtitlePrefer", this.subtitlePrefer = d.lan);
                };
            });
        }
        /** 字幕大小 */
        fontsize() {
            this.element.fontsize = API.addElement("div", {}, this.element.table);
            this.element.fontsize.innerHTML = \`<div>字体大小</div>
            <input type="range" step="25" style="width: 70%;">
            <input id="subtitle-auto-resize" type="checkbox">
            <label for="subtitle-auto-resize" style="cursor: pointer;">自动缩放</label>\`;
            this.element.fontsize.children[1].value = this.setting.fontsize == 0.6 ? 0
                : this.setting.fontsize == 0.8 ? 25
                    : this.setting.fontsize == 1.3 ? 75
                        : this.setting.fontsize == 1.6 ? 100 : 50;
            this.element.fontsize.children[1].oninput = (e) => {
                const v = e.target.value / 25;
                this.setting.fontsize = v > 2 ? (v - 2) * 0.3 + 1 : v * 0.2 + 0.6;
                this.changeStyle();
            };
            this.element.fontsize.children[2].checked = this.setting.scale;
            this.element.fontsize.children[2].onchange = (e) => this.changeResize(this.setting.scale = e.target.checked);
        }
        /** 字幕颜色 */
        fontcolor() {
            this.element.fontcolor = API.addElement("div", {}, this.element.table);
            this.element.fontcolor.innerHTML = \`<span>字幕颜色</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt"><span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span></div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>\`;
            this.color.forEach(d => {
                if (d.value == this.setting.color)
                    this.element.fontcolor.children[1].children[0].innerHTML = d.content;
                let temp = API.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontcolor.children[1].children[2]);
                temp.innerHTML = d.content;
                temp.onclick = () => {
                    this.element.fontcolor.children[1].children[0].innerHTML = d.content;
                    this.changeStyle(this.setting.color = parseInt(d.value));
                };
            });
        }
        /** 字幕阴影 */
        fontshadow() {
            this.element.fontshadow = API.addElement("div", {}, this.element.table);
            this.element.fontshadow.innerHTML = \`<span>字幕描边</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">无描边</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>\`;
            this.shadow.forEach(d => {
                if (d.value == this.setting.shadow)
                    this.element.fontshadow.children[1].children[0].innerHTML = d.content;
                let temp = API.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontshadow.children[1].children[2]);
                temp.innerHTML = d.content;
                temp.onclick = () => {
                    this.element.fontshadow.children[1].children[0].innerHTML = d.content;
                    this.changeStyle(this.setting.shadow = d.value);
                };
            });
        }
        /** 字幕位置 */
        fontposition() {
            this.element.fontposition = API.addElement("div", {}, this.element.table);
            this.element.fontposition.innerHTML = \`<span>字幕位置</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">底部居中</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 100px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>\`;
            this.position.forEach(d => {
                if (d.value == this.setting.position)
                    this.element.fontposition.children[1].children[0].innerHTML = d.content;
                let temp = API.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontposition.children[1].children[2]);
                temp.innerHTML = d.content;
                temp.onclick = () => {
                    this.element.fontposition.children[1].children[0].innerHTML = d.content;
                    this.changePosition(this.setting.position = d.value);
                };
            });
        }
        /** 字幕透明度 */
        fontopacrity() {
            this.element.fontopacrity = API.addElement("div", {}, this.element.table);
            this.element.fontopacrity.innerHTML = \`<div>背景不透明度</div><input type="range" style="width: 100%;">\`;
            this.element.fontopacrity.children[1].value = this.setting.backgroundopacity * 100;
            this.element.fontopacrity.children[1].oninput = (e) => {
                this.changeStyle(this.setting.backgroundopacity = e.target.value / 100);
            };
        }
        /** 获取CC字幕信息 */
        async getCaption(data) {
            try {
                this.data = [];
                this.subtitle = this.captions = data || [];
                this.convertion(this.captions);
                let i = this.captions.findIndex(d => d.lan == this.subtitlePrefer);
                i = i < 0 ? 0 : i;
                if (this.captions[i])
                    await this.setCaption(this.captions[i]);
                if (this.caption) {
                    // 只在有字幕时添加面板
                    window.player.addEventListener('video_resize', (event) => {
                        this.changeResize(event);
                    });
                    let anchor = document.querySelector(".bilibili-player-video-btn-quality");
                    this.initUI();
                    if (!document.querySelector("#bilibili-player-subtitle-btn"))
                        anchor.insertAdjacentElement("afterend", this.element.node);
                }
            }
            catch (e) {
                API.debug.error("closedCaption.js", e);
            }
        }
        /**
         * 准备字幕翻译
         * @param arr 原始字幕组
         */
        convertion(arr) {
            let chs = false, base = undefined;
            arr.forEach(d => {
                d.lan && (d.lan === "zh-CN" && (chs = true),
                    d.lan === "zh-Hans" && (chs = true),
                    d.lan.includes("zh") && (base = { ...d }));
                API.config.downloadOther && API.pushDownload({
                    group: "CC字幕",
                    url: d.subtitle_url,
                    up: d.lan,
                    down: d.lan_doc,
                    fileName: \`\${API.title || \`av\${API.aid}\`}-\${d.lan_doc}.json\`
                });
            });
            if (chs || !base)
                return;
            base.lan = "zh-CN";
            base.lan_doc = "中文（繁=>简）";
            base.convert = true;
            arr.push(base);
        }
        /**
         * 设置CC字幕
         * @param caption CC字幕对象
         */
        async setCaption(caption) {
            let data = { body: [] }; // 空字幕
            if (caption && caption.subtitle_url) {
                this.data[caption.lan] = this.data[caption.lan] || await (await fetch(caption.subtitle_url.replace("http:", "https:"))).json();
                if (caption.convert) { // 繁 => 简
                    this.data[caption.lan] = JSON.parse(API.cht2chs(JSON.stringify(this.data[caption.lan])));
                    caption.convert = undefined;
                }
                data = this.data[caption.lan] || data;
            }
            window.player.updateSubtitle(data); // 投喂字幕数据给播放器
            setTimeout(() => {
                if (window.player.getState() == "PLAYING") {
                    // 刷新一次播放状态
                    window.player.pause();
                    window.player.play();
                }
            }, 1000);
            if (caption && caption.subtitle_url) {
                this.caption = caption; // 记忆当前字幕
                API.videoFloat("载入字幕：", this.caption.lan_doc, () => { });
            }
            else
                API.videoFloat("关闭弹幕");
        }
    }
    /** 为旧版播放器追加CC字幕功能 */
    API.closedCaption = new ClosedCaption();

//# sourceURL=file://@Bilibili-Old/include/bilibili/CC/closedCaption.js`;
/*!***********************!*/
/**/modules["allDanmaku.js"] = /*** ./src/include/bilibili/danmaku/allDanmaku.js ***/
`
    class AllDanmaku {
        constructor() {
            this.danmaku = [];
            this.note = API.toast.custom(0, "info", "冷却延时请尽量调大，以免短时间内大量请求被临时封端口！");
            this.float = API.toast.custom(0, "info", "正在尝试获取全部弹幕请耐心等待。。。");
            API.xhr({
                url: \`https://api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`,
                responseType: "json",
                credentials: true
            }, true).then(d => {
                this.pubdate = d.data.pubdate;
                this.pubdate = API.timeFormat(this.pubdate * 1000, true).split(" ")[0]; // 视频上传日期
                this.today = API.timeFormat(undefined, true).split(" ")[0]; // 当天日期
                this.time = this.today;
                this.arrP = this.pubdate.split("-");
                this.danmaku = [];
                if (this.pubdate) {
                    this.arrT = this.time.split("-");
                    this.check();
                }
                else {
                    return Promise.reject("获取视频上传日期数据失败，已停止~");
                }
            }).catch(e => {
                this.floatChange("error", ["获取全弹幕失败，已停止~"], 3);
                this.noteChange("error", ["ಥ_ಥ"], 3);
                API.debug.error("全弹幕装填", e);
            });
            this.pubdate = new Date(2009, 0);
        }
        floatChange(type, data, delay) {
            if (this.float) {
                this.float.type = type;
                this.float.data = data;
                (delay !== undefined) && (this.float.delay = delay);
            }
            switch (type) {
                case "error":
                    API.debug.error(...data);
                    break;
                case "success":
                    API.debug.log(...data);
                    break;
                case "info":
                    API.debug.log(...data);
                    break;
                case "warning":
                    API.debug.warn(...data);
                    break;
            }
        }
        noteChange(type, data, delay) {
            if (this.note) {
                this.note.type = type;
                data.forEach(d => {
                    if (this.note.data.length >= 20)
                        this.note?.data.shift();
                    this.note?.data.push(d);
                });
                (delay !== undefined) && (this.note.delay = delay);
            }
            switch (type) {
                case "error":
                    API.debug.error(...data);
                    break;
                case "success":
                    API.debug.log(...data);
                    break;
                case "info":
                    API.debug.log(...data);
                    break;
                case "warning":
                    API.debug.warn(...data);
                    break;
            }
        }
        async init() {
            try {
                // 获取当日日期
                this.arrT = this.time.split("-");
                // 如果年份小于投稿日，说明获取成功
                if (this.arrT[0] < this.arrP[0])
                    return this.done(1);
                // 年份相等但月份小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1])
                    return this.done(1);
                // 年月都相等，但日期小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2])
                    return this.done(1);
                // 日期未早于投稿日，正常请求日期数据
                this.noteChange("info", ["正在获取 " + this.time + " 日的弹幕。。。"]);
                let danmaku = await API.danmaku.getHistoryDanmaku(this.time);
                API.danmaku.sortDmById(danmaku, "idStr");
                danmaku.reverse();
                // 取最早一条弹幕的时间
                this.time = API.timeFormat(danmaku[danmaku.length - 1].ctime * 1000, true).split(" ")[0];
                this.danmaku = this.danmaku.concat(danmaku);
                this.floatChange("success", ["数据返回！已获取弹幕数：" + API.unitFormat(this.danmaku.length)]);
                this.arrT = this.time.split("-");
                // 如果当天不是投稿日，转入日期检查
                if (this.pubdate != this.today)
                    return this.check();
                // 否则结束弹幕获取，当前弹幕就是能获取到的全弹幕
                this.done(1);
            }
            catch (e) {
                API.debug.error("全弹幕装填", e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    this.floatChange("warning", ["弹幕获取出错！", "保留并载入已获取的弹幕"]);
                    this.done();
                }
                else {
                    this.floatChange("error", ["弹幕获取出错！", "已退出！"], 3);
                    this.noteChange("error", ["ಥ_ಥ"], 3);
                }
            }
        }
        /**
         * 按月份判断有弹幕时间
         * @returns 调用获取日期弹幕或者循环月份判断
         */
        async check() {
            try {
                // 如果年份小于投稿日，说明获取成功
                if (this.arrT[0] < this.arrP[0])
                    return this.done(1);
                // 年份相等但月份小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1])
                    return this.done(1);
                // 年月都相等，但日期小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2])
                    return this.done(1);
                // 日期未早于投稿日，正常请求月份数据
                let data = await API.xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/history/index", {
                        type: 1,
                        oid: API.cid,
                        month: this.arrT.slice(0, 2).join("-")
                    }),
                    credentials: true
                });
                data = API.jsonCheck(data).data;
                if (data && data[0]) {
                    // 当月有弹幕，进入日期判断
                    for (let i = data.length - 1; i >= 0; i--) {
                        let date = data[i].split("-");
                        if (date[2] < this.arrT[2]) {
                            // 当日在已获取弹幕之前，记录并跳出循环
                            this.timeT = data[i];
                            break;
                        }
                    }
                    if (this.timeT) {
                        // 延时转入日期请求
                        this.time = this.timeT;
                        this.timeT = undefined;
                        this.noteChange("info", [\`技能冷却中。。。请稍待 \${API.config.allDanmaku.delay} 秒钟\`]);
                        return setTimeout(() => this.init(), API.config.allDanmaku.delay * 1000);
                    }
                    else {
                        // 当月有弹幕但都不在已请求日之前，月份 -1 重载
                        if (this.arrT[1] > 1) {
                            this.arrT[1]--;
                            this.arrT[1] = API.integerFormat(this.arrT[1], 2);
                        }
                        else
                            this.arrT = [this.arrT[0] - 1, 12, 31];
                        this.noteChange("info", [\`获取前一个月数据 \${this.arrT.slice(0, 2).join("-")} 请稍待 \${API.config.allDanmaku.delay} 秒钟\`]);
                        return setTimeout(() => this.check(), API.config.allDanmaku.delay * 1000);
                    }
                }
                else {
                    // 当月无弹幕直接月份 -1 重载，月份等于 1 则取上年最后一天
                    if (this.arrT[1] > 1) {
                        this.arrT[1]--;
                        if (this.arrT[1] < 10)
                            this.arrT[1] = API.integerFormat(this.arrT[1], 2);
                    }
                    else
                        this.arrT = [this.arrT[0] - 1, 12, 31];
                    this.noteChange("info", [\`获取前一个月数据 \${this.arrT.slice(0, 2).join("-")} 请稍待 \${API.config.allDanmaku.delay} 秒钟\`]);
                    return setTimeout(() => this.check(), API.config.allDanmaku.delay * 1000);
                }
            }
            catch (e) {
                e = Array.isArray(e) ? e : [e];
                API.debug.error("全弹幕装填", e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    this.floatChange("warning", ["弹幕获取出错！", "保留并载入已获取的弹幕"]);
                    this.done();
                }
                else {
                    this.floatChange("error", ["弹幕获取出错！", "已退出！"]);
                    this.noteChange("error", ["ಥ_ಥ"], 3);
                }
            }
        }
        /**
         * 载入弹幕
         * @param boolean 判断获取成功还是失败，成功请传入真值。
         */
        async done(boolean) {
            try {
                // 历史弹幕里不包含代码弹幕必须额外处理
                this.noteChange("info", ["正在获取BAS/代码弹幕专包。。。"]);
                this.danmaku = this.danmaku.concat(await API.danmaku.specialDms());
            }
            catch (e) { }
            let danmaku = API.danmaku.danmakuFormat(this.danmaku);
            if (boolean) {
                this.floatChange("success", ["全弹幕获取成功，正在装填。。。", "总弹幕量：" + API.unitFormat(this.danmaku.length), "同时推送至下载面板，可右键保存 π_π"], 3);
            }
            this.noteChange("info", ["执行结束~"], 3);
            window.player?.setDanmaku(danmaku);
            API.config.downloadOther && API.pushDownload({
                group: "弹幕",
                data: danmaku,
                up: "全弹幕",
                down: \`N/A\`,
                callback: () => API.danmaku.saveDanmaku(danmaku, \`[全弹幕]\${API.title || API.cid}\`)
            });
        }
    }
    /** 全弹幕装填 */
    function allDanmaku() {
        if (!API.uid)
            return API.toast.warning("请登录后使用 ಥ_ಥ");
        if (!window.player)
            return API.toast.warning("请在播放页面使用本功能 →_→");
        if (!window.player.setDanmaku)
            return API.toast.warning("内部组件丢失！", "请检查【托管原生脚本】功能是否开启！");
        new AllDanmaku();
    }
    API.allDanmaku = allDanmaku;

//# sourceURL=file://@Bilibili-Old/include/bilibili/danmaku/allDanmaku.js`;
/*!***********************!*/
/**/modules["bilibiliBroadcast.json"] = /*** ./src/include/bilibili/danmaku/bilibiliBroadcast.json ***/
{
    "nested": {
        "bilibili": {
            "nested": {
                "broadcast": {
                    "nested": {
                        "v1": {
                            "nested": {
                                "AuthReq": {
                                    "fields": {
                                        "guid": {
                                            "type": "string",
                                            "id": 1
                                        },
                                        "connId": {
                                            "type": "string",
                                            "id": 2
                                        },
                                        "lastMsgId": {
                                            "type": "int64",
                                            "id": 3
                                        }
                                    }
                                },
                                "AuthResp": {
                                    "fields": {}
                                },
                                "HeartbeatReq": {
                                    "fields": {}
                                },
                                "HeartbeatResp": {
                                    "fields": {}
                                },
                                "TargetPath": {
                                    "fields": {
                                        "targetPaths": {
                                            "rule": "repeated",
                                            "type": "string",
                                            "id": 1
                                        }
                                    }
                                },
                                "MessageAckReq": {
                                    "fields": {
                                        "ackId": {
                                            "type": "int64",
                                            "id": 1
                                        },
                                        "ackOrigin": {
                                            "type": "string",
                                            "id": 2
                                        },
                                        "targetPath": {
                                            "type": "string",
                                            "id": 3
                                        }
                                    }
                                },
                                "Subscribe": {
                                    "fields": {
                                        "type": {
                                            "type": "string",
                                            "id": 1
                                        },
                                        "targetPaths": {
                                            "rule": "repeated",
                                            "type": "string",
                                            "id": 2
                                        }
                                    }
                                },
                                "Status": {
                                    "fields": {
                                        "code": {
                                            "type": "int32",
                                            "id": 1
                                        },
                                        "message": {
                                            "type": "string",
                                            "id": 2
                                        },
                                        "details": {
                                            "rule": "repeated",
                                            "type": "google.protobuf.Any",
                                            "id": 3
                                        }
                                    }
                                },
                                "FrameOption": {
                                    "fields": {
                                        "messageId": {
                                            "type": "int64",
                                            "id": 1
                                        },
                                        "sequence": {
                                            "type": "int64",
                                            "id": 2
                                        },
                                        "isAck": {
                                            "type": "bool",
                                            "id": 3
                                        },
                                        "status": {
                                            "type": "Status",
                                            "id": 4
                                        },
                                        "ackOrigin": {
                                            "type": "string",
                                            "id": 5
                                        }
                                    }
                                },
                                "BroadcastFrame": {
                                    "fields": {
                                        "options": {
                                            "type": "FrameOption",
                                            "id": 1
                                        },
                                        "targetPath": {
                                            "type": "string",
                                            "id": 2
                                        },
                                        "body": {
                                            "type": "google.protobuf.Any",
                                            "id": 3
                                        }
                                    }
                                },
                                "RoomJoinEvent": {
                                    "fields": {}
                                },
                                "RoomLeaveEvent": {
                                    "fields": {}
                                },
                                "RoomOnlineEvent": {
                                    "fields": {
                                        "online": {
                                            "type": "int32",
                                            "id": 1
                                        },
                                        "allOnline": {
                                            "type": "int32",
                                            "id": 2
                                        }
                                    }
                                },
                                "RoomMessageEvent": {
                                    "fields": {
                                        "targetPath": {
                                            "type": "string",
                                            "id": 1
                                        },
                                        "body": {
                                            "type": "google.protobuf.Any",
                                            "id": 2
                                        }
                                    }
                                },
                                "RoomErrorEvent": {
                                    "fields": {
                                        "status": {
                                            "type": "Status",
                                            "id": 1
                                        }
                                    }
                                },
                                "RoomReq": {
                                    "oneofs": {
                                        "event": {
                                            "oneof": [
                                                "join",
                                                "leave",
                                                "online",
                                                "msg"
                                            ]
                                        }
                                    },
                                    "fields": {
                                        "id": {
                                            "type": "string",
                                            "id": 1
                                        },
                                        "join": {
                                            "type": "RoomJoinEvent",
                                            "id": 2
                                        },
                                        "leave": {
                                            "type": "RoomLeaveEvent",
                                            "id": 3
                                        },
                                        "online": {
                                            "type": "RoomOnlineEvent",
                                            "id": 4
                                        },
                                        "msg": {
                                            "type": "RoomMessageEvent",
                                            "id": 5
                                        }
                                    }
                                },
                                "RoomResp": {
                                    "oneofs": {
                                        "event": {
                                            "oneof": [
                                                "join",
                                                "leave",
                                                "online",
                                                "msg",
                                                "err"
                                            ]
                                        }
                                    },
                                    "fields": {
                                        "id": {
                                            "type": "string",
                                            "id": 1
                                        },
                                        "join": {
                                            "type": "RoomJoinEvent",
                                            "id": 2
                                        },
                                        "leave": {
                                            "type": "RoomLeaveEvent",
                                            "id": 3
                                        },
                                        "online": {
                                            "type": "RoomOnlineEvent",
                                            "id": 4
                                        },
                                        "msg": {
                                            "type": "RoomMessageEvent",
                                            "id": 5
                                        },
                                        "err": {
                                            "type": "RoomErrorEvent",
                                            "id": 6
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "google": {
            "nested": {
                "protobuf": {
                    "nested": {
                        "Any": {
                            "fields": {
                                "type_url": {
                                    "type": "string",
                                    "id": 1
                                },
                                "value": {
                                    "type": "bytes",
                                    "id": 2
                                }
                            }
                        },
                        "Empty": {
                            "fields": {}
                        }
                    }
                }
            }
        }
    }
}
/*!***********************!*/
/**/modules["bilibiliBroadcastDanmaku.json"] = /*** ./src/include/bilibili/danmaku/bilibiliBroadcastDanmaku.json ***/
{
    "nested": {
        "bilibili": {
            "nested": {
                "broadcast": {
                    "nested": {
                        "message": {
                            "nested": {
                                "main": {
                                    "nested": {
                                        "DanmakuElem": {
                                            "fields": {
                                                "id": {
                                                    "type": "int64",
                                                    "id": 1
                                                },
                                                "progress": {
                                                    "type": "int32",
                                                    "id": 2
                                                },
                                                "mode": {
                                                    "type": "int32",
                                                    "id": 3
                                                },
                                                "fontsize": {
                                                    "type": "int32",
                                                    "id": 4
                                                },
                                                "color": {
                                                    "type": "uint32",
                                                    "id": 5
                                                },
                                                "midHash": {
                                                    "type": "string",
                                                    "id": 6
                                                },
                                                "content": {
                                                    "type": "string",
                                                    "id": 7
                                                },
                                                "ctime": {
                                                    "type": "int64",
                                                    "id": 8
                                                },
                                                "action": {
                                                    "type": "string",
                                                    "id": 9
                                                },
                                                "pool": {
                                                    "type": "int32",
                                                    "id": 10
                                                },
                                                "idStr": {
                                                    "type": "string",
                                                    "id": 11
                                                }
                                            }
                                        },
                                        "DanmukuEvent": {
                                            "fields": {
                                                "elems": {
                                                    "rule": "repeated",
                                                    "type": "DanmakuElem",
                                                    "id": 1
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
/*!***********************!*/
/**/modules["bilibiliDanmaku.json"] = /*** ./src/include/bilibili/danmaku/bilibiliDanmaku.json ***/
{
    "nested": {
        "bilibili": {
            "nested": {
                "DmWebViewReply": {
                    "fields": {
                        "state": {
                            "type": "int32",
                            "id": 1
                        },
                        "text": {
                            "type": "string",
                            "id": 2
                        },
                        "textSide": {
                            "type": "string",
                            "id": 3
                        },
                        "dmSge": {
                            "type": "DmSegConfig",
                            "id": 4
                        },
                        "flag": {
                            "type": "DanmakuFlagConfig",
                            "id": 5
                        },
                        "specialDms": {
                            "rule": "repeated",
                            "type": "string",
                            "id": 6
                        },
                        "checkBox": {
                            "type": "bool",
                            "id": 7
                        },
                        "count": {
                            "type": "int64",
                            "id": 8
                        },
                        "commandDms": {
                            "rule": "repeated",
                            "type": "CommandDm",
                            "id": 9
                        },
                        "dmSetting": {
                            "type": "DanmuWebPlayerConfig",
                            "id": 10
                        }
                    }
                },
                "CommandDm": {
                    "fields": {
                        "id": {
                            "type": "int64",
                            "id": 1
                        },
                        "oid": {
                            "type": "int64",
                            "id": 2
                        },
                        "mid": {
                            "type": "int64",
                            "id": 3
                        },
                        "command": {
                            "type": "string",
                            "id": 4
                        },
                        "content": {
                            "type": "string",
                            "id": 5
                        },
                        "progress": {
                            "type": "int32",
                            "id": 6
                        },
                        "ctime": {
                            "type": "string",
                            "id": 7
                        },
                        "mtime": {
                            "type": "string",
                            "id": 8
                        },
                        "extra": {
                            "type": "string",
                            "id": 9
                        },
                        "idStr": {
                            "type": "string",
                            "id": 10
                        }
                    }
                },
                "DmSegConfig": {
                    "fields": {
                        "pageSize": {
                            "type": "int64",
                            "id": 1
                        },
                        "total": {
                            "type": "int64",
                            "id": 2
                        }
                    }
                },
                "DanmakuFlagConfig": {
                    "fields": {
                        "recFlag": {
                            "type": "int32",
                            "id": 1
                        },
                        "recText": {
                            "type": "string",
                            "id": 2
                        },
                        "recSwitch": {
                            "type": "int32",
                            "id": 3
                        }
                    }
                },
                "DmSegMobileReply": {
                    "fields": {
                        "elems": {
                            "rule": "repeated",
                            "type": "DanmakuElem",
                            "id": 1
                        }
                    }
                },
                "DanmakuElem": {
                    "fields": {
                        "id": {
                            "type": "int64",
                            "id": 1
                        },
                        "progress": {
                            "type": "int32",
                            "id": 2
                        },
                        "mode": {
                            "type": "int32",
                            "id": 3
                        },
                        "fontsize": {
                            "type": "int32",
                            "id": 4
                        },
                        "color": {
                            "type": "uint32",
                            "id": 5
                        },
                        "midHash": {
                            "type": "string",
                            "id": 6
                        },
                        "content": {
                            "type": "string",
                            "id": 7
                        },
                        "ctime": {
                            "type": "int64",
                            "id": 8
                        },
                        "weight": {
                            "type": "int32",
                            "id": 9
                        },
                        "action": {
                            "type": "string",
                            "id": 10
                        },
                        "pool": {
                            "type": "int32",
                            "id": 11
                        },
                        "idStr": {
                            "type": "string",
                            "id": 12
                        },
                        "attr": {
                            "type": "int32",
                            "id": 13
                        }
                    }
                },
                "DanmuWebPlayerConfig": {
                    "fields": {
                        "dmSwitch": {
                            "type": "bool",
                            "id": 1
                        },
                        "aiSwitch": {
                            "type": "bool",
                            "id": 2
                        },
                        "aiLevel": {
                            "type": "int32",
                            "id": 3
                        },
                        "blocktop": {
                            "type": "bool",
                            "id": 4
                        },
                        "blockscroll": {
                            "type": "bool",
                            "id": 5
                        },
                        "blockbottom": {
                            "type": "bool",
                            "id": 6
                        },
                        "blockcolor": {
                            "type": "bool",
                            "id": 7
                        },
                        "blockspecial": {
                            "type": "bool",
                            "id": 8
                        },
                        "preventshade": {
                            "type": "bool",
                            "id": 9
                        },
                        "dmask": {
                            "type": "bool",
                            "id": 10
                        },
                        "opacity": {
                            "type": "float",
                            "id": 11
                        },
                        "dmarea": {
                            "type": "int32",
                            "id": 12
                        },
                        "speedplus": {
                            "type": "float",
                            "id": 13
                        },
                        "fontsize": {
                            "type": "float",
                            "id": 14
                        },
                        "screensync": {
                            "type": "bool",
                            "id": 15
                        },
                        "speedsync": {
                            "type": "bool",
                            "id": 16
                        },
                        "fontfamily": {
                            "type": "string",
                            "id": 17
                        },
                        "bold": {
                            "type": "bool",
                            "id": 18
                        },
                        "fontborder": {
                            "type": "int32",
                            "id": 19
                        },
                        "drawType": {
                            "type": "string",
                            "id": 20
                        }
                    }
                }
            }
        }
    }
}
/*!***********************!*/
/**/modules["commandDm.css"] = /*** ./src/include/bilibili/danmaku/commandDm.css ***/
`.commandDm-popup {
    border-radius: 1rem;
    background-color: #f5f5f5;
    position: absolute;
    cursor: default;
    opacity: 0;
    transition: opacity 0.2s;
    padding: 0.8rem 1rem;
}

.commandDm-popup.on {
    opacity: 1;
}

.vote-dialog {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.vote-panel {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.vote-title,
.grade-title {
    font-weight: bolder;
    margin-bottom: 0.5rem;
}

.vote-option {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.vote-button {
    text-align: center;
    min-width: 85px;
    display: inline-block;
    padding: 0.3rem 2rem;
    border: 1px solid #00a1d6;
    border-radius: 5px;
    margin: 0.2rem 0;
    background-color: #fff;
    cursor: pointer;
}

.vote-button:hover {
    background-color: #1baada;
    color: #f5f5f5;
    transition: all 0.15s ease-out;
}

.vote-button::before {
    position: absolute;
    padding: 0 1.8rem;
    left: 0;
    content: attr(idx);
}

.vote-progress-bg {
    border-radius: 5px;
    min-width: 85px;
    margin: 0.2rem 0;
    border: 1px solid #1a1a1a6b;
    background-color: white;
    position: relative;
}

.vote-progress {
    transition: width 0.3s, background-color 0.2s;
    animation: opacity-animation 0.5s;
    overflow: hidden;
    display: inline-block;
    border-radius: 4px 0 0 4px;
    background-color: #d3d3d3;
    text-align: left;
    overflow: visible;
    position: relative;
}

.vote-progress-blue {
    background-color: #9fdef3;
}

.vote-progress-desc {
    display: inline-block;
    margin: 0.3rem 0.8rem;
}

@keyframes opacity-animation {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.vote-count {
    display: inline-block;
    position: absolute;
    right: 0.8rem;
    top: 0.3rem;
}

.vote-count::after {
    content: "票";
}

.bilibili-player-video-popup {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.bilibili-player-video-popup>* {
    pointer-events: all;
}

.link-button {
    animation: opacity-animation 0.2s;
    position: absolute;
    left: 40%;
    top: 20%;
    background-color: #f5f5f5;
    padding: 0.4rem 1rem;
    border-radius: 0.6rem;
    font-size: large;
    box-shadow: #888888c7 0px 0px 6px;
}

.link-button:hover {
    color: #00a1d6;
    cursor: pointer;
}

.link-button>* {
    vertical-align: middle;
}

.link-button>img {
    transform: scale(0.7) translateY(-1px);
}

.danmaku-up-icon::before {
    content: "UP主";
    background-color: #00a1d6;
    border-radius: 5px;
    font-size: 0.8em;
    padding: 0.1em;
    transform: translateY(-0.1em);
    display: inline-block;
    box-shadow: #888888c7 0px 0px 6px;
}

.grade-score-area>div {
    display: inline-block;
    position: relative;
    width: 41px;
    transition: width 0.3s;
}

.grade-score-area.pointer {
    cursor: pointer;
}

.grade-score-area>div:last-child {
    width: 20px;
}

.grade-score-area .score-button {
    filter: grayscale(1);
}

.grade-score-area .highlight .score-button {
    filter: none;
}

.grade-score-area .bg {
    position: absolute;
    left: 0;
    filter: blur(9px);
    visibility: hidden;
}

.grade-score-area .highlight .bg {
    visibility: visible;
}

.grade-score-info {
    position: absolute;
    right: 1rem;
    bottom: 0.6rem;
    opacity: 0;
}

@keyframes grade-score-showup {
    0% {
        opacity: 0;
        transform: translateY(5px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes grade-score-hit {
    0% {
        filter: brightness(1);
    }

    30% {
        filter: brightness(1.5);
    }

    100% {
        filter: brightness(1);
    }
}`;
/*!***********************!*/
/**/modules["commandDm.js"] = /*** ./src/include/bilibili/danmaku/commandDm.js ***/
`
    API.addCss(API.getModule("commandDm.css"));
    let player, widgetContainer;
    let playing = false;
    let visible = true;
    let commandDm = {
        visible: [],
        hidden: [] // 未显示的互动弹幕
    };
    /** 初始化互动弹幕功能 */
    function init(cdm) {
        if (window.player) {
            if (widgetContainer === undefined)
                widgetContainer = initContainer();
            player = window.player;
            bindEvents();
            load(cdm);
        }
        else
            throw "获取window.player失败";
    }
    /**
     * 添加互动弹幕
     * @param commandDmRaw 从服务器获得的互动弹幕数据
     */
    function load(commandDmRaw) {
        commandDm.hidden = parseDm(commandDmRaw);
        resize();
    }
    /**
     * 创建互动弹幕的容器div
     * @returns div.bilibili-player-video-popup
     */
    function initContainer() {
        let videoWrap = document.getElementsByClassName("bilibili-player-video-wrap")[0];
        if (!videoWrap)
            throw "未能获取播放器div";
        let widgetContainer = document.createElement("div");
        widgetContainer.className = "bilibili-player-video-popup";
        videoWrap.appendChild(widgetContainer);
        return widgetContainer;
    }
    /** 绑定播放器事件，使用window.player.addEventListener */
    function bindEvents() {
        const EVENT = {
            VIDEO_MEDIA_PLAYING: "video_media_playing",
            VIDEO_MEDIA_PAUSE: "video_media_pause",
            VIDEO_MEDIA_SEEK: "video_media_seek",
            VIDEO_MEDIA_SEEKED: "video_media_seeked",
            VIDEO_MEDIA_ENDED: "video_media_ended",
            VIDEO_RESIZE: "video_resize",
            VIDEO_PLAYER_RESIZE: "video_player_resize",
            VIDEO_DESTROY: "video_destroy"
        };
        player.addEventListener(EVENT.VIDEO_MEDIA_PLAYING, play);
        player.addEventListener(EVENT.VIDEO_MEDIA_PAUSE, pause);
        player.addEventListener(EVENT.VIDEO_MEDIA_SEEK, pause);
        player.addEventListener(EVENT.VIDEO_MEDIA_SEEKED, play);
        player.addEventListener(EVENT.VIDEO_MEDIA_ENDED, pause);
        player.addEventListener(EVENT.VIDEO_PLAYER_RESIZE, resize);
        player.addEventListener(EVENT.VIDEO_DESTROY, destroy);
        // 开启/关闭弹幕事件
        document.querySelector("div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku").addEventListener("click", (event) => {
            let option = event.target.getAttribute("name");
            if (option == "ctlbar_danmuku_close") {
                visible = false;
                pause();
                widgetContainer.style.display = "none";
            }
            else if (option == "ctlbar_danmuku_on") {
                visible = true;
                play();
                widgetContainer.style.display = "";
            }
        });
    }
    /**
     * 生成互动弹幕的UI组件，各种后续处理
     * @param commandDmRaw 互动弹幕原始数据
     * @returns 互动弹窗的UI对象
     */
    function parseDm(commandDmRaw) {
        let popupWindow = [];
        for (let i = 0, cdm, extra, from; i < commandDmRaw.length; i++) {
            cdm = commandDmRaw[i];
            extra = JSON.parse(cdm.extra);
            from = cdm.progress / 1000;
            switch (cdm.command) {
                // 4种将会弹出界面的互动弹幕(见原生代码appendPopup())
                case "#ATTENTION#":
                case "#ACTORFOLLOW#":
                case "#MANAGERFOLLOW#":
                    API.debug.warn("未被支持的互动弹幕类型：" + cdm.command);
                    API.debug.warn(cdm);
                    break;
                case "#VOTE#": // 投票弹窗
                    popupWindow.push(new Vote(cdm, extra, from));
                    break;
                case "#GRADE#": // 评分弹窗
                    popupWindow.push(new Grade(cdm, extra, from));
                    break;
                // 滚动弹幕(见原生代码appendDmImg())，它们的渲染也许需要去修改原生弹幕渲染器
                case "#LINK#":
                    popupWindow.push(new Link(cdm, extra, from));
                    break;
                case "#RESERVE#":
                case "#ACTOR#":
                case "#ACTIVITYCOMBO#":
                    API.debug.warn("未被支持的互动弹幕类型：" + cdm.command);
                    API.debug.warn(cdm);
                    break;
            }
        }
        return popupWindow;
    }
    function play() {
        if (visible) {
            playing = true;
            loop();
        }
    }
    function pause() {
        playing = false;
        loop();
    }
    /** 播放器大小更改时触发 */
    function resize() {
        // 获得当前播放器显示分辨率与最小分辨率(680x504)时的缩放比，用于UI缩放
        let scaleX = widgetContainer.clientWidth / 680;
        let scaleY = widgetContainer.clientHeight / 504;
        for (let i = 0; i < commandDm.visible.length; i++) {
            commandDm.visible[i].resize(scaleX, scaleY, widgetContainer.clientWidth, widgetContainer.clientHeight);
        }
        for (let i = 0; i < commandDm.hidden.length; i++) {
            commandDm.hidden[i].resize(scaleX, scaleY, widgetContainer.clientWidth, widgetContainer.clientHeight);
        }
    }
    function loop() {
        let time = player.getCurrentTime(); // 获得以秒为单位的当前播放进度
        if (playing) {
            requestAnimationFrame(loop);
        }
        // 根据播放进度，显示、隐藏互动弹幕界面
        for (let i = 0, cdm; i < commandDm.hidden.length; i++) {
            cdm = commandDm.hidden[i];
            if (cdm.from < time && cdm.to > time) {
                commandDm.visible.push(cdm);
                commandDm.hidden.splice(i, 1);
                cdm.show();
                resize();
            }
        }
        for (let i = 0, cdm; i < commandDm.visible.length; i++) {
            cdm = commandDm.visible[i];
            if (cdm.to < time || cdm.from > time) {
                commandDm.hidden.push(cdm);
                commandDm.visible.splice(i, 1);
                cdm.hide();
            }
        }
    }
    function destroy() {
        playing = false;
        for (let i = 0; i < commandDm.visible.length; i++) {
            commandDm.visible[i].destroy();
        }
        for (let i = 0; i < commandDm.hidden.length; i++) {
            commandDm.hidden[i].destroy();
        }
        commandDm.visible.splice(0, commandDm.visible.length);
        commandDm.hidden.splice(0, commandDm.hidden.length);
    }
    function divClass(className) {
        let div = document.createElement("div");
        div.className = className;
        return div;
    }
    function isLoggedin() {
        if (API.uid)
            return true;
        player.pause();
        API.toast.warning("请先登录！");
        API.biliQuickLogin();
    }
    function post(url, data, contentType = "application/x-www-form-urlencoded;charset=UTF-8") {
        data.csrf = API.getCookies().bili_jct;
        return API.xhr({
            url: url,
            data: API.objUrl("", data),
            headers: { "Content-Type": contentType },
            method: "POST",
            credentials: true
        });
    }
    /** 弹窗组件 */
    class PopupWindow {
        constructor(cdm, extra, from) {
            this.duration = extra.duration / 1e3 || 5;
            this.from = from || 0;
            this.to = from + (extra.duration / 1e3 || 5);
            this.pos_x = extra.posX || 200;
            this.pos_y = extra.posY || 200;
            this.popup = divClass("commandDm-popup");
            this.popup.style.display = "none";
            widgetContainer.appendChild(this.popup);
        }
        show() {
            this.popup.style.display = "";
            requestAnimationFrame(() => this.popup.className = "commandDm-popup on");
        }
        hide() {
            this.popup.className = "commandDm-popup";
            setTimeout(() => this.popup.style.display = "none", 200);
        }
        destroy() {
        }
        /**
        * 根据视频区域大小等比缩放投票界面
        */
        resize(scaleX, scaleY, containerWidth, containerHeight) {
            this.popup.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min((scaleX + scaleY) / 2, 1.5) + ")";
            let left = this.pos_x * scaleX;
            let top = this.pos_y * scaleY;
            left = Math.max(left, this.popup.clientWidth / 2);
            top = Math.max(top, this.popup.clientHeight / 2);
            left = Math.min(left, containerWidth - this.popup.clientWidth / 2);
            top = Math.min(top, containerHeight - this.popup.clientHeight / 2);
            this.popup.style.left = left + "px";
            this.popup.style.top = top + "px";
        }
    }
    /** 投票互动UI */
    class Vote extends PopupWindow {
        constructor(cdm, extra, from) {
            super(cdm, extra, from);
            this.popup.style.width = "150px";
            this.total = extra.cnt;
            this.voteId = extra.vote_id;
            this.options = extra.options;
            this.question = extra.question;
            this.myVote = extra.my_vote; // 0：未投票  非零数字：已投票，my_vote的值即为已投项的idx
            let dialog = divClass("vote-dialog");
            let panel = divClass("vote-panel");
            let title = divClass("vote-title");
            title.innerHTML = this.question;
            let optionDiv = divClass("vote-option");
            let button = [];
            for (let i = 0, btn, opt; i < this.options.length; i++) {
                // 投票按钮
                opt = this.options[i];
                btn = divClass("vote-button");
                btn.innerHTML = opt.desc;
                btn.setAttribute("idx", opt.idx);
                btn.onclick = () => this.goVote(opt.idx, i);
                button[i] = btn;
                optionDiv.appendChild(btn);
            }
            panel.appendChild(optionDiv);
            dialog.appendChild(title);
            dialog.appendChild(panel);
            this.popup.appendChild(dialog);
            this.dialog = dialog;
            this.button = button;
            this.progress = [];
            // 已投票则直接显示结果
            if (this.myVote !== 0) {
                this.showResult();
                this.progress[this.myVote - 1].className = "vote-progress vote-progress-blue";
            }
            ;
        }
        goVote(idx, i) {
            if (isLoggedin()) {
                this.total += 1;
                this.options[i].cnt += 1;
                // 发送投票操作到服务器
                let url = "//api.bilibili.com/x/web-interface/view/dm/vote";
                post(url, {
                    aid: API.aid,
                    cid: API.cid,
                    progress: Math.max(Math.round(1e3 * player.getCurrentTime()), 1),
                    vote: idx,
                    vote_id: this.voteId
                }).then((resp) => {
                    resp = JSON.parse(resp);
                    biliAPI.verify(resp, "投票");
                    this.progress[i].className = "vote-progress vote-progress-blue";
                });
                this.myVote = idx;
                this.showResult();
                this.to += 5; //点击投票后推迟5秒消失，防止结果消失太快来不及看
            }
        }
        showResult() {
            // 显示票数、比例条
            this.count = [];
            for (let i = 0, progress, desc; i < this.button.length; i++) {
                this.button[i].onclick = null;
                this.button[i].innerHTML = "";
                this.button[i].className = "vote-progress-bg";
                progress = divClass("vote-progress");
                desc = divClass("vote-progress-desc");
                desc.innerHTML = this.options[i].desc;
                progress.appendChild(desc);
                this.button[i].appendChild(progress);
                this.progress[i] = progress;
                // 结果数据
                let cnt = divClass("vote-count");
                cnt.innerHTML = this.options[i].cnt;
                this.count[i] = cnt;
                this.button[i].appendChild(cnt);
            }
            this.resultAnimation();
        }
        /** 投票结果的动画 */
        resultAnimation() {
            // 投票比例条型图向右展开
            for (let i = 0; i < this.progress.length; i++) {
                this.progress[i].style.width = "0";
                requestAnimationFrame(() => this.progress[i].style.width = (this.options[i].cnt / this.total * 100) + "%");
            }
            // 右侧票数递增动画，持续0.8秒
            let start = performance.now();
            let frame = (t) => {
                let percentage = (t - start) * 0.00125;
                if (percentage < 1)
                    requestAnimationFrame(frame);
                else
                    percentage = 1;
                for (let i = 0; i < this.count.length; i++) {
                    this.count[i].innerHTML = Math.floor(this.options[i].cnt * percentage);
                }
            };
            requestAnimationFrame(frame);
        }
        show() {
            super.show();
            if (this.myVote !== 0) {
                this.resultAnimation();
            }
        }
        hide() {
            super.hide();
            this.to = this.from + this.duration; // 重设消失时间
        }
    }
    class Grade extends PopupWindow {
        constructor(cdm, info, from) {
            super(cdm, info, from);
            this.popup.style.width = "184px";
            this.gradeInfo = info;
            this.popup.innerHTML = \`
            <div style="display:block" class="grade-title">\${info.msg}</div>
            <div class="grade-score-area pointer"></div>
            <div class="grade-score-info" style="display:none">
                <div style="color:#6f6f6f;display:inline-block;">平均</div><span style="color:\${info.skin_font_color};font-size:27px" class="grade-avg-score">\${info.avg_score}</span>
            </div>
            <span style="position:absolute;right:1rem;top:0.8rem;font-size:12px;color:#6f6f6f" class="grade-score-count">\${info.count}人参与</span>
            \`;
            this.scoreInfo = this.popup.getElementsByClassName("grade-score-info")[0];
            let scoreArea = this.popup.getElementsByClassName("grade-score-area")[0];
            let scoreButton = [];
            function highlightScores(i) {
                for (let m = 0; m < 5; m++) {
                    if (m <= i && !scoreButton[m].highlight) {
                        scoreButton[m].highlight = true;
                        scoreButton[m].className = "highlight";
                    }
                    else if (m > i && scoreButton[m].highlight) {
                        scoreButton[m].highlight = false;
                        scoreButton[m].className = "";
                    }
                }
            }
            for (let i = 0; i < 5; i++) {
                let score = document.createElement("div");
                scoreButton[i] = score;
                score.innerHTML = \`
                <img width=20 hegiht=20 src="\${info.skin_selected}" class="bg"></img>
                <img width=20 hegiht=20 src="\${info.skin_selected}" class="score-button"></img>\`;
                scoreArea.appendChild(score);
                if (info.mid_score === 0) {
                    score.onmouseenter = () => highlightScores(i);
                    score.onclick = () => {
                        if (isLoggedin()) {
                            this.gradeInfo.avg_score = (this.gradeInfo.count * this.gradeInfo.avg_score + (i + 1) * 2) / (this.gradeInfo.count + 1);
                            this.gradeInfo.avg_score = this.gradeInfo.avg_score.toPrecision(2);
                            this.gradeInfo.count += 1;
                            this.popup.getElementsByClassName("grade-avg-score")[0].innerHTML = this.gradeInfo.avg_score;
                            this.popup.getElementsByClassName("grade-score-count")[0].innerHTML = this.gradeInfo.count + "人参与";
                            this.showResult();
                            for (let index = 0; index < 5; index++) {
                                if (index <= i) {
                                    scoreButton[index].style.animation = "grade-score-hit 0.7s ease forwards";
                                    setTimeout(() => scoreButton[index].style.animation = "", 1000);
                                }
                                scoreButton[index].onclick = null;
                                scoreButton[index].onmouseenter = null;
                            }
                            scoreArea.onmouseleave = null;
                            scoreArea.classList.remove("pointer");
                            this.goGrade((i + 1) * 2);
                        }
                    };
                }
            }
            ;
            if (info.mid_score === 0)
                scoreArea.onmouseleave = () => highlightScores(-1);
            this.scoreButton = scoreButton;
            if (info.mid_score != 0) {
                this.showResult();
                highlightScores(info.mid_score / 2 - 1);
                scoreArea.classList.remove("pointer");
            }
        }
        goGrade(score) {
            post("https://api.bilibili.com/x/v2/dm/command/grade/post", {
                aid: API.aid,
                cid: API.cid,
                progress: parseInt(player.getCurrentTime()) * 1000,
                grade_id: this.gradeInfo.grade_id,
                grade_score: score
            });
            this.to += 3;
        }
        showResult() {
            this.scoreInfo.style.display = "";
            this.scoreInfo.style.animation = "grade-score-showup 0.3s ease 0.2s forwards";
            for (let i = 0; i < 4; i++) {
                setTimeout(() => this.scoreButton[i].style.width = "24px", i * 50);
            }
        }
        hide() {
            super.hide();
            this.to = this.from + this.duration;
        }
    }
    /** 用于获取收藏列表有关信息 */
    class favList {
        static get() {
            if (this.list.length > 0)
                return Promise.resolve(this.list);
            return API.xhr({
                url: API.objUrl("//api.bilibili.com/x/v3/fav/folder/created/list-all", {
                    type: String(2),
                    rid: String(API.aid),
                    up_mid: String(API.uid)
                }),
                credentials: true
            }).then((resp) => {
                resp = JSON.parse(resp);
                biliAPI.verify(resp, "获取收藏列表");
                this.list = resp.data.list;
                this.list.forEach((v) => v.attr === 1 && (this.defaultFolderId = v.id));
                return this.list;
            });
        }
        static getDefaultFolder() {
            if (this.defaultFolderId !== 0)
                return Promise.resolve(this.defaultFolderId);
            return this.get().then(() => { return this.defaultFolderId; });
        }
    }
    favList.list = [];
    favList.defaultFolderId = 0;
    /** @see https://github.com/SocialSisterYi/bilibili-API-collect */
    class biliAPI {
        static verify(resp, msg) {
            if (resp.code !== 0) {
                API.toast.error(msg + "失败", resp.code, resp.message);
                throw msg + "失败";
            }
            return resp;
        }
        static like(bool) {
            bool = bool ? 1 : 2;
            return post("//api.bilibili.com/x/web-interface/archive/like", {
                aid: API.aid,
                like: bool
            }, "application/json; charset=utf-8").then((resp) => biliAPI.verify(resp, "点赞"));
        }
        static follow() {
            return post("//api.bilibili.com/x/relation/modify", {
                aid: API.aid,
                fid: window.getAuthorInfo().mid,
                act: 1,
                re_src: 14
            }).then((resp) => {
                resp = JSON.parse(resp);
                return biliAPI.verify(resp, "关注");
            });
        }
        static coin() {
        }
        static fav() {
            return post("//api.bilibili.com/x/v3/fav/resource/deal", {
                rid: API.aid,
                type: 2,
                add_media_ids: favList.defaultFolderId,
            }).then((resp) => {
                resp = JSON.parse(resp);
                return biliAPI.verify(resp, "收藏");
            });
        }
        static triple() {
            return post("//api.bilibili.com/x/web-interface/archive/like/triple", {
                aid: API.aid
            }, "application/json; charset=utf-8").then((resp) => {
                biliAPI.verify(resp, "三连");
                let d = resp.data;
                if (d.coin && d.like && d.fav)
                    return;
                if (!d.coin)
                    API.toast.error("投币失败");
                if (!d.like)
                    API.toast.error("点赞失败");
                if (!d.fav)
                    API.toast.error("收藏失败");
                return d;
            });
        }
    }
    /** 关联视频跳转按钮 */
    class Link {
        constructor(cdm, extra, from) {
            this.content = cdm.content;
            this.aid = extra.aid;
            this.from = from || 0;
            this.to = from + 5;
            this.pos_x = extra.posX || 200;
            this.pos_y = extra.posY || 200;
            /*
                <div class="link-button">
                    <img src="https://static.hdslb.com/images/favicon.ico">
                    <span>关联视频跳转</span>
                </div>
            */
            let button = divClass("link-button");
            let img = document.createElement("img");
            img.src = "https://static.hdslb.com/images/favicon.ico";
            let span = document.createElement("span");
            span.innerHTML = this.content;
            button.appendChild(img);
            button.appendChild(span);
            button.style.display = "none";
            button.onclick = () => {
                player.pause();
                window.open("https://www.bilibili.com/video/av" + this.aid);
            };
            widgetContainer.appendChild(button);
            this.button = button;
        }
        show() {
            this.button.style.display = "block";
        }
        hide() {
            this.button.style.display = "none";
        }
        /** 根据视频区域大小缩放，放大倍数限制在最大1.5倍 */
        resize(scaleX, scaleY) {
            this.button.style.left = (this.pos_x * scaleX) + "px";
            this.button.style.top = (this.pos_y * scaleY) + "px";
            this.button.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min(1.5, (scaleX + scaleY) / 2) + ")";
        }
        destroy() {
        }
    }
    /**
     * 程序入口
     * @param cdm 互动弹幕原始数据
     * @param aid aid
     * @param cid cid
     */
    async function loadCommandDm(cdm, aid, cid) {
        try {
            if (aid != aid || cid != cid || (widgetContainer !== undefined && document.getElementById("bilibiliPlayer").contains(widgetContainer))) {
                // 正在“载入其他视频弹幕”，不必处理互动弹幕
                return;
            }
            init(cdm); // 由于切P后整个播放器会被销毁重建，每次载入互动弹幕都需要重新绑定事件
        }
        catch (e) {
            API.toast.error("互动弹幕组件出错~");
            API.debug.error("互动弹幕组件出错~", e);
        }
    }
    API.loadCommandDm = loadCommandDm;

//# sourceURL=file://@Bilibili-Old/include/bilibili/danmaku/commandDm.js`;
/*!***********************!*/
/**/modules["danmaku.js"] = /*** ./src/include/bilibili/danmaku/danmaku.js ***/
`
    // 启动protobuf引擎
    if (!GM.protobuf) {
        API.toast.error("protobuf.js加载失败，新版弹幕等功能无法使用 ಥ_ಥ", "这可能是暂时性的网络问题不必惊慌！", "请临时关闭新版弹幕等功能以便正常使用~");
    }
    let root = GM.protobuf?.Root.fromJSON(API.getModule("bilibiliDanmaku.json"));
    const danmakuType = new Proxy({}, {
        get: (t, p, r) => {
            if (!t[p]) {
                if (!root) {
                    API.debug.error("protobuf 框架异常~", "无法解析protobuf弹幕 ಥ_ಥ");
                    return;
                }
                t[p] = root.lookupType(\`bilibili.\${p}\`);
            }
            return t[p];
        },
        set: (t, p, v, r) => true
    });
    /** 弹幕加载进度工具 */
    const loadProgress = {
        /** 弹幕显示面板 */
        get root() { return document.querySelector(".bilibili-player-danmaku-load-status"); },
        /** 当前进度 **不可外部调用，请用无下划线替代** */
        _pos: 0,
        /** 分包总数 **不可外部调用，请用无下划线替代** */
        _total: 0,
        /** 出错计数 **不可外部调用，请用无下划线替代** */
        _error: 0,
        set total(v) {
            this._total = v;
            this.root && (this.root.innerHTML = \`载入弹幕数据（\${this._pos || "--"}\${this._error ? (this._error) : ""}/\${parseInt(this._total) || "--"}）\`);
        },
        get total() { return this._total; },
        set pos(v) {
            this._pos = v;
            this.root && (this.root.innerHTML = \`载入弹幕数据（\${this._pos || "--"}\${this._error ? (this._error) : ""}/\${parseInt(this._total) || "--"}）\`);
        },
        get pos() { return this._pos; },
        set error(v) {
            this._error = v;
            this.root && (this.root.innerHTML = \`载入弹幕数据（\${this._pos || "--"}\${this._error ? (this._error) : ""}/\${parseInt(this._total) || "--"}）\`);
        },
        get error() { return this._error; },
        /** 清空计数 */
        clear() {
            if (this._error) {
                API.toast.warning("部分弹幕包丢失~", \`\${this._error}/\${parseInt(this._total)}\`);
                API.debug.error(\`弹幕分包：\${parseInt(this._total)}\`, \`成功：\${this._pos}\`, \`失败：\${this._error}\`);
            }
            else
                API.debug("加载弹幕成功~", \`分包总数：\${parseInt(this._total)}\`);
            this._pos = 0;
            this._total = 0;
            this._error = 0;
        }
    };
    class Danmaku {
        constructor() {
            /** 弹幕元数据存档 */
            this.dmView = {};
        }
        /**
         * 生成xml形式的弹幕
         * @param danmaku protoSeg.decode(new Uint8Array(this.response)).elems
         * @returns 委托对象，表示生成的xml形式的弹幕字符串
         */
        toXml(danmaku) {
            let DM = Reflect.has(danmaku[0], "idStr") ? this.danmakuFormat(danmaku) : danmaku;
            this.sortDmById(DM, "dmid");
            let xml = DM.reduce((s, d) => {
                s += \`<d p="\${d.stime},\${d.mode},\${d.size},\${d.color},\${d.date},\${d.class},\${d.uid},\${d.dmid}">\${d.text.replace(/[<">'&]/g, (a) => { return { '<': '&lt;', '"': '&quot;', '>': '&gt;', "'": '&#39;', '&': '&amp;' }[a]; }).replace(/(\\n|\\r\\n)/g, "/n")}</d>\\r\\n\`;
                return s;
            }, '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.api.bilibili.com</chatserver><chatid>' + API.cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source>\\r\\n');
            xml += "</i>";
            /**
             * remove-invalid-xml-characters.js
             * @link https://gist.github.com/john-doherty/b9195065884cdbfd2017a4756e6409cc
             * @license MIT
             * @see https://en.wikipedia.org/wiki/Valid_characters_in_XML
             */
            var regex = /((?:[\\0-\\x08\\x0B\\f\\x0E-\\x1F\\uFFFD\\uFFFE\\uFFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))/g;
            return xml.replace(regex, '');
        }
        /**
         * 将弹幕数组按弹幕id升序排序
         * @param danmaku 要排序的弹幕数组
         * @param key 弹幕id的属性名，应为dmid或idStr
         */
        sortDmById(danmaku, key) {
            let egx = /^\\d+\$/;
            for (let i = 0, d; i < danmaku.length; i++) {
                d = danmaku[i];
                // 判断输入是否纯数字
                if (!egx.test(d[key]))
                    throw "请输入数字字符串";
                // 强制转化输入为字符串
                if (typeof d[key] !== "string")
                    d[key] = String(d[key]);
                // 去除数字开头占位的0
                d[key] = d[key].replace(/^0+/, "");
            }
            danmaku.sort((a, b) => this.bigInt(a[key], b[key]) ? 1 : -1);
        }
        /**
         * 将新版弹幕数组转化为旧版弹幕数组
         * @param dm 新版弹幕数组
         * @returns 旧版弹幕数组
         */
        danmakuFormat(dm) {
            if (!dm)
                return [];
            let danmaku = dm.map(function (v) {
                let result = {
                    class: v.pool,
                    color: v.color,
                    date: v.ctime,
                    dmid: v.idStr,
                    mode: v.mode,
                    size: v.fontsize,
                    stime: v.progress / 1000,
                    text: (v.mode != 8 && v.mode != 9) ? v.content.replace(/(\\/n|\\\\n|\\n|\\r\\n)/g, '\\n') : v.content,
                    uid: v.midHash,
                    weight: v.weight
                };
                // 添加图片弹幕信息
                if (v.action && v.action.startsWith("picture:"))
                    result.html = \`<img src="//\${v.action.split(":")[1]}" style="width:auto;height:56.25px;">\`;
                // 利用bilibiliPlayer.js的这行代码，可以添加指定的css类到弹幕上
                // b.AH && (e.className = e.className + " " + b.AH);
                if (v.styleClass !== undefined)
                    result.AH = v.styleClass;
                return result;
            });
            this.sortDmById(danmaku, "dmid");
            return danmaku;
        }
        /**
         * 比较大小，仅用于弹幕排序
         * @param num1 数字字符串 1
         * @param num2 数字字符串 2
         * @returns 前者大于后者返回真，否则返回假，相等也返回假
         */
        bigInt(num1, num2) {
            // 数位不同，前者大为真，否则为假
            if (num1.length > num2.length)
                return true;
            else if (num1.length < num2.length)
                return false;
            else {
                // 数位相同，逐位比较
                for (let i = 0; i < num1.length; i++) {
                    // 任意一位前者大为真
                    if (num1[i] > num2[i])
                        return true;
                    // 任意一位前者小为假
                    if (num1[i] < num2[i])
                        return false;
                    // 仅当位相等时继续比较下一位
                }
                // 包括相等情况返回假
                return false;
            }
        }
        /** 解码protobuf弹幕 */
        segDmDecode(response) {
            return danmakuType.DmSegMobileReply.decode(new Uint8Array(response)).elems;
        }
        async getSegDanmaku(aid = API.aid, cid = API.cid) {
            try {
                if (!aid || !cid)
                    throw \`无法获取弹幕 aid：\${aid} cid：\${cid}\`;
                const dmMeta = await this.dmWebView(aid, cid);
                // dmSge.total代表的分片总数，有时错误地为100
                // 故需要按照 视频时长/分片时长(一般是360秒) 把分片总数计算出来
                const pageSize = dmMeta.dmSge.pageSize ? dmMeta.dmSge.pageSize / 1000 : 360;
                loadProgress.total = (window.player && window.player.getDuration && (window.player.getDuration() / pageSize + 1)) || dmMeta.dmSge.total;
                // 其他视频的分片总数已经不能从当前window下获取
                if (aid && (aid != API.aid))
                    loadProgress.total = dmMeta.dmSge.total;
                let result = []; // 弹幕栈
                const req = []; // 请求栈
                for (let index = 1; index <= loadProgress.total; index++) {
                    req.push(this.dmWebSeg(index, aid, cid));
                }
                (await Promise.all(req)).forEach(d => result = result.concat(d));
                result = result.concat(await this.specialDms(aid, cid, dmMeta));
                dmMeta.commandDms.length > 0 && (result = result.concat(this.upHighlightDm(dmMeta.commandDms)));
                API.config.commandDm && dmMeta.commandDms && Promise.resolve().then(() => { API.loadCommandDm(dmMeta.commandDms, aid, cid); });
                return result;
            }
            catch (e) {
                API.toast.error("加载弹幕出错~");
                API.debug.error("加载弹幕出错~", e);
            }
        }
        /**
         * 获取弹幕元数据
         * @param aid aid
         * @param cid cid
         */
        async dmWebView(aid = API.aid, cid = API.cid) {
            try {
                if (this.dmView[cid])
                    return this.dmView[cid];
                const data = await API.xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/web/view", {
                        type: 1,
                        oid: cid,
                        pid: aid
                    }),
                    credentials: true,
                    responseType: "arraybuffer"
                }, true);
                return this.dmView[cid] = danmakuType.DmWebViewReply.decode(new Uint8Array(data));
            }
            catch (e) {
                API.toast.error("加载弹幕元数据出错！");
                throw e;
            }
        }
        /**
         * 获取弹幕分包
         * @param i 索引
         * @param aid aid
         * @param cid cid
         */
        async dmWebSeg(i, aid = API.aid, cid = API.cid) {
            try {
                const data = await API.xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/web/seg.so", {
                        type: 1,
                        oid: cid,
                        pid: aid,
                        segment_index: i
                    }),
                    credentials: true,
                    responseType: "arraybuffer"
                });
                loadProgress.pos++;
                return this.segDmDecode(data);
            }
            catch (e) {
                loadProgress.error++;
                API.debug.error(\`加载弹幕分包 \${i} 出错\`);
                return [];
            }
        }
        /**
         * 获取特殊弹幕  可用于单独获取特殊弹幕
         * @param aid aid
         * @param cid cid
         * @param config 弹幕元数据
         */
        async specialDms(aid = API.aid, cid = API.cid, config) {
            let result = [];
            try {
                config = config || await this.dmWebView(aid, cid);
                if (config.specialDms.length > 0) {
                    loadProgress.total += config.specialDms.length;
                    const data = await Promise.all(config.specialDms.reduce((s, d) => {
                        s.push(this.dmSpSeg(d.replace("http:", "https:")));
                        return s;
                    }, []));
                    data.forEach(d => result = result.concat(d));
                }
            }
            catch (e) {
                API.debug.error("获取特殊弹幕出错~", e);
            }
            loadProgress.clear();
            return result;
        }
        /**
         * 获取特殊弹幕分包
         * @param url 分包链接
         */
        async dmSpSeg(url) {
            try {
                const data = await API.xhr({
                    url,
                    responseType: "arraybuffer"
                });
                loadProgress.pos++;
                return this.segDmDecode(data);
            }
            catch (e) {
                loadProgress.error++;
                API.debug("获取特殊弹幕出错~", url, e);
                return [];
            }
        }
        /** up主高亮弹幕 */
        upHighlightDm(dms) {
            try {
                return dms.reduce((s, d) => {
                    if (d.command == "#UP#") {
                        d.styleClass = "danmaku-up-icon";
                        d.color = 16777215;
                        d.pool = 0;
                        d.fontsize = 25;
                        d.ctime = new Date(d.mtime).getTime() / 1000;
                        d.mode = 1;
                        d.midHash = API.crc32 && API.crc32(d.mid);
                    }
                    return s;
                }, []);
            }
            catch (e) {
                API.debug.error("UP主高亮弹幕", e);
                return [];
            }
        }
        /**
         * 载入本地弹幕
         * @param xml 读取本地弹幕文件得到的字符串
         * @param append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
         */
        loadLocalDm(xml, append) {
            let doc = new DOMParser().parseFromString(xml, "application/xml");
            let dm = doc.querySelectorAll("d");
            if (dm.length == 0) {
                API.toast.warning("从弹幕文件中没有获取到任何弹幕！");
                return;
            }
            let danmaku = [];
            let attr, v, mode;
            for (let i = 0; i < dm.length; i++) {
                v = dm[i];
                attr = v.getAttribute('p').split(",");
                mode = parseInt(attr[1]);
                danmaku[i] = {
                    class: parseInt(attr[5]),
                    color: parseInt(attr[3]),
                    date: parseInt(attr[4]),
                    dmid: attr[7],
                    mode: mode,
                    size: parseInt(attr[2]),
                    stime: parseFloat(attr[0]),
                    text: ((mode != 8 && mode != 9) ? v.textContent.replace(/(\\/n|\\\\n|\\n|\\r\\n)/g, '\\n') : v.textContent),
                    uid: attr[6]
                };
            }
            this.sortDmById(danmaku, "dmid");
            /**
             * bilibiliPlayer.js 21394行已经添加如下代码，用于设置弹幕池
             * @param  {Array} dm 弹幕数组
             * @param  {Boolean} append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
             */
            // setDanmaku = (dm) => {......}
            if (!window.player?.setDanmaku)
                return API.toast.error("刷新弹幕列表失败：播放器内部调用丢失！");
            window.player?.setDanmaku(danmaku, append);
        }
        /**
         * 获取历史弹幕
         * @param date 历史弹幕日期，yyyy-mm-dd格式：如 2009-06-24
         * @param cid 弹幕所在视频的 cid，不填则取当前视频的cid
         * @returns 解析好的弹幕数组
         */
        async getHistoryDanmaku(date, cid = API.cid) {
            if (!date || !API.uid)
                return;
            let dm = await API.xhr({
                url: API.objUrl("https://api.bilibili.com/x/v2/dm/web/history/seg.so", {
                    type: String(1),
                    oid: String(cid),
                    date: date
                }),
                responseType: "arraybuffer",
                credentials: true
            });
            return this.segDmDecode(dm);
        }
        /**
         * 保存弹幕为文件
         * @param dm 弹幕数组
         * @param fileName 保存文件名
         */
        saveDanmaku(dm, fileName) {
            let data = API.config.danmakuSaveType === "xml" ? this.toXml(dm) : JSON.stringify(dm, undefined, '\\t');
            API.saveAs(data, \`\${fileName || API.title || API.cid}\${API.config.danmakuSaveType === "xml" ? ".xml" : ".json"}\`);
        }
    }
    /** 弹幕相关 */
    API.danmaku = new Danmaku();

//# sourceURL=file://@Bilibili-Old/include/bilibili/danmaku/danmaku.js`;
/*!***********************!*/
/**/modules["localDanmaku.js"] = /*** ./src/include/bilibili/danmaku/localDanmaku.js ***/
`
    class LocalMedia {
        constructor(files) {
            /** 被选择的文件 */
            this.data = { xml: [], json: [], mp4: [] };
            /** 弹幕当前偏移 */
            this.offset = 0;
            /** 是否已绑定键盘事件 */
            this.keyboard = false;
            this.change(files);
        }
        /**
         * 读取文件地址
         */
        change(files) {
            if (!window.player) {
                return API.toast.warning("请在播放页使用本功能 →_→");
            }
            const file = files;
            if (file.length === 0) {
                return API.toast.warning("请选择本地视频或弹幕文件！", "视频：.mp4（且符合浏览器支持的编码）", "弹幕：.xml, .json");
            }
            this.data = { xml: [], json: [], mp4: [] }; // 初始化选择表
            this.data = Array.from(file).reduce((d, i) => {
                /\\.xml\$/.test(i.name) && d.xml.push(i); // xml弹幕
                /\\.json\$/.test(i.name) && d.json.push(i); // json弹幕
                /\\.mp4\$/.test(i.name) && d.mp4.push(i); // mp4视频
                return d;
            }, this.data);
            if (!this.data.xml[0] && !this.data.json[0] && !this.data.mp4[0]) {
                return API.toast.warning("未能识别到任何有效文件信息 →_→");
            }
            this.video();
            this.danmaku();
        }
        /** 载入弹幕 */
        async danmaku() {
            if (!API.danmaku.loadLocalDm) {
                API.toast.error("载入本地弹幕失败：本地弹幕组件丢失！", "请检查【托管原生脚本】功能~");
                return API.showSetting("trusteeship");
            }
            if (!this.data.xml[0] && !this.data.json[0])
                return;
            this.data.xml.forEach(async (d, i) => {
                // 读取xml弹幕
                let data = await API.readAs(d);
                API.toast("本地弹幕：" + d.name, "载入模式：" + ((i || API.config.localMedia.concat) ? "与当前弹幕合并" : "替换当前弹幕"));
                API.danmaku.loadLocalDm(data, Boolean(i) || API.config.localMedia.concat);
            });
            this.data.json.forEach(async (d, i) => {
                // 读取json弹幕
                let data = JSON.parse(await API.readAs(d)) || [];
                API.toast("本地弹幕：" + d.name, "载入模式：" + ((this.data.xml[0] || i || API.config.localMedia.concat) ? "与当前弹幕合并" : "替换当前弹幕"));
                window.player?.setDanmaku(data, this.data.xml[0] || Boolean(i) || API.config.localMedia.concat);
            });
            this.offset = 0; // 记录或重置弹幕偏移时间
            if (!window.player?.offsetDanmaku)
                return API.toast.error("绑定键盘事件失败：弹幕偏移组件丢失！");
            else {
                API.toast("已绑定键盘事件", "可以通过键盘 , 和 . 两个键（即上标为 < 和 > 的两个键）提前或延后弹幕偏移，频度1秒/次");
                if (!this.keyboard) {
                    this.keyboard = true;
                    document.addEventListener("keydown", (ev) => {
                        switch (ev.key) {
                            case ",":
                                window.player.offsetDanmaku(-1);
                                this.offset--;
                                API.videoFloat("弹幕偏移：", \`\${this.offset} 秒\`);
                                break;
                            case ".":
                                window.player.offsetDanmaku(1);
                                this.offset++;
                                API.videoFloat("弹幕偏移：", \`\${this.offset} 秒\`);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        }
        /** 载入视频 */
        video() {
            if (this.data.mp4[0]) {
                API.toast.warning("载入本地视频中...", "请无视控制台大量报错！");
                let video = document.querySelector("#bilibiliPlayer > div.bilibili-player-area.video-state-pause > div.bilibili-player-video-wrap > div.bilibili-player-video > video");
                video.src = URL.createObjectURL(this.data.mp4[0]);
                API.toast.success("本地视频：" + this.data.mp4[0].name);
                document.querySelector(".bilibili-player-video-time-total").textContent = this.time(video.duration); // 修复总时长
            }
        }
        /**
         * 格式化时间轴
         * @param time 时间/秒
         * @returns mm:ss
         */
        time(time) {
            time = Number(time) || 0;
            let s = time % 60;
            let m = (time - s) / 60;
            s = (Array(2).join('0') + s).slice(-2);
            m = m < 10 ? (Array(2).join('0') + m).slice(-2) : m;
            return \`\${m}:\${s}\`;
        }
    }
    API.LocalMedia = LocalMedia;

//# sourceURL=file://@Bilibili-Old/include/bilibili/danmaku/localDanmaku.js`;
/*!***********************!*/
/**/modules["bgray-btn.html"] = /*** ./src/include/bilibili/player/bgray-btn.html ***/
`<style type="text/css">
    .movie_play {
        overflow: visible;
    }

    .movie_play .bgray-btn-wrap {
        top: -10px;
    }

    #bofqi {
        box-shadow: 0 0 0;
    }

    .player-wrapper {
        position: relative;
    }

    .player-fullscreen-fix {
        position: fixed;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    .player-fullscreen-fix #bofqi .player {
        position: fixed !important;
        border-radius: 0;
        z-index: 100000 !important;
        left: 0;
        top: 0;
        width: 100% !important;
        height: 100% !important;
    }

    .bgray-btn-wrap {
        position: absolute;
        top: 10px;
        left: 50%;
        margin-left: 490px;
        width: 70px;
        height: 200px;
    }

    .widescreen .bgray-btn-wrap {
        margin-left: 580px;
    }

    .bgray-btn {
        transition: all 0.3s;
        cursor: pointer;
        margin: 10px 0;
        background-color: #fff;
        text-align: center;
        padding: 7px 5px;
        display: block;
        left: 100%;
        font-size: 12px;
        line-height: 12px;
        margin-left: 10px;
        width: 20px;
        border-radius: 4px;
        border: 1px solid #e5e9ef;
        color: #99a2aa;
    }

    .bgray-btn-feedback {
        height: 72px;
        margin-bottom: 5px;
    }

    .bgray-btn-help {
        height: 24px;
        margin-top: 5px;
    }

    .bgray-btn:hover {
        color: #6d757a;
        border-color: #6d757a;
    }

    .bgray-btn.player-feedback-disable {
        color: #ccd0d7
    }

    .bgray-btn.player-feedback-disable:hover {
        color: #ccd0d7;
        border-color: #ccd0d7;
    }

    .bgray-btn.player-feedback-disable {
        color: #ccd0d7
    }

    .bgray-btn.player-feedback-disable:hover {
        color: #ccd0d7;
        border-color: #ccd0d7;
    }

    .bgray-btn.active {
        cursor: default;
        color: #00a1d6;
        border-color: #00a1d6;
    }

    .bgray-line {
        display: none;
        width: 42px;
        margin: 0 auto;
        border-bottom: 1px solid #e5e9ef;
    }

    .bgray-btn {
        display: none;
    }

    .bgray-btn.show {
        display: block;
    }

    @media screen and (min-width: 1400px) {
        .bgray-btn-wrap {
            margin-left: 580px;
        }
    }

    .bgray-btn.happyfoolsday {
        line-height: 13px;
        background-color: #00a1d6;
        border-color: #00a1d6;
        color: #fff;
    }

    .bgray-btn.happyfoolsday:hover {
        background-color: #00b5e5;
        border-color: #00b5e5;
        color: #fff;
    }
</style>`;
/*!***********************!*/
/**/modules["EmbedPlayer.js"] = /*** ./src/include/bilibili/player/EmbedPlayer.js ***/
`
    async function loadBilibiliPlayer() {
        if (!window.jQuery)
            await API.loadScript("//static.hdslb.com/js/jquery.min.js");
        return await API.loadScript("//static.hdslb.com/player/js/bilibiliPlayer.min.js");
    }
    class EmbedPlayer {
        /**
         * 代理EmbedPlayer函数
         * @param player "player"
         * @param swf "//static.hdslb.com/play.swf"
         * @param playerParams url参数式的播放器初始化参数，需要转化为对象格式才能传递给播放器实例
         * @param playerType 播放器类型：flash/HTML5
         * @param upgrade 提升播放器版本，可能只在flash格式下有用
         * @param callbackFn 初始化播放器后的回调函数
         */
        constructor(player, swf, playerParams, playerType, upgrade, callbackFn, bofqi) {
            this.flashAddEvents = [];
            this.flashRemoveEvents = [];
            this.pageno = undefined;
            this.bofqi = document.querySelector("#bofqi");
            this.eventMaps = {
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
            this.apiMaps = {
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
            this.cElement = undefined;
            this.feedback = undefined;
            /** 播放器右侧按钮 */
            this.bgray_btn = [
                {
                    tagName: "div",
                    props: { class: "bgray-btn show bgray-btn-feedback" },
                    children: [
                        {
                            tagName: "text",
                            text: "播放"
                        },
                        {
                            tagName: "br"
                        },
                        {
                            tagName: "text",
                            text: "问题"
                        },
                        {
                            tagName: "br"
                        }, {
                            tagName: "text",
                            text: "反馈"
                        }
                    ],
                    event: {
                        click: (e) => {
                            const gray = e.target;
                            this.feedback ? this.feedback.show() : window.FeedBackInstance ? (this.feedback = new window.FeedBackInstance(), this.feedback.show()) : (gray.classList.add("player-feedback-disable"), this.loadScript("//static.hdslb.com/player/feedback/feedback.min.js", () => {
                                gray.classList.remove("player-feedback-disable");
                                this.feedback = window.FeedBackInstance && new window.FeedBackInstance();
                                this.feedback && this.feedback.show();
                            }));
                        }
                    }
                },
                {
                    tagName: "div",
                    props: { class: "bgray-btn show bgray-btn-help" },
                    children: [{ tagName: "text", text: "帮助" }],
                    event: {
                        click: () => { window.open("//www.bilibili.com/blackboard/help.html#常见播放问题自救方法"); }
                    }
                }
            ];
            this.playerParam = API.urlObj(\`?\${playerParams}\`);
            this.playerParam.dashSymbol = true;
            this.playerParam.aid && Reflect.set(window, "aid", this.playerParam.aid);
            this.playerParam.cid && Reflect.set(window, "cid", this.playerParam.cid);
            this.playerType = playerType;
            this.upgrade = upgrade;
            this.callbackFn = callbackFn;
            (EmbedPlayer.asWide || API.config.automate.screenWide) && (this.playerParam.as_wide = 1);
            API.config.automate.autoPlay && (this.playerParam.autoplay = 1);
            this.gray_loader();
        }
        get gray_html5() {
            return !API.config.flash;
        }
        set gray_html5(v) {
            API.config.flash = !v;
        }
        /**
         * 加载外源脚本依赖
         * @param src 外源脚本src
         * @param onload 成功加载后的回调函数
         */
        loadScript(src, onload) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", () => {
                script.remove();
                onload && onload();
            });
            script.addEventListener("error", (e) => {
                script.remove();
                API.toast.error("加载播放器脚本失败！", e.message);
            });
            document.body.appendChild(script);
        }
        /** 初始化HTML5播放器节点 */
        loadHtml5Player() {
            if (!this.bofqi)
                return API.debug.warn("页面中并不存在播放器节点！", this.playerParam);
            if (!window.bilibiliPlayer) {
                loadBilibiliPlayer().then(() => {
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
        /**
         * 统一HTML5播放器对外接口
         */
        gray_html5_compatible() {
            this.setActionHandler();
            this.cElement = this.bofqi.querySelector("#player_placeholder");
            Object.entries(this.apiMaps).forEach(d => {
                this.cElement[d[0]] = function () {
                    if (window.player && "function" == typeof window.player[d[1]]) {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        return window.player[d[1]].apply(window.player, t);
                    }
                    return !1;
                };
            });
            Reflect.set(this.cElement, "jwAddEventListener", (type, callback) => {
                var callbackString = "", _callback;
                try {
                    "function" != typeof callback && (callbackString = new Function(callback));
                }
                catch (e) {
                    callbackString = function () { };
                }
                this.eventMaps[type] && (_callback = callbackString || callback, window.player && window.player.addEventListener && window.player.addEventListener(this.eventMaps[type], _callback));
            });
            Reflect.set(this.cElement, "jwRemoveEventListener", (e) => {
                this.eventMaps[e] && window.player && window.player.removeEventListener && window.player.removeEventListener(this.eventMaps[e]);
            });
            "function" == typeof this.callbackFn && this.cElement.jwAddEventListener("jwplayerMediaLoaded", () => this.callbackFn());
            "function" == typeof window.PlayerMediaLoaded && window.PlayerMediaLoaded();
        }
        setActionHandler() {
            navigator.mediaSession.setActionHandler('play', () => window.player.play());
            navigator.mediaSession.setActionHandler('pause', () => window.player.pause());
            navigator.mediaSession.setActionHandler('seekbackward', () => window.player.seek(window.player.getCurrentTime() - 10));
            navigator.mediaSession.setActionHandler('seekforward', () => window.player.seek(window.player.getCurrentTime() + 10));
            navigator.mediaSession.setActionHandler('previoustrack', () => window.player.prev());
            navigator.mediaSession.setActionHandler('nexttrack', () => window.player.next());
        }
        /**
         * 检查浏览器flash支持性
         * @returns 支持结果
         */
        flashChecker() {
            let e = !1, t = 0;
            if (!!/msie [\\w.]+/.exec(navigator.userAgent.toLowerCase()) && !/Edge/i.test(navigator.userAgent) || /Trident/i.test(navigator.userAgent)) {
                try {
                    var n = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    if (n) {
                        e = !0;
                        var r = n.GetVariable("\$version");
                        t = parseInt(r.split(" ")[1].split(",")[0], 10);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            else if (navigator.plugins && 0 < navigator.plugins.length) {
                var i = navigator.plugins["Shockwave Flash"];
                if (i) {
                    e = !0;
                    for (var a = i.description.split(" "), o = 0; o < a.length; ++o)
                        isNaN(parseInt(a[o], 10)) || (t = parseInt(a[o], 10));
                }
            }
            return {
                hasFlash: e,
                flashVersion: t
            };
        }
        /**
         * 初始化flash播放器节点
         */
        gray_loader_flash() {
            // flash播放器已不可用，主动更新全局变量
            this.playerParam.aid && (API.aid = this.playerParam.aid);
            this.playerParam.cid && (API.cid = this.playerParam.cid);
            this.flashChecker().hasFlash ? window.swfobject && window.swfobject.embedSWF ?
                this.loadFlashPlayer() :
                this.loadScript("//static.hdslb.com/js/swfobject.js", () => this.loadFlashPlayer()) :
                this.getNoFlashTips();
        }
        /**
         * 不支持flash提示
         */
        getNoFlashTips() {
            window.NoFlashTips ? this.createNoFlashTipsInstance() : this.loadScript("//static.hdslb.com/player/noflashtips/no-flash-tips.min.js", () => this.createNoFlashTipsInstance());
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
                        onClick: (e) => {
                            this.gray_html5 = true,
                                this.loadHtml5Player(),
                                "function" == typeof e && e();
                        }
                    }
                ],
                hasOrText: !1
            };
            API.config.downloadBtn && msg.btnList.push({
                title: "下载视频",
                width: 166,
                height: 40,
                type: "download",
                theme: "orange",
                onClick: e => {
                    API.downloadDefault();
                }
            });
            new window.NoFlashTips(this.bofqi, msg);
            this.bofqi.style.removeProperty("position");
        }
        /**
         * 加载flash播放器脚本
         */
        loadFlashPlayer() {
            this.bofqi.innerHTML = '<div id="player_placeholder" class="player"></div>';
            window.swfobject.embedSWF(this.upgrade ? "//static.hdslb.com/play_recommend.swf" : "//static.hdslb.com/play.swf", "player_placeholder", "950", "482", "0", "", this.playerParam, {
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
            this.cElement = this.bofqi.querySelector("#player_placeholder");
            window.player = {};
            Object.entries(this.apiMaps).forEach(d => {
                this.cElement[d[0]] = function () {
                    if (window.player && "function" == typeof window.player[d[1]]) {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        return window.player[d[1]].apply(window.player, t);
                    }
                    return !1;
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
            Reflect.set(this.cElement, "jwRemoveEventListener", () => {
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
                }
                catch (e) {
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
            };
            Object.entries(eventMaps).forEach(d => {
                this.cElement["jwAddEventListener"](d[1], () => { this.callFunction(d[0]); });
            });
        }
        callFunction(type) {
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
        /**
         * 播放器附加菜单
         * @param type 菜单类型
         * @returns 菜单数据
         */
        loadExtraMenuConfig(type) {
            let v = '20161115', exconfig = [];
            if (type === 'flash' || type === 'flash_gray') {
                if (this.gray_html5) {
                    exconfig.push({ label: "HTML5播放器", id: "change_h5" });
                    exconfig.push({ label: "Flash播放器", id: "change_flash", active: true });
                }
            }
            else {
                exconfig.push({ label: "HTML5播放器", id: "change_h5", active: true });
                exconfig.push({ label: "Flash播放器", id: "change_flash" });
            }
            return { 'ver': v, 'menuItems': exconfig };
        }
        /**
         * 播放器附加菜单回调函数
         * @param id 菜单类型
         */
        clickMenu(id) {
            setTimeout(() => {
                if (id === 'change_h5') {
                    this.gray_html5 = true;
                    this.gray_loader();
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
        /**
         * 添加播放器旁的按钮
         * @param title 按钮文字，2个字或4个字为宜
         * @param callback 按钮回调
         * @param className 追加按钮class属性
         */
        append_bgray_btn(title, callback, className) {
            const vdom = {
                tagName: "div",
                props: { class: \`bgray-btn show bgray-btn-\${className || "any"}\` },
                children: [],
                event: {
                    click: () => { callback(); }
                }
            };
            const arr = title.split("");
            while (arr.length) {
                let str = arr.shift() || "";
                str += arr.shift() || "";
                if (str) {
                    vdom.children?.length && vdom.children?.push({ tagName: "br" });
                    vdom.children?.push({
                        tagName: "text",
                        text: str
                    });
                }
            }
            this.bgray_btn.push(vdom);
            this.init_bgray_btn();
        }
        init_bgray_btn() {
            const prt = this.bofqi.parentElement;
            prt.appendChild(API.createElement({
                tagName: "div",
                props: { class: "bgray-btn-wrap" },
                children: this.bgray_btn
            }));
            document.head.appendChild(API.createElements(API.htmlVnode(API.getModule("bgray-btn.html"))));
        }
    }
    EmbedPlayer.asWide = false;
    class GrayManager extends EmbedPlayer {
        constructor(player, swf, playerParams, playerType, upgrade, callbackFn) {
            super(player, swf, playerParams, playerType, upgrade, callbackFn);
            /**
             * 监听url哈希修改
             */
            this.HashManage = {
                p: function (e) {
                    return (this.p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                        return typeof e;
                    }
                        : function (e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                        })(e);
                },
                prependHash: "!",
                _change: function (e, t) {
                    var n, r = location.hash, i = [], a = "", o = 0, s = {};
                    r && (r = r.substring(1),
                        this.prependHash && (r = r.replace(new RegExp("^".concat(this.prependHash.replace(/[-[\\]{}()*+?.,\\\\^\$|#\\s]/g, "\\\\\$&"))), ""))),
                        i = r.split("&");
                    for (var u = 0; u < i.length; u++) {
                        var l = i[u].split("=")[0], d = i[u].split("=")[1];
                        l && (s[l] = decodeURIComponent(d));
                    }
                    if ("object" === this.p(e)) {
                        n = Object.keys(e).length;
                        for (var f = 0; f < n; f++) {
                            var c = e[n[f]];
                            c ? s[n[f]] = encodeURIComponent(c) : !1 === c && delete s[n[f]];
                        }
                    }
                    else if (t)
                        s[e] = encodeURIComponent(t);
                    else {
                        if (!1 !== t)
                            return void 0 === e ? s : s[e] || null;
                        delete s[e];
                    }
                    n = Object.keys(s);
                    for (var h = 0; h < n.length; h++)
                        a += 0 !== o ? "&" : this.prependHash,
                            a += "".concat(n[h], "=").concat(s[n[h]]),
                            o += 1;
                    return location.hash = a,
                        s;
                },
                get: function (e) {
                    return this._change(e, null);
                },
                set: function (e, t) {
                    return this._change(e, t);
                },
                clear: function () {
                    location.hash = "";
                }
            };
            let codecId = {
                "AVC": 7,
                "HEVC": 12,
                "AV1": 13
            };
            this.codec = {
                preference: codecId[API.config.codecType],
                support: {}
            };
            let mime = {
                "AVC": 'video/mp4;codecs="avc1.640028"',
                "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
                "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"'
            };
            for (let i in mime) {
                this.codec.support[codecId[i]] = MediaSource.isTypeSupported(mime[i]);
            }
            location.href.includes("t=") && (this.playerParam.p = this.GetUrlValue("t"));
            location.href.includes("d=") && (this.playerParam.d = this.GetUrlValue("d"));
            location.href.includes("lastplaytime=") && (this.playerParam.lastplaytime = this.GetUrlValue("lastplaytime"));
        }
        /**
         * 重新加载播放器实例
         * @param playerParams 播放器实例参数，格式同初始化参数
         */
        reload(playerParams) {
            if (this.playerParam) {
                try {
                    window.swfobject && window.swfobject.removeSWF("player_placeholder"),
                        window.player && window.player.pause(),
                        window.player && window.player.destroy && window.player.destroy(),
                        (this.HashManage.get("page") || this.GetUrlValue("p")) && (window.pageno = this.HashManage.get("page") || this.GetUrlValue("p") || 1,
                            this.pageno = window.pageno);
                }
                catch (e) {
                    console.log(e);
                }
                this.playerParam = API.urlObj(\`?\${playerParams}\`) || this.playerParam;
                this.playerParam.dashSymbol = true;
                this.playerParam && (Reflect.set(window, "aid", this.playerParam.aid),
                    Reflect.set(window, "cid", this.playerParam.cid));
                this.gray_loader();
            }
            else
                window.location.reload();
        }
        /**
         * 从url中提取参数
         * @param e 参数名
         * @returns 参数值
         */
        GetUrlValue(e) {
            var t = new RegExp("(^|&)".concat(e, "=([^&]*)(&|\$)"), "i"), n = window.location.search.substr(1).match(t);
            if (null != n)
                try {
                    return decodeURIComponent(n[2]);
                }
                catch (e) {
                    return null;
                }
            return null;
        }
    }
    API.GrayManager = GrayManager;
    /**
     * 加载重写后的\`video.min.js\`，重写页面前调用。
     * @param bofqi 播放器节点查询\`querySelector\`参数
     * @param asWide 是否启用宽屏模式
     */
    function loadVideoScript(bofqi, asWide = false) {
        Object.defineProperty(window, "EmbedPlayer", {
            get: () => (player, swf, playerParams, playerType, upgrade, callbackFn) => {
                try {
                    asWide && (EmbedPlayer.asWide = true);
                    bofqi && (document.querySelector(bofqi).id = "bofqi");
                    window.GrayManager = new GrayManager(player, swf, playerParams, playerType, upgrade, callbackFn);
                    API.config.downloadBtn && window.GrayManager.append_bgray_btn("下载", () => API.downloadDefault(), "download");
                }
                catch (e) {
                    API.toast.error("EmbedPlayer 启动播放器出错~");
                    API.debug.error("EmbedPlayer 启动播放器出错~", e);
                }
            },
            set: () => true,
            configurable: true
        });
        API.playerKeyMap();
    }
    API.loadVideoScript = loadVideoScript;
    // 托管播放器脚本\`bilibiliPlayer.min.js\`
    API.config.trusteeship && API.scriptIntercept("bilibiliPlayer.min.js", undefined, () => {
        const text = GM.GM_getResourceText("bilibiliPlayer.js");
        if (!text)
            setTimeout(() => {
                API.toast.error("bilibiliPlayer.js 资源加载失败！您可以在设置中临时关闭“托管原生脚本”。");
                API.showSetting("trusteeship");
            });
        return text;
    });
    API.config.danmakuHashId && API.importModule("danmakuHashId.js"); // 反查弹幕发送者
    API.config.heartbeat && API.xhrhook(['api.bilibili.com/x/report/web/heartbeat'], function (args) {
        args[1] = args[1].replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
    }, undefined, false);
    API.config.videoLimit.switch && API.importModule("videoLimit.js"); // 解锁视频限制

//# sourceURL=file://@Bilibili-Old/include/bilibili/player/EmbedPlayer.js`;
/*!***********************!*/
/**/modules["playerKeyMap.js"] = /*** ./src/include/bilibili/player/playerKeyMap.js ***/
`
    function playerKeyMap() {
        // 注册键盘事件
        API.bindKeyMap("F", () => {
            document.querySelector(".icon-24fullscreen")?.click();
        });
        API.bindKeyMap("D", () => {
            document.querySelector(".bilibili-player-video-btn-danmaku")?.click();
        });
        API.bindKeyMap("[", () => {
            window.player.prev();
        });
        API.bindKeyMap("]", () => {
            window.player.next();
        });
        API.bindKeyMap("enter", () => {
            document.querySelector(".bilibili-player-video-danmaku-input")?.select();
        });
        API.bindKeyMap("V", () => {
            // 开启或关闭视频缩放渲染的抗锯齿
            // 详见https://github.com/MotooriKashin/Bilibili-Old/issues/292
            let video = document.querySelector("#bilibiliPlayer .bilibili-player-video video");
            if (video) {
                let filter = video.style.filter;
                if (filter.includes("contrast")) {
                    filter = filter.replace("contrast(1)", "");
                    API.config.videoDisableAA = false;
                }
                else {
                    filter += "contrast(1)";
                    API.config.videoDisableAA = true;
                }
                video.style.filter = filter;
            }
        });
    }
    API.playerKeyMap = playerKeyMap;

//# sourceURL=file://@Bilibili-Old/include/bilibili/player/playerKeyMap.js`;
/*!***********************!*/
/**/modules["videoFloat.js"] = /*** ./src/include/bilibili/player/videoFloat.js ***/
`
    /**
     * 播放器浮动信息
     * @param data 信息文本
     * @param hint 附加信息，将高亮显示
     * @param callback 点击附加信息时回调
     * @param time 显示时长
     */
    function videoFloat(data, hint, callback, time = 5) {
        const node = document.querySelector(".bilibili-player-video-toast-wrp");
        if (node && data) {
            const flt = node.appendChild(API.createElement(API.htmlVnode(\`<div class="bilibili-player-video-toast-bottom">
                    <div class="bilibili-player-video-toast-item bilibili-player-video-toast-pay">
                        <span class="video-float-hint-text">\${data}</span>
                        \${hint ? \`<span class="video-float-hint-btn\${callback ? " hint-red" : ""}">\${hint}</span>\` : ""}
                    </div>
                </div>\`)[0]));
            if (callback && hint) {
                flt.children[0].children[1].addEventListener("click", callback);
            }
            if (time && !isNaN(time)) {
                setTimeout(() => flt.remove(), time * 1000);
            }
        }
    }
    API.videoFloat = videoFloat;

//# sourceURL=file://@Bilibili-Old/include/bilibili/player/videoFloat.js`;
/*!***********************!*/
/**/modules["debug.js"] = /*** ./src/include/console/debug.js ***/
`
    /** 分组标记 */
    const group = {
        /** 分组层次 */
        i: 0,
        /** 分组栈 */
        call: []
    };
    /** console的封装，可链式调用 */
    function debug(...data) {
        group.call.push(console.log.bind(console, \`%c[\${API.timeFormat()}]\`, "color: blue;", ...arguments));
        !group.i && setTimeout(group.call.shift());
        return debug;
    }
    API.debug = debug;
    debug.assert = function (condition, ...data) {
        group.call.push(console.assert.bind(console, \`[\${API.timeFormat()}]\`, ...arguments));
        !group.i && setTimeout(group.call.shift());
        return debug;
    };
    debug.clear = function () {
        group.i = 0;
        group.call = [];
        setTimeout(console.clear.bind(console));
        return debug;
    };
    debug.debug = function (...data) {
        group.call.push(console.debug.bind(console, \`[\${API.timeFormat()}]\`, ...arguments));
        !group.i && setTimeout(group.call.shift());
        return debug;
    };
    debug.error = function (...data) {
        group.call.push(console.error.bind(console, \`[\${API.timeFormat()}]\`, ...arguments));
        !group.i && setTimeout(group.call.shift());
        return debug;
    };
    debug.group = function (...data) {
        group.i++;
        group.call.push(console.group.bind(console, \`[\${API.timeFormat()}]\`, ...arguments));
        return debug;
    };
    debug.groupCollapsed = function (...data) {
        group.i++;
        group.call.push(console.groupCollapsed.bind(console, \`[\${API.timeFormat()}]\`, ...arguments));
        return debug;
    };
    debug.groupEnd = function () {
        if (group.i) {
            group.i--;
            group.call.push(console.groupEnd.bind(console));
            !group.i && (group.call.push(() => group.call = []), group.call.forEach(d => setTimeout(d)));
        }
        return debug;
    };
    debug.info = function (...data) {
        group.call.push(console.info.bind(console, \`%c[\${API.timeFormat()}]\`, "color: blue;", ...arguments));
        !group.i && setTimeout(group.call.shift());
        return debug;
    };
    debug.log = function (...data) {
        group.call.push(console.log.bind(console, \`%c[\${API.timeFormat()}]\`, "color: blue;", ...arguments));
        !group.i && setTimeout(group.call.shift());
        return debug;
    };
    debug.table = function (tabularData, properties) {
        group.call.push(console.table.bind(console, ...arguments));
        !group.i && setTimeout(group.call.shift());
        return debug;
    };
    debug.time = function (label) {
        console.time(label);
        return debug;
    };
    debug.timeEnd = function (label) {
        console.timeEnd(label);
        return debug;
    };
    debug.timeLog = function (label, ...data) {
        console.timeLog(label, \`[\${API.timeFormat()}]\`, ...data);
        return debug;
    };
    debug.trace = function (...data) {
        group.call.push(console.trace.bind(console, ...arguments));
        !group.i && setTimeout(group.call.shift());
        return debug;
    };
    debug.warn = function (...data) {
        group.call.push(console.warn.bind(console, \`[\${API.timeFormat()}]\`, ...arguments));
        !group.i && setTimeout(group.call.shift());
        return debug;
    };

//# sourceURL=file://@Bilibili-Old/include/console/debug.js`;
/*!***********************!*/
/**/modules["toast.html"] = /*** ./src/include/console/toast/toast.html ***/
`<div id="toast-container"></div>
<style type="text/css">
    .toast-close-button>svg {
        width: 12px;
        height: 12px;
    }

    .toast {
        transition: height 1s ease 0s, padding 1s ease 0s;
    }

    #toast-container {
        font: 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif;
    }
</style>
<style type="text/css">
    /*
     * Note that this is toastr v2.1.3, the "latest" version in url has no more maintenance,
     * please go to https://cdnjs.com/libraries/toastr.js and pick a certain version you want to use,
     * make sure you copy the url from the website since the url may change between versions.
     */
    .toast-title {
        font-weight: bold;
    }

    .toast-message {
        -ms-word-wrap: break-word;
        word-wrap: break-word;
    }

    .toast-message a,
    .toast-message label {
        color: #FFFFFF;
    }

    .toast-message a:hover {
        color: #CCCCCC;
        text-decoration: none;
    }

    .toast-close-button {
        position: relative;
        right: -0.3em;
        top: -0.3em;
        float: right;
        font-size: 20px;
        font-weight: bold;
        color: #FFFFFF;
        -webkit-text-shadow: 0 1px 0 #ffffff;
        text-shadow: 0 1px 0 #ffffff;
        opacity: 0.8;
        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
        filter: alpha(opacity=80);
        line-height: 1;
    }

    .toast-close-button:hover,
    .toast-close-button:focus {
        color: #000000;
        text-decoration: none;
        cursor: pointer;
        opacity: 0.4;
        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);
        filter: alpha(opacity=40);
    }

    .rtl .toast-close-button {
        left: -0.3em;
        float: left;
        right: 0.3em;
    }

    /*Additional properties for button version
     iOS requires the button element instead of an anchor tag.
     If you want the anchor version, it requires \`href="#"\`.*/
    button.toast-close-button {
        padding: 0;
        cursor: pointer;
        background: transparent;
        border: 0;
        -webkit-appearance: none;
    }

    .toast-top-center {
        top: 0;
        right: 0;
        width: 100%;
    }

    .toast-bottom-center {
        bottom: 0;
        right: 0;
        width: 100%;
    }

    .toast-top-full-width {
        top: 0;
        right: 0;
        width: 100%;
    }

    .toast-bottom-full-width {
        bottom: 0;
        right: 0;
        width: 100%;
    }

    .toast-top-left {
        top: 12px;
        left: 12px;
    }

    .toast-top-right {
        top: 12px;
        right: 12px;
    }

    .toast-bottom-right {
        right: 12px;
        bottom: 12px;
    }

    .toast-bottom-left {
        bottom: 12px;
        left: 12px;
    }

    #toast-container {
        position: fixed;
        z-index: 999999;
        pointer-events: none;
        /*overrides*/
    }

    #toast-container * {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    #toast-container>div {
        position: relative;
        pointer-events: auto;
        overflow: hidden;
        margin: 0 0 6px;
        padding: 15px 15px 15px 50px;
        width: 300px;
        -moz-border-radius: 3px 3px 3px 3px;
        -webkit-border-radius: 3px 3px 3px 3px;
        border-radius: 3px 3px 3px 3px;
        background-position: 15px center;
        background-repeat: no-repeat;
        -moz-box-shadow: 0 0 12px #999999;
        -webkit-box-shadow: 0 0 12px #999999;
        box-shadow: 0 0 12px #999999;
        color: #FFFFFF;
        opacity: 0.8;
        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
        filter: alpha(opacity=80);
    }

    #toast-container>div.rtl {
        direction: rtl;
        padding: 15px 50px 15px 15px;
        background-position: right 15px center;
    }

    #toast-container>div:hover {
        -moz-box-shadow: 0 0 12px #000000;
        -webkit-box-shadow: 0 0 12px #000000;
        box-shadow: 0 0 12px #000000;
        opacity: 1;
        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
        filter: alpha(opacity=100);
        cursor: pointer;
    }

    #toast-container>.toast-info {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=") !important;
    }

    #toast-container>.toast-error {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=") !important;
    }

    #toast-container>.toast-success {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==") !important;
    }

    #toast-container>.toast-warning {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=") !important;
    }

    #toast-container.toast-top-center>div,
    #toast-container.toast-bottom-center>div {
        width: 300px;
        margin-left: auto;
        margin-right: auto;
    }

    #toast-container.toast-top-full-width>div,
    #toast-container.toast-bottom-full-width>div {
        width: 96%;
        margin-left: auto;
        margin-right: auto;
    }

    .toast {
        background-color: #030303;
    }

    .toast-success {
        background-color: #51A351;
    }

    .toast-error {
        background-color: #BD362F;
    }

    .toast-info {
        background-color: #2F96B4;
    }

    .toast-warning {
        background-color: #F89406;
    }

    .toast-progress {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 4px;
        background-color: #000000;
        opacity: 0.4;
        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);
        filter: alpha(opacity=40);
    }

    /*Responsive Design*/
    @media all and (max-width: 240px) {
        #toast-container>div {
            padding: 8px 8px 8px 50px;
            width: 11em;
        }

        #toast-container>div.rtl {
            padding: 8px 50px 8px 8px;
        }

        #toast-container .toast-close-button {
            right: -0.2em;
            top: -0.2em;
        }

        #toast-container .rtl .toast-close-button {
            left: -0.2em;
            right: 0.2em;
        }
    }

    @media all and (min-width: 241px) and (max-width: 480px) {
        #toast-container>div {
            padding: 8px 8px 8px 50px;
            width: 18em;
        }

        #toast-container>div.rtl {
            padding: 8px 50px 8px 8px;
        }

        #toast-container .toast-close-button {
            right: -0.2em;
            top: -0.2em;
        }

        #toast-container .rtl .toast-close-button {
            left: -0.2em;
            right: 0.2em;
        }
    }

    @media all and (min-width: 481px) and (max-width: 768px) {
        #toast-container>div {
            padding: 15px 15px 15px 50px;
            width: 25em;
        }

        #toast-container>div.rtl {
            padding: 15px 50px 15px 15px;
        }
    }
</style>`;
/*!***********************!*/
/**/modules["toast.js"] = /*** ./src/include/console/toast/toast.js ***/
`
    class ToastContainer extends HTMLElement {
        constructor() {
            super();
            /** 位置列表 */
            this.positionList = ["top-right", "top-left", "bottom-right", "bottom-left"];
            /** 类型列表 */
            this.typeList = ["success", "error", "info", "warning", ""];
            this.status = true;
            this.rtl = false;
            this.position = "top-right";
            this.delay = 4;
            const root = this.attachShadow({ mode: "closed" });
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("toast.html"))));
            this.container = root.children[0];
            // 数据绑定
            Object.defineProperties(this, {
                status: {
                    get: () => API.config.toast.status,
                    set: v => {
                        if (v === API.config.toast.status)
                            return;
                        API.config.toast.status = v;
                    }
                },
                rtl: {
                    get: () => API.config.toast.rtl,
                    set: v => {
                        if (v === API.config.toast.rtl)
                            return;
                        API.config.toast.rtl = v;
                        v
                            ? this.container.childNodes.forEach(d => { d.classList.add("rtl"); })
                            : this.container.childNodes.forEach(d => { d.classList.remove("rtl"); });
                    }
                },
                position: {
                    get: () => API.config.toast.position,
                    set: v => {
                        if (v === API.config.toast.position)
                            return;
                        if (!this.positionList.includes(v))
                            return;
                        API.config.toast.position = v;
                        this.container.className = \`toast-\${v}\`;
                    }
                },
                delay: {
                    get: () => API.config.toast.delay,
                    set: v => {
                        if (v === API.config.toast.delay)
                            return;
                        API.config.toast.delay = v;
                    }
                }
            });
            document.body.appendChild(this);
        }
        /** 追加toast */
        toast(delay, type, ...data) {
            if (!this.status)
                return;
            this.container.className = \`toast-\${this.position}\`;
            // html模板
            let html = \`<div class="toast\${type ? " toast-" + type : ""}\${this.rtl ? " rtl" : ""}" aria-live="assertive" style="padding-top: 0px;padding-bottom: 0px;height: 0px;"><div class="toast-message">\`;
            !delay && (html += \`<div class="toast-close-button">\${API.getModule("fork.svg")}</div>\`);
            data.forEach((d, i) => {
                if (API.isObject(d)) {
                    try {
                        d = JSON.stringify(d, undefined, '<br>');
                    }
                    catch (e) { }
                }
                html += i ? \`<br>\${d}\` : \`<label>\${d}</label>\`;
            });
            html += '</div></div>';
            const node = API.createElements(API.htmlVnode(html));
            const toast = node.children[0];
            this.container.insertBefore(node, this.container.firstChild);
            // 打开特效
            toast.setAttribute("style", \`height: \${toast.scrollHeight + 30}px;\`);
            let hovering = false;
            toast.addEventListener("mouseover", () => hovering = true);
            toast.addEventListener("mouseout", () => hovering = false);
            // 数据绑定 节点移除前可动态调整
            Object.defineProperties(toast, {
                /** toast类型 */
                "type": {
                    get: () => type,
                    set: v => {
                        if (v === type)
                            return;
                        if (!this.typeList.includes(v))
                            return;
                        type && toast.classList.remove(\`toast-\${type}\`);
                        v && toast.classList.add(\`toast-\${v}\`);
                        toast.classList;
                        type = v;
                    }
                },
                /** 消息队列 */
                "data": {
                    get: () => new Proxy(data, new API.ProxyHandler(ToastContainer.organizeDate.bind(ToastContainer, toast))),
                    set: v => {
                        if (v === data)
                            return;
                        data = v;
                        ToastContainer.organizeDate(toast);
                    }
                },
                /** 显示剩余时长 */
                "delay": {
                    get: () => delay,
                    set: v => {
                        if (v === delay)
                            return;
                        if (isNaN(v))
                            return;
                        if (delay === 0)
                            delay = v, ToastContainer.countDown(toast);
                        delay = v;
                        if (v === 0) {
                            hovering ? toast.addEventListener("mouseout", () => ToastContainer.remove(toast)) : ToastContainer.remove(toast);
                        }
                    }
                }
            });
            !delay
                ? toast.children[0].children[0].addEventListener("click", () => ToastContainer.remove(toast))
                : ToastContainer.countDown(toast);
            return toast;
        }
        /** 倒计时 */
        static countDown(node) {
            node.delay && setTimeout(() => {
                node.delay--;
                this.countDown(node);
            }, 1e3);
        }
        /** 移除消息 */
        static remove(node) {
            // 收起特效
            node.setAttribute("style", "padding-top: 0px;padding-bottom: 0px;height: 0px;");
            setTimeout(() => node.remove(), 1000);
        }
        /** 刷新消息 */
        static organizeDate(node) {
            let html = !node.delay ? \`<div class="toast-close-button">\${API.getModule("fork.svg")}</div>\` : "";
            node.data.forEach((d, i) => {
                if (API.isObject(d)) {
                    try {
                        d = JSON.stringify(d, undefined, '<br>');
                    }
                    catch (e) { }
                }
                html += i ? \`<br>\${d}\` : \`<label>\${d}</label>\`;
            });
            node.children[0].replaceChildren(API.createElements(API.htmlVnode(html)));
            node.setAttribute("style", \`height: \${node.firstChild.clientHeight + 30}px;\`);
            !node.delay && node.children[0].children[0].addEventListener("click", () => ToastContainer.remove(node));
        }
    }
    customElements.define("toast-container", ToastContainer);
    const node = new ToastContainer();
    function Toast(type, ...data) {
        document.body.contains(node) || document.body.appendChild(node);
        return node.toast(node.delay, type, ...data);
    }
    /**
     * toastr
     * @see toast {@link https://github.com/CodeSeven/toastr}
     * @param data 消息队列，一个参数一行，支持使用<a>等行内元素进一步格式化
     * @returns 消息节点，用于改变显示内容
     */
    function toast(...data) {
        return Toast.bind(node, "")(...data);
    }
    API.toast = toast;
    toast.success = Toast.bind(node, "success");
    toast.error = Toast.bind(node, "error");
    toast.info = Toast.bind(node, "info");
    toast.warning = Toast.bind(node, "warning");
    /**
     * 自定义toast
     * @param delay 显示时长，0 表示不主动移除并添加一个关闭按钮
     * @param type 通知类型
     * @param data 消息队列，一个表示一行，支持部分HTML行内元素
     * @returns 当前toast节点(div)本身，可用于修改/移除等操作
     */
    toast.custom = node.toast.bind(node);

//# sourceURL=file://@Bilibili-Old/include/console/toast/toast.js`;
/*!***********************!*/
/**/modules["createElement.js"] = /*** ./src/include/element/createElement.js ***/
`
    function createSVG(element) {
        const node = document.createElementNS("http://www.w3.org/2000/svg", element.tagName);
        element.props && Object.entries(element.props).forEach(d => {
            node.setAttribute(d[0], d[1]);
        });
        element.children && element.children.forEach(d => {
            node.appendChild(createSVG(d));
        });
        return node;
    }
    /**
     * 创建一个节点
     * @param element 节点数据
     * @returns 节点
     */
    function createElement(element) {
        if (element.tagName === "text") {
            return document.createTextNode(element.text);
        }
        if (element.tagName === "svg") {
            return createSVG(element);
        }
        const node = document.createElement(element.tagName);
        element.props && Object.entries(element.props).forEach(d => {
            node.setAttribute(d[0], d[1]);
        });
        element.text && node.appendChild(document.createTextNode(element.text));
        element.event && Object.entries(element.event).forEach(d => {
            node.addEventListener(...d);
        });
        element.children && element.children.forEach(d => {
            node.appendChild(createElement(d));
        });
        return node;
    }
    API.createElement = createElement;
    /**
     * 创建一组同级节点
     * @param elements 节点列表
     * @returns 节点片段
     */
    function createElements(elements) {
        const fragment = document.createDocumentFragment();
        elements.forEach(d => {
            fragment.appendChild(createElement(d));
        });
        return fragment;
    }
    API.createElements = createElements;

//# sourceURL=file://@Bilibili-Old/include/element/createElement.js`;
/*!***********************!*/
/**/modules["element.js"] = /*** ./src/include/element/element.js ***/
`
    /**
     * 节点相对文档的偏移
     * @param node 目标节点
     * @returns 偏移量
     */
    function offset(node) {
        const result = {
            top: 0,
            left: 0
        };
        const onwer = node.ownerDocument;
        if (node === onwer.body) {
            result.top = node.offsetTop;
            result.left = node.offsetLeft;
        }
        else {
            let rect = undefined;
            try {
                rect = node.getBoundingClientRect();
            }
            catch { }
            if (!rect || !onwer.documentElement.contains(node)) {
                rect && (result.top = rect.top, result.left = rect.left);
                return result;
            }
            result.top = rect.top + onwer.body.scrollTop - onwer.documentElement.clientTop;
            result.left = rect.left + onwer.body.scrollLeft - onwer.documentElement.clientLeft;
        }
        return result;
    }
    API.offset = offset;
    /**
     * 创建script元素组
     * @param elements 虚拟script组
     * @returns script元素组
     */
    function createScripts(elements) {
        return elements.reduce((s, d) => {
            s.push(API.createElement(d));
            return s;
        }, []);
    }
    /**
     * 依次创建脚本
     * @param scripts 脚本组
     */
    function loopScript(scripts) {
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
            }
            else
                r(undefined);
        });
    }
    /**
     * 添加脚本到DOM
     * @param elements script元素字符串（序列）
     */
    function appendScripts(elements) {
        return loopScript(createScripts(API.htmlVnode(elements)));
    }
    API.appendScripts = appendScripts;
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
    function clearWindow() {
        dushes.forEach(d => {
            try {
                Reflect.deleteProperty(window, d);
            }
            catch (e) {
                window[d] = undefined;
                API.debug("清扫全局环境", d);
            }
        });
    }
    API.clearWindow = clearWindow;

//# sourceURL=file://@Bilibili-Old/include/element/element.js`;
/*!***********************!*/
/**/modules["htmlVnode.js"] = /*** ./src/include/element/htmlVnode.js ***/
`
    /** Vdom节点模板 */
    class Vnode {
        constructor(tagName) {
            this.props = {};
            this.children = [];
            this.tagName = tagName;
        }
    }
    class Scanner {
        /**
         * 扫描html文本转化为Vnode
         * @param html html文本
         */
        constructor(html) {
            /** 当前光标 */
            this.pos = 0;
            /** Vnode */
            this.vnode = [];
            /** 节点名栈 */
            this.tagNames = [];
            /** Vnode栈 */
            this.targets = [];
            /** innerText栈 */
            this.text = "";
            /** 引号栈 */
            this.quote = "";
            this.html = html;
            this.targets.push({ children: this.vnode }); // 初始片段
            while (this.html) {
                this.organizeTag();
            }
            this.textContent();
        }
        /** 提取节点名 */
        organizeTag() {
            if (!this.quote && this.html[0] === "<") {
                if (this.html.startsWith(\`</\${this.tagNames.reduce((s, d) => s = d, undefined)}\`)) {
                    // 闭合标签
                    this.textContent();
                    this.html = this.html.replace(new RegExp(\`^</\${this.tagNames.reduce((s, d) => s = d, undefined)}>\`), "");
                    this.popNode();
                }
                else {
                    // 节点开始标记
                    this.removeScanned();
                    if (this.html.startsWith("!-- ")) {
                        this.html = this.html.replace(/^!--[\\S\\s]+?-->/, "");
                    }
                    if (/^[a-zA-Z]/.test(this.html)) {
                        this.textContent();
                        const func = []; // 操作栈
                        let stop = false; // 循环退出标记
                        // 合法节点名
                        for (this.pos = 0; this.pos < this.html.length; this.pos++) {
                            if (stop) {
                                this.pos--;
                                break;
                            }
                            switch (this.html[this.pos]) {
                                case " ":
                                case "\\r":
                                case "\\n": // 含属性节点
                                    func.push(() => this.organizeProp());
                                    stop = true;
                                    break;
                                case ">": // 无属性节点
                                    this.html[this.pos - 1] === "/" ? func.push(() => this.popNode()) : func.push(() => this.tagSingle());
                                    stop = true;
                                    break;
                            }
                        }
                        const tagName = this.html.substring(0, this.pos); // 提取节点名
                        const tag = new Vnode(tagName); // 添加Vnode模板
                        this.tagNames.push(tagName); // 节点名压栈
                        this.targets.reduce((s, d) => s = d, undefined).children.push(tag); // Vnode上树
                        this.targets.push(tag); // Vnode压栈
                        this.removeScanned(this.pos + 1);
                        func.forEach(d => d()); // 操作栈：属性处理/出栈
                    }
                }
            }
            else {
                // 处理TextContent有字符串形式的节点问题
                switch (this.html[0]) {
                    case "'":
                        !this.quote ? this.quote = "'" : (this.quote === "'" && (this.quote = ""));
                        break;
                    case '"':
                        !this.quote ? this.quote = '"' : (this.quote === '"' && (this.quote = ""));
                        break;
                    case '\`':
                        !this.quote ? this.quote = '\`' : (this.quote === '\`' && (this.quote = ""));
                        break;
                }
                this.text += this.html[0]; // 记录TextContent
                this.removeScanned();
            }
        }
        /** 提取属性 */
        organizeProp() {
            let value = false; // 属性内部标记
            let stop = false; // 循环退出标记
            let start = 0; // 属性起点
            let popd = false; // 是否出栈
            for (this.pos = 0; this.pos < this.html.length; this.pos++) {
                if (stop)
                    break;
                switch (this.html[this.pos]) {
                    case '"':
                        value = !value; // 进出属性内部
                        break;
                    case " ":
                        if (!value) { // 忽略属性值内部
                            const str = this.html.substring(start, this.pos).replace(/\\r|\\n|"/g, "").replace(/^ +/, "");
                            const prop = str.split("=");
                            const key = prop.shift();
                            key && key !== "/" && (this.targets.reduce((s, d) => s = d, undefined).props[key] = prop.join("=") || key);
                            start = this.pos;
                        }
                        break;
                    case ">":
                        if (!value) { // 忽略属性值内部
                            stop = true;
                            const str = this.html.substring(start, this.pos).replace(/\\r|\\n|"/g, "").replace(/^ +/, "");
                            const prop = str.split("=");
                            const key = prop.shift();
                            key && key !== "/" && (this.targets.reduce((s, d) => s = d, undefined).props[key] = prop.join("=") || key);
                            if (this.html[this.pos - 1] === "/") {
                                this.popNode();
                                popd = true;
                            }
                        }
                        break;
                }
            }
            if (!popd)
                this.tagSingle(); // 出栈检查
            this.removeScanned(this.pos--);
        }
        /** 出栈检查 空元素直接出栈*/
        tagSingle() {
            switch (this.tagNames.reduce((s, d) => s = d, undefined)) {
                case "area":
                case "base":
                case "br":
                case "col":
                case "colgroup":
                case "command":
                case "embed":
                case "hr":
                case "img":
                case "input":
                case "keygen":
                case "link":
                case "meta":
                case "param":
                case "path": // svg专属
                case "source":
                case "track":
                case "wbr":
                    this.popNode();
                    break;
            }
        }
        /** 节点出栈 */
        popNode() {
            this.tagNames.splice(this.tagNames.length - 1, 1); // 节点名出栈
            this.targets.splice(this.targets.length - 1, 1); // Vnode出栈
            this.text = ""; // 标签闭后合重置TextContent
        }
        /** 移除已扫描字符长度 默认1位 */
        removeScanned(length = 1) {
            this.html = this.html.slice(length);
        }
        /** 处理TextContent */
        textContent() {
            const text = this.text.replace(/\\r|\\n| /g, ""); //  过滤空字符
            if (text) { // 有效TextContent
                const tag = new Vnode("text");
                tag.text = this.text;
                this.targets.reduce((s, d) => s = d, undefined).children.push(tag);
            }
            this.text = ""; // 新节点伊始，重置TextContent
        }
    }
    /**
     * html => vnode
     * @param html html字符串
     * @returns vnode映射
     */
    function htmlVnode(html) {
        return new Scanner(html).vnode;
    }
    API.htmlVnode = htmlVnode;

//# sourceURL=file://@Bilibili-Old/include/element/htmlVnode.js`;
/*!***********************!*/
/**/modules["scrollbar.html"] = /*** ./src/include/element/scrollbar.html ***/
`<style type="text/css">
    ::-webkit-scrollbar {
        width: 7px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 4px;
        background-color: #EEE;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: #999;
    }
</style>`;
/*!***********************!*/
/**/modules["buttonSwitch.html"] = /*** ./src/include/element/buttonSwitch/buttonSwitch.html ***/
`<div class="switch">
    <span class="bar"></span>
    <span class="knob">
        <i class="circle"></i>
    </span>
</div>
<style type="text/css">
    .switch {
        cursor: pointer;
        display: block;
        min-width: 34px;
        outline: none;
        position: relative;
        width: 34px;
    }

    .bar {
        background-color: rgb(189, 193, 198);
        border-radius: 8px;
        height: 12px;
        left: 3px;
        position: absolute;
        top: 2px;
        transition: background-color linear 80ms;
        width: 28px;
        z-index: 0;
    }

    .bar[checked] {
        background-color: rgb(26, 115, 232);
        opacity: 0.5;
    }

    .bar:active {
        box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);
    }

    .knob {
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 40%);
        display: block;
        height: 16px;
        position: relative;
        transition: transform linear 80ms, background-color linear 80ms;
        width: 16px;
        z-index: 1;
    }

    .knob[checked] {
        background-color: rgb(26, 115, 232);
        transform: translate3d(18px, 0, 0);
    }

    .knob:active {
        box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);
    }

    .knob i {
        color: rgba(128, 134, 139, 15%);
        height: 40px;
        left: -12px;
        pointer-events: none;
        top: -12px;
        transition: color linear 80ms;
        width: 40px;
        border-radius: 50%;
        bottom: 0;
        display: block;
        overflow: hidden;
        position: absolute;
        right: 0;
        transform: translate3d(0, 0, 0);
    }

    .knob i[checked] {
        color: rgb(26, 115, 232);
    }

    .knob i:active {
        box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);
    }
</style>`;
/*!***********************!*/
/**/modules["buttonSwitch.js"] = /*** ./src/include/element/buttonSwitch/buttonSwitch.js ***/
`
    class ButtonSwitch extends HTMLElement {
        /** 滑块开关 */
        constructor(obj = {}) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            // 节点骨架
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("buttonSwitch.html"))));
            const [bar, knob, circle] = [
                root.children[0].children[0],
                root.children[0].children[1],
                root.children[0].children[1].children[0]
            ];
            const { value } = obj;
            // 数据绑定
            Object.defineProperty(obj, "value", {
                set: v => {
                    if (this.value === v)
                        return;
                    if (v) {
                        bar.setAttribute("checked", "checked");
                        knob.setAttribute("checked", "checked");
                        circle.setAttribute("checked", "checked");
                    }
                    else {
                        bar.removeAttribute("checked");
                        knob.removeAttribute("checked");
                        circle.removeAttribute("checked");
                    }
                    this.value = v;
                },
                get: () => this.value
            });
            // 事件监听
            this.addEventListener("click", () => {
                obj.value = !this.value;
            });
            // 初始化
            this.value = obj.value = value || false;
        }
    }
    API.ButtonSwitch = ButtonSwitch;
    customElements.define("button-switch", ButtonSwitch);

//# sourceURL=file://@Bilibili-Old/include/element/buttonSwitch/buttonSwitch.js`;
/*!***********************!*/
/**/modules["checkbox.html"] = /*** ./src/include/element/checkbox/checkbox.html ***/
`<input type="checkbox" id="checkbox">
<label for="checkbox"></label>
<style>
    input[type="checkbox"] {
        display: none;
    }

    input~label {
        cursor: pointer;
    }

    input:checked~label:before {
        content: '\\2714';
    }

    input~label:before {
        width: 12px;
        height: 12px;
        line-height: 14px;
        vertical-align: text-bottom;
        border-radius: 3px;
        border: 1px solid #d3d3d3;
        display: inline-block;
        text-align: center;
        content: ' ';
    }
</style>`;
/*!***********************!*/
/**/modules["checkbox.js"] = /*** ./src/include/element/checkbox/checkbox.js ***/
`
    class Checkbox extends HTMLElement {
        /** 复选框 */
        constructor(obj) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            const { label, value } = obj;
            // 节点骨架
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("checkbox.html"))));
            const [input, text] = [
                root.children[0],
                root.children[1]
            ];
            Object.defineProperties(obj, {
                value: {
                    set: v => {
                        if (this.value === v)
                            return;
                        this.value = v;
                    },
                    get: () => this.value
                },
                label: {
                    set: v => {
                        if (this.label === v)
                            return;
                        text.textContent = v;
                        this.label = v;
                    },
                    get: () => this.label
                }
            });
            text.addEventListener("click", () => {
                obj.value = !this.value;
            });
            input.checked = this.value = obj.value = value || false;
            this.label = obj.label = label;
        }
    }
    API.Checkbox = Checkbox;
    customElements.define("check-box", Checkbox);

//# sourceURL=file://@Bilibili-Old/include/element/checkbox/checkbox.js`;
/*!***********************!*/
/**/modules["floatQuote.html"] = /*** ./src/include/element/floatQuote/floatQuote.html ***/
`<div class="float">
    <div class="arrow"></div>
    <div class="message"></div>
</div>
<style type="text/css">
    .float {
        top: 0;
        right: 0;
        position: fixed;
        z-index: 11111;
        min-width: 40px;
        min-height: 30px;
        display: block;
        padding: 8px;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #e9eaec;
        border-radius: 8px;
        box-shadow: 0 6px 12px 0 rgb(106, 115, 133, 22%);
        user-select: text;
        pointer-events: none;
    }

    .arrow {
        left: 16%;
        top: 100%;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 8px solid #fff;
        position: absolute;
        user-select: text;
    }

    .message {
        margin-top: -4px;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        user-select: text;
        word-wrap: break-word;
        word-break: break-all;
        font-size: 12px;
        line-height: 1.15;
    }
</style>`;
/*!***********************!*/
/**/modules["floatQuote.js"] = /*** ./src/include/element/floatQuote/floatQuote.js ***/
`
    /** 浮动信息 */
    class FloatQuote extends HTMLElement {
        constructor(node, data) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("floatQuote.html"))));
            const real = root.children[0];
            real.children[1].innerHTML = data;
            node.onmouseover = (ev) => {
                document.body.appendChild(this);
                let rect = real.getBoundingClientRect();
                real.style.left = \`\${node.getBoundingClientRect().x + ev.offsetX}px\`;
                real.style.top = \`\${node.getBoundingClientRect().y + ev.offsetY - rect.height}px\`;
                real.style.width = \`\${Math.sqrt(rect.width * rect.height) * 4 / 3}px\`;
            };
            node.onmouseout = () => { try {
                this.remove();
            }
            catch (e) { } };
            real.onmouseout = () => { try {
                this.remove();
            }
            catch (e) { } };
        }
    }
    API.FloatQuote = FloatQuote;
    customElements.define("float-quote", FloatQuote);

//# sourceURL=file://@Bilibili-Old/include/element/floatQuote/floatQuote.js`;
/*!***********************!*/
/**/modules["horizontal.html"] = /*** ./src/include/element/horizontal/horizontal.html ***/
`<div class="hr"></div>
<style type="text/css">
    .hr {
        display: flex;
        align-items: center;
        grid-gap: 0;
        gap: 0;
        justify-content: space-between;
        flex-shrink: 0;
        height: 1px;
        background-color: rgba(136, 136, 136, 0.1);
        width: 100%;
        margin-bottom: 12px;
    }
</style>`;
/*!***********************!*/
/**/modules["horizontal.js"] = /*** ./src/include/element/horizontal/horizontal.js ***/
`
    /** 水平线 */
    class HorizontalLine extends HTMLElement {
        constructor() {
            super();
            const root = this.attachShadow({ mode: "closed" });
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("horizontal.html"))));
        }
    }
    API.HorizontalLine = HorizontalLine;
    customElements.define("horizontal-line", HorizontalLine);

//# sourceURL=file://@Bilibili-Old/include/element/horizontal/horizontal.js`;
/*!***********************!*/
/**/modules["inputArea.html"] = /*** ./src/include/element/inputArea/inputArea.html ***/
`<div class="input"><input>
    <ul class="input-list"></ul>
</div>
<style type="text/css">
    .input {
        width: 100%;
        display: inline-block;
        position: relative;
        border: 0;
        overflow: visible;
        white-space: nowrap;
        height: 24px;
        line-height: 24px;
        cursor: pointer;
        font-size: 12px;
    }

    .input input {
        height: 24px;
        line-height: 24px;
        display: inline;
        user-select: auto;
        text-decoration: none;
        outline: none;
        width: calc(100% - 10px);
        background: transparent;
        padding: 0 5px;
        border: 1px solid #ccd0d7;
        border-radius: 4px;
    }

    .input input:focus {
        border-color: #00a1d6;
    }

    .input-list {
        display: none;
        margin: 0;
        width: 100%;
        padding: 0;
        border-radius: 0 0 4px 4px;
        max-height: 120px;
        background-color: #fff;
        border: 1px solid #ccd0d7;
        box-shadow: 0 0 2px 0 #ccd0d7;
        position: absolute;
        left: -1px;
        right: auto;
        z-index: 2;
        overflow: hidden auto;
        white-space: nowrap;
    }

    .input:hover .input-list {
        display: block;
    }

    .input-list-row {
        padding: 0 5px;
        transition: background-color .3s;
        line-height: 30px;
        height: 30px;
        font-size: 12px;
        cursor: pointer;
        color: #222;
        position: relative;
    }

    .input-list-row:hover {
        background-color: #f4f5f7;
        color: #6d757a;
    }

    .cancel {
        position: absolute;
        right: 0;
        top: 0px;
        width: 38px;
        height: 28px;
        background: url(//static.hdslb.com/images/base/icons.png) -461px -530px no-repeat;
    }

    .input-list-row:hover .cancel {
        background-position: -525px -530px;
    }
</style>`;
/*!***********************!*/
/**/modules["inputArea.js"] = /*** ./src/include/element/inputArea/inputArea.js ***/
`
    class InputArea extends HTMLElement {
        /** 输入框 */
        constructor(obj = {}) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            const { value, candidate, props } = obj;
            // 节点骨架
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("inputArea.html") + API.getModule("scrollbar.html"))));
            const [input, ul] = [
                root.children[0].children[0],
                root.children[0].children[1]
            ];
            let file = false; // type="file"例外处理
            input.addEventListener("change", () => {
                obj.value = file ? input.files : input.value;
                obj.change && obj.change(file ? input.files : input.value);
            });
            // 数据绑定
            Object.defineProperties(obj, {
                value: {
                    set: v => {
                        if (file)
                            return;
                        if (this.value === v)
                            return;
                        input.value = v;
                        this.value = v;
                    },
                    get: () => file ? input.files : this.value
                },
                props: {
                    set: v => {
                        if (this.props === v)
                            return;
                        this.props = v;
                        flushProps();
                    },
                    get: () => new Proxy(this.props, new API.ProxyHandler(flushProps))
                },
                candidate: {
                    set: v => {
                        if (this.candidate === v)
                            return;
                        this.candidate = v;
                        flushList();
                    },
                    get: () => new Proxy(this.candidate, new API.ProxyHandler(flushList))
                }
            });
            const flushProps = () => Object.entries(obj.props).forEach(d => {
                input.setAttribute(d[0], d[1]);
                if (d[0] === "type") {
                    switch (d[1]) {
                        case "file":
                            if (file)
                                break;
                            file = true;
                            ul.setAttribute("style", "display: none;");
                            break;
                        default: if (file) {
                            file = false;
                            ul.removeAttribute("style");
                        }
                    }
                }
            });
            let mutex = 0;
            const flushList = () => {
                clearTimeout(mutex);
                mutex = setTimeout(() => {
                    ul.replaceChildren(API.createElements(obj.candidate.reduce((s, d, i, t) => {
                        s.push({
                            tagName: "li",
                            props: { class: "input-list-row" },
                            event: {
                                click: () => {
                                    obj.value = d;
                                }
                            },
                            children: [{
                                    tagName: "span",
                                    text: d
                                }, {
                                    tagName: "div",
                                    props: { class: "cancel" },
                                    event: {
                                        click: e => {
                                            t.splice(i, 1);
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }
                                    }
                                }]
                        });
                        return s;
                    }, [])));
                });
            };
            this.value = obj.value = value || "";
            this.props = obj.props = props || {};
            this.candidate = obj.candidate = candidate || [];
        }
    }
    API.InputArea = InputArea;
    customElements.define("input-area", InputArea);

//# sourceURL=file://@Bilibili-Old/include/element/inputArea/inputArea.js`;
/*!***********************!*/
/**/modules["alert.js"] = /*** ./src/include/element/popupbox/alert.js ***/
`
    /**
     * 弹出式通知
     * @param data 通知正文
     * @param head 通知抬头
     * @param button 带回调的按钮
     */
    function alert(data, head, button) {
        const part = API.createElements(API.htmlVnode(\`<div style="text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;">
                <span>\${head || API.Name}</span>
            </div>
            <div style="margin-bottom: 10px;"><div>\${data}</div></div>\`));
        let popup;
        if (button && button.length) {
            part.appendChild(new API.HorizontalLine());
            const node = part.appendChild(API.createElement({
                tagName: "div",
                props: { style: 'display: flex;align-items: center;justify-content: space-around;' }
            }));
            button.forEach(d => {
                node.appendChild(new API.PushButton({
                    button: d.name, value: () => {
                        d.callback();
                        popup.remove();
                    }
                }));
            });
        }
        popup = new API.PopupBox({ children: part, style: "max-width: 360px; max-height: 300px;" });
    }
    API.alert = alert;

//# sourceURL=file://@Bilibili-Old/include/element/popupbox/alert.js`;
/*!***********************!*/
/**/modules["popupbox.html"] = /*** ./src/include/element/popupbox/popupbox.html ***/
`<div class="box">
    <div class="contain"></div>
    <div class="fork"></div>
</div>
<style type="text/css">
    .box {
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        transition: 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
        padding: 12px;
        background-color: #fff;
        color: black;
        border-radius: 8px;
        box-shadow: 0 4px 12px 0 rgb(0 0 0 / 5%);
        border: 1px solid rgba(136, 136, 136, 0.13333);
        box-sizing: border-box;
        position: fixed;
        font-size: 13px;
        z-index: 11115;
        line-height: 14px;
    }

    .contain {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .fork {
        position: absolute;
        transform: scale(0.8);
        right: 10px;
        top: 10px;
        height: 20px;
        width: 20px;
        pointer-events: visible;
    }

    .fork:hover {
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 10%);
    }
</style>`;
/*!***********************!*/
/**/modules["popupbox.js"] = /*** ./src/include/element/popupbox/popupbox.js ***/
`
    /**
     * 监听节点外的点击后移除该节点
     * **需要主动调用\`observe\`启动监听**
     * @param node 目标节点
     */
    class ClickRemove {
        constructor(node) {
            node.addEventListener("click", e => e.stopPropagation());
            function remove() {
                node.remove();
                document.removeEventListener("click", remove);
            }
            this.cancel = () => document.removeEventListener("click", remove);
            this.observe = () => {
                setTimeout(() => {
                    document.addEventListener("click", remove);
                }, 100);
            };
        }
    }
    API.ClickRemove = ClickRemove;
    class PopupBox extends HTMLElement {
        /** 弹窗 */
        constructor(obj) {
            super();
            this.timer = 0;
            const { children, style, fork } = obj;
            const root = this.attachShadow({ mode: "closed" });
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("popupbox.html").replace('<div class="fork"></div>', \`<div class="fork">\${API.getModule("fork.svg")}</div>\`))));
            this.__contain = root.children[0].children[0];
            this.__fork = root.children[0].children[1];
            this._observe = new ClickRemove(this);
            Object.defineProperties(obj, {
                children: {
                    get: () => this._children,
                    set: v => {
                        if (this._children === v)
                            return;
                        this._children = v;
                        this.\$children();
                    }
                },
                style: {
                    get: () => this._style,
                    set: v => {
                        if (this._style === v)
                            return;
                        this._style = v;
                        this.\$style();
                    }
                },
                fork: {
                    get: () => this._fork,
                    set: v => {
                        if (this._fork === v)
                            return;
                        this._fork = v;
                        this.\$fork();
                    }
                }
            });
            this._children = obj.children = children || document.createDocumentFragment();
            this._style = obj.style = style || "";
            this._fork = obj.fork = fork || false;
            this.__fork.addEventListener("click", () => this.remove());
            document.body.appendChild(this);
        }
        \$children() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.__contain.replaceChildren(this._children);
            }, 250);
        }
        \$style() {
            this.__contain.setAttribute("style", this._style);
        }
        \$fork() {
            if (this._fork) {
                this._observe.cancel();
                this.__fork.style.display = "";
            }
            else {
                this._observe.observe();
                this.__fork.style.display = "none";
            }
        }
    }
    API.PopupBox = PopupBox;
    customElements.define("popup-box", PopupBox);

//# sourceURL=file://@Bilibili-Old/include/element/popupbox/popupbox.js`;
/*!***********************!*/
/**/modules["pushButton.html"] = /*** ./src/include/element/pushButton/pushButton.html ***/
`<div class="button" role="button">按钮</div>
<style>
    .button {
        width: fit-content;
        cursor: pointer;
        line-height: 28px;
        padding-left: 10px;
        padding-right: 10px;
        text-align: right;
        border: 1px solid #ccd0d7;
        border-radius: 4px;
        color: #222;
        transition: border-color .2s ease, background-color .2s ease;
        box-sizing: border-box;
        user-select: none;
    }

    .button:hover {
        color: #00a1d6;
        border-color: #00a1d6;
    }

    .button:active {
        background-color: #eee;
    }
</style>`;
/*!***********************!*/
/**/modules["pushButton.js"] = /*** ./src/include/element/pushButton/pushButton.js ***/
`
    class PushButton extends HTMLElement {
        /** 按钮 */
        constructor(obj) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            const { button, value } = obj;
            // 节点骨架
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("pushButton.html"))));
            const node = root.children[0];
            // 数据绑定
            Object.defineProperty(obj, "button", {
                set: v => {
                    if (this.button === v)
                        return;
                    node.textContent = v;
                    this.button = v;
                },
                get: () => this.button
            });
            let timer; // 过滤短时间重复操作
            node.addEventListener("click", () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    value();
                }, 100);
            });
            this.button = obj.button = button || "点击";
        }
    }
    API.PushButton = PushButton;
    customElements.define("push-button", PushButton);

//# sourceURL=file://@Bilibili-Old/include/element/pushButton/pushButton.js`;
/*!***********************!*/
/**/modules["selectMenu.html"] = /*** ./src/include/element/selectList/selectMenu.html ***/
`<div class="selectmenu">
    <div class="selectmenu-txt"><span></span></div>
    <div class="selectmenu-arrow arrow-down"></div>
    <ul class="selectmenu-list"></ul>
</div>
<style type="text/css">
    .selectmenu {
        width: 100%;
        display: inline-block;
        position: relative;
        border: 1px solid #ccd0d7;
        border-radius: 4px;
        overflow: visible;
        white-space: nowrap;
        height: 24px;
        line-height: 24px;
        cursor: pointer;
        font-size: 12px;
    }

    .selectmenu-txt {
        display: inline-block;
        overflow: hidden;
        vertical-align: top;
        text-overflow: ellipsis;
        padding: 0 5px;
        height: 24px;
        line-height: 24px;
    }

    .selectmenu-arrow {
        position: absolute;
        background-color: transparent;
        top: 0;
        right: 4px;
        z-index: 0;
        border-radius: 4px;
        width: 20px;
        height: 100%;
        cursor: pointer;
    }

    .arrow-down:before {
        margin: 0 auto;
        margin-top: 8px;
        width: 0;
        height: 0;
        display: block;
        border-width: 4px 4px 0;
        border-style: solid;
        border-color: #99a2aa transparent transparent;
        position: relative;
        content: "";
    }

    .selectmenu-list {
        display: none;
        margin: 0;
        width: 100%;
        padding: 0;
        border-radius: 0 0 4px 4px;
        max-height: 120px;
        background-color: #fff;
        border: 1px solid #ccd0d7;
        box-shadow: 0 0 2px 0 #ccd0d7;
        position: absolute;
        left: -1px;
        right: auto;
        z-index: 2;
        overflow: hidden auto;
        white-space: nowrap;
    }

    .selectmenu:hover .selectmenu-list {
        display: block;
    }

    .selectmenu-list-row {
        padding: 0 5px;
        transition: background-color .3s;
        line-height: 30px;
        height: 30px;
        font-size: 12px;
        cursor: pointer;
        color: #222;
    }

    .selectmenu-list-row:hover {
        background-color: #f4f5f7;
        color: #6d757a;
    }
</style>`;
/*!***********************!*/
/**/modules["selectMenu.js"] = /*** ./src/include/element/selectList/selectMenu.js ***/
`
    class SelectMenu extends HTMLElement {
        /** 下拉列表 */
        constructor(obj = {}) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            const { value, candidate, styles } = obj;
            // 节点骨架
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("selectMenu.html") + API.getModule("scrollbar.html"))));
            const [txt, list] = [
                root.children[0].children[0].children[0],
                root.children[0].children[2]
            ];
            // 数据绑定
            Object.defineProperties(obj, {
                value: {
                    set: v => {
                        if (this.value === v)
                            return;
                        txt.textContent = v;
                        this.value = v;
                        this.styles && this.styles[v] ? txt.setAttribute("style", this.styles[v]) : txt.removeAttribute("style");
                    },
                    get: () => this.value
                },
                candidate: {
                    set: v => {
                        if (this.candidate === v)
                            return;
                        this.candidate = v;
                        flushList();
                    },
                    get: () => new Proxy(this.candidate, new API.ProxyHandler(flushList))
                },
                styles: {
                    set: v => {
                        if (this.styles === v)
                            return;
                        this.styles = v;
                        flushList();
                    },
                    get: () => new Proxy(this.styles, new API.ProxyHandler(flushList))
                }
            });
            /** 刷新候选列表 */
            let mutex = 0;
            const flushList = () => {
                clearTimeout(mutex);
                setTimeout(() => {
                    list.replaceChildren(API.createElements(obj.candidate.reduce((s, d) => {
                        s.push({
                            tagName: "li",
                            props: { class: "selectmenu-list-row" },
                            children: [{
                                    tagName: "span",
                                    text: d,
                                    props: this.styles && this.styles[d]
                                        ? { style: this.styles[d] }
                                        : undefined
                                }],
                            event: {
                                click: () => {
                                    obj.value = d;
                                }
                            }
                        });
                        return s;
                    }, [])));
                });
            };
            // 初始化
            this.styles = obj.styles = styles || {};
            this.candidate = obj.candidate = candidate || [];
            this.value = obj.value = value || "";
        }
    }
    API.SelectMenu = SelectMenu;
    customElements.define("select-menu", SelectMenu);

//# sourceURL=file://@Bilibili-Old/include/element/selectList/selectMenu.js`;
/*!***********************!*/
/**/modules["sliderBlcok.html"] = /*** ./src/include/element/sliderBlock/sliderBlcok.html ***/
`<div class="block">
    <div class="slider">
        <div class="slider-tracker-wrp">
            <div class="slider-tracker">
                <div class="slider-handle">
                    <div class="slider-hint"></div>
                </div>
                <div class="slider-progress"></div>
            </div>
        </div>
    </div>
</div>
<style type="text/css">
    .block {
        vertical-align: top;
        display: inline-block;
        width: 100%;
    }

    .slider {
        width: 100%;
        height: 13px;
        clear: both;
        position: relative;
    }

    .slider-tracker-wrp {
        position: relative;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .slider-tracker {
        position: absolute;
        width: 100%;
        height: 6px;
        left: 0;
        border-radius: 4px;
        top: 50%;
        margin-top: -3px;
        background-color: #e5e9ef;
    }

    .slider-handle {
        position: absolute;
        top: -4px;
        height: 14px;
        width: 14px;
        border-radius: 7px;
        cursor: pointer;
        z-index: 1;
        margin-left: -7px;
        box-shadow: 0 0 3px #017cc3;
        background-color: #fff;
        transition: box-shadow .3s;
    }

    .slider-handle:hover {
        box-shadow: 0 0 5px #017cc3;
    }

    .slider-hint {
        display: none;
        position: absolute;
        top: -21px;
        white-space: nowrap;
        border-radius: 4px;
        background-color: hsla(0, 0%, 100%, .8);
        padding: 0 3px;
        border: 1px solid #fafafa;
        z-index: 1;
        transform: translateX(-25%);
        user-select: none;
    }

    .slider-progress {
        width: 0;
        height: 100%;
        border-radius: 4px;
        background-color: #00a1d6;
        position: relative;
    }
</style>`;
/*!***********************!*/
/**/modules["sliderblock.js"] = /*** ./src/include/element/sliderBlock/sliderblock.js ***/
`
    class SliderBlock extends HTMLElement {
        /** 滑动条 */
        constructor(obj = {}) {
            super();
            const root = this.attachShadow({ mode: "closed" });
            const { value, min, max, precision, hint, solid, vertical } = obj;
            // 节点骨架
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("sliderBlcok.html"))));
            const [handle, progress, hinter, wrp] = [
                root.children[0].children[0].children[0].children[0].children[0],
                root.children[0].children[0].children[0].children[0].children[1],
                root.children[0].children[0].children[0].children[0].children[0].children[0],
                root.children[0].children[0].children[0]
            ];
            /**
             * 鼠标回调
             * @param e 鼠标事件
             */
            const mouseLinster = (e) => {
                const { pageX, pageY } = e;
                // 偏移量
                const offsetX = this.vertical
                    ? pageY - API.offset(wrp).top - 7
                    : pageX - API.offset(wrp).left - 7;
                const allX = wrp.offsetWidth - 14; // 滑轨长度
                const pv = (0 > offsetX ? 0 : offsetX > allX ? allX : offsetX) / allX; // 偏移率
                obj.value = (this.max - this.min) * Math.round(pv * this.precision) / this.precision + this.min; // 精细化值
            };
            this.addEventListener("click", mouseLinster); // 点击滑块条
            /** 移除移动事件监听 */
            const mouseClear = () => {
                window.removeEventListener("mousemove", mouseLinster);
                window.removeEventListener("mouseup", mouseClear);
            };
            handle.addEventListener("mousedown", () => {
                window.addEventListener("mousemove", mouseLinster); // 鼠标移动
                window.addEventListener("mouseup", mouseClear);
            });
            // 鼠标焦点显示
            handle.addEventListener("mouseover", () => this.showChange());
            /** 刷新DOM */
            let nHint = 0; // 隐藏hint延时
            this.showChange = () => {
                const pv = (this.value - this.min) / (this.max - this.min) * 100;
                handle.style.cssText = \`left: \${((wrp.offsetWidth - 14) * (this.value - this.min) / (this.max - this.min) + 7) / wrp.offsetWidth * 100}%;\`;
                progress.style.cssText = \`width: \${pv}%;\`;
                if (this.hint) {
                    hinter.textContent = this.value;
                    if (hinter.style.display !== "block")
                        hinter.style.display = "block";
                    if (this.solid)
                        return;
                    clearTimeout(nHint);
                    nHint = setTimeout(() => hinter.style.display = "", 300);
                }
                ;
            };
            Object.defineProperties(obj, {
                value: {
                    get: () => this.value,
                    set: v => {
                        if (this.vertical)
                            v = this.max - v + this.min;
                        // 精细化输入值
                        v = (this.max - this.min) * Math.round(((v - this.min) / (this.max - this.min) * this.precision)) / this.precision + this.min;
                        if (v === this.value)
                            return;
                        this.value = v;
                        this.showChange();
                    }
                },
                min: {
                    get: () => this.min,
                    set: v => {
                        if (v === this.min || v >= this.max)
                            return;
                        this.min = v;
                        if (v > this.value)
                            obj.value = v; // 下限超过当前值
                        this.showChange();
                    }
                },
                max: {
                    get: () => this.max,
                    set: v => {
                        if (v === this.max || v <= this.min)
                            return;
                        this.max = v;
                        if (v < this.value)
                            obj.value = v; // 上限超过当前值
                        this.showChange();
                    }
                },
                precision: {
                    get: () => this.precision,
                    set: v => {
                        if (v === this.precision)
                            return;
                        this.precision = v;
                        obj.value = obj.value; // 精细度变动，修正当前值
                    }
                },
                hint: {
                    get: () => this.hint,
                    set: v => {
                        if (v === this.hint)
                            return;
                        this.hint = v;
                    }
                },
                solid: {
                    get: () => this.solid,
                    set: v => {
                        if (v === this.solid)
                            return;
                        this.solid = v;
                        this.showChange();
                    }
                },
                vertical: {
                    get: () => this.vertical,
                    set: v => {
                        if (v === this.vertical)
                            return;
                        this.vertical = v;
                        this.style.transform = v ? 'rotate(-90deg)' : '';
                    }
                }
            });
            // 初始化
            this.value = obj.value = value || 0;
            this.min = obj.min = min || 0;
            this.max = obj.max = max || 100;
            this.precision = obj.precision = precision || 100;
            this.hint = obj.hint = hint || true;
            this.solid = obj.solid = solid || false;
            this.vertical = obj.solid = vertical || false;
        }
        /** 内置接口。当 custom element首次被插入文档DOM时，被调用。 */
        connectedCallback() {
            // 涉及元素像素的数据只在DOM中才获取得到
            setTimeout(() => this.showChange());
        }
    }
    API.SliderBlock = SliderBlock;
    customElements.define("slider-block", SliderBlock);

//# sourceURL=file://@Bilibili-Old/include/element/sliderBlock/sliderblock.js`;
/*!***********************!*/
/**/modules["cht2chs.js"] = /*** ./src/include/format/cht2chs.js ***/
`
// 繁简转换
// @see chinese-conversion-api {@link https://greasyfork.org/scripts/430412}
// @license MIT
    /** 繁简对照表，可能需要及时更新 */
    const aTC2SC = {
        "以功覆過": "以功复过",
        "侔德覆載": "侔德复载",
        "傷亡枕藉": "伤亡枕借",
        "出醜狼藉": "出丑狼借",
        "反反覆覆": "反反复复",
        "名覆金甌": "名复金瓯",
        "情有獨鍾": "情有独锺",
        "文錦覆阱": "文锦复阱",
        "於呼哀哉": "於呼哀哉",
        "旋乾轉坤": "旋乾转坤",
        "朝乾夕惕": "朝乾夕惕",
        "狐藉虎威": "狐借虎威",
        "瞭若指掌": "了若指掌",
        "老態龍鍾": "老态龙锺",
        "藉箸代籌": "借箸代筹",
        "藉草枕塊": "借草枕块",
        "藉藉无名": "藉藉无名",
        "衹見樹木": "只见树木",
        "覆蕉尋鹿": "复蕉寻鹿",
        "覆鹿尋蕉": "复鹿寻蕉",
        "覆鹿遺蕉": "复鹿遗蕉",
        "買臣覆水": "买臣复水",
        "踅門瞭戶": "踅门了户",
        "雁杳魚沈": "雁杳鱼沉",
        "顛乾倒坤": "颠乾倒坤",
        "乾清宮": "乾清宫",
        "乾盛世": "乾盛世",
        "八濛山": "八濛山",
        "千鍾粟": "千锺粟",
        "尼乾陀": "尼乾陀",
        "張法乾": "张法乾",
        "於世成": "於世成",
        "於仲完": "於仲完",
        "於其一": "於其一",
        "於勇明": "於勇明",
        "於崇文": "於崇文",
        "於忠祥": "於忠祥",
        "於惟一": "於惟一",
        "於梨華": "於梨华",
        "於清言": "於清言",
        "於竹屋": "於竹屋",
        "於陵子": "於陵子",
        "李乾德": "李乾德",
        "李澤鉅": "李泽钜",
        "李鍊福": "李链福",
        "李鍾郁": "李锺郁",
        "樊於期": "樊於期",
        "藉寇兵": "借寇兵",
        "覆醬瓿": "复酱瓿",
        "角徵羽": "角徵羽",
        "貂覆額": "貂复额",
        "郭子乾": "郭子乾",
        "錢鍾書": "钱锺书",
        "鍾萬梅": "锺万梅",
        "鍾重發": "锺重发",
        "麼些族": "麽些族",
        "黄鍾公": "黄锺公",
        "上鍊": "上链",
        "么麼": "幺麽",
        "么麽": "幺麽",
        "乾元": "乾元",
        "乾卦": "乾卦",
        "乾嘉": "乾嘉",
        "乾圖": "乾图",
        "乾坤": "乾坤",
        "乾宅": "乾宅",
        "乾斷": "乾断",
        "乾旦": "乾旦",
        "乾曜": "乾曜",
        "乾紅": "乾红",
        "乾綱": "乾纲",
        "乾縣": "乾县",
        "乾象": "乾象",
        "乾造": "乾造",
        "乾道": "乾道",
        "乾陵": "乾陵",
        "乾隆": "乾隆",
        "家俱": "家具",
        "傢具": "家具",
        "傢俱": "家具",
        "凌藉": "凌借",
        "函覆": "函复",
        "反覆": "反复",
        "哪吒": "哪吒",
        "哪咤": "哪吒",
        "回覆": "回复",
        "射覆": "射复",
        "幺麼": "幺麽",
        "康乾": "康乾",
        "彷彿": "仿佛",
        "徵弦": "徵弦",
        "徵絃": "徵弦",
        "徵聲": "徵声",
        "徵調": "徵调",
        "徵音": "徵音",
        "憑藉": "凭借",
        "手鍊": "手链",
        "拉鍊": "拉链",
        "拜覆": "拜复",
        "於乎": "於乎",
        "於倫": "於伦",
        "於則": "於则",
        "於單": "於单",
        "於坦": "於坦",
        "於戲": "於戏",
        "於敖": "於敖",
        "於琳": "於琳",
        "於穆": "於穆",
        "於菟": "於菟",
        "於邑": "於邑",
        "明瞭": "明了",
        "明覆": "明复",
        "木吒": "木吒",
        "木咤": "木吒",
        "沈沒": "沉没",
        "沈積": "沉积",
        "沈船": "沉船",
        "沈默": "沉默",
        "流徵": "流徵",
        "滑藉": "滑借",
        "牴牾": "抵牾",
        "牴觸": "抵触",
        "甚鉅": "甚钜",
        "申覆": "申复",
        "畢昇": "毕昇",
        "發覆": "发复",
        "瞭如": "了如",
        "瞭然": "了然",
        "瞭解": "了解",
        "示覆": "示复",
        "禀覆": "禀复",
        "答覆": "答复",
        "篤麼": "笃麽",
        "籌畫": "筹划",
        "素藉": "素借",
        "茵藉": "茵借",
        "萬鍾": "万锺",
        "蒜薹": "蒜薹",
        "蕓薹": "芸薹",
        "蕩覆": "荡复",
        "蕭乾": "萧乾",
        "藉代": "借代",
        "藉以": "借以",
        "藉助": "借助",
        "藉卉": "借卉",
        "藉口": "借口",
        "藉喻": "借喻",
        "藉手": "借手",
        "藉據": "借据",
        "藉故": "借故",
        "藉方": "借方",
        "藉條": "借条",
        "藉槁": "借槁",
        "藉機": "借机",
        "藉此": "借此",
        "藉甚": "借甚",
        "藉由": "借由",
        "藉著": "借着",
        "藉端": "借端",
        "藉藉": "借借",
        "藉詞": "借词",
        "藉讀": "借读",
        "藉資": "借资",
        "衹得": "只得",
        "覆上": "复上",
        "覆住": "复住",
        "覆信": "复信",
        "覆冒": "复冒",
        "覆呈": "复呈",
        "覆命": "复命",
        "覆墓": "复墓",
        "覆宗": "复宗",
        "覆帳": "复帐",
        "覆幬": "复帱",
        "覆成": "复成",
        "覆按": "复按",
        "覆文": "复文",
        "覆杯": "复杯",
        "覆校": "复校",
        "覆瓿": "复瓿",
        "覆盂": "复盂",
        "覆育": "复育",
        "覆逆": "复逆",
        "覆醢": "复醢",
        "覆電": "复电",
        "覆露": "复露",
        "覆鼎": "复鼎",
        "見覆": "见复",
        "角徵": "角徵",
        "計畫": "计划",
        "變徵": "变徵",
        "躪藉": "躏借",
        "酝藉": "酝借",
        "重覆": "重复",
        "金吒": "金吒",
        "金咤": "金吒",
        "金鍊": "金链",
        "鈕釦": "纽扣",
        "鈞覆": "钧复",
        "鉅子": "钜子",
        "鉅萬": "钜万",
        "鉅防": "钜防",
        "鉸鍊": "铰链",
        "銀鍊": "银链",
        "鍊墜": "链坠",
        "鍊子": "链子",
        "鍊形": "链形",
        "鍊條": "链条",
        "鍊錘": "链锤",
        "鍊鎖": "链锁",
        "鍛鍾": "锻锺",
        "鍾鍛": "锺锻",
        "鍾馗": "锺馗",
        "鎖鍊": "锁链",
        "鐵鍊": "铁链",
        "電覆": "电复",
        "露覆": "露复",
        "項鍊": "项链",
        "頗覆": "颇复",
        "頸鍊": "颈链",
        "顧藉": "顾借",
        "煞車": "刹车",
        "著": "着",
        "乾": "干",
        "儘": "尽",
        "劃": "划",
        "徵": "征",
        "於": "于",
        "瀋": "沈",
        "瀰": "弥",
        "畫": "画",
        "睪": "睾",
        "綵": "彩",
        "線": "线",
        "薹": "苔",
        "蘋": "苹",
        "襬": "摆",
        "託": "托",
        "諮": "咨",
        "鈕": "钮",
        "鉅": "巨",
        "鍾": "钟",
        "钁": "镢",
        "靦": "腼",
        "餘": "余",
        "麪": "面",
        "麴": "曲",
        "麵": "面",
        "麼": "么",
        "麽": "么",
        "開": "开",
        "噹": "当",
        "崙": "仑",
        "擣": "捣",
        "牴": "抵",
        "衹": "只",
        "諫": "谏",
        "譾": "谫",
        "買": "买",
        "閒": "闲",
        "願": "愿",
        "餬": "糊",
        "餱": "糇",
        "餵": "喂",
        "驄": "骢",
        "鵰": "雕",
        "齧": "啮",
        "鍊": "炼",
        "㑯": "㑔",
        "㑳": "㑇",
        "㑶": "㐹",
        "㓨": "刾",
        "㘚": "㘎",
        "㜄": "㚯",
        "㜏": "㛣",
        "㠏": "㟆",
        "㥮": "㤘",
        "㩜": "㨫",
        "㩳": "㧐",
        "䁻": "䀥",
        "䊷": "䌶",
        "䋙": "䌺",
        "䋚": "䌻",
        "䋹": "䌿",
        "䋻": "䌾",
        "䎱": "䎬",
        "䙡": "䙌",
        "䜀": "䜧",
        "䝼": "䞍",
        "䥇": "䦂",
        "䥱": "䥾",
        "䦛": "䦶",
        "䦟": "䦷",
        "䯀": "䯅",
        "䰾": "鲃",
        "䱷": "䲣",
        "䱽": "䲝",
        "䲁": "鳚",
        "䲘": "鳤",
        "䴉": "鹮",
        "丟": "丢",
        "並": "并",
        "亂": "乱",
        "亙": "亘",
        "亞": "亚",
        "佇": "伫",
        "佈": "布",
        "佔": "占",
        "併": "并",
        "來": "来",
        "侖": "仑",
        "侶": "侣",
        "侷": "局",
        "俁": "俣",
        "係": "系",
        "俔": "伣",
        "俠": "侠",
        "俥": "伡",
        "俬": "私",
        "倀": "伥",
        "倆": "俩",
        "倈": "俫",
        "倉": "仓",
        "個": "个",
        "們": "们",
        "倖": "幸",
        "倫": "伦",
        "倲": "㑈",
        "偉": "伟",
        "偑": "㐽",
        "側": "侧",
        "偵": "侦",
        "偽": "伪",
        "傌": "㐷",
        "傑": "杰",
        "傖": "伧",
        "傘": "伞",
        "備": "备",
        "傢": "家",
        "傭": "佣",
        "傯": "偬",
        "傳": "传",
        "傴": "伛",
        "債": "债",
        "傷": "伤",
        "傾": "倾",
        "僂": "偻",
        "僅": "仅",
        "僉": "佥",
        "僑": "侨",
        "僕": "仆",
        "僞": "伪",
        "僥": "侥",
        "僨": "偾",
        "僱": "雇",
        "價": "价",
        "儀": "仪",
        "儁": "俊",
        "儂": "侬",
        "億": "亿",
        "儈": "侩",
        "儉": "俭",
        "儐": "傧",
        "儔": "俦",
        "儕": "侪",
        "償": "偿",
        "優": "优",
        "儲": "储",
        "儷": "俪",
        "儸": "㑩",
        "儺": "傩",
        "儻": "傥",
        "儼": "俨",
        "兇": "凶",
        "兌": "兑",
        "兒": "儿",
        "兗": "兖",
        "內": "内",
        "兩": "两",
        "冊": "册",
        "冑": "胄",
        "冪": "幂",
        "凈": "净",
        "凍": "冻",
        "凜": "凛",
        "凱": "凯",
        "別": "别",
        "刪": "删",
        "剄": "刭",
        "則": "则",
        "剋": "克",
        "剎": "刹",
        "剗": "刬",
        "剛": "刚",
        "剝": "剥",
        "剮": "剐",
        "剴": "剀",
        "創": "创",
        "剷": "铲",
        "劇": "剧",
        "劉": "刘",
        "劊": "刽",
        "劌": "刿",
        "劍": "剑",
        "劏": "㓥",
        "劑": "剂",
        "劚": "㔉",
        "勁": "劲",
        "動": "动",
        "務": "务",
        "勛": "勋",
        "勝": "胜",
        "勞": "劳",
        "勢": "势",
        "勩": "勚",
        "勱": "劢",
        "勳": "勋",
        "勵": "励",
        "勸": "劝",
        "勻": "匀",
        "匭": "匦",
        "匯": "汇",
        "匱": "匮",
        "區": "区",
        "協": "协",
        "卹": "恤",
        "卻": "却",
        "卽": "即",
        "厙": "厍",
        "厠": "厕",
        "厤": "历",
        "厭": "厌",
        "厲": "厉",
        "厴": "厣",
        "參": "参",
        "叄": "叁",
        "叢": "丛",
        "吒": "咤",
        "吳": "吴",
        "吶": "呐",
        "呂": "吕",
        "咼": "呙",
        "員": "员",
        "唄": "呗",
        "唚": "吣",
        "唸": "念",
        "問": "问",
        "啓": "启",
        "啞": "哑",
        "啟": "启",
        "啢": "唡",
        "喎": "㖞",
        "喚": "唤",
        "喪": "丧",
        "喫": "吃",
        "喬": "乔",
        "單": "单",
        "喲": "哟",
        "嗆": "呛",
        "嗇": "啬",
        "嗊": "唝",
        "嗎": "吗",
        "嗚": "呜",
        "嗩": "唢",
        "嗶": "哔",
        "嘆": "叹",
        "嘍": "喽",
        "嘓": "啯",
        "嘔": "呕",
        "嘖": "啧",
        "嘗": "尝",
        "嘜": "唛",
        "嘩": "哗",
        "嘮": "唠",
        "嘯": "啸",
        "嘰": "叽",
        "嘵": "哓",
        "嘸": "呒",
        "嘽": "啴",
        "噁": "恶",
        "噓": "嘘",
        "噚": "㖊",
        "噝": "咝",
        "噠": "哒",
        "噥": "哝",
        "噦": "哕",
        "噯": "嗳",
        "噲": "哙",
        "噴": "喷",
        "噸": "吨",
        "嚀": "咛",
        "嚇": "吓",
        "嚌": "哜",
        "嚐": "尝",
        "嚕": "噜",
        "嚙": "啮",
        "嚥": "咽",
        "嚦": "呖",
        "嚨": "咙",
        "嚮": "向",
        "嚲": "亸",
        "嚳": "喾",
        "嚴": "严",
        "嚶": "嘤",
        "囀": "啭",
        "囁": "嗫",
        "囂": "嚣",
        "囅": "冁",
        "囈": "呓",
        "囉": "啰",
        "囌": "苏",
        "囑": "嘱",
        "囪": "囱",
        "圇": "囵",
        "國": "国",
        "圍": "围",
        "園": "园",
        "圓": "圆",
        "圖": "图",
        "團": "团",
        "垵": "埯",
        "埡": "垭",
        "埰": "采",
        "執": "执",
        "堅": "坚",
        "堊": "垩",
        "堖": "垴",
        "堝": "埚",
        "堯": "尧",
        "報": "报",
        "場": "场",
        "塊": "块",
        "塋": "茔",
        "塏": "垲",
        "塒": "埘",
        "塗": "涂",
        "塚": "冢",
        "塢": "坞",
        "塤": "埙",
        "塵": "尘",
        "塹": "堑",
        "墊": "垫",
        "墜": "坠",
        "墮": "堕",
        "墰": "坛",
        "墳": "坟",
        "墶": "垯",
        "墻": "墙",
        "墾": "垦",
        "壇": "坛",
        "壋": "垱",
        "壎": "埙",
        "壓": "压",
        "壘": "垒",
        "壙": "圹",
        "壚": "垆",
        "壜": "坛",
        "壞": "坏",
        "壟": "垄",
        "壠": "垅",
        "壢": "坜",
        "壩": "坝",
        "壯": "壮",
        "壺": "壶",
        "壼": "壸",
        "壽": "寿",
        "夠": "够",
        "夢": "梦",
        "夥": "伙",
        "夾": "夹",
        "奐": "奂",
        "奧": "奥",
        "奩": "奁",
        "奪": "夺",
        "奬": "奖",
        "奮": "奋",
        "奼": "姹",
        "妝": "妆",
        "姍": "姗",
        "姦": "奸",
        "娛": "娱",
        "婁": "娄",
        "婦": "妇",
        "婭": "娅",
        "媧": "娲",
        "媯": "妫",
        "媰": "㛀",
        "媼": "媪",
        "媽": "妈",
        "嫋": "袅",
        "嫗": "妪",
        "嫵": "妩",
        "嫺": "娴",
        "嫻": "娴",
        "嫿": "婳",
        "嬀": "妫",
        "嬃": "媭",
        "嬈": "娆",
        "嬋": "婵",
        "嬌": "娇",
        "嬙": "嫱",
        "嬡": "嫒",
        "嬤": "嬷",
        "嬪": "嫔",
        "嬰": "婴",
        "嬸": "婶",
        "孃": "娘",
        "孋": "㛤",
        "孌": "娈",
        "孫": "孙",
        "學": "学",
        "孿": "孪",
        "宮": "宫",
        "寀": "采",
        "寢": "寝",
        "實": "实",
        "寧": "宁",
        "審": "审",
        "寫": "写",
        "寬": "宽",
        "寵": "宠",
        "寶": "宝",
        "將": "将",
        "專": "专",
        "尋": "寻",
        "對": "对",
        "導": "导",
        "尷": "尴",
        "屆": "届",
        "屍": "尸",
        "屓": "屃",
        "屜": "屉",
        "屢": "屡",
        "層": "层",
        "屨": "屦",
        "屬": "属",
        "岡": "冈",
        "峯": "峰",
        "峴": "岘",
        "島": "岛",
        "峽": "峡",
        "崍": "崃",
        "崑": "昆",
        "崗": "岗",
        "崢": "峥",
        "崬": "岽",
        "嵐": "岚",
        "嵗": "岁",
        "嶁": "嵝",
        "嶄": "崭",
        "嶇": "岖",
        "嶔": "嵚",
        "嶗": "崂",
        "嶠": "峤",
        "嶢": "峣",
        "嶧": "峄",
        "嶨": "峃",
        "嶮": "崄",
        "嶴": "岙",
        "嶸": "嵘",
        "嶺": "岭",
        "嶼": "屿",
        "嶽": "岳",
        "巋": "岿",
        "巒": "峦",
        "巔": "巅",
        "巖": "岩",
        "巰": "巯",
        "巹": "卺",
        "帥": "帅",
        "師": "师",
        "帳": "帐",
        "帶": "带",
        "幀": "帧",
        "幃": "帏",
        "幗": "帼",
        "幘": "帻",
        "幟": "帜",
        "幣": "币",
        "幫": "帮",
        "幬": "帱",
        "幹": "干",
        "幾": "几",
        "庫": "库",
        "廁": "厕",
        "廂": "厢",
        "廄": "厩",
        "廈": "厦",
        "廎": "庼",
        "廕": "荫",
        "廚": "厨",
        "廝": "厮",
        "廟": "庙",
        "廠": "厂",
        "廡": "庑",
        "廢": "废",
        "廣": "广",
        "廩": "廪",
        "廬": "庐",
        "廳": "厅",
        "弒": "弑",
        "弔": "吊",
        "弳": "弪",
        "張": "张",
        "強": "强",
        "彆": "别",
        "彈": "弹",
        "彌": "弥",
        "彎": "弯",
        "彔": "录",
        "彙": "汇",
        "彞": "彝",
        "彠": "彟",
        "彥": "彦",
        "彫": "雕",
        "彲": "彨",
        "彿": "佛",
        "後": "后",
        "徑": "径",
        "從": "从",
        "徠": "徕",
        "復": "复",
        "徹": "彻",
        "恆": "恒",
        "恥": "耻",
        "悅": "悦",
        "悞": "悮",
        "悵": "怅",
        "悶": "闷",
        "悽": "凄",
        "惡": "恶",
        "惱": "恼",
        "惲": "恽",
        "惻": "恻",
        "愛": "爱",
        "愜": "惬",
        "愨": "悫",
        "愴": "怆",
        "愷": "恺",
        "愾": "忾",
        "慄": "栗",
        "態": "态",
        "慍": "愠",
        "慘": "惨",
        "慚": "惭",
        "慟": "恸",
        "慣": "惯",
        "慤": "悫",
        "慪": "怄",
        "慫": "怂",
        "慮": "虑",
        "慳": "悭",
        "慶": "庆",
        "慼": "戚",
        "慾": "欲",
        "憂": "忧",
        "憊": "惫",
        "憐": "怜",
        "憑": "凭",
        "憒": "愦",
        "憚": "惮",
        "憤": "愤",
        "憫": "悯",
        "憮": "怃",
        "憲": "宪",
        "憶": "忆",
        "懇": "恳",
        "應": "应",
        "懌": "怿",
        "懍": "懔",
        "懞": "蒙",
        "懟": "怼",
        "懣": "懑",
        "懨": "恹",
        "懲": "惩",
        "懶": "懒",
        "懷": "怀",
        "懸": "悬",
        "懺": "忏",
        "懼": "惧",
        "懾": "慑",
        "戀": "恋",
        "戇": "戆",
        "戔": "戋",
        "戧": "戗",
        "戩": "戬",
        "戰": "战",
        "戱": "戯",
        "戲": "戏",
        "戶": "户",
        "拋": "抛",
        "挩": "捝",
        "挱": "挲",
        "挾": "挟",
        "捨": "舍",
        "捫": "扪",
        "捱": "挨",
        "捲": "卷",
        "掃": "扫",
        "掄": "抡",
        "掆": "㧏",
        "掗": "挜",
        "掙": "挣",
        "掛": "挂",
        "採": "采",
        "揀": "拣",
        "揚": "扬",
        "換": "换",
        "揮": "挥",
        "損": "损",
        "搖": "摇",
        "搗": "捣",
        "搵": "揾",
        "搶": "抢",
        "摑": "掴",
        "摜": "掼",
        "摟": "搂",
        "摯": "挚",
        "摳": "抠",
        "摶": "抟",
        "摺": "折",
        "摻": "掺",
        "撈": "捞",
        "撏": "挦",
        "撐": "撑",
        "撓": "挠",
        "撝": "㧑",
        "撟": "挢",
        "撣": "掸",
        "撥": "拨",
        "撫": "抚",
        "撲": "扑",
        "撳": "揿",
        "撻": "挞",
        "撾": "挝",
        "撿": "捡",
        "擁": "拥",
        "擄": "掳",
        "擇": "择",
        "擊": "击",
        "擋": "挡",
        "擓": "㧟",
        "擔": "担",
        "據": "据",
        "擠": "挤",
        "擡": "抬",
        "擬": "拟",
        "擯": "摈",
        "擰": "拧",
        "擱": "搁",
        "擲": "掷",
        "擴": "扩",
        "擷": "撷",
        "擺": "摆",
        "擻": "擞",
        "擼": "撸",
        "擽": "㧰",
        "擾": "扰",
        "攄": "摅",
        "攆": "撵",
        "攏": "拢",
        "攔": "拦",
        "攖": "撄",
        "攙": "搀",
        "攛": "撺",
        "攜": "携",
        "攝": "摄",
        "攢": "攒",
        "攣": "挛",
        "攤": "摊",
        "攪": "搅",
        "攬": "揽",
        "敎": "教",
        "敓": "敚",
        "敗": "败",
        "敘": "叙",
        "敵": "敌",
        "數": "数",
        "斂": "敛",
        "斃": "毙",
        "斆": "敩",
        "斕": "斓",
        "斬": "斩",
        "斷": "断",
        "旂": "旗",
        "旣": "既",
        "昇": "升",
        "時": "时",
        "晉": "晋",
        "晝": "昼",
        "暈": "晕",
        "暉": "晖",
        "暘": "旸",
        "暢": "畅",
        "暫": "暂",
        "曄": "晔",
        "曆": "历",
        "曇": "昙",
        "曉": "晓",
        "曏": "向",
        "曖": "暧",
        "曠": "旷",
        "曨": "昽",
        "曬": "晒",
        "書": "书",
        "會": "会",
        "朧": "胧",
        "朮": "术",
        "東": "东",
        "杴": "锨",
        "枴": "拐",
        "柵": "栅",
        "柺": "拐",
        "査": "查",
        "桿": "杆",
        "梔": "栀",
        "梘": "枧",
        "條": "条",
        "梟": "枭",
        "梲": "棁",
        "棄": "弃",
        "棊": "棋",
        "棖": "枨",
        "棗": "枣",
        "棟": "栋",
        "棡": "㭎",
        "棧": "栈",
        "棲": "栖",
        "棶": "梾",
        "椏": "桠",
        "椲": "㭏",
        "楊": "杨",
        "楓": "枫",
        "楨": "桢",
        "業": "业",
        "極": "极",
        "榘": "矩",
        "榦": "干",
        "榪": "杩",
        "榮": "荣",
        "榲": "榅",
        "榿": "桤",
        "構": "构",
        "槍": "枪",
        "槓": "杠",
        "槤": "梿",
        "槧": "椠",
        "槨": "椁",
        "槮": "椮",
        "槳": "桨",
        "槶": "椢",
        "槼": "椝",
        "樁": "桩",
        "樂": "乐",
        "樅": "枞",
        "樑": "梁",
        "樓": "楼",
        "標": "标",
        "樞": "枢",
        "樢": "㭤",
        "樣": "样",
        "樫": "㭴",
        "樳": "桪",
        "樸": "朴",
        "樹": "树",
        "樺": "桦",
        "樿": "椫",
        "橈": "桡",
        "橋": "桥",
        "機": "机",
        "橢": "椭",
        "橫": "横",
        "檁": "檩",
        "檉": "柽",
        "檔": "档",
        "檜": "桧",
        "檟": "槚",
        "檢": "检",
        "檣": "樯",
        "檮": "梼",
        "檯": "台",
        "檳": "槟",
        "檸": "柠",
        "檻": "槛",
        "櫃": "柜",
        "櫓": "橹",
        "櫚": "榈",
        "櫛": "栉",
        "櫝": "椟",
        "櫞": "橼",
        "櫟": "栎",
        "櫥": "橱",
        "櫧": "槠",
        "櫨": "栌",
        "櫪": "枥",
        "櫫": "橥",
        "櫬": "榇",
        "櫱": "蘖",
        "櫳": "栊",
        "櫸": "榉",
        "櫺": "棂",
        "櫻": "樱",
        "欄": "栏",
        "欅": "榉",
        "權": "权",
        "欏": "椤",
        "欒": "栾",
        "欖": "榄",
        "欞": "棂",
        "欽": "钦",
        "歎": "叹",
        "歐": "欧",
        "歟": "欤",
        "歡": "欢",
        "歲": "岁",
        "歷": "历",
        "歸": "归",
        "歿": "殁",
        "殘": "残",
        "殞": "殒",
        "殤": "殇",
        "殨": "㱮",
        "殫": "殚",
        "殭": "僵",
        "殮": "殓",
        "殯": "殡",
        "殰": "㱩",
        "殲": "歼",
        "殺": "杀",
        "殻": "壳",
        "殼": "壳",
        "毀": "毁",
        "毆": "殴",
        "毿": "毵",
        "氂": "牦",
        "氈": "毡",
        "氌": "氇",
        "氣": "气",
        "氫": "氢",
        "氬": "氩",
        "氳": "氲",
        "氾": "泛",
        "汎": "泛",
        "汙": "污",
        "決": "决",
        "沒": "没",
        "沖": "冲",
        "況": "况",
        "泝": "溯",
        "洩": "泄",
        "洶": "汹",
        "浹": "浃",
        "涇": "泾",
        "涗": "涚",
        "涼": "凉",
        "淒": "凄",
        "淚": "泪",
        "淥": "渌",
        "淨": "净",
        "淩": "凌",
        "淪": "沦",
        "淵": "渊",
        "淶": "涞",
        "淺": "浅",
        "渙": "涣",
        "減": "减",
        "渢": "沨",
        "渦": "涡",
        "測": "测",
        "渾": "浑",
        "湊": "凑",
        "湞": "浈",
        "湧": "涌",
        "湯": "汤",
        "溈": "沩",
        "準": "准",
        "溝": "沟",
        "溫": "温",
        "溮": "浉",
        "溳": "涢",
        "溼": "湿",
        "滄": "沧",
        "滅": "灭",
        "滌": "涤",
        "滎": "荥",
        "滙": "汇",
        "滬": "沪",
        "滯": "滞",
        "滲": "渗",
        "滷": "卤",
        "滸": "浒",
        "滻": "浐",
        "滾": "滚",
        "滿": "满",
        "漁": "渔",
        "漊": "溇",
        "漚": "沤",
        "漢": "汉",
        "漣": "涟",
        "漬": "渍",
        "漲": "涨",
        "漵": "溆",
        "漸": "渐",
        "漿": "浆",
        "潁": "颍",
        "潑": "泼",
        "潔": "洁",
        "潙": "沩",
        "潛": "潜",
        "潤": "润",
        "潯": "浔",
        "潰": "溃",
        "潷": "滗",
        "潿": "涠",
        "澀": "涩",
        "澆": "浇",
        "澇": "涝",
        "澐": "沄",
        "澗": "涧",
        "澠": "渑",
        "澤": "泽",
        "澦": "滪",
        "澩": "泶",
        "澮": "浍",
        "澱": "淀",
        "澾": "㳠",
        "濁": "浊",
        "濃": "浓",
        "濄": "㳡",
        "濕": "湿",
        "濘": "泞",
        "濛": "蒙",
        "濜": "浕",
        "濟": "济",
        "濤": "涛",
        "濧": "㳔",
        "濫": "滥",
        "濰": "潍",
        "濱": "滨",
        "濺": "溅",
        "濼": "泺",
        "濾": "滤",
        "瀂": "澛",
        "瀅": "滢",
        "瀆": "渎",
        "瀇": "㲿",
        "瀉": "泻",
        "瀏": "浏",
        "瀕": "濒",
        "瀘": "泸",
        "瀝": "沥",
        "瀟": "潇",
        "瀠": "潆",
        "瀦": "潴",
        "瀧": "泷",
        "瀨": "濑",
        "瀲": "潋",
        "瀾": "澜",
        "灃": "沣",
        "灄": "滠",
        "灑": "洒",
        "灕": "漓",
        "灘": "滩",
        "灝": "灏",
        "灠": "漤",
        "灡": "㳕",
        "灣": "湾",
        "灤": "滦",
        "灧": "滟",
        "灩": "滟",
        "災": "灾",
        "為": "为",
        "烏": "乌",
        "烴": "烃",
        "無": "无",
        "煉": "炼",
        "煒": "炜",
        "煙": "烟",
        "煢": "茕",
        "煥": "焕",
        "煩": "烦",
        "煬": "炀",
        "煱": "㶽",
        "熅": "煴",
        "熒": "荧",
        "熗": "炝",
        "熱": "热",
        "熲": "颎",
        "熾": "炽",
        "燁": "烨",
        "燈": "灯",
        "燉": "炖",
        "燒": "烧",
        "燙": "烫",
        "燜": "焖",
        "營": "营",
        "燦": "灿",
        "燬": "毁",
        "燭": "烛",
        "燴": "烩",
        "燶": "㶶",
        "燻": "熏",
        "燼": "烬",
        "燾": "焘",
        "爍": "烁",
        "爐": "炉",
        "爛": "烂",
        "爭": "争",
        "爲": "为",
        "爺": "爷",
        "爾": "尔",
        "牀": "床",
        "牆": "墙",
        "牘": "牍",
        "牽": "牵",
        "犖": "荦",
        "犛": "牦",
        "犢": "犊",
        "犧": "牺",
        "狀": "状",
        "狹": "狭",
        "狽": "狈",
        "猙": "狰",
        "猶": "犹",
        "猻": "狲",
        "獁": "犸",
        "獃": "呆",
        "獄": "狱",
        "獅": "狮",
        "獎": "奖",
        "獨": "独",
        "獪": "狯",
        "獫": "猃",
        "獮": "狝",
        "獰": "狞",
        "獱": "㺍",
        "獲": "获",
        "獵": "猎",
        "獷": "犷",
        "獸": "兽",
        "獺": "獭",
        "獻": "献",
        "獼": "猕",
        "玀": "猡",
        "現": "现",
        "琱": "雕",
        "琺": "珐",
        "琿": "珲",
        "瑋": "玮",
        "瑒": "玚",
        "瑣": "琐",
        "瑤": "瑶",
        "瑩": "莹",
        "瑪": "玛",
        "瑲": "玱",
        "璉": "琏",
        "璡": "琎",
        "璣": "玑",
        "璦": "瑷",
        "璫": "珰",
        "璯": "㻅",
        "環": "环",
        "璵": "玙",
        "璸": "瑸",
        "璽": "玺",
        "瓊": "琼",
        "瓏": "珑",
        "瓔": "璎",
        "瓚": "瓒",
        "甌": "瓯",
        "甕": "瓮",
        "產": "产",
        "産": "产",
        "甦": "苏",
        "甯": "宁",
        "畝": "亩",
        "畢": "毕",
        "異": "异",
        "畵": "画",
        "當": "当",
        "疇": "畴",
        "疊": "叠",
        "痙": "痉",
        "痠": "酸",
        "痾": "疴",
        "瘂": "痖",
        "瘋": "疯",
        "瘍": "疡",
        "瘓": "痪",
        "瘞": "瘗",
        "瘡": "疮",
        "瘧": "疟",
        "瘮": "瘆",
        "瘲": "疭",
        "瘺": "瘘",
        "瘻": "瘘",
        "療": "疗",
        "癆": "痨",
        "癇": "痫",
        "癉": "瘅",
        "癒": "愈",
        "癘": "疠",
        "癟": "瘪",
        "癡": "痴",
        "癢": "痒",
        "癤": "疖",
        "癥": "症",
        "癧": "疬",
        "癩": "癞",
        "癬": "癣",
        "癭": "瘿",
        "癮": "瘾",
        "癰": "痈",
        "癱": "瘫",
        "癲": "癫",
        "發": "发",
        "皁": "皂",
        "皚": "皑",
        "皰": "疱",
        "皸": "皲",
        "皺": "皱",
        "盃": "杯",
        "盜": "盗",
        "盞": "盏",
        "盡": "尽",
        "監": "监",
        "盤": "盘",
        "盧": "卢",
        "盪": "荡",
        "眞": "真",
        "眥": "眦",
        "眾": "众",
        "睏": "困",
        "睜": "睁",
        "睞": "睐",
        "瞘": "眍",
        "瞜": "䁖",
        "瞞": "瞒",
        "瞶": "瞆",
        "瞼": "睑",
        "矇": "蒙",
        "矓": "眬",
        "矚": "瞩",
        "矯": "矫",
        "硃": "朱",
        "硜": "硁",
        "硤": "硖",
        "硨": "砗",
        "硯": "砚",
        "碕": "埼",
        "碩": "硕",
        "碭": "砀",
        "碸": "砜",
        "確": "确",
        "碼": "码",
        "碽": "䂵",
        "磑": "硙",
        "磚": "砖",
        "磠": "硵",
        "磣": "碜",
        "磧": "碛",
        "磯": "矶",
        "磽": "硗",
        "礄": "硚",
        "礆": "硷",
        "礎": "础",
        "礙": "碍",
        "礦": "矿",
        "礪": "砺",
        "礫": "砾",
        "礬": "矾",
        "礱": "砻",
        "祕": "秘",
        "祿": "禄",
        "禍": "祸",
        "禎": "祯",
        "禕": "祎",
        "禡": "祃",
        "禦": "御",
        "禪": "禅",
        "禮": "礼",
        "禰": "祢",
        "禱": "祷",
        "禿": "秃",
        "秈": "籼",
        "稅": "税",
        "稈": "秆",
        "稏": "䅉",
        "稜": "棱",
        "稟": "禀",
        "種": "种",
        "稱": "称",
        "穀": "谷",
        "穇": "䅟",
        "穌": "稣",
        "積": "积",
        "穎": "颖",
        "穠": "秾",
        "穡": "穑",
        "穢": "秽",
        "穩": "稳",
        "穫": "获",
        "穭": "稆",
        "窩": "窝",
        "窪": "洼",
        "窮": "穷",
        "窯": "窑",
        "窵": "窎",
        "窶": "窭",
        "窺": "窥",
        "竄": "窜",
        "竅": "窍",
        "竇": "窦",
        "竈": "灶",
        "竊": "窃",
        "竪": "竖",
        "競": "竞",
        "筆": "笔",
        "筍": "笋",
        "筧": "笕",
        "筴": "䇲",
        "箇": "个",
        "箋": "笺",
        "箏": "筝",
        "節": "节",
        "範": "范",
        "築": "筑",
        "篋": "箧",
        "篔": "筼",
        "篤": "笃",
        "篩": "筛",
        "篳": "筚",
        "簀": "箦",
        "簍": "篓",
        "簑": "蓑",
        "簞": "箪",
        "簡": "简",
        "簣": "篑",
        "簫": "箫",
        "簹": "筜",
        "簽": "签",
        "簾": "帘",
        "籃": "篮",
        "籌": "筹",
        "籔": "䉤",
        "籙": "箓",
        "籛": "篯",
        "籜": "箨",
        "籟": "籁",
        "籠": "笼",
        "籤": "签",
        "籩": "笾",
        "籪": "簖",
        "籬": "篱",
        "籮": "箩",
        "籲": "吁",
        "粵": "粤",
        "糉": "粽",
        "糝": "糁",
        "糞": "粪",
        "糧": "粮",
        "糰": "团",
        "糲": "粝",
        "糴": "籴",
        "糶": "粜",
        "糹": "纟",
        "糾": "纠",
        "紀": "纪",
        "紂": "纣",
        "約": "约",
        "紅": "红",
        "紆": "纡",
        "紇": "纥",
        "紈": "纨",
        "紉": "纫",
        "紋": "纹",
        "納": "纳",
        "紐": "纽",
        "紓": "纾",
        "純": "纯",
        "紕": "纰",
        "紖": "纼",
        "紗": "纱",
        "紘": "纮",
        "紙": "纸",
        "級": "级",
        "紛": "纷",
        "紜": "纭",
        "紝": "纴",
        "紡": "纺",
        "紬": "䌷",
        "紮": "扎",
        "細": "细",
        "紱": "绂",
        "紲": "绁",
        "紳": "绅",
        "紵": "纻",
        "紹": "绍",
        "紺": "绀",
        "紼": "绋",
        "紿": "绐",
        "絀": "绌",
        "終": "终",
        "絃": "弦",
        "組": "组",
        "絅": "䌹",
        "絆": "绊",
        "絎": "绗",
        "結": "结",
        "絕": "绝",
        "絛": "绦",
        "絝": "绔",
        "絞": "绞",
        "絡": "络",
        "絢": "绚",
        "給": "给",
        "絨": "绒",
        "絰": "绖",
        "統": "统",
        "絲": "丝",
        "絳": "绛",
        "絶": "绝",
        "絹": "绢",
        "綁": "绑",
        "綃": "绡",
        "綆": "绠",
        "綈": "绨",
        "綉": "绣",
        "綌": "绤",
        "綏": "绥",
        "綐": "䌼",
        "綑": "捆",
        "經": "经",
        "綜": "综",
        "綞": "缍",
        "綠": "绿",
        "綢": "绸",
        "綣": "绻",
        "綫": "线",
        "綬": "绶",
        "維": "维",
        "綯": "绹",
        "綰": "绾",
        "綱": "纲",
        "網": "网",
        "綳": "绷",
        "綴": "缀",
        "綸": "纶",
        "綹": "绺",
        "綺": "绮",
        "綻": "绽",
        "綽": "绰",
        "綾": "绫",
        "綿": "绵",
        "緄": "绲",
        "緇": "缁",
        "緊": "紧",
        "緋": "绯",
        "緑": "绿",
        "緒": "绪",
        "緓": "绬",
        "緔": "绱",
        "緗": "缃",
        "緘": "缄",
        "緙": "缂",
        "緝": "缉",
        "緞": "缎",
        "締": "缔",
        "緡": "缗",
        "緣": "缘",
        "緦": "缌",
        "編": "编",
        "緩": "缓",
        "緬": "缅",
        "緯": "纬",
        "緱": "缑",
        "緲": "缈",
        "練": "练",
        "緶": "缏",
        "緹": "缇",
        "緻": "致",
        "緼": "缊",
        "縈": "萦",
        "縉": "缙",
        "縊": "缢",
        "縋": "缒",
        "縐": "绉",
        "縑": "缣",
        "縕": "缊",
        "縗": "缞",
        "縛": "缚",
        "縝": "缜",
        "縞": "缟",
        "縟": "缛",
        "縣": "县",
        "縧": "绦",
        "縫": "缝",
        "縭": "缡",
        "縮": "缩",
        "縱": "纵",
        "縲": "缧",
        "縳": "䌸",
        "縴": "纤",
        "縵": "缦",
        "縶": "絷",
        "縷": "缕",
        "縹": "缥",
        "總": "总",
        "績": "绩",
        "繃": "绷",
        "繅": "缫",
        "繆": "缪",
        "繐": "穗",
        "繒": "缯",
        "織": "织",
        "繕": "缮",
        "繚": "缭",
        "繞": "绕",
        "繡": "绣",
        "繢": "缋",
        "繩": "绳",
        "繪": "绘",
        "繫": "系",
        "繭": "茧",
        "繮": "缰",
        "繯": "缳",
        "繰": "缲",
        "繳": "缴",
        "繸": "䍁",
        "繹": "绎",
        "繼": "继",
        "繽": "缤",
        "繾": "缱",
        "繿": "䍀",
        "纇": "颣",
        "纈": "缬",
        "纊": "纩",
        "續": "续",
        "纍": "累",
        "纏": "缠",
        "纓": "缨",
        "纔": "才",
        "纖": "纤",
        "纘": "缵",
        "纜": "缆",
        "缽": "钵",
        "罈": "坛",
        "罌": "罂",
        "罎": "坛",
        "罰": "罚",
        "罵": "骂",
        "罷": "罢",
        "羅": "罗",
        "羆": "罴",
        "羈": "羁",
        "羋": "芈",
        "羣": "群",
        "羥": "羟",
        "羨": "羡",
        "義": "义",
        "羶": "膻",
        "習": "习",
        "翬": "翚",
        "翹": "翘",
        "翽": "翙",
        "耬": "耧",
        "耮": "耢",
        "聖": "圣",
        "聞": "闻",
        "聯": "联",
        "聰": "聪",
        "聲": "声",
        "聳": "耸",
        "聵": "聩",
        "聶": "聂",
        "職": "职",
        "聹": "聍",
        "聽": "听",
        "聾": "聋",
        "肅": "肃",
        "脅": "胁",
        "脈": "脉",
        "脛": "胫",
        "脣": "唇",
        "脩": "修",
        "脫": "脱",
        "脹": "胀",
        "腎": "肾",
        "腖": "胨",
        "腡": "脶",
        "腦": "脑",
        "腫": "肿",
        "腳": "脚",
        "腸": "肠",
        "膃": "腽",
        "膕": "腘",
        "膚": "肤",
        "膞": "䏝",
        "膠": "胶",
        "膩": "腻",
        "膽": "胆",
        "膾": "脍",
        "膿": "脓",
        "臉": "脸",
        "臍": "脐",
        "臏": "膑",
        "臘": "腊",
        "臚": "胪",
        "臟": "脏",
        "臠": "脔",
        "臢": "臜",
        "臥": "卧",
        "臨": "临",
        "臺": "台",
        "與": "与",
        "興": "兴",
        "舉": "举",
        "舊": "旧",
        "舘": "馆",
        "艙": "舱",
        "艤": "舣",
        "艦": "舰",
        "艫": "舻",
        "艱": "艰",
        "艷": "艳",
        "芻": "刍",
        "苧": "苎",
        "茲": "兹",
        "荊": "荆",
        "莊": "庄",
        "莖": "茎",
        "莢": "荚",
        "莧": "苋",
        "華": "华",
        "菴": "庵",
        "菸": "烟",
        "萇": "苌",
        "萊": "莱",
        "萬": "万",
        "萴": "荝",
        "萵": "莴",
        "葉": "叶",
        "葒": "荭",
        "葤": "荮",
        "葦": "苇",
        "葯": "药",
        "葷": "荤",
        "蒐": "搜",
        "蒓": "莼",
        "蒔": "莳",
        "蒕": "蒀",
        "蒞": "莅",
        "蒼": "苍",
        "蓀": "荪",
        "蓆": "席",
        "蓋": "盖",
        "蓮": "莲",
        "蓯": "苁",
        "蓴": "莼",
        "蓽": "荜",
        "蔔": "卜",
        "蔘": "参",
        "蔞": "蒌",
        "蔣": "蒋",
        "蔥": "葱",
        "蔦": "茑",
        "蔭": "荫",
        "蕁": "荨",
        "蕆": "蒇",
        "蕎": "荞",
        "蕒": "荬",
        "蕓": "芸",
        "蕕": "莸",
        "蕘": "荛",
        "蕢": "蒉",
        "蕩": "荡",
        "蕪": "芜",
        "蕭": "萧",
        "蕷": "蓣",
        "薀": "蕰",
        "薈": "荟",
        "薊": "蓟",
        "薌": "芗",
        "薑": "姜",
        "薔": "蔷",
        "薘": "荙",
        "薟": "莶",
        "薦": "荐",
        "薩": "萨",
        "薳": "䓕",
        "薴": "苧",
        "薺": "荠",
        "藍": "蓝",
        "藎": "荩",
        "藝": "艺",
        "藥": "药",
        "藪": "薮",
        "藭": "䓖",
        "藴": "蕴",
        "藶": "苈",
        "藹": "蔼",
        "藺": "蔺",
        "蘀": "萚",
        "蘄": "蕲",
        "蘆": "芦",
        "蘇": "苏",
        "蘊": "蕴",
        "蘚": "藓",
        "蘞": "蔹",
        "蘢": "茏",
        "蘭": "兰",
        "蘺": "蓠",
        "蘿": "萝",
        "虆": "蔂",
        "處": "处",
        "虛": "虚",
        "虜": "虏",
        "號": "号",
        "虧": "亏",
        "虯": "虬",
        "蛺": "蛱",
        "蛻": "蜕",
        "蜆": "蚬",
        "蝕": "蚀",
        "蝟": "猬",
        "蝦": "虾",
        "蝨": "虱",
        "蝸": "蜗",
        "螄": "蛳",
        "螞": "蚂",
        "螢": "萤",
        "螮": "䗖",
        "螻": "蝼",
        "螿": "螀",
        "蟄": "蛰",
        "蟈": "蝈",
        "蟎": "螨",
        "蟣": "虮",
        "蟬": "蝉",
        "蟯": "蛲",
        "蟲": "虫",
        "蟶": "蛏",
        "蟻": "蚁",
        "蠁": "蚃",
        "蠅": "蝇",
        "蠆": "虿",
        "蠍": "蝎",
        "蠐": "蛴",
        "蠑": "蝾",
        "蠔": "蚝",
        "蠟": "蜡",
        "蠣": "蛎",
        "蠨": "蟏",
        "蠱": "蛊",
        "蠶": "蚕",
        "蠻": "蛮",
        "衆": "众",
        "衊": "蔑",
        "術": "术",
        "衕": "同",
        "衚": "胡",
        "衛": "卫",
        "衝": "冲",
        "袞": "衮",
        "裊": "袅",
        "裏": "里",
        "補": "补",
        "裝": "装",
        "裡": "里",
        "製": "制",
        "複": "复",
        "褌": "裈",
        "褘": "袆",
        "褲": "裤",
        "褳": "裢",
        "褸": "褛",
        "褻": "亵",
        "襆": "幞",
        "襇": "裥",
        "襉": "裥",
        "襏": "袯",
        "襖": "袄",
        "襝": "裣",
        "襠": "裆",
        "襤": "褴",
        "襪": "袜",
        "襯": "衬",
        "襲": "袭",
        "襴": "襕",
        "覈": "核",
        "見": "见",
        "覎": "觃",
        "規": "规",
        "覓": "觅",
        "視": "视",
        "覘": "觇",
        "覡": "觋",
        "覥": "觍",
        "覦": "觎",
        "親": "亲",
        "覬": "觊",
        "覯": "觏",
        "覲": "觐",
        "覷": "觑",
        "覺": "觉",
        "覽": "览",
        "覿": "觌",
        "觀": "观",
        "觴": "觞",
        "觶": "觯",
        "觸": "触",
        "訁": "讠",
        "訂": "订",
        "訃": "讣",
        "計": "计",
        "訊": "讯",
        "訌": "讧",
        "討": "讨",
        "訐": "讦",
        "訒": "讱",
        "訓": "训",
        "訕": "讪",
        "訖": "讫",
        "記": "记",
        "訛": "讹",
        "訝": "讶",
        "訟": "讼",
        "訢": "䜣",
        "訣": "诀",
        "訥": "讷",
        "訩": "讻",
        "訪": "访",
        "設": "设",
        "許": "许",
        "訴": "诉",
        "訶": "诃",
        "診": "诊",
        "註": "注",
        "証": "证",
        "詁": "诂",
        "詆": "诋",
        "詎": "讵",
        "詐": "诈",
        "詒": "诒",
        "詔": "诏",
        "評": "评",
        "詖": "诐",
        "詗": "诇",
        "詘": "诎",
        "詛": "诅",
        "詞": "词",
        "詠": "咏",
        "詡": "诩",
        "詢": "询",
        "詣": "诣",
        "試": "试",
        "詩": "诗",
        "詫": "诧",
        "詬": "诟",
        "詭": "诡",
        "詮": "诠",
        "詰": "诘",
        "話": "话",
        "該": "该",
        "詳": "详",
        "詵": "诜",
        "詼": "诙",
        "詿": "诖",
        "誄": "诔",
        "誅": "诛",
        "誆": "诓",
        "誇": "夸",
        "誌": "志",
        "認": "认",
        "誑": "诳",
        "誒": "诶",
        "誕": "诞",
        "誘": "诱",
        "誚": "诮",
        "語": "语",
        "誠": "诚",
        "誡": "诫",
        "誣": "诬",
        "誤": "误",
        "誥": "诰",
        "誦": "诵",
        "誨": "诲",
        "說": "说",
        "説": "说",
        "誰": "谁",
        "課": "课",
        "誶": "谇",
        "誹": "诽",
        "誼": "谊",
        "誾": "訚",
        "調": "调",
        "諂": "谄",
        "諄": "谆",
        "談": "谈",
        "諉": "诿",
        "請": "请",
        "諍": "诤",
        "諏": "诹",
        "諑": "诼",
        "諒": "谅",
        "論": "论",
        "諗": "谂",
        "諛": "谀",
        "諜": "谍",
        "諝": "谞",
        "諞": "谝",
        "諡": "谥",
        "諢": "诨",
        "諤": "谔",
        "諦": "谛",
        "諧": "谐",
        "諭": "谕",
        "諱": "讳",
        "諳": "谙",
        "諶": "谌",
        "諷": "讽",
        "諸": "诸",
        "諺": "谚",
        "諼": "谖",
        "諾": "诺",
        "謀": "谋",
        "謁": "谒",
        "謂": "谓",
        "謄": "誊",
        "謅": "诌",
        "謊": "谎",
        "謎": "谜",
        "謐": "谧",
        "謔": "谑",
        "謖": "谡",
        "謗": "谤",
        "謙": "谦",
        "謚": "谥",
        "講": "讲",
        "謝": "谢",
        "謠": "谣",
        "謡": "谣",
        "謨": "谟",
        "謫": "谪",
        "謬": "谬",
        "謭": "谫",
        "謳": "讴",
        "謹": "谨",
        "謾": "谩",
        "譁": "哗",
        "譅": "䜧",
        "證": "证",
        "譎": "谲",
        "譏": "讥",
        "譖": "谮",
        "識": "识",
        "譙": "谯",
        "譚": "谭",
        "譜": "谱",
        "譟": "噪",
        "譫": "谵",
        "譭": "毁",
        "譯": "译",
        "議": "议",
        "譴": "谴",
        "護": "护",
        "譸": "诪",
        "譽": "誉",
        "讀": "读",
        "讅": "谉",
        "變": "变",
        "讋": "詟",
        "讌": "䜩",
        "讎": "雠",
        "讒": "谗",
        "讓": "让",
        "讕": "谰",
        "讖": "谶",
        "讚": "赞",
        "讜": "谠",
        "讞": "谳",
        "豈": "岂",
        "豎": "竖",
        "豐": "丰",
        "豔": "艳",
        "豬": "猪",
        "豶": "豮",
        "貓": "猫",
        "貙": "䝙",
        "貝": "贝",
        "貞": "贞",
        "貟": "贠",
        "負": "负",
        "財": "财",
        "貢": "贡",
        "貧": "贫",
        "貨": "货",
        "販": "贩",
        "貪": "贪",
        "貫": "贯",
        "責": "责",
        "貯": "贮",
        "貰": "贳",
        "貲": "赀",
        "貳": "贰",
        "貴": "贵",
        "貶": "贬",
        "貸": "贷",
        "貺": "贶",
        "費": "费",
        "貼": "贴",
        "貽": "贻",
        "貿": "贸",
        "賀": "贺",
        "賁": "贲",
        "賂": "赂",
        "賃": "赁",
        "賄": "贿",
        "賅": "赅",
        "資": "资",
        "賈": "贾",
        "賊": "贼",
        "賑": "赈",
        "賒": "赊",
        "賓": "宾",
        "賕": "赇",
        "賙": "赒",
        "賚": "赉",
        "賜": "赐",
        "賞": "赏",
        "賠": "赔",
        "賡": "赓",
        "賢": "贤",
        "賣": "卖",
        "賤": "贱",
        "賦": "赋",
        "賧": "赕",
        "質": "质",
        "賫": "赍",
        "賬": "账",
        "賭": "赌",
        "賰": "䞐",
        "賴": "赖",
        "賵": "赗",
        "賺": "赚",
        "賻": "赙",
        "購": "购",
        "賽": "赛",
        "賾": "赜",
        "贄": "贽",
        "贅": "赘",
        "贇": "赟",
        "贈": "赠",
        "贊": "赞",
        "贋": "赝",
        "贍": "赡",
        "贏": "赢",
        "贐": "赆",
        "贓": "赃",
        "贔": "赑",
        "贖": "赎",
        "贗": "赝",
        "贛": "赣",
        "贜": "赃",
        "赬": "赪",
        "趕": "赶",
        "趙": "赵",
        "趨": "趋",
        "趲": "趱",
        "跡": "迹",
        "踐": "践",
        "踰": "逾",
        "踴": "踊",
        "蹌": "跄",
        "蹕": "跸",
        "蹟": "迹",
        "蹣": "蹒",
        "蹤": "踪",
        "蹺": "跷",
        "躂": "跶",
        "躉": "趸",
        "躊": "踌",
        "躋": "跻",
        "躍": "跃",
        "躎": "䟢",
        "躑": "踯",
        "躒": "跞",
        "躓": "踬",
        "躕": "蹰",
        "躚": "跹",
        "躡": "蹑",
        "躥": "蹿",
        "躦": "躜",
        "躪": "躏",
        "軀": "躯",
        "車": "车",
        "軋": "轧",
        "軌": "轨",
        "軍": "军",
        "軑": "轪",
        "軒": "轩",
        "軔": "轫",
        "軛": "轭",
        "軟": "软",
        "軤": "轷",
        "軫": "轸",
        "軲": "轱",
        "軸": "轴",
        "軹": "轵",
        "軺": "轺",
        "軻": "轲",
        "軼": "轶",
        "軾": "轼",
        "較": "较",
        "輅": "辂",
        "輇": "辁",
        "輈": "辀",
        "載": "载",
        "輊": "轾",
        "輒": "辄",
        "輓": "挽",
        "輔": "辅",
        "輕": "轻",
        "輛": "辆",
        "輜": "辎",
        "輝": "辉",
        "輞": "辋",
        "輟": "辍",
        "輥": "辊",
        "輦": "辇",
        "輩": "辈",
        "輪": "轮",
        "輬": "辌",
        "輯": "辑",
        "輳": "辏",
        "輸": "输",
        "輻": "辐",
        "輼": "辒",
        "輾": "辗",
        "輿": "舆",
        "轀": "辒",
        "轂": "毂",
        "轄": "辖",
        "轅": "辕",
        "轆": "辘",
        "轉": "转",
        "轍": "辙",
        "轎": "轿",
        "轔": "辚",
        "轟": "轰",
        "轡": "辔",
        "轢": "轹",
        "轤": "轳",
        "辦": "办",
        "辭": "辞",
        "辮": "辫",
        "辯": "辩",
        "農": "农",
        "迴": "回",
        "逕": "迳",
        "這": "这",
        "連": "连",
        "週": "周",
        "進": "进",
        "遊": "游",
        "運": "运",
        "過": "过",
        "達": "达",
        "違": "违",
        "遙": "遥",
        "遜": "逊",
        "遞": "递",
        "遠": "远",
        "遡": "溯",
        "適": "适",
        "遲": "迟",
        "遷": "迁",
        "選": "选",
        "遺": "遗",
        "遼": "辽",
        "邁": "迈",
        "還": "还",
        "邇": "迩",
        "邊": "边",
        "邏": "逻",
        "邐": "逦",
        "郟": "郏",
        "郵": "邮",
        "鄆": "郓",
        "鄉": "乡",
        "鄒": "邹",
        "鄔": "邬",
        "鄖": "郧",
        "鄧": "邓",
        "鄭": "郑",
        "鄰": "邻",
        "鄲": "郸",
        "鄴": "邺",
        "鄶": "郐",
        "鄺": "邝",
        "酇": "酂",
        "酈": "郦",
        "醃": "腌",
        "醖": "酝",
        "醜": "丑",
        "醞": "酝",
        "醣": "糖",
        "醫": "医",
        "醬": "酱",
        "醱": "酦",
        "釀": "酿",
        "釁": "衅",
        "釃": "酾",
        "釅": "酽",
        "釋": "释",
        "釐": "厘",
        "釒": "钅",
        "釓": "钆",
        "釔": "钇",
        "釕": "钌",
        "釗": "钊",
        "釘": "钉",
        "釙": "钋",
        "針": "针",
        "釣": "钓",
        "釤": "钐",
        "釦": "扣",
        "釧": "钏",
        "釩": "钒",
        "釵": "钗",
        "釷": "钍",
        "釹": "钕",
        "釺": "钎",
        "釾": "䥺",
        "鈀": "钯",
        "鈁": "钫",
        "鈃": "钘",
        "鈄": "钭",
        "鈅": "钥",
        "鈈": "钚",
        "鈉": "钠",
        "鈍": "钝",
        "鈎": "钩",
        "鈐": "钤",
        "鈑": "钣",
        "鈒": "钑",
        "鈔": "钞",
        "鈞": "钧",
        "鈡": "钟",
        "鈣": "钙",
        "鈥": "钬",
        "鈦": "钛",
        "鈧": "钪",
        "鈮": "铌",
        "鈰": "铈",
        "鈳": "钶",
        "鈴": "铃",
        "鈷": "钴",
        "鈸": "钹",
        "鈹": "铍",
        "鈺": "钰",
        "鈽": "钸",
        "鈾": "铀",
        "鈿": "钿",
        "鉀": "钾",
        "鉆": "钻",
        "鉈": "铊",
        "鉉": "铉",
        "鉋": "铇",
        "鉍": "铋",
        "鉑": "铂",
        "鉕": "钷",
        "鉗": "钳",
        "鉚": "铆",
        "鉛": "铅",
        "鉞": "钺",
        "鉢": "钵",
        "鉤": "钩",
        "鉦": "钲",
        "鉬": "钼",
        "鉭": "钽",
        "鉶": "铏",
        "鉸": "铰",
        "鉺": "铒",
        "鉻": "铬",
        "鉿": "铪",
        "銀": "银",
        "銃": "铳",
        "銅": "铜",
        "銍": "铚",
        "銑": "铣",
        "銓": "铨",
        "銖": "铢",
        "銘": "铭",
        "銚": "铫",
        "銛": "铦",
        "銜": "衔",
        "銠": "铑",
        "銣": "铷",
        "銥": "铱",
        "銦": "铟",
        "銨": "铵",
        "銩": "铥",
        "銪": "铕",
        "銫": "铯",
        "銬": "铐",
        "銱": "铞",
        "銳": "锐",
        "銷": "销",
        "銹": "锈",
        "銻": "锑",
        "銼": "锉",
        "鋁": "铝",
        "鋃": "锒",
        "鋅": "锌",
        "鋇": "钡",
        "鋌": "铤",
        "鋏": "铗",
        "鋒": "锋",
        "鋙": "铻",
        "鋝": "锊",
        "鋟": "锓",
        "鋣": "铘",
        "鋤": "锄",
        "鋥": "锃",
        "鋦": "锔",
        "鋨": "锇",
        "鋩": "铓",
        "鋪": "铺",
        "鋭": "锐",
        "鋮": "铖",
        "鋯": "锆",
        "鋰": "锂",
        "鋱": "铽",
        "鋶": "锍",
        "鋸": "锯",
        "鋼": "钢",
        "錁": "锞",
        "錄": "录",
        "錆": "锖",
        "錇": "锫",
        "錈": "锩",
        "錏": "铔",
        "錐": "锥",
        "錒": "锕",
        "錕": "锟",
        "錘": "锤",
        "錙": "锱",
        "錚": "铮",
        "錛": "锛",
        "錟": "锬",
        "錠": "锭",
        "錡": "锜",
        "錢": "钱",
        "錦": "锦",
        "錨": "锚",
        "錩": "锠",
        "錫": "锡",
        "錮": "锢",
        "錯": "错",
        "録": "录",
        "錳": "锰",
        "錶": "表",
        "錸": "铼",
        "鍀": "锝",
        "鍁": "锨",
        "鍃": "锪",
        "鍆": "钔",
        "鍇": "锴",
        "鍈": "锳",
        "鍋": "锅",
        "鍍": "镀",
        "鍔": "锷",
        "鍘": "铡",
        "鍚": "钖",
        "鍛": "锻",
        "鍠": "锽",
        "鍤": "锸",
        "鍥": "锲",
        "鍩": "锘",
        "鍬": "锹",
        "鍰": "锾",
        "鍵": "键",
        "鍶": "锶",
        "鍺": "锗",
        "鍼": "针",
        "鎂": "镁",
        "鎄": "锿",
        "鎇": "镅",
        "鎊": "镑",
        "鎌": "镰",
        "鎔": "镕",
        "鎖": "锁",
        "鎘": "镉",
        "鎚": "锤",
        "鎛": "镈",
        "鎡": "镃",
        "鎢": "钨",
        "鎣": "蓥",
        "鎦": "镏",
        "鎧": "铠",
        "鎩": "铩",
        "鎪": "锼",
        "鎬": "镐",
        "鎭": "镇",
        "鎮": "镇",
        "鎰": "镒",
        "鎲": "镋",
        "鎳": "镍",
        "鎵": "镓",
        "鎸": "镌",
        "鎿": "镎",
        "鏃": "镞",
        "鏇": "镟",
        "鏈": "链",
        "鏌": "镆",
        "鏍": "镙",
        "鏐": "镠",
        "鏑": "镝",
        "鏗": "铿",
        "鏘": "锵",
        "鏚": "戚",
        "鏜": "镗",
        "鏝": "镘",
        "鏞": "镛",
        "鏟": "铲",
        "鏡": "镜",
        "鏢": "镖",
        "鏤": "镂",
        "鏨": "錾",
        "鏰": "镚",
        "鏵": "铧",
        "鏷": "镤",
        "鏹": "镪",
        "鏺": "䥽",
        "鏽": "锈",
        "鐃": "铙",
        "鐋": "铴",
        "鐐": "镣",
        "鐒": "铹",
        "鐓": "镦",
        "鐔": "镡",
        "鐗": "锏",
        "鐘": "钟",
        "鐙": "镫",
        "鐝": "镢",
        "鐠": "镨",
        "鐥": "䦅",
        "鐦": "锎",
        "鐧": "锏",
        "鐨": "镄",
        "鐫": "镌",
        "鐮": "镰",
        "鐯": "䦃",
        "鐲": "镯",
        "鐳": "镭",
        "鐵": "铁",
        "鐶": "镮",
        "鐸": "铎",
        "鐺": "铛",
        "鐿": "镱",
        "鑄": "铸",
        "鑊": "镬",
        "鑌": "镔",
        "鑑": "鉴",
        "鑒": "鉴",
        "鑔": "镲",
        "鑕": "锧",
        "鑞": "镴",
        "鑠": "铄",
        "鑣": "镳",
        "鑥": "镥",
        "鑭": "镧",
        "鑰": "钥",
        "鑱": "镵",
        "鑲": "镶",
        "鑷": "镊",
        "鑹": "镩",
        "鑼": "锣",
        "鑽": "钻",
        "鑾": "銮",
        "鑿": "凿",
        "钂": "镋",
        "镟": "旋",
        "長": "长",
        "門": "门",
        "閂": "闩",
        "閃": "闪",
        "閆": "闫",
        "閈": "闬",
        "閉": "闭",
        "閌": "闶",
        "閎": "闳",
        "閏": "闰",
        "閑": "闲",
        "間": "间",
        "閔": "闵",
        "閘": "闸",
        "閡": "阂",
        "閣": "阁",
        "閤": "合",
        "閥": "阀",
        "閨": "闺",
        "閩": "闽",
        "閫": "阃",
        "閬": "阆",
        "閭": "闾",
        "閱": "阅",
        "閲": "阅",
        "閶": "阊",
        "閹": "阉",
        "閻": "阎",
        "閼": "阏",
        "閽": "阍",
        "閾": "阈",
        "閿": "阌",
        "闃": "阒",
        "闆": "板",
        "闇": "暗",
        "闈": "闱",
        "闊": "阔",
        "闋": "阕",
        "闌": "阑",
        "闍": "阇",
        "闐": "阗",
        "闒": "阘",
        "闓": "闿",
        "闔": "阖",
        "闕": "阙",
        "闖": "闯",
        "關": "关",
        "闞": "阚",
        "闠": "阓",
        "闡": "阐",
        "闢": "辟",
        "闤": "阛",
        "闥": "闼",
        "陘": "陉",
        "陝": "陕",
        "陞": "升",
        "陣": "阵",
        "陰": "阴",
        "陳": "陈",
        "陸": "陆",
        "陽": "阳",
        "隉": "陧",
        "隊": "队",
        "階": "阶",
        "隕": "陨",
        "際": "际",
        "隨": "随",
        "險": "险",
        "隱": "隐",
        "隴": "陇",
        "隸": "隶",
        "隻": "只",
        "雋": "隽",
        "雖": "虽",
        "雙": "双",
        "雛": "雏",
        "雜": "杂",
        "雞": "鸡",
        "離": "离",
        "難": "难",
        "雲": "云",
        "電": "电",
        "霢": "霡",
        "霧": "雾",
        "霽": "霁",
        "靂": "雳",
        "靄": "霭",
        "靆": "叇",
        "靈": "灵",
        "靉": "叆",
        "靚": "靓",
        "靜": "静",
        "靨": "靥",
        "鞀": "鼗",
        "鞏": "巩",
        "鞝": "绱",
        "鞦": "秋",
        "鞽": "鞒",
        "韁": "缰",
        "韃": "鞑",
        "韆": "千",
        "韉": "鞯",
        "韋": "韦",
        "韌": "韧",
        "韍": "韨",
        "韓": "韩",
        "韙": "韪",
        "韜": "韬",
        "韞": "韫",
        "韻": "韵",
        "響": "响",
        "頁": "页",
        "頂": "顶",
        "頃": "顷",
        "項": "项",
        "順": "顺",
        "頇": "顸",
        "須": "须",
        "頊": "顼",
        "頌": "颂",
        "頎": "颀",
        "頏": "颃",
        "預": "预",
        "頑": "顽",
        "頒": "颁",
        "頓": "顿",
        "頗": "颇",
        "領": "领",
        "頜": "颌",
        "頡": "颉",
        "頤": "颐",
        "頦": "颏",
        "頭": "头",
        "頮": "颒",
        "頰": "颊",
        "頲": "颋",
        "頴": "颕",
        "頷": "颔",
        "頸": "颈",
        "頹": "颓",
        "頻": "频",
        "頽": "颓",
        "顆": "颗",
        "題": "题",
        "額": "额",
        "顎": "颚",
        "顏": "颜",
        "顒": "颙",
        "顓": "颛",
        "顔": "颜",
        "顙": "颡",
        "顛": "颠",
        "類": "类",
        "顢": "颟",
        "顥": "颢",
        "顧": "顾",
        "顫": "颤",
        "顬": "颥",
        "顯": "显",
        "顰": "颦",
        "顱": "颅",
        "顳": "颞",
        "顴": "颧",
        "風": "风",
        "颭": "飐",
        "颮": "飑",
        "颯": "飒",
        "颱": "台",
        "颳": "刮",
        "颶": "飓",
        "颸": "飔",
        "颺": "飏",
        "颻": "飖",
        "颼": "飕",
        "飀": "飗",
        "飄": "飘",
        "飆": "飙",
        "飈": "飚",
        "飛": "飞",
        "飠": "饣",
        "飢": "饥",
        "飣": "饤",
        "飥": "饦",
        "飩": "饨",
        "飪": "饪",
        "飫": "饫",
        "飭": "饬",
        "飯": "饭",
        "飱": "飧",
        "飲": "饮",
        "飴": "饴",
        "飼": "饲",
        "飽": "饱",
        "飾": "饰",
        "飿": "饳",
        "餃": "饺",
        "餄": "饸",
        "餅": "饼",
        "餉": "饷",
        "養": "养",
        "餌": "饵",
        "餎": "饹",
        "餏": "饻",
        "餑": "饽",
        "餒": "馁",
        "餓": "饿",
        "餕": "馂",
        "餖": "饾",
        "餚": "肴",
        "餛": "馄",
        "餜": "馃",
        "餞": "饯",
        "餡": "馅",
        "館": "馆",
        "餳": "饧",
        "餶": "馉",
        "餷": "馇",
        "餺": "馎",
        "餼": "饩",
        "餾": "馏",
        "餿": "馊",
        "饁": "馌",
        "饃": "馍",
        "饅": "馒",
        "饈": "馐",
        "饉": "馑",
        "饊": "馓",
        "饋": "馈",
        "饌": "馔",
        "饑": "饥",
        "饒": "饶",
        "饗": "飨",
        "饜": "餍",
        "饞": "馋",
        "饢": "馕",
        "馬": "马",
        "馭": "驭",
        "馮": "冯",
        "馱": "驮",
        "馳": "驰",
        "馴": "驯",
        "馹": "驲",
        "駁": "驳",
        "駐": "驻",
        "駑": "驽",
        "駒": "驹",
        "駔": "驵",
        "駕": "驾",
        "駘": "骀",
        "駙": "驸",
        "駛": "驶",
        "駝": "驼",
        "駟": "驷",
        "駡": "骂",
        "駢": "骈",
        "駭": "骇",
        "駰": "骃",
        "駱": "骆",
        "駸": "骎",
        "駿": "骏",
        "騁": "骋",
        "騂": "骍",
        "騅": "骓",
        "騌": "骔",
        "騍": "骒",
        "騎": "骑",
        "騏": "骐",
        "騖": "骛",
        "騙": "骗",
        "騤": "骙",
        "騧": "䯄",
        "騫": "骞",
        "騭": "骘",
        "騮": "骝",
        "騰": "腾",
        "騶": "驺",
        "騷": "骚",
        "騸": "骟",
        "騾": "骡",
        "驀": "蓦",
        "驁": "骜",
        "驂": "骖",
        "驃": "骠",
        "驅": "驱",
        "驊": "骅",
        "驌": "骕",
        "驍": "骁",
        "驏": "骣",
        "驕": "骄",
        "驗": "验",
        "驚": "惊",
        "驛": "驿",
        "驟": "骤",
        "驢": "驴",
        "驤": "骧",
        "驥": "骥",
        "驦": "骦",
        "驪": "骊",
        "驫": "骉",
        "骯": "肮",
        "髏": "髅",
        "髒": "脏",
        "體": "体",
        "髕": "髌",
        "髖": "髋",
        "髮": "发",
        "鬆": "松",
        "鬍": "胡",
        "鬚": "须",
        "鬢": "鬓",
        "鬥": "斗",
        "鬧": "闹",
        "鬨": "哄",
        "鬩": "阋",
        "鬮": "阄",
        "鬱": "郁",
        "鬹": "鬶",
        "魎": "魉",
        "魘": "魇",
        "魚": "鱼",
        "魛": "鱽",
        "魢": "鱾",
        "魨": "鲀",
        "魯": "鲁",
        "魴": "鲂",
        "魷": "鱿",
        "魺": "鲄",
        "鮁": "鲅",
        "鮃": "鲆",
        "鮊": "鲌",
        "鮋": "鲉",
        "鮍": "鲏",
        "鮎": "鲇",
        "鮐": "鲐",
        "鮑": "鲍",
        "鮒": "鲋",
        "鮓": "鲊",
        "鮚": "鲒",
        "鮜": "鲘",
        "鮝": "鲞",
        "鮞": "鲕",
        "鮣": "䲟",
        "鮦": "鲖",
        "鮪": "鲔",
        "鮫": "鲛",
        "鮭": "鲑",
        "鮮": "鲜",
        "鮳": "鲓",
        "鮶": "鲪",
        "鮺": "鲝",
        "鯀": "鲧",
        "鯁": "鲠",
        "鯇": "鲩",
        "鯉": "鲤",
        "鯊": "鲨",
        "鯒": "鲬",
        "鯔": "鲻",
        "鯕": "鲯",
        "鯖": "鲭",
        "鯗": "鲞",
        "鯛": "鲷",
        "鯝": "鲴",
        "鯡": "鲱",
        "鯢": "鲵",
        "鯤": "鲲",
        "鯧": "鲳",
        "鯨": "鲸",
        "鯪": "鲮",
        "鯫": "鲰",
        "鯰": "鲶",
        "鯴": "鲺",
        "鯷": "鳀",
        "鯽": "鲫",
        "鯿": "鳊",
        "鰁": "鳈",
        "鰂": "鲗",
        "鰃": "鳂",
        "鰆": "䲠",
        "鰈": "鲽",
        "鰉": "鳇",
        "鰌": "䲡",
        "鰍": "鳅",
        "鰏": "鲾",
        "鰐": "鳄",
        "鰒": "鳆",
        "鰓": "鳃",
        "鰛": "鳁",
        "鰜": "鳒",
        "鰟": "鳑",
        "鰠": "鳋",
        "鰣": "鲥",
        "鰥": "鳏",
        "鰧": "䲢",
        "鰨": "鳎",
        "鰩": "鳐",
        "鰭": "鳍",
        "鰮": "鳁",
        "鰱": "鲢",
        "鰲": "鳌",
        "鰳": "鳓",
        "鰵": "鳘",
        "鰷": "鲦",
        "鰹": "鲣",
        "鰺": "鲹",
        "鰻": "鳗",
        "鰼": "鳛",
        "鰾": "鳔",
        "鱂": "鳉",
        "鱅": "鳙",
        "鱈": "鳕",
        "鱉": "鳖",
        "鱒": "鳟",
        "鱔": "鳝",
        "鱖": "鳜",
        "鱗": "鳞",
        "鱘": "鲟",
        "鱝": "鲼",
        "鱟": "鲎",
        "鱠": "鲙",
        "鱣": "鳣",
        "鱤": "鳡",
        "鱧": "鳢",
        "鱨": "鲿",
        "鱭": "鲚",
        "鱯": "鳠",
        "鱷": "鳄",
        "鱸": "鲈",
        "鱺": "鲡",
        "鳥": "鸟",
        "鳧": "凫",
        "鳩": "鸠",
        "鳬": "凫",
        "鳲": "鸤",
        "鳳": "凤",
        "鳴": "鸣",
        "鳶": "鸢",
        "鳾": "䴓",
        "鴆": "鸩",
        "鴇": "鸨",
        "鴉": "鸦",
        "鴒": "鸰",
        "鴕": "鸵",
        "鴛": "鸳",
        "鴝": "鸲",
        "鴞": "鸮",
        "鴟": "鸱",
        "鴣": "鸪",
        "鴦": "鸯",
        "鴨": "鸭",
        "鴯": "鸸",
        "鴰": "鸹",
        "鴴": "鸻",
        "鴷": "䴕",
        "鴻": "鸿",
        "鴿": "鸽",
        "鵁": "䴔",
        "鵂": "鸺",
        "鵃": "鸼",
        "鵐": "鹀",
        "鵑": "鹃",
        "鵒": "鹆",
        "鵓": "鹁",
        "鵜": "鹈",
        "鵝": "鹅",
        "鵠": "鹄",
        "鵡": "鹉",
        "鵪": "鹌",
        "鵬": "鹏",
        "鵮": "鹐",
        "鵯": "鹎",
        "鵲": "鹊",
        "鵷": "鹓",
        "鵾": "鹍",
        "鶄": "䴖",
        "鶇": "鸫",
        "鶉": "鹑",
        "鶊": "鹒",
        "鶓": "鹋",
        "鶖": "鹙",
        "鶘": "鹕",
        "鶚": "鹗",
        "鶡": "鹖",
        "鶥": "鹛",
        "鶩": "鹜",
        "鶪": "䴗",
        "鶬": "鸧",
        "鶯": "莺",
        "鶲": "鹟",
        "鶴": "鹤",
        "鶹": "鹠",
        "鶺": "鹡",
        "鶻": "鹘",
        "鶼": "鹣",
        "鶿": "鹚",
        "鷀": "鹚",
        "鷁": "鹢",
        "鷂": "鹞",
        "鷄": "鸡",
        "鷈": "䴘",
        "鷉": "䴘",
        "鷊": "鹝",
        "鷓": "鹧",
        "鷖": "鹥",
        "鷗": "鸥",
        "鷙": "鸷",
        "鷚": "鹨",
        "鷥": "鸶",
        "鷦": "鹪",
        "鷫": "鹔",
        "鷯": "鹩",
        "鷲": "鹫",
        "鷳": "鹇",
        "鷴": "鹇",
        "鷸": "鹬",
        "鷹": "鹰",
        "鷺": "鹭",
        "鷽": "鸴",
        "鷿": "䴙",
        "鸂": "㶉",
        "鸇": "鹯",
        "鸊": "䴙",
        "鸌": "鹱",
        "鸏": "鹲",
        "鸕": "鸬",
        "鸘": "鹴",
        "鸚": "鹦",
        "鸛": "鹳",
        "鸝": "鹂",
        "鸞": "鸾",
        "鹵": "卤",
        "鹹": "咸",
        "鹺": "鹾",
        "鹼": "碱",
        "鹽": "盐",
        "麗": "丽",
        "麥": "麦",
        "麩": "麸",
        "麫": "面",
        "麯": "曲",
        "黃": "黄",
        "黌": "黉",
        "點": "点",
        "黨": "党",
        "黲": "黪",
        "黴": "霉",
        "黶": "黡",
        "黷": "黩",
        "黽": "黾",
        "黿": "鼋",
        "鼉": "鼍",
        "鼕": "冬",
        "鼴": "鼹",
        "齇": "齄",
        "齊": "齐",
        "齋": "斋",
        "齎": "赍",
        "齏": "齑",
        "齒": "齿",
        "齔": "龀",
        "齕": "龁",
        "齗": "龂",
        "齙": "龅",
        "齜": "龇",
        "齟": "龃",
        "齠": "龆",
        "齡": "龄",
        "齣": "出",
        "齦": "龈",
        "齪": "龊",
        "齬": "龉",
        "齲": "龋",
        "齶": "腭",
        "齷": "龌",
        "龍": "龙",
        "龎": "厐",
        "龐": "庞",
        "龑": "䶮",
        "龔": "龚",
        "龕": "龛",
        "龜": "龟",
        "鿁": "䜤",
        "妳": "你"
    };
    const regexp = new RegExp(Object.keys(aTC2SC).join('|'), 'g');
    /** 繁 => 简 */
    function cht2chs(text) {
        return text.replace(regexp, d => aTC2SC[d]);
    }
    API.cht2chs = cht2chs;

//# sourceURL=file://@Bilibili-Old/include/format/cht2chs.js`;
/*!***********************!*/
/**/modules["integerFormat.js"] = /*** ./src/include/format/integerFormat.js ***/
`
    /**
     * 格式化整数
     * @param num 原始整数
     * @param byte 格式化位数
     * @returns 格式化结果
     * @example
     * integerFormat(2, 3) // 结果：002
     * integerFormat(20, 1) // 结果：20（不变）
     */
    function integerFormat(num, byte = 2) {
        return num < 10 ** byte ? (Array(byte).join('0') + num).slice(-1 * byte) : num;
    }
    API.integerFormat = integerFormat;

//# sourceURL=file://@Bilibili-Old/include/format/integerFormat.js`;
/*!***********************!*/
/**/modules["sizeFormat.js"] = /*** ./src/include/format/sizeFormat.js ***/
`
    /**
     * 格式化字节
     * @param size 字节/B
     * @returns 字节大小
     * @example
     * sizeFormat(0) // N/A
     * sizeFormat(1024) // 1.00K
     */
    function sizeFormat(size = 0) {
        let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
        while (dex > 1) {
            if (size >= vor) {
                size = Number((size / dex).toFixed(2));
                break;
            }
            dex = dex / 1024;
            vor = vor / 1000;
            i--;
        }
        return size ? size + unit[i] : "N/A";
    }
    API.sizeFormat = sizeFormat;

//# sourceURL=file://@Bilibili-Old/include/format/sizeFormat.js`;
/*!***********************!*/
/**/modules["subArray.js"] = /*** ./src/include/format/subArray.js ***/
`
    /**
     * 提取随机子数组
     * @param res 原始数组
     * @param num 子数组大小
     * @returns 子数组，长度为1时直接返回该值。
     * @example
     * subArray([1, 2, 3], 2) // [1, 2]（结果之一）
     * subArray([1, 2, 3], 1) // 1（结果之一）
     */
    function subArray(res, num = 1) {
        const arr = [...res];
        const out = [];
        num = num || 1;
        num = num < arr.length ? num : arr.length;
        while (out.length < num) {
            var temp = (Math.random() * arr.length) >> 0;
            out.push(arr.splice(temp, 1)[0]);
        }
        return num === 1 ? out[0] : out;
    }
    API.subArray = subArray;

//# sourceURL=file://@Bilibili-Old/include/format/subArray.js`;
/*!***********************!*/
/**/modules["timeFormat.js"] = /*** ./src/include/format/timeFormat.js ***/
`
    /**
     * 格式化时间
     * @param time 时间戳（13位）
     * @param type 是否包含年月日
     * @returns 时:分:秒 | 年-月-日 时:分:秒
     * @example
     * timeFormat() // 00:00:00
     * timeFormat(0, true) // 1970-1-1 08:00:00
     */
    function timeFormat(time = new Date().getTime(), type) {
        const date = new Date(time);
        const arr = date.toLocaleString().split(" ");
        const day = arr[0].split("/");
        day[1] = API.integerFormat(day[1], 2);
        day[2] = API.integerFormat(day[2], 2);
        return type ? day.join("-") + " " + arr[1] : arr[1];
    }
    API.timeFormat = timeFormat;
    /**
     * 格式化秒数
     * @param second 秒数
     * @returns hh: mm: ss
     * @example
     * s2hms(60) // 1:00
     */
    function s2hms(second) {
        const s = second % 60;
        let m = parseInt(String(second / 60));
        const h = parseInt(String(m / 60));
        m = m % 60;
        return (h > 0 ? h + ":" : "") + (h > 0 || m > 0 ? (Array(2).join('0') + m).slice(-2) + ":" : "") + (Array(2).join('0') + s).slice(-2);
    }
    API.s2hms = s2hms;
    /**
     * 相对当前时间
     * @param time 时间戳
     * @returns 相对时间
     */
    function timePass(time) {
        time >= 1e11 && (time = Math.floor(time / 1e3));
        const now = Math.floor((new Date).getTime() / 1e3);
        let t = new Date;
        if (t.setHours(0), t.setMinutes(0), t.setSeconds(0), (t = Math.floor(t.getTime() / 1e3)) < time && 0 <= now - time) {
            if (now - time <= 50) {
                var r = 10 * Math.floor((now - time) % 60 / 10);
                return (10 < time ? r : 10) + "秒前";
            }
            return now - time < 3600 ? Math.floor((now - time) / 60) + "分钟前" : Math.floor((now - time) / 3600) + "小时前";
        }
        return timeFormat(time * 1e3, true);
    }
    API.timePass = timePass;

//# sourceURL=file://@Bilibili-Old/include/format/timeFormat.js`;
/*!***********************!*/
/**/modules["unitFormat.js"] = /*** ./src/include/format/unitFormat.js ***/
`
    /**
     * 格式化进位
     * @param num 正整数
     * @returns 进位结果
     * @example
     * unitFormat(10001) // 1万
     */
    function unitFormat(num = 0) {
        num = 1 * num || 0;
        let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
        while (dex > 1) {
            if (num >= dex) {
                num = Number((num / dex).toFixed(1));
                break;
            }
            dex = dex / 10000;
            i--;
        }
        return num + unit[i];
    }
    API.unitFormat = unitFormat;

//# sourceURL=file://@Bilibili-Old/include/format/unitFormat.js`;
/*!***********************!*/
/**/modules["urlFormat.js"] = /*** ./src/include/format/urlFormat.js ***/
`
    class UrlFormat {
        /**
         * 格式化URL
         * @param url URL字符串
         */
        constructor(url) {
            /** 去除参数和锚的基链接 */
            this.base = "";
            /** 查询参数转化的对象 */
            this.searchParams = new Proxy({}, {
                get: (t, p) => t[p] ? decodeURIComponent(t[p]) : t[p], set: (t, p, v) => {
                    t[p] = v ? encodeURIComponent(v) : v;
                    return true;
                }
            });
            /** 锚 */
            this.hash = "";
            /** 锚中的参数 */
            this.hashParams = new Proxy({}, {
                get: (t, p) => t[p] ? decodeURIComponent(t[p]) : t[p], set: (t, p, v) => {
                    t[p] = v ? encodeURIComponent(v) : v;
                    return true;
                }
            });
            try {
                // 原生URL处理函数要求太严格，无法处理自定义链接
                url = new URL(url).href;
            }
            catch (e) { }
            const one = url.split("#"); // 分离锚
            const two = one[0].split("?"); // 分离参数
            this.base = two[0]; // 分离基链接
            one.shift();
            two.shift();
            // 参数转对象
            if (two[0]) {
                two[0].split("&").forEach(d => {
                    const arr = d.split("=");
                    this.searchParams[arr[0]] = arr[1];
                });
            }
            // 锚处理
            if (one[0]) {
                const three = one[0].split("?");
                this.hash = three[0];
                three.shift();
                // 锚参数转对象
                if (three[0]) {
                    three[0].split("&").forEach(d => {
                        const arr = d.split("=");
                        this.hashParams[arr[0]] = arr[1];
                    });
                }
            }
        }
        /** 所有参数（包括锚中的参数）。 */
        params() {
            return new Proxy({ ...this.searchParams, ...this.hashParams }, {
                set: (t, p, v) => {
                    t[p] = v;
                    (Reflect.has(this.hashParams, p) ? this.hashParams : this.searchParams)[p] = v ? encodeURIComponent(v) : v;
                    return true;
                },
                deleteProperty: (t, p) => {
                    delete t[p];
                    delete (Reflect.has(this.hashParams, p) ? this.hashParams : this.searchParams)[p];
                    return true;
                }
            });
        }
        /** 拼合链接 */
        toJSON() {
            const base = []; // 基栈
            this.base && base.push(this.base); // 基链接
            // 参数
            const searchParams = Object.entries(this.searchParams).reduce((s, d) => {
                d[1] !== null && d[1] !== undefined && s.push(d.join("="));
                return s;
            }, []).join("&");
            searchParams && base.push(searchParams);
            const searchParam = base.join("?"); // 含参基链
            const hash = []; // 锚栈
            this.hash && hash.push(this.hash);
            const hashParams = Object.entries(this.hashParams).reduce((s, d) => {
                d[1] !== null && d[1] !== undefined && s.push(d.join("="));
                return s;
            }, []).join("&");
            hashParams && hash.push(hashParams);
            const hashParam = hash.join("?"); // 含参锚
            const result = []; // 结果栈
            searchParam && result.push(searchParam);
            hashParam && result.push(hashParam);
            return result.join("#");
        }
    }
    API.UrlFormat = UrlFormat;
    /**
     * 添加URL参数
     * @param url 原始URL，可带参数
     * @param obj 追加的参数，可覆盖原有参数
     * @returns 最终URL
     * @example
     * objUrl("https://www.example.com/?a=1", {a: 2, b: ""}) // https://www.example.com/?a=2&b=
     */
    function objUrl(url = "", obj = {}) {
        const result = new UrlFormat(url);
        Object.assign(result.searchParams, obj);
        return result.toJSON();
    }
    API.objUrl = objUrl;
    /**
     * 提取URL参数
     * @param url 原始URL
     * @returns 参数对象
     * @example
     * urlObj("https://www.example.com/?a=2&b=") // {a: 2, b: ""}
     */
    function urlObj(url = "") {
        return new UrlFormat(url).params();
    }
    API.urlObj = urlObj;

//# sourceURL=file://@Bilibili-Old/include/format/urlFormat.js`;
/*!***********************!*/
/**/modules["keymap.js"] = /*** ./src/include/hook/keymap.js ***/
`
    /** 回调事件栈 */
    const bindMap = {};
    /** 是否输入中 */
    const isTyping = () => {
        const { activeElement } = document;
        if (!activeElement) {
            return false;
        }
        if (activeElement.hasAttribute('contenteditable')) {
            return true;
        }
        return ['input', 'textarea'].includes(activeElement.nodeName.toLowerCase());
    };
    API.doWhile(() => document.body, d => {
        d.addEventListener("keydown", e => {
            if (isTyping())
                return;
            const key = e.key.toLowerCase();
            e.key && bindMap[key] && bindMap[key].forEach(d => {
                let disable = d.disable;
                (Number(d.altKey) ^ Number(e.altKey)) && (disable = true);
                (Number(d.ctrlKey) ^ Number(e.ctrlKey)) && (disable = true);
                (Number(d.metaKey) ^ Number(e.metaKey)) && (disable = true);
                (Number(d.repeat) ^ Number(e.repeat)) && (disable = true);
                (Number(d.shiftKey) ^ Number(e.shiftKey)) && (disable = true);
                try {
                    !disable && d.callback();
                }
                catch (e) {
                    API.debug.error("keymap.js", e);
                }
            });
        });
    });
    /**
     * 注册键盘输入监听
     * @param key 标准按键名（不区分大小写）
     * @param callback 回调函数
     * @param special 附加条件，如长按（长按事件可能会对此触发，请正确添加回调函数以免重复操作）、Ctrl激活等。
     * @returns 用于禁用事件监听的函数，参数表示是否禁用，不传递参数将根据当前状态进行反操作。
     */
    function bindKeyMap(key, callback, special = {}) {
        const keyl = key.toLowerCase();
        const map = Object.assign(special, { callback, disable: false });
        bindMap[keyl] ? bindMap[keyl].push(map) : bindMap[keyl] = [map];
        /**
         * 用于禁用事件监听的函数
         * @param bind 是否禁用，不传递时将根据当前状态进行反操作。
         */
        return function changeKeyMap(disable) {
            if (arguments.length) {
                map.disable = disable;
            }
            else {
                map.disable = !map.disable;
            }
        };
    }
    API.bindKeyMap = bindKeyMap;

//# sourceURL=file://@Bilibili-Old/include/hook/keymap.js`;
/*!***********************!*/
/**/modules["Node.js"] = /*** ./src/include/hook/Node.js ***/
`
    const appendChild = Node.prototype.appendChild;
    const insertBefore = Node.prototype.insertBefore;
    const jsonp = [];
    Node.prototype.appendChild = function (newChild) {
        newChild.nodeName == 'SCRIPT' && newChild.src && (jsonp.forEach(d => {
            d[0].every(d => newChild.src.includes(d)) && d[1].call(newChild);
        }));
        return appendChild.call(this, newChild);
    };
    Node.prototype.insertBefore = function (newChild, refChild) {
        newChild.nodeName == 'SCRIPT' && newChild.src && (jsonp.forEach(d => {
            d[0].every(d => newChild.src.includes(d)) && d[1].call(newChild);
        }));
        return insertBefore.call(this, newChild, refChild);
    };
    /**
     * 注册拦截修改jsonp请求，本方法必须传入同步返回的回调函数，要使用异步回调请考虑左转\`jsonphookasync\`。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param redirect 重定向url的回调函数，将原url作为第一个参数传递，必须同步返回重定向后的url。
     * @param modifyResponse 修改jsonp返回值的回调函数，将原返回值(一般为json格式)作为第一个参数传递，必须同步返回修改后的返回值。原url作为第二个参数，但由于结果已返回修改url并没有效果。
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递\`false\`，然后自行在不再需要拦截后使用\`removeJsonphook\`注销。
     * @returns 注册编号，\`once=false\`时才有用，可用于取消拦截。
     */
    function jsonphook(url, redirect, modifyResponse, once = true) {
        let id;
        const one = Array.isArray(url) ? url : [url];
        const two = function () {
            once && id && delete jsonp[id - 1];
            if (redirect)
                try {
                    this.src = redirect(this.src) || this.src;
                }
                catch (e) {
                    API.debug.error("redirect of jsonphook", one, e);
                }
            if (modifyResponse) {
                const obj = API.urlObj(this.src);
                const callback = obj.callback;
                const call = window[callback];
                const url = this.src;
                if (call) {
                    window[callback] = function (v) {
                        try {
                            v = modifyResponse(v, url, call) || v;
                        }
                        catch (e) {
                            API.debug.error("modifyResponse of jsonphook", one, e);
                        }
                        return v !== true && call(v);
                    };
                }
            }
        };
        return id = jsonp.push([one, two]);
    }
    API.jsonphook = jsonphook;
    /**
     * \`jsonphook\`的异步版本，可以用异步方法获取到的返回值替换jsonp请求的返回值。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param condition 二次判定**同步**回调函数，不提供或者返回真值时开始拦截，可以通过url等精确判定是否真要拦截。
     * @param modifyResponse 修改jsonp返回值的回调函数，将原url作为第一个参数传递，请将要设定的jsonp返回值返回，格式一般都是json。
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递\`false\`，然后自行在不再需要拦截后使用\`removeJsonphook\`注销。
     * @returns 注册编号，\`once=false\`时才有用，可用于取消拦截。
     */
    function jsonphookasync(url, condition, modifyResponse, once = true) {
        let id;
        const one = Array.isArray(url) ? url : [url];
        const two = function () {
            try {
                once && id && delete jsonp[id - 1];
                if (!condition || condition(this.src)) {
                    const obj = API.urlObj(this.src);
                    const callback = obj.callback;
                    const call = window[callback];
                    if (call) {
                        modifyResponse && modifyResponse(this.src).then(d => {
                            window[callback](d);
                            this.dispatchEvent(new ProgressEvent("load"));
                        }).catch(e => {
                            this.dispatchEvent(new ProgressEvent("error"));
                            API.debug.error("modifyResponse of xhrhookasync", one, e);
                        });
                    }
                    this.removeAttribute("src");
                }
            }
            catch (e) {
                API.debug.error("jsonphook", one, e);
            }
        };
        return id = jsonp.push([one, two]);
    }
    API.jsonphookasync = jsonphookasync;
    /**
     * 禁止脚本注入运行。
     * @param url 要禁止运行的脚本src匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     */
    function scriptBlock(url) {
        const one = Array.isArray(url) ? url : [url];
        const two = function () {
            try {
                this.removeAttribute("src");
                setTimeout(() => {
                    // 谎报完成事件并主动移除script节点
                    this.dispatchEvent(new ProgressEvent("load"));
                    try {
                        this.remove();
                    }
                    catch (e) { }
                }, 100);
            }
            catch (e) {
                API.debug.error("脚本拦截失败！", one, e);
            }
        };
        jsonp.push([one, two]);
    }
    API.scriptBlock = scriptBlock;
    /**
     * 注册拦截脚本注入，本方法只能拦截通过\`appendChild\`等方法传入页面的脚本。
     * 若要解除拦截，可通过\`removeJsonphook\`取消拦截，参数为本方法返回的id。
     * @param url 需要拦截的脚本的src匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param redirect 替换src的回调函数，将原src作为第一个参数，必须同步返回重定向的src。
     * @param text 要以内联脚本形式替换的回调函数，将原src作为第一个参数，必须同步返回替换的代码文本。本参数的存在将导致\`redirect\`被忽略。
     * @returns 注册编号，可用于取消拦截。
     */
    function scriptIntercept(url, redirect, text) {
        const one = Array.isArray(url) ? url : [url];
        const two = function () {
            try {
                if (text) {
                    this.text = text(this.src);
                    this.removeAttribute("src");
                    setTimeout(() => {
                        this.dispatchEvent(new ProgressEvent("load"));
                        this?.remove();
                    }, 100);
                }
                else if (redirect) {
                    this.src = redirect(this.src);
                }
            }
            catch (e) {
                API.debug.error("scriptIntercept", one, e);
            }
        };
        return jsonp.push([one, two]);
    }
    API.scriptIntercept = scriptIntercept;
    /**
     * 取消jsonphook或脚本拦截，只在注册时设置了\`once=false\`时才需要使用本方法！
     * @param id 要取消注册的id，该值为注册时返回值，一个id只允许使用一次！
     */
    function removeJsonphook(id) {
        id >= 0 && delete jsonp[id - 1];
    }
    API.removeJsonphook = removeJsonphook;

//# sourceURL=file://@Bilibili-Old/include/hook/Node.js`;
/*!***********************!*/
/**/modules["open.js"] = /*** ./src/include/hook/open.js ***/
`
    const rules = [];
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...rest) {
        const args = [...rest];
        args[1] && rules.forEach(d => {
            d && d[0].every(d => args[1].includes(d)) && d[1].call(this, args);
        });
        return open.call(this, ...args);
    };
    /**
     * 注册拦截修改xhr，本方法必须传入同步返回的回调函数，要使用异步回调请考虑左转\`xhrhookasync\`。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param modifyOpen 修改XMLHttpRequest.open参数的回调函数，第一个参数为数组，包含原xhr的open方法传递的所有参数，其中索引2位置上就是原url。
     * @param modifyResponse 修改XMLHttpRequest返回值的回调函数，第一个参数为一个对象，可能包含response、responseType、responseText、responseXML中的一种或多种原始数据，可以在其基础上进行修改并赋值回去，**注意每种返回值的格式！**
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递\`false\`，然后自行在不再需要拦截后使用\`removeXhrhook\`注销。
     * @returns 注册编号，\`once=false\`时才有用，用于使用\`removeXhrhook\`取消拦截。
     */
    function xhrhook(url, modifyOpen, modifyResponse, once = true) {
        let id;
        const one = Array.isArray(url) ? url : [url];
        const two = function (args) {
            once && id && delete rules[id - 1];
            if (modifyOpen)
                try {
                    modifyOpen(args);
                }
                catch (e) {
                    API.debug.error("modifyOpen of xhrhook", one, e);
                }
            if (modifyResponse)
                try {
                    this.addEventListener("readystatechange", () => {
                        try {
                            if (this.readyState === 4) {
                                const response = { response: this.response, responseType: this.responseType, status: this.status, statusText: this.statusText };
                                (this.responseType === "" || this.responseType === "text") && (response.responseText = this.responseText);
                                (this.responseType === "" || this.responseType === "document") && (response.responseXML = this.responseXML);
                                modifyResponse(response);
                                Object.defineProperty(this, "response", { configurable: true, value: response.response });
                                response.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: response.responseText });
                                response.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: response.responseXML });
                            }
                        }
                        catch (e) {
                            API.debug.error("modifyResponse of xhrhook", one, e);
                        }
                    });
                }
                catch (e) {
                    API.debug.error("modifyResponse of xhrhook", one, e);
                }
        };
        return id = rules.push([one, two]);
    }
    API.xhrhook = xhrhook;
    /**
     * \`xhrhook\`的异步版本，可以用异步方法获取到的返回值替换xhr请求返回值。
     * 本方法或阻断原xhr请求，您可以在\`condition\`根据url等信息进一步判定是否真的需要拦截。
     * 注意部分xhr请求可能有额外的超时判定，所以\`modifyResponse\`修改未必会生效。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param condition 二次判定**同步**回调函数，不提供或者返回真值时开始拦截，可以通过url等精确判定是否真要拦截。
     * @param modifyResponse 提供XMLHttpRequest返回值的回调函数，第一个参数为数组，包含原xhr的open方法传递的所有参数，其中索引2位置上就是原url。请以XMLHttpRequestResponses格式提供返回值，第二个参数为responseType类型，你可以据此确定需要哪些返回值，**注意每种返回值的格式！**。如果处理出错，可将默认值以异常或\`Promise.reject\`形式抛出。
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递\`false\`，然后自行在不再需要拦截后使用\`removeXhrhook\`注销。
     * @returns 注册编号，\`once=false\`时才有用，用于使用\`removeXhrhook\`取消拦截。
     */
    function xhrhookAsync(url, condition, modifyResponse, once = true) {
        let id, temp;
        const one = Array.isArray(url) ? url : [url];
        const two = function (args) {
            try {
                if (!condition || condition(args)) {
                    this.xhrhookTimes = this.xhrhookTimes ? this.xhrhookTimes++ : 1; // 同意实例拦截次数
                    id && (temp = rules[id - 1]); // 临时移除同条件URL的hook，避免代理中使用了同url造成死循环
                    delete rules[id - 1];
                    this.send = () => true; // 禁用XMLHttpRequest.send
                    (!args[2] || args[2] === true) && (this.timeout = 0); // 禁用超时
                    const et = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")); }, 50);
                    Object.defineProperty(this, "status", { configurable: true, value: 200 });
                    Object.defineProperty(this, "readyState", { configurable: true, value: 2 });
                    this.dispatchEvent(new ProgressEvent("readystatechange"));
                    modifyResponse ? modifyResponse(args, this.responseType).then(d => {
                        clearInterval(et);
                        if (d) {
                            Object.defineProperty(this, "response", { configurable: true, value: d.response });
                            d.responseType && Object.defineProperty(this, "responseType", { configurable: true, value: d.responseType });
                            d.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
                            d.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
                            !this.responseURL && Object.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
                            Object.defineProperty(this, "readyState", { configurable: true, value: 4 });
                            this.dispatchEvent(new ProgressEvent("readystatechange"));
                            this.dispatchEvent(new ProgressEvent("load"));
                            this.dispatchEvent(new ProgressEvent("loadend"));
                        }
                    }).catch(d => {
                        if (this.xhrhookTimes === 1) {
                            if (d && d.response) { // 抛出的返回值有效，作为默认值还给调用处
                                Object.defineProperty(this, "response", { configurable: true, value: d.response });
                                d.responseType && Object.defineProperty(this, "responseType", { configurable: true, value: d.responseType });
                                d.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
                                d.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
                                !this.responseURL && Object.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
                                Object.defineProperty(this, "readyState", { configurable: true, value: 4 });
                                this.dispatchEvent(new ProgressEvent("readystatechange"));
                                this.dispatchEvent(new ProgressEvent("load"));
                                this.dispatchEvent(new ProgressEvent("loadend"));
                            }
                            else { // 抛出返回值无效，通知xhr事件
                                this.dispatchEvent(new ProgressEvent("error"));
                            }
                        }
                        else { // xhr被其他hook处理中，此处不做任何处理
                            this.xhrhookTimes--;
                        }
                        API.debug.error("modifyResponse of xhrhookasync", one, d);
                    }).finally(() => {
                        clearInterval(et);
                        !once && (id = rules.push(temp)); // 恢复多次监听
                    }) : (this.abort(), !once && (id = rules.push(temp)));
                    clearInterval(et);
                }
            }
            catch (e) {
                API.debug.error("condition of xhrhook", one, e);
            }
        };
        return id = rules.push([one, two]);
    }
    API.xhrhookAsync = xhrhookAsync;
    /**
     * 注销xhrhook以节约开销，只在注册时设置了\`once=false\`时才需要使用本方法！
     * @param id \`xhrhook\`注册时的返回值，一个id只允许使用一次！
     */
    function removeXhrhook(id) { id >= 0 && delete rules[id - 1]; }
    API.removeXhrhook = removeXhrhook;
    /**
     * \`xhrhook\`高级版本，用于另外两种封装的hook方法实现不了的操作，通过modify回调理论上可以实现任何xhrhook操作。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param modify 实现hook的回调函数，\`this\`和第一个参数为该XMLHttpRequest实例，第二个参数为传递给实例open方法的参数序列。
     * @returns 注册编号，用于使用\`removeXhrhook\`取消拦截。
     */
    function xhrhookUltra(url, modify) {
        const one = Array.isArray(url) ? url : [url];
        const two = function (args) {
            try {
                modify.call(this, this, args);
            }
            catch (e) {
                API.debug.error("xhrhook modify", one, modify, e);
            }
        };
        return rules.push([one, two]);
    }
    API.xhrhookUltra = xhrhookUltra;

//# sourceURL=file://@Bilibili-Old/include/hook/open.js`;
/*!***********************!*/
/**/modules["webpackJsonp.js"] = /*** ./src/include/hook/webpackJsonp.js ***/
`
    /** 暂存 */
    let hook;
    const arr = [];
    const param = [];
    Object.defineProperty(window, "webpackJsonp", {
        set: v => hook = v,
        get: () => {
            if (hook) {
                if (API.isArray(hook))
                    return hook;
                return (chunkIds, moreModules, executeModules) => {
                    if (arr[moreModules.length]) {
                        const obj = arr[moreModules.length];
                        const pam = param[moreModules.length];
                        Object.entries(obj).forEach(d => {
                            let code = moreModules[d[0]];
                            if (code) {
                                code = code.toString();
                                d[1].forEach(e => code = e(code));
                                moreModules[d[0]] = new Function(pam[0], pam[1], pam[2], \`(\${code})(\${pam[0]},\${pam[1]},\${pam[2]})\`);
                            }
                        });
                    }
                    return hook(chunkIds, moreModules, executeModules);
                };
            }
        },
        configurable: true
    });
    /**
     * hook webpack打包的代码并进行修复
     * @param len 索引总长度，用于唯一定位该脚本
     * @param pos 要修复的代码所在索引
     * @param rpc 修复代码的回调函数，原代码以字符串形式传入，请修改后仍以字符串返回
     * @param params 源代码函数的参数名称序列
     */
    function webpackhook(len, pos, rpc, params = ["t", "e", "i"]) {
        if (!arr[len]) {
            arr[len] = {};
            param[len] = params;
        }
        arr[len][pos] = arr[len][pos] || [];
        arr[len][pos].push((code) => rpc(code));
    }
    API.webpackhook = webpackhook;

//# sourceURL=file://@Bilibili-Old/include/hook/webpackJsonp.js`;
/*!***********************!*/
/**/modules["abv.js"] = /*** ./src/include/lib/abv.js ***/
`
// @see mcfx的回答（Python） {@link https://www.zhihu.com/question/381784377/answer/1099438784}
    class Abv {
        constructor() {
            this.base58Table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            this.digitMap = [11, 10, 3, 8, 4, 6];
            this.xor = 177451812;
            this.add = 8728348608;
            this.bvidTemplate = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
            this.table = {};
            for (let i = 0; i < 58; i++)
                this.table[this.base58Table[i]] = i;
        }
        /**
         * av/BV互转
         * @param input av或BV，可带av/BV前缀
         * @returns 转化结果
         */
        check(input) {
            if (/^[aA][vV][0-9]+\$/.test(String(input)) || /^\\d+\$/.test(String(input)))
                return this.avToBv(Number(/[0-9]+/.exec(String(input))[0]));
            if (/^1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}\$/.test(String(input)))
                return this.bvToAv("BV" + input);
            if (/^[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}\$/.test(String(input)))
                return this.bvToAv(String(input));
            throw input;
        }
        bvToAv(BV) {
            let r = 0;
            for (let i = 0; i < 6; i++)
                r += this.table[BV[this.digitMap[i]]] * 58 ** i;
            return (r - this.add) ^ this.xor;
        }
        avToBv(av) {
            let bv = Array.from(this.bvidTemplate);
            av = (av ^ this.xor) + this.add;
            for (let i = 0; i < 6; i++)
                bv[this.digitMap[i]] = this.base58Table[parseInt(String(av / 58 ** i)) % 58];
            return bv.join("");
        }
    }
    /**
     * av <=> BV
     * @param input av/BV
     * @returns BV/aid
     * @example
     * abv(170001) // BV17x411w7KC
     * abv("av170001") // BV17x411w7KC
     * abv("AV170001") // BV17x411w7KC
     * abv("BV17x411w7KC") // 170001
     * abv("17x411w7KC") // 170001
     */
    function abv(input) {
        return new Abv().check(input);
    }
    API.abv = abv;

//# sourceURL=file://@Bilibili-Old/include/lib/abv.js`;
/*!***********************!*/
/**/modules["Base64.js"] = /*** ./src/include/lib/Base64.js ***/
`
// @see MDN_Web_Docs {@link https://developer.mozilla.org/en-US/docs/Glossary/Base64}
    /** Base64编解码工具。 */
    class Base64 {
        /**
         * Base64编码
         * @param str 原始字符串
         * @returns 编码结果
         */
        static encode(str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode(('0x' + p1));
            }));
        }
        /**
         * Base64解码
         * @param str 原始字符串
         * @returns 解码结果
         */
        static decode(str) {
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
    }
    API.Base64 = Base64;

//# sourceURL=file://@Bilibili-Old/include/lib/Base64.js`;
/*!***********************!*/
/**/modules["crc32.js"] = /*** ./src/include/lib/crc32.js ***/
`
// @see MoePus {@link https://moepus.oicp.net/2016/11/27/crccrack}
// @see esterTion {@link https://github.com/esterTion/BiliBili_crc2mid}
// @license GFUL
    class Midcrc {
        constructor() {
            this.CRCPOLYNOMIAL = 0xEDB88320;
            this.crctable = new Array(256);
            this.index = new Array(4);
            this.create_table();
        }
        /**
         * @param input 输入crc32散列值
         * @returns 逆向出的mid值
         */
        run(input) {
            let ht = parseInt('0x' + input) ^ 0xffffffff, snum, i, lastindex, deepCheckData;
            for (i = 3; i >= 0; i--) {
                this.index[3 - i] = this.getcrcindex(ht >>> (i * 8));
                snum = this.crctable[this.index[3 - i]];
                ht ^= snum >>> ((3 - i) * 8);
            }
            for (i = 0; i < 10000000; i++) {
                lastindex = this.crc32lastindex(i);
                if (lastindex == this.index[3]) {
                    deepCheckData = this.deepCheck(i, this.index);
                    if (deepCheckData[0])
                        break;
                }
            }
            if (i == 10000000)
                return -1;
            return Number(i + '' + deepCheckData[1]);
        }
        create_table() {
            let crcreg, i, j;
            for (i = 0; i < 256; ++i) {
                crcreg = i;
                for (j = 0; j < 8; ++j) {
                    if ((crcreg & 1) !== 0) {
                        crcreg = this.CRCPOLYNOMIAL ^ (crcreg >>> 1);
                    }
                    else {
                        crcreg >>>= 1;
                    }
                }
                this.crctable[i] = crcreg;
            }
        }
        crc32(input) {
            if (typeof (input) != 'string')
                input = input.toString();
            let crcstart = 0xFFFFFFFF, len = input.length, index;
            for (let i = 0; i < len; ++i) {
                index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                crcstart = (crcstart >>> 8) ^ this.crctable[index];
            }
            return crcstart;
        }
        crc32lastindex(input) {
            if (typeof (input) != 'string')
                input = input.toString();
            let crcstart = 0xFFFFFFFF, len = input.length, index;
            for (let i = 0; i < len; ++i) {
                index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                crcstart = (crcstart >>> 8) ^ this.crctable[index];
            }
            return index;
        }
        getcrcindex(t) {
            for (let i = 0; i < 256; i++)
                if (this.crctable[i] >>> 24 == t)
                    return i;
            return -1;
        }
        deepCheck(i, index) {
            let tc = 0x00, str = '', hash = this.crc32(i);
            tc = hash & 0xff ^ index[2];
            if (!(tc <= 57 && tc >= 48))
                return [0];
            str += tc - 48;
            hash = this.crctable[index[2]] ^ (hash >>> 8);
            tc = hash & 0xff ^ index[1];
            if (!(tc <= 57 && tc >= 48))
                return [0];
            str += tc - 48;
            hash = this.crctable[index[1]] ^ (hash >>> 8);
            tc = hash & 0xff ^ index[0];
            if (!(tc <= 57 && tc >= 48))
                return [0];
            str += tc - 48;
            hash = this.crctable[index[0]] ^ (hash >>> 8);
            return [1, str];
        }
    }
    const crc = new Midcrc();
    /**
     * 逆向弹幕散列值到uid
     * @param input 输入crc32散列值
     * @returns 逆向出的mid值
     */
    function midcrc(input) { return crc.run(input); }
    API.midcrc = midcrc;
    /**
     * 求字符串的crc32散列
     * @param input 输入字符串
     * @returns crc32散列
     */
    function crc32(input) { return (((crc.crc32(input) + 1) * -1) >>> 0).toString(16); }
    API.crc32 = crc32;

//# sourceURL=file://@Bilibili-Old/include/lib/crc32.js`;
/*!***********************!*/
/**/modules["cubicBezier.js"] = /*** ./src/include/lib/cubicBezier.js ***/
`
    const NEWTON_ITERATIONS = 4;
    const NEWTON_MIN_SLOPE = 0.001;
    const SUBDIVISION_PRECISION = 0.0000001;
    const SUBDIVISION_MAX_ITERATIONS = 10;
    const kSplineTableSize = 11;
    const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
    const float32ArraySupported = typeof Float32Array === 'function';
    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1) { return 3.0 * aA1; }
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }
    function binarySubdivide(aX, aA, aB, mX1, mX2) {
        let currentX, currentT, i = 0;
        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            }
            else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
        return currentT;
    }
    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
            const currentSlope = getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) {
                return aGuessT;
            }
            const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }
    function LinearEasing(x) {
        return x;
    }
    /** 贝塞尔曲线 */
    function bezier(mX1, mY1, mX2, mY2) {
        if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
            throw new Error('bezier x values must be in [0, 1] range');
        }
        if (mX1 === mY1 && mX2 === mY2) {
            return LinearEasing;
        }
        // Precompute samples table
        const sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
        for (let i = 0; i < kSplineTableSize; ++i) {
            sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
        function getTForX(aX) {
            let intervalStart = 0.0;
            let currentSample = 1;
            const lastSample = kSplineTableSize - 1;
            for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }
            --currentSample;
            // Interpolate to provide an initial guess for t
            const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
            const guessForT = intervalStart + dist * kSampleStepSize;
            const initialSlope = getSlope(guessForT, mX1, mX2);
            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
            }
            else if (initialSlope === 0.0) {
                return guessForT;
            }
            else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
            }
        }
        return function BezierEasing(x) {
            // Because JavaScript number are imprecise, we should guarantee the extremes are right.
            if (x === 0 || x === 1) {
                return x;
            }
            return calcBezier(getTForX(x), mY1, mY2);
        };
    }
    API.bezier = bezier;

//# sourceURL=file://@Bilibili-Old/include/lib/cubicBezier.js`;
/*!***********************!*/
/**/modules["md5.js"] = /*** ./src/include/lib/md5.js ***/
`
// @see js-md5 {@link https://github.com/emn178/js-md5}
// @license MIT
    const ERROR = 'input is invalid type';
    const ARRAY_BUFFER = true;
    const HEX_CHARS = '0123456789abcdef'.split('');
    const EXTRA = [128, 32768, 8388608, -2147483648];
    const SHIFT = [0, 8, 16, 24];
    const OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];
    const BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    let buffer = new ArrayBuffer(68), blocks = new Uint32Array(buffer), buffer8 = new Uint8Array(buffer);
    let createOutputMethod = function (outputType) {
        return function (message) {
            return new Md5(true).update(message)[outputType]();
        };
    };
    let createMethod = function () {
        let method = createOutputMethod('hex');
        method.create = function () {
            return new Md5();
        };
        method.update = function (message) {
            return method.create().update(message);
        };
        for (let i = 0; i < OUTPUT_TYPES.length; ++i) {
            let type = OUTPUT_TYPES[i];
            method[type] = createOutputMethod(type);
        }
        return method;
    };
    class Md5 {
        constructor(sharedMemory) {
            this.buffer8 = new Uint8Array();
            this.h0 = 0;
            this.h1 = 0;
            this.h2 = 0;
            this.h3 = 0;
            this.start = 0;
            this.bytes = 0;
            this.hBytes = 0;
            this.finalized = false;
            this.hashed = false;
            this.first = true;
            this.lastByteIndex = 0;
            if (sharedMemory) {
                blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                    blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                            blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                this.blocks = blocks;
                this.buffer8 = buffer8;
            }
            else {
                if (ARRAY_BUFFER) {
                    let buffer = new ArrayBuffer(68);
                    this.buffer8 = new Uint8Array(buffer);
                    this.blocks = new Uint32Array(buffer);
                }
                else {
                    this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                }
            }
            this.toString = this.hex;
            this.array = this.digest;
            this.buffer = this.arrayBuffer;
        }
        update(message) {
            if (this.finalized) {
                return;
            }
            message = typeof message === 'number' ? message + '' : message;
            let notString, type = typeof message;
            if (type !== 'string') {
                if (type === 'object') {
                    if (message === null) {
                        throw ERROR;
                    }
                    else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                        message = new Uint8Array(message);
                    }
                    else if (!Array.isArray(message)) {
                        if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                            throw ERROR;
                        }
                    }
                }
                else {
                    throw ERROR;
                }
                notString = true;
            }
            let code, index = 0, i, length = message.length, blocks = this.blocks;
            let buffer8 = this.buffer8;
            while (index < length) {
                if (this.hashed) {
                    this.hashed = false;
                    blocks[0] = blocks[16];
                    blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                            blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                                blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                }
                if (notString) {
                    if (ARRAY_BUFFER) {
                        for (i = this.start; index < length && i < 64; ++index) {
                            buffer8[i++] = message[index];
                        }
                    }
                    else {
                        for (i = this.start; index < length && i < 64; ++index) {
                            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                        }
                    }
                }
                else {
                    if (ARRAY_BUFFER) {
                        for (i = this.start; index < length && i < 64; ++index) {
                            code = message.charCodeAt(index);
                            if (code < 0x80) {
                                buffer8[i++] = code;
                            }
                            else if (code < 0x800) {
                                buffer8[i++] = 0xc0 | (code >> 6);
                                buffer8[i++] = 0x80 | (code & 0x3f);
                            }
                            else if (code < 0xd800 || code >= 0xe000) {
                                buffer8[i++] = 0xe0 | (code >> 12);
                                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                                buffer8[i++] = 0x80 | (code & 0x3f);
                            }
                            else {
                                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                                buffer8[i++] = 0xf0 | (code >> 18);
                                buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
                                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                                buffer8[i++] = 0x80 | (code & 0x3f);
                            }
                        }
                    }
                    else {
                        for (i = this.start; index < length && i < 64; ++index) {
                            code = message.charCodeAt(index);
                            if (code < 0x80) {
                                blocks[i >> 2] |= code << SHIFT[i++ & 3];
                            }
                            else if (code < 0x800) {
                                blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                            }
                            else if (code < 0xd800 || code >= 0xe000) {
                                blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                            }
                            else {
                                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                                blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                            }
                        }
                    }
                }
                this.lastByteIndex = i;
                this.bytes += i - this.start;
                if (i >= 64) {
                    this.start = i - 64;
                    this.hash();
                    this.hashed = true;
                }
                else {
                    this.start = i;
                }
            }
            if (this.bytes > 4294967295) {
                this.hBytes += this.bytes / 4294967296 << 0;
                this.bytes = this.bytes % 4294967296;
            }
            return this;
        }
        finalize() {
            if (this.finalized) {
                return;
            }
            this.finalized = true;
            let blocks = this.blocks, i = this.lastByteIndex;
            blocks[i >> 2] |= EXTRA[i & 3];
            if (i >= 56) {
                if (!this.hashed) {
                    this.hash();
                }
                blocks[0] = blocks[16];
                blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                    blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                            blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            }
            blocks[14] = this.bytes << 3;
            blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
            this.hash();
        }
        hash() {
            let a, b, c, d, bc, da, blocks = this.blocks;
            if (this.first) {
                a = blocks[0] - 680876937;
                a = (a << 7 | a >>> 25) - 271733879 << 0;
                d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
                d = (d << 12 | d >>> 20) + a << 0;
                c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;
                c = (c << 17 | c >>> 15) + d << 0;
                b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;
                b = (b << 22 | b >>> 10) + c << 0;
            }
            else {
                a = this.h0;
                b = this.h1;
                c = this.h2;
                d = this.h3;
                a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;
                a = (a << 7 | a >>> 25) + b << 0;
                d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;
                d = (d << 12 | d >>> 20) + a << 0;
                c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;
                c = (c << 17 | c >>> 15) + d << 0;
                b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;
                b = (b << 22 | b >>> 10) + c << 0;
            }
            a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;
            b = (b << 22 | b >>> 10) + c << 0;
            a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;
            b = (b << 22 | b >>> 10) + c << 0;
            a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;
            b = (b << 22 | b >>> 10) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;
            b = (b << 20 | b >>> 12) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;
            b = (b << 20 | b >>> 12) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;
            b = (b << 20 | b >>> 12) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;
            b = (b << 20 | b >>> 12) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[5] - 378558;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[8] - 2022574463;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[11] + 1839030562;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[14] - 35309556;
            b = (b << 23 | b >>> 9) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[1] - 1530992060;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[4] + 1272893353;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[7] - 155497632;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[10] - 1094730640;
            b = (b << 23 | b >>> 9) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[13] + 681279174;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[0] - 358537222;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[3] - 722521979;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[6] + 76029189;
            b = (b << 23 | b >>> 9) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[9] - 640364487;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[12] - 421815835;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[15] + 530742520;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[2] - 995338651;
            b = (b << 23 | b >>> 9) + c << 0;
            a += (c ^ (b | ~d)) + blocks[0] - 198630844;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[5] - 57434055;
            b = (b << 21 | b >>> 11) + c << 0;
            a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[10] - 1051523;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
            b = (b << 21 | b >>> 11) + c << 0;
            a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[15] - 30611744;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
            b = (b << 21 | b >>> 11) + c << 0;
            a += (c ^ (b | ~d)) + blocks[4] - 145523070;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[2] + 718787259;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[9] - 343485551;
            b = (b << 21 | b >>> 11) + c << 0;
            if (this.first) {
                this.h0 = a + 1732584193 << 0;
                this.h1 = b - 271733879 << 0;
                this.h2 = c - 1732584194 << 0;
                this.h3 = d + 271733878 << 0;
                this.first = false;
            }
            else {
                this.h0 = this.h0 + a << 0;
                this.h1 = this.h1 + b << 0;
                this.h2 = this.h2 + c << 0;
                this.h3 = this.h3 + d << 0;
            }
        }
        hex() {
            this.finalize();
            let h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
            return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
                HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
                HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
                HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
                HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
                HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
                HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
                HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
                HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
                HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
                HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
                HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
                HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
                HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
                HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
                HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
        }
        digest() {
            this.finalize();
            let h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
            return [
                h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 24) & 0xFF,
                h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 24) & 0xFF,
                h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 24) & 0xFF,
                h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 24) & 0xFF
            ];
        }
        arrayBuffer() {
            this.finalize();
            let buffer = new ArrayBuffer(16);
            let blocks = new Uint32Array(buffer);
            blocks[0] = this.h0;
            blocks[1] = this.h1;
            blocks[2] = this.h2;
            blocks[3] = this.h3;
            return buffer;
        }
        base64() {
            let i, v1, v2, v3, base64Str = '', bytes = this.array();
            for (i = 0; i < 15;) {
                v1 = bytes[i++];
                v2 = bytes[i++];
                v3 = bytes[i++];
                base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
                    BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +
                    BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +
                    BASE64_ENCODE_CHAR[v3 & 63];
            }
            v1 = bytes[i];
            base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
                BASE64_ENCODE_CHAR[(v1 << 4) & 63] +
                '==';
            return base64Str;
        }
    }
    /**
     * 获取md5哈希值
     * 函数属性上还有其他类型md5值获取方法，返回值参考其名，如\`md5.hex()\`
     * @param str 字符串输入
     * @returns md5输出
     * @example
     * md5("Bilibili") // fb5bebe1b7df48e6606fdffed2cf8b14
     * API.md5.array("Bilibili") // [251, 91, 235, 225, 183, 223, 72, 230, 96, 111, 223, 254, 210, 207, 139, 20]
     * API.md5.buffer("Bilibili") // ArrayBuffer(16)
     * API.md5.base64("Bilibili") // +1vr4bffSOZgb9/+0s+LFA==
     */
    API.md5 = createMethod();

//# sourceURL=file://@Bilibili-Old/include/lib/md5.js`;
/*!***********************!*/
/**/modules["proxyHandler.js"] = /*** ./src/include/lib/proxyHandler.js ***/
`
    function get(t, p, r) {
        try {
            return Reflect.get(t, p, r);
        }
        catch (e) {
            return t[p];
        }
    }
    class ProxyHandler {
        /**
         * 代理深层对象及数组
         * @param callback 数据变动时回调
         */
        constructor(callback) {
            return {
                deleteProperty: (target, key) => {
                    Promise.resolve().then(() => callback());
                    return Reflect.deleteProperty(target, key);
                },
                get: (target, key, receiver) => {
                    const res = get(target, key, receiver);
                    const targetIsArray = API.isArray(res);
                    // 代理对象及数组
                    if (API.isObject(res) || targetIsArray) {
                        return new Proxy(res, new ProxyHandler(callback));
                    }
                    return res;
                },
                set: (target, key, value, receiver) => {
                    value !== get(target, key, receiver) && Promise.resolve().then(() => callback());
                    return Reflect.set(target, key, value, receiver);
                }
            };
        }
    }
    API.ProxyHandler = ProxyHandler;

//# sourceURL=file://@Bilibili-Old/include/lib/proxyHandler.js`;
/*!***********************!*/
/**/modules["sign.js"] = /*** ./src/include/lib/sign.js ***/
`
    class Sign {
        /**
         * 签名URL
         * @param url 原URL
         * @param obj 添加到URL上的查询参数对象，可选
         * @param id appkey在\`keySecret\`中的索引
         * @returns 签名后的URL
         */
        static sign(url, obj = {}, id = 0) {
            this.keySecret = this.decode(id);
            obj = { ...API.urlObj(url), ...obj };
            url = url.split("#")[0].split("?")[0];
            delete obj.sign;
            obj.appkey = this.keySecret[0];
            const table = Object.keys(obj).sort().reduce((s, d) => {
                s[d] = obj[d];
                return s;
            }, {});
            table.sign = id === 3 && table.api ? (API.md5(API.objUrl("", { api: decodeURIComponent(table.api) }) + this.keySecret[1])) : (API.md5(API.objUrl("", table) + this.keySecret[1]));
            return API.objUrl(url, table);
        }
        /**
         * 提取appkey和盐
         * @param id appkey在\`keySecret\`中的索引
         * @returns [appkey, sort]
         */
        static decode(id) {
            if (typeof id === "number") {
                id = id < this.table.length ? id : 0;
                return this.table[id].split("").reverse().reduce((s, d) => {
                    s = s + String.fromCharCode(d.charCodeAt(0) + 2);
                    return s;
                }, '').split(":");
            }
            else {
                return [id, this.list()[id]];
            }
        }
        /**
         * 生成\`keySecret\`池
         * @param key appkey
         * @param secret appkey对应的盐
         * @returns 混淆后的字符串
         */
        static encode(key, secret) {
            return (key + ":" + secret).split("").reverse().reduce((s, d) => {
                s = s + String.fromCharCode(d.charCodeAt(0) - 2);
                return s;
            }, "");
        }
        /**
         * 输出\`keySecret\`池对象
         * @returns \`keySecret\`池对象
         */
        static list() {
            return this.table.reduce((s, d, i) => {
                let keySecret = this.decode(i);
                s[keySecret[0]] = keySecret[1];
                return s;
            }, {});
        }
    }
    Sign.table = [
        "rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg",
        "/a_206b\`_.61.bca6117.175bcdadc41850c010c..././1\`\`",
        "157bdd\`6/bc73632.bcd660baa03a.43841211032b5c4\`6b/",
        "351a7a6b/.b\`d77da1cdccc25_13bc0a81a6d63.7ad13\`c50",
        "4_/54d\`3_4_73..2c42\`d4.a3__31b358d706d\`._7a.3_b5.",
        "12a.7c4b76c.a\`12bb4\`2b2b275c667c85b6d\`c_c\`0d5.051",
        "bb16d652\`04.7/121d3474b_2.c12\`7386\`0/bdd6ca0c7.22",
        "244_530/7/.ab\`7.//22a15572502b_08c21./_.\`3164\`c36",
        "16_d52_d/d22_2c0a.6573355/b\`./bd8a\`bc6114a30_4.\`d",
        "c02ba/d6.33d05cb/5d34.7d_23_\`_2785\`c60.a\`.4343726",
        "2aa2\`.1_\`_1.73\`.70.67d.bc671c16382a3d\`71a4.bcb3c7",
        "c4_a.7562_15\`_a416a/63/c2cbcb\`308d706d\`._7a.3_b5.",
        "40/171b046c/bcc0a603ac620\`372ba_8a/\`//41b30376.b5" // 7d08...1b1c
    ];
    /**
     * 签名URL
     * @param url 原URL
     * @param obj 添加到URL上的查询参数对象
     * @param id appkey在\`keySecret\`中的索引
     * @returns 签名后的URL
     */
    API.urlsign = (url, obj = {}, id = 0) => Sign.sign(url, obj, id);
    /**
     * 提取appkey和盐
     * @param id appkey在\`keySecret\`中的索引
     * @returns [appkey, sort]
     */
    API.urlsign.getKeyById = (id) => Sign.decode(id);
    /**
     * 生成\`keySecret\`池
     * @param key appkey
     * @param secret 盐
     * @returns 混淆后的字符串
     */
    API.urlsign.encode = (key, secret) => Sign.encode(key, secret);
    /**
     * 输出\`keySecret\`池对象
     * @returns \`keySecret\`池对象
     */
    API.urlsign.list = () => Sign.list();

//# sourceURL=file://@Bilibili-Old/include/lib/sign.js`;
/*!***********************!*/
/**/modules["typeof.js"] = /*** ./src/include/lib/typeof.js ***/
`
// @see vuejs {@link https://github.com/vuejs/core/blob/main/packages/shared/src/index.ts}
// @license MIT
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    API.hasOwn = (val, key) => hasOwnProperty.call(val, key);
    API.isArray = Array.isArray;
    API.isMap = (val) => API.toTypeString(val) === '[object Map]';
    API.isSet = (val) => API.toTypeString(val) === '[object Set]';
    API.isDate = (val) => val instanceof Date;
    API.isFunction = (val) => typeof val === 'function';
    API.isString = (val) => typeof val === 'string';
    API.isSymbol = (val) => typeof val === 'symbol';
    API.isObject = (val) => val !== null && typeof val === 'object';
    API.isPromise = (val) => {
        return API.isObject(val) && API.isFunction(val.then) && API.isFunction(val.catch);
    };
    API.objectToString = Object.prototype.toString;
    API.toTypeString = (value) => API.objectToString.call(value);
    API.toRawType = (value) => {
        // extract "RawType" from strings like "[object RawType]"
        return API.toTypeString(value).slice(8, -1);
    };

//# sourceURL=file://@Bilibili-Old/include/lib/typeof.js`;
/*!***********************!*/
/**/modules["config.js"] = /*** ./src/include/storage/config.js ***/
`
    const CONFIG = GM.GM_getValue("config", {});
    /** 计时器id */
    let timer;
    /** 保存设置 */
    function saveConfig() {
        clearTimeout(timer);
        timer = setTimeout(() => GM.GM_setValue("config", JSON.parse(JSON.stringify(CONFIG))), 1e3);
    }
    API.saveConfig = saveConfig;
    API.config = new Proxy(CONFIG, {
        set: (t, p, v) => {
            Reflect.set(t, p, v);
            saveConfig();
            return true;
        },
        get: (t, p, r) => {
            const result = t[p];
            return (API.isArray(result) || API.isObject(result)) ? new Proxy(result, new API.ProxyHandler(saveConfig)) : result;
        }
    });
    /** upos服务器 */
    const UPOS = ['ks3（金山）', 'ks3b（金山）', 'ks3c（金山）', 'ks32（金山）', 'kodo（七牛）', 'kodob（七牛）', 'cos（腾讯）', 'cosb（腾讯）', 'coso1（腾讯）', 'coso2（腾讯）', 'bos（腾讯）', 'hw（华为）', 'hwb（华为）', 'uphw（华为）', 'js（华为）', 'hk（香港）', 'akamai（海外）'];
    API.registerMenu([
        { key: "common", name: "通用", svg: API.getModule("wrench.svg") },
        { key: "rewrite", name: "重构", svg: API.getModule("note.svg") },
        { key: "danmaku", name: "弹幕", svg: API.getModule("dmset.svg") },
        { key: "restore", name: "修复", svg: API.getModule("stethoscope.svg") },
        { key: "player", name: "播放", svg: API.getModule("play.svg") },
        { key: "style", name: "样式", svg: API.getModule("palette.svg") },
        { key: "live", name: "直播", svg: API.getModule("bioscope.svg") },
        { key: "download", name: "下载", svg: API.getModule("download.svg") }
    ]);
    API.registerSetting([
        {
            key: "developer",
            menu: "common",
            label: "开发者模式",
            svg: API.getModule("warn.svg"),
            type: "switch",
            value: false,
            float: \`暴露顶层命名空间到全局，变量名API，挂载有脚本导出的所有接口，可以在全局作用域中使用，方便进行调试等操作。\`,
            sub: "暴露顶层命名空间",
            callback: v => {
                v ? (!window.API && (window.API = API)) : (window.API && Reflect.deleteProperty(window, "API"));
            }
        },
        {
            key: "settingEntryType",
            menu: "common",
            label: "贴边隐藏设置入口",
            svg: API.getModule("gear.svg"),
            type: "switch",
            value: false,
            sub: '右下角贴边隐藏',
            float: '原滋原味保护旧版页面，不添加、修改或删除任何元素是本脚本的终极追求。<br>开启后将贴边隐藏设置入口，页面加载完成时也不会有任何提示，需要将鼠标移动到页面右下角以上一定感应区域才会显现。<br>※ <strong>Firefox用户切莫开启！</strong>',
            callback: () => {
                API.showSettingEntry();
            }
        },
        {
            key: "logReport",
            menu: "common",
            label: "日志拦截",
            svg: API.getModule("linechart.svg"),
            sub: "拦截B站日志上报",
            float: "网页端日志采集太频繁，稍微动下鼠标都要发送数条日志请求，给调试工作带来额外的困扰，所以一股脑都屏蔽了干净。<br>ps：APP端其实日志更多，只能说眼不见为净吧~",
            type: "switch",
            value: false
        },
        {
            key: "trusteeship",
            menu: "common",
            label: "托管原生脚本",
            svg: API.getModule("migrate.svg"),
            sub: "代为修复和维护",
            float: '托管修复后的原生脚本，很多功能依赖此基础，如非必要请不要关闭。<br>由于jsdelivr CDN被墙，托管资源加载不正常时请临时关闭。',
            type: "switch",
            value: true,
            callback: v => {
                if (v) {
                    let isReadry = false;
                    ["bilibiliPlayer.js", "comment.js"].forEach(d => {
                        isReadry = GM.GM_getResourceText(d) ? true : false;
                    });
                    if (isReadry) {
                        API.toast.success("外部资源安装成功~", "可以正常【托管原生脚本】~");
                    }
                    else {
                        API.toast.warning("部分资源加载失败 ಥ_ಥ", "即将关闭【托管原生脚本】功能！", "请等网络通常后再尝试开启！");
                        setTimeout(() => { API.config.trusteeship = false; }, 1e3);
                    }
                }
            }
        },
        {
            key: "toast",
            menu: "common",
            type: "list",
            name: "toastr",
            list: [
                {
                    key: "status",
                    type: "switch",
                    label: "开关",
                    value: true,
                    sub: '感谢 <a href="//github.com/CodeSeven/toastr" target="_blank">toastr</a> 提供支持！'
                },
                {
                    key: "rtl",
                    type: "switch",
                    label: "镜像",
                    sub: "左右翻转",
                    value: false
                },
                {
                    key: "position",
                    type: "select",
                    label: "位置",
                    value: "top-right",
                    sub: "四角",
                    candidate: ["top-right", "top-left", "bottom-right", "bottom-left"]
                },
                {
                    key: "delay",
                    type: "slider",
                    label: "时长",
                    sub: "单位：/秒",
                    value: 4,
                    min: 1,
                    max: 60,
                    precision: 59
                },
                {
                    key: "type",
                    type: "select",
                    label: "类型",
                    sub: "测试限定",
                    value: "warning",
                    candidate: ["info", "success", "warning", "error"],
                    styles: {
                        info: "color: #2F96B4",
                        success: "color: #51A351",
                        warning: "color: #F89406",
                        error: "color: #BD362F"
                    }
                },
                {
                    key: "test",
                    type: "input",
                    label: "测试",
                    sub: '请输入一句话~',
                    candidate: ["Hello World!"],
                    callback: v => {
                        API.toast[API.config.toast.type](v);
                    }
                }
            ]
        },
        {
            key: "av",
            menu: "rewrite",
            label: "av/BV",
            type: "switch",
            value: true,
            sub: '旧版一般视频播放页面'
        },
        {
            key: "videoLimit",
            menu: "player",
            type: "list",
            name: "解除区域/APP限制",
            list: [
                {
                    key: "switch",
                    type: "switch",
                    label: "开关",
                    value: false
                },
                {
                    key: "server",
                    type: "select",
                    label: "服务器类型",
                    sub: \`<a href="https://github.com/yujincheng08/BiliRoaming/wiki/%E5%85%AC%E5%85%B1%E8%A7%A3%E6%9E%90%E6%9C%8D%E5%8A%A1%E5%99%A8" target="_blank">公共反代服务器</a>\`,
                    value: "内置",
                    candidate: ["内置", "自定义"],
                    float: \`如果选择自定义则需要填写下面的代理服务器，并且转到【账户授权】进行第三方服务器授权。内置服务器则支持以游客身份获取数据，但只能获取flv格式，且大会员画质还是需要授权。<br>※ 内置服务器不支持泰区。\`,
                    callback: v => {
                        if (v === "自定义") {
                            if (!API.config.accessKey.key) {
                                API.alert("自定义服务器一般都要求您授权登录才能使用，是否前往【账户授权】设置？", undefined, [
                                    {
                                        name: "是",
                                        callback: () => {
                                            API.showSetting("accessKey");
                                        }
                                    },
                                    {
                                        name: "否",
                                        callback: () => { }
                                    }
                                ]);
                            }
                        }
                    }
                },
                {
                    key: "cn",
                    type: "input",
                    label: "大陆",
                    sub: "大陆反代",
                    props: { type: "url", placeholder: "www.example.com" },
                    float: '海外用户用来观看大陆限定视频的代理服务器。<br>※ <strong>启用【账户授权】意味着该服务器能获取您的部分账户权限，请自行确认服务器可靠性！</strong>'
                },
                {
                    key: "hk",
                    type: "input",
                    label: "香港",
                    sub: "香港反代",
                    props: { type: "url", placeholder: "www.example.com" },
                    float: '香港以外的用户用来观看香港澳门限定视频的代理服务器。<br>※ <strong>启用【账户授权】意味着该服务器能获取您的部分账户权限，请自行确认服务器可靠性！</strong>'
                },
                {
                    key: "tw",
                    type: "input",
                    label: "台湾",
                    sub: "台湾反代",
                    props: { type: "url", placeholder: "www.example.com" },
                    float: '台湾以外的用户用来观看台湾限定视频的代理服务器。<br>※ <strong>启用【账户授权】意味着该服务器能获取您的部分账户权限，请自行确认服务器可靠性！</strong>'
                },
                {
                    key: "th",
                    type: "input",
                    label: "泰国",
                    sub: "泰国（东南亚）反代",
                    props: { type: "url", placeholder: "www.example.com" },
                    float: '用来观看泰国（东南亚）限定视频的代理服务器。<br>※ <strong>启用【账户授权】意味着该服务器能获取您的部分账户权限，请自行确认服务器可靠性！</strong>'
                }
            ]
        },
        {
            key: "protobufDanmaku",
            menu: "danmaku",
            label: "启用新版弹幕",
            sub: "protobuf",
            type: "switch",
            value: true,
            float: \`为旧版播放器添加proto弹幕支持。由于旧版xml弹幕已获取不到90分钟后的弹幕，本功能不建议禁用。\`
        },
        {
            key: "section",
            menu: "style",
            label: "统一换回旧版顶栏",
            sub: "针对未重构的页面",
            type: "switch",
            value: true,
            float: '非重构页面顶栏底栏也替换为旧版。'
        },
        {
            key: "danmakuHashId",
            menu: "danmaku",
            label: "反查弹幕发送者",
            sub: "结果仅供参考！",
            type: "switch",
            value: false,
            float: '旧版播放器上右键弹幕将显示弹幕发送者。</br>※ 使用哈希逆向算法，存在碰撞可能性，所示信息仅供参考，或者干脆查不出来。'
        },
        {
            key: "flash",
            menu: "player",
            label: "flash播放器",
            sub: "可用于临时不加载视频进入视频页面",
            float: "临时启用flash播放器以拦截播放器载入，如需下载视频可切换到“下载”标签呼出下载面板，恢复播放器请点击HTML5按钮或在设置中关闭本功能。",
            type: "switch",
            value: false
        },
        {
            key: "rebuildType",
            menu: "common",
            label: "页面重构模式",
            svg: API.getModule("vernier.svg"),
            type: "select",
            sub: "改善脚本兼容性",
            value: "重写",
            candidate: ["重定向", "重写"],
            float: \`重定向：先重定向再重写页面框架，完全避免被新版页面污染，减少页面出问题的概率。<br>重写：直接重写页面，所有在本脚本之前注入的浏览器扩展和脚本都将失效！<br>※ 本脚本一直在尝试使用各种方法在优化重构页面方案同时改进兼容性，但始终没有完美的解决办法，只能说非常抱歉！\`
        },
        {
            key: "enlike",
            menu: "player",
            label: "添加点赞功能",
            sub: "自制、简陋",
            type: "switch",
            value: false,
            float: "旧版播放器的时代点赞功能还未存在，本脚本代为设计了个丑丑的点赞功能。注意对于bangumi，点赞数据计算的是单P的。"
        },
        {
            key: "upList",
            menu: "style",
            label: "UP主列表",
            sub: "展示合作者",
            type: "switch",
            value: false
        },
        {
            key: "commandDm",
            menu: "danmaku",
            label: "添加互动弹幕",
            sub: "投票弹窗等",
            type: "switch",
            value: false,
            float: \`可以使用新版的一些弹窗互动组件。目前可用组件：评分弹窗、投屏弹窗、关联视频跳转按钮、带“UP主”标识弹幕。</br>※ <strong>需要同时开启新版proto弹幕。</strong>\`
        },
        {
            key: "bangumi",
            menu: "rewrite",
            label: "bangumi",
            sub: "旧版Bangumi页面",
            type: "switch",
            value: true
        },
        {
            type: "switch",
            key: "watchlater",
            label: "稍后再看",
            value: true,
            menu: "rewrite",
            sub: '旧版稍后再看页面'
        },
        {
            type: "switch",
            key: "player",
            label: "嵌入",
            value: true,
            menu: "rewrite",
            sub: '旧版嵌入式播放器'
        },
        {
            type: "switch",
            key: "index",
            label: "主页",
            value: true,
            menu: "rewrite",
            sub: '旧版主页'
        },
        {
            type: "switch",
            key: "ranking",
            label: "排行榜",
            value: true,
            menu: "rewrite",
            sub: "旧版全站排行榜"
        },
        {
            type: "switch",
            key: "read",
            label: "专栏",
            value: true,
            menu: "rewrite",
            sub: "旧版专栏页面"
        },
        {
            key: "medialist",
            menu: "rewrite",
            label: "medialist",
            sub: "旧版播单相关页面",
            type: "switch",
            value: true,
            float: "使用旧版播单页面重构medialist相关页面，初始状态视频数据为20，可以滚送到播单底部以动态加载更多。另外由于播单已被官方禁用，您无法对播单进行收藏等操作，也不能访问播单详情页面。"
        },
        {
            key: "automate",
            menu: "player",
            type: "list",
            name: "自动化操作",
            list: [
                {
                    key: "danmakuFirst",
                    label: "自动展开弹幕列表",
                    float: "自动从推荐视频切换到播放弹幕列表。",
                    type: "switch",
                    value: false
                },
                {
                    key: "showBofqi",
                    label: "自动滚动到播放器",
                    type: "switch",
                    value: false
                },
                {
                    key: "screenWide",
                    label: "自动宽屏",
                    type: "switch",
                    value: false,
                    callback: v => v && (API.config.automate.webFullScreen = false)
                },
                {
                    key: "noDanmaku",
                    label: "自动关弹幕",
                    type: "switch",
                    value: false
                },
                {
                    key: "autoPlay",
                    label: "自动播放",
                    type: "switch",
                    value: false
                },
                {
                    key: "webFullScreen",
                    label: "自动网页全屏",
                    type: "switch",
                    value: false,
                    callback: v => v && (API.config.automate.screenWide = false)
                },
                {
                    key: "videospeed",
                    label: "记忆播放速率",
                    type: "switch",
                    value: false
                },
                {
                    key: "electric",
                    label: "跳过充电鸣谢",
                    type: "switch",
                    value: false
                }
            ]
        },
        {
            key: "heartbeat",
            menu: "restore",
            label: "修复视频心跳",
            sub: "出现不记录播放历史症状时的选择",
            float: "尝试修复可能被广告拦截扩展误伤的视频心跳。",
            type: "switch",
            value: false
        },
        {
            key: "bangumiEplist",
            menu: "player",
            label: "保留番剧回目列表",
            sub: "牺牲特殊背景图",
            type: "switch",
            value: false,
            float: '部分带特殊背景图片的番剧会隐藏播放器下方的番剧回目列表，二者不可得兼，只能选一。'
        },
        {
            type: "switch",
            key: "history",
            label: "只显示视频历史",
            sub: "去除专栏、直播记录",
            value: false,
            menu: "style"
        },
        {
            type: "switch",
            key: "searchHistory",
            label: "去除历史记录页面搜索框",
            sub: "其实留着也没什么",
            value: false,
            menu: "style"
        },
        {
            type: "switch",
            key: "liveP2p",
            label: "禁止P2P上传",
            sub: "小水管禁不起别人白嫖！",
            value: true,
            menu: "live",
            float: "禁止直播间使用WebRTC进行P2P共享上传，以免暴露ip地址，并为小水管节约带宽。"
        },
        {
            type: "switch",
            key: "sleepCheck",
            label: "禁止挂机检测",
            sub: "就喜欢挂后台听个响不行吗！",
            value: true,
            menu: "live",
            float: "禁止直播间5分钟不操作判定挂机并切断直播，可以放心挂后台听个响。"
        },
        {
            type: "switch",
            key: "errands",
            label: '恢复对限制UP主空间的访问',
            sub: '<a href="//space.bilibili.com/11783021" target="_blank">哔哩哔哩番剧出差</a>、<a href="//space.bilibili.com/1988098633" target="_blank">b站_DM組</a>和<a href="//space.bilibili.com/2042149112" target="_blank">b站_EN組</a>',
            value: true,
            menu: "restore",
            float: '使用备份数据修复对于港澳台官方番剧、影视剧和综艺投稿账户的访问。'
        },
        {
            type: "switch",
            key: "album",
            label: "还原个人空间相簿链接",
            sub: "相簿也是时泪啊",
            value: false,
            menu: "restore",
            float: '将个人空间的相簿链接从动态重定向回原来的相簿。'
        },
        {
            type: "switch",
            key: "jointime",
            label: "显示账号注册时间",
            sub: "历史不该被隐藏",
            value: false,
            menu: "restore",
            float: '在空间显示对应账号的注册时间。'
        },
        {
            key: "lostVideo",
            menu: "restore",
            label: "修复失效视频信息",
            sub: \`有些甚至评论还在！\`,
            type: "switch",
            value: false,
            float: '使用第三方数据修复收藏、频道等处的失效视频信息。（以红色删除线标记）</br>访问失效视频链接时将尝试重建av页面。'
        },
        {
            type: "select",
            menu: "player",
            key: "codecType",
            label: "视频编码",
            sub: "AVC、HEVC或AV1",
            value: "AVC",
            candidate: ["AVC", "HEVC", "AV1"],
            float: '指定播放器优先加载的视频编码格式，可根据设备解码能力与实际需要调整这个设置项。<br>※ AVC：兼容性最好，文件体积较大<br>※ AV1：兼容性次之，文件体积较小<br>※ HEVC：兼容性最差，文件体积较小<br>压制效果要分视频讨论，在AVC大幅降低码率的今天，AV1或许可能是画质最好的选择，但一般都只能软解（考验硬件水平以及比硬解费电）。HEVC则除了Safari用户外不推荐考虑，令微软、谷歌都抛弃的版权流氓！',
            callback: v => {
                let mime = {
                    "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
                    "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"',
                    "AVC": 'video/mp4;codecs="avc1.640028"'
                };
                if (!MediaSource.isTypeSupported(mime[v])) {
                    API.toast.warning(\`播放器不支持\${v}编码格式\`, "将继续使用AVC编码");
                    API.config.codecType = "AVC";
                }
            }
        },
        {
            key: "collection",
            menu: "rewrite",
            label: "合集",
            sub: "以分P形式呈现",
            type: "switch",
            value: true
        },
        {
            key: "search",
            menu: "rewrite",
            label: "搜索",
            sub: '旧版搜索页面',
            type: "switch",
            value: true
        },
        {
            key: "sortIndex",
            menu: "rewrite",
            label: "分区主页",
            sub: "暂未实现，请善用B站施舍的【回到旧版】按钮",
            type: "switch",
            value: true,
            callback: v => API.setCookie("i-wanna-go-back", String(v ? 2 : -1))
        },
        {
            key: "liveRecord",
            menu: "live",
            label: "直播回放",
            sub: "过滤动态中的直播回放",
            type: "switch",
            value: false
        },
        {
            key: "closedCaption",
            menu: "player",
            label: "CC字幕",
            sub: '移植自<a href="https://greasyfork.org/scripts/378513" target="_blank">Bilibili CC字幕工具</a>',
            type: "switch",
            value: true,
            float: '没有简体中文时将提供一个繁体到简体的硬翻译，不考虑使用习惯等情况的那种。'
        },
        {
            key: "segProgress",
            menu: "player",
            label: "分段进度条",
            sub: "视频看点",
            type: "switch",
            value: false
        },
        {
            key: "videoDisableAA",
            menu: "player",
            label: "禁用视频渲染抗锯齿",
            sub: '详见<a href="https://github.com/MotooriKashin/Bilibili-Old/issues/292" target="_blank">#292</a>说明',
            type: "switch",
            value: false,
            float: \`听说chrome渲染视频，在视频像素跟屏幕像素不是1:1对应的情况下，使用的抗锯齿算法会导致画面模糊，而且可能还会产生色差。屏幕分辨率与视频分辨率差别越大越明显。本选项用来提供一个【锯齿】【模糊】二选一的选项，请根据自身观感决定启用与否。\`
        },
        {
            key: "onlineDanmaku",
            menu: "danmaku",
            name: "在线弹幕",
            type: "list",
            list: [
                {
                    key: "url",
                    label: "视频链接或参数",
                    type: "input",
                    float: '请提供对应视频的完整url或者能提取有效信息的参数，比如：<br>av806828803<br>av806828803?p=1<br>BV1T34y1o72w<br>ss3398<br>ep84795<br>aid=806828803<br>aid=806828803&p=1<br>avid=806828803<br>bvid=1T34y1o72w<br>bvid=BV1T34y1o72w<br>ssid=3398<br>epid=84795<br>season_id=3398<br>ep_id=84795',
                    props: { placeholder: "av806828803" }
                },
                {
                    key: "concat",
                    label: "合并已有弹幕",
                    type: "switch",
                    value: false
                },
                {
                    key: "action",
                    label: "(👉ﾟヮﾟ)👉",
                    type: "button",
                    value: async () => {
                        if (!window.player)
                            return API.toast.warning("请在播放页面使用本功能 →_→");
                        if (!window.player.setDanmaku)
                            return API.toast.warning("内部组件丢失！", "请检查【托管原生脚本】功能是否开启！");
                        if (!API.config.onlineDanmaku.url)
                            return API.toast.warning("请输入视频链接或参数~");
                        API.toast.info(\`正在解析url：\${API.config.onlineDanmaku.url}\`);
                        try {
                            const d = await API.urlParam(API.config.onlineDanmaku.url, false);
                            if (d.aid && d.cid) {
                                API.toast.info("参数解析成功，正在获取弹幕数据~", d);
                                API.debug(API.config.onlineDanmaku.url, d);
                                let dm = await API.danmaku.getSegDanmaku(d.aid, d.cid);
                                if (dm) {
                                    const dat = API.danmaku.danmakuFormat(dm);
                                    API.toast.success("获取弹幕成功~");
                                    window.player?.setDanmaku(dat, API.config.onlineDanmaku.concat);
                                    API.config.downloadOther && API.pushDownload({
                                        group: "弹幕",
                                        data: dat,
                                        up: "在线",
                                        down: \`N/A\`,
                                        callback: () => API.danmaku.saveDanmaku(dat, API.config.onlineDanmaku.url)
                                    });
                                }
                                else {
                                    API.toast.error("获取弹幕失败，请在控制台检查原因~");
                                }
                            }
                            else {
                                API.toast.warning("提取弹幕参数失败，请检查输入~");
                            }
                        }
                        catch (e) {
                            API.toast.error("在线弹幕", e);
                            API.debug.error("在线弹幕", e);
                        }
                    },
                    button: "加载"
                }
            ]
        },
        {
            key: "commentLinkDetail",
            menu: "style",
            label: "还原评论中的超链接",
            sub: "av、ss或ep",
            type: "switch",
            value: false
        },
        {
            key: "localMedia",
            menu: "player",
            type: "list",
            name: "播放本地文件",
            list: [
                {
                    key: "concat",
                    label: "与已有弹幕合并",
                    type: "switch",
                    value: false
                },
                {
                    key: "file",
                    label: "选择本地文件或者弹幕",
                    type: "input",
                    props: { type: "file", accept: "video/mp4,application/xml,application/json", multiple: "multiple" },
                    callback: v => {
                        new API.LocalMedia(v);
                    }
                }
            ]
        },
        {
            key: "allDanmaku",
            menu: "danmaku",
            type: "list",
            name: "全弹幕装填",
            list: [
                {
                    key: "delay",
                    type: "slider",
                    label: "冷却时间",
                    value: 3,
                    min: 1,
                    max: 30,
                    precision: 29
                },
                {
                    key: "action",
                    label: "(👉ﾟヮﾟ)👉",
                    type: "button",
                    value: () => {
                        API.allDanmaku();
                    },
                    button: "开始",
                    float: '通过获取所有历史弹幕来实现，但每天的历史弹幕池其实有上限（远低于普通弹幕池），超出的部分是获取不到的，所以最后获取到的总数其实未必达得到【全弹幕】的要求（甚至可能不如普通弹幕池）。另外高级弹幕、代码弹幕等并不在历史弹幕池内，如果普通池内没有，想通过本功能来获取只是徒劳。'
                }
            ]
        },
        {
            key: "configManage",
            menu: "common",
            type: "button",
            label: "设置数据",
            sub: "备份/还原",
            svg: API.getModule("blind.svg"),
            value: () => {
                API.alert("设置数据包含您个人对于设置的自定义调整，您可以选择恢复默认数据、导出为本地文件或者从本地文件中恢复。", "设置数据", [
                    { name: "默认", callback: API.settingMG.restore },
                    { name: "导出", callback: API.settingMG.output },
                    { name: "导入", callback: API.settingMG.input },
                ]);
            },
            button: "管理"
        },
        {
            key: "downlaodType",
            menu: "download",
            type: "checkbox",
            label: "类型",
            sub: "请求的文件类型",
            float: '请求的文件类型，实际显示取决于服务器是否提供了该类型的文件。而播放器已载入的文件将直接推送到下载面板，无论这里是否勾选了对应类型。换言之：这里决定的是发送请求的类型而不是实际获取到的类型。各类型简介如下：<br>※ mp4：后缀名.mp4，无需任何后续操作的最适合的下载类型，但是画质选择极少，一般最高不超过1080P，如果画质类型为【预览】则说明是付费视频的预览片段，下载意义不大。<br>※ DASH：新型浏览体解决方案，可以看成是把一个mp4文件拆开成一个只有画面的文件和一个只有声音的文件，提供的后缀名都是.m4s，为了方便可以将画面文件修改为.m4v，声音文件修改为.m4a。这种类型下载一个画面文件+一个声音文件，然后用ffmmpeg等工具混流为一个完整视频文件，在下载面板中声音文件显示为【aac】，画面文件则可能有可能存在【avc】【hev】【av1】三种，代表了画面的编码算法，任选其一即可。一般而言在乎画质选【hev】（部分画质如【杜比视界】似乎只以这种格式提供），在乎兼容性【avc】（毕竟mp4默认编码），【av1】则是新型编码标准，12代CPU或30系显卡以外的PC硬件都不支持硬解（不过还可以软解，效果看CPU算力），属于“站未来”的类型。<br>※ flv：flash时代（已落幕）的流媒体遗存，后缀名.flv，本是媲美mp4的格式，如果一个文件没有分成多个片段的话，如果下载面板只有一个片段，那么祝贺本视频没有遭遇到“分尸”，下载后无需后续操作，直接当成mp4文件即可，如果有多个片段，则需全部下载后用ffmpeg等工具拼接起来（与DASH分别代表了两种切片类型，一个是音视频分流，一个是时间轴分段），段数大于2还不如改下载DASH，DASH只要下载2个文件而且还有专属画质。',
            value: ["mp4"],
            candidate: ["mp4", "flv", "DASH"]
        },
        {
            key: "TVresource",
            menu: "download",
            type: "switch",
            label: "获取TV源",
            sub: "可能无水印",
            float: \`B站TV端视频源一般都没有水印，因为会员和主站不互通，如非tv大会员将获取不到专属画质。<strong>获取到的下载源将不支持【默认】下载方式</strong>\`,
            value: false,
            callback: v => {
                if (v) {
                    API.config.referer = "";
                    API.toast.warning("您选择获取TV源，已经referer设置置空~", "注意：TV源无法使用默认方式下载");
                }
                else {
                    API.config.referer = location.origin;
                    API.toast.warning("您放弃获取TV源，已经referer设置为默认值");
                }
            }
        },
        {
            key: "downloadQn",
            menu: "download",
            type: "select",
            label: "画质参数",
            sub: "flv限定",
            float: \`以数字代表的画质参数，因为mp4不能选择画质而DASH默认提供所有画质，所以只对flv格式有效。一般无脑选最高即可，不存在或者权限不足时会主动向下降级，目前最高画质是127（8K）。\`,
            value: "127",
            candidate: ["0", "15", "16", "32", "48", "64", "74", "80", "112", "116", "120", "125", "126", "127"]
        },
        {
            key: "downloadBtn",
            menu: "download",
            type: "switch",
            label: "下载按钮",
            sub: "播放器右上角",
            value: false
        },
        {
            key: "downloadNow",
            menu: "download",
            type: "button",
            label: "下载面板",
            sub: "下载当前视频",
            value: () => {
                API.downloadDefault();
            },
            button: "呼出"
        },
        {
            key: "downloadOther",
            menu: "download",
            type: "switch",
            label: "其他下载",
            sub: "提供弹幕、字幕等的下载",
            value: false
        },
        {
            key: "danmakuSaveType",
            menu: "danmaku",
            type: "select",
            label: "弹幕格式",
            sub: "下载",
            value: "xml",
            candidate: ["xml", "json"]
        },
        {
            key: "downloadMethod",
            menu: "download",
            type: "select",
            label: "下载方式",
            value: "默认",
            candidate: ["默认", "IDM+ef2", "aria2", "aria2+rpc"],
            callback: v => {
                switch (v) {
                    case "IDM+ef2":
                        API.alert('IDM（Internet Download Manager）是Windows端著名的的下载工具，通过作者的另一款名为<a href="https://github.com/MotooriKashin/ef2" target="_blank">ef2</a>辅助工具，本脚本支持直接从浏览器拉起IDM下载文件。<br>是否确定使用本方式？', "下载方式", [
                            {
                                name: "确定",
                                callback: () => { API.showSetting("IDM"); }
                            },
                            {
                                name: "取消",
                                callback: () => API.config.downloadMethod = "默认"
                            }
                        ]);
                        break;
                    case "aria2":
                        API.alert('aria2是全平台著名的命令行下载工具，本方式将复制下载命令到剪切板以方便使用aria2进行下载，<br>是否确定使用本方式下载？', "下载方式", [
                            {
                                name: "确定",
                                callback: () => { API.showSetting("aria2"); }
                            },
                            {
                                name: "取消",
                                callback: () => API.config.downloadMethod = "默认"
                            }
                        ]);
                        break;
                    case "aria2+rpc":
                        API.alert('aria2支持rpc模式，从浏览器端直接发送下载命令，第一次使用须要到下面配置rpc设置，是否使用本方式进行下载？', "下载方式", [
                            {
                                name: "确定",
                                callback: () => { API.showSetting("aria2"); }
                            },
                            {
                                name: "取消",
                                callback: () => API.config.downloadMethod = "默认"
                            }
                        ]);
                        break;
                }
            },
            float: '默认下载方式请不要直接左键点击，右键另存为是更正确合理的操作。'
        },
        {
            key: "userAgent",
            menu: "download",
            type: "input",
            label: "User-Agent",
            sub: '高级设置',
            float: 'B站视频一般都需要有效User-Agent，否则会403。（默认下载方式以外才有意义。）<br>※ <strong>本项会同时影响替换UPOS服务器后能否播放，默认值才是经检验的最合适的值！</strong>',
            value: "Bilibili Freedoooooom/MarkII",
            candidate: ["Bilibili Freedoooooom/MarkII"]
        },
        {
            key: "referer",
            menu: "download",
            type: "input",
            label: "referer",
            sub: "高级设置",
            float: 'B站视频一般填主站域名即可，其他会403。<strong>TV源/泰区视频必须置空！港澳台替换UPOS服务器后也可能需要置空。</strong>（默认下载方式以外才有意义。）',
            value: location.origin,
            candidate: [location.origin]
        },
        {
            key: "filepath",
            menu: "download",
            type: "input",
            label: "下载目录",
            sub: "Windows端注意反斜杠！",
            float: '（默认下载方式以外才有意义。）'
        },
        {
            key: "aria2",
            menu: "download",
            type: "list",
            name: "aria2",
            list: [
                {
                    key: "token",
                    type: "input",
                    label: "令牌",
                    sub: "token",
                    props: { type: "password" },
                    float: '如果没有使用token可置空'
                },
                {
                    key: "server",
                    type: "input",
                    label: "主机",
                    sub: "url",
                    props: { type: "url", placeholder: "http://localhost" },
                    value: 'http://localhost'
                },
                {
                    key: "port",
                    type: "input",
                    label: "端口",
                    props: { type: "number", placeholder: "6800" },
                    value: "6800"
                },
                {
                    key: "test",
                    type: "button",
                    label: "测试RPC连接",
                    button: "测试",
                    value: () => {
                        const msg = API.toast.custom(0, "info", "正在测试RPC连接可用性~");
                        API.aria2.getVersion()
                            .then(d => {
                            if (msg) {
                                msg.type = "success";
                                msg.data = [\`RPC设置正常！aria2版本：\${d.version}\`];
                                msg.delay = 3;
                            }
                            console.log(\`RPC设置正常！\`, d);
                        }).catch(e => {
                            if (msg) {
                                msg.type = "error";
                                msg.data = ["RPC链接不正常 ಥ_ಥ", "请检查aria2设置等再试~"];
                                msg.delay = 3;
                            }
                            console.error("RPC链接异常！请检查aria2设置等再试~", e);
                        });
                    }
                }
            ]
        },
        {
            key: "IDM",
            menu: "download",
            type: "list",
            name: "ef2",
            list: [
                {
                    key: "wait",
                    type: "switch",
                    label: "稍后下载",
                    sub: "添加到IDM下载列表",
                    float: '需要手动到IDM中开始下载，注意B站下载链接有时效，请及时下载！',
                    value: false
                },
                {
                    key: "silence",
                    type: "switch",
                    label: "静默下载",
                    sub: "无需二次确认",
                    float: '取消IDM下载确认对话框，那里会询问是否开启下载以及文件名、保存目录等信息。',
                    value: false
                }
            ]
        },
        {
            key: "animatedBanner",
            menu: "style",
            type: "switch",
            label: "动态banner",
            sub: "移植自新版顶栏",
            value: false
        },
        {
            key: "accessKey",
            menu: "common",
            type: "list",
            name: "账户授权",
            list: [
                {
                    key: "key",
                    type: "input",
                    label: "Token",
                    sub: "access_key",
                    float: "网页端B站使用cookie来判断用户身份，但是移动端或者授权第三方登录，则使用一个名为access_key的参数。B站有一些只有APP/TV端才能获取的数据，启用本功能将赋予本脚本访问那些数据的能力。<strong>与【解除限制】功能一起使用时请自行确定代理服务器的安全性！</strong>",
                    props: { type: "text", readonly: "readonly" }
                },
                {
                    key: "date",
                    type: "input",
                    label: "授权日期",
                    sub: "有效期不超过30天",
                    float: "和cookie一样，access_key这个鉴权参数一般有有效期限，经验告诉我们一般是一个月，过期作废。因为授权是敏感操作，请自行判断是否过期并慎重考虑是否重新授权。",
                    props: { type: "text", readonly: "readonly" }
                },
                {
                    key: "action",
                    type: "button",
                    label: API.config.accessKey?.key ? "撤销授权" : "授权操作",
                    float: '',
                    button: API.config.accessKey?.key ? "撤销" : "授权",
                    value: () => {
                        if (API.config.accessKey.key) {
                            API.alert('注销授权只是保证本脚本不再使用已授权的参数，如果第三方服务器保存有该鉴权，本脚本也无法让人家吐出来＞﹏＜。如果要真正完全销毁该鉴权，可以考虑修改密码等操作，这样会强制所有登录失效，唯一的问题是您的所有设备都必须重新登录。<br>请确认您的操作~', "撤销授权", [
                                {
                                    name: "确认撤销",
                                    callback: () => { API.AccessKey.remove(); }
                                },
                                {
                                    name: "取消操作",
                                    callback: () => { }
                                }
                            ]);
                        }
                        else {
                            API.alert('请仔细阅读上面各项说明并慎重操作，【确认授权】表示您同意本脚本能以网页端以外的鉴权向B站官方服务器证明您的身份，以执行一些本来网页端无权进行的操作。如果【解除限制】中自定义了第三方解析服务器，请仔细斟酌第三方的可信度，<strong>如无必要，切莫授权！</strong>。<br>请确认您的操作~', "撤销授权", [
                                {
                                    name: "确认授权",
                                    callback: () => {
                                        API.AccessKey.get();
                                    }
                                },
                                {
                                    name: "取消操作",
                                    callback: () => { }
                                }
                            ]);
                        }
                    }
                }
            ]
        },
        {
            key: "timeline",
            menu: "style",
            type: "switch",
            label: "港澳台新番时间表",
            sub: '<a href="//www.bilibili.com/anime/timeline/" target="_blank">立即前往</a>',
            float: \`在主页番剧分区中，可能需主动从最新切换到响应的星期才会显示当天的数据。\`,
            value: false
        },
        {
            key: "privateRecommend",
            menu: "style",
            type: "switch",
            label: "主页个性化推荐",
            sub: "默认是全站统一推荐",
            value: false
        },
        {
            key: "episodeData",
            menu: "style",
            type: "switch",
            label: "分集数据",
            sub: "Bangumi",
            float: \`对于Bangumi，显示单集播放量和弹幕，原合计数据显示在鼠标焦点提示文本中。\`,
            value: false
        },
        {
            key: "uposReplace",
            menu: "player",
            type: "list",
            name: "替换UPOS服务器",
            list: [
                {
                    key: "nor",
                    type: "select",
                    label: "一般视频",
                    sub: "不推荐",
                    value: "不替换",
                    float: \`对于一般视频应该充分相信B站分配给你的视频服务器就是最合适的，所以一般不推荐主动替换。\`,
                    candidate: ["不替换"].concat(UPOS)
                },
                {
                    key: "gat",
                    type: "select",
                    label: "代理：港澳台或大陆",
                    sub: "看情况",
                    value: "不替换",
                    float: \`解除港澳台限制获取到的视频服务器必定是海外的Akamai，在一些大陆网络中可能体验并不好，可以看情况指定其他服务器。港澳台（及海外）网络访问大陆服务器同理。<br>※ 替换的服务器大概率有【referer】【UserAgent】限制，脚本尝试通过GM钩子绕过，方案可能并不稳定，若出问题请禁用替换或者前往Github反馈。\`,
                    candidate: ["不替换"].concat(UPOS)
                },
                {
                    key: "th",
                    type: "select",
                    label: "代理：泰区",
                    sub: "必选",
                    value: "ks3（金山）",
                    float: \`泰区视频返回的服务器ban了大陆IP，所以必须进行替换！请根据自身网络情况选择。<br>※ 替换的服务器有【referer】【UserAgent】限制，脚本尝试通过GM钩子绕过，方案可能并不稳定，若出问题前往Github反馈。\`,
                    candidate: UPOS
                },
                {
                    key: "dl",
                    type: "select",
                    label: "下载",
                    sub: "不推荐",
                    value: "不替换",
                    float: \`替换下载功能获取到的视频服务器，对于播放器已获取到的视频源，已经在上面的选项中处理过了。剩下的跟一般视频同理，不推荐替换。<br>※ 注意有【referer】【UserAgent】限制视频源，请在下载面板将【referer】置空，【UserAgent】设为有效值（默认值肯定有效！）\`,
                    candidate: ["不替换"].concat(UPOS)
                }
            ]
        }
    ]);

//# sourceURL=file://@Bilibili-Old/include/storage/config.js`;
/*!***********************!*/
/**/modules["cookie.js"] = /*** ./src/include/storage/cookie.js ***/
`
    /**
     * 获取cookie对象
     * @returns 名称: 值
     */
    function getCookies() {
        return document.cookie.split('; ').reduce((s, d) => {
            let key = d.split('=')[0];
            let val = d.split('=')[1];
            s[key] = unescape(val);
            return s;
        }, {});
    }
    API.getCookies = getCookies;
    /**
     * 添加cookie
     * @param name 名称
     * @param value 值
     * @param days 有效期：/天
     */
    function setCookie(name, value, days = 365) {
        const exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString() + '; path=/; domain=.bilibili.com';
    }
    API.setCookie = setCookie;

//# sourceURL=file://@Bilibili-Old/include/storage/cookie.js`;
/*!***********************!*/
/**/modules["file.js"] = /*** ./src/include/storage/file.js ***/
`
    function readAs(file, type = "string", encoding = 'utf-8') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            switch (type) {
                case "ArrayBuffer":
                    reader.readAsArrayBuffer(file);
                    break;
                case "DataURL":
                    reader.readAsDataURL(file);
                    break;
                case "string":
                    reader.readAsText(file, encoding);
                    break;
            }
            reader.onload = () => resolve(reader.result);
            reader.onerror = e => reject(e);
        });
    }
    API.readAs = readAs;
    /**
     * 保存到文件
     * @param content 要保存的对象
     * @param fileName 文件名（含拓展名）
     * @param contentType 编码类型
     */
    async function saveAs(content, fileName, contentType = "text/plain") {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.addEventListener("load", () => URL.revokeObjectURL(a.href));
        // document.body.appendChild(a);
        a.click();
    }
    API.saveAs = saveAs;
    /**
     * 弹出文件读取窗口
     * @param accept 文件类型：MMIE/拓展名，以逗号分隔
     * @param multiple 多选
     */
    function fileRead(accept, multiple) {
        return new Promise((resolve) => {
            const input = document.createElement("input");
            input.type = "file";
            accept && (input.accept = accept);
            multiple && (input.multiple = multiple);
            input.style.opacity = "0";
            input.addEventListener("change", () => resolve(input.files));
            document.body.appendChild(input);
            input.click();
        });
    }
    API.fileRead = fileRead;

//# sourceURL=file://@Bilibili-Old/include/storage/file.js`;
/*!***********************!*/
/**/modules["storage.js"] = /*** ./src/include/storage/storage.js ***/
`
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
    var _StorageInterface__;
    class StorageInterface {
        /**
         *
         * @param target 类型标记：真 ? sessionStorage : localStorage
         */
        constructor(target) {
            _StorageInterface__.set(this, void 0); // 类型标记：localStorage/sessionStorage
            __classPrivateFieldSet(this, _StorageInterface__, target, "f");
            // 原生Storage支持以属性形式获取/修改存储，使用get/set模拟。
            this.keys().forEach(d => Object.defineProperty(this, d, { get: () => this.getItem(d), set: v => this.setItem(d, v) }));
        }
        /** 清空！ */
        clear() {
            (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).clear();
        }
        ;
        /**
         * 读取
         * @param key 目标键名
         * @returns 格式化后的数据
         */
        getItem(key) {
            let str = (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).getItem(key);
            try {
                str = JSON.parse(str);
            }
            catch (e) { }
            return str;
        }
        ;
        /**
         * 列出键名数组
         * 原生Storage.key只返回但索引，感觉意义不大。
         * @returns 键名数组
         */
        keys() {
            return Object.keys((__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage));
        }
        ;
        /**
         * 移除
         * @param key 目标键名
         */
        removeItem(key) {
            (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).removeItem(key);
        }
        ;
        /**
         * 添加/修改
         * @param key
         * @param value
         */
        setItem(key, value) {
            switch (typeof value) {
                case "object":
                    (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).setItem(key, JSON.stringify(value));
                    break;
                case "function":
                    API.debug.warn("函数类型并不适合这样存储！", key, value);
                    break;
                default: (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).setItem(key, String(value));
            }
        }
        ;
        /** 条目总数 */
        get length() { return (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).length; }
    }
    _StorageInterface__ = new WeakMap();
    /** localStorage */
    class LocalStorage extends StorageInterface {
        constructor() { super(false); }
    }
    /** sessionStorage */
    class SessionStorage extends StorageInterface {
        constructor() { super(true); }
    }
    // 声明导出，值需要get/set代理以实时更新
    /** localStorage */
    API.localStorage = undefined;
    /** sessionStorage */
    API.sessionStorage = undefined;
    Object.defineProperties(API, {
        localStorage: { get: () => new LocalStorage(), set: () => false },
        sessionStorage: { get: () => new SessionStorage(), set: () => false }
    });

//# sourceURL=file://@Bilibili-Old/include/storage/storage.js`;
/*!***********************!*/
/**/modules["bell.svg"] = /*** ./src/include/svg/bell.svg ***/
`<svg viewBox="0 0 16 16"><path d="M8 16a2 2 0 001.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 008 16z"></path><path fill-rule="evenodd" d="M8 1.5A3.5 3.5 0 004.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01l.001.006c0 .002.002.004.004.006a.017.017 0 00.006.004l.007.001h10.964l.007-.001a.016.016 0 00.006-.004.016.016 0 00.004-.006l.001-.007a.017.017 0 00-.003-.01l-1.703-2.554a1.75 1.75 0 01-.294-.97V5A3.5 3.5 0 008 1.5zM3 5a5 5 0 0110 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0113.482 13H2.518a1.518 1.518 0 01-1.263-2.36l1.703-2.554A.25.25 0 003 7.947V5z"></path></svg>`;
/*!***********************!*/
/**/modules["bioscope.svg"] = /*** ./src/include/svg/bioscope.svg ***/
`<svg viewBox="0 0 1024 1024"><path d="M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0"></path><path d="M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556 0.142222 143.985778-64.156444 144.128-143.616 0.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-0.142222-143.701333 63.857778-144.128 143.104-0.426667 79.459556 63.644444 144.213333 143.104 144.64h0.512"></path><path d="M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504"></path></svg>`;
/*!***********************!*/
/**/modules["blind.svg"] = /*** ./src/include/svg/blind.svg ***/
`<svg viewBox="0 0 24 24"><g><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></g></svg>`;
/*!***********************!*/
/**/modules["dislike.svg"] = /*** ./src/include/svg/dislike.svg ***/
`<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1 {fill: #f36392;}</style></defs><g><path class="cls-1" d="M10.28,32.77h2.5V13.19h-2.5ZM25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86H5.56a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h6.25l6.8-8.49A3.83,3.83,0,0,1,25.25,5Zm10.14,2.51H22.22l.28-2.92L22.92,5a1.26,1.26,0,0,0-.18-1,1.28,1.28,0,0,0-.82-.56,1.11,1.11,0,0,0-1.25.42l-6.36,8.2-.83,1.11H5.14a2,2,0,0,0-.83.28,2.28,2.28,0,0,0-1.25,2.08V30.41a2,2,0,0,0,.42,1.25,2,2,0,0,0,2.08,1.11H28.89a2.38,2.38,0,0,0,1.39-.41,3.61,3.61,0,0,0,2.08-2.78L36.8,15l2.5.56L36.8,15a2.45,2.45,0,0,0-.14-1.39,2.89,2.89,0,0,0-1.52-.54l.28-2.5Z" transform="translate(-0.56 -0.82)" /></g></svg>`;
/*!***********************!*/
/**/modules["dmset.svg"] = /*** ./src/include/svg/dmset.svg ***/
`<svg viewBox="0 0 22 22"><path d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z"></path><path d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z"></path></svg>`;
/*!***********************!*/
/**/modules["download.svg"] = /*** ./src/include/svg/download.svg ***/
`<svg viewBox="0 0 24 24"><g><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g></svg>`;
/*!***********************!*/
/**/modules["fork.svg"] = /*** ./src/include/svg/fork.svg ***/
`<svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#212121" stroke-linecap="round"></path></svg>`;
/*!***********************!*/
/**/modules["gear.svg"] = /*** ./src/include/svg/gear.svg ***/
`<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></svg>`;
/*!***********************!*/
/**/modules["like.svg"] = /*** ./src/include/svg/like.svg ***/
`<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1 {fill: #f36392;}</style></defs><g><path class="cls-1" d="M12.06,35.27V10.43h-.15l6.7-8.37A3.83,3.83,0,0,1,25.25,5L25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86Zm-2.5,0h-4a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h4Z" transform="translate(-0.56 -0.82)" /></g></svg>`;
/*!***********************!*/
/**/modules["linechart.svg"] = /*** ./src/include/svg/linechart.svg ***/
`<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"></path></svg>`;
/*!***********************!*/
/**/modules["migrate.svg"] = /*** ./src/include/svg/migrate.svg ***/
`<svg viewBox="0 0 24 24"><g><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></g></svg>`;
/*!***********************!*/
/**/modules["note.svg"] = /*** ./src/include/svg/note.svg ***/
`<svg viewBox="0 0 24 24"><g><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g></svg>`;
/*!***********************!*/
/**/modules["palette.svg"] = /*** ./src/include/svg/palette.svg ***/
`<svg viewBox="0 0 24 24"><g><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>`;
/*!***********************!*/
/**/modules["play.svg"] = /*** ./src/include/svg/play.svg ***/
`<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>`;
/*!***********************!*/
/**/modules["stethoscope.svg"] = /*** ./src/include/svg/stethoscope.svg ***/
`<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>`;
/*!***********************!*/
/**/modules["vernier.svg"] = /*** ./src/include/svg/vernier.svg ***/
`<svg viewBox="0 0 24 24"><g><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></g></svg>`;
/*!***********************!*/
/**/modules["warn.svg"] = /*** ./src/include/svg/warn.svg ***/
`<svg viewBox="0 0 24 24"><g><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g></svg>`;
/*!***********************!*/
/**/modules["wrench.svg"] = /*** ./src/include/svg/wrench.svg ***/
`<svg viewBox="0 0 24 24"><g><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g></svg>`;
/*!***********************!*/
/**/modules["manage.js"] = /*** ./src/include/ui/manage.js ***/
`
    API.settingMG = {
        /** 初始化设置 */
        restore() {
            GM.GM_deleteValue("config");
            API.toast.warning("已恢复默认数据，请及时刷新页面避免数据紊乱！");
            API.alert(\`已恢复默认数据，请及时<strong>刷新</strong>页面避免数据紊乱！\`, "恢复默认设置", [
                { name: "刷新页面", callback: () => location.reload() }
            ]);
        },
        /** 导出设置 */
        output() {
            API.saveAs(JSON.stringify(GM.GM_getValue("config"), undefined, "\\t"), \`config \${API.timeFormat(undefined, true)}.json\`, "application/json");
        },
        /** 导入设置 */
        input() {
            API.fileRead("application/json", true).then(d => {
                d && d[0] && API.readAs(d[0]).then(d => {
                    const data = JSON.parse(d);
                    GM.GM_setValue("config", data);
                    API.alert(\`已恢复备份数据，请及时<strong>刷新</strong>页面避免数据紊乱！\`, "恢复默认设置", [
                        { name: "刷新页面", callback: () => location.reload() }
                    ]);
                });
            });
        }
    };

//# sourceURL=file://@Bilibili-Old/include/ui/manage.js`;
/*!***********************!*/
/**/modules["setting.html"] = /*** ./src/include/ui/setting.html ***/
`<div class="box">
    <div class="tool">
        <div title="关闭" class="icon"></div>
        <header>Bilbili Old</header>
    </div>
    <div class="content">
        <div class="contain">
            <div class="menu"></div>
            <div class="item"></div>
        </div>
    </div>
</div>
<style type="text/css">
    .box {
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        min-width: 600px;
        min-height: 400px;
        padding: 0;
        border: 0;
        position: fixed;
        z-index: 11110;
        display: none;
        box-sizing: border-box;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);
        transition: transform 0.3s ease-in;
        line-height: 14px;
        font: 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB,
            Heiti SC, WenQuanYi Micro Hei, sans-serif;
    }

    .tool {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        overflow: hidden;
        width: 100%;
        display: inline-flex;
        z-index: 1;
        align-items: center;
        justify-content: flex-end;
        pointer-events: none;
    }

    .tool header {
        position: absolute;
        transform: translateX(-50%);
        left: 50%;
        font-size: 14px;
    }

    .tool div {
        border-radius: 50%;
        padding: 10px;
        transform: scale(0.8);
        pointer-events: visible;
        transition: opacity 0.3s ease;
    }

    .tool div:hover {
        background-color: rgba(0, 0, 0, 10%);
    }

    .content {
        position: relative;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        overflow: hidden;
        background-color: #fff;
    }

    .contain {
        padding-bottom: 15px;
        background-position: top center;
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        align-items: flex-start;
        flex: 1;
        height: 360px;
    }

    .menu::-webkit-scrollbar,
    .item::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }

    .menu {
        flex: 1 1 0;
        flex-basis: calc(480px * 0.2);
        height: 100%;
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: column;
        min-width: fit-content;
        overflow: auto;
    }

    .item {
        flex: 4 4 0;
        flex-basis: calc(480px * 0.8);
        height: 100%;
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        position: relative;
        overflow: auto;
    }

    .item>div {
        display: none;
        margin-bottom: 60px;
    }

    .menuitem {
        align-items: center;
        display: flex;
        font-weight: 500;
        margin-inline-end: 2px;
        margin-inline-start: 1px;
        min-height: 20px;
        padding-bottom: 10px;
        padding-inline-start: 23px;
        padding-top: 10px;
        cursor: pointer;
    }

    .menuitem:hover {
        background-color: rgb(0, 0, 0, 6%);
    }

    .menuitem>div {
        padding-inline-end: 12px;
    }

    .selected {
        color: rgb(51, 103, 214) !important;
    }

    .selected>.icon {
        fill: rgb(51, 103, 214) !important;
    }

    .contain1 {
        margin-bottom: 3px;
        padding-inline-start: 20px;
        padding-inline-end: 20px;
        display: flex;
        flex-direction: column;
        outline: none;
        position: relative;
    }

    .header .title {
        color: #000;
        font-size: 108%;
        font-weight: 400;
        letter-spacing: 0.25px;
        margin-bottom: 12px;
        outline: none;
        padding-bottom: 4px;
    }

    .card {
        border-radius: 4px;
        box-shadow: 0px 0px 1px 1px rgb(60 64 67 / 30%);
        flex: 1;
        color: #000;
        line-height: 154%;
        user-select: text;
        margin-inline: 12px;
        margin-bottom: 12px;
    }

    .contain2 {
        align-items: center;
        border-top: 1px solid rgba(0, 0, 0, 6%);
        display: flex;
        min-height: 24px;
        padding: 0 20px;
        flex-wrap: wrap;
        justify-content: flex-end;
        background-color: transparent !important;
    }

    .value {
        flex: 1;
        flex-basis: 1e-9px;
        display: flex;
    }

    .value>* {
        flex: 1;
        flex-basis: 1e-9px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
        align-content: center;
    }

    .label {
        flex: 1;
        flex-basis: 1e-9px;
        padding-block-end: 12px;
        padding-block-start: 12px;
        padding-inline-start: 12px;
    }

    .switch>.label,
    .button>.label,
    .select>.label,
    .input>.label,
    .slider>.label {
        flex: 2;
    }

    .select>.value,
    .input>.value,
    .slider>.value {
        flex: 3;
    }

    .sub {
        color: rgb(95, 99, 104);
        font-weight: 400;
    }

    .icon {
        align-items: center;
        border-radius: 50%;
        display: flex;
        height: 20px;
        justify-content: center;
        position: relative;
        width: 20px;
        box-sizing: content-box;
        background: none;
        cursor: pointer;
    }
</style>`;
/*!***********************!*/
/**/modules["setting.js"] = /*** ./src/include/ui/setting.js ***/
`
    /** 设置菜单栈 */
    const MENU = [];
    /** 设置项栈 */
    const SETTING = [];
    /**
     * 注册设置菜单
     * @param mus 设置菜单
     */
    function registerMenu(mus) {
        const arr = API.isArray(mus) ? mus : [mus];
        arr.forEach(d => MENU.push(d));
    }
    API.registerMenu = registerMenu;
    /** 用于初始化设置时临时禁用回调的标记 */
    let disableSettingCallback = false;
    /**
     * 注册设置项
     * @param sets 设置项（组）
     */
    function registerSetting(sets) {
        disableSettingCallback = true;
        const arr = API.isArray(sets) ? sets : [sets];
        arr.forEach(d => {
            let tag = false;
            if (d.type !== "list") {
                Reflect.has(API.config, d.key) && (d.value = Reflect.get(API.config, d.key));
                d = new Proxy(d, {
                    set: (t, p, v, r) => {
                        if (p === "value") {
                            if (!tag) {
                                API.config[d.key] = v;
                                return true;
                            }
                            tag = false;
                            disableSettingCallback || (t.callback && Promise.resolve().then(() => t.callback(v)));
                        }
                        return Reflect.set(t, p, v, r);
                    }
                });
                // 先赋值再修改才能枚举到哦~
                API.config[d.key] = d.value;
                Object.defineProperty(API.config, d.key, {
                    set: v => {
                        tag = true;
                        d.value = v;
                    },
                    get: () => d.value
                });
            }
            else {
                const obj = Reflect.has(API.config, d.key) && JSON.parse(JSON.stringify(API.config[d.key]));
                const bak = {};
                API.config[d.key] = new Proxy(bak, {});
                d.list.forEach((t, i, a) => {
                    obj && obj[t.key] && (t.value = obj[t.key]);
                    a[i] = new Proxy(t, {
                        set: (t, p, v, r) => {
                            if (p === "value") {
                                if (!tag) {
                                    API.config[d.key][t.key] = v;
                                    return true;
                                }
                                tag = false;
                                disableSettingCallback || (t.callback && Promise.resolve().then(() => t.callback(v)));
                            }
                            return Reflect.set(t, p, v, r);
                        }
                    });
                    bak[t.key] = a[i].value;
                    Object.defineProperty(bak, t.key, {
                        get: () => a[i].value,
                        set: v => {
                            tag = true;
                            a[i].value = v;
                        }
                    });
                    API.config[d.key][t.key] = t.value;
                });
            }
            SETTING.push(d);
        });
        disableSettingCallback = false;
    }
    API.registerSetting = registerSetting;
    /**
     * 获取设置项，用于修改设置项\`value\`以外的属性
     * @param key 设置项的key，如果是组合设置，格式是\`组合key.组员key\`
     */
    function getSetting(key) {
        const arr = key.split(".");
        let rsa = SETTING.find(d => d.key === arr[0]);
        if (arr[1] && rsa.list) {
            rsa = rsa.list.find((d) => d.key === arr[1]);
        }
        return rsa;
    }
    API.getSetting = getSetting;
    /** 设置界面 */
    class BilibiliOld extends HTMLElement {
        constructor() {
            super();
            /** 菜单栈 */
            this.MENU = {};
            /** 页面栈 */
            this.ITEM = {};
            /** 设置项菜单对应表 */
            this.SETTING = {};
            const root = this.attachShadow({ mode: "closed" });
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("setting.html"))));
            this._box = root.children[0];
            this._tool = root.children[0].children[0];
            this._close = root.children[0].children[0].children[0];
            this._menu = root.children[0].children[1].children[0].children[0];
            this._item = root.children[0].children[1].children[0].children[1];
            this._close.appendChild(API.createElements(API.htmlVnode(API.getModule("fork.svg"))));
            this._close.addEventListener("click", () => this._box.removeAttribute("style"));
            document.body.appendChild(this);
            disableSettingCallback = true;
            this.initMenu();
            disableSettingCallback = false;
        }
        /** 初始化菜单 */
        initMenu() {
            this._menu.replaceChildren();
            MENU.forEach(d => {
                const menuitem = this._menu.appendChild(API.createElement(API.htmlVnode(\`<div class="menuitem">\${(d.svg ? \`<div class="icon">\${d.svg}</div>\` : "") + d.name}</div>\`)[0]));
                this.MENU[d.key] = menuitem;
                menuitem.addEventListener("click", () => { this.menuSelect(d.key); });
                this.ITEM[d.key] = this._item.appendChild(API.createElement(API.htmlVnode(\`<div class="item\${d.key}">
                        <div class="contain1">
                            <div class="header">
                                <h2 class="title">\${d.name}</h2>
                            </div>
                        </div>
                        <div class="card"></div>
                    </div>\`)[0]));
            });
            this.initItem();
        }
        /** 菜单选择 */
        menuSelect(key = "common") {
            this._menuNow?.classList.remove("selected");
            this._menuNow?.removeAttribute("style");
            this._menuNow = this.MENU[key];
            this.MENU[key].classList.add("selected");
            this._itemNow?.removeAttribute("style");
            this._itemNow = this.ITEM[key];
            this.ITEM[key].setAttribute("style", \`display: block;\`);
        }
        /**
         * 呼出设置界面
         * @param key 设置项，直达对应设置项
         */
        show(key) {
            this._box.setAttribute("style", "display: block;");
            this.menuSelect(this.SETTING[key]);
            key && this._itemNow?.querySelector(\`.\${key}\`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        /** 初始化页面 */
        initItem() {
            SETTING.forEach(d => {
                this.SETTING[d.key] = d.menu;
                if (d.type === "list") {
                    const node = this.ITEM[d.menu];
                    node.appendChild(API.createElements(API.htmlVnode(\`<div class="contain1 \${d.key}">
                            <div class="header">
                                <h2 class="title">\${d.name}</h2>
                            </div>
                        </div>
                        <div class="card"></div>\`)));
                    d.list.forEach(t => {
                        this.SETTING[\`\${d.key}-\${t.key}\`] = d.menu;
                        this.appendItem(node.lastChild, t, d.key);
                    });
                }
                else {
                    this.appendItem(this.ITEM[d.menu].children[1], d);
                }
            });
        }
        /**
         * 添加设置项
         * @param node 父节点
         * @param set 设置项
         * @param str 组合key
         */
        appendItem(node, set, str) {
            const part = node.appendChild(API.createElement(API.htmlVnode(\`<div class="contain2 \${(str ? \`\${str}-\` : "") + set.key}">\${set.svg ? \`<div class="icon">\${set.svg}</div>\` : ""}
            <div class="label">\${set.label + (set.sub ? \`<div class="sub">\${set.sub}</div>\` : "")}</div>
            <div class="value"></div></div>\`)[0]));
            switch (set.type) {
                case "button":
                    part.classList.add("button");
                    part.lastChild.appendChild(new API.PushButton(set));
                    break;
                case "checkbox":
                    part.classList.add("checkbox");
                    const checkbox = API.addElement("div", undefined, part.lastChild);
                    set.candidate.forEach(t => {
                        checkbox.appendChild(new API.Checkbox(new Proxy({ label: t, value: set.value.includes(t) }, {
                            set: (tar, ppt, val, rcv) => {
                                if (ppt === "value") {
                                    if (val) {
                                        set.value.includes(t) || set.value.push(t);
                                    }
                                    else {
                                        const i = set.value.indexOf(t);
                                        i >= 0 && set.value.splice(i, 1);
                                    }
                                    API.saveConfig();
                                }
                                return Reflect.set(tar, ppt, val, rcv);
                            }
                        })));
                    });
                    break;
                case "input":
                    part.classList.add("input");
                    part.lastChild.appendChild(new API.InputArea(set));
                    break;
                case "select":
                    part.classList.add("select");
                    part.lastChild.appendChild(new API.SelectMenu(set));
                    break;
                case "slider":
                    part.classList.add("slider");
                    part.lastChild.appendChild(new API.SliderBlock(set));
                    break;
                case "switch":
                    part.classList.add("switch");
                    part.lastChild.appendChild(new API.ButtonSwitch(set));
                    break;
            }
            set.float && new API.FloatQuote(part, set.float);
        }
    }
    customElements.define("bilibili-old", BilibiliOld);
    let node;
    /**
     * 显示设置界面
     * @param key 设置项主键，将直达指定设置。组合设置项请使用 组名key-组员key 格式
     */
    function showSetting(key) {
        node || (node = new BilibiliOld());
        document.body.contains(node) || document.body.appendChild(node);
        node.show(key);
    }
    API.showSetting = showSetting;

//# sourceURL=file://@Bilibili-Old/include/ui/setting.js`;
/*!***********************!*/
/**/modules["ui.html"] = /*** ./src/include/ui/ui.html ***/
`<div class="setting">
    <i></i><span>设置</span>
</div>
<div class="gear"></div>
<style type="text/css">
    .gear {
        position: fixed;
        right: 40px;
        bottom: 60px;
        height: 20px;
        width: 20px;
        border: 1px solid #e9eaec;
        border-radius: 50%;
        box-shadow: 0 0 12px 4px rgb(106, 115, 133, 22%);
        padding: 10px;
        cursor: pointer;
        animation: roll 1s ease-out;
        transition: opacity 0.3s ease-out;
        background: none;
        z-index: 11110;
    }

    .setting {
        box-sizing: content-box;
        color: #fff;
        background-color: #fff;
        border-radius: 5px;
        position: fixed;
        bottom: 65px;
        width: 56px;
        height: 40px;
        transition: right 0.7s;
        -moz-transition: right 0.7s;
        -webkit-transition: right 0.7s;
        -o-transition: right 0.7s;
        z-index: 11110;
        padding: 4px;
        right: -54px;
    }

    .setting:hover {
        right: 0px;
        box-shadow: rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;
        border: 1px solid rgb(233, 234, 236);
    }

    .setting i {
        background-position: -471px -982px;
        display: block;
        width: 20px;
        height: 20px;
        transition: 0.2s;
        background-image: url(//static.hdslb.com/images/base/icons.png);
        margin: auto;
    }

    .setting span {
        font-size: 14px;
        display: block;
        width: 50%;
        transition: 0.2s;
        color: #000;
        margin: auto;
    }

    @keyframes roll {

        30%,
        60%,
        90% {
            transform: scale(1) rotate(0deg);
        }

        10%,
        40%,
        70% {
            transform: scale(1.11) rotate(-180deg);
        }

        20%,
        50%,
        80% {
            transform: scale(0.9) rotate(-360deg);
        }
    }
</style>`;
/*!***********************!*/
/**/modules["ui.js"] = /*** ./src/include/ui/ui.js ***/
`
    class BilibilEntry extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({ mode: "closed" });
            this.root.appendChild(API.createElements(API.htmlVnode(API.getModule("ui.html").replace('<div class="gear"></div>', \`<div class="gear">\${API.getModule("gear.svg")}</div>\`))));
            this.stage = this.root.children[0];
            this.gear = this.root.children[1];
            this.stage.remove();
            this.gear.remove();
            this.gear.addEventListener("mouseover", () => this.gear.style.opacity = "0.8");
            this.gear.addEventListener("mouseout", () => this.gear.style.opacity = "0");
            this.gear.addEventListener("click", () => { API.showSetting(); });
            this.stage.addEventListener("click", () => { API.showSetting(); });
        }
        change() {
            if (API.config.settingEntryType) {
                this.root.contains(this.gear) && this.gear.remove();
                this.root.contains(this.stage) || this.root.appendChild(this.stage);
            }
            else {
                this.root.contains(this.stage) && this.stage.remove();
                if (!this.root.contains(this.gear)) {
                    this.root.appendChild(this.gear);
                    setTimeout(() => {
                        this.gear.style.opacity = "0";
                    }, 2e3);
                }
            }
        }
    }
    customElements.define("bilibili-entry", BilibilEntry);
    const node = new BilibilEntry();
    /** 绘制设置入口 */
    function showSettingEntry() {
        document.body.contains(node) || document.body.appendChild(node);
        node.change();
    }
    API.showSettingEntry = showSettingEntry;

//# sourceURL=file://@Bilibili-Old/include/ui/ui.js`;
/*!***********************!*/
/**/modules["aria2.js"] = /*** ./src/include/ui/download/aria2.js ***/
`
    class Aria2 {
        constructor() {
            this.setting = {};
            API.config.userAgent && (this.setting.userAgent = API.config.userAgent);
            API.config.referer && (this.setting.referer = API.config.referer);
            API.config.filepath && (this.setting.directory = API.config.filepath);
            API.config.aria2.token && (this.setting.token = API.config.aria2.token);
        }
        /**
         * 生成aria2命令行参数并赋值到剪切板
         * @param obj 下载配置数据
         */
        shell(obj) {
            return new Promise((r, j) => {
                let result = "aria2c";
                obj = { ...this.setting, ...obj };
                obj.urls.forEach(d => result += \` "\${d}"\`);
                obj.out && (result += \` --out="\${obj.out}"\`);
                obj.userAgent && (result += \` --user-agent="\${obj.userAgent}"\`);
                obj.referer && (result += \` --referer="\${obj.referer}"\`);
                obj.directory && (result += \` --dir="\${obj.directory}"\`);
                obj.split && (result += \` --split="\${obj.split}"\`);
                obj.header && Object.entries(obj.header).forEach(d => result += \` --header="\${d[0]}: \${d[1]}"\`);
                navigator.clipboard.writeText(result).then(r, e => j(e));
            });
        }
        /**
         * 以rpc方式发送aria2下载数据
         * @param obj 下载配置数据
         */
        rpc(obj) {
            obj = { ...this.setting, ...obj };
            const options = {};
            obj.out && (options.out = obj.out);
            obj.userAgent && (options["user-agent"] = obj.userAgent);
            obj.referer && (options["referer"] = obj.referer);
            obj.directory && (options["dir"] = obj.directory);
            obj.split && (options["split"] = obj.split);
            obj.header && (options["header"] = obj.header);
            return this.postMessage("aria2.addUri", obj.id || new Date().getTime(), [obj.urls, options]);
        }
        /**
         * rpc发送接口
         * @param method 请求类型
         * @param id 请求唯一标志
         * @param params 请求参数
         * @returns Promise托管的请求结果
         */
        postMessage(method, id, params = []) {
            const url = \`\${API.config.aria2.server}:\${API.config.aria2.port}/jsonrpc\`;
            API.config.aria2.token && params.unshift(\`token:\${API.config.aria2.token}\`);
            return new Promise((r, j) => {
                API.xhr({
                    url: url,
                    method: "POST",
                    responseType: "json",
                    data: JSON.stringify({ method, id, params })
                }).then(d => {
                    d.error && j(d.error);
                    d.result && r(d.result);
                }).catch(e => {
                    API.xhr({
                        url: API.objUrl(url, { method, id, params: API.Base64.encode(JSON.stringify(params)) }),
                        method: "GET",
                        responseType: "json"
                    }).then(d => {
                        d.error && j(d.error);
                        d.result && r(d.result);
                    }).catch(() => j(e));
                });
            });
        }
        /**
         * 查询aria2版本，用于测试aria2 rpc链接情况
         * @returns Promise托管的aria2版本信息
         */
        getVersion() {
            return this.postMessage("aria2.getVersion", new Date().getTime());
        }
    }
    /**
     * aria2工具
     */
    API.aria2 = new Aria2();

//# sourceURL=file://@Bilibili-Old/include/ui/download/aria2.js`;
/*!***********************!*/
/**/modules["download.js"] = /*** ./src/include/ui/download/download.js ***/
`
    /** 下载数据栈 */
    const Record = {};
    let downloading = false;
    // 切P清栈
    API.switchVideo(() => Object.keys(Record).forEach(d => delete Record[d]));
    /**
     * 添加数据到下载面板
     * @param obj 数据配置
     */
    function pushDownload(obj) {
        Reflect.has(Record, obj.group) || (Record[obj.group] = []);
        const data = { up: obj.up, down: obj.down };
        obj.color && (data.color = obj.color);
        obj.fileName && (data.fileName = obj.fileName);
        if (obj.url) {
            data.href = obj.url;
        }
        else {
            data.onclick = () => {
                if (obj.callback) {
                    return obj.callback();
                }
                API.isObject(obj.data)
                    ? API.saveAs(JSON.stringify(obj.data), obj.fileName || "")
                    : API.saveAs(obj.data, obj.fileName || "");
            };
        }
        Record[obj.group].push(data);
    }
    API.pushDownload = pushDownload;
    /**
     * 合并下载数据
     * @param target 原下载数据
     * @param source 新增下载数据
     */
    function contactDownloadDate(target, source) {
        Object.entries(source).forEach(d => {
            Reflect.has(target, d[0]) || (target[d[0]] = []);
            target[d[0]] = target[d[0]].concat(d[1]);
        });
    }
    /** 封面等下载 */
    function getCover() {
        if (!API.config.downloadOther)
            return;
        API.cover && pushDownload({
            group: "封面",
            url: API.cover,
            up: "封面",
            down: "N/A",
            fileName: \`\${API.title || \`av\${API.aid}\`}.\${API.cover.split(".").reduce((s, d) => s = d, undefined) || "jpg"}\`
        });
        API.bkg_cover && pushDownload({
            group: "封面",
            url: API.bkg_cover,
            up: "封面",
            down: "N/A",
            fileName: \`\${API.title || \`av\${API.aid}\`}.\${API.bkg_cover.split(".").reduce((s, d) => s = d, undefined) || "jpg"}\`
        });
    }
    /** 默认下载 */
    async function downloadDefault() {
        if (downloading)
            return;
        downloading = true;
        if (!API.cid)
            return API.toast.warning("请在视频页使用本功能~");
        if (API.th)
            API.toast.warning("泰区视频！", "请将【referer】置空，【UserAgent】设为默认值，并选用【默认】以外的方式进行下载~");
        const data = API.playinfoFiter(API.__playinfo__);
        const request = [];
        const type = API.config.downlaodType.join(" ").toLowerCase();
        API.downloadUI.obj.data = data;
        API.downloadUI.show();
        (/mp4/g.test(type) && request.push(getContent("mp4")));
        data.flv || (/flv/g.test(type) && request.push(getContent("flv")));
        data.aac || (/dash/g.test(type) && request.push(getContent("dash")));
        (await Promise.all(request)).forEach(d => {
            API.playinfoFiter(d, API.downloadUI.obj.data);
        });
        getCover();
        contactDownloadDate(API.downloadUI.obj.data, Record);
        downloading = false;
    }
    API.downloadDefault = downloadDefault;
    /** 其他下载，下载视频外的数据 */
    function downloadOther() {
        if (downloading)
            return;
        downloading = true;
        API.downloadUI.obj.data = Record;
        API.downloadUI.show();
        downloading = false;
    }
    API.downloadOther = downloadOther;
    /**
     * 封装请求链接
     * 用于过滤Promise.all请求错误
     * @param d 请求类型
     * @returns 请求结果
     */
    async function getContent(d) {
        d = d.toLowerCase();
        let result;
        try {
            switch (d) {
                case "dash":
                    result = API.pgc ?
                        await API.url.getJson(API.config.TVresource ? "api.bilibili.com/pgc/player/api/playurltv" : "api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval: API.fnval }, true) :
                        await API.url.getJson(API.config.TVresource ? "api.bilibili.com/x/tv/ugc/playurl" : "api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval: API.fnval }, true);
                    break;
                case "flv":
                    result = API.pgc ?
                        await API.url.getJson(API.config.TVresource ? "api.bilibili.com/pgc/player/api/playurltv" : "api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid, qn: API.config.downloadQn }, true) :
                        await API.url.getJson(API.config.TVresource ? "api.bilibili.com/x/tv/ugc/playurl" : "api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid, qn: API.config.downloadQn }, true);
                    break;
                case "mp4":
                    result = API.pgc ?
                        await API.url.getJson("api.bilibili.com/pgc/player/api/playurlproj", { cid: API.cid }, true) :
                        await API.url.getJson("app.bilibili.com/v2/playurlproj", { cid: API.cid }, true);
                    break;
            }
        }
        catch (e) { }
        return JSON.parse(API.uposReplace(JSON.stringify(result), API.config.uposReplace.dl));
    }

//# sourceURL=file://@Bilibili-Old/include/ui/download/download.js`;
/*!***********************!*/
/**/modules["downloadUI.html"] = /*** ./src/include/ui/download/downloadUI.html ***/
`<div class="table"></div>
<style type="text/css">
    .table {
        position: fixed;
        z-index: 11113;
        bottom: 0;
        width: 100%;
        min-height: 50px;
        display: flex;
        box-sizing: border-box;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);
        transition: transform 0.3s ease-in;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        align-items: center;
    }

    .cell {
        background-color: #fff;
        color: #000 !important;
        border: #ccc 1px solid;
        border-radius: 3px;
        display: flex;
        margin: 3px;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }

    .type {
        color: #000 !important;
        display: table-cell;
        min-width: 1.5em;
        text-align: center;
        vertical-align: middle;
        padding: 10px 3px;
    }

    .type.mp4 {
        background-color: #e0e;
    }

    .type.av1 {
        background-color: #feb;
    }

    .type.avc {
        background-color: #07e;
    }

    .type.hev {
        background-color: #7ba;
    }

    .type.aac {
        background-color: #0d0;
    }

    .type.flv {
        background-color: #0dd;
    }

    .item {
        display: table-cell;
        text-decoration: none;
        padding: 3px;
        cursor: pointer;
        color: #1184B4;
    }

    .item:hover {
        color: #FE3676;
    }

    .up {
        color: #fff !important;
        text-align: center;
        padding: 1px 3px;
        background-color: #777;
    }

    .up.yellow {
        background-color: #ffe42b;
        background-image: linear-gradient(to right, #ffe42b, #dfb200);
    }

    .up.pink {
        background-color: #ffafc9;
        background-image: linear-gradient(to right, #ffafc9, #dfada7);
    }

    .up.purple {
        background-color: #c0f;
        background-image: linear-gradient(to right, #c0f, #90f);
    }

    .up.red {
        background-color: #f00;
        background-image: linear-gradient(to right, #f00, #c00);
    }

    .up.orange {
        background-color: #f90;
        background-image: linear-gradient(to right, #f90, #d70);
    }

    .up.blue {
        background-color: #00d;
        background-image: linear-gradient(to right, #00d, #00b);
    }

    .up.green {
        background-color: #0d0;
        background-image: linear-gradient(to right, #0d0, #0b0);
    }

    .up.lv9 {
        background-color: #151515;
        background-image: linear-gradient(to right, #151515, #030303);
    }

    .up.lv8 {
        background-color: #841cf9;
        background-image: linear-gradient(to right, #841cf9, #620ad7);
    }

    .up.lv7 {
        background-color: #e52fec;
        background-image: linear-gradient(to right, #e52fec, #c30dca);
    }

    .up.lv6 {
        background-color: #ff0000;
        background-image: linear-gradient(to right, #ff0000, #dd0000);
    }

    .up.lv5 {
        background-color: #ff6c00;
        background-image: linear-gradient(to right, #ff6c00, #dd4a00);
    }

    .up.lv4 {
        background-color: #ffb37c;
        background-image: linear-gradient(to right, #ffb37c, #dd915a);
    }

    .up.lv3 {
        background-color: #92d1e5;
        background-image: linear-gradient(to right, #92d1e5, #70b0c3);
    }

    .up.lv2 {
        background-color: #95ddb2;
        background-image: linear-gradient(to right, #95ddb2, #73bb90);
    }

    .up.lv1 {
        background-color: #bfbfbf;
        background-image: linear-gradient(to right, #bfbfbf, #9d9d9d);
    }

    .down {
        font-size: 90%;
        margin-top: 2px;
        text-align: center;
        padding: 1px 3px;
    }
</style>`;
/*!***********************!*/
/**/modules["downloadUI.js"] = /*** ./src/include/ui/download/downloadUI.js ***/
`
    class BiliOldDownload extends HTMLElement {
        constructor(obj) {
            super();
            /** 点击移除 */
            this.observer = new API.ClickRemove(this);
            const { data } = obj;
            const root = this.attachShadow({ mode: "closed" });
            root.appendChild(API.createElements(API.htmlVnode(API.getModule("downloadUI.html"))));
            this._table = root.children[0];
            this.obj = obj;
            Object.defineProperty(obj, "data", {
                get: () => new Proxy(this._data, new API.ProxyHandler(() => this.\$data())),
                set: (v) => {
                    if (v === this._data)
                        return;
                    this._data = v;
                    this.\$data();
                }
            });
            this._data = obj.data = data;
        }
        \$data() {
            const vdoms = Object.entries(this._data).reduce((s, d) => {
                const vdom = {
                    tagName: "div",
                    props: { class: "cell" },
                    children: [
                        {
                            tagName: "div",
                            props: { class: \`type \${d[0]}\` },
                            children: [
                                {
                                    tagName: "text",
                                    text: d[0]
                                }
                            ]
                        }
                    ]
                };
                d[1].forEach(d => {
                    const a = { class: "item", target: "_blank" };
                    d.href && (a.href = d.href);
                    d.fileName && (a.download = d.fileName);
                    vdom.children?.push({
                        tagName: "a",
                        props: a,
                        children: [
                            {
                                tagName: "div",
                                props: { class: \`up\${d.color ? \` \${d.color}\` : ""}\` },
                                children: [
                                    {
                                        tagName: "text",
                                        text: d.up
                                    }
                                ]
                            },
                            {
                                tagName: "div",
                                props: { class: \`down\` },
                                children: [
                                    {
                                        tagName: "text",
                                        text: d.down
                                    }
                                ]
                            }
                        ],
                        event: {
                            click: () => {
                                d.onclick && d.onclick();
                            }
                        }
                    });
                });
                s.push(vdom);
                return s;
            }, []);
            vdoms.length || (vdoms.push({
                tagName: "div",
                children: [
                    {
                        tagName: "text",
                        text: "正在获取下载数据~"
                    }
                ]
            }));
            this._table.replaceChildren(API.createElements(vdoms));
        }
        /** 显示下载面板 */
        show() {
            document.body.contains(this) || document.body.appendChild(this);
            this.observer.observe();
        }
    }
    customElements.define("biliold-download", BiliOldDownload);
    /** 下载面板控件 */
    API.downloadUI = new BiliOldDownload({ data: {} });

//# sourceURL=file://@Bilibili-Old/include/ui/download/downloadUI.js`;
/*!***********************!*/
/**/modules["ef2.js"] = /*** ./src/include/ui/download/ef2.js ***/
`
    class Ef2 {
        constructor() {
            this.setting = {};
            API.config.userAgent && (this.setting.userAgent = API.config.userAgent);
            API.config.referer && (this.setting.referer = API.config.referer);
            API.config.filepath && (this.setting.directory = API.config.filepath);
            API.config.IDM.wait && (this.setting.sendToList = API.config.IDM.wait);
            API.config.IDM.silence && (this.setting.toastDisabled = API.config.IDM.silence);
        }
        /**
         * 发送下载数据到IDM
         * @param data 配置IDM
         */
        sendLinkToIDM(data) {
            data = { ...this.setting, ...data };
            const a = document.createElement("a");
            a.href = this.encode(data);
            a.click();
        }
        /**
         * 编码ef2协议
         * @param data 配置数据
         * @returns ef2协议
         */
        encode(data) {
            let result = "";
            Object.keys(data).forEach(d => {
                switch (d) {
                    case "cookies":
                        result += \` -c "\${data.cookies}"\`;
                        break;
                    case "directory":
                        data.directory = data.directory.replace(/\\//, "\\\\"); // 目录反斜杠可能误输入为了正斜杠
                        data.directory && data.directory[data.directory.length - 1] == "\\\\" && (data.directory = data.directory.substr(0, data.directory.length - 1)); // 目录最后的反斜杠可能导致引号被转义 
                        result += \` -o "\${data.directory}"\`;
                        break;
                    case "out":
                        result += \` -s "\${data.out}"\`;
                        break;
                    case "password":
                        result += \` -P "\${data.password}"\`;
                        break;
                    case "postDate":
                        result += \` -d "\${data.postDate}"\`;
                        break;
                    case "referer":
                        result += \` -r "\${data.referer}"\`;
                        break;
                    case "sendToList":
                        result += \` -q\`;
                        break;
                    case "toastDisabled":
                        result += \` -f\`;
                        break;
                    case "url":
                        data.url.startsWith("//") && (data.url = "https:" + data.url); // 省略协议头时默认添加http/tls头
                        result += \` -u "\${data.url}"\`;
                        break;
                    case "userAgent":
                        result += \` -a "\${data.userAgent}"\`;
                        break;
                    case "userName":
                        result += \` -U "\${data.userName}"\`;
                        break;
                }
            });
            result && result.startsWith(" ") && (result = result.substr(1, result.length));
            return "ef2://" + API.Base64.encode(result);
        }
        /**
         * 解码ef2链接为
         * @param ef2ptl
         * @returns ef2配置信息
         */
        decode(ef2ptl) {
            ef2ptl = ef2ptl.replace("ef2://", "");
            ef2ptl = API.Base64.decode(ef2ptl) + " ";
            const key = ef2ptl.match(/-\\w /g);
            const value = ef2ptl.split(/-\\w /);
            value.shift();
            return Array.from(key).reduce((s, d, i) => {
                value[i] && value[i].endsWith(" ") && (value[i] = value[i].substr(0, value[i].length - 1));
                value[i] && value[i].endsWith("\\"") && (value[i] = value[i].substr(1, value[i].length - 2));
                switch (d) {
                    case "-c ":
                        s.cookies = value[i];
                        break;
                    case "-o ":
                        s.directory = value[i];
                        break;
                    case "-s ":
                        s.out = value[i];
                        break;
                    case "-P ":
                        s.password = value[i];
                        break;
                    case "-d ":
                        s.postDate = value[i];
                        break;
                    case "-r ":
                        s.referer = value[i];
                        break;
                    case "-q ":
                        s.sendToList = true;
                        break;
                    case "-f ":
                        s.toastDisabled = true;
                        break;
                    case "-u ":
                        s.url = value[i];
                        break;
                    case "-a ":
                        s.userAgent = value[i];
                        break;
                    case "-U ":
                        s.userName = value[i];
                        break;
                }
                return s;
            }, {});
        }
    }
    /**
     * ef2工具
     */
    API.ef2 = new Ef2();

//# sourceURL=file://@Bilibili-Old/include/ui/download/ef2.js`;
/*!***********************!*/
/**/modules["playinfoFilter.js"] = /*** ./src/include/ui/download/playinfoFilter.js ***/
`
    class PlayinfoFiter {
        constructor(fileName) {
            /** id => 质量 */
            this.quality = {
                100032: "8K",
                100029: '4K',
                100028: '1080P60',
                100027: '1080P+',
                100026: '1080P',
                100024: '720P',
                100023: '480P',
                100022: '360P',
                30280: "320Kbps",
                30260: "320Kbps",
                30259: "128Kbps",
                30257: "64Kbps",
                30255: "AUDIO",
                30250: "ATMOS",
                30232: "128Kbps",
                30216: "64Kbps",
                30127: "8K",
                30126: "Dolby",
                30125: "HDR",
                30121: "4K",
                30120: "4K",
                30116: '1080P60',
                30112: '1080P+',
                30106: '1080P60',
                30102: '1080P+',
                30080: '1080P',
                30077: '1080P',
                30076: '720P',
                30074: '720P',
                30066: '720P',
                30064: '720P',
                30048: "720P",
                30033: '480P',
                30032: '480P',
                30016: '360P',
                30015: '360P',
                30011: '360P',
                464: '预览',
                336: "1080P",
                320: "720P",
                288: "480P",
                272: "360P",
                208: "1080P",
                192: "720P",
                160: "480P",
                127: "8K",
                126: "Dolby",
                125: "HDR",
                120: "4K",
                116: "1080P60",
                112: "1080P+",
                80: "1080P",
                74: "720P60",
                64: "720P",
                48: "720P",
                32: "480P",
                16: "360P",
                15: "360P"
            };
            /** id => 类型（备用方案） */
            this.codec = {
                hev: [30127, 30126, 30125, 30121, 30106, 30102, 30077, 30066, 30033, 30011],
                avc: [30120, 30112, 30080, 30064, 30032, 30016],
                av1: [100029, 100028, 100027, 100026, 100024, 100023, 100022]
            };
            /** 颜色表 */
            this.color = {
                "8K": "yellow",
                "Dolby": "pink",
                "ATMOS": "pink",
                "AUDIO": "pink",
                "HDR": "purple",
                "4K": "purple",
                "1080P60": "red",
                "1080P+": "red",
                "1080P": "red",
                "720P60": "orange",
                "720P": "orange",
                "480P": "blue",
                "360P": "green",
                "320Kbps": "red",
                "128Kbps": "blue",
                "64Kbps": "green"
            };
            this.record = [];
            this.fileName = fileName;
        }
        /**
         * 解码playurl的下载数据
         * @param playinfo playurl返回值(json)
         */
        filter(playinfo) {
            if (playinfo) {
                playinfo.data && this.filter(playinfo.data); // data型
                playinfo.result && this.filter(playinfo.result); // result型
                playinfo.durl && this.durl(playinfo.durl); // 顶层durl型
                playinfo.dash && this.dash(playinfo.dash); // 顶层dash型
            }
            return this.record;
        }
        /**
         * 整理durl部分
         * @param durl durl信息
         */
        durl(durl) {
            let index = 0; // flv分段标记
            durl.forEach(d => {
                const url = d.backupUrl || d.backup_url || [];
                url.unshift(d.url);
                const qua = this.getQuality(url[0], d.id);
                const link = {
                    type: "",
                    url: url,
                    quality: qua,
                    size: API.sizeFormat(d.size),
                    color: this.color[qua] || ""
                };
                switch (d.url.includes("mp4?")) {
                    case true:
                        link.type = "mp4";
                        break;
                    case false:
                        link.type = "flv";
                        index++;
                        link.flv = index;
                        break;
                }
                this.fileName && (link.fileName = \`\${this.fileName}\${qua}.\${link.type}\`);
                this.record.push(link);
            });
        }
        /**
         * 整理dash部分
         * @param dash dash信息
         */
        dash(dash) {
            dash.video && this.dashVideo(dash.video, dash.duration); // dash视频部分
            dash.audio && this.dashAudio(dash.audio, dash.duration); // dash音频部分
            dash.dolby && dash.dolby.audio && Array.isArray(dash.dolby.audio) && this.dashAudio(dash.dolby.audio, dash.duration); // 杜比音效部分
        }
        /**
         * 整理dash视频部分
         * @param video dash视频信息
         * @param duration duration信息，配合bandwidth能计算出文件大小
         */
        dashVideo(video, duration) {
            video.forEach(d => {
                const url = d.backupUrl || d.backup_url || [];
                (d.baseUrl || d.base_url) && url.unshift(d.baseUrl || d.base_url);
                if (!url.length)
                    return;
                let type = "";
                if (d.codecs) {
                    // 编码类型
                    type = d.codecs.includes("avc") ? "avc" : d.codecs.includes("av01") ? "av1" : "hev";
                }
                else {
                    const id = this.getID(url[0]);
                    type = this.codec.hev.find(d => d === id) ? "hev" : "avc";
                }
                const qua = this.getQuality(url[0], d.id);
                this.record.push({
                    type: type,
                    url: url,
                    quality: qua,
                    size: API.sizeFormat(d.bandwidth * duration / 8),
                    color: this.color[qua] || "",
                    fileName: \`\${this.fileName}\${qua}.m4v\`
                });
            });
        }
        /**
         * 整理dash音频部分
         * @param audio dash音频信息
         * @param duration duration信息，配合bandwidth能计算出文件大小
         */
        dashAudio(audio, duration) {
            audio.forEach(d => {
                const url = d.backupUrl || d.backup_url || [];
                (d.baseUrl || d.base_url) && url.unshift(d.baseUrl || d.base_url);
                const qua = this.getQuality(url[0], d.id);
                url.length && this.record.push({
                    type: "aac",
                    url: url,
                    quality: qua,
                    size: API.sizeFormat(d.bandwidth * duration / 8),
                    color: this.color[qua] || "",
                    fileName: \`\${this.fileName}\${qua}.m4a\`
                });
            });
        }
        /**
         * 根据url确定画质/音质信息
         * 需要维护quality表
         * @param url 多媒体url
         * @param id 媒体流id
         * @returns 画质/音质信息
         */
        getQuality(url, id) {
            return this.quality[this.getID(url)] || (id && this.quality[id]) || "N/A";
        }
        /**
         * 从url中提取可能的id
         * @param url 多媒体url
         */
        getID(url) {
            let id = 0;
            url.replace(/\\d+\\.((flv)|(mp4)|(m4s))/, d => id = Number(d.split(".")[0]));
            return id;
        }
    }
    /**
     * 解码playurl的下载数据
     * @param playinfo playurl返回值(json)
     * @param prev 其他已解码的数据，用于合并
     * @param fileName 文件名
     */
    function playinfoFiter(playinfo, prev = {}, fileName = API.title) {
        return new PlayinfoFiter(fileName).filter(playinfo).reduce((s, d) => {
            s[d.type] || (s[d.type] = []);
            const obj = {
                up: Reflect.has(d, "flv") ? \`\${d.quality}*\${d.flv}\` : d.quality,
                down: d.size,
                href: API.subArray(d.url),
                color: d.color
            };
            if (API.config.downloadMethod !== "默认") {
                delete obj.href;
                obj.onclick = () => {
                    postData(d);
                };
            }
            s[d.type].push(obj);
            return s;
        }, prev);
    }
    API.playinfoFiter = playinfoFiter;
    /**
     * 发送下载数据
     * @param data 下载数据
     */
    function postData(data) {
        switch (API.config.downloadMethod) {
            case "IDM+ef2":
                API.ef2.sendLinkToIDM({ url: data.url[0], out: data.fileName });
                break;
            case "aria2":
                API.aria2.shell({ urls: data.url, out: data.fileName })
                    .then(() => API.toast.success(\`已复制aria2命令行到剪切板，在cmd等shell中使用即可下载~\`))
                    .catch(e => {
                    API.toast.error(\`复制aria2命令行失败！\`);
                    API.debug.error(\`复制aria2命令行失败！\`, e);
                });
                break;
            case "aria2+rpc":
                API.aria2.rpc({ urls: data.url, out: data.fileName })
                    .then(GID => API.toast.success(\`已添加下载任务到aria2 RPC主机，任务GID：\${GID}\`))
                    .catch(e => {
                    API.toast.error(\`添加下载任务到aria2 RPC主机出错！\`);
                    API.debug.error(\`添加下载任务到aria2 RPC主机出错！\`, e);
                });
                break;
        }
    }

//# sourceURL=file://@Bilibili-Old/include/ui/download/playinfoFilter.js`;
/*!***********************!*/
/**/modules["aid.js"] = /*** ./src/include/variable/aid.js ***/
`
    /** aid */
    API.aid = undefined;
    Object.defineProperty(API, "aid", {
        get: () => Reflect.get(window, "aid"),
        set: v => Reflect.set(window, "aid", v)
    });

//# sourceURL=file://@Bilibili-Old/include/variable/aid.js`;
/*!***********************!*/
/**/modules["cid.js"] = /*** ./src/include/variable/cid.js ***/
`
    /** cid */
    API.cid = undefined;
    Object.defineProperty(API, "cid", {
        get: () => Reflect.get(window, "cid"),
        set: v => Reflect.set(window, "cid", v)
    });

//# sourceURL=file://@Bilibili-Old/include/variable/cid.js`;
/*!***********************!*/
/**/modules["fnval.js"] = /*** ./src/include/variable/fnval.js ***/
`
    /** fnval标志位（二进制） */
    class Fnval {
        constructor() {
            this.MP4 = 1;
            this.DASH_H265 = 16;
            this.HDR = 64;
            this.DASH_4K = 128;
            this.DOLBYAUDIO = 256;
            this.DOLBYVIDEO = 512;
            this.DASH_8K = 1024;
            this.DASH_AV1 = 2048;
        }
    }
    const _ = new Fnval();
    /** 视频格式标志\`fnval\`的默认值（最高值） */
    API.fnval = Reflect.ownKeys(_).reduce((s, d) => {
        s += _[d];
        return s;
    }, -1);

//# sourceURL=file://@Bilibili-Old/include/variable/fnval.js`;
/*!***********************!*/
/**/modules["uid.js"] = /*** ./src/include/variable/uid.js ***/
`
    /** 用户id */
    API.uid = Number(API.getCookies().DedeUserID);

//# sourceURL=file://@Bilibili-Old/include/variable/uid.js`;
/*!***********************!*/
/**/modules["automate.js"] = /*** ./src/vector/automate.js ***/
`
    /** 滚动到播放器 */
    function bofqiToView() {
        let str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
        let node = str.reduce((s, d) => {
            s = s || document.querySelector(d);
            return s;
        }, document.querySelector("#__bofqi"));
        node && node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    API.switchVideo(() => {
        // 自动网页全屏
        API.config.automate.webFullScreen && API.doWhile(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen.icon-24webfull.player-tooltips-trigger"), () => document.querySelector(".bilibili-player-video-web-fullscreen").click());
        // 自动关闭弹幕
        API.config.automate.noDanmaku && API.doWhile(() => document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku"), d => {
            !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off") && d.click();
        });
        API.config.videoDisableAA && API.doWhile(() => document.querySelector("#bilibiliPlayer .bilibili-player-video video"), d => d.style.filter += "contrast(1)");
        setTimeout(() => {
            // 滚动到播放器
            API.config.automate.showBofqi && bofqiToView();
        }, 500);
        API.setMediaSession();
    });
    // 切换到弹幕列表
    API.config.automate.danmakuFirst && API.sessionStorage.setItem("player_last_filter_tab_info", 4);
    // 备份播放数据
    let setting = API.localStorage.getItem("bilibili_player_settings");
    if (setting) {
        if (setting.video_status?.autopart !== "") {
            GM.GM_setValue("bilibili_player_settings", setting);
        }
    }
    else {
        setting = GM.GM_getValue("bilibili_player_settings");
        setting && API.localStorage.setItem("bilibili_player_settings", setting);
    }
    // 记忆播放器速率
    if (API.config.automate.videospeed) {
        const videospeed = GM.GM_getValue("videospeed");
        if (videospeed) {
            let setting = API.sessionStorage.getItem("bilibili_player_settings");
            setting ? setting.video_status ? setting.video_status.videospeed = videospeed : setting.video_status = { videospeed } : setting = { video_status: { videospeed } };
            API.sessionStorage.setItem("bilibili_player_settings", setting);
        }
        API.switchVideo(() => {
            API.doWhile(() => document.querySelector("#bofqi")?.querySelector("video"), d => {
                d.addEventListener("ratechange", e => GM.GM_setValue("videospeed", e.target.playbackRate || 1));
            });
        });
    }

//# sourceURL=file://@Bilibili-Old/vector/automate.js`;
/*!***********************!*/
/**/modules["logReport.js"] = /*** ./src/vector/logReport.js ***/
`
    Object.defineProperty(window, "reportObserver", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    Object.defineProperty(window, "rec_rp", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    Object.defineProperty(window, "reportMsgObj", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    API.xhrhookAsync("data.bilibili.com", (args) => {
        API.debug.debug("拦截日志", ...args);
        return true;
    }, undefined, false);
    API.xhrhookAsync("data.bilivideo.com", (args) => {
        API.debug.debug("拦截日志", ...args);
        return true;
    }, undefined, false);
    API.xhrhookAsync("cm.bilibili.com", (args) => {
        API.debug.debug("拦截日志", ...args);
        return true;
    }, undefined, false);
    API.scriptBlock("log-reporter.js");

//# sourceURL=file://@Bilibili-Old/vector/logReport.js`;
/*!***********************!*/
/**/modules["main.js"] = /*** ./src/vector/main.js ***/
`
{
    /** 模块顶层命名空间 */
    const API = new Proxy(new (class {
        constructor() {
            /** 封装脚本管理器API的顶级对象 */
            this.GM = GM;
            /** 脚本名称 */
            this.Name = GM.info.script.name;
            /** 当前版本 */
            this.Virsion = GM.info.script.version;
            /** 脚本管理器及版本 */
            this.Handler = [GM.info.scriptHandler, GM.info.version].join(" ");
            /**
             * 获取模块内容
             * @param key 模块名称
             * @returns 模块内容
             */
            this.getModule = (key) => modules[key];
        }
        /**
         * 加载模块
         * @param name 模块名称
         * @param args 需要传递的全局变量。格式：{变量名: 变量值} *需要忽略代码检查*
         * @returns 空调用直接返回可选模块
         */
        importModule(name, args = {}) {
            if (!name) {
                // 空调用直接返回可选模块
                return Object.keys(modules).filter(p => typeof modules[p] === "string");
            }
            else if (typeof modules[name] === "string") {
                new Function("GM", "API", ...Object.keys(args), modules[name])(GM, API, ...Object.keys(args).reduce((s, d) => {
                    s.push(args[d]);
                    return s;
                }, []));
            }
            else
                return; // (<typeof globalThis.API><unknown>this).toast.error(\`模块\${name}并不存在！\`);
        }
    })(), {
        get(t, p, r) {
            // 接口存在直接返回
            if (Reflect.has(t, p))
                return Reflect.get(t, p, r);
            if (typeof p === "string" && p in modules["apply.json"]) {
                // 接口未加载加载所在模块
                t.importModule(modules["apply.json"][p]);
                return Reflect.get(t, p, r);
            }
            return undefined;
        }
    });
    API.importModule("polyfill.js"); // polyfill
    API.importModule("vector.js"); // 引导模块
}

//# sourceURL=file://@Bilibili-Old/vector/main.js`;
/*!***********************!*/
/**/modules["playinfo.js"] = /*** ./src/vector/playinfo.js ***/
`
    API.xhrhook("/playurl?", args => {
        const param = API.urlObj(args[1]);
        args[1].includes("84956560bc028eb7") && (args[1] = API.urlsign(args[1], {}, 8)); // 修复失效的appid
        args[1].includes("pgc") && (API.pgc = true); // ogv视频
        // 更新关键参数
        param.aid && (API.aid = Number(param.aid));
        param.avid && (API.aid = Number(param.avid));
        param.cid && (API.cid = Number(param.cid));
        param.seasonId && (API.ssid = Number(param.seasonId));
        param.episodeId && (API.epid = Number(param.episodeId));
    }, obj => {
        try {
            const str = API.uposReplace(obj.responseType === "json" ? JSON.stringify(obj.response) : obj.response, API.config.uposReplace.nor);
            API.__playinfo__ = JSON.parse(str);
            if (API.__playinfo__.code === 87005)
                API.toast.warning(API.__playinfo__.message, "请到新版页面完成付费操作！");
            obj.responseType === "json" ? obj.response = API.__playinfo__ : obj.response = obj.responseText = str;
        }
        catch (e) { }
    }, false);
    let timer, tag = false; // 过滤栈
    API.xhrhook("api.bilibili.com/x/player.so", () => {
        if (!tag && API.th && window.__INITIAL_STATE__?.epInfo?.subtitles) {
            if (window.__INITIAL_STATE__.epInfo.subtitles[0]) {
                API.config.closedCaption && API.closedCaption.getCaption(window.__INITIAL_STATE__.epInfo.subtitles.reduce((s, d) => {
                    s.push({
                        ai_type: 0,
                        id: d.id,
                        id_str: d.id,
                        is_lock: false,
                        lan: d.key,
                        lan_doc: d.title,
                        subtitle_url: d.url,
                        type: 0
                    });
                    return s;
                }, []));
                tag = true;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    tag = false;
                }, 1000);
            }
        }
        return true;
    }, res => {
        try {
            if (API.statusCheck(res.status)) {
                let subtitle = "", view_points;
                res.response.replace(/<subtitle>.+?<\\/subtitle>/, (d) => {
                    subtitle = d.replace("<subtitle>", "").replace("</subtitle>", "");
                });
                res.response.replace(/<view_points>.+?<\\/view_points>/, (d) => {
                    view_points = d.replace("<view_points>", "").replace("</view_points>", "");
                });
                subtitle && API.config.closedCaption && API.closedCaption.getCaption(JSON.parse(subtitle).subtitles);
                view_points && API.config.segProgress && new API.SegProgress(JSON.parse(view_points));
            }
            else {
                // 404会触发接口多次请求，需要过滤
                !tag && API.xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: API.cid, aid: API.aid, type: 1 }),
                    responseType: "json",
                    credentials: true
                }, true).then(data => {
                    API.config.closedCaption && data?.data?.subtitle?.subtitles && API.closedCaption.getCaption(data.data.subtitle.subtitles);
                    API.config.segProgress && data.data.view_points && data.data.view_points[1] && new API.SegProgress(data.data.view_points);
                });
                tag = true;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    tag = false;
                }, 1000);
            }
        }
        catch (e) { }
    }, false);
    API.xhrhookAsync("api.bilibili.com/x/player/carousel.so", undefined, async () => {
        let str = \`<msg><item bgcolor="#000000" catalog="news"><![CDATA[<a href="//app.bilibili.com/?from=bfq" target="_blank"><font color="#ffffff">客户端下载</font></a>]]></item><item bgcolor="#000000" catalog="news"><![CDATA[<a href="http://link.acg.tv/forum.php" target="_blank"><font color="#ffffff">bug反馈传送门</font></a>]]></item></msg>'\`;
        try {
            const arr = await Promise.all([
                API.xhr.get("//api.bilibili.com/pgc/operation/api/slideshow?position_id=531", { responseType: "json" }).then(d => {
                    return d.result.reduce((s, d, i) => {
                        s += \`<item tooltip="" bgcolor="#000000" catalog="bangumi" resourceid="2319" srcid="\${2320 + i}" id="\${314825 + i}"><![CDATA[<a href="\${d.blink}" target="_blank"><font color="#FFFFFF">\${d.title}</font></a>]]></item>\`;
                        return s;
                    }, "");
                }).catch(e => {
                    API.debug.error("播放器消息", "bangumi", e);
                    return "";
                }),
                API.xhr.get("https://api.bilibili.com/x/web-show/res/loc?pf=0&id=4694", { responseType: "json" }).then(d => {
                    return d.data.reduce((s, d, i) => {
                        d.name && (s += \`<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="\${2320 + i}" id="\${314825 + i}"><![CDATA[<a href="\${d.url}" target="_blank"><font color="#FFFFFF">\${d.name}</font></a>]]></item>\`);
                        return s;
                    }, "");
                }).catch(e => {
                    API.debug.error("播放器消息", "system", e);
                    return "";
                }),
                API.xhr.get("https://api.bilibili.com/x/web-interface/search/square?limit=10", { responseType: "json" }).then(d => {
                    return d.data.trending.list.reduce((s, d, i) => {
                        s += \`<item tooltip="" bgcolor="#000000" catalog="news" resourceid="2319" srcid="\${2320 + i}" id="\${314825 + i}"><![CDATA[<a href="https://search.bilibili.com/all?keyword=\${encodeURIComponent(d.keyword)}" target="_blank"><font color="#FFFFFF">\${d.keyword}</font></a>]]></item>\`;
                        return s;
                    }, "<msg>");
                }).catch(e => {
                    API.debug.error("播放器消息", "news", e);
                    return "";
                })
            ]);
            str = arr.sort(() => 0.5 - Math.random()).reduce((s, d) => {
                s += d;
                return s;
            }, "<msg>") + "</msg>";
        }
        catch (e) {
            API.debug.error("播放器消息", e);
        }
        const dom = new DOMParser().parseFromString(str, "text/xml");
        return {
            response: dom,
            responseXML: dom
        };
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/playinfo.js`;
/*!***********************!*/
/**/modules["timeline.js"] = /*** ./src/vector/timeline.js ***/
`
    /** 番剧时间表栈 */
    const inline = [];
    /** 提取时间，格式hh:mm */
    function getDate(ctx) {
        let result = "";
        ctx.replace(/\\d{2}:\\d{2}/, d => result = d);
        return result;
    }
    /**
     * 整体当日数据
     * @param title 当日名字：周x
     * @param item 当日番剧数据表
     */
    function decodeInline(title, item) {
        let i = 0;
        switch (title) {
            case "周一":
                i = 1;
                break;
            case "周二":
                i = 2;
                break;
            case "周三":
                i = 3;
                break;
            case "周四":
                i = 4;
                break;
            case "周五":
                i = 5;
                break;
            case "周六":
                i = 6;
                break;
            case "周日":
                i = 7;
                break;
        }
        inline[i] || (inline[i] = {});
        item.forEach(d => {
            let time = getDate(d.content);
            if (time) {
                inline[i][time] || (inline[i][time] = []);
                inline[i][time].push({
                    cover: "",
                    delay: 0,
                    delay_id: 0,
                    delay_index: "",
                    delay_reason: "",
                    ep_cover: "",
                    episode_id: -1,
                    follows: d.positions.position3,
                    plays: d.positions.position2,
                    pub_index: d.positions.position4,
                    pub_time: time,
                    pub_ts: -1,
                    published: 1,
                    season_id: d.item_id,
                    square_cover: d.image,
                    title: d.title
                });
            }
        });
    }
    API.doWhile(() => document.querySelector("#bili_bangumi > .bangumi-module")?.__vue__ || window?.__INITIAL_STATE__, async (d) => {
        try {
            const index = await API.url.getJson("app.bilibili.com/x/v2/activity/index", { page_id: 167998 });
            const item = index.data.cards[0].item[0].item;
            await Promise.all(item.reduce((s, d) => {
                s.push(API.url.getJson("app.bilibili.com/x/v2/activity/inline", { page_id: d.item_id }).then(t => {
                    const item = t.data.cards[0].item;
                    decodeInline(d.title, item);
                }));
                return s;
            }, []));
            const source = JSON.parse(JSON.stringify(d.timeline || d.timingData));
            source.forEach((d) => {
                const i = d.day_of_week;
                Object.entries(inline[i]).forEach(t => {
                    if (d.episodes) { // 主页
                        d.episodes.push(...t[1]);
                    }
                    else { // 新番时间表
                        d.seasonMap[t[0]] || (d.seasonMap[t[0]] = []);
                        d.seasonMap[t[0]].push(...t[1]);
                    }
                });
            });
            d.timeline ? d.timeline = source : d.timingData = source;
        }
        catch (e) {
            API.toast.error("获取港澳台番剧时间线出错 ಥ_ಥ");
            API.debug.error("港澳台番剧时间线", e);
        }
    });

//# sourceURL=file://@Bilibili-Old/vector/timeline.js`;
/*!***********************!*/
/**/modules["urlCleaner.js"] = /*** ./src/vector/urlCleaner.js ***/
`
    /** 垃圾参数 */
    const paramsSet = new Set([
        'spm_id_from',
        'from_source',
        'msource',
        'bsource',
        'seid',
        'source',
        'session_id',
        'visit_id',
        'sourceFrom',
        'from_spmid',
        'share_source',
        'share_medium',
        'share_plat',
        'share_session_id',
        'share_tag',
        'unique_k',
        'csource'
    ]);
    /** url处理栈 */
    const hookStack = [];
    /** 垃圾参数操作 */
    API.urlCleaner = {
        /**
         * 添加垃圾参数
         * @param key 参数名
         */
        addParam: (key) => paramsSet.add(key),
        /**
         * 移除垃圾参数
         * @param key 参数名
         */
        removeParam: (key) => paramsSet.delete(key),
        /**
         * 添加url处理
         * @param param url匹配关键词，必须全部匹配
         * @param callback 处理匹配url的回调函数，参数为url格式化后的对象
         */
        hook: (param, callback) => {
            API.isString(param) ? hookStack.push([[param], callback]) : hookStack.push([param, callback]);
        }
    };
    /**
     * 清理url
     * @param str 原url
     * @returns 新url
     */
    function clean(str) {
        const url = new API.UrlFormat(str);
        hookStack.forEach(d => {
            d[0].every(d => str.includes(d)) && d[1](url);
        });
        const params = url.params();
        params.bvid && (params.aid = API.abv(params.bvid), delete params.bvid); // 旧版页面一般不支持bvid，转化为aid
        params.aid && (!Number(params.aid)) && (params.aid = API.abv(params.aid)); // 部分写作aid读作bvid也得转化
        paramsSet.forEach(d => {
            Reflect.deleteProperty(params, d);
        });
        // 非参数型bv号转化为av号;
        return url.toJSON().replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, s => "av" + API.abv(s));
    }
    /** 地址备份 */
    let locationBackup;
    /** 处理地址栏 */
    function cleanLocation() {
        const { href } = location;
        if (href === locationBackup)
            return;
        API.replaceUrl(locationBackup = clean(href));
    }
    /** 处理href属性 */
    function anchor(list) {
        list.forEach(d => {
            if (!d.href)
                return;
            d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com")); // tv域名失效
            d.href.includes("account.bilibili.com/login?act=exit") && (d.href = "javascript:void(0);", d.onclick = () => API.loginExit()); // 修复退出页面
            d.href = clean(d.href);
        });
    }
    /** 检查a标签 */
    function click(e) {
        var f = e.target;
        for (; f && "A" !== f.tagName;) {
            f = f.parentNode;
        }
        if ("A" !== (null == f ? void 0 : f.tagName)) {
            return;
        }
        anchor([f]);
    }
    cleanLocation(); // 及时处理地址栏
    // 处理注入的节点
    let timer;
    API.observerAddedNodes((node) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            cleanLocation();
            node.querySelectorAll && anchor(node.querySelectorAll("a"));
            node.tagName == "A" && anchor([node]);
        }, 250);
    });
    API.loadAfterClear(() => {
        // 处理点击事件
        window.addEventListener("click", click, !1);
        // 处理右键菜单
        window.addEventListener("contextmenu", click, !1);
    });

//# sourceURL=file://@Bilibili-Old/vector/urlCleaner.js`;
/*!***********************!*/
/**/modules["vector.js"] = /*** ./src/vector/vector.js ***/
`
    if (API.uid) {
        // 修复动态时间戳
        const offset = API.getCookies()[\`bp_video_offset_\${API.uid}\`];
        if (offset) {
            API.setCookie(\`bp_t_offset_\${API.uid}\`, offset);
        }
    }
    API.config.developer && Reflect.set(window, "API", API);
    // 重写模式下，引导之前加载的模块注册的回调都会失效
    // 为此，相关回调包装在\`loadAfterClear\`方法中
    API.importModule("urlCleaner.js"); // url清洁
    API.importModule("bbComment.js"); // 评论区
    // 重构引导
    const keepNew = API.sessionStorage.getItem("keepNew");
    const vector = API.sessionStorage.getItem("vector")?.split(" ");
    API.sessionStorage.removeItem("vector");
    if (keepNew) {
        API.sessionStorage.removeItem("keepNew");
        Promise.resolve().then(() => API.toast.warning("这似乎是一个互动视频？", "旧版页面并不支持 ಥ_ಥ"));
    }
    else if (API.rebuildType == "重定向" && vector && vector[1]) {
        const name = vector.shift();
        const url = vector.shift().split("/");
        // 还原url地址
        url[2] = location.href.split("/")[2];
        API.replaceUrl(url.join("/"));
        vector[0] && (API.title = vector.join(" ")); // 记录标题
        API.path = location.href.split("/"); // 重构path属性
        document.documentElement.removeAttribute("style"); // 移除根元素style样式
        switch (name) {
            case "index":
                API.importModule("index.js"); // 主页
                break;
            case "av":
                API.importModule("av.js"); // av
                break;
            case "bangumi":
                API.importModule("bangumi.js"); // bangumi
                break;
            case "watchlater":
                API.importModule("watchlater.js"); // watchlater
                break;
            case "player":
                API.importModule("player.js"); // player
                break;
            case "playlist":
                API.importModule("playlist.js"); // playlist
                break;
            case "ranking":
                API.importModule("ranking.js"); // 排行榜
                break;
            case "read":
                API.importModule("read.js");
                break;
            case "search":
                API.importModule("search.js");
                break;
        }
    }
    else {
        // 重构判定
        if (API.config.index && API.path[2] == 'www.bilibili.com' && (!API.path[3] || (API.path[3].startsWith('\\?') || API.path[3].startsWith('\\#') || API.path[3].startsWith('index.')))) {
            API.rebuildType == "重定向" ? API.redirect("index") : API.importModule("index.js");
        }
        if (API.config.av && /(\\/s)?\\/video\\/[AaBb][Vv]/.test(location.href)) {
            API.path[3] === "s" && API.replaceUrl(location.href.replace("s/video", "video")); // SEO重定向
            API.rebuildType == "重定向" ? API.redirect("av") : API.importModule("av.js");
        }
        if (API.config.bangumi && /\\/bangumi\\/play\\/(ss|ep)/.test(location.href)) {
            API.rebuildType == "重定向" ? API.redirect("bangumi") : API.importModule("bangumi.js");
        }
        if (API.config.watchlater && /\\/watchlater/.test(location.href)) {
            API.rebuildType == "重定向" ? API.redirect("watchlater") : API.importModule("watchlater.js");
        }
        if (API.config.player && /player\\./.test(location.href) && !location.href.includes("ancient")) {
            API.rebuildType == "重定向" ? API.redirect("player") : API.importModule("player.js");
        }
        if ((API.config.medialist && /\\/medialist\\/play\\//.test(location.href) && !/watchlater/.test(location.href)) || /\\/playlist\\/video\\/pl/.test(location.href)) {
            API.rebuildType == "重定向" ? API.redirect("playlist") : API.importModule("playlist.js");
        }
        if (API.config.player && /\\/festival\\//.test(location.href)) {
            API.importModule("bnj.js");
        }
        if (API.config.ranking && /\\/v\\/popular\\//.test(location.href)) {
            API.rebuildType == "重定向" ? API.redirect("ranking", document.referrer) : API.importModule("ranking.js");
        }
        if (API.config.read && /\\/read\\/[Cc][Vv]/.test(location.href)) {
            API.rebuildType == "重定向" ? API.redirect("read") : API.importModule("read.js");
        }
        if (API.config.search && API.path[2] == "search.bilibili.com") {
            API.rebuildType == "重定向" ? API.redirect("search") : API.importModule("search.js");
        }
        ;
        if (/live\\.bilibili\\.com/.test(location.href)) {
            API.importModule("live.js");
        }
        if (/space\\.bilibili\\.com/.test(location.href)) {
            API.importModule("space.js");
        }
        if (API.config.liveRecord && API.path[2] == "t.bilibili.com") {
            API.importModule("dynamic.js");
        }
        if (location.href.includes("www.bilibili.com/account/history")) {
            API.importModule("history.js");
        }
        if (window.self == window.top && API.path[2] == 'www.bilibili.com') {
            document.domain = "bilibili.com";
        }
        if (API.path[2] == "message.bilibili.com") {
            API.importModule("message.js");
        }
        if (/bangumi\\/media\\/md/.test(location.href)) {
            API.importModule("media.js");
        }
        if (API.config.timeline && /anime\\/timeline/.test(location.href)) {
            API.importModule("timeline.js");
        }
        if (API.config.album && /t.bilibili.com\\/\\d+/.test(location.href)) {
            API.importModule("album.js");
        }
    }
    API.config.logReport && API.importModule("logReport.js"); // 日志拦截
    API.importModule("protobufDanmaku.js"); // 新版弹幕
    API.config.section && API.importModule("globalSection.js"); // 还原旧版顶栏
    API.importModule("playinfo.js"); // 视频源修复及记录
    API.importModule("automate.js"); // 自动化操作
    API.doWhile(() => document.readyState === 'complete', () => {
        window.top === window.self && API.showSettingEntry(); // 绘制设置UI
    });

//# sourceURL=file://@Bilibili-Old/vector/vector.js`;
/*!***********************!*/
/**/modules["videoLimit.js"] = /*** ./src/vector/videoLimit.js ***/
`
    const Backup = {};
    class HookTimeOut {
        constructor() {
            this.hook = setTimeout;
            window.setTimeout = (...args) => {
                if (args[1] && args[1] == 1500 && args[0] && args[0].toString() == "function(){f.cz()}") {
                    API.toast.warning("禁用播放器强制初始化！", ...args);
                    return Number.MIN_VALUE;
                }
                return this.hook.call(window, ...args);
            };
        }
        relese() {
            window.setTimeout = this.hook;
        }
    }
    async function customServer(obj, area) {
        if (area === "tw" && !API.config.videoLimit.tw)
            return customServer(obj, "hk");
        if (area === "hk" && !API.config.videoLimit.hk)
            return customServer(obj, "cn");
        if (area === "cn" && !API.config.videoLimit.cn)
            throw "无有效代理服务器地址";
        try {
            Object.assign(obj, {
                area,
                build: 6720300,
                device: "android",
                force_host: 2,
                mobi_app: "android",
                platform: "android",
                ts: new Date().getTime()
            });
            const result = API.jsonCheck(API.uposReplace(await API.xhr({
                url: API.urlsign(\`https://\${API.config.videoLimit[area]}/pgc/player/api/playurl\`, obj, 2)
            }), API.config.uposReplace.gat));
            if (result.code !== 0)
                throw result;
            return result;
        }
        catch (e) {
            API.debug.error("代理服务器", API.config.videoLimit[area], e);
            if (area === "tw")
                return customServer(obj, "hk");
            if (area === "hk")
                return customServer(obj, "cn");
            API.toast.error("代理服务器", API.config.videoLimit[area], e);
            throw "所有代理服务器都已失败！";
        }
    }
    API.xhrhookAsync("/playurl?", () => API.limit || API.th, async (args, type) => {
        let response; // 初始化返回值
        const hookTimeout = new HookTimeOut(); // 过滤播放器请求延时代码
        let obj = API.urlObj(args[1]); // 提取请求参数
        const accesskey = API.config.accessKey.key || undefined;
        obj.access_key = accesskey;
        Backup[API.epid] && (response = Backup[API.epid]); // 启用备份
        if (!response) {
            if (API.th) { // 泰区
                API.uposWithGM();
                Object.assign(obj, {
                    area: "th",
                    build: 1001310,
                    device: "android",
                    force_host: 2,
                    download: 1,
                    mobi_app: "bstar_a",
                    platform: "android",
                    ts: new Date().getTime()
                });
                try {
                    API.toast.info("尝试解除区域限制... 访问代理服务器");
                    response = API.jsonCheck(API.uposReplace(await API.xhr.GM({
                        url: API.urlsign(\`https://\${API.config.videoLimit.th || 'api.global.bilibili.com'}/intl/gateway/v2/ogv/playurl\`, obj, 12)
                    }), API.config.uposReplace.th));
                    response = { "code": 0, "message": "success", "result": await API.bstarPlayurl(response) };
                    API.__playinfo__ = response;
                    API.toast.success(\`解除区域限制！aid=\${API.aid}, cid=\${API.cid}\`);
                }
                catch (e) {
                    API.toast.error("解除限制失败 ಥ_ಥ");
                    API.debug.error("解除限制失败 ಥ_ಥ", e);
                    if (!accesskey) {
                        API.alert("这似乎是一个泰区限制视频，需要授权解析服务器使用您的账户才能尝试解析。<strong>但这意味着解析服务器会获得您账户的部分权限，请务必确认对反的可靠性然后操作！</strong><br>是否前往账户授权？", "解除限制出错", [
                            {
                                name: "立即前往",
                                callback: () => API.showSetting("accessKey")
                            },
                            {
                                name: "还是算了",
                                callback: () => { }
                            }
                        ]);
                    }
                    response = { "code": -404, "message": e, "data": null };
                }
            }
            else if (API.limit) { // 处理区域限制
                API.config.uposReplace.gat !== "不替换" && API.uposWithGM();
                obj.module = (API.__INITIAL_STATE__?.upInfo?.mid == 1988098633 || API.__INITIAL_STATE__?.upInfo?.mid == 2042149112) ? "movie" : "bangumi"; // 支持影视区投稿
                obj.fnval && (obj.fnval = String(API.fnval)); // 提升dash标记清晰度
                try {
                    API.toast.info("尝试解除区域限制... 访问代理服务器");
                    response = API.config.videoLimit.server === "内置" ? API.jsonCheck(API.uposReplace(await API.xhr.GM({
                        url: API.objUrl("https://www.biliplus.com/BPplayurl.php", obj)
                    }), API.config.uposReplace.gat)) : (delete obj.module, await customServer(obj, "tw"));
                    response = { "code": 0, "message": "success", "result": response };
                    API.__playinfo__ = response;
                    API.toast.success(\`解除区域限制！aid=\${API.aid}, cid=\${API.cid}\`);
                }
                catch (e) {
                    API.toast.error("解除限制失败 ಥ_ಥ");
                    API.debug.error("解除限制失败 ಥ_ಥ", e);
                    if (API.config.videoLimit.server === "自定义") {
                        API.alert("您将代理服务器设置为【自定义】，服务器返回出错，这可能是您由于未进行【账户授权】或者授权过期。<br>是否前往账户授权？", "解除限制出错", [
                            {
                                name: "立即前往",
                                callback: () => API.showSetting("accessKey")
                            },
                            {
                                name: "还是算了",
                                callback: () => { }
                            }
                        ]);
                    }
                    response = { "code": -404, "message": e, "data": null };
                }
            }
        }
        hookTimeout.relese();
        API.__playinfo__ = response;
        if (response.code === -404)
            throw type === "json" ? { response } : {
                response: JSON.stringify(response),
                responseText: JSON.stringify(response)
            };
        Backup[API.epid] = response;
        return type === "json" ? { response } : {
            response: JSON.stringify(response),
            responseText: JSON.stringify(response)
        };
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/videoLimit.js`;
/*!***********************!*/
/**/modules["bbComment.js"] = /*** ./src/vector/comment/bbComment.js ***/
`
    let loading = false, load = false, timer = 0; // 是否载入
    const arr = []; // 接口暂存
    Object.defineProperty(window, "bbComment", {
        configurable: true,
        set: v => {
            if (!load) {
                // 压栈
                arr.unshift(v);
            }
        },
        get: () => {
            if (load) {
                Promise.resolve().then(() => {
                    document.querySelectorAll("style").forEach(d => {
                        d.textContent && d.textContent.includes("热门评论") && d.remove();
                    });
                    API.addCss(API.getModule("comment.css"));
                    API.addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css" }, document.head);
                });
                Object.defineProperty(window, "bbComment", { configurable: true, value: arr[0] });
                // 出栈
                return arr[0];
            }
            return class {
                constructor() {
                    if (!loading) {
                        let text = GM.GM_getResourceText("comment.js");
                        if (text) {
                            new Function(text)();
                        }
                        else {
                            API.toast.warning("外部资源：comment.js 加载失败！", "无法恢复翻页评论区！");
                        }
                        load = true;
                    }
                    loading = true;
                    setTimeout(() => new window.bbComment(...arguments), 100);
                }
                on() { }
            };
        }
    });
    Object.defineProperty(window, "initComment", {
        configurable: true,
        set: v => true,
        get: () => {
            if (load) {
                Promise.resolve().then(() => {
                    document.querySelectorAll("style").forEach(d => {
                        d.textContent && d.textContent.includes("热门评论") && d.remove();
                    });
                    API.addCss(API.getModule("comment.css"));
                    API.addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css" }, document.head);
                });
                function initComment(tar, init) {
                    new arr[0](tar, init.oid, init.pageType, init.userStatus);
                }
                Object.defineProperty(window, "initComment", { configurable: true, value: initComment });
                // 出栈
                return initComment;
            }
            return function () {
                if (!loading) {
                    let text = GM.GM_getResourceText("comment.js");
                    if (text) {
                        new Function(text)();
                    }
                    else {
                        API.toast.warning("外部资源：comment.js 加载失败！", "无法恢复翻页评论区！");
                    }
                    load = true;
                }
                loading = true;
                setTimeout(() => window.initComment(...arguments), 100);
            };
        }
    });
    API.config.commentLinkDetail && API.observerAddedNodes((node) => {
        if (/l_id/.test(node.id) || /reply-wrap/.test(node.className)) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = undefined;
                document.querySelectorAll(".comment-jump-url").forEach((d, i, e) => {
                    if (d.href && !d.href.includes(d.text)) {
                        const arr = d.href.split("/");
                        let text = arr[arr.length - 1] || arr[arr.length - 2];
                        text.toLowerCase().startsWith("bv") && (text = API.abv(text));
                        e[i].title = d.text;
                        e[i].text = text;
                    }
                });
            }, 100);
        }
    });
    /** 楼层号栈 */
    const oids = new Proxy({}, {
        set: (t, p, v, r) => {
            !Reflect.has(t, p) && Promise.resolve().then(() => {
                let rp = document.querySelector(\`[data-id="\${p}"]\`);
                rp && API.addElement("span", { class: "floor" }, rp.querySelector(".info"), \`#\${v}\`, true);
            });
            return Reflect.set(t, p, v, r);
        }
    });
    const oidc = [];
    API.jsonphook("api.bilibili.com/x/v2/reply/reply?", param => {
        const params = API.urlObj(param);
        const { oid, root, type } = params;
        oidc.push(API.url.getJson("api.bilibili.com/x/v2/reply/detail", { oid, root, type }));
        params.root && !Reflect.has(oids, params.root) && API.url.getJson("api.bilibili.com/x/v2/reply/detail", { oid, root, type }, true);
        return param;
    }, r => {
        setTimeout(() => oidc.shift()?.then(d => {
            if (d.code === 0) {
                const root = d.data.root;
                oids[root.rpid] = root.floor;
                root.replies.forEach((d) => {
                    oids[d.rpid] = d.floor;
                });
            }
        }));
        return r;
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/comment/bbComment.js`;
/*!***********************!*/
/**/modules["comment.css"] = /*** ./src/vector/comment/comment.css ***/
`.bb-comment .comment-header .header-page,
.comment-bilibili-fold .comment-header .header-page {
    float: right;
    line-height: 36px;
}

.bb-comment .comment-list .list-item .user .text-con,
.comment-bilibili-fold .comment-list .list-item .user .text-con {
    margin-left: initial;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con .user>a,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con .user>a {
    margin-left: initial;
}

.user-card .info .user .vip-icon {
    max-width: 58px;
    height: 16px;
    border-radius: 2px;
    margin-left: 8px;
    background-color: #FF6699;
    font-size: 12px;
    font-weight: 400;
    color: #fff;
    white-space: nowrap;
    padding: 1px;
    padding-inline: 4px;
}

.user-card .info .verify {
    color: #9499A0;
    line-height: 17px;
    margin-top: 11px;
}

.user-card .info .verify .auth {
    display: inline-block;
    vertical-align: bottom;
    position: relative;
    left: -3px;
    width: 16px;
    height: 16px;
}

.reply-item .reply-con .user .stick {
    zoom: 0.9;
}`;
/*!***********************!*/
/**/modules["danmakuHashId.css"] = /*** ./src/vector/danmaku/danmakuHashId.css ***/
`/* 反查弹幕发送者相关样式 */
.bb-comment,
.comment-bilibili-fold {
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
    font-size: 0;
    zoom: 1;
    min-height: 100px;
    background: #fff;
}

.bb-comment .comment-list,
.comment-bilibili-fold .comment-list {
    padding-top: 20px;
}

.bb-comment *,
.comment-bilibili-fold * {
    box-sizing: content-box;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face {
    display: inline-block;
    position: relative;
    margin-right: 10px;
    vertical-align: top;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face img,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con {
    display: inline-block;
    width: calc(100% - 34px);
}

.bb-comment .comment-list .list-item .user,
.comment-bilibili-fold .comment-list .list-item .user {
    font-size: 12px;
    font-weight: 700;
    line-height: 18px;
    padding-bottom: 4px;
    display: block;
    word-wrap: break-word;
    position: relative;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con .user .name,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con .user .name {
    position: relative;
    top: -1px;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .level,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .level {
    margin: 0 15px 0 8px;
}

.bb-comment .comment-list .list-item .user .level.l0,
.comment-bilibili-fold .comment-list .list-item .user .level.l0 {
    background-position: -23px -28px
}

.bb-comment .comment-list .list-item .user .level.l1,
.comment-bilibili-fold .comment-list .list-item .user .level.l1 {
    background-position: -23px -92px
}

.bb-comment .comment-list .list-item .user .level.l2,
.comment-bilibili-fold .comment-list .list-item .user .level.l2 {
    background-position: -23px -156px
}

.bb-comment .comment-list .list-item .user .level.l3,
.comment-bilibili-fold .comment-list .list-item .user .level.l3 {
    background-position: -23px -220px
}

.bb-comment .comment-list .list-item .user .level.l4,
.comment-bilibili-fold .comment-list .list-item .user .level.l4 {
    background-position: -23px -284px
}

.bb-comment .comment-list .list-item .user .level.l5,
.comment-bilibili-fold .comment-list .list-item .user .level.l5 {
    background-position: -23px -348px
}

.bb-comment .comment-list .list-item .user .level.l6,
.comment-bilibili-fold .comment-list .list-item .user .level.l6 {
    background-position: -23px -412px
}

.bb-comment .comment-list .list-item .user .level.l7,
.comment-bilibili-fold .comment-list .list-item .user .level.l7 {
    background-position: -23px -476px
}

.bb-comment .comment-list .list-item .user .level.l8,
.comment-bilibili-fold .comment-list .list-item .user .level.l8 {
    background-position: -23px -540px
}

.bb-comment .comment-list .list-item .user .level.l9,
.comment-bilibili-fold .comment-list .list-item .user .level.l9 {
    background-position: -23px -604px
}

.bb-comment .comment-list .list-item .user .level,
.comment-bilibili-fold .comment-list .list-item .user .level {
    display: inline-block;
    width: 19px;
    height: 9px;
    vertical-align: middle;
    margin: 0 8px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAMAAAB6fSTWAAAA51BMVEUAAACYoKhwd3yboqni5emDjJL7+/yZoqoAodbnix8AodYAodaZoqoAodYAodaln5jnix8Aodbnix8AodaZoqoAodbnix8Aodbnix/yXY6ZoqoAodYAodYAodaZoqoAodaZoqryXY7yXY4AodbyXY6ZoqryXY6ZoqoAodaZoqoAodaZoqryXY7nix8AodYAodbnix+ZoqqZoqrnix8AodYAodbnix+Zoqr////19vfM0NcAoda/v7/l6e9MyP//u1PlL+z/s3yS0eWV3bL/bAAVFRX/AACEHPnnix+M2fn/1pbyXY4iIiIkv4BgAAAAOHRSTlMA9fUreZKu4eI+EfDtgtwP7AkexYcv2WfIsP3refnX0mcmGUPyxsScjXkXF++zoZpMMyn+Ppl8Q6/LsKoAAA3QSURBVHja7NvdbtowGIfxP7UsaEqbfkGj0bWVpqofiK0f2nZALyD3f0V7E4KsbULCjpRA9fykQDjw4SOb2BEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG2cF4X64vzAeJc+/sDYeGDH3Q0e1MrV1x9q4eW0LNUTP2j4xPEHDS9gp70O50O1MRk9j5Tu13tZhX4+LdS5ejJvpnUlqCfzZloXsMPym99qFfrZ7Telh54vyop1Xk7VNevbqeas+KT5fD2eOR3b+FhR1/L84dJaz42SZNnPR2UnWZadKV7+Mi1rss7P1THXdB7u47iq83DP/3RsijtQpevQ78bjL/fS29CMHxTvana0vDjT5MTMviuSVb6movvO5Qe+Wr2vLvsRP6H7avW+ujxTOjaErrrw+mq+1K1hrqHWxoo3yjTS2kyRTssQeh9sEg+hO/uIZJN4CN3xLx07G7pC6G/3KaErhD65UKQyUGEfhbplaYfQlRK6Quja29CPj4W/febQn55ahn59vY+hO9VcWuhh/P6GfrxcUvq/PnHo965l6BcTRZruwNLdexnv05buYfzeLt2tc0qPkBi6qb77D31+o3ahP58o1mERQl8U/TyMc3bZjUt9GOfsshvHwzhsDt00jdf3fYZ+d9ky9KtHxcsPe99ec746NJO+veZ8dWiG7TVs9PGfzkOfr0PPb16TQn9eh57dTtoemCm0NQ7MAHH76OOVJylxH/2oNrtufQR2oa1xBBbYN/ZSy7ui8VILsF94TRUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAH3buoMVNIAzA8BxESA5ldyHkUui1p/Y6YrJ71v//g/rFmFoKaaMBdZPngTWzh+/4MqKTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwIMqyirnqizungfWqihzryzum5c6rFVkWrUfoa0i1Unzx+Y9NMfTPKzZvv6ZnlJ02n702ih1wnzz3muUzrrt6rpOS3kbFrMrzp0PpRdj57vOh9LdvbNer/WCob+9bFJn8zJ/6eWl87Y9l16OnW/6xpvuakvnvw5naW7bbX2y3W5f0xI2UXr/MbciV33nffBVLsbNH/vO++CPtnSuxT3o/k/z2td/+JGWEIkv0vmwobf596KcsqE3ORa2dK46nNLuLsNiXpF3/F2kRUTkC3QeqnzpPBadXI2bv3Qei07Mg9CvlR6dLyDnc+ehqqou9Dxu/tJ5zB+70HOCtYf+Nd3sgUKvcqedGno/3widTxL6Lt3skW7do+/ofPKtezh17tadf4YeTp8rCP1Lup2HcR7GMSL00BfeNb5o6N/TzR7r9Vobnd/zeq2Jzr1e47rD35YM/dsujfMwB2bauE4/MNMdl7Ghs2r7+o5HcY7AOgILn4AvtcAz8DVVeAZ+eAKegp+SAgAAAAAAAAAAAAAAAAAAAH6xczctbQRxAIf/RmHDGgyiQWisCkV8gxaF0nZDTjkF+v0/T4dNrIFe6g5JnOR5srksDHP6wTCzDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlKhZdXRY3HjgPzS/Vkybd5fW/FyRxmfOr3RorS/0ZHqUEXqSxufODyRrDD1pckJPmuz5gQihQxc3g8GnwcJDdHAxPp4ct8aXUR6hsx+qp6iiNbx6jvfrP0Y/WvX1KIojdDZtthCbVbVP6+a8S+jt07q4j+IsQjvIDH2eGfpU6Dtutioi2WLoT1d5oT+eRHEWof0+yAt9Ms8LvZkKfbfNoi28/be2GXrcHmaFHmflrd2XoafSs0KfzPNCb6ZC32kfK/SHh7zQL8vbjluGnkrPC30yzwu9mQp9l62Evv2le7zc5oU+OovS/A29J3Q66BT6Vjbjhm+hx6BD6PVb6DGO0ryG3rN0Z41e406/jNBzz9FvI16qZHDX7Rz97DRGJ8n4a5RmGXrPZhzr1Gb92vjyzaYNh3fnMbwaJtFFXX+/j/qkruvTKM4itJ7jNdZq9q/YuFT5j6iiu9PrL9GPIvlghj3yXD1VkWHUfxS60Pnwbg7uIsfF529RJKHDHhA67AEXT8AecJUU7IHG5ZAAAAAAAAAAAAAAAMAfdu6etUEgDuDwNcnkUMgQshS6dmrXeOKSLdDv/3kqlxeELCVXk9T/84Aogtz0w+OUAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAmVqu8ti/ex74RWe5b8dueH43Vj0+8PdWfVsV2mrofOyG8YUOU8ttXWh5Vxd6boUOV4QOt9h2F28pHqETwxD4cBTvmxSO0Lm3/VGqUBd695HCuYT2Uhn6oTL0Xuhzth8rdx4Z+msKJ587/64L/dDVhd5noc/ZPpXCy1E8LPQi3tw9nzuvC/3Q1YXeZ6HP2pOFHm85Lp86rwv90NWF3mehz9so9CeYug+X0Rz7WgidKzN+o0cN3dSdaZ36LufHhL7tRj5TNLk9WliMY0Il69J3xap7paYpkTdNs07h5PZk4fMa09lfS/e3Djlr98MM0WyELnQC2HZfKSShQwBChwBsPAEB2EoKIljaHBIAAAAAAAAAAPhhzw5WGwSiMIzekCGbkF1Wgb5HhzIL3/+lClaCEixCCMl4zwER3H/8OgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADtX2gYlgJ617w1aAD0TOiQgdEhA6JCA0CEBoUMCQocEhA4JCB0SEDokIHRIQOiQgNBJ6nq4xlMu50t0Q+gkdbsd4ilfP+fohtB5o+FPbGTRhU4vhrkYr+CB0OnbEPfChb5O6PTtU0L36i505l4Z+vRkI4dxQqcXi9AHi75C6PRt6nu6+0ZfIXT6NmY99i30/widrg0z/qOvEjo4jBM6WHShQ0ZChwSEDgkIHRIQOiQgdEhA6JDAQ+i1tSp02Je2rLy2cjyWVqvQYUfaYsxPJUbl1KrQYTfaYszjbpx1of+yZ8c4DINAFAW3QJwpFO64/5kiMAUU6eP1jGS5oH76loEcajvGfDlnvdUAnqxc7dOuY8yPWZ/HJYBHK3WN+e9jnQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPyNfgsgmb6LQeiQTo9Z+P2ERYeUhA4vsIXu0x2y2kOfhA75rL7HW+iQ1cx69O2vO+TVN+7RAQAAAAAAAAAAvuzZwQnAIBBE0a1u+i8pqBch15wm74FawWdFAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvpFjgDK5zSJ0qJPZhZ81JjpUEjr8wBW6qzu0ek10oUOfTJZ1Ch1aZW/JeHWHXrn4RwcAAAAAAHjYs2MbgIEQCIKURv9VWY8dfAGOjhkJUcFGBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8I9+FRCmb3UIHeJ0TeFzQ+iQR+iwgNBhAaHDAl/f5wsdUk3W07fQIVZf7OgAAAAPe3ZQA0AIQ1Gw7r5/Rxu6lwrgVGYSqIIXCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANyRXwHLZKpD6LBOqgvv1UPosI/Q4QEjdFd32MqJDg9I5ThT6LBVekvKqzvslcE/+sduHZ0AAIIAFHQ5918pMggH6MvuQJzgoQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kEcAw2cUmdBgnowqvqSV0mEfo8IEWutcdprqh17joiz07tgEQhgEgmBoEUuQaZZDU3n8lCBUbIFl3hT3BNzaUlC2XtYUOVeU7MpurO9SVH/7oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+L+YgGVBZzaUBp2xA6FNaP8zqPmEPoUFaPueyxCf1mz45NIIaBIAAqdCKBcOTAgZBDh86uhO+/n9fzTZhjJtgOloNbSKtGm322qGX3jIOsWjwrn2gFSOuMvrLHWYC0WkwXHbKrsc0+t6gFSKvv8bP3AuT139H1HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4OXGcV3HKEBi4/4st6Z/2bODG4BhEAaArJFnoyjLeP99WnUMuHuwgQXC0NnK2vsbBfR1sqt2TgF9CToM4HSHATzjYIJnJeo16O3mdwvoS9BhhqSA7q51DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAve3AgAAAAAADk/9oIqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrCHhwIAAAAAAD5vzaCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwBwcCAAAAAED+r42gqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqirtwQEJAAAAgKD/r9sRqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8BfEgGFMI1IvvAAAAABJRU5ErkJggg==) no-repeat;
}`;
/*!***********************!*/
/**/modules["danmakuHashId.js"] = /*** ./src/vector/danmaku/danmakuHashId.js ***/
`
    API.addCss(API.getModule("danmakuHashId.css"));
    class DanmakuHashId {
        constructor(crc) {
            this.count = 0; // 当前查询弹幕序号
            // 设置正在查询的弹幕数量
            DanmakuHashId.count = DanmakuHashId.count ? DanmakuHashId.count + 1 : 1;
            // 当前查询弹幕排序
            this.count = DanmakuHashId.count;
            // 临时缓存已查询的 mid
            DanmakuHashId.catch = DanmakuHashId.catch || {};
            this.hash = crc;
            this.mid = API.midcrc(this.hash);
            this.getInfo();
        }
        async getInfo() {
            try {
                this.node = document.querySelector(".bilibili-player-context-menu-container.active");
                if (!this.node)
                    return setTimeout(() => { this.getInfo(); }, 100);
                this.node = this.node.children[0];
                let j = 0; // 找到的节点序号
                for (let i = this.node.children.length - 1; i >= 0; i--) {
                    if (this.node.children[i].textContent.includes("mid")) {
                        this.dm = this.node.children[i];
                        j++;
                        if (this.count === j)
                            break;
                    }
                }
                if (!this.dm)
                    return setTimeout(() => { this.getInfo(); }, 100);
                if (this.dm.tagName != "LI")
                    return;
                DanmakuHashId.catch[this.mid] = DanmakuHashId.catch[this.mid] || API.jsonCheck(await API.xhr({ url: API.objUrl("https://api.bilibili.com/x/web-interface/card", { mid: this.mid }) }, true));
                this.dm.innerHTML = '<div style="min-height:0px;z-index:-5;background-color: unset;" class="bb-comment"><div style="padding-top: 0;" class="comment-list"><div class="list-item"><div class="reply-box"><div style="padding:0px" class="reply-item reply-wrap"><div style="margin-left: 15px;vertical-align: middle;" data-usercard-mid="' +
                    this.mid + '" class="reply-face"><img src="' +
                    DanmakuHashId.catch[this.mid].data.card.face + '@52w_52h.webp" alt=""></div><div class="reply-con"><div class="user" style="padding-bottom: 0;top: 3px;"><a style="display:initial;padding: 0px;" data-usercard-mid="' +
                    this.mid + '" href="//space.bilibili.com/' +
                    this.mid + '" target="_blank" class="' +
                    (DanmakuHashId.catch[this.mid].data.card.vip.vipType > 1 ? "name vip-red-name" : "name") + '">' + DanmakuHashId.catch[this.mid].data.card.name + '</a> ' +
                    DanmakuHashId.catch[this.mid].data.card.sex + '<a style="display:initial;padding: 0px;" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' +
                    (DanmakuHashId.catch[this.mid].data.card.is_senior_member ? 7 : DanmakuHashId.catch[this.mid].data.card.level_info.current_level) + '"></i></a></div></div></div></div></div></div></div>';
                DanmakuHashId.count--;
            }
            catch (e) {
                DanmakuHashId.count--;
                API.toast.error("反差弹幕发送者信息失败 ಥ_ಥ");
                API.debug.error(e);
            }
        }
    }
    DanmakuHashId.count = 0; // 正在查询弹幕数
    DanmakuHashId.catch = {}; // 已查询弹幕缓存
    window.danmakuHashId = (crc) => {
        try {
            const check = new DanmakuHashId(crc);
            return \`hash: \${check.hash} mid: \${check.mid}\`;
        }
        catch (e) {
            API.debug.error(e);
        }
    };

//# sourceURL=file://@Bilibili-Old/vector/danmaku/danmakuHashId.js`;
/*!***********************!*/
/**/modules["historyDanmaku.js"] = /*** ./src/vector/danmaku/historyDanmaku.js ***/
`
    const id = API.xhrhookAsync("history?type=", (args) => {
        const param = API.urlObj(args[1]);
        if (!window.player?.setDanmaku) {
            API.removeXhrhook(id);
            API.toast.warning("托管原生脚本未开启或resource资源未存在，无法修复历史弹幕~");
            return false;
        }
        else if (!param.date)
            return false;
        API.xhr({
            url: \`https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=\${API.cid}&date=\${param.date}\`,
            responseType: "arraybuffer",
            credentials: true
        }).then((seg) => {
            let dm = API.danmaku.danmakuFormat(API.danmaku.segDmDecode(seg));
            window.player?.setDanmaku(dm);
            API.config.downloadOther && API.pushDownload({
                group: "弹幕",
                data: dm,
                up: "历史",
                down: \`N/A\`,
                callback: () => API.danmaku.saveDanmaku(dm, \`\${API.title || API.cid}\`)
            });
        }).catch((e) => {
            API.toast.error("载入历史弹幕失败", "请尝试刷新页面");
            API.toast.error(e);
        });
        return true;
    }, undefined, false);

//# sourceURL=file://@Bilibili-Old/vector/danmaku/historyDanmaku.js`;
/*!***********************!*/
/**/modules["listSoDanmaku.js"] = /*** ./src/vector/danmaku/listSoDanmaku.js ***/
`
    let workerPostMsg = Worker.prototype.postMessage;
    let list_so;
    Worker.prototype.postMessage = function (aMessage, transferList) {
        if (aMessage.url && aMessage.url.includes("list.so")) {
            const obj = API.urlObj(aMessage.url);
            list_so = this;
            let triggerOnMsg = (danmaku, loadTime, parseTime) => list_so.onmessage({
                data: {
                    code: 0,
                    danmakuArray: danmaku,
                    loadTime: loadTime,
                    parseTime: parseTime,
                    sendTip: "",
                    state: 0,
                    textSide: "",
                    total: danmaku.length.toString()
                }
            });
            let loadDanmaku = (loadTime) => API.danmaku.getSegDanmaku(undefined, obj.oid).then((Segments) => {
                // 旧播放器需要得到耗时数据(网络请求，数据处理)
                loadTime = new Date() - loadTime;
                let parseTime = new Date();
                let danmaku = API.danmaku.danmakuFormat(Segments);
                parseTime = new Date() - parseTime;
                triggerOnMsg(danmaku, loadTime, parseTime);
                API.config.downloadOther && API.pushDownload({
                    group: "弹幕",
                    data: danmaku,
                    up: "当前",
                    down: \`N/A\`,
                    callback: () => API.danmaku.saveDanmaku(danmaku, \`\${API.title || API.cid}\`)
                });
            });
            loadDanmaku(new Date());
        }
        else {
            workerPostMsg.call(this, aMessage, transferList);
        }
    };

//# sourceURL=file://@Bilibili-Old/vector/danmaku/listSoDanmaku.js`;
/*!***********************!*/
/**/modules["liveDamaku.js"] = /*** ./src/vector/danmaku/liveDamaku.js ***/
`
    const protobufJSON = API.getModule("bilibiliBroadcast.json");
    const danmakuJSON = API.getModule("bilibiliBroadcastDanmaku.json");
    const root = GM.protobuf.Root.fromJSON(protobufJSON);
    const danmakuElem = GM.protobuf.Root.fromJSON(danmakuJSON).lookupType("bilibili.broadcast.message.main.DanmukuEvent");
    let sequence = 1;
    const message = {
        msgType: root.lookupType("BroadcastFrame"),
        targetPathType: root.lookupType("TargetPath"),
        beatReqType: root.lookupType("HeartbeatReq"),
        ackReqType: root.lookupType("MessageAckReq"),
        anyType: root.lookupType("google.protobuf.Any"),
        roomRequest: root.lookupType("RoomReq"),
        roomResp: root.lookupType("RoomResp"),
        roomEvents: {
            join: root.lookupType("RoomJoinEvent"),
            leave: root.lookupType("RoomLeaveEvent"),
            online: root.lookupType("RoomOnlineEvent")
        }
    };
    const targetPath = {
        "AUTH": "/bilibili.broadcast.v1.Broadcast/Auth",
        "HEARTBEAT": "/bilibili.broadcast.v1.Broadcast/Heartbeat",
        "SUBSCRIBE": "/bilibili.broadcast.v1.Broadcast/Subscribe",
        "UNSUBSCRIBE": "/bilibili.broadcast.v1.Broadcast/Unsubscribe",
        "MSG_ACK": "/bilibili.broadcast.v1.Broadcast/MessageAck",
        "ENTER": "/bilibili.broadcast.v1.BroadcastRoom/Enter",
        "ROOMREQ": "/bilibili.broadcast.v1.RoomReq",
        "ROOMRES": "/bilibili.broadcast.v1.RoomResp",
        "AUTHREQ": "/bilibili.broadcast.v1.AuthReq",
        "TARGETPATH": "/bilibili.broadcast.v1.TargetPath",
        "HEARTBEATRES": "/bilibili.broadcast.v1.HeartbeatResp",
        "MSG_ACK_REQ": "/bilibili.broadcast.v1.MessageAckReq"
    };
    const utils = {
        encodeAny: function (body, encoder, url) {
            return url = "type.googleapis.com" + url,
                message.anyType.create({
                    type_url: url,
                    value: encoder.encode(body).finish()
                });
        },
        toBuffer: function (body, encoder) {
            if (encoder.verify(body))
                return "";
            let t = encoder.create(body);
            return encoder.encode(t).finish();
        },
        toMsg: function (body, decoder) {
            let t;
            try {
                t = decoder.toObject(decoder.decode(new Uint8Array(body)));
            }
            catch (i) {
                API.debug.error(i);
            }
            return t;
        }
    };
    let encoder = new TextEncoder();
    let liveChatOld; // 对旧播放器建立的ws对象的引用
    let liveChat;
    // 为了获取ws对象的引用,hook WebSocket.send
    let wsHookRunOnce = true;
    const wssend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...arg) {
        if (wsHookRunOnce && this.url == 'wss://broadcast.chat.bilibili.com:4095/sub') {
            liveChatOld = this;
            // convertToArrayBuffer 编码一个旧播放器接受的数据包
            liveChatOld.convertToArrayBuffer = function (body, option) {
                let header = [{ "name": "Header Length", "key": "headerLen", "qg": 2, "offset": 4, "value": 16 }, { "name": "Protocol Version", "key": "ver", "qg": 2, "offset": 6, "value": 1 }, { "name": "Operation", "key": "op", "qg": 4, "offset": 8, "value": option }, { "name": "Sequence Id", "key": "seq", "qg": 4, "offset": 12, "value": 1 }];
                let headerBuf = new ArrayBuffer(16);
                let viewer = new DataView(headerBuf, 0);
                let bodyBuf = encoder.encode(JSON.stringify(body));
                viewer.setInt32(0, 16 + bodyBuf.byteLength);
                header.forEach(function (b) {
                    4 === b.qg ? viewer.setInt32(b.offset, b.value) : 2 === b.qg && viewer.setInt16(b.offset, b.value);
                });
                function mergeArrayBuffer(headerBuf, bodyBuf) {
                    headerBuf = new Uint8Array(headerBuf);
                    bodyBuf = new Uint8Array(bodyBuf);
                    var d = new Uint8Array(headerBuf.byteLength + bodyBuf.byteLength);
                    d.set(headerBuf, 0);
                    d.set(bodyBuf, headerBuf.byteLength);
                    return d.buffer;
                }
                return mergeArrayBuffer(headerBuf, bodyBuf);
            };
            // 切p和掉线之后需要重新启动hook,获得新的引用
            let onclose = liveChatOld.onclose;
            liveChatOld.onclose = function () {
                wsHookRunOnce = true;
                clearTimeout(liveChat.beatTimer);
                liveChat.close();
                onclose.call(this);
            };
            wsHookRunOnce = false;
            initLiveChat();
        }
        wssend.call(this, ...arg);
    };
    // onopen() -> auth() -> onmessage() -> onAuthed() -> subscribeBase() -> roomBase() -> 开始接收实时弹幕
    function initLiveChat() {
        liveChat = new WebSocket("wss://broadcast.chat.bilibili.com:7826/sub?platform=web", "proto");
        liveChat.binaryType = "arraybuffer";
        liveChat.beatTimer = 0;
        liveChat.msgFlag = {};
        liveChat.socketKey = "video://" + API.aid + "/" + API.cid;
        API.pgc && (liveChat.socketKey += "?sid=" + window.__INITIAL_STATE__.ssId + "&epid=" + window.__INITIAL_STATE__.epId);
        liveChat.sendMsg = function (body, encoder) {
            void 0 === encoder && (encoder = message.msgType);
            this.send(utils.toBuffer(body, encoder));
        };
        liveChat.auth = function () {
            this.sendMsg({
                options: {
                    sequence: ++sequence
                },
                targetPath: targetPath.AUTH,
                body: utils.encodeAny(message.anyType.create({}), message.anyType, targetPath.AUTHREQ)
            });
        };
        liveChat.onAuthed = function (t) {
            this.authed = !0;
            this.subscribeBase(["bilibili.broadcast.message.main.DanmukuEvent"]);
            this.roomBase(liveChat.socketKey);
        };
        liveChat.subscribeBase = function (t, e) {
            if (void 0 === e && (e = !0),
                t && t.length) {
                var i = ++sequence;
                this.msgFlag[i] = t,
                    this.sendMsg({
                        options: {
                            sequence: i
                        },
                        targetPath: e ? targetPath.SUBSCRIBE : targetPath.UNSUBSCRIBE,
                        body: utils.encodeAny(message.targetPathType.create({
                            targetPaths: t
                        }), message.targetPathType, targetPath.TARGETPATH)
                    });
            }
        };
        liveChat.roomBase = function (t) {
            let event = {
                id: t,
                join: message.roomEvents.join.create({})
            };
            var i = ++sequence;
            this.msgFlag[i] = t,
                this.sendMsg({
                    options: {
                        sequence: i
                    },
                    targetPath: targetPath.ENTER,
                    body: utils.encodeAny(message.roomRequest.create(event), message.roomRequest, targetPath.ROOMREQ)
                });
        };
        liveChat.onRoomMsg = function (t) {
            var e, i;
            if (null === (e = t.body) || void 0 === e ? void 0 : e.value) {
                var o = utils.toMsg(t.body.value, message.roomResp);
                if (null === (i = o.msg) || void 0 === i ? void 0 : i.targetPath) {
                    var r = utils.toMsg(o.msg.body.value, danmakuElem);
                    r.elems.forEach(function (v) {
                        liveChatOld.onmessage({
                            data: liveChatOld.convertToArrayBuffer({
                                cmd: 'DM',
                                info: [[v.progress / 1000, v.mode, v.fontsize, v.color, v.ctime, "", v.pool, v.midHash, v.idStr].join(","), v.content]
                            }, 5)
                        });
                    });
                }
            }
        };
        liveChat.heartBeat = function () {
            var i = this;
            this.beatTimer && clearTimeout(this.beatTimer);
            this.beatTimer = window.setTimeout((function () {
                if (i.readyState === 1) {
                    i.sendMsg({
                        options: {
                            sequence: ++sequence
                        },
                        targetPath: targetPath.HEARTBEAT,
                        body: utils.encodeAny(message.beatReqType.create({}), message.beatReqType, targetPath.HEARTBEATRES)
                    });
                    i.heartBeat();
                }
            }), 1e3 * 20);
        };
        liveChat.onopen = function () {
            this.auth();
        };
        liveChat.onclose = function () {
            if (liveChatOld.readyState === 1) {
                // 在番剧页面，每6分钟弹幕服务器（即使在用心跳包维持连接活跃的情况下）会主动断开连接，这时需要重连
                initLiveChat();
            }
            else {
                this.beatTimer && clearTimeout(this.beatTimer);
            }
        };
        liveChat.onmessage = function (i) {
            var t, a = utils.toMsg(i.data, message.msgType);
            if (this.heartBeat(), a) {
                if (null == a ? void 0 : a.targetPath)
                    switch (a.targetPath) {
                        case targetPath.AUTH:
                            this.onAuthed(a);
                            break;
                        case targetPath.SUBSCRIBE:
                            //this.onSubscribed(a);
                            break;
                        case targetPath.UNSUBSCRIBE:
                            //this.onUnSubscribed(a);
                            break;
                        case targetPath.HEARTBEAT:
                            //this.bsocket.emit(zd.B_HEARTBEAT, a);
                            break;
                        case targetPath.ENTER:
                            this.onRoomMsg(a);
                            break;
                        default:
                        //this.bsocket.emit(zd.B_MSG, a)
                    }
                delete this.msgFlag[null === (t = a.options) || void 0 === t ? void 0 : t.sequence];
            }
        };
    }

//# sourceURL=file://@Bilibili-Old/vector/danmaku/liveDamaku.js`;
/*!***********************!*/
/**/modules["protobufDanmaku.js"] = /*** ./src/vector/danmaku/protobufDanmaku.js ***/
`
    API.config.protobufDanmaku && API.importModule("listSoDanmaku.js");
    API.importModule("historyDanmaku.js");
    API.importModule("liveDanmaku.js");

//# sourceURL=file://@Bilibili-Old/vector/danmaku/protobufDanmaku.js`;
/*!***********************!*/
/**/modules["animated-banner.html"] = /*** ./src/vector/header/animated-banner.html ***/
`<style type="text/css">
    .animated-banner {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .animated-banner>.layer {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    @keyframes banner-fade-in {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }

    .animated-banner .layer {
        animation: banner-fade-in 0.7s;
    }
</style>`;
/*!***********************!*/
/**/modules["avatarAnimation.css"] = /*** ./src/vector/header/avatarAnimation.css ***/
`/* 鼠标放在顶栏上的动效 */
.bili-header-m .profile-info .i-face .face {
    border: 0
}

.bili-header-m .profile-info .i-face .pendant {
    transform: scale(0.5);
    width: 112px;
    height: 112px;
    left: -41px;
    bottom: -46px;
    opacity: 0;
    transition: opacity .1s ease-in
}

.bili-header-m .profile-info.on .i-face {
    left: 8px;
    top: 0;
    height: 32px;
    width: 32px;
    transform: translateY(10px) translateX(-16px) scale(2);
    transform-origin: top left
}

.bili-header-m .profile-info.on .i-face .legalize {
    transform: scale(0.5) translate(10px, 15px)
}

.bili-header-m .profile-info.on .i-face .pendant {
    opacity: 1
}

.bili-header-m .profile-info.on .i-face .face {
    border: 0;
    box-shadow: 0 0 0 2px #fff
}

.bili-header-m .profile-info.on .i-face.scale-in {
    transform: translateY(5px) translateX(-10px) scale(1.75)
}

.bili-header-m .profile-info.on .scale-in .face {
    height: 32px;
    width: 32px
}

.bili-header-m .profile-info.on .i-face.scale-in .legalize {
    transform: scale(0.5) translate(38px, 48px)
}`;
/*!***********************!*/
/**/modules["banner.js"] = /*** ./src/vector/header/banner.js ***/
`
    var _a;
    document.head.appendChild(API.createElements(API.htmlVnode(API.getModule("animated-banner.html"))));
    // 动态banner。移植自B站vue源码
    class Animate {
        constructor(v) {
            /**
             * 有在启用了动画banner的配置，且浏览器支持css filter时才加载动画banner的图片资源
             * safari浏览器在mac屏幕上模糊效果有性能问题，不开启
             */
            this.animatedBannerSupport = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('filter: blur(1px)')
                && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            this.layerConfig = {};
            /** layer表单 */
            this.resources = [];
            /** container 元素上有其他元素，需使用全局事件判断鼠标位置 */
            this.entered = false;
            this.extensions = [];
            this.handleMouseLeave = undefined;
            this.handleMouseMove = undefined;
            this.handleResize = undefined;
            if (this.animatedBannerSupport)
                this.mounted(v);
            if (v.is_split_layer !== 0) {
                API.addCss(".blur-bg {display:none}");
            }
            else
                API.addCss(".blur-bg {background:none !important;-webkit-backdrop-filter: blur(4px);backdrop-filter: blur(4px)}");
        }
        /**
         * 根据页面返回resourceId
         * @returns resourceId
         */
        static resourceId() {
            if (location.href.includes("v/douga"))
                return 1576;
            if (location.href.includes("/anime"))
                return 1612;
            if (location.href.includes("v/music"))
                return 1580;
            if (location.href.includes("/guochuang"))
                return 1920;
            if (location.href.includes("v/dance"))
                return 1584;
            if (location.href.includes("v/game"))
                return 1588;
            if (location.href.includes("v/knowledge"))
                return 1592;
            if (location.href.includes("v/tech"))
                return 3129;
            if (location.href.includes("v/life"))
                return 1600;
            if (location.href.includes("v/kichiku"))
                return 1608;
            if (location.href.includes("v/fashion"))
                return 1604;
            if (location.href.includes("v/ent"))
                return 1596;
            if (location.href.includes("v/cinephile"))
                return 2210;
            if (location.href.includes("/cinema"))
                return 1634;
            return 142;
        }
        async mounted(v) {
            this.layerConfig = JSON.parse(v.split_layer);
            if (!this.layerConfig.layers)
                return;
            try {
                if ("extensions" in this.layerConfig && "time" in this.layerConfig.extensions) {
                    let time = undefined, now = (Date.now() - (new Date).setHours(0, 0, 0, 0)) / 1e3;
                    let timeCode = Object.keys(this.layerConfig.extensions.time).sort((a, b) => parseInt(a) - parseInt(b));
                    for (let t of timeCode) {
                        if (parseInt(t) < now)
                            time = parseInt(t);
                        else
                            break;
                    }
                    let timelayers = this.layerConfig.extensions.time[time];
                    this.layerConfig.layers = timelayers[Math.floor(Math.random() * timelayers.length)].layers;
                }
                await Promise.all(this.layerConfig.layers.map(async (v, index) => {
                    return Promise.all(v.resources.map(async (i) => {
                        if (/\\.(webm|mp4)\$/.test(i.src)) {
                            const res = await API.xhr({ url: i.src, responseType: "blob" }, true);
                            const url = URL.createObjectURL(res);
                            const video = document.createElement('video');
                            video.muted = true;
                            // video.autoplay = true
                            video.loop = true;
                            video.src = url;
                            video.playsInline = true;
                            video.style.objectFit = 'cover'; // 元素尺寸大于视频实际尺寸时放大
                            this.resources[index] = video;
                            // 视频需要添加到dom树才能获取宽高
                            video.width = 0;
                            video.height = 0;
                            document.body.appendChild(video);
                            await new Promise(resolve => {
                                const onMetaLoad = () => {
                                    resolve(true);
                                    video.removeEventListener('loadedmetadata', onMetaLoad);
                                };
                                video.addEventListener('loadedmetadata', onMetaLoad);
                            });
                        }
                        else {
                            const img = document.createElement('img');
                            img.src = i.src;
                            await new Promise(resolve => img.onload = resolve);
                            this.resources[index] = img;
                        }
                    }));
                }));
            }
            catch (e) {
                API.debug.error('load animated banner images error', e);
                return;
            }
            let container = document.querySelector("#banner_link");
            if (!container) {
                container = document.querySelector(".h-center");
                if (!container)
                    return this.resources.forEach(d => d.remove());
                container.parentElement.removeAttribute("style");
                container.style.width = "100%";
                container.style.top = "-42px";
                container.style.marginBottom = "-42px";
                container.innerHTML = "";
                document.querySelector(".b-header-mask-wrp")?.remove();
            }
            ;
            container.classList.add("animated-banner");
            let containerHeight = container.clientHeight;
            let containerWidth = container.clientWidth;
            let containerScale = 180 / 155;
            // 初始化资源尺寸
            this.layerConfig.layers.forEach(v => {
                v._initState = {
                    scale: 1,
                    rotate: v.rotate?.initial || 0,
                    translate: v.translate?.initial || [0, 0],
                    blur: v.blur?.initial || 0,
                    opacity: v.opacity?.initial === undefined ? 1 : v.opacity.initial,
                };
                v.resources.forEach((i, index) => {
                    const el = this.resources[index];
                    if (el.tagName === 'VIDEO') {
                        if (el.parentNode) {
                            el.parentNode.removeChild(el);
                        }
                        el.dataset.height = el.videoHeight;
                        el.dataset.width = el.videoWidth;
                    }
                    else {
                        el.dataset.height = el.naturalHeight;
                        el.dataset.width = el.naturalWidth;
                    }
                    const initial = v.scale?.initial === undefined ? 1 : v.scale?.initial;
                    el.height = el.dataset.height * containerScale * initial;
                    el.width = el.dataset.width * containerScale * initial;
                });
            });
            // 初始化图层
            const layers = this.layerConfig.layers.map(v => {
                const layer = document.createElement('div');
                layer.classList.add('layer');
                container.appendChild(layer);
                return layer;
            });
            let displace = 0;
            let enterX = 0;
            let raf = 0;
            const curveParameterToFunc = (param) => {
                const o = API.bezier(...param);
                return (v) => v > 0 ? o(v) : -o(-v);
            };
            let lastDisplace = NaN;
            // 根据鼠标位置改变状态
            const af = (t) => {
                try {
                    if (lastDisplace === displace) {
                        return;
                    }
                    lastDisplace = displace;
                    layers.map((layer, i) => {
                        const v = this.layerConfig.layers[i];
                        const a = layer.firstChild;
                        if (!a) {
                            return;
                        }
                        const transform = {
                            scale: v._initState.scale,
                            rotate: v._initState.rotate,
                            translate: v._initState.translate,
                        };
                        if (v.scale) {
                            const x = v.scale.offset || 0;
                            const itp = v.scale.offsetCurve ? curveParameterToFunc(v.scale.offsetCurve) : ((x) => x);
                            const offset = x * itp(displace);
                            transform.scale = v._initState.scale + offset;
                        }
                        if (v.rotate) {
                            const x = v.rotate.offset || 0;
                            const itp = v.rotate.offsetCurve ? curveParameterToFunc(v.rotate.offsetCurve) : ((x) => x);
                            const offset = x * itp(displace);
                            transform.rotate = v._initState.rotate + offset;
                        }
                        if (v.translate) {
                            const x = v.translate.offset || [0, 0];
                            const itp = v.translate.offsetCurve ? curveParameterToFunc(v.translate.offsetCurve) : ((x) => x);
                            const offset = x.map(v => itp(displace) * v);
                            const translate = v._initState.translate.map((x, i) => (x + offset[i]) * containerScale * (v.scale?.initial || 1));
                            transform.translate = translate;
                        }
                        a.style.transform = \`scale(\${transform.scale})\` +
                            \`translate(\${transform.translate[0]}px, \${transform.translate[1]}px)\` +
                            \`rotate(\${transform.rotate}deg)\`;
                        if (v.blur) {
                            const x = v.blur.offset || 0;
                            const itp = v.blur.offsetCurve ? curveParameterToFunc(v.blur.offsetCurve) : ((x) => x);
                            const blurOffset = x * itp(displace);
                            let res = 0;
                            if (!v.blur.wrap || v.blur.wrap === 'clamp') {
                                res = Math.max(0, v._initState.blur + blurOffset);
                            }
                            else if (v.blur.wrap === 'alternate') {
                                res = Math.abs(v._initState.blur + blurOffset);
                            }
                            a.style.filter = res < 1e-4 ? '' : \`blur(\${res}px)\`;
                        }
                        if (v.opacity) {
                            const x = v.opacity.offset || 0;
                            const itp = v.opacity.offsetCurve ? curveParameterToFunc(v.opacity.offsetCurve) : ((x) => x);
                            const opacityOffset = x * itp(displace);
                            const initial = v._initState.opacity;
                            if (!v.opacity.wrap || v.opacity.wrap === 'clamp') {
                                a.style.opacity = Math.max(0, Math.min(1, initial + opacityOffset));
                            }
                            else if (v.opacity.wrap === 'alternate') {
                                const x = initial + opacityOffset;
                                let y = Math.abs(x % 1);
                                if (Math.abs(x % 2) >= 1) {
                                    y = 1 - y;
                                }
                                a.style.opacity = y;
                            }
                        }
                    });
                }
                catch (e) {
                    API.debug.error(e);
                }
            };
            // 初始化图层内图片和帧动画
            this.layerConfig.layers.map((v, i) => {
                const a = this.resources[i];
                layers[i].appendChild(a);
                if (a.tagName === 'VIDEO') {
                    a.play();
                }
                requestAnimationFrame(af);
            });
            const handleLeave = () => {
                const now = performance.now();
                const timeout = 200;
                const tempDisplace = displace;
                cancelAnimationFrame(raf);
                const leaveAF = (t) => {
                    if (t - now < timeout) {
                        displace = tempDisplace * (1 - (t - now) / 200);
                        af(t);
                        requestAnimationFrame(leaveAF);
                    }
                    else {
                        displace = 0;
                        af(t);
                    }
                };
                raf = requestAnimationFrame(leaveAF);
            };
            this.handleMouseLeave = e => {
                this.entered = false;
                handleLeave();
            };
            this.handleMouseMove = e => {
                const offsetY = document.documentElement.scrollTop + e.clientY;
                if (offsetY < containerHeight) {
                    if (!this.entered) {
                        this.entered = true;
                        enterX = e.clientX;
                    }
                    displace = (e.clientX - enterX) / containerWidth;
                    cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(af);
                }
                else {
                    if (this.entered) {
                        this.entered = false;
                        handleLeave();
                    }
                }
                this.extensions.map(v => v.handleMouseMove?.({ e, displace }));
            };
            this.handleResize = e => {
                containerHeight = container.clientHeight;
                containerWidth = container.clientWidth;
                containerScale = 180 / 155;
                this.layerConfig.layers.forEach(lc => {
                    lc.resources.forEach((d, i) => {
                        const el = this.resources[i];
                        el.height = el.dataset.height * containerScale * (lc.scale?.initial || 1);
                        el.width = el.dataset.width * containerScale * (lc.scale?.initial || 1);
                    });
                });
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(t => {
                    af(t);
                });
                this.extensions.map(v => v.handleResize?.(e));
            };
            document.addEventListener('mouseleave', this.handleMouseLeave);
            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('resize', this.handleResize);
        }
    }
    _a = Animate;
    Animate.once = false;
    /** 缓存已请求内容 */
    Animate.record = {};
    /** 资源id */
    Animate.rid = _a.resourceId();
    /** locs列表 */
    Animate.locs = [1576, 1612, 1580, 1920, 1584, 1588, 1592, 3129, 1600, 1608, 1604, 1596, 2210, 1634, 142];
    // hook顶栏图片请求
    API.jsonphookasync("api.bilibili.com/x/web-show/res/loc", undefined, async (url) => {
        const obj = API.urlObj(url);
        obj.callback = undefined;
        let loc = Animate.record[url];
        let header = Animate.record[Animate.rid];
        let rqs;
        if (!loc || !header) {
            rqs = await Promise.all([
                API.xhr.get(API.objUrl(url, obj), { responseType: "json" }, true),
                API.xhr.get(\`https://api.bilibili.com/x/web-show/page/header?resource_id=\${Animate.rid}\`, { responseType: "json" }, true)
            ]);
            loc = Animate.record[url] = rqs[0];
            header = Animate.record[Animate.rid] = rqs[1];
        }
        loc.data && Animate.locs.forEach(d => {
            loc.data[d] && (loc.data[d][0].pic = (header && header.data.pic) || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png",
                loc.data[d][0].litpic = (header && header.data.litpic),
                loc.data[d][0].url = (header && header.data.url) || "",
                loc.data[d][0].title = (header && header.data.name) || "");
            if (url.includes("loc?") && obj.id == String(d)) {
                loc.data[0].pic = (header && header.data.pic) || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png";
                loc.data[0].litpic = (header && header.data.litpic) || "";
                loc.data[0].url = (header && header.data.url) || "";
                loc.data[0].title = (header && header.data.name) || "";
            }
        });
        API.config.animatedBanner && !Animate.once && (Animate.once = true, setTimeout(() => new Animate(header.data)));
        return loc;
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/header/banner.js`;
/*!***********************!*/
/**/modules["globalSection.js"] = /*** ./src/vector/header/globalSection.js ***/
`
    /** 加载底栏脚本 */
    async function header(menu = false) {
        if (menu) {
            API.importModule("primaryMenu.js"); // 顶栏分区修正
            API.importModule("banner.js"); // 顶栏banner修复
        }
        if (!window.jQuery)
            await API.loadScript("//static.hdslb.com/js/jquery.min.js");
        API.loadScript("//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
    }
    /** 底栏脚本 **注意可能要主动出发window.load事件** */
    async function footer() {
        if (!window.jQuery)
            await API.loadScript("//static.hdslb.com/js/jquery.min.js");
        API.loadScript("//static.hdslb.com/common/js/footer.js");
    }
    /** 样式表清理 */
    function styleClear() {
        const d = document.styleSheets;
        for (let i = 0; i < d.length; i++) {
            (d[i].href?.includes("laputa-footer")
                || d[i].href?.includes("laputa-header"))
                && (d[i].disabled = true);
        }
    }
    API.addCss(".nav-item.live {width: auto;}.lt-row {display: none !important;}");
    // 顶栏
    API.doWhile(() => document.querySelector("#internationalHeader") || document.querySelector("#biliMainHeader"), t => {
        let menu = false; // 是否完整类型
        if (document.querySelector(".mini-type")
            || /festival/.test(location.href)) {
            menu = false;
        }
        if (location.href.includes("blackboard/topic_list")
            || location.href.includes("blackboard/x/act_list")
            || document.querySelector(".large-header")
            || document.querySelector(".bili-banner")
            || (t.getAttribute("type") == "all")) {
            menu = true;
        }
        t.setAttribute("class", \`z-top-container\${menu ? " has-menu" : ""}\`);
        header(menu);
        styleClear();
    });
    // 上古顶栏
    API.doWhile(() => document.querySelector(".z_top_container"), t => {
        t.setAttribute("class", "z-top-container has-menu");
        document.querySelector(".header")?.remove();
        header(true);
    });
    // 底栏
    API.doWhile(() => document.querySelector(".international-footer") || document.querySelector("#biliMainFooter"), t => {
        t.setAttribute("class", "footer bili-footer report-wrap-module");
        t.setAttribute("id", "home_footer");
        footer();
        styleClear();
    });
    // 鼠标放在顶栏上的动效
    API.doWhile(() => document.querySelector("#bili-header-m"), () => {
        API.addCss(API.getModule("avatarAnimation.css"));
    });
    // v3版顶栏
    API.doWhile(() => (document.body && document.body.classList.contains("header-v3")) || document.querySelector("#bili-header-container"), () => {
        document.body.classList.remove("header-v3");
        header(true);
    });

//# sourceURL=file://@Bilibili-Old/vector/header/globalSection.js`;
/*!***********************!*/
/**/modules["primaryMenu.js"] = /*** ./src/vector/header/primaryMenu.js ***/
`
    API.doWhile(() => document.querySelector("#primary_menu"), () => {
        const vue = document.querySelector("#primary_menu").__vue__;
        vue.menuList.forEach((d, i, s) => {
            switch (d.name) {
                case "动画":
                    s[i].sub = [{ "name": "MAD·AMV", "route": "mad", "tid": 24, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 151 }, "desc": "具有一定制作程度的动画或静画的二次创作视频", "url": "//www.bilibili.com/video/douga-mad-1.html" }, { "name": "MMD·3D", "route": "mmd", "tid": 25, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 152 }, "desc": "使用MMD（MikuMikuDance）和其他3D建模类软件制作的视频", "url": "//www.bilibili.com/video/douga-mmd-1.html" }, { "name": "短片·手书·配音", "route": "voice", "tid": 47, "ps": 15, "rps": 10, "desc": "追求创新并具有强烈特色的短片、手书（绘）及ACG相关配音", "url": "//www.bilibili.com/video/douga-voice-1.html" }, { "name": "手办·模玩", "route": "garage_kit", "tid": 210, "ps": 15, "rps": 10, "desc": "手办模玩的测评、改造或其他衍生内容", "url": "" }, { "name": "特摄", "route": "tokusatsu", "tid": 86, "ps": 15, "rps": 10, "desc": "特摄相关衍生视频", "url": "//www.bilibili.com/video/cinephile-tokusatsu.html" }, { "name": "综合", "route": "other", "tid": 27, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 153 }, "desc": "以动画及动画相关内容为素材，包括但不仅限于音频替换、杂谈、排行榜等内容", "url": "//www.bilibili.com/video/douga-else-1.html" }];
                    break;
                case "音乐":
                    s[i].sub = [{ "name": "原创音乐", "route": "original", "tid": 28, "ps": 15, "rps": 10, "viewHotTag": true, "ad": { "active": true, "dataLocId": 243 }, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "原创歌曲及纯音乐，包括改编、重编曲及remix", "url": "//www.bilibili.com/video/music-original-1.html" }, { "name": "翻唱", "route": "cover", "tid": 31, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 245 }, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "对曲目的人声再演绎视频", "url": "//www.bilibili.com/video/music-Cover-1.html" }, { "name": "演奏", "route": "perform", "tid": 59, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "乐器和非传统乐器器材的演奏作品", "url": "//www.bilibili.com/video/music-perform-1.html" }, { "name": "VOCALOID·UTAU", "route": "vocaloid", "tid": 30, "ps": 15, "rps": 10, "viewHotTag": true, "ad": { "active": true, "dataLocId": 247 }, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "以VOCALOID等歌声合成引擎为基础，运用各类音源进行的创作", "url": "//www.bilibili.com/video/music-vocaloid-1.html" }, { "name": "音乐现场", "route": "live", "tid": 29, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "音乐表演的实况视频，包括官方/个人拍摄的综艺节目、音乐剧、音乐节、演唱会等", "url": "//www.bilibili.com/video/music-oped-1.html" }, { "name": "MV", "route": "mv", "tid": 193, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "为音乐作品配合拍摄或制作的音乐录影带（Music Video），以及自制拍摄、剪辑、翻拍MV", "url": "//www.bilibili.com/video/music-coordinate-1.html" }, { "name": "乐评盘点", "route": "commentary", "tid": 243, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "音乐类新闻、盘点、点评、reaction、榜单、采访、幕后故事、唱片开箱等", "url": "//www.bilibili.com/video/music-collection-1.html" }, { "name": "音乐教学", "route": "tutorial", "tid": 244, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "以音乐教学为目的的内容", "url": "//www.bilibili.com/video/music-collection-1.html" }, { "name": "音乐综合", "route": "other", "tid": 130, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "所有无法被收纳到其他音乐二级分区的音乐类视频", "url": "//www.bilibili.com/video/music-collection-1.html" }, { "name": "音频", "customZone": "Audio", "route": "audio", "url": "//www.bilibili.com/audio/home?musicType=music" }, { "name": "说唱", "url": "//www.bilibili.com/v/rap" }];
                    break;
                case "科技":
                    s[i].name = "知识";
                    s[i].route = "knowledge";
                    s[i].sub = [{ "name": "科学科普", "route": "science", "tid": 201, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 261 }, "desc": "回答你的十万个为什么" }, { "name": "社科·法律·心理", "route": "social_science", "tid": 124, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 263 }, "desc": "基于社会科学、法学、心理学展开或个人观点输出的知识视频" }, { "name": "人文历史", "route": "humanity_history", "tid": 228, "ps": 15, "rps": 10, "desc": "看看古今人物，聊聊历史过往，品品文学典籍" }, { "name": "财经商业", "route": "business", "tid": 207, "ps": 15, "rps": 10, "desc": "说金融市场，谈宏观经济，一起畅聊商业故事" }, { "name": "校园学习", "route": "campus", "tid": 208, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 265 }, "desc": "老师很有趣，学生也有才，我们一起搞学习" }, { "name": "职业职场", "route": "career", "tid": 209, "ps": 15, "rps": 10, "desc": "职业分享、升级指南，一起成为最有料的职场人" }, { "name": "设计·创意", "route": "design", "tid": 229, "ps": 15, "rps": 10, "desc": "天马行空，创意设计，都在这里" }, { "name": "野生技能协会", "route": "skill", "tid": 122, "ps": 15, "rps": 10, "desc": "技能党集合，是时候展示真正的技术了" }];
                    break;
                case "数码":
                    s[i].name = "科技";
                    s[i].route = "tech";
                    s[i].sub = [{ "name": "数码", "route": "digital", "tid": 95, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "科技数码产品大全，一起来做发烧友", "url": "#" }, { "name": "软件应用", "route": "application", "tid": 230, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "超全软件应用指南", "url": "#" }, { "name": "计算机技术", "route": "computer_tech", "tid": 231, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "研究分析、教学演示、经验分享......有关计算机技术的都在这里", "url": "#" }, { "name": "科工机械", "route": "industry", "tid": 232, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "从小芯片到大工程，一起见证科工力量", "url": "#" }, { "name": "极客DIY", "route": "diy", "tid": 233, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "炫酷技能，极客文化，硬核技巧，准备好你的惊讶", "url": "#" }];
                    break;
                case "生活":
                    s[i].sub = [{ "name": "搞笑", "route": "funny", "tid": 138, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 273 }, "desc": "各种沙雕有趣的搞笑剪辑，挑战，表演，配音等视频", "url": "//www.bilibili.com/video/ent_funny_1.html", "locid": 4204, "recommendId": 4210, "slider": { "width": 620, "height": 220 }, "customComponent": { "name": "Energy", "leftId": 4212, "rightId": 4218, "rightType": "slide" } }, { "name": "家居房产", "route": "home", "tid": 239, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 275 }, "desc": "与买房、装修、居家生活相关的分享", "url": "#" }, { "name": "手工", "route": "handmake", "tid": 161, "ps": 15, "rps": 10, "desc": "手工制品的制作过程或成品展示、教程、测评类视频", "url": "//www.bilibili.com/video/ent-handmake-1.html" }, { "name": "绘画", "route": "painting", "tid": 162, "ps": 15, "rps": 10, "desc": "绘画过程或绘画教程，以及绘画相关的所有视频", "url": "//www.bilibili.com/video/ent-painting-1.html" }, { "name": "日常", "route": "daily", "tid": 21, "ps": 15, "rps": 10, "desc": "记录日常生活，分享生活故事", "url": "//www.bilibili.com/video/ent-life-1.html" }];
                    break;
                case "鬼畜":
                    s[i].sub = [{ "name": "鬼畜调教", "route": "guide", "tid": 22, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 285 }, "desc": "使用素材在音频、画面上做一定处理，达到与BGM一定的同步感", "url": "//www.bilibili.com/video/ent-Kichiku-1.html" }, { "name": "音MAD", "route": "mad", "tid": 26, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 287 }, "desc": "使用素材音频进行一定的二次创作来达到还原原曲的非商业性质稿件", "url": "//www.bilibili.com/video/douga-kichiku-1.html" }, { "name": "人力VOCALOID", "route": "manual_vocaloid", "tid": 126, "ps": 15, "rps": 10, "desc": "将人物或者角色的无伴奏素材进行人工调音，使其就像VOCALOID一样歌唱的技术", "url": "//www.bilibili.com/video/kichiku-manual_vocaloid-1.html" }, { "name": "鬼畜剧场", "route": "theatre", "tid": 216, "ps": 15, "rps": 10, "desc": "使用素材进行人工剪辑编排的有剧情的作品" }, { "name": "教程演示", "route": "course", "tid": 127, "ps": 10, "rps": 6, "rightComponent": { "name": "CmImgList", "id": 148 }, "ad": { "active": true, "dataLocId": 289 }, "hideDropdown": false, "desc": "鬼畜相关的教程演示", "url": "//www.bilibili.com/video/kichiku-course-1.html" }];
                    break;
                case "时尚":
                    s[i].sub = [{ "name": "美妆护肤", "route": "makeup", "tid": 157, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 279 }, "desc": "彩妆护肤、美甲美发、仿妆、医美相关内容分享或产品测评", "url": "//www.bilibili.com/video/fashion-makeup-fitness-1.html" }, { "name": "穿搭", "route": "clothing", "tid": 158, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 281 }, "desc": "穿搭风格、穿搭技巧的展示分享，涵盖衣服、鞋靴、箱包配件、配饰（帽子、钟表、珠宝首饰）等", "url": "//www.bilibili.com/video/fashion-clothing-1.html" }, { "name": "时尚潮流", "route": "trend", "tid": 159, "ps": 15, "rps": 10, "desc": "时尚街拍、时装周、时尚大片，时尚品牌、潮流等行业相关记录及知识科普", "url": "#" }];
                    break;
                case "广告":
                    s[i].name = "资讯";
                    s[i].route = "information";
                    s[i].tid = 202;
                    s[i].sub = [{ "name": "热点", "route": "hotspot", "tid": 203, "ps": 18, "rps": 10, "desc": "全民关注的时政热门资讯" }, { "name": "环球", "route": "global", "tid": 204, "ps": 18, "rps": 10, "desc": "全球范围内发生的具有重大影响力的事件动态" }, { "name": "社会", "route": "social", "tid": 205, "ps": 18, "rps": 10, "desc": "日常生活的社会事件、社会问题、社会风貌的报道" }, { "name": "综合", "route": "multiple", "tid": 206, "ps": 18, "rps": 10, "desc": "除上述领域外其它垂直领域的综合资讯" }];
                    break;
                case "娱乐":
                    s[i].sub = [{ "name": "综艺", "route": "variety", "tid": 71, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 267 }, "desc": "所有综艺相关，全部一手掌握！", "url": "//www.bilibili.com/video/ent-variety-1.html" }, { "name": "娱乐杂谈", "route": "talker", "tid": 241, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 269 }, "desc": "娱乐人物解读、娱乐热点点评、娱乐行业分析" }, { "name": "粉丝创作", "route": "fans", "tid": 242, "ps": 15, "rps": 10, "desc": "粉丝向创作视频" }, { "name": "明星综合", "route": "celebrity", "tid": 137, "ps": 15, "rps": 10, "desc": "娱乐圈动态、明星资讯相关" }];
                    break;
            }
        });
    });
    // 顶栏广场
    API.jsonphookasync("api.bilibili.com/plaza/banner", () => true, async () => {
        return { "code": 0, "result": [{ "link": "https://www.bilibili.com/blackboard/x/act_list", "end": 1640966407, "begin": 1456709887, "title": "bilibili 活动", "cover": "http://i0.hdslb.com/bfs/square/6830d0e479eee8cc9a42c3e375ca99a5147390cd.jpg", "id": 9, "created_ts": 1491386053 }, { "link": "http://www.bilibili.com/blackboard/topic_list.html", "end": 1640966418, "begin": 1544258598, "title": "话题列表", "cover": "http://i0.hdslb.com/bfs/square/b1b00a0c3ce8570b48277ae07a2e55603a4a4ddf.jpg", "id": 17, "created_ts": 1491386030 }] };
    }, false);
    // 顶栏动图
    API.jsonphookasync("api.bilibili.com/x/web-interface/index/icon", undefined, async () => {
        const data = await API.xhr.get("https://www.bilibili.com/index/index-icon.json", { responseType: "json" }, true);
        return {
            code: 0,
            data: API.subArray(data.fix),
            message: "0",
            ttl: 1
        };
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/header/primaryMenu.js`;
/*!***********************!*/
/**/modules["polyfill.js"] = /*** ./src/vector/polyfill/polyfill.js ***/
`
    API.importModule("replaceChildren.js"); //  Element.prototype.replaceChildren

//# sourceURL=file://@Bilibili-Old/vector/polyfill/polyfill.js`;
/*!***********************!*/
/**/modules["replaceChildren.js"] = /*** ./src/vector/polyfill/replaceChildren.js ***/
`
if (typeof Element.prototype.replaceChildren === 'undefined') {
    Object.defineProperty(Element.prototype, 'replaceChildren', {
        configurable: true,
        enumerable: false,
        value: function () {
            while (this.lastChild)
                this.removeChild(this.lastChild);
            this.append.call(this, ...arguments);
        }
    });
}

//# sourceURL=file://@Bilibili-Old/vector/polyfill/replaceChildren.js`;
/*!***********************!*/
/**/modules["dynamic.js"] = /*** ./src/vector/url/dynamic.js ***/
`
    API.xhrhook("api.bilibili.com/x/polymer/web-dynamic/v1/feed/all", undefined, r => {
        try {
            const response = API.jsonCheck(r.response);
            response.data.items = response.data.items.filter((d) => d.modules?.module_dynamic?.major?.archive?.badge?.text != "直播回放");
            r.responseType === "json" ? r.response = response : r.response = r.responseText = JSON.stringify(response);
        }
        catch (e) { }
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/url/dynamic.js`;
/*!***********************!*/
/**/modules["history.js"] = /*** ./src/vector/url/history.js ***/
`
    API.config.history && API.xhrhook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function (args) {
        let obj = API.urlObj(args[1]), max = obj.max || "", view_at = obj.view_at || "";
        args[1] = API.objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: "20" });
    }, undefined, false);
    API.config.searchHistory && API.doWhile(() => document.querySelector(".b-head-search"), () => document.querySelector(".b-head-search")?.remove());

//# sourceURL=file://@Bilibili-Old/vector/url/history.js`;
/*!***********************!*/
/**/modules["media.js"] = /*** ./src/vector/url/media.js ***/
`
    // 解除限制
    API.xhrhook("user/status", undefined, res => {
        try {
            const result = API.jsonCheck(res.response);
            result.result.area_limit = 0;
            result.result.ban_area_show = 0;
            res.responseType === "json" ? res.response = result : res.response = res.responseText = JSON.stringify(result);
        }
        catch (e) { }
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/url/media.js`;
/*!***********************!*/
/**/modules["av-script.html"] = /*** ./src/vector/url/av/av-script.html ***/
`<script type="text/javascript">
    window.getInternetExplorerVersion = function () {
        var e = -1; if ("Microsoft Internet Explorer" == navigator.appName) {
            var r = navigator.userAgent;
            null != new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r) && (e = parseFloat(RegExp.\$1))
        }
        return e
    };
    function getQueryString(e) {
        var r = new RegExp("(^|&)" + e + "=([^&]*)(&|\$)"),
            i = window.location.search.substr(1).match(r);
        return null != i ? unescape(i[2]) : null
    }
    window.commentAgent = { seek: t => window.player && window.player.seek(t) };
</script>
<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
<script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
<script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js"
    crossorigin=""></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js"
    crossorigin=""></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js"
    crossorigin=""></script>
<script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script>`;
/*!***********************!*/
/**/modules["av.html"] = /*** ./src/vector/url/av/av.html ***/
`<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->

<head>
    <meta charset="utf-8" />
    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords"
        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
        title="哔哩哔哩" />
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" />
    <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
    <style type="text/css">
        #bofqi .player {
            width: 980px;
            height: 620px;
            display: block;
        }

        @media screen and (min-width:1400px) {

            #bofqi .player {
                width: 1160px;
                height: 720px
            }
        }
    </style>
</head>

<body>
    <div class="z-top-container has-menu"></div>
    <div id="video-page-app"></div>
    <div id="app" data-server-rendered="true"></div>
    <div class="footer bili-footer report-wrap-module"></div>
</body>

<!-- </html> -->`;
/*!***********************!*/
/**/modules["av.js"] = /*** ./src/vector/url/av/av.js ***/
`
    if (API.rebuildType != "重定向")
        API.windowClear();
    API.loadVideoScript();
    // 717 -> video.b1b7706abd590dd295794f540f7669a5d8d978b3.js
    // 暴露UI组件
    // .onCoinSuccess(n)   页面变为已投币n枚的状态
    // .onFollow()         变为已关注状态
    // .favSubmit(bool)    设置收藏状态，参数bool: true -> “已收藏”状态 false -> 未收藏状态
    API.webpackhook(717, 274, (code) => code.replace("init:function(){", "init:function(){window.biliUIcomponents=this;").replace("this.getAdData()", "this.getAdData"));
    // 修复：收藏视频时，在“添加到收藏夹”弹窗中，如果将视频从收藏夹A删除，并同时添加到收藏夹B，点击确定后窗口不消失的问题
    /* 报错原因示意：
        jQuery.when(deferredA,deferredB).done((resultA,resultB) => {
            let codeA = resultA[0].code; // Cannot read property 'code' of undefined
            let codeA = resultA.code;    // 本应该写成这样
        })
    */
    API.webpackhook(717, 251, (code) => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
    // 修复：视频标签链接
    // tag -> topic
    API.webpackhook(717, 660, code => code.replace('tag/"+t.info.tag_id+"/?pagetype=videopage', 'topic/"+t.info.tag_id+"/?pagetype=videopage'));
    // 修复：视频分区
    API.webpackhook(717, 100, code => code.replace(/MenuConfig[\\S\\s]+?LiveMenuConfig/, \`MenuConfig=\${API.getModule("menuConfig.txt")},e.LiveMenuConfig\`));
    // 修复：移除上古顶栏
    API.webpackhook(717, 609, () => \`()=>{}\`);
    // 修复：BV/cv -> 超链接
    API.webpackhook(717, 2, code => code.replace("av\$1</a>')", \`av\$1</a>').replace(/(?!<a[^>]*>)cv([0-9]+)(?![^<]*<\\\\/a>)/ig, '<a href="//www.bilibili.com/read/cv\$1/" target="_blank" data-view="\$1">cv\$1</a>').replace(/(?!<a[^>]*>)(bv1)(\\\\w{9})(?![^<]*<\\\\/a>)/ig, '<a href="//www.bilibili.com/video/bv1\$2/" target="_blank">\$1\$2</a>')\`));
    // 添加：播放器启动代码
    // 无\`__INITIAL_STATE__\`启动
    API.webpackhook(717, 286, code => code.replace('e("setVideoData",t)', \`e("setVideoData",t);\$("#bofqi").attr("id","__bofqi").html('<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>');new Function(t.embedPlayer)();\`));
    if (API.rebuildType == "重定向") {
        document.documentElement.replaceChildren(API.createElements(API.htmlVnode(API.getModule("av.html"))));
        API.appendScripts(API.getModule("av-script.html")).then(() => API.loadendEvent());
    }
    else {
        API.documentWrite(API.getModule("av.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", \`\${API.getModule("av-script.html")}</body>\`));
    }
    API.title && (document.title = API.title);
    API.config.enlike && new API.enLike(); // 点赞功能
    API.importModule("avLostCheck.js"); // av页深度审查
    API.importModule("primaryMenu.js"); // 顶栏分区修正
    API.importModule("banner.js"); // 顶栏banner修复
    API.importModule("loadByDmId.js"); // 弹幕ID跳转
    // 跳过充电鸣谢
    API.config.automate.electric && API.jsonphookasync("api.bilibili.com/x/web-interface/elec/show", undefined, async () => { return { code: -404 }; }, false);

//# sourceURL=file://@Bilibili-Old/vector/url/av/av.js`;
/*!***********************!*/
/**/modules["avLostCheck.js"] = /*** ./src/vector/url/av/avLostCheck.js ***/
`
    /** 模板：//api.bilibili.com/x/web-interface/view/detail?aid=\${aid} */
    class Detail {
        constructor() {
            this.code = 0;
            this.data = {
                Card: { archive_count: -1, article_count: -1, card: {}, follower: -1, following: false, like_num: -1, space: {} },
                Related: [],
                Reply: { page: {}, replies: [] },
                Spec: null,
                Tags: [],
                View: {},
                elec: null,
                hot_share: {},
                recommend: null,
                view_addit: {}
            };
            this.message = "0";
            this.ttl = 1;
        }
    }
    function view2Detail(data) {
        const result = new Detail();
        if (data.v2_app_api) {
            delete data.v2_app_api.redirect_url; // 番剧重定向会导致404，弃之
            result.data.Card.follower = data.v2_app_api.owner_ext?.fans;
            result.data.Card.card = { ...data.v2_app_api.owner, ...data.v2_app_api.owner_ext };
            result.data.Tags = data.v2_app_api.tag;
            result.data.View = data.v2_app_api;
            API.xhrhook(\`api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`, undefined, (res) => {
                const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify(result.data.View)}}\`;
                res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
            }, false);
            API.xhrhook(\`api.bilibili.com/x/web-interface/archive/stat?aid=\${API.aid}\`, undefined, (res) => {
                const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify({ ...result.data.View.stat, aid: API.aid })}}\`;
                res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
            }, false);
            return JSON.parse(JSON.stringify(result));
        }
        else
            return v1api(data);
    }
    function v1api(data) {
        const result = new Detail();
        const p = Number(API.getUrlValue("p"));
        result.data.Card.card = {
            face: "//static.hdslb.com/images/akari.jpg",
            mid: data.mid,
            name: data.author,
            vip: {}
        };
        result.data.View = {
            aid: data.aid || data.id || API.aid,
            cid: data.list[p ? p - 1 : 0].cid,
            copyright: 1,
            ctime: data.created,
            dimension: { width: 1920, height: 1080, rotate: 0 },
            duration: -1,
            owner: result.data.Card.card,
            pages: data.list,
            pic: data.pic,
            pubdate: data.lastupdatets,
            rights: {},
            stat: {
                aid: data.aid || data.id || API.aid,
                coin: data.coins,
                danmaku: data.video_review,
                dislike: 0,
                evaluation: "",
                favorite: data.favorites,
                his_rank: 0,
                like: -1,
                now_rank: 0,
                reply: -1,
                share: -1,
                view: data.play
            },
            state: 0,
            subtitle: { allow_submit: false, list: [] },
            tid: data.tid,
            title: data.title,
            tname: data.typename,
            videos: data.list.length
        };
        data.bangumi && (result.data.View.season = data.bangumi);
        API.xhrhook(\`api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`, undefined, (res) => {
            const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify(result.data.View)}}\`;
            res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        API.xhrhook(\`api.bilibili.com/x/web-interface/archive/stat?aid=\${API.aid}\`, undefined, (res) => {
            const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify({ ...result.data.View.stat, aid: API.aid })}}\`;
            res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        return JSON.parse(JSON.stringify(result));
    }
    async function check(call) {
        try {
            API.toast.info(\`正在进一步查询 av\${API.aid} 的信息~\`);
            const card = await API.xhr({
                url: \`https://api.bilibili.com/x/article/cards?ids=av\${API.aid}\`,
                responseType: "json"
            });
            if (card.data[\`av\${API.aid}\`]) {
                if (card.data[\`av\${API.aid}\`].redirect_url)
                    location.replace(card.data[\`av\${API.aid}\`].redirect_url);
            }
            const data = await API.xhr({
                url: \`https://www.biliplus.com/api/view?id=\${API.aid}\`,
                responseType: "json"
            }, true);
            const res = view2Detail(data);
            if (res.data.View.season) {
                return location.replace(res.data.View.season.ogv_play_url);
            }
            call(res);
            setTimeout(() => {
                API.toast.custom(0, "warning", "这大概是一个无效av号~", "本页面使用缓存数据生成，并无法播放！", "部分上古视频还存在评论区哦~");
            }, 1e3);
        }
        catch (e) {
            API.debug.error(e);
        }
    }
    API.jsonphook("api.bilibili.com/x/web-interface/view/detail", undefined, (res, r, call) => {
        if (0 !== res.code) {
            const obj = API.urlObj(r);
            if (obj.aid) {
                API.aid = obj.aid;
                check(call);
                return true;
            }
        }
        else {
            if (res.data && res.data.View) {
                if (res.data.View.stein_guide_cid) {
                    API.sessionStorage.setItem("keepNew", 1);
                    location.reload();
                }
                Promise.resolve().then(() => {
                    API.config.upList && res.data.View.staff && API.upList(res.data.View.staff);
                    API.config.collection && res.data.View.is_season_display && res.data.View.ugc_season && API.collection(res.data.View);
                });
            }
        }
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/url/av/avLostCheck.js`;
/*!***********************!*/
/**/modules["collection.js"] = /*** ./src/vector/url/av/collection.js ***/
`
    function calcDivWidth(text) {
        let elem = document.createElement("div");
        elem.setAttribute("style", "display: inline-block");
        elem.innerText = text;
        document.body.append(elem);
        let w = elem.clientWidth;
        document.body.removeChild(elem);
        return w;
    }
    function calcOffsetPos(elem) {
        let result = { x: 0, y: 0 };
        for (let e = elem; e != null; e = e.offsetParent) {
            result.x += e.offsetLeft;
            result.y += e.offsetTop;
        }
        return result;
    }
    function getAid() {
        return window.history.state?.aid;
    }
    class CollectionElement {
        constructor(onSpread) {
            this.items = [];
            this.spread = null;
            this.container = document.createElement("div");
            this.clearfix = document.createElement("ul");
            this.clearfix.className = "clearfix";
            this.container.appendChild(this.clearfix);
            if (onSpread) {
                this.spread = document.createElement("a");
                this.spread.className = "item v-part-toggle";
                this.spread.addEventListener("click", (e) => {
                    onSpread();
                    e.preventDefault();
                });
                this.clearfix.appendChild(this.spread);
            }
        }
        setContainerAttr(attr) {
            let staticClass = "multi-page bili-wrapper report-wrap-module report-scroll-module";
            this.container.className = [staticClass, attr.class].join(' ').trim();
        }
        setItemAttrs(attrs) {
            // 更新分集DOM节点数量
            while (this.items.length > attrs.length)
                this.clearfix.removeChild(this.items.pop().node);
            while (this.items.length < attrs.length) {
                let i = { click: null, node: document.createElement("a") };
                i.node.addEventListener("mouseenter", (e) => this.showFloatTxt(e));
                i.node.addEventListener("mouseleave", () => this.hideFloatText());
                i.node.addEventListener("click", (e) => {
                    // 参考vue router-link中防跳转处理
                    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.defaultPrevented || e.button != 0)
                        return;
                    e.preventDefault();
                    i.click && i.click(e);
                });
                this.clearfix.insertBefore(i.node, this.spread);
                this.items.push(i);
            }
            // 更新DOM节点属性
            const staticClass = "item";
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].node.className = [staticClass, attrs[i].class].join(' ').trim();
                this.items[i].node.innerText = attrs[i].text;
                this.items[i].node.href = attrs[i].href;
                this.items[i].click = attrs[i].click;
            }
        }
        setSpreadAttr(attr) {
            if (this.spread) {
                this.spread.style.top = attr.top + "px";
                attr.text && (this.spread.innerText = attr.text);
            }
        }
        showFloatTxt(e) {
            let item = e.target;
            let treshold = calcDivWidth(item.innerText) + 14;
            if (item.offsetWidth >= treshold)
                return;
            let floatTxt = document.createElement("div");
            floatTxt.className = "p-float-txt";
            floatTxt.innerText = item.innerText;
            document.body.appendChild(floatTxt);
            let pos = calcOffsetPos(item);
            floatTxt.style.left = pos.x + 'px';
            floatTxt.style.top = pos.y - 8 - floatTxt.clientHeight + 'px';
            // transition代替animate()
            floatTxt.style.transition = "opacity 0.4s, top 0.4s cubic-bezier(0.37, 0, 0.63, 1)";
            floatTxt.style.top = pos.y - 3 - floatTxt.clientHeight + 'px';
            floatTxt.style.opacity = "1";
        }
        hideFloatText() {
            let e = document.querySelector(".p-float-txt");
            e && document.body.removeChild(e);
        }
    }
    class CollectionData {
        constructor(season) {
            this.notify = null;
            this._viewEpisodes = [];
            this._ep = 0;
            this._spread = false;
            this._spreadBtnTop = 0;
            this._colCount = 4;
            this.episodes = [];
            this.initEpisodes(season);
            this.calcColCount();
            this._viewEpisodes = !this.needSpread() ? this.episodes :
                this.calcViewEpisodesOnCollapsed(this.ep);
        }
        get viewEpisodes() {
            return this._viewEpisodes;
        }
        get ep() {
            if (this.episodes[this._ep].aid != getAid())
                this._ep = this.episodes.findIndex((ep) => ep.aid == getAid());
            return this._ep;
        }
        get spreadBtnTop() {
            return this._spreadBtnTop;
        }
        set spreadBtnTop(n) {
            if (this._spreadBtnTop != n) {
                this._spreadBtnTop = n;
                this.notify?.spreadBtnTop(this._spreadBtnTop);
            }
        }
        get spread() {
            return this._spread;
        }
        get colCount() {
            return this._colCount;
        }
        // 转换成/x/player/pagelist中的列表格式
        get pageList() {
            return this.episodes.reduce((s, ep, i) => {
                s.push({
                    aid: ep.aid,
                    cid: ep.cid,
                    page: i + 1,
                    part: ep.title,
                    duration: ep.page.duration,
                    dimension: ep.page.dimension,
                    from: ep.page.from,
                    vid: "",
                    weblink: ""
                });
                return s;
            }, []);
        }
        initEpisodes(season) {
            season.sections.forEach((section) => {
                Array.prototype.push.apply(this.episodes, section.episodes);
            });
        }
        calcColCount() {
            let w = calcDivWidth(this.episodes[this.ep].title);
            this._colCount = w >= 241 ? 3 : w >= 186 ? 4 :
                w >= 149 ? 5 : w >= 123 ? 6 :
                    window.innerWidth > 1440 ? 7 : 6;
        }
        calcViewEpisodesOnCollapsed(ep) {
            let begin = ep == 0 ? 0 :
                ep - 1 + this._colCount <= this.episodes.length ? ep - 1 :
                    Math.max(this.episodes.length - this._colCount, 0);
            return this.episodes.slice(begin, begin + this._colCount);
        }
        needSpread() {
            return this._colCount < this.episodes.length || this.spread;
        }
        toggleSpread() {
            this._spread = !this._spread;
            this._viewEpisodes = this._spread ? this.episodes :
                this.calcViewEpisodesOnCollapsed(this.ep);
            this._spreadBtnTop = 0;
            this.calcColCount();
            this.notify?.spread(this._spread);
        }
        updateEp() {
            let ep = this._ep;
            if (ep == this.ep)
                return;
            this._viewEpisodes = this._spread ? this.episodes :
                this.calcViewEpisodesOnCollapsed(this.ep);
            this.notify?.ep();
        }
    }
    class CollectionComponent {
        constructor(season, player) {
            this.data = new CollectionData(season);
            this.elem = new CollectionElement(this.data.needSpread() ?
                () => this.data.toggleSpread() : null);
            // 替换播放器换P处理
            window.callAppointPart = (_p, video) => {
                let state = { aid: video.aid, cid: video.cid };
                window.history.pushState(state, "", "/video/av" + video.aid);
                this.onRouteChanged(state);
            };
            window.addEventListener("popstate", (e) => {
                this.reloadPlayer(e.state);
                this.onRouteChanged(e.state);
            });
            window.addEventListener("scroll", () => this.onWindowScroll());
            this.render();
            player.parentNode.insertBefore(this.elem.container, player);
            this.data.notify = {
                spread: (spread) => {
                    this.render();
                    // 收起时页面滚动
                    !spread && window.scroll({ top: calcOffsetPos(document.getElementById("viewbox_report")).y });
                },
                spreadBtnTop: (top) => {
                    this.elem.setSpreadAttr({ top: top });
                },
                ep: () => this.render()
            };
            // 拦截播放器换P分P列表API
            API.xhrhook("/x/player/pagelist", undefined, (r) => {
                r.response = JSON.stringify({
                    code: 0,
                    message: 0,
                    ttl: 1,
                    data: this.data.pageList
                });
                r.responseText = r.response;
            }, false);
        }
        render() {
            this.elem.setContainerAttr({ class: "col-" + this.data.colCount });
            this.elem.setItemAttrs(this.data.viewEpisodes.map((p) => {
                return {
                    class: p.aid == getAid() ? "on" : "",
                    href: "/video/av" + p.aid,
                    text: p.title,
                    click: (_e) => {
                        let video = { aid: p.aid, cid: p.cid };
                        this.reloadPlayer(video);
                        window.callAppointPart(1, video);
                    }
                };
            }, this));
            this.elem.setSpreadAttr({
                top: this.data.spreadBtnTop,
                text: this.data.spread ? "收起" : "展开"
            });
        }
        reloadPlayer(v) {
            window.GrayManager.reload(\`aid=\${v.aid}&cid=\${v.cid}&has_next=1\`);
        }
        onWindowScroll() {
            if (!this.data.spread)
                return;
            // 展开按钮随页面滚动浮动
            let div = this.elem.container;
            let btn = this.elem.spread;
            let divY = calcOffsetPos(div).y;
            let maxTop = div.clientHeight - btn.clientHeight - 20;
            this.data.spreadBtnTop = window.scrollY <= divY - 20 ? 0 :
                Math.min(window.scrollY - divY + 20, maxTop);
        }
        onRouteChanged(state) {
            this.data.updateEp();
            // 视频信息刷新
            let avComponent = window.biliUIcomponents;
            // 评论和标签通过修改组件aid刷新
            avComponent.\$store.state.aid = state.aid;
            // 简介, 标题, 视频统计
            API.xhr({
                url: API.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: state.aid }),
                responseType: "json",
                credentials: true
            }).then((d) => {
                avComponent?.setVideoData(d.data?.View);
            });
            // 下方视频推荐
            API.xhr({
                url: API.objUrl("https://api.bilibili.com/x/web-interface/archive/related", { aid: state.aid }),
                responseType: "json",
                credentials: true
            }).then((d) => avComponent.related = d.data);
            // 收藏/投币状态
            avComponent.initPage();
            //TODO: 分区修复 & 点赞数
        }
    }
    class Collection {
        constructor(videoData) {
            this.component = undefined;
            API.xhrhook("/x/player.so", undefined, (r) => {
                // 替换has_next标签值让播放器显示下一P按钮
                r.response = r.response.replace(/<has_next>\\s*0/, "<has_next>1");
                r.responseText = r.response;
            }, false);
            API.doWhile(() => document.getElementById("__bofqi"), player => {
                try {
                    window.history.replaceState({ aid: videoData.aid, cid: videoData.cid }, "");
                    this.component = new CollectionComponent(videoData.ugc_season, player);
                    this.component.render();
                }
                catch (e) {
                    API.toast.error("collection.js", e);
                }
            });
            API.toast.warning("视频合集，现以分P样式呈现！", "如需关闭，请访问设置-重构-合集选项。");
        }
        static needDisplay(videoData) {
            return videoData.videos <= 1 && videoData.ugc_season &&
                videoData.is_season_display;
        }
        static run(videoData) {
            this.needDisplay(videoData) && new Collection(videoData);
        }
    }
    /**
     * av页合集显示
     * @param v av详情数据
     */
    function collection(v) {
        Collection.run(v);
    }
    API.collection = collection;

//# sourceURL=file://@Bilibili-Old/vector/url/av/collection.js`;
/*!***********************!*/
/**/modules["enLike.js"] = /*** ./src/vector/url/av/enLike.js ***/
`
    class enLike {
        constructor(type, num = 0) {
            /** aid备份 */
            this.aid = undefined;
            /** 锚节点 */
            this.coin = undefined;
            this.span = undefined;
            /** 点赞了吗？ */
            this.liked = false;
            /** 点赞数 */
            this.number = 0;
            /** 未点赞图标 */
            this.svgLike = API.getModule("dislike.svg");
            /** 已点赞图标 */
            this.svgEnLike = API.getModule("like.svg");
            this.type = type;
            this.number = num;
            API.doWhile(() => {
                this.coin = type === "watchlater" ? document.querySelector(".u.coin") : document.querySelector("[report-id*=coin]");
                return this.coin && API.aid;
            }, () => this.init());
        }
        init() {
            this.style();
            this.aid = API.aid;
            this.span = document.createElement("span");
            this.span.classList.add("ulike");
            this.coin.parentElement.insertBefore(this.span, this.coin);
            this.changeLiked();
            this.span.addEventListener("click", () => this.setLike());
            API.switchVideo(() => this.switch());
            try {
                !this.number && API.xhr({
                    url: \`https://api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`,
                    credentials: true,
                    responseType: "json"
                }, true).then(d => {
                    this.number = API.jsonCheck(d).data.stat.like;
                    this.changeLiked();
                });
                API.uid && API.xhr({
                    url: \`https://api.bilibili.com/x/web-interface/archive/has/like?aid=\${API.aid}\`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    d = API.jsonCheck(d).data;
                    d === 1 && (this.liked = true, this.changeLiked());
                });
            }
            catch (e) {
                API.toast.error("点赞失败！");
                API.debug.error("点赞失败！", e);
            }
        }
        /** 修补样式 */
        style() {
            let style = \`.ulike {cursor: pointer;}.ulike svg{vertical-align: middle;margin-right: 10px;}\`;
            switch (this.type) {
                case "bangumi":
                    style += \`.ulike {margin-left: 15px;position: relative;float: left;height: 100%;line-height: 18px;font-size: 12px;color: #222;}\`;
                    break;
                case "watchlater":
                    style += \`.video-info-module .number .ulike {margin-left: 15px;margin-right: 5px;}\`;
                    break;
                default: style += \`.video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}\`;
            }
            API.addCss(style);
        }
        /** 点赞响应 */
        setLike() {
            if (API.uid) {
                const like = this.liked ? 2 : 1;
                API.xhr({
                    url: "https://api.bilibili.com/x/web-interface/archive/like",
                    method: "POST",
                    data: \`aid=\${API.aid}&like=\${like}&csrf=\${API.getCookies().bili_jct}\`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    API.jsonCheck(d).ttl;
                    this.liked = !this.liked;
                    this.number = this.liked ? this.number + 1 : this.number - 1;
                    this.changeLiked();
                });
            }
            else {
                API.toast.warning("请先登录 щ(ʘ╻ʘ)щ");
                API.biliQuickLogin();
            }
        }
        /** 图标及数目变化 */
        changeLiked() {
            this.span.innerHTML = \`\${this.liked ? this.svgEnLike : this.svgLike}</i>点赞 \${API.unitFormat(this.number) || "--"}\`;
        }
        /** 切p后刷新数据 */
        switch() {
            if (this.aid != API.aid) {
                this.aid = API.aid;
                API.xhr({
                    url: \`https://api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    this.number = API.jsonCheck(d).data.stat.like;
                    this.changeLiked();
                });
            }
        }
    }
    API.enLike = enLike;

//# sourceURL=file://@Bilibili-Old/vector/url/av/enLike.js`;
/*!***********************!*/
/**/modules["loadByDmId.js"] = /*** ./src/vector/url/av/loadByDmId.js ***/
`
    const dmid = API.urlObj(location.href).dmid;
    let progress = Number(API.urlObj(location.href).dm_progress);
    let first = 0;
    API.switchVideo(async () => {
        if (!window.player?.seek) {
            await new Promise(r => {
                API.doWhile(() => window.player?.seek, r);
            });
        }
        if (first)
            return;
        first++;
        if (progress)
            return window.player.seek(progress);
        if (dmid) {
            progress = await API.xhr({
                url: \`https://api.bilibili.com/x/v2/dm/thumbup/detail?oid=\${API.cid}&dmid=\${dmid}\`,
                credentials: true
            }, true);
            progress = API.jsonCheck(progress).data.progress; // 检查xhr返回值并转化为json
            progress && window.player.seek(progress / 1000 - .2);
        }
    });

//# sourceURL=file://@Bilibili-Old/vector/url/av/loadByDmId.js`;
/*!***********************!*/
/**/modules["menuConfig.txt"] = /*** ./src/vector/url/av/menuConfig.txt ***/
`[{name:"首页",route:"/",tid:"",locid:23,sub:[]},{name:"动画",route:"douga",tid:1,locid:52,count:"",subMenuSize:162,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2507,leftId:2452,rightId:2453},sub:[{name:"MAD·AMV",route:"mad",tid:24,ps:15,rps:10,ad:{active:!0,dataLocId:151},desc:"具有一定制作程度的动画或静画的二次创作视频",url:"//www.bilibili.com/video/douga-mad-1.html"},{name:"MMD·3D",route:"mmd",tid:25,ps:15,rps:10,ad:{active:!0,dataLocId:152},desc:"使用MMD（MikuMikuDance）和其他3D建模类软件制作的视频",url:"//www.bilibili.com/video/douga-mmd-1.html"},{name:"短片·手书·配音",route:"voice",tid:47,ps:15,rps:10,desc:"追求创新并具有强烈特色的短片、手书（绘）及ACG相关配音",url:"//www.bilibili.com/video/douga-voice-1.html"},{name:"手办·模玩",route:"garage_kit",tid:210,ps:15,rps:10,desc:"手办模玩的测评、改造或其他衍生内容",url:""},{name:"特摄",route:"tokusatsu",tid:86,ps:15,rps:10,desc:"特摄相关衍生视频",url:"//www.bilibili.com/video/cinephile-tokusatsu.html"},{name:"综合",route:"other",tid:27,ps:15,rps:10,ad:{active:!0,dataLocId:153},desc:"以动画及动画相关内容为素材，包括但不仅限于音频替换、杂谈、排行榜等内容",url:"//www.bilibili.com/video/douga-else-1.html"}]},{name:"番剧",route:"anime",tid:13,url:"//www.bilibili.com/anime/",takeOvered:!0,count:"",subMenuSize:172,combination:!0,sub:[{name:"连载动画",tid:33,route:"serial",desc:"当季连载的动画番剧",url:"//www.bilibili.com/video/bangumi-two-1.html"},{name:"完结动画",tid:32,route:"finish",desc:"已完结的动画番剧合集",url:"//www.bilibili.com/video/part-twoelement-1.html"},{name:"资讯",tid:51,route:"information",desc:"动画番剧相关资讯视频",url:"//www.bilibili.com/video/douga-else-information-1.html"},{name:"官方延伸",tid:152,route:"offical",desc:"动画番剧为主题的宣传节目、采访视频，及声优相关视频",url:"//www.bilibili.com/video/bagumi_offical_1.html"},{name:"新番时间表",url:"//www.bilibili.com/anime/timeline/",desc:""},{name:"番剧索引",url:"//www.bilibili.com/anime/index/",desc:""}]},{name:"国创",tid:167,route:"guochuang",url:"//www.bilibili.com/guochuang/",takeOvered:!0,count:"",subMenuSize:214,combination:!0,sub:[{name:"国产动画",tid:153,route:"chinese",desc:"我国出品的PGC动画",url:"//www.bilibili.com/video/bangumi_chinese_1.html"},{name:"国产原创相关",tid:168,route:"original",desc:"",url:"//www.bilibili.com/video/guochuang-fanvid-1.html"},{name:"布袋戏",tid:169,route:"puppetry",desc:"",url:"//www.bilibili.com/video/glove-puppetry-1.html"},{name:"动态漫·广播剧",tid:195,route:"motioncomic",desc:"",url:""},{name:"资讯",tid:170,route:"information",desc:"",url:"//www.bilibili.com/video/guochuang-offical-1.html"},{name:"新番时间表",url:"//www.bilibili.com/guochuang/timeline/",desc:""},{name:"国产动画索引",url:"//www.bilibili.com/guochuang/index/",desc:""}]},{name:"音乐",route:"music",tid:3,locid:58,count:"",subMenuSize:268,slider:{width:620,height:220},viewTag:!0,customComponent:{name:"Energy",titleId:2511,leftId:2462,rightId:3131,rightType:"slide"},sub:[{name:"原创音乐",route:"original",tid:28,ps:15,rps:10,viewHotTag:!0,ad:{active:!0,dataLocId:243},dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"原创歌曲及纯音乐，包括改编、重编曲及remix",url:"//www.bilibili.com/video/music-original-1.html"},{name:"翻唱",route:"cover",tid:31,ps:15,rps:10,ad:{active:!0,dataLocId:245},viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"对曲目的人声再演绎视频",url:"//www.bilibili.com/video/music-Cover-1.html"},{name:"演奏",route:"perform",tid:59,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"乐器和非传统乐器器材的演奏作品",url:"//www.bilibili.com/video/music-perform-1.html"},{name:"VOCALOID·UTAU",route:"vocaloid",tid:30,ps:15,rps:10,viewHotTag:!0,ad:{active:!0,dataLocId:247},dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"以VOCALOID等歌声合成引擎为基础，运用各类音源进行的创作",url:"//www.bilibili.com/video/music-vocaloid-1.html"},{name:"音乐现场",route:"live",tid:29,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"音乐表演的实况视频，包括官方/个人拍摄的综艺节目、音乐剧、音乐节、演唱会等",url:"//www.bilibili.com/video/music-oped-1.html"},{name:"MV",route:"mv",tid:193,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"为音乐作品配合拍摄或制作的音乐录影带（Music Video），以及自制拍摄、剪辑、翻拍MV",url:"//www.bilibili.com/video/music-coordinate-1.html"},{name:"乐评盘点",route:"commentary",tid:243,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"音乐类新闻、盘点、点评、reaction、榜单、采访、幕后故事、唱片开箱等",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音乐教学",route:"tutorial",tid:244,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"以音乐教学为目的的内容",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音乐综合",route:"other",tid:130,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"所有无法被收纳到其他音乐二级分区的音乐类视频",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音频",customZone:"Audio",route:"audio",url:"//www.bilibili.com/audio/home?musicType=music"},{name:"说唱",url:"//www.bilibili.com/v/rap"}]},{name:"舞蹈",route:"dance",tid:129,locid:64,count:"",subMenuSize:172,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2513,leftId:2472,rightId:2473},sub:[{name:"宅舞",route:"otaku",tid:20,ps:15,rps:10,ad:{active:!0,dataLocId:249},desc:"与ACG相关的翻跳、原创舞蹈",url:"//www.bilibili.com/video/dance-1.html"},{name:"街舞",route:"hiphop",tid:198,ps:15,rps:10,ad:{active:!0,dataLocId:251},desc:"收录街舞相关内容，包括赛事现场、舞室作品、个人翻跳、FREESTYLE等",url:""},{name:"明星舞蹈",route:"star",tid:199,ps:15,rps:10,desc:"国内外明星发布的官方舞蹈及其翻跳内容",url:""},{name:"中国舞",route:"china",tid:200,ps:15,rps:10,ad:{active:!0,dataLocId:253},desc:"传承中国艺术文化的舞蹈内容，包括古典舞、民族民间舞、汉唐舞、古风舞等",url:""},{name:"舞蹈综合",route:"three_d",tid:154,ps:15,rps:10,desc:"收录无法定义到其他舞蹈子分区的舞蹈视频",url:""},{name:"舞蹈教程",route:"demo",tid:156,ps:10,rps:6,desc:"镜面慢速，动作分解，基础教程等具有教学意义的舞蹈视频",url:"//www.bilibili.com/video/dance-demo-1.html"}]},{name:"游戏",route:"game",tid:4,locid:70,count:"",subMenuSize:240,slider:{width:470,height:216},viewTag:!0,customComponent:{name:"Energy",titleId:3761,leftId:3765,rightId:3775,rightType:"slide"},recommendCardType:"GameGroomBox",sub:[{name:"单机游戏",route:"stand_alone",tid:17,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:255},dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"以所有平台（PC、主机、移动端）的单机或联机游戏为主的视频内容，包括游戏预告、CG、实况解说及相关的评测、杂谈与视频剪辑等",url:"//www.bilibili.com/video/videogame-1.html"},{name:"电子竞技",route:"esports",tid:171,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:257},desc:"具有高对抗性的电子竞技游戏项目，其相关的赛事、实况、攻略、解说、短剧等视频。",url:"//www.bilibili.com/video/esports-1.html"},{name:"手机游戏",route:"mobile",tid:172,ps:10,rps:7,rankshow:1,viewHotTag:!0,desc:"以手机及平板设备为主要平台的游戏，其相关的实况、攻略、解说、短剧、演示等视频。",url:"//www.bilibili.com/video/mobilegame-1.html"},{name:"网络游戏",route:"online",tid:65,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:259},dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"由网络运营商运营的多人在线游戏，以及电子竞技的相关游戏内容。包括赛事、攻略、实况、解说等相关视频",url:"//www.bilibili.com/video/onlinegame-1.html"},{name:"桌游棋牌",route:"board",tid:173,ps:5,rps:3,rankshow:1,viewHotTag:!0,desc:"桌游、棋牌、卡牌对战等及其相关电子版游戏的实况、攻略、解说、演示等视频。",url:"//www.bilibili.com/video/boardgame-1.html"},{name:"GMV",route:"gmv",tid:121,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"由游戏素材制作的MV视频。以游戏内容或CG为主制作的，具有一定创作程度的MV类型的视频",url:"//www.bilibili.com/video/gmv-1.html"},{name:"音游",route:"music",tid:136,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"各个平台上，通过配合音乐与节奏而进行的音乐类游戏视频",url:"//www.bilibili.com/video/music-game-1.html"},{name:"Mugen",route:"mugen",tid:19,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"以Mugen引擎为平台制作、或与Mugen相关的游戏视频",url:"//www.bilibili.com/video/game-mugen-1.html"},{name:"游戏赛事",url:"//www.bilibili.com/v/game/match/",newIcon:!0}]},{name:"知识",route:"knowledge",tid:36,locid:76,count:"",subMenuSize:172,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2058,leftId:2047,rightId:2048},sub:[{name:"科学科普",route:"science",tid:201,ps:15,rps:10,ad:{active:!0,dataLocId:261},desc:"回答你的十万个为什么"},{name:"社科·法律·心理",route:"social_science",tid:124,ps:15,rps:10,ad:{active:!0,dataLocId:263},desc:"基于社会科学、法学、心理学展开或个人观点输出的知识视频"},{name:"人文历史",route:"humanity_history",tid:228,ps:15,rps:10,desc:"看看古今人物，聊聊历史过往，品品文学典籍"},{name:"财经商业",route:"business",tid:207,ps:15,rps:10,desc:"说金融市场，谈宏观经济，一起畅聊商业故事"},{name:"校园学习",route:"campus",tid:208,ps:15,rps:10,ad:{active:!0,dataLocId:265},desc:"老师很有趣，学生也有才，我们一起搞学习"},{name:"职业职场",route:"career",tid:209,ps:15,rps:10,desc:"职业分享、升级指南，一起成为最有料的职场人"},{name:"设计·创意",route:"design",tid:229,ps:15,rps:10,desc:"天马行空，创意设计，都在这里"},{name:"野生技能协会",route:"skill",tid:122,ps:15,rps:10,desc:"技能党集合，是时候展示真正的技术了"}]},{name:"科技",route:"tech",tid:188,locid:2977,count:"",subMenuSize:80,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2980,leftId:2978,rightId:2979},sub:[{name:"数码",route:"digital",tid:95,ps:15,rps:10,viewHotTag:!0,desc:"科技数码产品大全，一起来做发烧友",url:"#"},{name:"软件应用",route:"application",tid:230,ps:15,rps:10,viewHotTag:!0,desc:"超全软件应用指南",url:"#"},{name:"计算机技术",route:"computer_tech",tid:231,ps:15,rps:10,viewHotTag:!0,desc:"研究分析、教学演示、经验分享......有关计算机技术的都在这里",url:"#"},{name:"科工机械",route:"industry",tid:232,ps:15,rps:10,viewHotTag:!0,desc:"从小芯片到大工程，一起见证科工力量",url:"#"},{name:"极客DIY",route:"diy",tid:233,ps:15,rps:10,viewHotTag:!0,desc:"炫酷技能，极客文化，硬核技巧，准备好你的惊讶",url:"#"}]},{name:"运动",route:"sports",tid:234,locid:4639,isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4646,rightId:4652,rightType:"slide"},sub:[{name:"篮球·足球",route:"basketballfootball",tid:235,ps:15,rps:10,ad:{active:!0,dataLocId:4656},desc:"与篮球、足球相关的视频，包括但不限于篮足球赛事、教学、评述、剪辑、剧情等相关内容",url:"#"},{name:"健身",route:"aerobics",tid:164,ps:15,rps:10,desc:"与健身相关的视频，包括但不限于瑜伽、CrossFit、健美、力量举、普拉提、街健等相关内容",url:"//www.bilibili.com/video/fashion-body-1.html"},{name:"竞技体育",route:"athletic",tid:236,ps:15,rps:10,desc:"与竞技体育相关的视频，包括但不限于乒乓、羽毛球、排球、赛车等竞技项目的赛事、评述、剪辑、剧情等相关内容",url:"#"},{name:"运动文化",route:"culture",tid:237,ps:15,rps:10,desc:"与运动文化相关的视频，包络但不限于球鞋、球衣、球星卡等运动衍生品的分享、解读，体育产业的分析、科普等相关内容",url:"#"},{name:"运动综合",route:"comprehensive",tid:238,ps:15,rps:10,desc:"与运动综合相关的视频，包括但不限于钓鱼、骑行、滑板等日常运动分享、教学、Vlog等相关内容",url:"#"}]},{name:"汽车",route:"car",tid:223,locid:4428,isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4435,rightId:4441,rightType:"slide"},sub:[{name:"汽车生活",route:"life",tid:176,ps:15,rps:10,ad:{active:!0,dataLocId:4445},desc:"分享汽车及出行相关的生活体验类视频",url:"#"},{name:"汽车文化",route:"culture",tid:224,ps:15,rps:10,desc:"汽车改装、品牌历史、汽车设计、老爷车、汽车模型等",url:"#"},{name:"赛车",route:"racing",tid:245,ps:15,rps:10,desc:"F1等汽车运动相关",url:"#"},{name:"汽车极客",route:"geek",tid:225,ps:15,rps:10,desc:"汽车硬核达人聚集地，包括DIY造车、专业评测和技术知识分享",url:"#"},{name:"摩托车",route:"motorcycle",tid:240,ps:15,rps:10,desc:"骑士们集合啦",url:"#"},{name:"智能出行",route:"smart",tid:226,ps:15,rps:10,desc:"探索新能源汽车和未来智能出行的前沿阵地",url:"#"},{name:"购车攻略",route:"strategy",tid:227,ps:15,rps:10,desc:"丰富详实的购车建议和新车体验",url:"#"}]},{name:"生活",route:"life",tid:160,locid:88,count:"",subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2062,leftId:1674,rightId:1670},sub:[{name:"搞笑",route:"funny",tid:138,ps:15,rps:10,ad:{active:!0,dataLocId:273},desc:"各种沙雕有趣的搞笑剪辑，挑战，表演，配音等视频",url:"//www.bilibili.com/video/ent_funny_1.html",locid:4204,recommendId:4210,slider:{width:620,height:220},customComponent:{name:"Energy",leftId:4212,rightId:4218,rightType:"slide"}},{name:"家居房产",route:"home",tid:239,ps:15,rps:10,ad:{active:!0,dataLocId:275},desc:"与买房、装修、居家生活相关的分享",url:"#"},{name:"手工",route:"handmake",tid:161,ps:15,rps:10,desc:"手工制品的制作过程或成品展示、教程、测评类视频",url:"//www.bilibili.com/video/ent-handmake-1.html"},{name:"绘画",route:"painting",tid:162,ps:15,rps:10,desc:"绘画过程或绘画教程，以及绘画相关的所有视频",url:"//www.bilibili.com/video/ent-painting-1.html"},{name:"日常",route:"daily",tid:21,ps:15,rps:10,desc:"记录日常生活，分享生活故事",url:"//www.bilibili.com/video/ent-life-1.html"}]},{name:"美食",route:"food",tid:211,locid:4243,count:"",isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4258,rightId:4264},sub:[{name:"美食制作",route:"make",tid:76,ps:15,rps:10,ad:{active:!0,dataLocId:4268},desc:"学做人间美味，展示精湛厨艺",url:"#"},{name:"美食侦探",route:"detective",tid:212,ps:15,rps:10,desc:"寻找美味餐厅，发现街头美食",url:"#"},{name:"美食测评",route:"measurement",tid:213,ps:15,rps:10,desc:"吃货世界，品尝世间美味",url:"#"},{name:"田园美食",route:"rural",tid:214,ps:15,rps:10,desc:"品味乡野美食，寻找山与海的味道",url:"#"},{name:"美食记录",route:"record",tid:215,ps:15,rps:10,desc:"记录一日三餐，给生活添一点幸福感",url:"#"}]},{name:"动物圈",route:"animal",tid:217,locid:4365,count:"",isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4376,rightId:4381,rightType:"slide"},sub:[{name:"喵星人",route:"cat",tid:218,ps:15,rps:10,desc:"喵喵喵喵喵",url:"#",ad:{active:!0,dataLocId:4385}},{name:"汪星人",route:"dog",tid:219,ps:15,rps:10,desc:"汪汪汪汪汪",url:"#"},{name:"大熊猫",route:"panda",tid:220,ps:15,rps:10,desc:"芝麻汤圆营业中",url:"#"},{name:"野生动物",route:"wild_animal",tid:221,ps:15,rps:10,desc:"内有“猛兽”出没",url:"#"},{name:"爬宠",route:"reptiles",tid:222,ps:15,rps:10,desc:"鳞甲有灵",url:"#"},{name:"动物综合",route:"animal_composite",tid:75,ps:15,rps:10,desc:"收录除上述子分区外，其余动物相关视频以及非动物主体或多个动物主体的动物相关延伸内容",url:"#"}]},{name:"鬼畜",route:"kichiku",tid:119,locid:100,count:"",subMenuSize:182,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2509,leftId:2482,rightId:2483},sub:[{name:"鬼畜调教",route:"guide",tid:22,ps:15,rps:10,ad:{active:!0,dataLocId:285},desc:"使用素材在音频、画面上做一定处理，达到与BGM一定的同步感",url:"//www.bilibili.com/video/ent-Kichiku-1.html"},{name:"音MAD",route:"mad",tid:26,ps:15,rps:10,ad:{active:!0,dataLocId:287},desc:"使用素材音频进行一定的二次创作来达到还原原曲的非商业性质稿件",url:"//www.bilibili.com/video/douga-kichiku-1.html"},{name:"人力VOCALOID",route:"manual_vocaloid",tid:126,ps:15,rps:10,desc:"将人物或者角色的无伴奏素材进行人工调音，使其就像VOCALOID一样歌唱的技术",url:"//www.bilibili.com/video/kichiku-manual_vocaloid-1.html"},{name:"鬼畜剧场",route:"theatre",tid:216,ps:15,rps:10,desc:"使用素材进行人工剪辑编排的有剧情的作品"},{name:"教程演示",route:"course",tid:127,ps:10,rps:6,rightComponent:{name:"CmImgList",id:148},ad:{active:!0,dataLocId:289},hideDropdown:!1,desc:"鬼畜相关的教程演示",url:"//www.bilibili.com/video/kichiku-course-1.html"}]},{name:"时尚",route:"fashion",tid:155,locid:94,count:"",subMenuSize:124,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2515,leftId:2492,rightId:2493},sub:[{name:"美妆护肤",route:"makeup",tid:157,ps:15,rps:10,ad:{active:!0,dataLocId:279},desc:"彩妆护肤、美甲美发、仿妆、医美相关内容分享或产品测评",url:"//www.bilibili.com/video/fashion-makeup-fitness-1.html"},{name:"穿搭",route:"clothing",tid:158,ps:15,rps:10,ad:{active:!0,dataLocId:281},desc:"穿搭风格、穿搭技巧的展示分享，涵盖衣服、鞋靴、箱包配件、配饰（帽子、钟表、珠宝首饰）等",url:"//www.bilibili.com/video/fashion-clothing-1.html"},{name:"时尚潮流",route:"trend",tid:159,ps:15,rps:10,desc:"时尚街拍、时装周、时尚大片，时尚品牌、潮流等行业相关记录及知识科普",url:"#"}]},{name:"资讯",route:"information",tid:202,locid:4076,count:"",subMenuSize:60,slider:{width:620,height:220},viewTag:!1,sub:[{name:"热点",route:"hotspot",tid:203,ps:18,rps:10,desc:"全民关注的时政热门资讯"},{name:"环球",route:"global",tid:204,ps:18,rps:10,desc:"全球范围内发生的具有重大影响力的事件动态"},{name:"社会",route:"social",tid:205,ps:18,rps:10,desc:"日常生活的社会事件、社会问题、社会风貌的报道"},{name:"综合",route:"multiple",tid:206,ps:18,rps:10,desc:"除上述领域外其它垂直领域的综合资讯"}]},{name:"娱乐",route:"ent",tid:5,locid:82,count:"",subMenuSize:62,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2067,leftId:2065,rightId:2066},sub:[{name:"综艺",route:"variety",tid:71,ps:15,rps:10,ad:{active:!0,dataLocId:267},desc:"所有综艺相关，全部一手掌握！",url:"//www.bilibili.com/video/ent-variety-1.html"},{name:"娱乐杂谈",route:"talker",tid:241,ps:15,rps:10,ad:{active:!0,dataLocId:269},desc:"娱乐人物解读、娱乐热点点评、娱乐行业分析"},{name:"粉丝创作",route:"fans",tid:242,ps:15,rps:10,desc:"粉丝向创作视频"},{name:"明星综合",route:"celebrity",tid:137,ps:15,rps:10,desc:"娱乐圈动态、明星资讯相关"}]},{name:"影视",route:"cinephile",tid:181,locid:2211,count:"",subMenuSize:84,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2309,leftId:2307,rightId:2308},sub:[{name:"影视杂谈",route:"cinecism",tid:182,ps:15,rps:10,ad:{active:!0,dataLocId:2212},desc:"影视评论、解说、吐槽、科普等",url:"//www.bilibili.com/video/cinephile-cinecism.html"},{name:"影视剪辑",route:"montage",tid:183,ps:15,rps:10,ad:{active:!0,dataLocId:2213},desc:"对影视素材进行剪辑再创作的视频",url:"//www.bilibili.com/video/cinephile-montage.html"},{name:"短片",route:"shortfilm",tid:85,ps:15,rps:10,desc:"追求自我表达且具有特色的短片",url:"//www.bilibili.com/video/cinephile-shortfilm.html"},{name:"预告·资讯",route:"trailer_info",tid:184,ps:15,rps:10,ad:{active:!0,dataLocId:2214},desc:"影视类相关资讯，预告，花絮等视频",url:"//www.bilibili.com/video/cinephile-trailer-info.html"}]},{name:"纪录片",route:"documentary",tid:177,url:"//www.bilibili.com/documentary/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"人文·历史",tid:37,route:"history",dise:"",url:"//www.bilibili.com/video/doco-history.html"},{name:"科学·探索·自然",tid:178,route:"science",dise:"",url:"//www.bilibili.com/video/doco-science.html"},{name:"军事",tid:179,route:"military",dise:"",url:"//www.bilibili.com/video/doco-military.html"},{name:"社会·美食·旅行",tid:180,route:"travel",dise:"",url:"//www.bilibili.com/video/doco-travel.html"},{name:"纪录片索引",url:"//www.bilibili.com/documentary/index/"}]},{name:"电影",route:"movie",tid:23,url:"//www.bilibili.com/movie/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"华语电影",tid:147,route:"chinese",desc:"",url:"//www.bilibili.com/video/movie_chinese_1.html"},{name:"欧美电影",tid:145,route:"west",desc:"",url:"//www.bilibili.com/video/movie_west_1.html"},{name:"日本电影",tid:146,route:"japan",desc:"",url:"//www.bilibili.com/video/movie_japan_1.html"},{name:"其他国家",tid:83,route:"movie",desc:"",url:"//www.bilibili.com/video/movie-movie-1.html"},{name:"电影索引",url:"//www.bilibili.com/movie/index/"}]},{name:"电视剧",route:"tv",tid:11,url:"//www.bilibili.com/tv/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"国产剧",tid:185,route:"mainland",desc:"",url:"//www.bilibili.com/video/tv-mainland.html"},{name:"海外剧",tid:187,route:"overseas",desc:"",url:"//www.bilibili.com/video/tv-overseas.html"},{name:"电视剧索引",url:"//www.bilibili.com/tv/index/"}]},{name:"虚拟UP主",route:"virtual",locid:4735,count:"",isHide:!0,subMenuSize:60,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:4754,leftId:4756},sub:[{name:"游戏",route:"game",tid:4,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/game"},{name:"音乐",route:"music",tid:3,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/music"},{name:"动画",route:"douga",tid:1,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/douga"},{name:"其他",route:"other",tid:0,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/other"}]}]`;
/*!***********************!*/
/**/modules["upList.css"] = /*** ./src/vector/url/av/upList.css ***/
`.up-info-m .up-card-box {
    white-space: nowrap;
    overflow: auto;
}

.up-info-m .up-card {
    display: inline-block;
    margin-top: 10px;
}

.up-info-m .avatar img {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.up-info-m .avatar {
    position: relative;
}

.up-info-m .avatar .info-tag {
    position: absolute;
    background: #fff;
    border: 1px solid #fb7299;
    border-radius: 2px;
    display: inline-block;
    font-size: 12px;
    color: #fb7299;
    padding: 0 3px;
    top: -10px;
    right: -10px;
    white-space: nowrap;
}

.up-info-m .avatar {
    width: 60px;
    height: 30px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: start;
    align-items: flex-start;
}

.up-info-m .avatar .name-text {
    font-family: PingFangSC-Regular, sans-serif;
    line-height: 30px;
    color: #222;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: nowrap;
}

.up-info-m .avatar .name-text.is-vip,
.up-info-m .avatar .name-text:hover {
    color: #fb7299;
}

.up-info-m .title {
    display: block;
    font-size: 14px;
    margin-right: 80px;
    color: #525659;
    overflow: hidden;
    height: 24px;
    font-weight: 400;
    padding: 8px 0;
}

.up-card-box::-webkit-scrollbar {
    width: 7px;
}

.up-card-box::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: #EEE;
}

.up-card-box::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #999;
}`;
/*!***********************!*/
/**/modules["upList.js"] = /*** ./src/vector/url/av/upList.js ***/
`
    function upList(staff) {
        API.doWhile(() => document.querySelector("#v_upinfo"), node => {
            let fl = '<span class="title">UP主列表</span><div class="up-card-box">';
            fl = staff.reduce((s, d) => {
                s = s + \`<div class="up-card">
                <a href="//space.bilibili.com/\${d.mid}" data-usercard-mid="\${d.mid}" target="_blank" class="avatar">
                <img src="\${d.face}@48w_48h.webp" /><!---->
                <span class="info-tag">\${d.title}</span><!----></a>
                <div class="avatar">
                <a href="//space.bilibili.com/\${d.mid}" data-usercard-mid="\${d.mid}" target="_blank" class="\${(d.vip && d.vip.status) ? 'name-text is-vip' : 'name-text'}">\${d.name}</a>
                </div></div>\`;
                return s;
            }, fl) + \`</div>\`;
            node.innerHTML = fl;
            API.addCss(API.getModule("upList.css"));
        });
    }
    API.upList = upList;

//# sourceURL=file://@Bilibili-Old/vector/url/av/upList.js`;
/*!***********************!*/
/**/modules["bangumi-initial-state.js"] = /*** ./src/vector/url/bangumi/bangumi-initial-state.js ***/
`
    /** epStat，用于判定ep状态。同样由于原生缺陷，ep_id初始化时不会更新本信息，需要主动更新 */
    function setEpStat(status, pay, payPackPaid, loginInfo) {
        var s = 0, o = !1, a = (1 === loginInfo.vipType || 2 === loginInfo.vipType) && 1 === loginInfo.vipStatus, r = "number" == typeof payPackPaid ? payPackPaid : -1;
        return 1 === pay ? s = 0 : 6 === status || 7 === status ? s = loginInfo.isLogin ? a ? 0 : 1 : 2 : 8 === status || 9 === status ? (s = loginInfo.isLogin ? 1 : 2,
            o = !0) : 12 === status ? s = loginInfo.isLogin ? 1 === r ? 0 : 1 : 2 : 13 === status && (s = loginInfo.isLogin ? a ? 0 : 1 : 2),
            {
                status: s,
                isPay: 6 === status || 7 === status || 8 === status || 9 === status || 12 === status || 13 === status,
                isVip: a,
                vipNeedPay: o,
                payPack: r
            };
    }
    function V(t, e) {
        var i = Number(t), n = 1 === e || 4 === e || "番剧" === e || "国创" === e ? "话" : "集";
        return isNaN(i) ? t : "第".concat(i).concat(n);
    }
    function Q(t, e) {
        var i = {
            1: "番剧",
            2: "电影",
            3: "纪录片",
            4: "国创",
            5: "电视剧",
            7: "综艺",
            music: "音乐"
        };
        return [26484, 26481].indexOf(e) > -1 ? i.music : i[t] || "番剧";
    }
    function setTitle(t, e, i, n) {
        var s = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4], o = "";
        if (i = void 0 === i ? "番剧" : i,
            e && i)
            if (s && t) {
                var a = V(t, i);
                o = "".concat(e, "：").concat(a, "_").concat(i).concat(n ? "_bilibili" : "", "_哔哩哔哩");
            }
            else
                o = "".concat(e, "_").concat(i).concat(n ? "_bilibili" : "", "_哔哩哔哩");
        else
            o = "番剧".concat(n ? "_bilibili" : "", "_哔哩哔哩");
        if ("undefined" != typeof window) {
            var r = window.document.createElement("div");
            r.innerHTML = o,
                o = r.innerText || r.textContent,
                r = null;
        }
        return o;
    }
    async function bangumiInitialState() {
        try {
            const obj = API.epid ? { ep_id: API.epid } : { season_id: API.ssid };
            const result = await Promise.allSettled([
                API.xhr({
                    url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", obj),
                    responseType: "json",
                    credentials: true
                }, true),
                API.xhr({
                    url: API.objUrl("https://api.bilibili.com/pgc/view/web/season/user/status", obj),
                    responseType: "json",
                    credentials: true
                }, true)
            ]);
            const data = {};
            const t = window.__INITIAL_STATE__;
            result[0].status === "fulfilled" && (result[0].value.code === 0) && (data.bangumi = result[0].value.result);
            result[1].status === "fulfilled" && (result[1].value.code === 0) && (data.status = result[1].value.result);
            if (data.status) {
                const i = data.status.progress ? data.status.progress.last_ep_id : -1, n = data.status.progress ? data.status.progress.last_ep_index : "", s = data.status.progress ? data.status.progress.last_time : 0, o = data.status.vip_info || {};
                !API.epid && i > 0 && (API.epid = i); // 正常启动必须
                t.userStat = {
                    loaded: !0,
                    error: void 0 === data.status.pay,
                    follow: data.status.follow || 0,
                    pay: data.status.pay || 0,
                    payPackPaid: data.status.pay_pack_paid || 0,
                    sponsor: data.status.sponsor || 0,
                    watchProgress: {
                        lastEpId: 0 === i ? -1 : i,
                        lastEpIndex: n,
                        lastTime: s
                    },
                    vipInfo: {
                        due_date: o.due_date || 0,
                        status: o.status || 0,
                        type: o.type || 0
                    }
                };
                data.status.paster && (t.paster = data.status.paster || {});
                API.limit = data.status.area_limit || 0;
                !API.config.videoLimit.switch && (t.area = API.limit);
                t.seasonFollowed = 1 === data.status.follow;
            }
            if (data.bangumi) {
                // -> bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js:1148
                // 原数据有些问题导致一些回调事件不会正常加载需要主动写入epId、epInfo（顺序）
                // 如果没有这个错误，根本必须手动重构\`__INITIAL_STATE__\` 🤣
                const i = JSON.parse(JSON.stringify(data.bangumi));
                delete i.episodes;
                delete i.seasons;
                delete i.up_info;
                delete i.rights;
                delete i.publish;
                delete i.newest_ep;
                delete i.rating;
                delete i.pay_pack;
                delete i.payment;
                delete i.activity;
                if (API.config.bangumiEplist)
                    delete i.bkg_cover;
                // APP限制
                API.config.videoLimit.switch && data.bangumi.rights && (data.bangumi.rights.watch_platform = 0);
                t.mediaInfo = i;
                t.mediaInfo.bkg_cover && (t.special = !0, API.bkg_cover = t.mediaInfo.bkg_cover);
                t.ssId = data.bangumi.season_id || -1;
                t.mdId = data.bangumi.media_id;
                t.epInfo = (API.epid && data.bangumi.episodes.find((d) => d.ep_id == API.epid)) || data.bangumi.episodes[0];
                t.epList = data.bangumi.episodes || [];
                t.seasonList = data.bangumi.seasons || [];
                t.upInfo = data.bangumi.up_info || {};
                t.rightsInfo = data.bangumi.rights || {};
                t.app = 1 === t.rightsInfo.watch_platform;
                t.pubInfo = data.bangumi.publish || {};
                t.newestEp = data.bangumi.newest_ep || {};
                t.mediaRating = data.bangumi.rating || {};
                t.payPack = data.bangumi.pay_pack || {};
                t.payMent = data.bangumi.payment || {};
                t.activity = data.bangumi.activity || {};
                t.epStat = setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
                t.epId = API.epid || data.bangumi.episodes[0].ep_id;
                // 记录bangumi参数备用
                Object.defineProperties(API, {
                    ssid: {
                        configurable: true,
                        get: () => t.ssId
                    },
                    epid: {
                        configurable: true,
                        get: () => t.epId
                    }
                });
                if (t.epInfo.badge === "互动") {
                    // 番剧能互动？ .e.g: https://www.bilibili.com/bangumi/play/ep385091
                    API.sessionStorage.setItem("keepNew", 1);
                    location.reload();
                }
                if (t.upInfo.mid == /** Classic_Anime */ 677043260 || t.upInfo.mid == /** Anime_Ongoing */ 688418886) {
                    API.th = true;
                }
                const title = setTitle(t.epInfo.index, t.mediaInfo.title, Q(t.mediaInfo.season_type), !0);
                function loopTitle() {
                    API.doWhile(() => document.title != title, () => {
                        document.title = title;
                        if (document.title != title)
                            loopTitle();
                    });
                }
                loopTitle();
            }
            else {
                API.debug.error(result[0]);
                API.debug.error(result[1]);
                return globalSession();
            }
        }
        catch (e) {
            API.toast.error("获取视频数据出错 ಥ_ಥ");
            API.debug.error("视频数据", e);
        }
    }
    API.bangumiInitialState = bangumiInitialState;
    async function globalSession() {
        API.toast.info("Bangumi号可能无效~", "正在尝试泰区代理接口~");
        const obj = API.epid ? { ep_id: API.epid } : { season_id: API.ssid };
        Object.assign(obj, {
            access_key: API.config.accessKey.key || undefined,
            build: 108003,
            mobi_app: "bstar_a",
            s_locale: "zh_SG"
        });
        try {
            const result = await API.xhr({
                url: API.objUrl(\`https://\${API.config.videoLimit.th || 'api.global.bilibili.com'}/intl/gateway/v2/ogv/view/app/season\`, obj),
                responseType: "json"
            }, true);
            if (result.code === 0) {
                // th = true; 暂不支持播放
                const t = window.__INITIAL_STATE__;
                const i = JSON.parse(JSON.stringify(result.result));
                const episodes = result.result.modules.reduce((s, d) => {
                    d.data.episodes.forEach((d) => {
                        s.push({
                            aid: d.aid,
                            cid: d.id,
                            cover: d.cover,
                            ep_id: d.id,
                            episode_status: d.status,
                            from: d.from,
                            index: d.title,
                            index_title: d.title_display,
                            subtitles: d.subtitles
                        });
                    });
                    return s;
                }, []);
                t.mediaInfo = {
                    actors: i.actor?.info,
                    alias: i.alias,
                    areas: i.areas,
                    cover: i.cover,
                    evaluate: i.evaluate,
                    is_paster_ads: 0,
                    jp_title: i.origin_name,
                    link: i.link,
                    media_id: -1,
                    mode: i.mode,
                    paster_text: "",
                    season_id: i.season_id,
                    season_status: i.status,
                    season_title: i.season_title,
                    season_type: i.type,
                    series_title: i.title,
                    square_cover: i.square_cover,
                    staff: i.actor?.info,
                    stat: i.stat,
                    style: i.styles?.reduce((s, d) => {
                        s.push(d.name);
                        return s;
                    }, []),
                    title: i.title,
                    total_ep: i.total,
                };
                t.mediaInfo.bkg_cover && (t.special = !0, API.bkg_cover = t.mediaInfo.bkg_cover);
                t.ssId = result.result.season_id || -1;
                t.epInfo = (API.epid && episodes.find((d) => d.ep_id == API.epid)) || episodes[0];
                t.epList = episodes;
                t.seasonList = result.result.series?.seasons?.reduce((s, d) => {
                    s.push({
                        badge: "独家",
                        badge_type: 1,
                        cover: "",
                        media_id: -1,
                        new_ep: {},
                        season_id: d.season_id,
                        season_title: d.quarter_title,
                        season_type: 1,
                        stat: {},
                        title: d.quarter_title
                    });
                    return s;
                }, []) || [];
                t.upInfo = result.result.up_info || {};
                t.rightsInfo = result.result.rights || {};
                t.app = 1 === t.rightsInfo.watch_platform;
                result.result.publish.is_started = 1;
                result.result.publish?.time_length_show === "已完结" && (result.result.publish.is_finish = 1);
                t.pubInfo = result.result.publish || {};
                result.result.new_ep.desc = result.result.new_ep.new_ep_display;
                result.result.new_ep.index = result.result.new_ep.title;
                t.newestEp = result.result.new_ep || {};
                t.mediaRating = result.result.rating || {};
                t.payPack = result.result.pay_pack || {};
                t.payMent = result.result.payment || {};
                t.activity = result.result.activity_dialog || {};
                t.epStat = setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
                t.epId = API.epid || episodes[0].ep_id;
                Object.defineProperties(API, {
                    ssid: {
                        configurable: true,
                        get: () => t.ssId
                    },
                    epid: {
                        configurable: true,
                        get: () => t.epId
                    }
                });
                API.th = true;
                API.xhrhook("api.bilibili.com/pgc/web/season/stat", undefined, (res) => {
                    const t = \`{"code": 0,"message":"0","ttl":1,"result":\${JSON.stringify(result.result.stat)}}\`;
                    res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
                }, false);
                API.toast.warning("这大概是一个泰区专属Bangumi，可能没有弹幕和评论区，可以使用脚本【在线弹幕】【播放本地文件】等功能载入弹幕~", "另外：播放泰区番剧还可能导致历史记录错乱，请多担待🤣");
                const title = setTitle(t.epInfo.index, t.mediaInfo.title, Q(t.mediaInfo.season_type), !0);
                function loopTitle() {
                    API.doWhile(() => document.title != title, () => {
                        document.title = title;
                        if (document.title != title)
                            loopTitle();
                    });
                }
                loopTitle();
            }
            else
                throw result;
        }
        catch (e) {
            API.toast.error("访问泰区B站出错，请检查泰区代理服务器设置~", "或许这就是个无效Bangumi？", e);
            API.debug.error("BilibiliGlobal", e);
        }
    }

//# sourceURL=file://@Bilibili-Old/vector/url/bangumi/bangumi-initial-state.js`;
/*!***********************!*/
/**/modules["bangumi-script.html"] = /*** ./src/vector/url/bangumi/bangumi-script.html ***/
`<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
<script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script>
<script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
<script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
<script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script>
<script>
    window.__INITIAL_STATE__ = { activity: {}, app: false, area: 0, canReview: false, epId: -1, epInfo: {}, epList: [], epStat: { isPay: false, isVip: false, payPack: 0, status: 0, vipNeedPay: false }, isPlayerTrigger: false, loginInfo: { isLogin: false }, mdId: -1, mediaInfo: {}, mediaRating: {}, miniOn: 0, newestEp: {}, paster: {}, payMent: {}, payPack: {}, playerRecomList: [], pubInfo: {}, recomList: [], rightsInfo: {}, seasonFollowed: false, seasonList: [], seasonStat: { coins: 0, danmakus: 0, favorites: 0, views: 0 }, special: false, spending: 0, sponsorTotal: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } }, sponsorTotalCount: 0, sponsorWeek: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } }, ssId: -1, ssStat: { isPay: false, isVip: false, payPack: 0, status: 0, vipNeedPay: false }, upInfo: {}, userCoined: false, userLongReview: {}, userScore: 0, userShortReview: {}, userStat: { error: true, follow: 0, loaded: true, pay: 0, payPackPaid: 0, sponsor: 0, vipInfo: { due_date: 0, status: 0, type: 0 }, watchProgress: { lastEpId: -1, lastEpIndex: "", lastTime: 0 } }, ver: {} }; (function () { Reflect.deleteProperty(window, "webpackJsonp"); Reflect.deleteProperty(window, "_babelPolyfill"); var s; (s = document.currentScript || document.scripts[document.scripts.length - 1]).parentNode.removeChild(s); }());
</script>
<script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"
    crossorigin=""></script>
<script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"
    crossorigin=""></script>
<script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script>`;
/*!***********************!*/
/**/modules["bangumi.html"] = /*** ./src/vector/url/bangumi/bangumi.html ***/
`<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->

<head>
    <meta charset="utf-8" />
    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords"
        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
        title="哔哩哔哩" />
    <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" />
    <style type="text/css">
        .new-entry {
            display: none;
        }
    </style>
</head>

<body>
    <div class="z-top-container has-menu"></div>
    <div id="app" data-server-rendered="true" class="main-container"></div>
    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>
</body>

<!-- </html> -->`;
/*!***********************!*/
/**/modules["bangumi.js"] = /*** ./src/vector/url/bangumi/bangumi.js ***/
`
    if (API.rebuildType != "重定向")
        API.windowClear();
    API.pgc = true;
    location.href.replace(/[sS][sS]\\d+/, d => API.ssid = Number(d.substring(2)));
    location.href.replace(/[eE][pP]\\d+/, d => API.epid = Number(d.substring(2)));
    API.loadVideoScript();
    // 修复末尾番剧推荐
    API.xhrhook("api.bilibili.com/pgc/web/recommend/related/recommend", args => {
        // 原接口不返回针对ssid/epid的数据
        args[1] = args[1].replace("web/recommend", "season/web");
    }, r => {
        try {
            const result = API.jsonCheck(r.response);
            result.result = result.data.season;
            r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
        }
        catch (e) { }
    });
    // 修复追番数据
    API.xhrhook("bangumi.bilibili.com/ext/web_api/season_count", args => {
        // bangumi接口已追番数据恒等于0
        args[1] = args[1].replace("bangumi.bilibili.com/ext/web_api/season_count", "api.bilibili.com/pgc/web/season/stat");
    }, r => {
        try {
            const result = API.jsonCheck(r.response);
            result.result.favorites = result.result.follow;
            r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
        }
        catch (e) { }
    }, true);
    // 解除区域限制（重定向模式）
    API.config.videoLimit.switch && API.xhrhook("bangumi.bilibili.com/view/web_api/season/user/status", undefined, res => {
        try {
            const data = res.responseType === "json" ? res.response : JSON.parse(res.response);
            data.result.area_limit = 0;
            data.result.ban_area_show = 0;
            res.responseType === "json" || (res.response = res.responseText = JSON.stringify(data));
        }
        catch (e) { }
    }, false);
    // 修复相关视频推荐 接口来自md页面
    const related = {};
    API.xhrhookAsync("x/web-interface/archive/related", () => (window.__INITIAL_STATE__).mediaInfo.title, async (u, t) => {
        let result = '{ code: 0, data: [], message: "0" }';
        if (related[(window.__INITIAL_STATE__).mediaInfo.title]) {
            result = related[(window.__INITIAL_STATE__).mediaInfo.title];
        }
        else {
            try {
                const info = await API.xhr({
                    url: \`https://api.bilibili.com/x/tag/info?tag_name=\${(window.__INITIAL_STATE__).mediaInfo.title}\`,
                    responseType: "json"
                }, true);
                related[(window.__INITIAL_STATE__).mediaInfo.title] = result = await API.xhr({
                    url: \`https://api.bilibili.com/x/web-interface/tag/top?tid=\${info.data.tag_id}\`
                }, true);
            }
            catch (e) {
                API.debug.error("相关视频推荐", e);
            }
        }
        return t === "json" ? { response: JSON.parse(result) } : { response: result, responseText: result };
    }, false);
    if (API.rebuildType == "重定向") {
        document.documentElement.replaceChildren(API.createElements(API.htmlVnode(API.getModule("bangumi.html"))));
        API.appendScripts(API.getModule("bangumi-script.html")).then(() => API.loadendEvent());
    }
    else {
        window.__Iris__ = true; // 精确爆破新版番剧脚本
        API.documentWrite(API.getModule("bangumi.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", \`\${API.getModule("bangumi-script.html")}</body>\`));
    }
    API.title && (document.title = API.title);
    API.doWhile(() => window.__INITIAL_STATE__, d => {
        API.bangumiInitialState().then(() => {
            API.config.enlike && new API.enLike("bangumi", d.mediaInfo.stat.likes);
            if (d.special) {
                // 带海报的bangumi隐藏顶栏banner和wrapper
                API.addCss("#bili-header-m > #banner_link,#bili-header-m > .bili-wrapper{ display: none; }");
            }
            // -> bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js:1148
            // epid回调经常无法触发导致不加载评论区，手动加载之
            API.doWhile(() => document.querySelector("#app")?.__vue__, d => d.loadComment());
        });
    });
    API.importModule("primaryMenu.js"); // 顶栏分区修正
    API.importModule("banner.js"); // 顶栏banner修复
    API.importModule("loadByDmId.js"); // 弹幕ID跳转
    API.config.episodeData && API.importModule("episodeData.js"); // 分集数据

//# sourceURL=file://@Bilibili-Old/vector/url/bangumi/bangumi.js`;
/*!***********************!*/
/**/modules["bstarPlayurl.js"] = /*** ./src/vector/url/bangumi/bstarPlayurl.js ***/
`
    const descriptionMap = {
        127: "超高清 8K",
        126: "杜比视界",
        125: "HDR",
        121: "超清 4K",
        120: "超清 4K",
        116: "高清 1080P60",
        112: "高清 1080P+",
        80: "高清 1080P",
        74: "高清 720P60",
        64: "高清 720P",
        48: "高清 720P",
        32: "清晰 480P",
        16: "流畅 360P",
        15: "流畅 360P",
        6: "流畅 240P",
        5: "流畅 144P"
    };
    const formatMap = {
        127: "hdflv2",
        126: "hdflv2",
        125: "hdflv2",
        121: "hdflv2",
        120: "hdflv2",
        116: "flv_p60",
        112: "hdflv2",
        80: "flv",
        74: "flv720_p60",
        64: "flv720",
        48: "flv720",
        32: "flv480",
        16: "mp4",
        15: "mp4",
        6: "mp4",
        5: "mp4"
    };
    const qualityMap = {
        127: "8K",
        126: "Dolby",
        125: "HDR",
        121: "4K",
        120: "4K",
        116: "1080P60",
        112: "1080P+",
        80: "1080P",
        74: "720P60",
        64: "720P",
        48: "720P",
        32: "480P",
        16: "360P",
        15: "360P",
        6: "240P",
        5: "144P"
    };
    /** DASH playurl result模板 */
    class Playurl {
        constructor() {
            this.accept_description = [];
            this.accept_format = "";
            this.accept_quality = [];
            this.bp = 0;
            this.code = 0;
            this.dash = {
                audio: [],
                dolby: { audio: [], type: "NONE" },
                duration: 0,
                min_buffer_time: 1.5,
                minBufferTime: 1.5,
                video: []
            };
            this.fnval = 0;
            this.fnver = 0;
            this.format = "flv480";
            this.from = "local";
            this.has_paid = false;
            this.is_preview = 0;
            this.message = "";
            this.no_rexcode = 1;
            this.quality = 32;
            this.result = "suee";
            this.seek_param = "start";
            this.seek_type = "offset";
            this.status = 2;
            this.support_formats = [];
            this.timelength = 0;
            this.type = "DASH";
            this.video_codecid = 7;
            this.video_project = true;
        }
    }
    /** 编码表 */
    const codecs = {
        default: {
            30121: 'hev1.1.6.L156.90',
            121: 'hev1.1.6.L156.90',
            30120: 'avc1.64003C',
            120: 'avc1.64003C',
            30112: 'avc1.640028',
            112: 'avc1.640028',
            30102: 'hev1.1.6.L120.90',
            102: 'hev1.1.6.L120.90',
            30080: 'avc1.640028',
            80: 'avc1.640028',
            30077: 'hev1.1.6.L120.90',
            77: 'hev1.1.6.L120.90',
            30064: 'avc1.64001F',
            64: 'avc1.64001F',
            30066: 'hev1.1.6.L120.90',
            66: 'hev1.1.6.L120.90',
            30032: 'avc1.64001E',
            32: 'avc1.64001E',
            30033: 'hev1.1.6.L120.90',
            33: 'hev1.1.6.L120.90',
            30011: 'hev1.1.6.L120.90',
            11: 'hev1.1.6.L120.90',
            30016: 'avc1.64001E',
            16: 'avc1.64001E',
            30006: 'avc1.64001E',
            6: 'avc1.64001E',
            30005: 'avc1.64001E',
            5: 'avc1.64001E',
            30280: 'mp4a.40.2',
            30232: 'mp4a.40.2',
            30216: 'mp4a.40.2', // 低码音频
        },
        app: {
            30016: 'avc1.64001E',
            16: 'avc1.64001E',
            30032: 'avc1.64001F',
            32: 'avc1.64001F',
            30064: 'avc1.640028',
            64: 'avc1.640028',
            30080: 'avc1.640032',
            80: 'avc1.640032',
            30216: 'mp4a.40.2',
            30232: 'mp4a.40.2',
            30280: 'mp4a.40.2' // APP源 高码音频 
        }
    };
    /** 帧率表 */
    const frameRate = {
        30121: '16000/672',
        121: '16000/672',
        30120: '16000/672',
        120: '16000/672',
        30112: '16000/672',
        112: '16000/672',
        30102: '16000/672',
        102: '16000/672',
        30080: '16000/672',
        80: '16000/672',
        30077: '16000/656',
        77: '16000/656',
        30064: '16000/672',
        64: '16000/672',
        30066: '16000/656',
        66: '16000/656',
        30032: '16000/672',
        32: '16000/672',
        30033: '16000/656',
        33: '16000/656',
        30011: '16000/656',
        11: '16000/656',
        30016: '16000/672',
        16: '16000/672',
        30006: '16000/672',
        6: '16000/672',
        30005: '16000/672',
        5: '16000/672'
    };
    /** 分辨率表 */
    const resolution = {
        30121: [3840, 2160],
        121: [3840, 2160],
        30120: [3840, 2160],
        120: [3840, 2160],
        30112: [1920, 1080],
        112: [1920, 1080],
        30102: [1920, 1080],
        102: [1920, 1080],
        30080: [1920, 1080],
        80: [1920, 1080],
        30077: [1920, 1080],
        77: [1920, 1080],
        30064: [1280, 720],
        64: [1280, 720],
        30066: [1280, 720],
        66: [1280, 720],
        30032: [852, 480],
        32: [852, 480],
        30033: [852, 480],
        33: [852, 480],
        30011: [640, 360],
        11: [640, 360],
        30016: [640, 360],
        16: [640, 360],
        30006: [426, 240],
        6: [426, 240],
        30005: [256, 144],
        5: [256, 144] // 144P
    };
    /**
     * 获取链接idxs
     * @param url 下载链接
     * @param duration 媒体时长
     */
    function getIdxs(url, duration) {
        let range = Math.round(duration * 3.5);
        range = range < 6000 ? 6000 : range;
        return API.xhr({
            url: url.replace("http:", "https:"),
            responseType: 'arraybuffer',
            headers: { 'Range': \`bytes=0-\${range}\` }
        });
    }
    /** idxs暂存 */
    const OBJ = {};
    /**
     * 重构泰区playurl为网页可解析形式
     * @param ogv 原始数据(json)
     */
    async function bstarPlayurl(ogv) {
        debugger;
        const playurl = new Playurl();
        const set = [];
        playurl.quality = ogv.data.video_info.stream_list[0].stream_info.quality || ogv.data.video_info.quality;
        playurl.format = formatMap[playurl.quality];
        playurl.timelength = ogv.data.video_info.timelength;
        playurl.dash.duration = Math.ceil(playurl.timelength / 1000);
        playurl.dash.minBufferTime = playurl.dash.min_buffer_time = 1.5;
        await Promise.all(ogv.data.video_info.stream_list.reduce((s, d, i) => {
            if (d.dash_video && d.dash_video.base_url) {
                s.push((async (d) => {
                    OBJ[\`sidx\${API.cid}\`] || (OBJ[\`sidx\${API.cid}\`] = {});
                    const id = d.stream_info.quality || d.dash_video.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                    playurl.accept_description.push(descriptionMap[id]);
                    set.push(formatMap[id]);
                    playurl.accept_quality.push(id);
                    playurl.support_formats.push({
                        description: descriptionMap[id],
                        display_desc: qualityMap[id],
                        format: formatMap[id],
                        new_description: descriptionMap[id],
                        quality: id,
                        superscript: ""
                    });
                    if (!OBJ[\`sidx\${API.cid}\`][id]) {
                        let data = new Uint8Array(await getIdxs(d.dash_video.base_url, playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        // 首个“sidx”出现4字节之前的部分为索引起始点
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        // 首个“mooc”出现前5字节结束索引
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        // 挂载到BLOD下，切换清晰度直接继承使用（以cid为切p标记）
                        OBJ[\`sidx\${API.cid}\`][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        API.debug("DASH-video：", id, OBJ[\`sidx\${API.cid}\`][id]);
                    }
                    playurl.dash.video.push({
                        SegmentBase: {
                            Initialization: OBJ[\`sidx\${API.cid}\`][id][0],
                            indexRange: OBJ[\`sidx\${API.cid}\`][id][1]
                        },
                        segment_base: {
                            initialization: OBJ[\`sidx\${API.cid}\`][id][0],
                            index_range: OBJ[\`sidx\${API.cid}\`][id][1]
                        },
                        backupUrl: [],
                        backup_url: [],
                        bandwidth: d.dash_video.bandwidth,
                        baseUrl: d.dash_video.base_url,
                        base_url: d.dash_video.base_url,
                        codecid: d.dash_video.codecid,
                        codecs: codecs.app[id] || codecs.default[id],
                        frameRate: frameRate[id],
                        frame_rate: frameRate[id],
                        height: resolution[id] && resolution[id][1],
                        id: d.stream_info.quality,
                        md5: d.dash_video.md5,
                        mimeType: "video/mp4",
                        mime_type: "video/mp4",
                        sar: "1:1",
                        size: d.dash_video.size,
                        startWithSAP: 1,
                        start_with_sap: 1,
                        width: resolution[id] && resolution[id][0]
                    });
                })(d));
            }
            !i && ogv.data.video_info.dash_audio.forEach((d) => {
                s.push((async (d) => {
                    OBJ[\`sidx\${API.cid}\`] || (OBJ[\`sidx\${API.cid}\`] = {});
                    const id = d.id || d.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                    if (!OBJ[\`sidx\${API.cid}\`][id]) {
                        let data = new Uint8Array(await getIdxs(d.base_url, playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        // 首个“sidx”出现4字节之前的部分为索引起始点
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        // 首个“mooc”出现前5字节结束索引
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        // 挂载到BLOD下，切换清晰度直接继承使用（以cid为切p标记）
                        OBJ[\`sidx\${API.cid}\`][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        API.debug("DASH-video：", id, OBJ[\`sidx\${API.cid}\`][id]);
                    }
                    playurl.dash.audio.push({
                        SegmentBase: {
                            Initialization: OBJ[\`sidx\${API.cid}\`][id][0],
                            indexRange: OBJ[\`sidx\${API.cid}\`][id][1]
                        },
                        segment_base: {
                            initialization: OBJ[\`sidx\${API.cid}\`][id][0],
                            index_range: OBJ[\`sidx\${API.cid}\`][id][1]
                        },
                        backupUrl: [],
                        backup_url: [],
                        bandwidth: d.bandwidth,
                        baseUrl: d.base_url,
                        base_url: d.base_url,
                        codecid: d.codecid,
                        codecs: codecs.app[id] || codecs.default[id],
                        frameRate: "",
                        frame_rate: "",
                        height: 0,
                        id: id,
                        md5: d.md5,
                        mimeType: "audio/mp4",
                        mime_type: "audio/mp4",
                        sar: "",
                        size: d.size,
                        startWithSAP: 0,
                        start_with_sap: 0,
                        width: 0
                    });
                })(d));
            });
            return s;
        }, []));
        // video排序
        const avc = [], hev = [], video = [];
        playurl.dash.video.forEach((d) => {
            if (d.codecid == 7)
                avc.push(d);
            else
                hev.push(d);
        });
        let length = avc.length > hev.length ? avc.length : hev.length;
        for (let i = length - 1; i >= 0; i--) {
            if (avc[i])
                video.push(avc[i]);
            if (hev[i])
                video.push(hev[i]);
        }
        playurl.dash.video = video;
        // 字符串化格式
        playurl.accept_format = set.join(",");
        return playurl;
    }
    API.bstarPlayurl = bstarPlayurl;

//# sourceURL=file://@Bilibili-Old/vector/url/bangumi/bstarPlayurl.js`;
/*!***********************!*/
/**/modules["episodeData.js"] = /*** ./src/vector/url/bangumi/episodeData.js ***/
`
    let first = 0; // 首p指示
    API.switchVideo(async () => {
        try {
            first++;
            let views = document.querySelector(".view-count").querySelector("span");
            let danmakus = document.querySelector(".danmu-count").querySelector("span");
            if (first === 1) {
                const [view, danmaku] = [
                    API.unitFormat(window.__INITIAL_STATE__.mediaInfo.stat.views),
                    API.unitFormat(window.__INITIAL_STATE__.mediaInfo.stat.danmakus)
                ];
                // 首p时辈分总播放数和总弹幕数
                views.setAttribute("title", "总播放数 " + view);
                danmakus.setAttribute("title", "总弹幕数 " + danmaku);
                API.debug.log("总播放数：", view, "总弹幕数", danmaku);
            }
            let data = await API.xhr({
                url: API.objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": API.aid }),
                credentials: true
            }); // 获取分集数据
            data = API.jsonCheck(data).data;
            let view = data.view;
            let danmaku = data.danmaku;
            view = API.unitFormat(view);
            danmaku = API.unitFormat(danmaku);
            views.innerText = view;
            danmakus.innerText = danmaku;
            API.debug.debug("播放", view + " 弹幕", danmaku);
        }
        catch (e) {
            API.debug.error("episodeData.js", e);
        }
    });

//# sourceURL=file://@Bilibili-Old/vector/url/bangumi/episodeData.js`;
/*!***********************!*/
/**/modules["index-script.html"] = /*** ./src/vector/url/index/index-script.html ***/
`<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
<script>
    window.__INITIAL_STATE__ = { locsData: { 23: null, 29: null, 31: null, 34: null, 40: null, 42: null, 44: null, 142: null }, recommendData: null }; (function () { var s; (s = document.currentScript || document.scripts[document.scripts.length - 1]).parentNode.removeChild(s); }());
</script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin=""></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"></script>
<script type="text/javascript" defer="defer" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script>`;
/*!***********************!*/
/**/modules["index.html"] = /*** ./src/vector/url/index/index.html ***/
`<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->

<head>
    <meta charset="utf-8" />
    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords"
        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
        title="哔哩哔哩" />
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css" />
    <style type="text/css">
        /* 隐藏失效节点 */
        #fixed_app_download,
        #app>div.report-wrap-module.elevator-module>div.ver {
            display: none;
        }

        /* 禁用失效节点 */
        .bili-tab.rank-tab,
        .bili-dropdown.rank-dropdown {
            pointer-events: none;
        }

        /* 资讯区图标 */
        .icon.icon_t.icon-news {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMzNhZmQ3OS04ZTViLWQ2NDItOTYxZi0yNDM2MGQyN2JhM2YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTFEMzQ4MEJBNUM1MTFFQ0FGQTk5NEVFMjgwODg3M0UiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTFEMzQ4MEFBNUM1MTFFQ0FGQTk5NEVFMjgwODg3M0UiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBiNzNlZjA5LTA1ZmEtNTM0MC1iMWY3LWE4MTljMjFhYmEzMiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjI2MDJjOTk2LTBiNzQtZDQ0MC1hMzcxLTIxN2NkM2ZlOTgzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsCIXZoAAAi+SURBVHja7Fh7TJvXFT+fwTa2MX5gXjZgg3kEJvICh6YELUujNKNb10ZpWFc17aapSxcpy1YlUjctUbt0L22VMm2NlkXLsqZJWdT0sWwlaZOmCwW1gfIMCSYYDOZhDH6ADdjGvvvOhc8YY8Bru61/9EhX97vnnnvv755z7znnfgwhBD7PxIPPOcWHNxiGWdSp0Wi2eX0+uSxJVuxyOaXIk8nkk1hj2+FwlHGyCoWiMbwfaXLCNRIEsAsFAufU9LSdLxL2jw4O21cCFGlRJpzBAUzTqnX2Qdtlti8/XFir04AqK58RieVgtxinPB6XyFBRRQf19nfDtH10Cr+Rj/XIuNvnnXQJuPFCqcznc0+YgyRoCQaD/ckq1d/HbLaLMQP0zPjmtCFN7Nq45csFzxz4IeTk6ilPJBGDLjMNJAmCmM0zMu4Ci2UEek09YBs0w+jENHR13aV9nS0fTHXe6hRpdbojPT13jy0HkDK44p72QmpKyncl8uQZEiOxY2j5JLT/0E9IfFx8EC0WDQ+WJRqUihNOVz++78nzZ14KafS/QWgJnF+eKCFypWI3Z+pIDS65xTweL7vSULLsxHE8Hj2rkRdq0Rzz/VzhLSOLIEsrtzIsCGXMbobH8DJzS8qjCuMygWAwpP7lKBhhpmAUWc46ZYZy7M+PGaAgMUkb3u7r7YWrV94Bv98PZL7d3NT0mZm6pGQdhLurFQF2dfaowt0C3anbDUODg9DR1hZq28ftnxlAbbaeWi0mgLV1danRHLZAKGQBtgPr+BbxUZM1587DG6+9Bk6nk7aNXV2078b196m2kdACttFRWr98+i+s3MeRniTf+uP90phMjOBUcskinkqlArVGAw0f1Id4uCCC1uXowOv1Qf2NOhAIBHDX2E03guAGzP1UDi3g9/lpvbGsFHL0uaF5sjQptD6Vti5rVYDD/b1aTnuRx3rt+nV0gZHhEdoetVpp7Z50g1AogPGxMdBkZdG612SiG0KQKKfLyQF1pgYK1hRCR3sHCPj80LzJiiQaYXDtVQFmZOeYlzsLKampdCEEGW56BF5RWQk7H6gCuVw+dxxYEPr8PJAmSeHjxibI0mZT+fLNm0EqlcL1a+99umxmzOmJKlxqWLhsOblzZmpraYU7nbfxJtI2mtzn9YImMxMy1GrKS2U3N2QZpGdwcnISfD7vkrndnqn1q2Yzx399lNrP7bCGeLl5emo6JLFEAl9/+KGF7288SM0pSUwEuUIx5zbWroXCoiLgs2bE71y9nsoioVbTM9JDm0NiN0PQcyRKxC2rAmx/Ypdff6IGPaiQu8cikZgWjtCMHOHCXypZHHWQJw7/ngeHNR6RSJqc8jJRjnx0E0t++iLN5UYtff+zhHTaQzM0MFRs88d0Bll1m+saO0KxcqWElgt/keyFWLy0L5IwFUOyDPQOxQQwL0/f8uGNSySWbJdzR5HshVi8tC+SME+E1VLs8HxQlZKyC3O0my13FuVuASyBIC3++TKL7SCbH9PyiVJC8s29TxPMP7lIEpkPxi9RqSD+OtavvPQ8FB0/DX0WKzVjUe1lGLm/FOKS9ayb8BE2ajAkTI+xPg7T/noOhqrKwK/eACn8IH0qZKepmtN+/ofJVW8xkulun51NWs/86W+XH12z5U0hBvPUty4A+f0JMmLez1j2PAYJXh89WbJpE1imJaAWutlavOwxQOKrsyGruR54hw5Pqxu3i7oOfh9uTCXTd4xtfPxfy20o6puELp4ovpoglVfI9v5CaPBPwQWlHWzt3dOHlEoRXoDkNDkok5SQmiRaERhH+B550GaFEkkCtHtm4HmvGhqMTeB4/1VjYpK02mG3t0SbZ5EGERSmPrOB2Xo2swZJaZXQVvxVeKf1FrQ+ooNS93HR2NlzYFLIiNXu8eFkMxNOAcbSCE8g4F5x4d/fySsW8N/4DbPjnBkc7nWgvP4q4FocuJhMLMsvLSDf/lGB3J9FknfeA/iasXS+jUGMTd5K4NK+FOAfe44Z7LopnHv7OsEx7hAqkuciCfsdmovlURlpkhy89WcFWa1+hkgVILS0Anm4wKerqBHAweonXd1N9yLQ3Fw9+pxjywJMksmewTRPf98jkC2eZHrYvIDPruv0Z8OfGzuhbE8pkOpfAsyOgKbQQGuINwC5+RGQzjvAFK8BYh0G3mM7WH76fH86ndv/8iWGbNDDW7e9MDNkhfUBEPBU2ZB7tgGCY/0FfQerC/q7m4yRABf5QVS1w3jzWt/hvdA/JaXgkGZScqCm9haAZhN0GPLh/vRiYDUYWpwxbAJIl8Hsm/+gIClx4Nj6e9u2B4/WnATeE3vhSkc3O5+Bzu1nlc0qYi6iDHd78Syu6Adp5qHJUPLj+V2p9z1O9C80BAsvuMiGdwkRP11L37F6vTaIfhJL+dbt5OBT3yL1b9cQ4h+ec2xsffujK5R39IXfEk4WC8qqD5wkca+4yKYmQgu2sQ/9bzQ/uARgWBb9KxyIE+y+PUF4R7qoQ0XHah60UnAcSORvrdpNN4BtVdE9RLn7Z7Qgf3jMSUFzfARWdtlMx+PYlR7uUQHiTyPUIg7efMJEJ0QNNgy4QxGgd8JPeRzhwqh13BD+aUDZHadM7sjIgWOY94gX50QLIWhUxnIajI92tfGPFv7g8bknoO1Zg1aUkS9k2DNy3LNHOPDQ16CYTbFOmueGbjn2Lq2dxXtg16MZ8M/f1bNuyQi1bR6oa3ZKjmaOwE4yAC5RHpjaP4REYwNk1Mv4cco0UJSpGUfzAzDx+nOHAsHAGXaaiys66mjZCqo/MOXfyG6nnHu/snnKVwRPXWKqDtwLF88PUzkEp01LBLPVTUHixcoR2on5SCVwfhJ9IveHayGxCFqSlcrzozbbqZh/v60YS1nAbpf3zj6TTZgvWBjb7Vs6FvuvnfwjvH74B0aZQv5sIBAwrfaP8FMDjIuLu6ooMGz7TxNT1hkb/bP+wtXkVgT4xT/qLwD+H+jfAgwAa4KbOGyf2aUAAAAASUVORK5CYII=);
            background-position: unset;
        }
    </style>
</head>

<body>
    <div id="home-app"></div>
    <div id="app" data-server-rendered="true"></div>
    <div class="footer bili-footer report-wrap-module"></div>
    <link rel="prefetch" as="script" href="//static.hdslb.com/js/video.min.js" />
</body>

<!-- </html> -->`;
/*!***********************!*/
/**/modules["index.js"] = /*** ./src/vector/url/index/index.js ***/
`
    if (API.rebuildType != "重定向")
        API.windowClear();
    if (API.rebuildType == "重定向") {
        document.documentElement.replaceChildren(API.createElements(API.htmlVnode(API.getModule("index.html"))));
        API.appendScripts(API.getModule("index-script.html")).then(() => API.loadendEvent());
    }
    else {
        API.documentWrite(API.getModule("index.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", \`\${API.getModule("index-script.html")}</body>\`));
    }
    API.title && (document.title = API.title);
    // 初始化locsData
    /**
     * 广告过滤
     * @param prev 原始locsData
     * @returns 无广告数据
     */
    function adblock(prev) {
        return prev.filter(d => !d.is_ad);
    }
    API.doWhile(() => window.__INITIAL_STATE__, t => {
        API.xhr({
            url: "https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=4694,29,31,34,40,42,44"
        }).then(d => {
            d = API.jsonCheck(d.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (s) => "av" + API.abv(s)));
            t.locsData[23] = adblock(d.data[4694]);
            t.locsData[29] = adblock(d.data[29]);
            t.locsData[31] = adblock(d.data[31]);
            t.locsData[34] = adblock(d.data[34]);
            t.locsData[40] = adblock(d.data[40]);
            t.locsData[42] = adblock(d.data[42]);
            t.locsData[44] = adblock(d.data[44]);
        }).catch(reason => {
            API.toast.error("获取推荐数据失败 ಥ_ಥ");
            API.debug.error("获取推荐数据失败 ಥ_ಥ", reason);
        });
        /** 获取recommendData */
        async function recommendData() {
            const d = await API.xhr({
                url: "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",
                responseType: "json",
                credentials: API.config.privateRecommend
            });
            d.data.item.forEach((d_1, i, s) => {
                // 修正数据名
                s[i].author = d_1.owner.name;
                s[i].play = d_1.stat.view;
                s[i].aid = d_1.id;
            });
            return d.data.item;
        }
        // 初始化recommendData
        recommendData().then(d => {
            if (API.uid && API.config.privateRecommend) {
                t.recommendData = d;
                API.doWhile(() => document.querySelector(".rec-btn.prev"), () => {
                    API.addElement("span", { class: "rec-btn prev" }, undefined, "刷新", undefined, document.querySelector(".rec-btn.prev")).addEventListener("click", () => {
                        recommendData().then(d => t.recommendData = d);
                    });
                    API.addElement("span", { class: "rec-btn next" }, undefined, "刷新", undefined, document.querySelector(".rec-btn.next")).addEventListener("click", () => {
                        recommendData().then(d => t.recommendData = d);
                    });
                });
            }
            else {
                const one = d.splice(0, 10);
                const two = d.splice(0, 10);
                t.recommendData = [...one];
                API.jsonphookasync("api.bilibili.com/x/web-interface/ranking/index", undefined, async (str) => {
                    const obj = API.urlObj(str);
                    if (obj.day == "7") {
                        return { code: 0, data: two, message: "0", ttl: 1 };
                    }
                    else if (obj.day == "1") {
                        return { code: 0, data: d, message: "0", ttl: 1 };
                    }
                    return { code: 0, data: one, message: "0", ttl: 1 };
                }, false);
            }
        }).catch(reason => {
            API.toast.error("获取推荐数据失败 ಥ_ಥ");
            API.debug.error("获取推荐数据失败 ಥ_ಥ", reason);
        });
    });
    // 修复直播推荐
    API.xhrhook("api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec", args => {
        args[1] = args[1].includes("List") ? args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web') : args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
    }, obj => {
        let response = obj.responseText?.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
        if (response) {
            response = JSON.parse(response);
            response.data.text_link = { text: "233秒居然能做这些！", link: "//vc.bilibili.com" };
            if (response.data.recommend) {
                for (let i = 0; i < response.data.recommend.length; i++) {
                    response.data.recommend[i].pic = response.data.recommend[i].cover;
                    response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
                }
            }
            if (response.data.preview)
                for (let i = 0; i < response.data.preview.length; i++)
                    response.data.preview[i].url = response.data.preview[i].link;
            obj.response = obj.responseText = JSON.stringify(response);
        }
    }, false);
    // 分区修正
    API.doWhile(() => document.querySelector("#ranking_ad"), () => {
        const vue = document.querySelector("#app > div.report-wrap-module.elevator-module").__vue__;
        const ranking_ad = document.querySelector("#ranking_ad").__vue__;
        const ranking_technology = document.querySelector("#ranking_technology").__vue__;
        const ranking_digital = document.querySelector("#ranking_digital").__vue__;
        vue.config[13].morelink = "/v/information/";
        vue.config[13].name = "资讯";
        vue.config[13].tid = 202;
        vue.config[13].type = "news";
        vue.config[8].morelink = "/v/knowledge/";
        vue.config[8].name = "知识";
        vue.config[9].morelink = "/v/tech/";
        vue.config[9].name = "科技";
        ranking_ad.config.morelink = "/v/information/";
        ranking_ad.config.name = "资讯";
        ranking_ad.config.tid = 202;
        ranking_ad.config.type = "news";
        ranking_technology.config.morelink = "/v/knowledge/";
        ranking_technology.config.name = "知识";
        ranking_digital.config.morelink = "/v/tech/";
        ranking_digital.config.name = "科技";
        API.doWhile(() => document.querySelector("#ranking_news"), () => {
            document.querySelector("#ranking_news").replaceChildren(API.createElements(API.htmlVnode(API.getModule("news.html"))));
        });
    });
    // 用户热点最新投稿修复资讯区最新投稿
    API.jsonphook(["newlist", "rid=202"], url => url.replace("rid=202", "rid=203"), undefined, false);
    // 修正电影/电视剧/纪录片排行
    API.jsonphook("api.bilibili.com/x/web-interface/ranking/region", url => {
        const obj = API.urlObj(url);
        let arr = undefined;
        switch (obj.rid) {
            case "23":
                arr = [document.querySelector("#ranking_movie"), 2, "/ranking/cinema/23/0/3"];
                break;
            case "11":
                arr = [document.querySelector("#ranking_teleplay"), 5, "/ranking/cinema/11/0/3"];
                break;
            case "177":
                arr = [document.querySelector("#ranking_documentary"), 3, "/ranking/cinema/177/0/3"];
                break;
        }
        if (arr) {
            API.xhr({
                url: \`https://api.bilibili.com/pgc/season/rank/web/list?season_type=\${arr[1]}&day=3\`,
                responseType: "json"
            }).then(d => {
                const data = API.jsonCheck(d).data;
                let html = \`<header class="rank-head"><h3>排行</h3><div class="bili-dropdown rank-dropdown"><span class="selected">三日</span><i class="icon icon-arrow-down"></i><ul class="dropdown-list"><li class="dropdown-item" style="display: none;">三日</li><li class="dropdown-item">一周</li></ul></div></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list">\`;
                for (let i = 0; i < 8; i++) {
                    html += \`<li class="rank-item\${i < 3 ? " highlight" : ""}"><i class="ri-num">\${i + 1}</i><a href="\${data.list[i].url}" target="_blank" title="\${data.list[i].title} 播放:\${data.list[i].stat.view}" class="ri-info-wrap"><p class="ri-title">\${data.list[i].title}</p><span class="ri-total">\${data.list[i].new_ep.index_show}</span></a></li>\`;
                }
                html += \`</ul></div><a href="\${arr[2]}" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>\`;
                const vnode = API.htmlVnode(html);
                vnode[1].children[0].children?.forEach((d, i) => {
                    let node;
                    d.event = {
                        "mouseover": (e) => {
                            const target = e.target;
                            const nodes = API.createElements(API.htmlVnode(\`<div class="bangumi-info-module" style="left: \${target.getBoundingClientRect().left}px; top: \${API.getTotalTop(target) - 150}px;"><div class="v-preview clearfix"><div class="lazy-img cover"><img alt="\${data.list[i].title}" src="\${data.list[i].cover.replace("http:", "")}" /></div><div><p class="title">\${data.list[i].title}</p><p class="desc">\${data.list[i].new_ep.index_show}</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>\${API.unitFormat(data.list[i].stat.view)}</span><span class="danmu"><i class="icon"></i>\${API.unitFormat(data.list[i].stat.danmaku)}</span><span class="fav"><i class="icon"></i>\${API.unitFormat(data.list[i].stat.follow)}</span></div></div>\`));
                            node = nodes.children[0];
                            document.body.appendChild(nodes);
                        },
                        "mouseout": () => node.remove()
                    };
                });
                arr[0].replaceChildren(API.createElements(vnode));
            }).catch(e => {
                API.debug.error(arr[0], e);
            });
        }
        return url;
    }, undefined, false);
    API.importModule("primaryMenu.js"); // 顶栏分区修正
    API.importModule("banner.js"); // 顶栏banner修复
    // 添加港澳台新番时间表
    API.config.timeline && API.xhrhook("api.bilibili.com/pgc/web/timeline?types=1", undefined, res => {
        Promise.resolve().then(() => { API.importModule("timeline.js"); });
    });

//# sourceURL=file://@Bilibili-Old/vector/url/index/index.js`;
/*!***********************!*/
/**/modules["news.html"] = /*** ./src/vector/url/index/news.html ***/
`<div class="r-con">
    <div class="r-con">
        <header style="margin-bottom: 14px">
            <h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3>
        </header>
        <div class="carousel-module">
            <div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img
                        src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp"
                        width="260" height="280" /></a></div>
        </div>
    </div>
</div>`;
/*!***********************!*/
/**/modules["live.js"] = /*** ./src/vector/url/live/live.js ***/
`
    API.config.liveP2p && API.importModule("WebRTC.js");
    API.config.sleepCheck && API.importModule("sleepCheck.js");
    API.doWhile(() => document.querySelector(".web-player-icon-roomStatus"), () => document.querySelector(".web-player-icon-roomStatus")?.remove());

//# sourceURL=file://@Bilibili-Old/vector/url/live/live.js`;
/*!***********************!*/
/**/modules["sleepCheck.js"] = /*** ./src/vector/url/live/sleepCheck.js ***/
`
    const fun = setInterval;
    let flag = 0;
    window.setInterval = (...args) => {
        if (args[1] && args[1] == 300000 && args[0] && args[0].toString() == "function(){e.triggerSleepCallback()}") {
            if (!flag) {
                API.toast.warning("成功阻止直播间挂机检测！");
                flag++;
            }
            return Number.MIN_VALUE;
        }
        return fun.call(window, ...args);
    };

//# sourceURL=file://@Bilibili-Old/vector/url/live/sleepCheck.js`;
/*!***********************!*/
/**/modules["WebRTC.js"] = /*** ./src/vector/url/live/WebRTC.js ***/
`
    if (typeof navigator.getUserMedia !== "undefined")
        navigator.getUserMedia = undefined;
    if (typeof window.MediaStreamTrack !== "undefined")
        window.MediaStreamTrack = undefined;
    if (typeof window.RTCPeerConnection !== "undefined")
        window.RTCPeerConnection = undefined;
    if (typeof window.RTCSessionDescription !== "undefined")
        window.RTCSessionDescription = undefined;
    if (typeof navigator.mozGetUserMedia !== "undefined")
        navigator.mozGetUserMedia = undefined;
    if (typeof window.mozMediaStreamTrack !== "undefined")
        window.mozMediaStreamTrack = undefined;
    if (typeof window.mozRTCPeerConnection !== "undefined")
        window.mozRTCPeerConnection = undefined;
    if (typeof window.mozRTCSessionDescription !== "undefined")
        window.mozRTCSessionDescription = undefined;
    if (typeof navigator.webkitGetUserMedia !== "undefined")
        navigator.webkitGetUserMedia = undefined;
    if (typeof window.webkitMediaStreamTrack !== "undefined")
        window.webkitMediaStreamTrack = undefined;
    if (typeof window.webkitRTCPeerConnection !== "undefined")
        window.webkitRTCPeerConnection = undefined;
    if (typeof window.webkitRTCSessionDescription !== "undefined")
        window.webkitRTCSessionDescription = undefined;

//# sourceURL=file://@Bilibili-Old/vector/url/live/WebRTC.js`;
/*!***********************!*/
/**/modules["message.css"] = /*** ./src/vector/url/message/message.css ***/
`/* 修复消息页样式 */
.container[data-v-6969394c] {
    height: calc(100vh - 42px) !important;
}

.container[data-v-1c9150a9] {
    height: calc(100vh - 42px) !important;
}

.im-root,
.im-root .im-list-box * {
    font-size: 12px;
    line-height: 42px;
}

.im-root .im-list-box {
    width: 100%;
    overflow: visible;
}

.im-root .im-list-box .im-list {
    line-height: 42px;
    height: 42px;
}

.im-root .im-list-box .im-notify.im-number {
    height: 14px;
    line-height: 13px;
    border-radius: 10px;
    padding: 1px 3px;
    font-size: 12px;
    min-width: 20px;
    text-align: center;
    color: #fff;
}

.im-root .im-list-box .im-notify.im-number.im-center {
    top: 14px;
    left: 80px;
}

.im-root .im-list-box .im-notify.im-dot {
    top: 11px;
    right: -10px;
    width: 8px;
    height: 8px;
    border-radius: 100%;
}

.im-root .im-list-box .im-notify.im-dot.im-center {
    top: 16px;
    right: 20px;
}`;
/*!***********************!*/
/**/modules["message.js"] = /*** ./src/vector/url/message/message.js ***/
`
    API.addCss(API.getModule("message.css"));

//# sourceURL=file://@Bilibili-Old/vector/url/message/message.js`;
/*!***********************!*/
/**/modules["bnj.css"] = /*** ./src/vector/url/player/bnj.css ***/
`.player {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
}

.player-box {
    width: 100%;
    height: 100%;
    overflow: visible;
    box-sizing: border-box;
}

object {
    width: 100%;
    height: 100%;
}

.bgray-btn-wrap {
    display: none;
}`;
/*!***********************!*/
/**/modules["bnj.js"] = /*** ./src/vector/url/player/bnj.js ***/
`
    API.addCss(API.getModule("bnj.css"));
    // loadVideoScript(".festival-video-player", true);
    window.bnj = false; // 是否载入
    const arr = []; // 接口暂存
    // 以嵌入式播放器替换原播放器
    API.doWhile(() => window.__INITIAL_STATE__, () => {
        // 替换播放器节点
        const node = document.querySelector("#bilibili-player").parentElement;
        const root = node.attachShadow({ mode: "closed" }); // 使用shadow覆盖视频节点而不影响页面其他功能
        const iframe = document.createElement('iframe');
        iframe.src = \`https://www.bilibili.com/blackboard/html5player.html?aid=\${window.__INITIAL_STATE__.videoInfo.aid}&cid=\${window.__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1&bnj=1\`;
        iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
        root.appendChild(iframe);
    });
    // 暂存播放器启动命令
    Object.defineProperty(window, "EmbedPlayer", {
        configurable: true,
        set: v => {
            if (!window.bnj) {
                // 压栈
                arr.unshift(v);
            }
        },
        get: () => {
            if (window.bnj) {
                Object.defineProperty(window, "EmbedPlayer", { configurable: true, value: arr[0] });
                // 出栈
                return arr[0];
            }
            else {
                return function () {
                    // 轮询播放器启动命令
                    setTimeout(() => window.EmbedPlayer(...arguments), 100);
                };
            }
        }
    });

//# sourceURL=file://@Bilibili-Old/vector/url/player/bnj.js`;
/*!***********************!*/
/**/modules["player-script.html"] = /*** ./src/vector/url/player/player-script.html ***/
`<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
<script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script>
<script type="text/javascript" src="//static.hdslb.com/player/js/whitelist.js"></script>`;
/*!***********************!*/
/**/modules["player.html"] = /*** ./src/vector/url/player/player.html ***/
`<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport"
        content="target-densitydpi=device-dpi,width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,minimal-ui">
    <title>player - bilibili.com</title>
    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />
    <style type="text/css">
        html {
            background-color: #fff;
            font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif;
            overflow: hidden;
        }

        html,
        body,
        #bofqi,
        .player {
            width: 100%;
            height: 100%;
            margin: 0px;
            padding: 0px;
        }

        #bofqi,
        #bofqi .player-box {
            width: 100%;
            height: 100%;
            overflow: visible;
            box-sizing: border-box;
        }

        #bofqi object {
            width: 100%;
            height: 100%;
        }

        #dm_send_bar {
            width: 100%;
            height: 60px;
            position: absolute;
            bottom: -60px;
            background-color: transparent;
        }

        #dm_send_input {
            margin: 10px 0 10px 2%;
            height: 40px;
            line-height: 38px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            font-family: "Microsoft YaHei";
            padding: 0 8px;
            width: 70%;
            outline: 0;
            box-sizing: border-box;
            color: #333;
        }

        #dm_send_btn {
            height: 40px;
            line-height: 40px;
            font-size: 1rem;
            color: #fff;
            background: #de698c;
            border-radius: 6px;
            margin: 10px 3% 10px 0;
            width: 20%;
            box-sizing: border-box;
            outline: 0;
            border: 0;
            float: right;
        }

        #dm_send_btn:focus,
        #dm_send_btn.disabled {
            background-color: #b65673;
        }

        #player_placeholder {
            display: none !important;
        }
    </style>
</head>

<body>
    <div id="bofqi"></div>
</body>

<!-- </html> -->`;
/*!***********************!*/
/**/modules["player.js"] = /*** ./src/vector/url/player/player.js ***/
`
    if (API.rebuildType != "重定向")
        API.windowClear();
    document.domain = "bilibili.com";
    API.loadVideoScript(undefined, true);
    function run() {
        const playerParam = {
            aid: API.getUrlValue("aid") || API.getUrlValue("avid"),
            cid: API.getUrlValue("cid"),
            p: API.getUrlValue("P"),
            // autoplay: getUrlValue("autoplay"), 深恶痛绝
            as_wide: API.getUrlValue("as_wide"),
            bnj: API.getUrlValue("bnj"),
            player_type: API.getUrlValue("player_type"),
            season_type: API.getUrlValue("season_type")
        };
        if (playerParam.bnj) {
            try {
                window.parent.EmbedPlayer = window.EmbedPlayer;
                window.parent.bnj = true;
            }
            catch (e) { }
        }
        else {
            // 读取信息
            API.urlParam(location.href).then(d => {
                if (!d.cid)
                    throw d;
                playerParam.aid = d.aid;
                playerParam.cid = d.cid;
                if (d.pgc || d.ssid || d.epid) {
                    !playerParam.season_type && (playerParam.season_type = "1");
                    Reflect.set(playerParam, "seasonId", d.ssid);
                    Reflect.set(playerParam, "episodeId", d.epid);
                    Reflect.set(playerParam, "urlparam", \`module%3Dbangumi%26season_type%3D\${playerParam.season_type}\`);
                }
                // 初始化播放器
                window.EmbedPlayer("player", "//static.hdslb.com/play.swf", API.objUrl("", playerParam));
            });
        }
        // 暴露嵌入播放器
        API.doWhile(() => window.player, () => {
            try {
                window.parent.player = window.player;
            }
            catch (e) { }
        });
    }
    if (API.rebuildType == "重定向") {
        document.documentElement.replaceChildren(API.createElements(API.htmlVnode(API.getModule("player.html"))));
        API.appendScripts(API.getModule("player-script.html")).then(run).catch(e => {
            API.toast.error("获取视频信息出错 ಥ_ಥ");
            API.debug.error("获取视频信息出错", e);
        });
    }
    else {
        API.documentWrite(API.getModule("player.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", \`\${API.getModule("player-script.html")}</body>\`));
        run();
    }

//# sourceURL=file://@Bilibili-Old/vector/url/player/player.js`;
/*!***********************!*/
/**/modules["playlist-script.html"] = /*** ./src/vector/url/playlist/playlist-script.html ***/
`<script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"></script>
<script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script>
<script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script>
<script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script>
<script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script>
<script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script>
<script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
<script type="text/javascript"
    src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"></script>
<script type="text/javascript"
    src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"></script>`;
/*!***********************!*/
/**/modules["playlist.html"] = /*** ./src/vector/url/playlist/playlist.html ***/
`<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->

<head>
    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit" />
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
    <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit" />
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
    <link
        href="//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css"
        rel="stylesheet" />
    <style type="text/css">
        #bofqi .player {
            width: 980px;
            height: 620px;
            display: block;
        }

        @media screen and (min-width:1400px) {
            #bofqi .player {
                width: 1160px;
                height: 720px
            }
        }
    </style>
</head>

<body>
    <div id="playlist-video-app"></div>
    <div class="footer bili-footer report-wrap-module"></div>
</body>

<!-- </html> -->`;
/*!***********************!*/
/**/modules["playlist.js"] = /*** ./src/vector/url/playlist/playlist.js ***/
`
    if (API.rebuildType != "重定向")
        API.windowClear();
    /** 页面参数 */
    const route = API.urlObj(location.href);
    let type = 3, pl = -1, isPl = Boolean(API.path[5].startsWith("pl")), oid = "", has_more = false, observer = new MutationObserver(d => Observer(d)); // 滚动锚
    API.path[5].replace(/\\d+/, d => pl = d);
    if (route.business) { // 却分medialist类型
        switch (route.business) {
            case "space":
                type = 1;
                break;
            case "space_series":
                type = 5;
                pl = route.business_id;
                break;
            case "space_channel":
                type = 6;
                pl = 10 * route.business_id + pl % 10;
                break;
            case "space_collection":
                type = 8;
                pl = route.business_id;
                break;
            default: type = 3;
        }
    }
    !isPl && API.replaceUrl(API.objUrl(\`https://www.bilibili.com/playlist/video/pl\${pl}\`, route)); // 伪装页面
    /** toview模板 */
    let toview = {
        attr: 2,
        count: 100,
        cover: "https://i0.hdslb.com/bfs/archive/a45ef4fcde397247032cf4ce0c8f71815f9e28d0.jpg",
        ctime: 1529021131,
        description: "bilibili moe 2018 动画角色人气大赏日本动画场应援视频播单 / 每天不定时更新最新的一批",
        faved_count: 0,
        favored: 0,
        favorite: false,
        id: 1826036,
        is_favorite: false,
        like_count: 0,
        list: [],
        mid: 26468955,
        mlid: 182603655,
        mtime: 1533874759,
        name: "bilibili moe 2018 日本动画场应援",
        owner: {
            face: "http://i2.hdslb.com/bfs/face/57389d533621407d36981a99fed93834dd8b20e6.jpg",
            mid: 26468955,
            name: "萌战基"
        },
        pid: 769,
        play_count: 0,
        recent_oids: [],
        recent_res: [],
        reply_count: 0,
        share_count: 0,
        stat: {
            favorite: 1685,
            pid: 769,
            reply: 10,
            share: 0,
            view: 298928
        },
        state: 0,
        type: 2
    };
    function info(obj) {
        toview.attr = obj.data.attr;
        toview.count = obj.data.media_count;
        toview.cover = obj.data.cover;
        toview.ctime = obj.data.ctime;
        toview.description = obj.data.intro;
        toview.favored = obj.data.fav_state;
        toview.favorite = Boolean(obj.data.fav_state);
        toview.id = obj.data.id;
        toview.is_favorite = Boolean(obj.data.fav_state);
        toview.like_count = obj.data.like_state;
        toview.mid = obj.data.mid;
        toview.mlid = obj.data.id;
        toview.mtime = obj.data.ctime;
        toview.name = obj.data.title;
        toview.owner = obj.data.upper;
        toview.pid = obj.data.id;
        toview.stat.favorite = obj.data.cnt_info.collect;
        toview.stat.pid = obj.data.id;
        toview.stat.reply = obj.data.cnt_info.reply;
        toview.stat.share = obj.data.cnt_info.share;
        toview.stat.view = obj.data.cnt_info.play;
    }
    function list(obj) {
        obj.data.media_list.reduce((s, d) => {
            s.push({
                aid: d.id,
                attr: d.attr,
                attribute: 0,
                cid: d.pages[0].id,
                copyright: d.copy_right,
                ctime: d.pubtime,
                desc: d.intro,
                dimension: d.pages[0].dimension,
                duration: d.duration,
                dynamic: "",
                owner: d.upper,
                pages: d.pages.reduce((s, b) => {
                    s.push({
                        cid: b.id,
                        dimension: b.dimension,
                        duration: b.duration,
                        from: b.from,
                        page: b.page,
                        part: b.title,
                        vid: "",
                        weblink: b.link
                    });
                    return s;
                }, []),
                pic: d.cover,
                pubdate: d.pubtime,
                rights: d.rights,
                stat: {
                    aid: d.id,
                    coin: d.cnt_info.coin,
                    danmaku: d.cnt_info.danmaku,
                    dislike: d.cnt_info.thumb_down,
                    favorite: d.cnt_info.collect,
                    his_rank: 0,
                    like: d.cnt_info.thumb_up,
                    now_rank: 0,
                    reply: d.cnt_info.reply,
                    share: d.cnt_info.share,
                    view: d.cnt_info.play
                },
                state: 0,
                tid: d.tid,
                title: d.title,
                tname: "",
                videos: d.page
            });
            return s;
        }, toview.list);
        has_more = obj.data.has_more;
        oid = toview.list.at(-1).aid;
    }
    function Observer(record) {
        record.forEach(d => {
            calcScroll(d.target);
        });
    }
    function calcScroll(node) {
        const maxHeight = node.scrollHeight;
        const scroll = /\\d+/.exec(node.style.top) ? Number(/\\d+/.exec(node.style.top)) : 0;
        if (node.className.includes("hidden"))
            return;
        if (maxHeight - scroll > 0 && maxHeight - scroll < 600) {
            observer.disconnect(); // 暂停监听
            API.videoFloat("加载更多列表中~");
            API.xhr.get(\`https://api.bilibili.com/x/v2/medialist/resource/list?type=\${type}&oid=\${oid}&otype=2&biz_id=\${pl}&bvid=&with_current=true&mobi_app=web&ps=20&direction=false&sort_field=1&tid=0&desc=true\`, { responseType: "json" }).then(d => {
                formatMore(d);
                has_more && startObserver(); // 重新监听
            }).catch(e => {
                API.toast.error("获取更多列表数据出错~");
                API.debug.error("播单", e);
            });
        }
    }
    function startObserver() {
        observer.observe(document.querySelector(".bilibili-player-playlist-item").parentElement.parentElement, { attributes: true });
    }
    function formatMore(obj) {
        const result = obj.data.media_list.reduce((s, d) => {
            s.push({
                ao: d.rights && d.rights.pay,
                Sz: d.upper && d.upper.face,
                Te: d.pages.reduce((s, f) => {
                    s.push({
                        Da: d.bangumi?.ep_id,
                        Fb: d.bangumi?.season?.season_id,
                        aid: d.id,
                        duration: f.duration,
                        from: f.from,
                        j: f.id,
                        ni: f.title,
                        page: f.page
                    });
                    return s;
                }, []),
                Tz: d.upper && d.upper.mid,
                aid: d.id,
                duration: d.duration,
                ko: d.upper && d.upper.name,
                lb: d.cover,
                state: 0,
                title: d.title,
            });
            return s;
        }, []);
        list(obj); // 记录更多数据
        has_more ? window.player?.updatePlaylist(result) : API.videoFloat("没有更多了！"); // 推送到播放器脚本
    }
    API.jsonphookasync("toview", undefined, async (url) => {
        API.replaceUrl(API.path.join("/")); // 撤销伪装
        try {
            if (isPl || pl === 182603655) { // 备份页面
                const result = await API.xhr({
                    url: "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/Json/pl769.json",
                    responseType: "json"
                });
                toview = result.data;
                API.toast.warning("原生playlist页面已无法访问，已重定向到脚本备份的pl769~");
                return result;
            }
            else {
                const rqs = await Promise.all([
                    API.xhr.get(\`https://api.bilibili.com/x/v1/medialist/info?type=\${type}&biz_id=\${pl}&tid=0\`, { responseType: "json" }),
                    API.xhr.get(\`https://api.bilibili.com/x/v2/medialist/resource/list?type=\${type}&oid=\${oid}&otype=2&biz_id=\${pl}&bvid=&with_current=true&mobi_app=web&ps=20&direction=false&sort_field=1&tid=0&desc=true\`, { responseType: "json" })
                ]);
                info(rqs[0]); // 分别填充模板
                list(rqs[1]);
                return { code: 0, data: toview, message: "0", ttl: 1 };
            }
        }
        catch (e) {
            API.toast.error("获取medialist数据失败！请刷新页面或者在脚本设置中关闭重构“medialist”选项");
            throw e;
        }
    });
    API.switchVideo(() => {
        if (has_more) { // 继续滚动监听
            API.doWhile(() => document.querySelector(".bilibili-player-playlist-item"), () => startObserver());
        }
    });
    API.loadVideoScript();
    if (API.rebuildType == "重定向") {
        document.documentElement.replaceChildren(API.createElements(API.htmlVnode(API.getModule("playlist.html"))));
        API.appendScripts(API.getModule("playlist-script.html")).then(() => API.loadendEvent());
    }
    else {
        API.documentWrite(API.getModule("playlist.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", \`\${API.getModule("playlist-script.html")}</body>\`));
    }
    API.config.enlike && new API.enLike();
    API.importModule("primaryMenu.js"); // 顶栏分区修正
    API.importModule("banner.js"); // 顶栏banner修复
    API.importModule("loadByDmId.js"); // 弹幕ID跳转
    // 跳过充电鸣谢
    API.config.automate.electric && API.jsonphookasync("api.bilibili.com/x/web-interface/elec/show", undefined, async () => { return { code: -404 }; }, false);

//# sourceURL=file://@Bilibili-Old/vector/url/playlist/playlist.js`;
/*!***********************!*/
/**/modules["ranking-script.html"] = /*** ./src/vector/url/ranking/ranking-script.html ***/
`<script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin=""></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/rank/1.rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"></script>
<script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script>`;
/*!***********************!*/
/**/modules["ranking.html"] = /*** ./src/vector/url/ranking/ranking.html ***/
`<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->

<head>
    <title>热门视频排行榜 - 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit" />
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/jinkela/rank/css/rank.0.ba58f8684a87651e0e1c576df8f918bfa10c1a90.css" />
    <style type="text/css">
        .gg-floor-module {
            display: none;
        }
    </style>
</head>

<body>
    <div class="z-top-container has-menu"></div>
    <div id="rank-app"></div>
    <div id="app" data-server-rendered="true"></div>
    <div class="footer bili-footer report-wrap-module"></div>
</body>

<!-- </html> -->`;
/*!***********************!*/
/**/modules["ranking.js"] = /*** ./src/vector/url/ranking/ranking.js ***/
`
    if (API.rebuildType != "重定向")
        API.windowClear();
    // 三日接口以外过期
    API.jsonphook(["api.bilibili.com/x/web-interface/ranking", "arc_type=0"], d => d.replace(/day=\\d+/, "day=3"), undefined, false);
    if (API.rebuildType == "重定向") {
        document.documentElement.replaceChildren(API.createElements(API.htmlVnode(API.getModule("ranking.html"))));
        API.appendScripts(API.getModule("ranking-script.html")).then(() => API.loadendEvent());
    }
    else {
        // ranking网址才会触发初始化
        const url = document.referrer;
        API.replaceUrl(url.includes("ranking") ? url : API.objUrl("https://www.bilibili.com/ranking", API.urlObj(location.href)));
        API.documentWrite(API.getModule("ranking.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", \`\${API.getModule("ranking-script.html")}</body>\`));
    }
    // 高分辨率屏修补
    API.addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
    API.importModule("primaryMenu.js"); // 顶栏分区修正
    API.importModule("banner.js"); // 顶栏banner修复

//# sourceURL=file://@Bilibili-Old/vector/url/ranking/ranking.js`;
/*!***********************!*/
/**/modules["read-script.html"] = /*** ./src/vector/url/read/read-script.html ***/
`<script src="//static.hdslb.com/public/intersection-observer.js"></script>
<script src="//static.hdslb.com/public/timing.min.js"></script>
<script src="//static.hdslb.com/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" charset="utf-8" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
<script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script>
<script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
<script src="//s1.hdslb.com/bfs/static/biliapp/biliapp.js"></script>
<script type="text/javascript"
    src="//s1.hdslb.com/bfs/static/jinkela/article/manifest.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"></script>
<script type="text/javascript"
    src="//s1.hdslb.com/bfs/static/jinkela/article/vendor.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"></script>
<script type="text/javascript"
    src="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"></script>`;
/*!***********************!*/
/**/modules["read.html"] = /*** ./src/vector/url/read/read.html ***/
`<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->

<head itemprop="Article" itemscope="itemscope" itemtype="http://schema.org/Article">
    <meta charset="UTF-8" />
    <meta data-n-head="true" name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
    <meta name="theme-color" content="#de698c" />
    <meta http="Cache-Control" content="no-transform" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="applicable-device" content="pc" />
    <link rel="apple-touch-icon-precomposed" href="//static.hdslb.com/mobile/img/512.png" />
    <link rel="icon" type="image/vnd.microsoft.icon" href="//www.bilibili.com/favicon.ico" />
    <link rel="apple-touch-icon" href="//www.bilibili.com/favicon.ico" />
    <meta name="renderer" content="webkit" />
    <link data-n-head="true" rel="icon" type="image/x-icon" href="//www.bilibili.com/favicon.ico" />
    <link data-n-head="true" rel="apple-touch-icon-precomposed" type="image/x-icon"
        href="//static.hdslb.com/mobile/img/512.png" />
    <title>哔哩哔哩专栏</title>
    <link href="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.css"
        rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" />
    <style type="text/css">
        .nav-tab-bar .tab-item[data-tab-id="41"]:before {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAA6lBMVEUAAAAiIiIkJCT///8jIyMiIiIiIiIiIiJVVVUjIyMjIyMlJSU0NDT9/f0iIiIoKCjz8/NCQkIjIyMjIyMrKysiIiJFRUWQkJAiIiIlJSUjIyMkJCQzMzNAQEDv7+/7+/tHR0ciIiIlJSUjIyNKSkp7e3tcXFxoaGgjIyMjIyMkJCT8/PxDQ0MnJyf39/fx8fHn5+cvLy/i4uLe3t7R0dHAwMA0NDQjIyOtra06Ojo+Pj4iIiJAQEBOTk5VVVVwcHBtbW1hYWEjIyMjIyMjIyMiIiIiIiIlJSUpKSkkJCT///95eXltbW1zc3PUVbhEAAAASnRSTlMAf4H+6NOdaAOnQRQF/asO/vTs5NnXxcO6NzMaCgT++fLv3s7GwMC/v6Fi+vr59PDn5ePh2dHOzMrKyMjGw8C/v7+1sZeVUikfHAMz54kAAAEUSURBVCjPldLXboMwFIDhQ7DNDBA2JGmTNLt7772d9v1fp5hSjEOkqP+lP/lIlg+sTVcaRV1gKXE/mLWBZWqYSEUMjfjsYv/4Hr0zxJYKlYxgItOsaMpmItHwA82TkQGgEMG2JrTITwGkRsXs80f6F/oU0b4el3YaQI585l1pm/6bgHZ/Ry7tcgYCaoetjcKaV1ZXwGSwvSi0efNsgoAvI0oXLYc9MXwyQcTBSXb83XOoPIw7AGlawQ8ks4FfPWc47fyec5yHmTHddZmJqEU57t16baghOqL0IArdVxvq6I3GvqvN2bU6JkRK+Odx5P0LFbIaicLWBKurTPX0/IEWV24WBpaJEWksRbBmlkstLaXosK4fYdYsW/LHMigAAAAASUVORK5CYII=);
        }
    </style>
</head>

<body>
    <div class="z-top-container report-wrap-module"></div>
    <div class="page-container"></div>
    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>
</body>

<!-- </html> -->`;
/*!***********************!*/
/**/modules["read.js"] = /*** ./src/vector/url/read/read.js ***/
`
    if (API.config.rebuildType === "重定向")
        document.documentElement.replaceChildren(API.createElements(API.htmlVnode(API.getModule("read.html"))));
    else
        API.windowClear();
    API.xhr.get(location.href).then(data => {
        data = data.includes("__INITIAL_STATE__=") ? JSON.parse(data.match(/INITIAL_STATE__=.+?\\;\\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\\(function/, "")) : "";
        if (!data)
            throw API.toast.error("获取专栏数据失败 ಥ_ಥ");
        const bar = [
            [0, "推荐", "home"],
            [2, "动画", "douga"],
            [1, "游戏", "game"],
            [28, "影视", "cinephile"],
            [3, "生活", "life"],
            [29, "兴趣", "interest"],
            [16, "轻小说", "lightnovel"],
            [17, "科技", "technology"],
            [41, "笔记", "note"]
        ];
        // 左侧菜单栏
        let temp = bar.reduce((o, d) => {
            o = o + \`<a href="//www.bilibili.com/read/\${d[2]}?from=articleDetail" target="_self" class="tab-item\${data.readInfo.category.parent_id == d[0] ? " on" : ""}" data-tab-id="\${d[0]}"><span>\${d[1]}</span></a>\`;
            return o;
        }, \`<div class="nav-tab-bar"><a href="https://www.bilibili.com/read/home?from=articleDetail" target="_self" class="logo"></a>\`) + "</div>";
        // up主信息
        temp += \`<div class="up-info-holder"><div class="fixed-box"><div class="up-info-block">
        <a class="up-face-holder" href="//space.bilibili.com/\${data.readInfo.author.mid}" target="_blank"><img class="up-face-image" data-face-src="\${data.readInfo.author.face.replace("http:", "")}" src="//static.hdslb.com/images/member/noface.gif" /></a><div class="up-info-right-block"><div class="row">
        <a class="up-name" href="//space.bilibili.com/\${data.readInfo.author.mid}" target="_blank">\${data.readInfo.author.name}</a> <span class="level"></span><div class="nameplate-holder"><i class="nameplate"></i></div></div><div class="row-2">粉丝: <span class="fans-num"></span> <span class="view">阅读:</span> <span class="view-num"></span></div></div></div><div class="follow-btn-holder"><span class="follow-btn">关注</span></div><div class="up-article-list-block hidden"><div class="block-title">推荐文章</div><ul class="article-list"></ul></div><div class="more"><div class="top-bar"><label>更多</label></div><a class="ac-link" href="//www.bilibili.com/read/apply/" target="_blank"><div class="link"><span class="icon"></span><p class="title">成为创作者</p><p class="info">申请成为专栏UP主</p></div></a> <a href="//www.bilibili.com/blackboard/help.html#%C3%A4%C2%B8%C2%93%C3%A6%C2%A0%C2%8F%C3%A7%C2%9B%C2%B8%C3%A5%C2%85%C2%B3" target="_blank"><div class="help"><span class="icon"></span><p class="title">专栏帮助</p><p class="info">查看专栏使用说明</p></div></a></div></div>
        </div><div class="right-side-bar"><div class="to-comment"><div class="comment-num-holder"><span class="comment-num"></span></div></div><div class="to-top"></div></div>\`;
        // 标题及封面
        temp += \`<div class="head-container"><div class="banner-img-holder"></div><div class="bangumi-rating-container"></div><div class="argue-flag hidden"></div><div class="title-container">
            <h1 class="title">\${data.readInfo.title}</h1><div class="info">
            <a class="category-link" href="//www.bilibili.com/read/\${bar.find(d => {
            if (d[0] == data.readInfo.category.parent_id)
                return d;
        })[2]}#rid=\${data.readInfo.category.id}" target="_blank"><span>\${data.readInfo.category.name}</span></a> <span class="create-time" data-ts="\${data.readInfo.ctime}"></span><div class="article-data"></div>
            </div></div><div style="display:none" class="author-container">
            <a class="author-face" href="//space.bilibili.com/\${data.readInfo.author.mid}" target="_blank"><img data-face-src="\${data.readInfo.author.face.replace("http:", "")}" src="\${data.readInfo.author.face.replace("http:", "")}" class="author-face-img" /></a> <a class="author-name" href="//space.bilibili.com/\${data.readInfo.author.mid}" target="_blank">\${data.readInfo.author.name}</a><div class="attention-btn slim-border">关注</div></div></div>\`;
        // 专栏主体
        temp += \`<div class="article-holder">\${data.readInfo.content}</div><p class="original">本文为我原创</p>\`;
        // 专栏标签
        temp += (data.readInfo.tags || []).reduce((o, d) => {
            o = o + \`<li data-tag-id="\${d.tid}" class="tag-item"><span class="tag-border"><span class="tag-border-inner"></span></span> <span class="tag-content">\${d.name}</span></li>\`;
            return o;
        }, \`<ul class="tag-container">\`) + \`</ul><div class="article-action"><div class="ops"><span class="like-btn"><i class="icon-video-details_like"></i> <span>--</span></span> <span class="coin-btn"><i class="icon-video-details_throw-coin"></i> <span>--</span></span> <span class="fav-btn"><i class="icon-video-details_collection"></i> <span>--</span></span> <span class="share-container share-btn">分享到：<span></span></span></div><div class="more"><!-- <i class="icon-general_more-actions"></i> --><div class="more-ops-list"><ul><li value="0">投诉或建议</li></ul></div></div></div><div class="article-list-holder-block"></div><div class="draft-holder-block"></div><div class="b-head comment-title-block"><span class="b-head-t comment-results" style="display: inline;"></span> <span class="b-head-t">评论</span></div><div class="comment-holder"></div>\`;
        // 写入 original
        window.original = {
            cvid: data.cvid,
            author: {
                name: data.readInfo.author.name,
                mid: data.readInfo.author.mid,
            },
            banner_url: data.readInfo.banner_url || (data.readInfo && data.readInfo.image_urls[0]) || null,
            reprint: data.readInfo.reprint,
            summary: data.readInfo.summary,
            media: "",
            actId: data.readInfo.act_id,
            dispute: {
                dispute: "",
                dispute_url: ""
            },
            spoiler: "0"
        };
        if (API.rebuildType == "重定向") {
            // 修补文档
            document.querySelector(".page-container").innerHTML = temp;
            API.appendScripts(API.getModule("read-script.html")).then(() => API.loadendEvent());
        }
        else {
            API.documentWrite(API.getModule("read.html")
                .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
                .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
                .replace('<!-- </html> -->', '</html>')
                .replace("</body>", \`\${API.getModule("read-script.html")}</body>\`).replace('"page-container"><', \`"page-container">\${temp}<\`));
        }
        // 解锁右键
        API.importModule("user-select.js");
    }).catch(e => {
        API.debug.error(e);
    });

//# sourceURL=file://@Bilibili-Old/vector/url/read/read.js`;
/*!***********************!*/
/**/modules["user-select.js"] = /*** ./src/vector/url/read/user-select.js ***/
`
    API.addCss(\`* {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }\`);
    [].forEach.call(['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'], function (event) {
        document.addEventListener(event, function (e) {
            e.stopPropagation();
        }, true);
    });

//# sourceURL=file://@Bilibili-Old/vector/url/read/user-select.js`;
/*!***********************!*/
/**/modules["search-script.html"] = /*** ./src/vector/url/search/search-script.html ***/
`<script type="text/javascript"
    src="//www.bilibili.com/gentleman/polyfill.js?features=Promise%2CObject.assign%2CString.prototype.includes%2CNumber.isNaN"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.min.js"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.vue.min.js"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
<script type="text/javascript" src="//static.hdslb.com/common/js/footer.js" charset="utf-8"></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/search/1.search.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.js"></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/search/search.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.js"></script>`;
/*!***********************!*/
/**/modules["search.html"] = /*** ./src/vector/url/search/search.html ***/
`<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->

<head>
    <title data-vue-meta="true"> _ 搜索结果_哔哩哔哩_Bilibili</title>
    <meta data-vue-meta="true" charset="UTF-8">
    <meta data-vue-meta="true" http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta data-vue-meta="true" name="renderer" content="webkit|ie-comp|ie-stand">
    <meta data-vue-meta="true" name="description"
        content="点击查看更多相关视频、番剧、影视、直播、专栏、话题、用户等内容；你感兴趣的视频都在B站，bilibili是国内知名的视频弹幕网站，这里有及时的动漫新番，活跃的ACG氛围，有创意的Up主。大家可以在这里找到许多欢乐。">
    <meta data-vue-meta="true" name="keywords"
        content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid">
    <meta data-vue-meta="true" charset="UTF-8">
    <meta name="referrer" content="no-referrer-when-downgrade">
    <link rel="dns-prefetch" href="//s1.hdslb.com">
    <link rel="dns-prefetch" href="//i0.hdslb.com">
    <link rel="dns-prefetch" href="//i1.hdslb.com">
    <link rel="dns-prefetch" href="//i2.hdslb.com">
    <link rel="dns-prefetch" href="//static.hdslb.com">
    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico">
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/jinkela/search/css/search.1.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.css">
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/jinkela/search/css/search.0.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.css">
</head>

<body id="bili-search">
    <div class="z-top-container"></div>
    <div id="search-app"></div>
    <div id="server-search-app" data-server-rendered="true" class="bili-search"></div>
    <!-- built files will be auto injected -->
    <div class="footer bili-footer report-wrap-module"></div>
</body>

<!-- </html> -->`;
/*!***********************!*/
/**/modules["search.js"] = /*** ./src/vector/url/search/search.js ***/
`
    if (API.rebuildType == "重定向") {
        document.documentElement.replaceChildren(API.createElements(API.htmlVnode(API.getModule("search.html"))));
        API.appendScripts(API.getModule("search-script.html")).then(() => API.loadendEvent());
    }
    else {
        API.windowClear();
        API.documentWrite(API.getModule("search.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", \`\${API.getModule("search-script.html")}</body>\`));
    }

//# sourceURL=file://@Bilibili-Old/vector/url/search/search.js`;
/*!***********************!*/
/**/modules["album.js"] = /*** ./src/vector/url/space/album.js ***/
`
    API.xhrhook("api.bilibili.com/x/dynamic/feed/draw/doc_list", undefined, obj => {
        const response = JSON.parse(obj.responseText);
        let data = response.data.items.reduce((s, d) => {
            s.push(d.doc_id);
            return s;
        }, []);
        setTimeout(() => {
            document.querySelectorAll(".album-card").forEach((d, i) => {
                d.firstChild.href = \`//h.bilibili.com/\${data[i]}\`;
                d.children[1].href = \`//h.bilibili.com/\${data[i]}\`;
            });
        }, 1000);
    }, false);
    API.xhrhook("api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail", undefined, res => {
        const result = res.responseType === "json" ? res.response : JSON.parse(res.response);
        if (result.code === 0) {
            if (result.data?.card?.desc?.type === 2)
                location.replace(\`https://h.bilibili.com/\${result.data.card.desc.rid_str}\`);
        }
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/url/space/album.js`;
/*!***********************!*/
/**/modules["jointime.js"] = /*** ./src/vector/url/space/jointime.js ***/
`
    API.doWhile(() => document.querySelector(".section.user-info"), t => {
        API.xhr.GM({
            url: API.objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": API.mid }),
            responseType: "json"
        }, true).then(d => {
            const jointime = API.timeFormat(d.card.regtime * 1000, true);
            const node = t.lastChild;
            node.appendChild(API.createElement({
                tagName: "div",
                props: { class: "info-regtime", style: "display: inline-block;word-break: break-all;" },
                children: [
                    {
                        tagName: "span",
                        props: { class: "info-command", style: "display: inline-block;font-size: 12px;font-family: Microsoft YaHei;line-height: 16px;color: #9499a0;margin-right: 16px;" },
                        children: [
                            {
                                tagName: "text",
                                text: "注册"
                            }
                        ]
                    }, {
                        tagName: "span",
                        props: { class: "info-value", style: "color: #6d757a;font-family: Microsoft YaHei;font-size: 12px;line-height: 16px;padding-right: 15px;" },
                        children: [
                            {
                                tagName: "text",
                                text: jointime
                            }
                        ]
                    }
                ]
            }));
        });
    });

//# sourceURL=file://@Bilibili-Old/vector/url/space/jointime.js`;
/*!***********************!*/
/**/modules["lostVideo.js"] = /*** ./src/vector/url/space/lostVideo.js ***/
`
    async function getLostVideo(aid) {
        let result = []; // 失效视频信息缓存
        try { // 尝试访问Biliplus
            let data = await API.xhr.GM({ url: \`https://www.biliplus.com/video/av\${aid}\` }, true);
            if (data.match(/\\<title\\>.+?\\ \\-\\ AV/)) {
                result[0] = data.match(/\\<title\\>.+?\\ \\-\\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
                result[1] = data.match(/\\<img style=\\"display:none\\"\\ src=\\".+?\\"\\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
            }
        }
        catch (e) {
            API.debug.error("lostVideo.js", e);
        }
        if (!result[0] || !result[1]) {
            try { // 标题或封面无效，尝试访问Biliplus CID缓存库
                let data = await API.xhr.GM({ url: \`https://www.biliplus.com/all/video/av\${aid}/\` }, true);
                if (data.match('/api/view_all?')) {
                    data = data.match(/\\/api\\/view_all\\?.+?\\',cloudmoe/)[0].replace(/\\',cloudmoe/, "");
                    data = await API.xhr.GM({ url: \`//www.biliplus.com\${data}\` }, true);
                    data = API.jsonCheck(data).data;
                    result[0] = result[0] || data.info.title;
                    result[1] = result[1] || data.info.pic;
                }
            }
            catch (e) {
                API.debug.error("lostVideo.js", e);
            }
        }
        if (!result[0] || !result[1]) {
            try { // 标题或封面依旧无效，尝试访问jijidown
                let data = await API.xhr.GM({ url: \`https://www.jijidown.com/video/\${aid}\` }, true);
                if (data.match('window._INIT')) {
                    result[0] = result[0] || data.match(/\\<title\\>.+?\\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
                    result[1] = result[1] || data.match(/\\"img\\":\\ \\".+?\\",/)[0].match(/http.+?\\",/)[0].replace(/",/, "");
                }
            }
            catch (e) {
                API.debug.error("lostVideo.js", e);
            }
        }
        result[0] = result[0] || \`av\${aid}\`; // 无法获取有效数据，将标题改为av号
        result[1] = result[1] ? result[1].replace("http:", "") : "//i0.hdslb.com/bfs/archive/be27fd62c99036dce67efface486fb0a88ffed06.jpg"; //无法获取有效数据，将封面改为哭脸
        return result;
    }
    API.observerAddedNodes((node) => {
        if (/section channel guest/.test(node.className)) {
            let items = node.querySelectorAll(".small-item.disabled");
            items.forEach(d => {
                let aid = d.getAttribute("data-aid"); // 获取aid
                aid = Number(aid) || API.abv(aid); // 转化为数字
                d.setAttribute("class", "small-item fakeDanmu-item");
                d.setAttribute("data-aid", aid);
                d.children[0].href = \`//www.bilibili.com/video/av\${aid}\`;
                d.children[1].href = \`//www.bilibili.com/video/av\${aid}\`;
                d.children[0].setAttribute("target", "_blank");
                d.children[1].setAttribute("target", "_blank");
                d.children[0].setAttribute("class", "cover cover-normal");
                d.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                getLostVideo(aid).then(data => {
                    d.children[1].setAttribute("title", data[0]);
                    d.children[1].text = data[0];
                    d.children[0].children[0].alt = data[0];
                    d.children[0].children[0].src = data[1];
                });
            });
        }
        if (/small-item disabled/.test(node.className)) {
            let aid = node.getAttribute("data-aid"); // 获取aid
            aid = Number(aid) || API.abv(aid); // 转化为数字
            node.setAttribute("class", "small-item fakeDanmu-item");
            node.setAttribute("data-aid", aid);
            node.children[0].href = \`//www.bilibili.com/video/av\${aid}\`;
            node.children[1].href = \`//www.bilibili.com/video/av\${aid}\`;
            node.children[0].setAttribute("target", "_blank");
            node.children[1].setAttribute("target", "_blank");
            node.children[0].setAttribute("class", "cover cover-normal");
            node.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
            getLostVideo(aid).then(data => {
                node.children[1].setAttribute("title", data[0]);
                node.children[1].text = data[0];
                node.children[0].children[0].alt = data[0];
                node.children[0].children[0].src = data[1];
            });
        }
    });

//# sourceURL=file://@Bilibili-Old/vector/url/space/lostVideo.js`;
/*!***********************!*/
/**/modules["mid.json"] = /*** ./src/vector/url/space/mid.json ***/
{
    "code": 0,
    "data": {
        "birthday": "1980-01-01",
        "coins": 0,
        "face": "http://i2.hdslb.com/bfs/face/9f10323503739e676857f06f5e4f5eb323e9f3f2.jpg",
        "fans_badge": false,
        "is_followed": true,
        "jointime": 1436351229,
        "level": 6,
        "mid": "11783021",
        "moral": 0,
        "name": "哔哩哔哩番剧出差",
        "official": {
            "type": 1,
            "desc": "哔哩哔哩番剧出差 官方账号"
        },
        "pendant": {
            "pid": 0,
            "name": "",
            "image": "",
            "expire": 0
        },
        "rank":
            "10000",
        "sex": "保密",
        "sign": "",
        "silence": 0,
        "sys_notice": {},
        "theme": {},
        "user_honour_info": {
            "colour": null,
            "mid": 0,
            "tags": null
        },
        "vip": {
            "avatar_subscript": 1,
            "avatar_subscript_url": "http://i0.hdslb.com/bfs/vip/icon_Certification_big_member_22_3x.png",
            "due_date": 1655740800000,
            "label": {
                "bg_color": "#FB7299",
                "bg_style": 1,
                "border_color": "",
                "label_theme": "annual_vip",
                "path": "",
                "text": "年度大会员",
                "text_color": "#FFFFFF"
            },
            "nickname_color": "#FB7299",
            "role": 3,
            "status": 1,
            "theme_type": 0,
            "type": 2, "vip_pay_type": 1
        }
    },
    "message": "0",
    "ttl": 1
}
/*!***********************!*/
/**/modules["midInfo.js"] = /*** ./src/vector/url/space/midInfo.js ***/
`
    const response = API.getModule("mid.json");
    response.data.mid = API.mid;
    switch (Number(API.mid)) {
        case 11783021:
            response.data.name = "哔哩哔哩番剧出差";
            response.data.official.desc = "哔哩哔哩番剧出差 官方帐号";
            break;
        case 1988098633:
            response.data.name = "b站_戲劇咖";
            response.data.official.desc = "b站_戲劇咖 官方帐号";
            break;
        case 2042149112:
            response.data.name = "b站_綜藝咖";
            response.data.official.desc = "b站_綜藝咖 官方帐号";
            break;
    }
    API.xhrhook("api.bilibili.com/x/space/acc/info", undefined, obj => {
        if (obj.responseText && obj.responseText.includes("-404")) {
            obj.response = obj.responseText = JSON.stringify(response);
            API.toast.warning("该用户被404，已使用缓存数据恢复访问！");
        }
    }, false);

//# sourceURL=file://@Bilibili-Old/vector/url/space/midInfo.js`;
/*!***********************!*/
/**/modules["space.js"] = /*** ./src/vector/url/space/space.js ***/
`
    API.mid = (API.path[3] && API.path[3].split("?")[0]) || API.mid;
    API.config.errands && (API.mid == 11783021 || API.mid == 1988098633 || API.mid == 2042149112) && API.importModule("midInfo.js");
    API.config.album && API.importModule("album.js"); // 相簿重定向
    API.config.jointime && API.importModule("jointime.js"); // 注册时间
    API.config.lostVideo && API.importModule("lostVideo.js"); // 失效视频

//# sourceURL=file://@Bilibili-Old/vector/url/space/space.js`;
/*!***********************!*/
/**/modules["watchlater-script.html"] = /*** ./src/vector/url/watchlater/watchlater-script.html ***/
`<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
<script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
<script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script>
<script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script>
<script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"></script>
<script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
<script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script>
<script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script>
<script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"></script>
<script type="text/javascript"
    src="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"></script>`;
/*!***********************!*/
/**/modules["watchlater.html"] = /*** ./src/vector/url/watchlater/watchlater.html ***/
`<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->

<head>
    <meta charset="utf-8" />
    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />
    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
        title="哔哩哔哩" />
    <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
    <link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css" />
    <link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css" />
    <link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css"
        rel="stylesheet" />
    <style type="text/css">
        #bofqi .player {
            width: 980px;
            height: 620px;
            display: block;
        }

        @media screen and (min-width:1400px) {
            #bofqi .player {
                width: 1160px;
                height: 720px
            }
        }

        /* 修正稍后再看迷你播放器样式 */
        .bilibili-player .bilibili-player-area .bilibili-player-video-wrap.mini-player .bilibili-player-video-danmaku {
            top: 30px;
            height: 240px;
        }
    </style>
</head>

<body>
    <div class="z-top-container has-menu"></div>
    <div id="viewlater-app">
        <app></app>
    </div>
    <div class="footer bili-footer"></div>
</body>

<!-- </html> -->`;
/*!***********************!*/
/**/modules["watchlater.js"] = /*** ./src/vector/url/watchlater/watchlater.js ***/
`
    if (API.rebuildType != "重定向")
        API.windowClear();
    API.loadVideoScript();
    API.xhrhook("api.live.bilibili.com/bili/living_v2/", undefined, r => { r.responseType = "text"; }, false);
    if (API.rebuildType == "重定向") {
        document.documentElement.replaceChildren(API.createElements(API.htmlVnode(API.getModule("watchlater.html"))));
        API.appendScripts(API.getModule("watchlater-script.html")).then(() => API.loadendEvent());
    }
    else {
        API.documentWrite(API.getModule("watchlater.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", \`\${API.getModule("watchlater-script.html")}</body>\`));
    }
    API.title && (document.title = API.title);
    // 修复评论视频跳转接口
    window.commentAgent = { seek: (t) => window.player && window.player.seek(t) };
    API.config.enlike && new API.enLike("watchlater"); // 添加点赞功能
    API.importModule("primaryMenu.js"); // 顶栏分区修正
    API.importModule("banner.js"); // 顶栏banner修复
    API.importModule("loadByDmId.js"); // 弹幕ID跳转

//# sourceURL=file://@Bilibili-Old/vector/url/watchlater/watchlater.js`;
/*!***********************!*/
(function () {
    /** 入口点，切回上下文环境 */
    new Function("GM", "modules", modules["main.js"])(GM, modules);
})();
