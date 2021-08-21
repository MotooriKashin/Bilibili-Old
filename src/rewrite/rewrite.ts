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
    // av页
    if (config.av && /\/video\/[AaBb][Vv]/.test(location.href)) API.importModule("av.js");
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
/**
 * 传递给__INITIAL_STATE__重构模块的原始数据  
 * **注意：此变量仅在__INITIAL_STATE__重构模块中可用！**
 */
declare const __INITIAL_STATE__: any;
/**
 * 传递给bangumi页__INITIAL_STATE__重构模块的回目数据
 * **注意：此变量仅在bangumi页的__INITIAL_STATE__重构模块中可用！**
 */
declare const epid: number;