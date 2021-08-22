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
    const CONFIG: { [name: string]: any } = {};
    /**
     * 用户配置数据  
     * 模块添加的设置选项被用户自定义后将保存在此变量中，形式 key:value
     */
    const config: { [name: string]: any } = new Proxy(CONFIG, {
        set: (_target, p: string, value) => {
            CONFIG[p] = value;
            GM.setValue<{ [name: string]: any }>("config", CONFIG);
            return true;
        },
        get: (_target, p: string) => CONFIG[p]
    })
    /**
     * 初始化用户设置
     */
    Object.entries(GM.getValue<{ [name: string]: any }>("config", {})).forEach(k => config[k[0]] = k[1]);
    /**
     * 注册的设置内容  
     */
    const setting: (ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon)[] = [];
    class API {
        /**
         * 已引入模块列表
         */
        static modules: { [name: string]: any } = {};
        /**
         * 核心模块
         */
        static codeModule: string[] = [];
        /**
         * 本地模块列表
         */
        static moduleList: string[] = [];
        /**
         * 页面`head`
         */
        static cssFlag: number;
        static nodelist: any[] = [];
        static switchlist: any[] = [];
        static normal: any[] = [];
        GM = GM;
        Handler: string = [GM.info.scriptHandler, GM.info.version].join(" ");
        Name: string = GM.info.script.name;
        Virsion: string = GM.info.script.version;
        config: { [name: string]: any } = config;
        settingMenu: { [name: string]: Menuitem } = {};
        constructor() {
            /**
             * 初始化shezhi
             */
            Object.entries(GM.getValue("config", {})).forEach(k => config[k[0]] = k[1]);
            /**
             * 模块分离
             */
            API.moduleList = GM.info.script.resources.reduce((s: string[], d) => {
                d.url.includes("core") && API.codeModule.push(d.name);
                s.push(d.name);
                return s;
            }, [])
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
            this.observerAddedNodes((msg: HTMLElement) => API.switchVideo(msg))
        }
        /**
         * 导入模块
         * @param moduleName 模块名字
         * @param args 传递给模块的变量，以键值对形式，键名即模块中能接受到的变量名
         * @returns 提示信息
         */
        importModule(moduleName?: string, args: { [key: string]: any } = {}) {
            return moduleName ? API.modules.hasOwnProperty(moduleName) ? API.modules[moduleName] : (
                API.moduleList.includes(moduleName) ?
                    (API.modules[moduleName] =
                        new Function("API", "GM", "config", "importModule", ...Object.keys(args), GM.getResourceText(moduleName))
                            (this, GM, config, this.importModule, ...Object.keys(args).reduce((s: object[], d) => {
                                s.push(args[d]);
                                return s;
                            }, []))) : new Error(`未知模块：${moduleName}`)
            ) : API.modules;
        }
        /**
         * 获取`cookies`信息
         * @returns `cookies`对象
         */
        getCookies() {
            return document.cookie.split('; ').reduce((s: { [name: string]: string }, d) => {
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
        addElement(div: keyof HTMLElementTagNameMap, attribute?: { [name: string]: string }, parrent?: Element, innerHTML?: string, top?: boolean, replaced?: Element) {
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
        removeElement(name: string, type: 'class' | 'id' | 'tag', hidden: boolean = false, index: number = 0, callback?: () => void) {
            let node: HTMLElement | Element | null;
            switch (type) {
                case "id": node = document.querySelector("#" + name); break;
                case "class": name = name.replace(/ /g, "."); node = document.querySelectorAll("." + name)[index]; break;
                case "tag": node = document.querySelectorAll(name)[index]; break;
            }
            if (!node || node.getAttribute("hidden")) return;
            hidden ? node.setAttribute("hidden", "hidden") : node.remove();
            callback && callback();
        }
        /**
         * 添加CSS样式
         * @param text 样式
         * @param id 样子在页面中唯一ID，防止重复
         */
        addCss(text: string, id?: string) {
            if (!document.head) {
                if (API.cssFlag) return;
                return setTimeout(() => { API.cssFlag = 1; this.addCss(text, id) });
            }
            let style = document.createElement("style");
            if (id) {
                if (document.querySelector("#" + id)) return;
                style.setAttribute("id", id);
            }
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(text));
            if (document.head) document.head.appendChild(style);
        }
        /**
         * 注册设置菜单，即设置面板左侧的菜单  
         * 一个设置菜单名称只需注册一次  
         * 但请不要在按需加载的模块中注册给其他模块用的菜单
         * @param obj 设置菜单内容
         */
        addMenu(obj: Menuitem) {
            this.settingMenu[obj.key] = obj;
        }
        /**
         * 注册设置到面板
         * @param obj 设置内容对象
         */
        addSetting(obj: ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon) {
            setting.push(obj);
            API.setting(obj);
        }
        /**
         * 重写页面框架
         * @param html 字符串形式的网页文本
         */
        rewriteHTML(html: string) {
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
        static setting(obj: { [name: string]: any }) {
            obj.hasOwnProperty("key") && obj.hasOwnProperty("value") && (config.hasOwnProperty(obj.key) ? (obj.value = config[obj.key]) : (config[obj.key] = obj.value));
            obj.type && obj.type == "sort" && obj.list.forEach((d: { [name: string]: any }) => this.setting(d));
        }
        /**
         * 注册节点添加监听  
         * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
         * @param callback 添加节点后执行的回调函数
         * @returns 注册编号，用于使用`removeObserver`销毁监听
         */
        observerAddedNodes(callback: Function) {
            if (typeof callback === "function") API.nodelist.push(callback);
            return API.nodelist.length - 1;
        }
        /**
         * 销毁`observerAddedNodes`监听
         * @param id 注册`observerAddedNodes`监听是返回的编号
         */
        removeObserver(id: number) {
            API.nodelist.splice(id, 1);
        }
        static observerAddedNodes() {
            (new MutationObserver(d => d.forEach(d => {
                d.addedNodes[0] && API.nodelist.forEach(async f => f(d.addedNodes[0]))
            }))).observe(document, { childList: true, subtree: true });
        }
        /**
         * 注册切P回调
         * @param callback 切P时的回调函数
         */
        switchVideo(callback: Function) {
            if (typeof callback === "function") API.switchlist.push(callback);
        }
        static switchVideo(node: HTMLElement) {
            if (/bilibili-player-video-btn-start/.test(node.className)) {
                this.switchlist.forEach(d => d());
            }
        }
        /**
         * 重写完页面后执行回调函数  
         * 由于重写会覆盖页面，所以一些操作必须重写后再执行
         * @param callback 需要执行的回调函数
         */
        runAfterRewrite(callback: Function) {
            if (typeof callback === "function") API.normal.push(callback)
        }
    }
    new API();

})();
/**
 * Tampermonkey 提供的高级API的封装
 */
declare namespace GM {
    let xmlHttpRequest: typeof GM_xmlhttpRequest;
    let getResourceText: typeof GM_getResourceText;
    let getResourceURL: typeof GM_getResourceURL;
    let getValue: typeof GM_getValue;
    let setValue: typeof GM_setValue;
    let deleteValue: typeof GM_deleteValue;
    const info: {
        downloadMode: string;
        isFirstPartyIsolation: boolean;
        isIncognito: boolean;
        scriptHandler: string;
        scriptMetaStr: string;
        scriptSource: string;
        scriptUpdateURL: string;
        scriptWillUpdate: string;
        version: string;
        script: {
            antifeatures: {};
            author: string;
            blockers: [];
            copyright: string;
            description: string;
            description_i18n: {};
            evilness: number;
            excludes: [];
            grant: [];
            header: string;
            homepage: string;
            icon: string;
            icon64: string;
            includes: [];
            lastModified: number;
            matches: [];
            name: string;
            name_i18n: [];
            namespace: string;
            options: {
                check_for_updates: boolean;
                comment: string;
                compat_foreach: boolean;
                compat_metadata: boolean;
                compat_prototypes: boolean;
                compat_wrappedjsobject: boolean;
                compatopts_for_requires: boolean;
                noframes: boolean;
                override: {
                    merge_connects: boolean;
                    merge_excludes: boolean;
                    merge_includes: boolean;
                    merge_matches: boolean;
                    orig_connects: [];
                    orig_excludes: [];
                    orig_includes: [];
                    orig_matches: [];
                    orig_noframes: boolean;
                    orig_run_at: string;
                    use_blockers: [];
                    use_connects: [];
                    use_excludes: [];
                    use_includes: [];
                    use_matches: [];
                }
                run_at: string;
            }
            position: number;
            requires: [];
            resources: [{ [name: string]: string }];
            "run-at": string;
            supportURL: string;
            sync: { imported: string };
            unwrap: boolean;
            updateURL: string;
            uuid: string;
            version: string;
            webRequest: string;
        }
    }
}
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_xmlhttpRequest(details: GMxhrDetails): { abort: () => void };
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_getResourceText(name: string): string;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_getResourceURL(name: string): string;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_getValue<T>(name: string, defaultValue?: T): T;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_setValue<T>(name: string, value: T): void;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_deleteValue(name: string): void;
/**
 * 用于模块间交互数据的变量，可以直接在模块中使用  
 * 模块间以`API`属性的方式暴露任何其他模块需要的数据
 */
declare namespace API {
    /**
     * 已注册的设置菜单数据
     */
    let settingMenu: { [name: string]: Menuitem };
    /**
     * 脚本设置数据
     */
    let config: { [name: string]: any };
    /**
     * Tampermonkey 提供的高级API的封装
     */
    let GM: typeof globalThis.GM;
    /**
     * 脚本管理器信息
     */
    let Handler: string;
    /**
     * 脚本名称
     */
    let Name: string;
    /**
     * 脚本版本
     */
    let Virsion: string;
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
    function addElement(div: keyof HTMLElementTagNameMap, attribute?: { [name: string]: string }, parrent?: Element, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElement;
    /**
     * 导入模块
     * @param moduleName 模块名字
     * @param args 传递给模块的变量，以键值对形式，键名即模块中能接受到的变量名
     * @returns 提示信息
     */
    function importModule(moduleName?: string | undefined, args?: { [key: string]: any }): any;
    /**
     * 获取`cookies`信息
     * @returns `cookies`对象
     */
    function getCookies(): { [name: string]: string };
    /**
     * 移除或隐藏页面节点
     * @param name 检索名称
     * @param type 检索类型`class`、`id`还是`div`
     * @param hidden 隐藏而不移除
     * @param index 检索结果有复数个时的序号
     * @param callback 移除后的回调函数
     */
    function removeElement(name: string, type: 'class' | 'id' | 'tag', hidden?: boolean, index?: number, callback?: (() => void)): void;
    /**
     * 添加CSS样式
     * @param text 样式
     * @param id 样子在页面中唯一ID，防止重复
     */
    function addCss(text: string, id?: string): number | undefined;
    /**
     * 注册设置到面板
     * @param obj 设置内容对象
     */
    function addSetting(obj: ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon): void;
    /**
     * 注册设置菜单，即设置面板左侧的菜单  
     * 一个设置菜单名称只需注册一次  
     * 但请不要在按需加载的模块中注册给其他模块用的菜单
     * @param obj 设置菜单内容
     */
    function addMenu(obj: Menuitem): void;
    /**
     * 重写页面框架
     * @param html 字符串形式的网页文本
     */
    function rewriteHTML(html: string): void;
    /**
     * 注册节点添加监听  
     * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
     * @param callback 添加节点后执行的回调函数
     * @returns 注册编号，用于使用`removeObserver`销毁监听
     */
    function observerAddedNodes(callback: Function): number;
    /**
     * 销毁`observerAddedNodes`监听
     * @param id 注册`observerAddedNodes`监听是返回的编号
     */
    function removeObserver(id: number): void;
    /**
     * 注册切P回调
     * @param callback 切P时的回调函数
     */
    function switchVideo(callback: Function): void;
    /**
     * 重写完页面后执行回调函数
     * 由于重写会覆盖页面，所以一些操作必须重写后再执行
     * @param callback 需要执行的回调函数
     */
    function runAfterRewrite(callback: Function): void;
}
/**
 * **此顶层对象仅在`index.js`中可用，模块中直接使用`window`即可**
 */
declare const unsafeWindow: Window & {
    /**
     * `webpack`污染对象
     */
    webpackJsonp?: object;
    /**
     * `webpack`的Polyfill标记
     */
    _babelPolyfill?: boolean;
    /**
     * B站播放器
     */
    player?: object;
    /**
     * B站播放器
     */
    BPlayer?: object;
    /**
     * B站播放器控制台
     */
    GrayManager?: object;
    /**
     * B站播放器脚本初始化
     */
    EmbedPlayer?: object;
    /**
     * 新版B站播放器
     */
    PlayerAgent?: object;
    /**
     * B站播放器组件`dashjs`
     */
    dashjs?: object;
    /**
     * B站播放器
     */
    bPlayer?: object;
    /**
     * B站播放器组件`flvjs`
     */
    flvjs?: object;
    /**
     * B站播放器类
     */
    BilibiliPlayer?: object;
};
/**
 * 脚本设置数据
 */
declare namespace config { }
/**
 * 注册的设置内容  
 * **注意：该变量仅在`index.js`和`ui.js`中可用**
 */
declare const setting: (ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon)[]