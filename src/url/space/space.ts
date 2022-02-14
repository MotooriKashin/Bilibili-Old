interface modules {
    /**
     * 个人空间相关
     */
    readonly "space.js": string;
}
{
    API.mid = (API.path[3] && API.path[3].split("?")[0]) || API.mid;
    config.errands && (API.mid == 11783021 || API.mid == 1988098633 || API.mid == 2042149112) && API.importModule("midInfo.js");
    config.album && API.importModule("album.js"); // 相簿重定向
    config.jointime && API.importModule("jointime.js"); // 注册时间
    config.lostVideo && API.importModule("lostVideo.js"); // 失效视频
}
declare namespace API {
    /**
     * 空间主人的uid（而不是当前用户）
     */
    let mid: string | number;
}