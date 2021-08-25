"use strict";
/**
 * 本模块是所有重写模块的引导模块
 * 通过判断URL地址按需加载对应的重写模块
 * */
(function () {
    API.importModule("parameterTrim.js");
    API.importModule("dynamicTimeline.js");
    API.importModule("register.js");
    API.importModule("abv.js");
    API.importModule("open.js");
    API.importModule("jsonp.js");
    API.importModule("infoNewNumber.js");
    config.protoDm && API.importModule("protoDm.js");
    config.liveDm && API.importModule("webSocket.js");
    config.logReport && API.importModule("sendBeacon.js");
    // 页面分离引导
    if (config.av && /\/video\/[AaBb][Vv]/.test(location.href))
        API.importModule("av.js");
    if (config.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href))
        API.importModule("bangumi.js");
    if (config.watchlater && /\/watchlater\//.test(location.href))
        API.importModule("watchlater.js");
    if (config.player && /player\./.test(location.href))
        API.importModule("player.js");
    if (/space\.bilibili\.com/.test(location.href))
        API.importModule("space.js");
    if (config.index && API.path[2] == 'www.bilibili.com' && (!API.path[3] || (API.path[3].startsWith('\?') || API.path[3].startsWith('\#') || API.path[3].startsWith('index.'))))
        API.importModule("index.js");
    if (config.ranking && /\/v\/popular\//.test(location.href))
        API.importModule("ranking.js");
    if (/live\.bilibili\.com/.test(location.href))
        API.importModule("live.js");
    if (/\/medialist\/play\//.test(location.href))
        API.importModule("mediaList.js");
    if (API.path[2] == "message.bilibili.com")
        API.addCss(GM.getResourceText("message.css"));
    if (window.self == window.top && API.path[2] == 'www.bilibili.com')
        document.domain = "bilibili.com";
    if (location.href.includes("message.bilibili.com/pages/nav/index_new_sync"))
        API.addCss(GM.getResourceText("imroot.css"));
    if (location.href.includes("www.bilibili.com/account/history"))
        API.importModule("history.ts");
    if (/dmid/.test(location.href) && /dm_progress/.test(location.href))
        API.importModule("loadByDmid.js");
    if (config.read && /\/read\/[Cc][Vv]/.test(location.href))
        API.importModule("read.js");
    API.importModule("normal.js");
})();
