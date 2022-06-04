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
            const result = jsonCheck(uposReplace(await xhr({
                url: urlsign(`https://${config.videoLimit[area]}/pgc/player/api/playurl`, obj, 2)
            }), config.uposReplace.gat));
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
        Backup[epid] && (response = Backup[epid]); // 启用备份
        if (!response) {
            if (th) { // 泰区
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
                try {
                    toast.info("尝试解除区域限制... 访问代理服务器");
                    response = jsonCheck(uposReplace(await xhr.GM({
                        url: urlsign(`https://${config.videoLimit.th || 'api.global.bilibili.com'}/intl/gateway/v2/ogv/playurl`, obj, 12)
                    }), config.uposReplace.th));
                    response = { "code": 0, "message": "success", "result": await bstarPlayurl(response) };
                    __playinfo__ = response;
                    toast.success(`解除区域限制！aid=${aid}, cid=${cid}`);
                } catch (e) {
                    toast.error("解除限制失败 ಥ_ಥ");
                    debug.error("解除限制失败 ಥ_ಥ", e);
                    if (!accesskey) {
                        alert("这似乎是一个泰区限制视频，需要授权解析服务器使用您的账户才能尝试解析。<strong>但这意味着解析服务器会获得您账户的部分权限，请务必确认对反的可靠性然后操作！</strong><br>是否前往账户授权？", "解除限制出错", [
                            {
                                name: "立即前往",
                                callback: () => showSetting("accessKey")
                            },
                            {
                                name: "还是算了",
                                callback: () => { }
                            }
                        ])
                    }
                    response = { "code": -404, "message": e, "data": null };
                }
            }
            else if (limit) { // 处理区域限制
                config.uposReplace.gat !== "不替换" && uposWithGM();
                obj.module = ((<any>API).__INITIAL_STATE__?.upInfo?.mid == 1988098633 || (<any>API).__INITIAL_STATE__?.upInfo?.mid == 2042149112) ? "movie" : "bangumi"; // 支持影视区投稿
                obj.fnval && (obj.fnval = String(fnval)); // 提升dash标记清晰度
                try {
                    toast.info("尝试解除区域限制... 访问代理服务器");
                    response = config.videoLimit.server === "内置" ? jsonCheck(uposReplace(await xhr.GM({
                        url: objUrl("https://www.biliplus.com/BPplayurl.php", obj)
                    }), config.uposReplace.gat)) : (delete obj.module, await customServer(obj, "tw"));
                    response = { "code": 0, "message": "success", "result": response };
                    __playinfo__ = response;
                    toast.success(`解除区域限制！aid=${aid}, cid=${cid}`);
                } catch (e) {
                    toast.error("解除限制失败 ಥ_ಥ");
                    debug.error("解除限制失败 ಥ_ಥ", e);
                    if (config.videoLimit.server === "自定义") {
                        alert("您将代理服务器设置为【自定义】，服务器返回出错，这可能是您由于未进行【账户授权】或者授权过期。<br>是否前往账户授权？", "解除限制出错", [
                            {
                                name: "立即前往",
                                callback: () => showSetting("accessKey")
                            },
                            {
                                name: "还是算了",
                                callback: () => { }
                            }
                        ])
                    }
                    response = { "code": -404, "message": e, "data": null };
                }
            }
        }
        hookTimeout.relese();
        __playinfo__ = response;
        if (response.code === -404) throw type === "json" ? { response } : {
            response: JSON.stringify(response),
            responseText: JSON.stringify(response)
        }
        Backup[epid] = response;
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