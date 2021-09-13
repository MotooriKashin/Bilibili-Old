/**
 * 本模块负责接触区域、APP等播放限制
 */
(function () {
    class HookTimeOut {
        constructor() {
            this.hook = setTimeout;
            window.setTimeout = (...args) => {
                if (args[1] && args[1] == 1500 && args[0] && args[0].toString() == "function(){f.cz()}") {
                    toast.warning("禁用播放器强制初始化！", ...args);
                    return Number.MIN_VALUE;
                }
                return this.hook.call(window, ...args);
            };
        }
        relese() {
            window.setTimeout = this.hook;
        }
    }
    API.xhrhook(['season/user/status?'], function (args) {
        args[1] = args[1].replace('bangumi.bilibili.com/view/web_api/season/user/status', 'api.bilibili.com/pgc/view/web/season/user/status');
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                try {
                    let response = API.jsonCheck(this.responseText);
                    if (response) {
                        if (response.result.area_limit) {
                            response.result.area_limit = 0;
                            response.ban_area_show = 1;
                            API.limit = true;
                        }
                        if (response.result.progress)
                            response.result.watch_progress = response.result.progress;
                        if (response.result.vip_info)
                            response.result.vipInfo = response.result.vip_info;
                        Object.defineProperty(this, 'response', { writable: true });
                        Object.defineProperty(this, 'responseText', { writable: true });
                        this.response = this.responseText = JSON.stringify(response);
                    }
                }
                catch (e) {
                    API.trace(e, "videoLimit.js");
                }
            }
        });
    });
    API.xhrhook(["/playurl?"], function (args) {
        var _a, _b;
        // APP限制
        !API.limit && API.pgc && ((_b = (_a = API.__INITIAL_STATE__) === null || _a === void 0 ? void 0 : _a.rightsInfo) === null || _b === void 0 ? void 0 : _b.watch_platform) && (this.send = async () => appLimit.call(this, args));
        // 区域限制
        API.limit && (this.send = async () => areaLimit.call(this, args));
    });
    async function appLimit(args) {
        const hookTimeout = new HookTimeOut();
        const progress = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")); }, 50);
        const accesskey = GM.getValue("access_key", "") || undefined;
        let response;
        let obj = API.urlObj(args[1]);
        obj = { ...obj, ...{ access_key: accesskey, fnval: null, fnver: null, platform: "android_i" } };
        this.dispatchEvent(new ProgressEvent("loadstart"));
        Object.defineProperty(this, "response", { writable: true });
        Object.defineProperty(this, "responseText", { writable: true });
        Object.defineProperty(this, "responseURL", { writable: true });
        Object.defineProperty(this, "readyState", { writable: true });
        Object.defineProperty(this, "status", { writable: true });
        this.status = 200;
        this.readyState = 2;
        this.dispatchEvent(new ProgressEvent("readystatechange"));
        try {
            toast.info("尝试解除APP限制... 使用移动端flv接口");
            response = API.jsonCheck(await xhr.GM({
                url: API.urlsign("https://api.bilibili.com/pgc/player/api/playurl", obj, 1)
            }));
            response = { "code": 0, "message": "success", "result": response };
            API.__playinfo__ = response;
            toast.success(`解除APP限制！aid=${API.aid}, cid=${API.cid}`);
        }
        catch (e) {
            API.trace(e, "videoLimit.js", true);
            response = { "code": -404, "message": e, "data": null };
        }
        clearInterval(progress);
        this.responseURL = args[1];
        this.response = this.responseText = JSON.stringify(response);
        this.readyState = 4;
        this.dispatchEvent(new ProgressEvent("readystatechange"));
        this.dispatchEvent(new ProgressEvent("load"));
        this.dispatchEvent(new ProgressEvent("loadend"));
        hookTimeout.relese();
    }
    async function areaLimit(args) {
        if (API.globalLimit)
            return globalLimit.call(this, args);
        const hookTimeout = new HookTimeOut();
        const progress = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")); }, 50);
        const accesskey = GM.getValue("access_key", "") || undefined;
        let response;
        let obj = API.urlObj(args[1]);
        obj = { ...obj, ...{ access_key: accesskey, module: "bangumi" } };
        obj.fnval && (obj.fnval = 16);
        this.dispatchEvent(new ProgressEvent("loadstart"));
        Object.defineProperty(this, "response", { writable: true });
        Object.defineProperty(this, "responseText", { writable: true });
        Object.defineProperty(this, "responseURL", { writable: true });
        Object.defineProperty(this, "readyState", { writable: true });
        Object.defineProperty(this, "status", { writable: true });
        this.status = 200;
        this.readyState = 2;
        this.dispatchEvent(new ProgressEvent("readystatechange"));
        try {
            toast.info("尝试解除区域限制... 访问代理服务器");
            response = API.jsonCheck(await xhr.GM({
                url: API.objUrl("https://www.biliplus.com/BPplayurl.php", obj)
            }));
            response = await new API.RebuildPlayerurl().appPlayurl(response);
            response = { "code": 0, "message": "success", "result": response };
            API.__playinfo__ = response;
            toast.success(`解除区域限制！aid=${API.aid}, cid=${API.cid}`);
        }
        catch (e) {
            API.trace(e, "videoLimit.js", true);
            response = { "code": -404, "message": e, "data": null };
        }
        clearInterval(progress);
        this.responseURL = args[1];
        this.response = this.responseText = JSON.stringify(response);
        this.readyState = 4;
        this.dispatchEvent(new ProgressEvent("readystatechange"));
        this.dispatchEvent(new ProgressEvent("load"));
        this.dispatchEvent(new ProgressEvent("loadend"));
        hookTimeout.relese();
    }
    async function globalLimit(args) {
        const hookTimeout = new HookTimeOut();
        const progress = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")); }, 50);
        const server = config.limitServer || "https://api.global.bilibili.com";
        let response;
        let obj = API.urlObj(args[1]);
        this.dispatchEvent(new ProgressEvent("loadstart"));
        Object.defineProperty(this, "response", { writable: true });
        Object.defineProperty(this, "responseText", { writable: true });
        Object.defineProperty(this, "responseURL", { writable: true });
        Object.defineProperty(this, "readyState", { writable: true });
        Object.defineProperty(this, "status", { writable: true });
        this.status = 200;
        this.readyState = 2;
        this.dispatchEvent(new ProgressEvent("readystatechange"));
        try {
            toast.info("尝试解除泰区限制... 访问代理服务器");
            response = API.jsonCheck(await xhr.GM({
                url: API.objUrl(`${server}/intl/gateway/v2/ogv/playurl`, { aid: obj.avid || API.aid, ep_id: obj.ep_id, download: "1" })
            }));
            response = await new API.RebuildPlayerurl().ogvPlayurl(response);
            response = { "code": 0, "message": "success", "result": response };
            API.__playinfo__ = response;
            toast.success(`解除泰区限制！aid=${API.aid}, cid=${API.cid}`);
        }
        catch (e) {
            API.trace(e, "videoLimit.js", true);
            response = { "code": -404, "message": e, "data": null };
        }
        clearInterval(progress);
        this.responseURL = args[1];
        this.response = this.responseText = JSON.stringify(response);
        this.readyState = 4;
        this.dispatchEvent(new ProgressEvent("readystatechange"));
        this.dispatchEvent(new ProgressEvent("load"));
        this.dispatchEvent(new ProgressEvent("loadend"));
        hookTimeout.relese();
    }
})();
