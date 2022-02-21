interface modules {
    /**
     * 解锁视频限制
     */
    readonly "videoLimit.js": string;
}
{
    class HookTimeOut {
        hook: (handler: TimerHandler, timeout?: number | undefined, ...args: any[]) => number
        constructor() {
            this.hook = setTimeout;
            window.setTimeout = (...args) => {
                if (args[1] && args[1] == 1500 && args[0] && args[0].toString() == "function(){f.cz()}") {
                    toast.warning("禁用播放器强制初始化！", ...<any>args)
                    return Number.MIN_VALUE;
                }
                return this.hook.call(window, ...args);
            }

        }
        relese() {
            window.setTimeout = this.hook;
        }
    }
    API.xhrhook('season/user/status?', args => { // 误导限制视频判定
        args[1] = args[1].replace('bangumi.bilibili.com/view/web_api/season/user/status', 'api.bilibili.com/pgc/view/web/season/user/status');
    }, obj => {
        const response = obj.responseType === "json" ? obj.response : JSON.parse(obj.response);
        if (response) {
            if (response.result.area_limit) {
                response.result.area_limit = 0; // 解除区域限制标记
                response.ban_area_show = 1; // 伪造访问许可
                API.limit = true;
            }
            // 处理两个接口属性名差异
            if (response.result.progress) response.result.watch_progress = response.result.progress;
            if (response.result.vip_info) response.result.vipInfo = response.result.vip_info;
            obj.response = obj.responseType === "json" ? response : JSON.stringify(response);
            obj.responseText = JSON.stringify(response);
        }
    }, false);
    API.xhrhookasync("/playurl?", args => {
        return API.limit || (API.pgc && (<any>API).__INITIAL_STATE__?.rightsInfo?.watch_platform); // 判定是否限制视频
    }, async (args, type) => { // 代理限制视频的请求
        let response: any; // 初始化返回值
        let obj = Format.urlObj(args[1]); // 提取请求参数
        const hookTimeout = new HookTimeOut(); // 过滤播放器请求延时代码
        const accesskey = GM.getValue("access_key", "") || undefined;
        if (API.globalLimit) { // 处理泰区视频
            const server = config.limitServer || "https://api.global.bilibili.com";
            try {
                toast.info("尝试解除泰区限制... 访问代理服务器");
                response = API.jsonCheck(await xhr.GM({
                    url: Format.objUrl(`${server}/intl/gateway/v2/ogv/playurl`, { aid: obj.avid || API.aid, ep_id: obj.ep_id, download: "1" })
                }));
                response = await new API.rebuildPlayerurl().ogvPlayurl(response);
                response = { "code": 0, "message": "success", "result": response };
                API.__playinfo__ = response;
                toast.success(`解除泰区限制！aid=${API.aid}, cid=${API.cid}`);
            } catch (e) {
                toast.error("videoLimit.js", e);
                response = { "code": -404, "message": e, "data": null };
            }
        }
        else if (API.limit) { // 处理区域限制
            obj.access_key = accesskey; // 鉴权
            obj.module = ((<any>API).__INITIAL_STATE__?.upInfo?.mid == 1988098633 || (<any>API).__INITIAL_STATE__?.upInfo?.mid == 2042149112) ? "movie" : "bangumi"; // 支持影视区投稿
            obj.fnval && (obj.fnval = API.fnval); // 提升dash标记清晰度
            try {
                toast.info("尝试解除区域限制... 访问代理服务器");
                response = API.jsonCheck(await xhr.GM({
                    url: Format.objUrl("https://www.biliplus.com/BPplayurl.php", obj)
                }));
                response = await new API.rebuildPlayerurl().appPlayurl(response);
                response = { "code": 0, "message": "success", "result": response };
                API.__playinfo__ = response;
                toast.success(`解除区域限制！aid=${API.aid}, cid=${API.cid}`);
            } catch (e) {
                toast.error("videoLimit.js", e);
                response = { "code": -404, "message": e, "data": null };
            }
        }
        else if (API.pgc && (<any>API).__INITIAL_STATE__?.rightsInfo?.watch_platform) { // APP专属限制
            obj.access_key = accesskey;
            obj.fnval = null;
            obj.fnver = null;
            obj.platform = "android_i";
            try {
                toast.info("尝试解除APP限制... 使用移动端flv接口");
                response = API.jsonCheck(await xhr.GM({
                    url: API.urlsign("https://api.bilibili.com/pgc/player/api/playurl", obj, 1)
                }));
                response = { "code": 0, "message": "success", "result": response };
                API.__playinfo__ = response;
                toast.success(`解除APP限制！aid=${API.aid}, cid=${API.cid}`);
            } catch (e) {
                toast.error("videoLimit.js", e);
                response = { "code": -404, "message": e, "data": null };
            }
        }
        hookTimeout.relese();
        return type === "json" ? { response } : {
            response: JSON.stringify(response),
            responseText: JSON.stringify(response)
        }
    }, false);
}
declare namespace API {
    /**
     * 一般区域限制视频标记
     */
    let limit: boolean;
    /**
     * 东南亚区限制视频标记
     */
    let globalLimit: boolean;
}