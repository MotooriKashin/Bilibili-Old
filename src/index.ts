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
    const CONFIG: { [name: string]: number } = {};
    /**
     * 脚本配置数据代理，用于监听变化
     */
    const config: { [name: string]: number } = new Proxy(CONFIG, {
        set: (_target, p: string, value) => {
            CONFIG[p] = value;
            GM.setValue<{}>("config", CONFIG);
            return true;
        },
        get: (_target, p: string) => CONFIG[p]
    })
    class Xhr {
        /**
         * `XMLHttpRequest`的`Promise`封装
         * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
         * @returns `Promise`托管的请求结果或者报错信息
         */
        static xhr(details: xhrDetails): Promise<any> {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open(details.method || 'GET', details.url, details.hasOwnProperty("async") ? Boolean(details.async) : true);
                details.responseType && (xhr.responseType = details.responseType);
                details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
                details.credentials && (xhr.withCredentials = true);
                details.timeout && (xhr.timeout = details.timeout);
                xhr.onabort = details.onabort || ((ev) => reject(ev));
                xhr.onerror = details.onerror || ((ev) => reject(ev));
                details.onloadstart && (xhr.onloadstart = details.onloadstart);
                details.onprogress && (xhr.onprogress = details.onprogress);
                details.onreadystatechange && (xhr.onreadystatechange = details.onreadystatechange);
                xhr.ontimeout = details.ontimeout || ((ev) => reject(ev));
                xhr.onload = details.onload || (() => resolve(xhr.response));
                xhr.send(details.data);
            })
        }
        /**
         * `GM_xmlhttpRequest`的`Promise`封装，用于跨域`XMLHttpRequest`请求
         * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
         * @returns `Promise`托管的请求结果或者报错信息
         */
        static GM(details: GMxhrDetails): Promise<any> {
            return new Promise((resolve, reject) => {
                details.method = details.method || 'GET';
                details.onload = details.onload || ((xhr) => resolve(xhr.response));
                details.onerror = details.onerror || ((xhr) => reject(xhr.response));
                GM.xmlHttpRequest(details);
            })
        }
    }
    class Toast {
        /**
         * 配置数据
         */
        static config: { [name: string]: any };
        /**
         * 通知节点，初始化专用
         */
        static container: HTMLElement;
        /**
         * 通知样式
         */
        static style: HTMLElement;
        /**
         * 判定`body`是否存在
         */
        static check: boolean;
        /**
         * 通知节点，呈现时
         */
        static box: HTMLElement;
        /**
         * 未呈现通知计数
         */
        static count: number;
        /**
         * 动画呈现帧数
         */
        static sence: number;
        /**
         * 配置数据代理，用来监听修改
         */
        config: { [name: string]: any };
        constructor() {
            Toast.config = GM.getValue<{}>("toast", {});
            this.config = new Proxy(Toast.config, {
                set: (_target, p: string, value) => {
                    Toast.config[p] = value;
                    GM.setValue<{}>("toast", Toast.config);
                    return true;
                },
                get: (_target, p: string) => Toast.config[p]
            });
            Toast.count = 0;
            Toast.sence = 60;
            Toast.init();
        }
        static init() {
            this.container = document.createElement("div");
            this.style = document.createElement("link");
            this.container.setAttribute("id", "toast-container");
            this.container.setAttribute("class", "toast-top-right");
            this.style.setAttribute("rel", "stylesheet");
            this.style.setAttribute("id", "toastr-style");
            this.style.setAttribute("href", "https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css")
        }
        static show(type: "info" | "success" | "warning" | "error", ...msg: string[]) {
            if (!config.toast) return;
            if (!document.body) {
                if (this.check) return;
                return setTimeout(() => { this.check = true; this.show(type, ...msg) });
            }
            document.querySelector("#toastr-style") || document.head.appendChild(this.style);
            document.querySelector("#toast-container") || document.body.appendChild(this.container);
            this.box = document.querySelector("#toast-container") || this.container;
            let item = document.createElement("div");
            item.setAttribute("class", "toast toast-" + type);
            item.setAttribute("aria-live", "assertive");
            item.setAttribute("style", "visibility: hidden;position: absolute");
            setTimeout(() => {
                if (this.count > 0) this.count--;
                item = this.box.insertBefore(item, this.box.firstChild);
                item.appendChild(this.msg(...msg));
                this.come(item);
                setTimeout(() => this.quit(item), this.config.timeout * 1000);
            }, this.count * this.config.step);
            this.count++;
        }
        static come(item: HTMLDivElement, i: number = 0) {
            let height = item.clientHeight;
            item.setAttribute("style", "display: none;");
            let timer = setInterval(() => {
                i++;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === this.sence) {
                    clearInterval(timer);
                    item.removeAttribute("style");
                }
            })
        }
        static quit(item: HTMLDivElement, i: number = this.sence) {
            let height = item.clientHeight;
            let timer = setInterval(() => {
                i--;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === 0) {
                    clearInterval(timer);
                    item.remove();
                    if (!this.box.firstChild) this.box.remove();
                }
            })
        }
        static msg(...msg: string[]) {
            let div = document.createElement("div");
            div.setAttribute("class", "toast-message");
            div.innerHTML = msg.reduce((s: string, d, i) => {
                s = s + (i ? "<br />" : "") + String(d);
                return s;
            }, "");
            msg.forEach(d => {
                d = d || "";
                d = String(d);
                div.innerHTML = div.innerHTML ? div.innerHTML + "<br />" + d : div.innerHTML + d;
            });
            return div;
        }
    }
    class API {
        /**
         * 引入模块列表，用于查重
         */
        static modules: string[] = [];
        /**
         * 本地模块列表
         */
        static moduleList: string[] = [];
        /**
         * 页面`head`
         */
        static cssFlag: number;
        GM: {};
        Handler: string;
        Name: string;
        Virsion: string;
        xhr: xhr;
        toast: toast;
        constructor() {
            this.GM = GM;
            this.Handler = [GM.info.scriptHandler, GM.info.version].join(" ");
            this.Name = GM.info.script.name;
            this.Virsion = GM.info.script.version;
            this.xhr = (details: xhrDetails) => Xhr.xhr(details);
            this.xhr.GM = (details: GMxhrDetails) => Xhr.GM(details);
            this.toast = (...msg: string[]) => Toast.show("info", ...msg);
            this.toast.info = (...msg: string[]) => Toast.show("info", ...msg);
            this.toast.success = (...msg: string[]) => Toast.show("success", ...msg);
            this.toast.warning = (...msg: string[]) => Toast.show("warning", ...msg);
            this.toast.error = (...msg: string[]) => Toast.show("error", ...msg);

            API.moduleList = GM.info.script.resources.reduce((s: string[], d) => { s.push(d.name); return s }, []);
            !API.moduleList[0] && (API.moduleList = Object.keys(GM.getValue<{ [name: string]: any }>("module", {})));
            API.moduleList[0] ? API.initConfig() : this.updateModule();
        }
        /**
         * 获取模块
         * @param name 模块名字
         */
        static getModule(name: string) {
            return GM.getValue<ModuleValue>("module")[name] || GM.getResourceText(name);
        }
        /**
         * 脚本初始化
         */
        static initConfig() {
            let localConfig = GM.getValue<{ [name: string]: number }>('config', {});
            Object.entries(localConfig).forEach(d => config[d[0]] = d[1]);
            Object.entries<[number, string, string]>(this.getModule('config')).forEach(d => {
                config.hasOwnProperty(d[0]) || (config[d[0]] = d[1][0]);
            })
        }
        /**
         * 检查模块更新，用于初始化脚本的版本，将在加载基本模块后被覆盖
         */
        async updateModule() {
            if (GM.info.script.resources.reduce((s: string[], d) => { s.push(d.name); return s }, [])[0]) return;
            let resource = GM.getValue<{ [name: string]: any }>("resource", {});
            let host = "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old";
            GM.xmlHttpRequest({
                url: `${host}/resource.json`,
                responseType: "json",
                onload: d => {
                    Object.keys(d.response).forEach((b, i, a) => {
                        let obj: GMxhrDetails = {
                            url: "",
                            onload: d => {
                                localStorage
                                GM.setValue<{ module: any }>("module", d.response)
                                if (i === a.length - 1) {
                                    alert(`${this.Name}：脚本初始化成功`)
                                }
                            }
                        };
                        switch (b.split(".")[1]) {
                            case "js": obj.url = `${host}@${d.response[b]}/JavaScript/${b}`;
                                break;
                            case "json": obj.url = `${host}@${d.response[b]}/Json/${b}`;
                                obj.responseType = "json";
                                break;
                            case "html": obj.url = `${host}@${d.response[b]}/HTML/${b}`;
                                break;
                            case "css": obj.url = `${host}@${d.response[b]}/CSS/${b}`;
                                break;
                            default: obj.url = `${host}@${d.response[b]}/image/${b}`;
                                break;
                        }
                    })
                },
                onerror: d => alert(`${this.Name}：初始化脚本失败，请刷新后重试！`)
            })
        }
        /**
         * 导入模块
         * @param moduleName 模块名字
         * @param args 传递给模块的变量
         * @returns 模块返回值或者提示信息
         */
        importModule(moduleName?: string, args: { [key: string]: object } = {}) {
            return moduleName ? API.modules.includes(moduleName) ? true : (
                API.moduleList.includes(moduleName) ?
                    (API.modules.push(moduleName),
                        new Function("API", "GM", "config", "importModule", ...Object.keys(args), API.getModule(moduleName))
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
        addElement(div: string, attribute?: { [name: string]: string }, parrent?: HTMLElement, innerHTML?: string, top?: boolean, replaced?: HTMLElement) {
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
         * json化xhr返回值
         * @param data xhr返回的response
         * @returns 转化成`json`的xhr.response
         */
        jsonCheck(data: String | JSON) {
            let result: { [name: string]: unknown } = typeof data === "string" ? JSON.parse(data) : data;
            if ("code" in result && result.code !== 0) {
                let msg = result.msg || result.message || "";
                throw [result.code, msg];
            }
            return result;
        }
    }
    new API();
})();
