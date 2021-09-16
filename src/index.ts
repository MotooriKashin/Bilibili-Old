class API {
    /**
     * 本地模块列表
     */
    static modules: { [name: string]: any } = GM.getValue("modules", {});
    /**
     * 已运行的模块
     */
    static inModules: string[] = [];
    /**
     * 模块信息表，用于检查更新
     */
    static resource: { [name: string]: string } = GM.getValue("resource", {});
    /**
     * 模块更新标记，避免重复调用
     */
    static updating: boolean = false;
    static Virsion: string = GM.info.script.version;
    static API: Object;
    static Name: string = GM.info.script.name;
    /**
     * 函数模块关系对照表
     */
    static apply: { [name: string]: string } = GM.getValue("apply", {});
    GM = GM;
    config = config;
    Name = API.Name;
    Virsion: string = API.Virsion;
    Handler: string = [GM.info.scriptHandler, GM.info.version].join(" ");
    registerSetting = registerSetting;
    registerMenu = registerMenu;
    runWhile = API.runWhile;
    importModule = API.importModule;
    timeFormat = (time?: number, type?: boolean) => Format.timeFormat(time, type);
    sizeFormat = (size?: number) => Format.sizeFormat(size);
    unitFormat = (num?: number) => Format.unitFormat(num);
    bubbleSort = (arr: number[]) => Format.bubbleSort(arr);
    randomArray = (arr: any[], num: number) => Format.randomArray(arr, num);
    objUrl = (url: string, obj: { [name: string]: string }) => Format.objUrl(url, obj);
    urlObj = (url?: string) => Format.urlObj(url);
    trace = (e: Error, label: string = "", toastr: boolean = false) => { toastr ? toast.error(label, ...(Array.isArray(e) ? e : [e])) : Debug.error(label, ...(Array.isArray(e) ? e : [e])) }
    bofqiMessage(msg?: string | [string?, string?, string?], time = 3, callback?: () => void, replace = true) {
        let node = document.querySelector(".bilibili-player-video-toast-bottom");
        if (!node) {
            if (msg) {
                if (Array.isArray(msg)) return Debug.log(...msg);
                return Debug.log(msg)
            }
            return;
        }
        if (!msg) node.childNodes.forEach(d => d.remove());
        const root = document.querySelector(".bilibili-player-video-toast-item.bilibili-player-video-toast-pay") || document.createElement("div");
        root.setAttribute("class", "bilibili-player-video-toast-item bilibili-player-video-toast-pay");
        const ele = document.createElement("div");
        ele.setAttribute("class", "bilibili-player-video-toast-item-text");
        root.appendChild(ele);
        msg = Array.isArray(msg) ? msg : [msg];
        if (!msg[0]) return;
        replace && node.childNodes.forEach(d => d.remove());
        ele.innerHTML = <string>msg.reduce((s, d, i) => {
            if (d) {
                switch (i) {
                    case 0: s += `<span class="video-float-hint-text">${d}</span>`;
                        break;
                    case 1: s += `<span class="video-float-hint-btn hint-red">${d}</span>`;
                        break;
                    case 2: s += `<span class="video-float-hint-btn">${d}</span>`;
                        break;
                }
            }
            return s;
        }, '');
        node.appendChild(root);
        callback && (ele.style.cursor = "pointer") && (ele.onclick = () => callback());
        // @ts-ignore Tampermonkey提供
        (time !== 0) && unsafeWindow.setTimeout(() => {
            ele.remove();
            !root.children[0] && root.remove();
        }, time * 1000);
    }
    addElement(tag: keyof HTMLElementTagNameMap, attribute?: { [name: string]: string }, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element) {
        let element = document.createElement(tag);
        attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
        parrent = parrent || document.body;
        innerHTML && (element.innerHTML = innerHTML);
        replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
        return element;
    }
    async addCss(txt: string, id?: string, parrent?: Node) {
        if (!parrent && !document.head) {
            await new Promise(r => this.runWhile(() => document.body, r));
        }
        parrent = parrent || document.head;
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        id && !(<HTMLElement>parrent).querySelector(`#${id}`) && style.setAttribute("id", id);
        style.appendChild(document.createTextNode(txt));
        parrent.appendChild(style);
    }
    static runWhile(check: Function, callback: Function, delay: number = 100, stop: number = 180) {
        // @ts-ignore Tampermonkey提供
        let timer = unsafeWindow.setInterval(() => {
            if (check()) {
                // @ts-ignore Tampermonkey提供
                unsafeWindow.clearInterval(timer);
                callback();
            }
        }, delay);
        // @ts-ignore Tampermonkey提供
        stop && unsafeWindow.setTimeout(() => unsafeWindow.clearInterval(timer), stop * 1000)
    }
    async alert(text: string, title: string = API.Name) {
        return new Promise((r: (value: boolean) => void) => {
            const root = this.addElement("div")
            const div = root.attachShadow({ mode: "closed" });
            const table = this.addElement("div", { class: "table" }, div, `
            <div class="title">${title}</div>
            <div class="text">${text}</div>
            <div class="act">
                <div class="button">确认</div>
                <div class="button">取消</div>
                </div>
            `);
            this.addCss('.table {display: flex;flex-direction: column;box-sizing: border-box;top: 50%;background: #FFFFFF;box-shadow: 0 3px 12px 0 rgb(0 0 0 / 20%);border-radius: 10px;width: 300px;height: auto;padding: 18px;position: fixed;left: 50%;transform: translateX(-50%) translateY(-50%);z-index: 1024;}.title {line-height: 22px;margin-left: 2px;margin-bottom: 10px;font-size: 14px;}.text {margin-bottom: 3px;margin-left: 2px;}.act {line-height: 154%;align-items: center;border-radius: 4px;box-sizing: border-box;cursor: pointer;display: inline-flex;flex-shrink: 0;font-weight: 500;min-width: 5.14em;outline-width: 0;overflow: hidden;padding: 8px 16px;position: relative;user-select: none;border: none;color: #fff;justify-content: space-around;}.button, .action{line-height: 154%;align-items: center;border-radius: 4px;box-sizing: border-box;cursor: pointer;display: inline-flex;flex-shrink: 0;font-weight: 500;height: 32px;justify-content: center;min-width: 5.14em;outline-width: 0;overflow: hidden;padding: 8px 16px;position: relative;user-select: none;}.action {border: none;background-color: rgb(26,115,232);color: #fff;}.button {background-color: #fff;color: rgb(26,115,232);border: 1px solid rgba(0,0,0,6%);}.action:hover{background-color: rgb(72,115,232);}.button:hover{background-color: rgba(26,115,232,6%);}.action:active{box-shadow: 0 0 1px 1px rgba(72,115,232,80%);}.button:active{box-shadow: 0 0 1px 1px rgba(0,0,0,10%);}.button[disabled],.xaction[disabled]{pointer-events: none;background-color: rgba(19, 1, 1, 0.1);border: 1px solid rgba(0,0,0,.1);color: white;}', '', div);
            table.querySelectorAll(".button").forEach((d: HTMLElement, i) => {
                i ? (d.onclick = () => { root.remove(), r(false) }) : (d.onclick = () => (root.remove(), r(true)))
            })
        })
    }
    getModule(name: string) {
        return <string>Reflect.get(API.modules, name);
    }
    rewriteHTML(html: string) {
        // @ts-ignore unsafeWindow由TamperMonkey提供
        GM.getValue<string[]>("bug", []).forEach(d => { unsafeWindow[d] && Reflect.set(unsafeWindow, d, undefined) })
        document.open();
        document.write(html);
        document.close();
        // @ts-ignore Tampermonkey提供
        config.rewriteMethod == "异步" && this.importModule("vector.js"); // 重写后页面正常引导
    }
    static importModule(name?: string, args: { [key: string]: any } = {}, force: boolean = false) {
        if (!name) return Object.keys(API.modules);
        if (API.inModules.includes(name) && !force) return;
        if (Reflect.has(API.modules, name)) {
            API.inModules.push(name);
            new Function("API", "GM", "debug", "toast", "xhr", "config", "importModule", ...Object.keys(args), Reflect.get(API.modules, name))
                (API.API, GM, debug, toast, xhr, config, API.importModule, ...Object.keys(args).reduce((s: object[], d) => {
                    s.push(args[d]);
                    return s;
                }, []))
        } else {
            let modules = Reflect.ownKeys(API.resource).reduce((s: { [key: string]: string }, d: string) => {
                let str = d.split("/");
                Reflect.set(s, str[str.length - 1], d);
                return s;
            }, {});
            if (Reflect.has(modules, name)) {
                API.downloadModule(name, Reflect.get(modules, name)).then(d => toast.success(`模块${Reflect.get(modules, name)}安装成功！`, "您现在可以重试刚才的操作了~"))
                toast.warning(`正在添加模块${Reflect.get(modules, name)}！请稍候~`);
            } else {
                toast.error(`您正在尝试载入未知模块 ${name}！`, "但本地模块资料库并没有该模块记录，您可以到脚本设置里立即检查更新看看~")
            }
        }
    }
    static async firstInit() {
        await this.updateModule(`脚本首次运行初始化中~`, `感谢您使用 ${this.Name}！当前版本：${this.Virsion}`);
        toast.warning(`正在载入默认设置项~`);
        this.importModule("setting.js");
        Reflect.has(API.modules, "rewrite.js") && toast.success(`初始化成功，刷新页面即可生效~`);
    }
    static async updateModule(...msg: string[]) {
        try {
            if (this.updating) return;
            msg[0] && toast.warning(...msg);
            this.updating = true;
            let resource: { [key: string]: string } = await xhr.GM({
                url: 'https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@ts/resource.json',
                responseType: 'json'
            })
            let keys = Object.keys(resource);
            let list = keys.reduce((s: [string, string][], d) => {
                let str = d.split("/");
                Reflect.get(resource, d) != Reflect.get(this.resource, d) && s.push([str[str.length - 1], d]);
                return s;
            }, []);
            GM.setValue("resource", this.resource = resource);
            await Promise.all(list.reduce((s: Promise<void>[], d) => {
                s.push(this.downloadModule(d[0], d[1]));
                return s;
            }, []));
            await this.updateResource();
            this.updating = false;
            toast.success(`脚本及其模块已更新至最新版~`);
        } catch (e) { this.updating = false; toast.error(`检查更新出错！`, e) }
    }
    static async downloadModule(name: string, url?: string) {
        try {
            if (!url) {
                url = Object.keys(this.resource).find(d => d.includes(name));
            }
            let module = await xhr.GM({
                url: `https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@${Reflect.get(this.resource, url)}/${url}`
            })
            name.endsWith(".json") ? (
                GM.setValue(name.replace(".json", ""), JSON.parse(module))
            ) : Reflect.set(API.modules, name, module);
            GM.setValue("modules", API.modules);
        } catch (e) { toast.error(`更新模块${name}失败，请检查网络！`) }
    }
    static async updateResource() {
        const resource = GM.getValue<string[]>("@resource", []);
        const arr = await Promise.all(resource.reduce((s: Promise<any>[], d) => {
            s.push(xhr({ url: d }));
            return s;
        }, []))
        const name = resource.reduce((s: string[], d) => {
            const arr = d.split("/");
            d = arr[arr.length - 1];
            s.push(d);
            return s;
        }, []);
        arr.forEach((d, i) => {
            resource[i].endsWith(".json") ?
                GM.setValue(name[i].replace(".json", ""), JSON.parse(d)) :
                Reflect.set(API.modules, name[i], d);
        })
        GM.setValue("modules", API.modules);
    }
    static init() {
        this.importModule("rewrite.js");
        this.importModule("setting.js");
    }
    initUi() {
        // @ts-expect-error 由tampermonkey提供
        unsafeWindow.self === unsafeWindow.top && this.runWhile(() => document.body, () => {
            this.importModule("ui.js", { MENU, SETTING });
        });
        new Promise(r => delete this.initUi);
    }
    constructor() {
        API.API = new Proxy(this, {
            get: (target, p) => {
                // @ts-expect-error 由tampermonkey提供
                return Reflect.get(this, p) || Reflect.get(unsafeWindow, p) || (
                    Reflect.has(API.apply, p) ? (
                        this.importModule(Reflect.get(API.apply, p), {}, true),
                        Reflect.get(this, p)
                    ) : undefined);
            },
            set: (_target, p, value) => {
                // @ts-expect-error 由tampermonkey提供
                Reflect.has(unsafeWindow, p) ? Reflect.set(unsafeWindow, p, value) : Reflect.set(this, p, value);
                return true;
            }
        })
        Reflect.has(API.modules, "rewrite.js") ? API.init() : this.runWhile(() => document.body, () => this.alert(`即将下载脚本运行所需基本数据，请允许脚本访问网络权限！<strong>推荐选择“总是允许全部域名”</strong>`).then(d => { d && API.firstInit() }));
    }
}
new API();