/**
 * 本模块负责替换顶栏动图接口
 */
(function () {
    API.jsonphook(["api.bilibili.com/x/web-interface/index/icon"], function (xhr) {
        let jsonpCallback = this.jsonpCallback;
        let call = window[jsonpCallback];
        let jsonp = this;
        if (call) {
            window[jsonpCallback] = function (v) {
                v.data = API.randomArray(GM.getValue("index-icon").fix, 1)[0];
                return call.call(jsonp, v);
            };
        }
    });
})();
