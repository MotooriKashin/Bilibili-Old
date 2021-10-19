/**
 * 本模块负责引导个人空间相关的模块
 */
(function () {
    try {
        API.mid = (API.path[3] && API.path[3].split("?")[0]) || API.mid;
        config.errands && (API.mid == 11783021 || API.mid == 1988098633) && API.importModule("midInfo.js");
        config.album && API.importModule("album.js");
        config.jointime && API.importModule("jointime.js");
        config.lostVideo && API.importModule("lostVideo.js");
    } catch (e) { toast.error("space.js", e) }
})();
declare namespace API {
    /**
     * 空间主人的uid（而不是当前用户）
     */
    let mid: string | number;
}