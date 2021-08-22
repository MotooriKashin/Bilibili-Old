/**
 * 本模块是所有重写模块的引导模块  
 * 通过判断URL地址按需加载对应的重写模块
 * */
(function () {
    API.importModule("register.js")
    API.importModule("dynamicTimeline.js");
    API.importModule("abv.js");
    API.importModule("open.js");
    API.importModule("jsonp.js");
    config.protoDm && API.importModule("protoDm.js");
    config.liveDm && API.importModule("webSocket.js");
    config.logReport && API.importModule("sendBeacon.js");
    // 页面分离引导
    switch (true) {
        case (config.av && /\/video\/[AaBb][Vv]/.test(location.href)): API.importModule("av.js");
            break;
        case (config.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href)): API.importModule("bangumi.js");
            break;
        case (config.watchlater && /\/watchlater\//.test(location.href)): API.importModule("watchlater.js");
            break;
        case (config.player && /player\./.test(location.href)): API.importModule("player.js");
            break;
        case (/space\.bilibili\.com/.test(location.href)): API.importModule("space.js");
            break;
        case (config.index && API.path[2] == 'www.bilibili.com' && (!API.path[3] || (API.path[3].startsWith('\?') || API.path[3].startsWith('\#') || API.path[3].startsWith('index.')))): API.importModule("index.js");
            break;
    }
})();
declare namespace API {
    /**
     * URL转化成的字符串数组
     */
    let path: string[] & {
        /**
         * 重写标记：用于判断页面是否(要)经过重写
         */
        name?: string
    }
    /**
     * 视频 aid
     */
    let aid: string | number;
    /**
     * 视频 cid
     */
    let cid: string | number;
    /**
     * 视频 bvid
     */
    let bvid: string;
    /**
     * 用户 uid
     */
    let uid: string | number;
    /**
     * 视频分区编号
     */
    let tid: string | number;
}