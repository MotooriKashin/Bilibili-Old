// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      4.5.3
// @description  恢复Bilibili旧版页面，包括主页和播放页
// @author       MotooriKashin, wly5556
// @homepage     https://github.com/MotooriKashin/Bilibili-Old/
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @match        *://*.bilibili.com/*
// @connect      bilibili.com
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/protobufjs@6.10.1/dist/protobuf.min.js
// @icon         https://static.hdslb.com/images/favicon.ico
// @resource     base64 https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js
// @resource     toast https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css
// @resource     av https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@5ed92f5b1aee2dcfaabd858de0c6939059d32a7e/src/av.html
// @resource     watchlater https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@5ed92f5b1aee2dcfaabd858de0c6939059d32a7e/src/watchlater.html
// @resource     bangumi https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@5ed92f5b1aee2dcfaabd858de0c6939059d32a7e/src/bangumi.html
// @resource     cinema https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@5ed92f5b1aee2dcfaabd858de0c6939059d32a7e/src/cinema.html
// @resource     playlist https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/playlist.html
// @resource     playlistdetail https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@0d0103554eb230ce97920b3d978a2a8669dc9608/src/playlistdetail.html
// @resource     index https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@0d0103554eb230ce97920b3d978a2a8669dc9608/src/index.html
// @resource     ranking https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@0d0103554eb230ce97920b3d978a2a8669dc9608/src/ranking.html
// @resource     css https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@238e40a89b7bb3548031ba4290df13b88b62b31b/src/ui.css
// @resource     crc https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@39d49dec855e76fca6af28812a77afb71eb49069/src/crc.js
// @resource     md5 https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@39d49dec855e76fca6af28812a77afb71eb49069/src/md5.js
// @resource     iniState https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@7db1d486f06e92b7af9469991b87945ec51f5712/src/initialstate.js
// @resource     ui https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@def1a67c0f583f7bf41ae1eefe10e19964c24805/src/ui.js
// @resource     debug https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@7db1d486f06e92b7af9469991b87945ec51f5712/src/debug.js
// @resource     xhr https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@7db1d486f06e92b7af9469991b87945ec51f5712/src/xhr.js
// @resource     download https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@7db1d486f06e92b7af9469991b87945ec51f5712/src/download.js
// @resource     define https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@7db1d486f06e92b7af9469991b87945ec51f5712/src/define.js
// @resource     rewrite https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@136df39a3d9732d9be02f8c7e0d196ed25555d22/src/rewrite.js
// @resource     reset https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@7db1d486f06e92b7af9469991b87945ec51f5712/src/reset.js
// @resource     xhrhook https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@6a3a64a188af5e37ea5c29686988885f9da2f6e9/src/xhrhook.js
// @resource     config https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@452f84301549dc7ab62cd4b873bc185a897c8687/src/config.json
// @resource     playlistjson https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/playlist.json
// @resource     sort https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/sort.json
// @resource     search https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/search.json
// @resource     protobuf https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/protobuf.json
// @resource     icon https://www.bilibili.com/index/index-icon.json
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT License
// ==/UserScript==

(function () {
    'use strict';

    // 获取默认设置
    const config = JSON.parse(GM_getResourceText("config"));
    // 暴露protobuf接口
    unsafeWindow.protobuf = window.protobuf;

    let aid, cid, bvid;

    // 暴露顶层接口
    const BLOD = unsafeWindow.BLOD = {
        xmlhttpRequest: GM_xmlhttpRequest,
        setValue: GM_setValue,
        getValue: GM_getValue,
        getResourceText: GM_getResourceText,
        getResourceURL: GM_getResourceURL,
        deleteValue: GM_deleteValue,
        aid: aid,
        cid: cid,
        bvid: bvid,
        hash: [],
        ids: [],
        bloburl: {},
        title: document.title.includes("出错") ? null : document.title
    }
    // 导入全局模块，其他模块按需加载
    new Function(GM_getResourceText("define"))();
    new Function(GM_getResourceText("debug"))();
    new Function(GM_getResourceText("xhr"))();
    new Function(GM_getResourceText("iniState"))();
    const debug = BLOD.debug;
    const xhr = BLOD.xhr;

    // 修复退出登录功能
    if (location.href.includes("bilibili.com/login?act=exit")) {
        (async () => {
            let refer = document.referrer;
            await xhr.post("https://passport.bilibili.com/login/exit/v2", "biliCSRF=" + BLOD.getCookies().bili_jct + "&gourl=" + encodeURIComponent(location.href));
            location.href = refer;
        })();
    }
    // 初始化配置数据
    let localConfig = BLOD.getValue("config");
    let configSort = ["rewrite", "reset"];
    BLOD.defaultConfig = JSON.parse(JSON.stringify(config));
    for (let key in config) if (configSort.indexOf(key) < 0) delete config[key];
    if (localConfig) {
        configSort.forEach(x => {
            for (let key in localConfig[x]) if (key in config[x]) config[x][key] = localConfig[x][key];
            for (let key in config[x]) config[x][key] = Array.isArray(config[x][key]) ? config[x][key][0] : config[x][key];
        })
    } else {
        configSort.forEach(x => {
            for (let key in config[x]) config[x][key] = config[x][key][0];
        })
        BLOD.setValue("config", config);
    }
    BLOD.config = config;
    new Function(GM_getResourceText("reset"))();
    // 处理参数及BV号
    BLOD.reset.parameterTrim();
    BLOD.uid = BLOD.getCookies().DedeUserID;
    BLOD.path = document.location.href.split('/');
    // 捕获window属性
    BLOD.reset.getVariable();
    if (BLOD.uid) {
        let offset = BLOD.getCookies()["bp_video_offset_" + BLOD.uid];
        if (offset) document.cookie = "bp_t_offset_" + BLOD.uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; BLOD.path=/";
    }
    // 页面分离
    if (BLOD.path[3]) {
        if (BLOD.path[3] == 'video' && (BLOD.path[4].toLowerCase().startsWith('av') || BLOD.path[4].toLowerCase().startsWith('bv'))) {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.av();
        }
        if (BLOD.path[3] == 'watchlater') {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.watchlater();
        }
        if (BLOD.path[3] == 'bangumi' && BLOD.path[4] == 'play') {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.bangumi();
        }
        if (BLOD.path[3] == 'blackboard' && BLOD.path[4]) {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.blackboard();
        }
        if (BLOD.path[3] == 'playlist' && BLOD.path[5].startsWith('pl')) {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.playlist();
        }
        if (BLOD.path[3] == 'medialist' && BLOD.path[4] == 'play') {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.medialist();
        }
        if (BLOD.path[3] == 'festival') {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.festival();
        }
        if (BLOD.path[3] == 's' && (BLOD.path[5].toLowerCase().startsWith('av') || BLOD.path[5].toLowerCase().startsWith('bv'))) {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.s();
        }
        if (BLOD.path[2] == 'space.bilibili.com') {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.space();
        }
        if (BLOD.path[2] == 'www.bilibili.com' && (BLOD.path[3].startsWith('\?') || BLOD.path[3].startsWith('\#') || BLOD.path[3].startsWith('index.'))) {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.index();
        }
        if (BLOD.path[3] == 'v' && BLOD.path[4] == "popular") {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.rank();
        }
        if (BLOD.path[2] == 'live.bilibili.com') {
            BLOD.path.name = "live";
            BLOD.reset.fuckp2p();
            BLOD.reset.disableLiveSleep();
        }
    } else {
        if (BLOD.path[2] == 'www.bilibili.com') {
            if (!BLOD.rewrite) new Function(GM_getResourceText("rewrite"))();
            BLOD.rewrite.index();
        }
    }

    document.domain = "bilibili.com";
    // 写入全局样式
    BLOD.addCss(BLOD.getResourceText("css"));
    new Function(GM_getResourceText("ui"))();
    new Function(GM_getResourceText("xhrhook"))();
    window.addEventListener("load", () => { BLOD.load = true; BLOD.reset.parameterTrim(true); });
    document.addEventListener("DOMNodeInserted", (msg) => {
        // 去除预览提示框
        if (/bilibili-player-video-toast-pay/.test(msg.target.className)) BLOD.reset.removePreview(msg.target);
        // 版面替换
        BLOD.reset.resetSction();
        // 切p监听
        if (/bilibili-player-video-btn-start/.test(msg.target.className)) BLOD.reset.switchVideo();
        // 创建播放器右键下载菜单
        if (/bilibili-player-context-menu-container black/.test(msg.target.className)) {
            if (!BLOD.download) new Function(GM_getResourceText("download"))();
            BLOD.download.init(msg.target);
        }
        // 修复失效频道视频
        if (msg.relatedNode.getAttribute("class") == "row video-list clearfix") BLOD.reset.fixVideoLost.channel(BLOD.src);
        // 修复失效收藏视频
        if (msg.target.className == "small-item disabled") BLOD.reset.fixVideoLost.favlist(msg);
        // 刷新番剧分集数据
        if (msg.relatedNode.className == "info-sec-av") BLOD.reset.setBangumi.episodeData("", msg);
        // 失效分区转换
        if (msg.target.id == "bili_ad" || msg.target.className == "report-wrap-module elevator-module" || msg.target.id == "bili-header-m" || msg.target.className == "no-data loading") BLOD.reset.fixnews(msg.target);
        // 修复评论楼层&修复评论空降坐标
        if ((/l_id/.test(msg.target.id) || /reply-wrap/.test(msg.target.className))) {
            clearTimeout(BLOD.timer);
            BLOD.timer = setTimeout(() => {
                delete BLOD.timer;
                BLOD.reset.setReplyFloor.fix();
                BLOD.reset.fixVideoSeek(msg.target.parentNode);
            }, 100)
        }
        // 修复分区排行
        if (msg.target.id == "bili_movie" || msg.target.id == "bili_teleplay" || msg.target.id == "bili_documentary") BLOD.reset.fixrank(msg.target);
        // 弹幕哈希反查
        if (/danmaku-info-row/.test(msg.target.className)) BLOD.reset.danmkuHashId(msg.target);
        // 其他节点监听
        BLOD.reset.resetNodes();
        // 收藏页切p监听
        BLOD.reset.setMediaList.fixvar();
        // 修复空间主页失效视频
        BLOD.reset.fixVideoLost.home(msg);
        // bv号转超链接
        BLOD.reset.avdesc();
    });
})();
