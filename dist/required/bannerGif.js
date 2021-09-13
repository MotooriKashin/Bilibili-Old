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
    API.jsonphook(["api.bilibili.com/x/web-show/res/locs", "ids=142"], function (xhr) {
        const obj = API.urlObj(xhr.url);
        let callback = obj.callback;
        let call = window[callback];
        if (call) {
            window[callback] = function (v) {
                v.data[142][0].pic = API.randomArray([
                    "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png",
                    "//i0.hdslb.com/bfs/archive/b60151347754f0089489d7d68271233960a8d52f.png"
                ], 1)[0];
                return call(v);
            };
        }
    });
})();
