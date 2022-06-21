import { objUrl, urlObj } from "../format/url.js";
import { setting } from "../setting.js";
import { fnval } from "../variable/fnval.js";
import { urlsign } from "./sign.js";

class UrlPack {
    get ts() {
        return new Date().getTime()
    }
    access_key = setting.accessKey?.key || undefined;
    /** url的默认参数，即UrlDetail未列出或可选的部分 */
    jsonUrlDefault = {
        "api.bilibili.com/pgc/player/web/playurl": { qn: 127, otype: 'json', fourk: 1 },
        "api.bilibili.com/x/player/playurl": { qn: 127, otype: 'json', fourk: 1 },
        "interface.bilibili.com/v2/playurl": { appkey: 9, otype: 'json', quality: 127, type: '' },
        "bangumi.bilibili.com/player/web_api/v2/playurl": { appkey: 9, module: "bangumi", otype: 'json', quality: 127, type: '' },
        "api.bilibili.com/pgc/player/api/playurlproj": { access_key: this.access_key, appkey: 1, build: "2040100", device: "android", expire: "0", mid: "0", mobi_app: "android_i", module: "bangumi", otype: "json", platform: "android_i", qn: 127, ts: this.ts },
        "app.bilibili.com/v2/playurlproj": { access_key: this.access_key, appkey: 1, build: "2040100", device: "android", expire: "0", mid: "0", mobi_app: "android_i", otype: "json", platform: "android_i", qn: 127, ts: this.ts },
        "api.bilibili.com/pgc/player/api/playurltv": { appkey: 6, qn: 127, fourk: 1, otype: 'json', platform: "android", mobi_app: "android_tv_yst", build: 102801 },
        "api.bilibili.com/x/tv/ugc/playurl": { appkey: 6, qn: 127, fourk: 1, otype: 'json', platform: "android", mobi_app: "android_tv_yst", build: 102801 },
        "app.bilibili.com/x/intl/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: this.ts },
        "apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: this.ts },
        "api.bilibili.com/view": { type: "json", appkey: "8e9fc618fbd41e28" },
        "api.bilibili.com/x/v2/reply/detail": { build: "6042000", channel: "master", mobi_app: "android", platform: "android", prev: "0", ps: "20" },
        "app.bilibili.com/x/v2/activity/index": { appkey: 1, build: 3030000, c_locale: "zh_CN", channel: "master", fnval, fnver: 0, force_host: 0, fourk: 1, https_url_req: 0, mobi_app: "android_i", offset: 0, platform: "android", player_net: 1, qn: 32, s_locale: "zh_CN", tab_id: 0, tab_module_id: 0, ts: this.ts },
        "app.bilibili.com/x/v2/activity/inline": { appkey: 1, build: 3030000, c_locale: "zh_CN", channel: "master", fnval, fnver: 0, force_host: 0, fourk: 1, https_url_req: 0, mobi_app: "android_i", platform: "android", player_net: 1, qn: 32, s_locale: "zh_CN", ts: this.ts },
        "bangumi.bilibili.com/api/season_v5": { appkey: 2, build: "2040100", platform: "android" }
    }
    /**
     * 请求封装好的json请求
     * @param url 请求的url
     * @param detail 请求所需配置数据
     * @param GM 是否使用跨域请求
     * @returns Promise封装的返回值
     */
    getJson<T extends keyof jsonUrlDetail>(url: T, detail: jsonUrlDetail[T]) {
        let obj: any = { ...(this.jsonUrlDefault[url] || {}), ...detail };
        (Number(Reflect.get(obj, "appkey")) >= 0) && (obj = this.sign(obj));
        return fetch(objUrl(`//${url}`, obj), { credentials: "include" }).then(d => d.json())
    }
    sign(obj: any) {
        return urlObj(`?${urlsign("", obj, obj.appkey)}`);
    }
}
/**
 * 封装好json请求所需参数  
 * 请一并配置好Url.jsonUrlDefault默认值
 */
export interface jsonUrlDetail {
    /** 网页端bangumi playurl */
    "api.bilibili.com/pgc/player/web/playurl": { avid: number | string, cid: number | string, qn?: number | string, fnver?: number | string, fnval?: number | string }
    /** 网页端一般视频playurl */
    "api.bilibili.com/x/player/playurl": { avid: number | string, cid: number | string, qn?: number | string, fnver?: number | string, fnval?: number | string }
    /** Interface playurl */
    "interface.bilibili.com/v2/playurl": { cid: number | string, quality?: number | string }
    /** Interface bangumi playuel */
    "bangumi.bilibili.com/player/web_api/v2/playurl": { cid: number | string, quality?: number | string }
    /** 投屏 bangumi playurl */
    "api.bilibili.com/pgc/player/api/playurlproj": { cid: number | string }
    /** 投屏 普通视频 playurl */
    "app.bilibili.com/v2/playurlproj": { cid: number | string }
    /** TV端 bangumi playurl */
    "api.bilibili.com/pgc/player/api/playurltv": { avid: number | string, cid: number | string, qn?: number | string, fnver?: number | string, fnval?: number | string, build?: number | string }
    /** TV 普通视频 playurl */
    "api.bilibili.com/x/tv/ugc/playurl": { avid: number | string, cid: number | string, qn?: number | string, fnver?: number | string, fnval?: number | string, build?: number | string }
    /** Android Play一般视频 */
    "app.bilibili.com/x/intl/playurl": { aid: number | string, cid: number | string, qn?: number | string, fnver?: number | string, fnval?: number | string, build?: number | string }
    /** Android Play bangumi视频 */
    "apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl": { ep_id: number | string, cid: number | string, qn?: number | string, fnver?: number | string, fnval?: number | string, build?: number | string }
    /**
     * 获取aid信息，包括区域限制
     * @param id 视频aid
     * @param page 分p号
     */
    "api.bilibili.com/view": { id: number | string, page?: string | number }
    /** APP楼中楼详情 */
    "api.bilibili.com/x/v2/reply/detail": { oid: number | string, root: number | string, type: number | string }
    /** APP端activity/index请求 */
    "app.bilibili.com/x/v2/activity/index": { page_id: number }
    /** APP端新番时间表 */
    "app.bilibili.com/x/v2/activity/inline": { page_id: number }
    /** bangumi信息接口 */
    "bangumi.bilibili.com/api/season_v5": { season_id: number }
}
/** 封装好的默认请求，已填好必须的参数 */
export const urlPack = new UrlPack();