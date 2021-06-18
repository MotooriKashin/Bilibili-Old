// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      5.0.6
// @description  恢复Bilibili旧版页面，为了那些念旧的人。
// @author       MotooriKashin
// @homepage     https://github.com/MotooriKashin/Bilibili-Old/
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        *://*.bilibili.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT License
// @resource     icon https://www.bilibili.com/index/index-icon.json
// @resource     base64 https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js
// @resource     toast https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css
// @resource     protojs https://cdn.jsdelivr.net/npm/protobufjs@6.10.1/dist/protobuf.min.js
// @resource     iconLike https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/image/iconLike
// @resource     iconDislike https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/image/iconDislike
// @resource     news https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/image/news
// @resource     css https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/CSS/ui.css
// @resource     commandDmStyle https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/CSS/commandDmStyle.css
// @resource     av https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/av.html
// @resource     bangumi https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/bangumi.html
// @resource     watchlater https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/watchlater.html
// @resource     cinema https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/cinema.html
// @resource     index https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/index.html
// @resource     playlist https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/playlist.html
// @resource     playlistdetail https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/playlistdetail.html
// @resource     player https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/player.html
// @resource     ranking https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/ranking.html
// @resource     read https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/HTML/read.html
// @resource     config https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@f73d7ee4c67d503c38ad89839b1097ded1270079/Json/config.json
// @resource     sort https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/Json/sort.json
// @resource     protobuf https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/Json/protobuf.json
// @resource     playlistjson https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/Json/playlist.json
// @resource     units https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@01028efdb83d657e3cd7c5f1c73d54d04fcf5c37/JavaScript/units.js
// @resource     reset https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@b1555a5b8c6e627eef4925a7f5b416d7a8729f39/JavaScript/reset.js
// @resource     rewrite https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@f73d7ee4c67d503c38ad89839b1097ded1270079/JavaScript/rewrite.js
// @resource     initialstate https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@091a67c249380d37b7b9adf7e68158862819c62d/JavaScript/initialstate.js
// @resource     commandDm https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/commandDm.js
// @resource     reply https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/comment.js
// @resource     ui https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@7ca200ee859f1514d0d7db08ff8e434b2c71df40/JavaScript/ui.js
// @resource     xhrhook https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@7003d1bc296569a0a020066bdebf28bb4b1caba6/JavaScript/xhrhook.js
// @resource     closedCaption https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@463eb87aad3fc18d4b348fb773b169936711bff2/JavaScript/closedCaption.js
// @resource     crc https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/crc.js
// @resource     md5 https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/md5.js
// @resource     download https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/download.js
// ==/UserScript==

(function () {
    const normals = [], nodes = [], modules = [];
    const BLOD = unsafeWindow.BLOD = {
        GM: {
            xmlHttpRequest: GM_xmlhttpRequest,
            getResourceText: GM_getResourceText,
            getResourceURL: GM_getResourceURL,
            getValue: GM_getValue,
            setValue: GM_setValue,
            deleteValue: GM_deleteValue,
        },
        Handler: [GM.info.scriptHandler, GM.info.version].join(" "),
        Name: GM.info.script.name,
        Virsion: GM.info.script.version,
        modules: modules,
        ids: [],
        bloburl: []
    }
    /**
     * @class Main
     * @description 初始化，为BLOD添加基本方法
     */
    class Main {
        constructor() {
            BLOD.write = (html) => this.write(html);
            BLOD.importModule = (name) => this.importModule(name);
            BLOD.joinNode = (callback) => this.joinNode(callback);
            BLOD.joinNormal = (callback) => this.joinNormal(callback);
            BLOD.quitNode = (id) => this.quitNode(id);
        }
        /**
         * 重写页面
         * @param {string} html 页面文档字符串
         */
        write(html) {
            document.open();
            document.write(html);
            document.close();
        }
        /**
         * 载入模块，重复的模块自动忽略
         * @param {string} [name] 模块名称
         * @returns {void | []} 空参数调用时返回当前载入模块集合
         */
        importModule(name) {
            try {
                if (!name) return modules;
                if (modules.includes(name)) return;
                let module = GM_getResourceText(name);
                new Function(module)();
                modules.push(name);
                Boolean(module) ? BLOD.debug.info("载入模块", name) : BLOD.debug.warn("载入失败！未知模块", name);
            } catch (e) { BLOD.debug.error(`载入 ${name} 模块失败！`, e) }
        }
        /**
         * 添加DOM监听，用于在DOM变化时运行的代码
         * @param {function} callback DOM变动时的回调，会将event信息作为参数传递，其中event.target就是变动节点
         * @returns {number} 回调索引，可用于移除回调
         */
        joinNode(callback) {
            if (typeof callback === "function") nodes.push(callback);
            return nodes.length - 1;
        }
        /**
         * 添加正常回调，在所有页面运行的代码，包括重写过的页面
         * @param {*} callback 
         */
        joinNormal(callback) {
            if (typeof callback === "function") normals.push(callback);
        }
        /**
         * 移除DOM监听，使用joinNode返回值
         * @param {number} id 添DOM监听时joinNode的返回值
         */
        quitNode(id) {
            nodes.splice(id, 1);
        }
    }
    new Main();

    BLOD.importModule("units"); // 基础模块
    BLOD.importModule("xhrhook") // xhrhook
    BLOD.importModule("reset"); // 全局模块
    BLOD.importModule("rewrite"); // 重写模块
    BLOD.importModule("ui") // UI模块

    normals.forEach(d => d());
    document.addEventListener("DOMNodeInserted", (msg) => { nodes.forEach(d => d(msg)) });

})();