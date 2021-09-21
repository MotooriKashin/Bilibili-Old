/**
 * 本模块封装了urlAPI请求以便于访问
 */
(function () {
    try {
        class Url {
            constructor() {
                /**
                 * url的默认参数，即UrlDetail未列出或可选的部分
                 */
                this.jsonUrlDefault = {
                    "api.bilibili.com/pgc/player/web/playurl": { qn: 125, otype: 'json', fourk: 1 },
                    "api.bilibili.com/x/player/playurl": { qn: 125, otype: 'json', fourk: 1 },
                    "interface.bilibili.com/v2/playurl": { otype: 'json', qn: 125, quality: 125, type: '' },
                    "api.bilibili.com/pgc/player/api/playurlproj": { appkey: 0, otype: 'json', platform: 'android_i', qn: 208 },
                    "app.bilibili.com/v2/playurlproj": { appkey: 0, otype: 'json', platform: 'android_i', qn: 208 },
                    "api.bilibili.com/pgc/player/api/playurltv": { appkey: 1, qn: 125, fourk: 1, otype: 'json', fnver: 0, fnval: 80, platform: "android", mobi_app: "android_tv_yst", build: 102801 },
                    "api.bilibili.com/x/tv/ugc/playurl": { appkey: 1, qn: 125, fourk: 1, otype: 'json', fnver: 0, fnval: 80, platform: "android", mobi_app: "android_tv_yst", build: 102801 }
                };
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
                Reflect.has(obj, "appkey") && (obj = this.sign(obj));
                return GM ? xhr.GM({
                    url: API.objUrl(`//${url}`, obj),
                    responseType: "json"
                }) : xhr({
                    url: API.objUrl(`//${url}`, obj),
                    responseType: "json"
                });
            }
            sign(obj) {
                return API.urlObj(`?${API.urlsign("", obj, obj.appkey)}`);
            }
        }
        const exports = new Url();
        API.getJson = (url, detail, GM) => exports.getJson(url, detail, GM);
    }
    catch (e) {
        API.trace(e, "url.js", true);
    }
})();
