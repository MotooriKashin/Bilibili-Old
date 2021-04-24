// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      4.7.5
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
// @resource     av https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/av.html
// @resource     watchlater https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/watchlater.html
// @resource     bangumi https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/bangumi.html
// @resource     cinema https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/cinema.html
// @resource     playlist https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/playlist.html
// @resource     playlistdetail https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/playlistdetail.html
// @resource     index https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/index.html
// @resource     ranking https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/ranking.html
// @resource     css https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@a368ab50a5a3d11edaa1c90d879acd74dade240c/src/ui.css
// @resource     crc https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/crc.js
// @resource     md5 https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/md5.js
// @resource     iniState https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c6d7983fa9c946501253d5bd9d525ea6acfae014/src/initialstate.js
// @resource     ui https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@0d1fef3b96f443024e4c31fd5735ac4db94f8ed0/src/ui.js
// @resource     download https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c6d7983fa9c946501253d5bd9d525ea6acfae014/src/download.js
// @resource     define https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c4906b1061705ab6e41f2eab15afe4c99aef7860/src/define.js
// @resource     rewrite https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@5766444fa6f7fad84fd4a98781b4e58b0254a165/src/rewrite.js
// @resource     reset https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@9f6e4f944416b65f7ef0a563a3c22017b2d03dc1/src/reset.js
// @resource     xhrhook https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@fc2b4b3e908ff834525121a85c3bda13686e7af5/src/xhrhook.js
// @resource     config https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@0d1fef3b96f443024e4c31fd5735ac4db94f8ed0/src/config.json
// @resource     playlistjson https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/playlist.json
// @resource     sort https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/sort.json
// @resource     protobuf https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/protobuf.json
// @resource     icon https://www.bilibili.com/index/index-icon.json
// @resource     commandDm https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@57a5abc79c5ce6282ac05a75fd601deb2abfa7fa/src/commandDm.js
// @resource     commandDmStyle https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@753cb563c1aa6536566572e3624371ff2885e2e2/src/commandDmStyle.css
// @resource     reply https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/comment.min.js
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
    // 获取默认设置
    const config = JSON.parse(GM_getResourceText("config"));
    // 暴露protobuf接口
    unsafeWindow.protobuf = window.protobuf;

    // 暴露顶层接口
    const BLOD = unsafeWindow.BLOD = {
        xmlhttpRequest: GM_xmlhttpRequest,
        setValue: GM_setValue,
        getValue: GM_getValue,
        getResourceText: GM_getResourceText,
        getResourceURL: GM_getResourceURL,
        deleteValue: GM_deleteValue,
        hash: [],
        ids: [],
        bloburl: {},
        module: [],
        title: document.title.includes("出错") ? null : document.title
    }
    // 获取模块列表
    const modules = {};
    GM_info.script.resources.forEach(d => { if (d.meta === "text/javascript") modules[d.name] = d.url; })
    /**
     * 导入模块
     * @param {string} [moduleName] 模块名字，由`@resource`源数据定义
     * @returns {void | {}} void 不传入参数时返回未载入模块列表对象
     */
    BLOD.importModule = (moduleName) => {
        try {
            if (!moduleName) {
                for (let key in modules) if (BLOD.module.includes(key)) delete modules[key];
                return modules;
            }
            if (BLOD.module.includes(moduleName)) return;
            let module = BLOD.getResourceText(moduleName);
            new Function(module)();
            BLOD.module.push(moduleName);
            if (!module) {
                if (BLOD.debug) BLOD.debug.warn("载入失败！未知模块", moduleName);
                else console.warn("载入失败！未知模块", moduleName);
            } else {
                if (BLOD.debug) BLOD.debug.info("载入模块", moduleName);
                else console.info("载入模块", moduleName);
            }
        } catch (e) {
            if (BLOD.toast) BLOD.toast.error(`载入 ${moduleName} 模块失败！`, e);
            else console.error(`载入 ${moduleName} 模块失败！`, e);
        }
    }
    // 导入全局模块，其他模块按需加载
    BLOD.importModule("define"); // 基础模块
    BLOD.importModule("reset"); // 修改模块
    BLOD.importModule("rewrite"); // 重写模块
    // 处理参数及BV号
    BLOD.reset.parameterTrim();
    // 页面分离
    if (BLOD.path[3]) {
        if (BLOD.path[3] == 'video' && (BLOD.path[4].toLowerCase().startsWith('av') || BLOD.path[4].toLowerCase().startsWith('bv'))) {
            BLOD.rewrite.av();
        }
        if (BLOD.path[3] == 'watchlater') {
            BLOD.rewrite.watchlater();
        }
        if (BLOD.path[3] == 'bangumi' && BLOD.path[4] == 'play') {
            BLOD.rewrite.bangumi();
        }
        if (BLOD.path[3] == 'blackboard' && BLOD.path[4]) {
            BLOD.rewrite.blackboard();
        }
        if (BLOD.path[3] == 'playlist' && BLOD.path[5].startsWith('pl')) {
            BLOD.rewrite.playlist();
        }
        if (BLOD.path[3] == 'medialist' && BLOD.path[4] == 'play') {
            BLOD.rewrite.medialist();
        }
        if (BLOD.path[3] == 'festival') {
            BLOD.rewrite.festival();
        }
        if (BLOD.path[3] == 's' && (BLOD.path[5].toLowerCase().startsWith('av') || BLOD.path[5].toLowerCase().startsWith('bv'))) {
            BLOD.rewrite.s();
        }
        if (BLOD.path[2] == 'space.bilibili.com') {
            BLOD.rewrite.space();
        }
        if (BLOD.path[2] == 'www.bilibili.com' && (BLOD.path[3].startsWith('\?') || BLOD.path[3].startsWith('\#') || BLOD.path[3].startsWith('index.'))) {
            BLOD.rewrite.index();
        }
        if (BLOD.path[3] == 'v' && BLOD.path[4] == "popular") {
            BLOD.rewrite.rank();
        }
        if (BLOD.path[2] == 'live.bilibili.com') {
            BLOD.path.name = "live";
            if (BLOD.config.reset.roomplay) BLOD.getVariable(window, "__NEPTUNE_IS_MY_WAIFU__", undefined, [undefined]);
            BLOD.reset.fuckp2p();
            BLOD.reset.disableLiveSleep();
        }
    } else {
        if (BLOD.path[2] == 'www.bilibili.com') {
            BLOD.rewrite.index();
        }
    }

    // 处理消息页面样式
    if (BLOD.path[2] == "message.bilibili.com") BLOD.addCss(".container[data-v-6969394c] { height: calc(100vh - 42px) !important;} .container[data-v-1c9150a9] { height: calc(100vh - 42px) !important;}");
    // 处理排行榜页面样式
    if (BLOD.path[5] == "rank") BLOD.addCss("@media screen and (min-width: 1654px){.main-inner {width: 1160px !important;}}");
    if (window.self == window.top && BLOD.path[2] == 'www.bilibili.com') document.domain = "bilibili.com";

    // 恢复评论翻页
    BLOD.replyList();
    // 写入全局样式
    BLOD.addCss(BLOD.getResourceText("css"));
    BLOD.importModule("ui");
    BLOD.importModule("xhrhook");
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
            if (!BLOD.download) BLOD.importModule("download");
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
