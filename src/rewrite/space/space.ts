/**
 * 本模块负责引导个人空间相关的模块
 */
(function () {
    API.mid = (API.path[3] && API.path[3].split("?")[0]) || API.mid;
    if (config.errands && API.mid == 11783021) API.importModule("11783021.js");
    if (config.album) API.importModule("album.js");
    if (config.jointime) API.importModule("jointime.js");
})();
declare namespace API {
    /**
     * 空间主人的uid（而不是当前用户）
     */
    let mid: string | number;
}