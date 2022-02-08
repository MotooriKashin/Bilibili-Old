interface modules {
    /**
     * 移除旧版顶栏失效咨询数据
     */
    readonly "infoNewNumber.js": string;
}
API.jsonphook(['api.bilibili.com/x/web-interface/online'], function (xhr) {
    const obj = Format.urlObj(xhr.src);
    let callback = obj.callback;
    let call: any = window[callback];
    if (call) {
        (<any>window)[callback] = function (v: any) {
            v.data && (v.data.region_count[165] = v.data.region_count[202]);
            return call(v);
        }
    }
})
API.jsonphook(["api.bilibili.com/x/web-feed/feed/unread"], function (xhr) {
    xhr.src = xhr.src.replace("feed/unread", "article/unread");
})