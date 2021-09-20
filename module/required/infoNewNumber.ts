/**
 * 本模块负责修复资讯区新动态数目
 */
(function () {
    try {
        API.jsonphook(['api.bilibili.com/x/web-interface/online'], function (xhr) {
            const obj = API.urlObj(xhr.url);
            let callback = obj.callback;
            let call: any = window[callback];
            if (call) {
                (<any>window)[callback] = function (v: any) {
                    v.data && (v.data.region_count[165] = v.data.region_count[202]);
                    return call(v);
                }
            }
        })
    } catch (e) { API.trace(e, "replyList.js") }
})();