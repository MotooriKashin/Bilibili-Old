// ==UserScript==
// @name         Bilibili OLD
// @namespace    MotooriKashin
// @version      4.0.0
// @description  恢复原生的旧版页面，包括主页和播放页。
// @author       MotooriKashin, wly5556
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @match        *://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @resource     av https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/av.html
// @resource     watchlater https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/watchlater.html
// @resource     bangumi https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/bangumi.html
// @resource     cinema https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/cinema.html
// @resource     playlist https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/playlist.html
// @resource     playlistdetail https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/playlistdetail.html
// @resource     index https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/index.html
// @resource     rewrite https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/rewrite.js
// @resource     ui https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/ui.js
// @resource     css https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/ui.css
// @resource     define https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/define.js
// @resource     __INITIAL_STATE__ https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/__INITIAL_STATE__.js
// @resource     config https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/config.json
// @resource     playlistjson https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/dev/src/playlist.json
// @grant        GM.xmlHttpRequest
// @grant        GM.getResourceText
// @grant        GM.getResourceUrl
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @run-at       document-start
// @license      MIT License
// ==/UserScript==

const BLOD = {};
unsafeWindow.BLOD = BLOD;

// 初始化脚本配置
const config = JSON.parse(await GM.getResourceText("config"));
BLOD.defaultConfig = JSON.parse(JSON.stringify(config));
let localConfig = await GM.getValue("config");
let configSort = ["rewrite", "reset"];
for (let key in config) if (configSort.indexOf(key) < 0) delete config[key];
if (localConfig) {
    configSort.forEach(x => {
        for (let key in localConfig[x]) if (key in config[x]) config[x][key] = localConfig[x][key];
    })
} else {
    configSort.forEach(x => {
        for (let key in config[x]) config[x][key] = config[x][key][0];
    })
    GM.setValue("config", config);
}

// 暴露接口给其他模块
BLOD.config = config;
BLOD.xmlhttpRequest = GM.xmlHttpRequest;
BLOD.setValue = GM.setValue;
BLOD.getValue = GM.getValue;
BLOD.getResourceText = GM.getResourceText;
BLOD.getResourceUrl = GM.getResourceUrl;
BLOD.deleteValue = GM.deleteValue

// 载入自定义函数模块
await import(await GM.getResourceUrl("define"));
const debug = BLOD.debug;
BLOD.uid = BLOD.getCookies().DedeUserID;
if (BLOD.uid) {
    let offset = BLOD.getCookies()["bp_video_offset_" + BLOD.uid];
    if (offset) document.cookie = "bp_t_offset_" + BLOD.uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; BLOD.path=/";
}

// 载入重写页面模块
await import(await GM.getResourceUrl("rewrite"));
BLOD.path = document.location.href.split('/');
if (BLOD.path[3]) {
    if (BLOD.path[3] == 'video' && (BLOD.path[4].toLowerCase().startsWith('av') || BLOD.path[4].toLowerCase().startsWith('bv'))) await BLOD.rewrite.av();
    if (BLOD.path[3] == 'watchlater') await BLOD.rewrite.watchlater();
    if (BLOD.path[3] == 'bangumi' && BLOD.path[4] == 'play') await BLOD.rewrite.bangumi();
    if (BLOD.path[3] == 'blackboard' && BLOD.path[4]) await BLOD.rewrite.blackboard();
    if (BLOD.path[3] == 'playlist' && BLOD.path[5].startsWith('pl')) await BLOD.rewrite.playlist();
    if (BLOD.path[3] == 'medialist' && BLOD.path[4] == 'play') BLOD.path.name = "medialist";
    if (BLOD.path[3] == 's' && (BLOD.path[5].toLowerCase().startsWith('av') || BLOD.path[5].toLowerCase().startsWith('bv'))) await BLOD.rewrite.s();
    if (BLOD.path[2] == 'space.bilibili.com') BLOD.path.name = "space";
    if (BLOD.path[2] == 'www.bilibili.com' && (BLOD.path[3].startsWith('\?') || BLOD.path[3].startsWith('\#') || BLOD.path[3].startsWith('index.'))) await BLOD.rewrite.home();
    if (BLOD.path[3] == 'v' && BLOD.path[4] == "popular") BLOD.path.name = "rank";
} else {
    if (BLOD.path[2] == 'www.bilibili.com') BLOD.rewrite.home();
    if (BLOD.path[2] == 'live.bilibili.com') BLOD.path.name = "live";
}

// 全局页面统一处理
BLOD.addCss(await GM.getResourceText("css"));
await import(await GM.getResourceUrl("ui"));