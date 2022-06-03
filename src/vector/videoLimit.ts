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
    async function customServer(obj: Record<string, string | number>, area: "tw" | "hk" | "cn"): Promise<any> {
        if (area === "tw" && !config.videoLimit.tw) return customServer(obj, "hk");
        if (area === "hk" && !config.videoLimit.hk) return customServer(obj, "cn");
        if (area === "cn" && !config.videoLimit.cn) throw "无有效代理服务器地址";
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
            const result = await xhr({
                url: urlsign(`https://${config.videoLimit[area]}/pgc/player/api/playurl`, obj, 2),
                responseType: "json"
            });
            if (result.code !== 0) throw result;
            return result;
        } catch (e) {
            debug.error("代理服务器", config.videoLimit[area], e);
            if (area === "tw") return customServer(obj, "hk");
            if (area === "hk") return customServer(obj, "cn");
            toast.error("代理服务器", config.videoLimit[area], e);
            throw "所有代理服务器都已失败！";
        }
    }
    xhrhookAsync("/playurl?", () => limit || th, async (args, type) => { // 代理限制视频的请求
        let response: any; // 初始化返回值
        const hookTimeout = new HookTimeOut(); // 过滤播放器请求延时代码
        let obj = urlObj(args[1]); // 提取请求参数
        const accesskey = config.accessKey.key || <any>undefined;
        obj.access_key = accesskey;
        if (th) { // 泰区
            // noreferer();
            uposWithGM();
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
            toast.info("尝试解除区域限制... 访问代理服务器");
            response = jsonCheck((await xhr.GM({
                url: urlsign(`https://${config.videoLimit.th || 'api.global.bilibili.com'}/intl/gateway/v2/ogv/playurl`, obj, 12)
            })).replace(/bstar1-mirrorakam\.akamaized\.net/g, "sz-mirrorks3.bilivideo.com"));
            response = { "code": 0, "message": "success", "result": await bstarPlayurl(response) };
            __playinfo__ = response;
            toast.success(`解除区域限制！aid=${aid}, cid=${cid}`);
        }
        else if (limit) { // 处理区域限制
            obj.module = ((<any>API).__INITIAL_STATE__?.upInfo?.mid == 1988098633 || (<any>API).__INITIAL_STATE__?.upInfo?.mid == 2042149112) ? "movie" : "bangumi"; // 支持影视区投稿
            obj.fnval && (obj.fnval = String(fnval)); // 提升dash标记清晰度
            try {
                toast.info("尝试解除区域限制... 访问代理服务器");
                response = config.videoLimit.server === "内置" ? jsonCheck(await xhr.GM({
                    url: objUrl("https://www.biliplus.com/BPplayurl.php", obj)
                })) : (delete obj.module, await customServer(obj, "tw"));
                response = { "code": 0, "message": "success", "result": response };
                __playinfo__ = response;
                toast.success(`解除区域限制！aid=${aid}, cid=${cid}`);
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