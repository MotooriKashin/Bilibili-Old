"use strict";
/**
 * 本模块负责修复资讯区新动态数目
 */
(function () {
    API.jsonphook(['api.bilibili.com/x/web-interface/online'], function (xhr) {
        let jsonpCallback = this.jsonpCallback;
        let call = window[jsonpCallback];
        let jsonp = this;
        if (call) {
            window[jsonpCallback] = function (v) {
                v.data && (v.data.region_count[165] = v.data.region_count[202]);
                return call.call(jsonp, v);
            };
        }
    });
})();
