import { Base64 } from "../lib/Base64";
import { urlsign } from "../lib/sign";
import { debug } from "../debug";
import { objUrl, urlObj } from "../format/url";
import { xhrhookAsync } from "../hook/xhr";
import { setting } from "../setting";
import { toast } from "../toast/toast";
import { jsonCheck } from "../unit";
import { fnval } from "../variable/fnval";
import { xhr } from "../xhr";
import { bstarPlayurl } from "./bstarPlayurl";
import { uposReplace } from "./uposReplace";
import { VAR } from "../variable/variable";


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
    if (area === "tw" && !setting.videoLimit.tw) return customServer(obj, "hk");
    if (area === "hk" && !setting.videoLimit.hk) return customServer(obj, "cn");
    if (area === "cn" && !setting.videoLimit.cn) throw "无有效代理服务器地址";
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
        const result = jsonCheck(await xhr({
            url: urlsign(`https://${setting.videoLimit[area]}/pgc/player/api/playurl`, obj, 2)
        }));
        if (result.code !== 0) throw result;
        return result;
    } catch (e) {
        debug.error("代理服务器", setting.videoLimit[area], e);
        if (area === "tw") return customServer(obj, "hk");
        if (area === "hk") return customServer(obj, "cn");
        toast.error("代理服务器", setting.videoLimit[area], e);
        throw "所有代理服务器都已失败！";
    }
}
/** 解除播放限制 */
export function videoLimit() {
    xhrhookAsync("/playurl?", () => Boolean(VAR.limit || VAR.th), async (args, type) => { // 代理限制视频的请求
        let response: any; // 初始化返回值
        const obj = urlObj(args[1]); // 提取请求参数
        obj.seasonId && (VAR.ssid = obj.seasonId);
        obj.episodeId && (VAR.epid = obj.episodeId);
        obj.ep_id && (VAR.epid = obj.ep_id);
        obj.aid && (VAR.aid = Number(obj.aid)) && (VAR.aid = obj.aid);
        obj.avid && (VAR.aid = Number(obj.avid)) && (VAR.aid = obj.avid);
        obj.cid && (VAR.cid = Number(obj.cid)) && (VAR.cid = obj.cid);
        const hookTimeout = new HookTimeOut(); // 过滤播放器请求延时代码
        const epid = obj.ep_id || obj.episodeId || VAR.epid;
        const accesskey = setting.accessKey.key || <any>undefined;
        obj.access_key = accesskey;
        Backup[epid] && (response = Backup[epid]);
        if (!response) {
            if (VAR.th) { // 泰区
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
                    response = jsonCheck(uposReplace(await xhr({
                        url: urlsign(`https://${setting.videoLimit.th || 'api.global.bilibili.com'}/intl/gateway/v2/ogv/playurl`, obj, 12)
                    }), setting.uposReplace.th));
                    response = { "code": 0, "message": "success", "result": await bstarPlayurl(response) };
                    toast.success(`解除区域限制！aid=${VAR.aid}, cid=${VAR.cid}`);
                } catch (e) {
                    toast.error("解除限制失败 ಥ_ಥ");
                    debug.error("解除限制失败 ಥ_ಥ", e);
                    if (!accesskey) {
                        toast.warning("这似乎是一个泰区限制视频，需要授权解析服务器使用您的账户才能尝试解析，请到设置里进行【账户授权】。<strong>但这意味着解析服务器会获得您账户的部分权限，请务必确认对反的可靠性然后操作！</strong>");
                    }
                    response = { "code": -404, "message": e, "data": null };
                }
            } else if (VAR.limit) { // 处理区域限制
                obj.module = (VAR.__INITIAL_STATE__?.upInfo?.mid == 1988098633 || VAR.__INITIAL_STATE__?.upInfo?.mid == 2042149112) ? "movie" : "bangumi"; // 支持影视区投稿
                obj.fnval && (obj.fnval = String(fnval)); // 提升dash标记清晰度
                try {
                    toast.info("尝试解除区域限制... 访问代理服务器");
                    setting.uposReplace.gat !== "不替换" && window.postMessage({ $type: "th" });
                    response = setting.videoLimit.server === "内置" ? jsonCheck(await xhr({
                        url: objUrl("https://www.biliplus.com/BPplayurl.php", obj)
                    })) : (delete obj.module, await customServer(obj, "tw"));
                    response = JSON.parse(uposReplace(JSON.stringify(response), setting.uposReplace.gat));
                    response = { "code": 0, "message": "success", "result": response };
                    toast.success(`解除区域限制！aid=${VAR.aid}, cid=${VAR.cid}`);
                } catch (e) {
                    toast.error("解除限制失败 ಥ_ಥ");
                    debug.error("解除限制失败 ಥ_ಥ", e);
                    if (setting.videoLimit.server === "自定义") {
                        toast.warning("您将代理服务器设置为【自定义】，服务器返回出错，这可能是您由于未进行【账户授权】或者授权过期，请到设置里进行【账户授权】。")
                    }
                    response = { "code": -404, "message": e, "data": null };
                }
            }
        }
        hookTimeout.relese();
        if (response.code === -404) throw type === "json" ? { response } : {
            response: JSON.stringify(response),
            responseText: JSON.stringify(response)
        }
        Backup[epid] = response;
        VAR.__playinfo__ = response;
        return type === "json" ? { response } : {
            response: JSON.stringify(response),
            responseText: JSON.stringify(response)
        }
    }, false);
}