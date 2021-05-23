// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      4.8.5
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
// @resource     av https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@2a72b764ac6ca85e626fba5ea5ac9a85fe5e7b50/src/av.html
// @resource     watchlater https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@2a72b764ac6ca85e626fba5ea5ac9a85fe5e7b50/src/watchlater.html
// @resource     bangumi https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/bangumi.html
// @resource     cinema https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/cinema.html
// @resource     playlist https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@2a72b764ac6ca85e626fba5ea5ac9a85fe5e7b50/src/playlist.html
// @resource     playlistdetail https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/playlistdetail.html
// @resource     index https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/index.html
// @resource     ranking https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@2a72b764ac6ca85e626fba5ea5ac9a85fe5e7b50/src/ranking.html
// @resource     css https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@0d6e3ca0d90aa4928519e7eabf7fa60a4fbd52ef/src/ui.css
// @resource     crc https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@261bc396b2c589368322269205aeaacdf5e3d092/src/crc.js
// @resource     md5 https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/md5.js
// @resource     iniState https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c6d7983fa9c946501253d5bd9d525ea6acfae014/src/initialstate.js
// @resource     ui https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@1f8b6abac7bc50c9617b269c5a8c6f2b7e746264/src/ui.js
// @resource     download https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@707561db56aac5b9b494d79693ebda4cb0265207/src/download.js
// @resource     define https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@f4dd3b9f7f25939cc7bcbb423ccc114bfb21d6f6/src/define.js
// @resource     rewrite https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@19406518604c3cb15a5d73711e6a509d3fd548e5/src/rewrite.js
// @resource     reset https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@8fefec8947ad9dfee0a502a18f504045bcf90265/src/reset.js
// @resource     xhrhook https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@6b5000402af1cf419a06e8305233c0fcf3802972/src/xhrhook.js
// @resource     config https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@1f8b6abac7bc50c9617b269c5a8c6f2b7e746264/src/config.json
// @resource     playlistjson https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/playlist.json
// @resource     sort https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/sort.json
// @resource     protobuf https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/protobuf.json
// @resource     icon https://www.bilibili.com/index/index-icon.json
// @resource     commandDm https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@1708f5b6644d67d88d0eed20a920ad5d5cfb98ee/src/commandDm.js
// @resource     commandDmStyle https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@261bc396b2c589368322269205aeaacdf5e3d092/src/commandDmStyle.css
// @resource     reply https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c3c457edc3a3e08bf100a77ee0e8d5045f58c9fd/src/comment.min.js
// @resource     closedCaption https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/closedCaption.js
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
    if (BLOD.path[5] == "rank") BLOD.addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
    if (window.self == window.top && BLOD.path[2] == 'www.bilibili.com') document.domain = "bilibili.com";
    // 修复导航栏消息样式
    if (location.href.includes("message.bilibili.com/pages/nav/index_new_sync")) BLOD.addCss(".im-root,.im-root .im-list-box * {font-size:12px;line-height:42px;}.im-root .im-list-box {width:100%;}.im-root .im-list-box .im-list {line-height:42px;height:42px;}.im-root .im-list-box .im-notify.im-number { height: 14px; line-height: 13px; border-radius: 10px; padding: 1px 3px; font-size: 12px; min-width: 20px; text-align: center; color: #fff;}.im-root .im-list-box .im-notify.im-number.im-center { top: 14px; left: 80px;}.im-root .im-list-box .im-notify.im-dot { top: 11px; right: -10px; width: 8px; height: 8px; border-radius: 100%;}.im-root .im-list-box .im-notify.im-dot.im-center { top: 16px; right: 20px;}");
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
        // 修复评论楼层&还原评论跳转链接
        if ((/l_id/.test(msg.target.id) || /reply-wrap/.test(msg.target.className))) {
            clearTimeout(BLOD.timer);
            BLOD.timer = setTimeout(() => {
                delete BLOD.timer;
                BLOD.reset.setReplyFloor.fix();
                BLOD.reset.renameCommentJump();
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
