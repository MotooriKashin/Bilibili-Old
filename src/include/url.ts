interface modules {
    /**
     * 常用的url请求的封装，以方便提示参数信息及省略默认气息
     */
    readonly "url.js": string;
}
class _Url {
    access_key: string = GM.getValue("access_key", undefined);
    /**
     * url的默认参数，即UrlDetail未列出或可选的部分
     */
    jsonUrlDefault = {
        "api.bilibili.com/pgc/player/web/playurl": { qn: 127, otype: 'json', fourk: 1 },
        "api.bilibili.com/x/player/playurl": { qn: 127, otype: 'json', fourk: 1 },
        "interface.bilibili.com/v2/playurl": { appkey: 9, otype: 'json', quality: 127, type: '' },
        "bangumi.bilibili.com/player/web_api/v2/playurl": { appkey: 9, module: "bangumi", otype: 'json', quality: 127, type: '' },
        "api.bilibili.com/pgc/player/api/playurlproj": { access_key: this.access_key, appkey: 0, otype: 'json', platform: 'android_i', qn: 208 },
        "app.bilibili.com/v2/playurlproj": { access_key: this.access_key, appkey: 0, otype: 'json', platform: 'android_i', qn: 208 },
        "api.bilibili.com/pgc/player/api/playurltv": { appkey: 6, qn: 127, fourk: 1, otype: 'json', fnver: 0, fnval: API.fnval, platform: "android", mobi_app: "android_tv_yst", build: 102801 },
        "api.bilibili.com/x/tv/ugc/playurl": { appkey: 6, qn: 127, fourk: 1, otype: 'json', fnver: 0, fnval: API.fnval, platform: "android", mobi_app: "android_tv_yst", build: 102801 },
        "app.bilibili.com/x/intl/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: API.fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: new Date().getTime() },
        "apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: API.fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: new Date().getTime() },
        "api.bilibili.com/view": { type: "json", appkey: "8e9fc618fbd41e28" }
    }
    /**
     * 请求封装好的json请求
     * @param url 请求的url
     * @param detail 请求所需配置数据
     * @param GM 是否使用跨域请求
     * @returns Promise封装的返回值
     */
    getJson<T extends keyof jsonUrlDetail>(url: T, detail: jsonUrlDetail[T], GM = false) {
        let obj: any = { ...(this.jsonUrlDefault[url] || {}), ...detail };
        Number(Reflect.get(obj, "appkey")) && (obj = this.sign(obj));
        return GM ? xhr.GM({
            url: Format.objUrl(`//${url}`, obj),
            responseType: "json"
        }) : xhr({
            url: Format.objUrl(`//${url}`, obj),
            responseType: "json",
            credentials: true
        })
    }
    sign(obj: any) {
        return Format.urlObj(`?${API.urlsign("", obj, obj.appkey)}`);
    }
}
API.url = _Url;
declare namespace API {
    export let url: typeof _Url;
}
/**
 * 封装好json请求所需参数  
 * 请一并配置好Url.jsonUrlDefault默认值
 */
interface jsonUrlDetail {
    /**
     * 网页端bangumi playurl
     */
    "api.bilibili.com/pgc/player/web/playurl": { avid: number, cid: number, qn?: number, fnver?: number, fnval?: number }
    /**
     * 网页端一般视频playurl
     */
    "api.bilibili.com/x/player/playurl": { avid: number, cid: number, qn?: number, fnver?: number, fnval?: number }
    /**
     * Interface playurl  
     * 这版url没有防盗链检测
     */
    "interface.bilibili.com/v2/playurl": { cid: number, quality?: number }
    /**
     * Interface bangumi playuel  
     * 这版url没有防盗链检测
     */
    "bangumi.bilibili.com/player/web_api/v2/playurl": { cid: number, quality?: number }
    /**
     * 投屏 bangumi playurl
     */
    "api.bilibili.com/pgc/player/api/playurlproj": { cid: number }
    /**
     * 投屏 普通视频 playurl
     */
    "app.bilibili.com/v2/playurlproj": { cid: number }
    /**
     * TV端 bangumi playurl
     */
    "api.bilibili.com/pgc/player/api/playurltv": { avid: number, cid: number, qn?: number, fnver?: number, fnval?: number, build?: number }
    /**
     * TV 普通视频 playurl
     */
    "api.bilibili.com/x/tv/ugc/playurl": { avid: number, cid: number, qn?: number, fnver?: number, fnval?: number, build?: number }
    /**
     * Android Play一般视频
     */
    "app.bilibili.com/x/intl/playurl": { aid: number, cid: number, qn?: number, fnver?: number, fnval?: number, build?: number }
    /**
     * Android Play bangumi视频
     */
    "apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl": { ep_id: number, cid: number, qn?: number, fnver?: number, fnval?: number, build?: number }
    /**
     * 获取aid信息，包括区域限制
     * @param id 视频aid
     * @param page 分p号
     */
    "api.bilibili.com/view": { id: number, page?: string | number }
}