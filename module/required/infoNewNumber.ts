/**
 * 本模块负责修复资讯区新动态数目
 */
(function () {
    API.jsonphook(['api.bilibili.com/x/web-interface/online'], function (xhr) {
        const obj = API.urlObj(xhr.url);
        let jsonpCallback = obj.jsonpCallback;
        let call: any = window[jsonpCallback];
        if (call) {
            (<any>window)[jsonpCallback] = function (v: any) {
                v.data && (v.data.region_count[165] = v.data.region_count[202]);
                return call.call(v);
            }
        }
    })
})();