/**
 * 本模块负责替换顶栏动图接口
 */
(function () {
    API.jsonphook(["api.bilibili.com/x/web-interface/index/icon"], function (xhr) {
        const obj = API.urlObj(xhr.url);
        let callback = obj.callback;
        let call = window[callback];
        if (call) {
            window[callback] = function (v) {
                v.data = API.randomArray(GM.getValue("index-icon").fix, 1)[0];
                return call(v);
            };
        }
    });
})();
