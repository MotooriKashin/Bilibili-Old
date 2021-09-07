/**
 * 本模块负责替换顶栏动图接口
 */
(function () {
    API.jsonphook(["api.bilibili.com/x/web-interface/index/icon"], function (xhr) {
        let jsonpCallback: any = this.jsonpCallback;
        let call: any = window[jsonpCallback];
        let jsonp = this;
        if (call) {
            (<any>window)[jsonpCallback] = function (v: any) {
                v.data = API.randomArray(GM.getValue<{ [name: string]: any }>("icon").fix, 1)[0];
                return call.call(jsonp, v);
            }
        }
    })
})();