interface modules {
    /** 个人空间相关 */
    readonly "space.js": string;
}
namespace API {
    mid = (path[3] && path[3].split("?")[0]) || mid;
    config.errands && (mid == 11783021 || mid == 1988098633 || mid == 2042149112) && importModule("midInfo.js");
    config.album && importModule("album.js"); // 相簿重定向
    config.jointime && importModule("jointime.js"); // 注册时间
    config.lostVideo && importModule("lostVideo.js"); // 失效视频
}
declare namespace API {
    /** 空间主人的uid（而不是当前用户） */
    let mid: string | number;
}