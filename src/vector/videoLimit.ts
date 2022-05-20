interface modules {
    /** 解锁视频限制 */
    readonly "videoLimit.js": string;
}
namespace API {
    const Backup: Record<string, any> = {};
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
    xhrhookasync("/playurl?", () => limit, async (args, type) => { // 代理限制视频的请求
        let response: any; // 初始化返回值
        const hookTimeout = new HookTimeOut(); // 过滤播放器请求延时代码
        let obj = urlObj(args[1]); // 提取请求参数
        const accesskey = GM.getValue("access_key", "") || <any>undefined;
        obj.access_key = accesskey;
        if (limit) { // 处理区域限制
            obj.module = ((<any>API).__INITIAL_STATE__?.upInfo?.mid == 1988098633 || (<any>API).__INITIAL_STATE__?.upInfo?.mid == 2042149112) ? "movie" : "bangumi"; // 支持影视区投稿
            obj.fnval && (obj.fnval = String(fnval)); // 提升dash标记清晰度
            try {
                toast.info("尝试解除区域限制... 访问代理服务器");
                response = jsonCheck(await xhr.GM({
                    url: objUrl("https://www.biliplus.com/BPplayurl.php", obj)
                }));
                response = { "code": 0, "message": "success", "result": response };
                __playinfo__ = response;
                toast.success(`解除区域限制！aid=${aid}, cid=${cid}`);
            } catch (e) {
                toast.error("解除限制失败 ಥ_ಥ");
                debug.error("解除限制失败 ಥ_ಥ", e);
                response = { "code": -404, "message": e, "data": null };
            }
        }
        else if (pgc && (<any>API).__INITIAL_STATE__?.rightsInfo?.watch_platform) { // APP专属限制
            obj.fnval = <any>null;
            obj.fnver = <any>null;
            obj.platform = "android_i";
            try {
                toast.info("尝试解除APP限制... 使用移动端flv接口");
                response = jsonCheck(await xhr.GM({
                    url: urlsign("https://api.bilibili.com/pgc/player/api/playurl", obj, 1)
                }));
                response = { "code": 0, "message": "success", "result": response };
                __playinfo__ = response;
                toast.success(`解除APP限制！aid=${aid}, cid=${cid}`);
            } catch (e) {
                toast.error("解除限制失败 ಥ_ಥ");
                debug.error("解除限制失败 ಥ_ಥ", e);
                response = { "code": -404, "message": e, "data": null };
            }
        }
        hookTimeout.relese();
        __playinfo__ = response;
        if (response.code === -404) throw type === "json" ? { response } : {
            response: JSON.stringify(response),
            responseText: JSON.stringify(response)
        }
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
}