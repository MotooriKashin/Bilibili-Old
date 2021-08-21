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
    config.protoDm && API.importModule("protoDm.js");
    config.liveDm && API.importModule("webSocket.js");
    config.logReport && API.importModule("sendBeacon.js");
    // av页
    if (config.av && /\/video\/[AaBb][Vv]/.test(location.href))
        API.importModule("av.js");
    // bangumi
    if (config.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href))
        API.importModule("bangumi.js");
})();
