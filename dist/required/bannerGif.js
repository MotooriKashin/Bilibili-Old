/**
 * 本模块负责替换顶栏动图接口
 */
(function () {
    API.jsonphook(["api.bilibili.com/x/web-interface/index/icon"], function (xhr) {
        const obj = API.urlObj(xhr.url);
        let jsonpCallback = obj.jsonpCallback;
        let call = window[jsonpCallback];
        if (call) {
            window[jsonpCallback] = function (v) {
                v.data = API.randomArray(GM.getValue("index-icon").fix, 1)[0];
                return call.call(v);
            };
        }
    });
})();
