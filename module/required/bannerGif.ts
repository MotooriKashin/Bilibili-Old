/**
 * 本模块负责替换顶栏动图接口
 */
(function () {
    API.jsonphook(["api.bilibili.com/x/web-interface/index/icon"], function (xhr) {
        const obj = API.urlObj(xhr.url);
        let jsonpCallback: any = obj.jsonpCallback;
        let call: any = window[jsonpCallback];
        if (call) {
            (<any>window)[jsonpCallback] = function (v: any) {
                v.data = API.randomArray(GM.getValue<{ [name: string]: any }>("index-icon").fix, 1)[0];
                return call.call(v);
            }
        }
    })
})();