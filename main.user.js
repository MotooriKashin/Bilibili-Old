// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      5.0.0
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
// @license      MIT
// ==/UserScript==

(function () {
    GM.xmlHttpRequest = GM_xmlhttpRequest;
    GM.getResourceText = GM_getResourceText;
    GM.getResourceURL = GM_getResourceURL;
    GM.getValue = GM_getValue;
    GM.setValue = GM_setValue;
    GM.deleteValue = GM_deleteValue;
    /**
     * 脚本配置数据
     */
    const CONFIG = {};
    /**
     * 脚本配置数据代理，用于监听变化
     */
    const config = new Proxy(CONFIG, {
        set: (_target, p, value) => {
            CONFIG[p] = value;
            GM.setValue("config", CONFIG);
            return true;
        },
        get: (_target, p) => CONFIG[p]
    });
    class API {
        /**
         * 基础模块，依序载入
         */
        static baseModule = ["xhr.js", "toast.js"];
        /**
         * 引入模块列表，用于查重
         */
        static modules = [];
        /**
         * 本地模块列表
         */
        static moduleList = [];
        /**
         * 页面`head`
         */
        static cssFlag;
        GM = GM;
        Handler = [GM.info.scriptHandler, GM.info.version].join(" ");
        Name = GM.info.script.name;
        Virsion = GM.info.script.version;
        constructor() {
            API.moduleList = GM.info.script.resources.reduce((s, d) => { s.push(d.name); return s; }, []);
            API.moduleList[0] ? API.initConfig() : (API.moduleList = Object.keys(GM.getValue("module", {})), API.baseModule.every(v => API.moduleList.includes(v)) ? API.initConfig() : API.initModule());
            API.baseModule.forEach(d => this.importModule(d)); // 加载基础模块
        }
        /**
         * 获取模块
         * @param name 模块名字
         */
        static getModule(name) {
            return GM.getValue("module", {})[name] || GM.getResourceText(name);
        }
        /**
         * 脚本初始化
         */
        static initConfig() {
            let localConfig = GM.getValue('config', {});
            Object.entries(localConfig).forEach(d => config[d[0]] = d[1]);
            Object.entries(this.getModule('config')).forEach(d => {
                config.hasOwnProperty(d[0]) || (config[d[0]] = d[1][0]);
            });
        }
        /**
         * 初始化基础模块
         */
        static initModule() {
            let host = "https://cdn.jsdelivr.net/gh/MotooriKashin@ts/Bilibili-Old";
            let module = {};
            API.baseModule.forEach((d, i, o) => {
                let obj = {
                    url: "",
                    onload: data => {
                        module[d] = data.response;
                        if (i === o.length - 1) {
                            GM.setValue("module", data.response);
                            alert(`${GM.info.script.name}：脚本初始化成功`);
                        }
                    },
                    onerror: d => console.error(`${GM.info.script.name}：脚本${d}加载失败！`)
                };
                switch (d.split(".")[1]) {
                    case "js":
                        obj.url = `${host}/JavaScript/${d}`;
                        break;
                    case "json":
                        obj.url = `${host}/Json/${d}`;
                        obj.responseType = "json";
                        break;
                    case "html":
                        obj.url = `${host}/HTML/${d}`;
                        break;
                    case "css":
                        obj.url = `${host}/CSS/${d}`;
                        break;
                    default:
                        obj.url = `${host}/image/${d}`;
                        break;
                }
                GM.xmlHttpRequest(obj);
            });
        }
        /**
         * 导入模块
         * @param moduleName 模块名字
         * @param args 传递给模块的变量
         * @returns 模块返回值或者提示信息
         */
        importModule(moduleName, args = {}) {
            return moduleName ? API.modules.includes(moduleName) ? true : (API.moduleList.includes(moduleName) ?
                (API.modules.push(moduleName),
                    new Function("API", "GM", "config", "importModule", ...Object.keys(args), API.getModule(moduleName))(this, GM, config, this.importModule, ...Object.keys(args).reduce((s, d) => {
                        s.push(args[d]);
                        return s;
                    }, []))) : new Error(`未知模块：${moduleName}`)) : API.modules;
        }
        /**
         * 获取`cookies`信息
         * @returns `cookies`对象
         */
        getCookies() {
            return document.cookie.split('; ').reduce((s, d) => {
                let key = d.split('=')[0];
                let val = d.split('=')[1];
                s[key] = val;
                return s;
            }, {});
        }
        /**
         * 添加网页节点
         * @param div 节点名字
         * @param attribute 节点属性组成的对象
         * @param parrent 父节点
         * @param innerHTML 节点的`innerHTML`
         * @param top 是否在父节点置顶
         * @param replaced 被替换的节点，忽略父节点参数
         * @returns 所添加的节点
         */
        addElement(div, attribute, parrent, innerHTML, top, replaced) {
            let element = document.createElement(div);
            attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
            parrent = parrent || document.body;
            innerHTML && (element.innerHTML = innerHTML);
            return replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
        }
        /**
         * 移除或隐藏页面节点
         * @param name 检索名称
         * @param type 检索类型`class`、`id`还是`div`
         * @param hidden 隐藏而不移除
         * @param index 检索结果有复数个时的序号
         * @param callback 移除后的回调函数
         */
        removeElement(name, type, hidden = false, index = 0, callback) {
            let node;
            switch (type) {
                case "id":
                    node = document.querySelector("#" + name);
                    break;
                case "class":
                    name = name.replace(/ /g, ".");
                    node = document.querySelectorAll("." + name)[index];
                    break;
                case "tag":
                    node = document.querySelectorAll(name)[index];
                    break;
            }
            if (!node || node.getAttribute("hidden"))
                return;
            hidden ? node.setAttribute("hidden", "hidden") : node.remove();
            callback && callback();
        }
        /**
         * 添加CSS样式
         * @param text 样式
         * @param id 样子在页面中唯一ID，防止重复
         */
        addCss(text, id) {
            if (!document.head) {
                if (API.cssFlag)
                    return;
                return setTimeout(() => { API.cssFlag = 1; this.addCss(text, id); });
            }
            let style = document.createElement("style");
            if (id) {
                if (document.querySelector("#" + id))
                    return;
                style.setAttribute("id", id);
            }
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(text));
            if (document.head)
                document.head.appendChild(style);
        }
        /**
         * json化xhr返回值
         * @param data xhr返回的response
         * @returns 转化成`json`的xhr.response
         */
        jsonCheck(data) {
            let result = typeof data === "string" ? JSON.parse(data) : data;
            if ("code" in result && result.code !== 0) {
                let msg = result.msg || result.message || "";
                throw [result.code, msg];
            }
            return result;
        }
    }
    new API();
})();
