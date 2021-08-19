"use strict";
/**
 * 本模块是所有重写模块的引导模块
 * 通过判断URL地址按需加载对应的重写模块
 * */
(function () {
    API.importModule("register.js");
    API.importModule("dynamicTimeline.js");
    API.importModule("abv.js");
    API.importModule("open.js");
    API.importModule("jsonp.js");
    config.liveDm && API.importModule("webSocket.js");
    // av页
    if (config.av && /\/video\/[AaBb][Vv]/.test(location.href)) {
        // 重定向SEO页面
        if (/\/s\//.test(location.href))
            location.replace(location.href.replace("s/video", "video"));
        API.path.name = "av";
        API.importModule("av.js");
    }
})();
