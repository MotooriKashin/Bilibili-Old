interface modules {
    /**
     * 移除旧版顶栏失效咨询数据
     */
    readonly "infoNewNumber.js": string;
}
API.jsonphook("api.bilibili.com/x/web-interface/online", undefined, obj => {
    obj.data && (obj.data.region_count[165] = obj.data.region_count[202]);
    return obj;
}, false)
API.scriptBlock(["/web-feed/", "unread?"]);