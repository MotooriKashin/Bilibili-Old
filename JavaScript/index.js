"use strict";
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
     * 用户配置数据
     * 模块添加的设置选项被用户自定义后将保存在此变量中，形式 key:value
     */
    const config = new Proxy(CONFIG, {
        set: (_target, p, value) => {
            CONFIG[p] = value;
            GM.setValue("config", CONFIG);
            return true;
        },
        get: (_target, p) => CONFIG[p]
    });
    /**
     * 初始化用户设置
     */
    Object.entries(GM.getValue("config", {})).forEach(k => config[k[0]] = k[1]);
    /**
     * 注册的设置内容
     */
    const setting = [];
    class API {
        /**
         * 已引入模块列表
         */
        static modules = {};
        /**
         * 核心模块
         */
        static codeModule = [];
        /**
         * 本地模块列表
         */
        static moduleList = [];
        /**
         * 页面`head`
         */
        static cssFlag;
        static nodelist = [];
        static switchlist = [];
        static normal = [];
        GM = GM;
        Handler = [GM.info.scriptHandler, GM.info.version].join(" ");
        Name = GM.info.script.name;
        Virsion = GM.info.script.version;
        config = config;
        settingMenu = {};
        constructor() {
            /**
             * 初始化shezhi
             */
            Object.entries(GM.getValue("config", {})).forEach(k => config[k[0]] = k[1]);
            /**
             * 模块分离
             */
            API.moduleList = GM.info.script.resources.reduce((s, d) => {
                d.url.includes("core") && API.codeModule.push(d.name);
                s.push(d.name);
                return s;
            }, []);
            /**
             * 载入UI模块，该模块含有不应暴露给其他模块的专属变量
             */
            this.importModule("ui.js", { setting });
            /**
             * 载入基础模块
             */
            API.codeModule.forEach(d => this.importModule(d));
            /**
             * 载入重写模块
             */
            this.importModule("rewrite.js");
            API.normal.forEach(d => d());
            /**
             * 执行节点监听
             */
            API.observerAddedNodes();
            /**
             * 添加切P回调
             */
            this.observerAddedNodes((msg) => API.switchVideo(msg));
        }
        /**
         * 导入模块
         * @param moduleName 模块名字
         * @param args 传递给模块的变量，以键值对形式，键名即模块中能接受到的变量名
         * @returns 提示信息
         */
        importModule(moduleName, args = {}) {
            return moduleName ? API.modules.hasOwnProperty(moduleName) ? API.modules[moduleName] : (API.moduleList.includes(moduleName) ?
                (API.modules[moduleName] =
                    new Function("API", "GM", "config", "importModule", ...Object.keys(args), GM.getResourceText(moduleName))(this, GM, config, this.importModule, ...Object.keys(args).reduce((s, d) => {
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
            replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
            return element;
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
         * 注册设置菜单，即设置面板左侧的菜单
         * 一个设置菜单名称只需注册一次
         * 但请不要在按需加载的模块中注册给其他模块用的菜单
         * @param obj 设置菜单内容
         */
        addMenu(obj) {
            this.settingMenu[obj.key] = obj;
        }
        /**
         * 注册设置到面板
         * @param obj 设置内容对象
         */
        addSetting(obj) {
            setting.push(obj);
            API.setting(obj);
        }
        /**
         * 重写页面框架
         * @param html 字符串形式的网页文本
         */
        rewriteHTML(html) {
            delete unsafeWindow.webpackJsonp;
            delete unsafeWindow._babelPolyfill;
            delete unsafeWindow.player;
            delete unsafeWindow.BPlayer;
            delete unsafeWindow.GrayManager;
            delete unsafeWindow.EmbedPlayer;
            delete unsafeWindow.PlayerAgent;
            delete unsafeWindow.dashjs;
            delete unsafeWindow.bPlayer;
            delete unsafeWindow.flvjs;
            delete unsafeWindow.BilibiliPlayer;
            document.open();
            document.write(html);
            document.close();
        }
        /**
         * 初始化默认设置
         * @param obj 设置内容
         */
        static setting(obj) {
            obj.hasOwnProperty("key") && obj.hasOwnProperty("value") && (config.hasOwnProperty(obj.key) ? (obj.value = config[obj.key]) : (config[obj.key] = obj.value));
            obj.type && obj.type == "sort" && obj.list.forEach((d) => this.setting(d));
        }
        /**
         * 注册节点添加监听
         * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
         * @param callback 添加节点后执行的回调函数
         * @returns 注册编号，用于使用`removeObserver`销毁监听
         */
        observerAddedNodes(callback) {
            if (typeof callback === "function")
                API.nodelist.push(callback);
            return API.nodelist.length - 1;
        }
        /**
         * 销毁`observerAddedNodes`监听
         * @param id 注册`observerAddedNodes`监听是返回的编号
         */
        removeObserver(id) {
            API.nodelist.splice(id, 1);
        }
        static observerAddedNodes() {
            (new MutationObserver(d => d.forEach(d => {
                d.addedNodes[0] && API.nodelist.forEach(async (f) => f(d.addedNodes[0]));
            }))).observe(document, { childList: true, subtree: true });
        }
        /**
         * 注册切P回调
         * @param callback 切P时的回调函数
         */
        switchVideo(callback) {
            if (typeof callback === "function")
                API.switchlist.push(callback);
        }
        static switchVideo(node) {
            if (/bilibili-player-video-btn-start/.test(node.className)) {
                this.switchlist.forEach(d => d());
            }
        }
        /**
         * 重写完页面后执行回调函数
         * 由于重写会覆盖页面，所以一些操作必须重写后再执行
         * @param callback 需要执行的回调函数
         */
        runAfterRewrite(callback) {
            if (typeof callback === "function")
                API.normal.push(callback);
        }
    }
    new API();
})();
