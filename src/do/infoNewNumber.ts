interface modules {
    /** 移除旧版顶栏失效资讯数据 */
    readonly "infoNewNumber.js": string;
}
namespace API {
    jsonphook("bilibili.com/x/web-interface/online", undefined, obj => {
        obj.data && (obj.data.region_count[165] = obj.data.region_count[202]);
        return obj;
    }, false)
    scriptBlock(["/web-feed/", "unread?"]);
}