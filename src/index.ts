class API {
    static modules: { [name: string]: any } = GM.getValue("modules", {});
    static inModules: string[] = [];
    static resource: { [name: string]: string } = GM.getValue("resource", {});
    static toModules: string[] = [];
    static updating: boolean = false;
    static Virsion: string = GM.info.script.version;
    static API: Object;
    static Name: string = GM.info.script.name;
    static apply: { [name: string]: string } = GM.getValue("apply", {});
    Name = API.Name;
    Virsion: string = API.Virsion;
    Handler: string = [GM.info.scriptHandler, GM.info.version].join(" ");
    registerSetting = registerSetting;
    registerMenu = registerMenu;
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
        const ele = document.createElement("div");
        ele.setAttribute("class", "bilibili-player-video-toast-item-text");
        msg = Array.isArray(msg) ? msg : [msg];
        if (!msg[0]) return;
        replace && node.childNodes.forEach(d => d.remove());
        ele.innerHTML = <string>msg.reduce((s, d, i) => {
            if (d) {
                switch (i) {
                    case 0: s += `<span class="video-float-hint-text">${d}</span>`;
                        break;
                    case 1: s += `<span class="video-float-hint-btn hint-red;">${d}</span>`;
                        break;
                    case 2: s += `<span class="video-float-hint-btn">${d}</span>`;
                        break;
                }
            }
            return s;
        }, '');
        node.appendChild(ele);
        callback && (ele.style.cursor = "pointer") && (ele.onclick = () => callback());
        (time !== 0) && setTimeout(() => ele.remove(), time * 100);
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
            await new Promise(r => this.runWhile(document.body, r));
        }
        parrent = parrent || document.head;
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.appendChild(document.createTextNode(txt));
        parrent.appendChild(style);
    }
    runWhile(check: any, callback: Function, delay: number = 100, stop: number = 180) {
        let timer = setInterval(() => {
            if (check) {
                clearInterval(timer);
                callback();
            }
        }, delay);
        stop && setTimeout(() => clearInterval(timer), stop * 1000)
    }
    static importModule(name?: string, args: { [key: string]: any } = {}, force: boolean = false) {
        if (!name) return API.modules;
        if (API.inModules.includes(name) && !force) return;
        if (API.modules.includes(name)) {
            API.inModules.push(name);
            new Function("API", "GM", "debug", "toast", "xhr", "config", "importModule", ...Object.keys(args), GM.getResourceText(name))
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
                API.downloadModule(name, Reflect.get(modules, name));
                toast.warning(`正在添加模块${Reflect.get(modules, name)}！请稍候~`);
            } else {
                API.toModules.push(name);
                !API.updating && API.updateModule();
            }
        }
    }
    static async firstInit() {
        ["rewrite.js", "ui.js", "setting.js"].forEach(d => this.toModules.push(d));
        await this.updateModule(`脚本首次运行初始化中~`, `感谢您使用 ${this.Name}！当前版本：${this.Virsion}`);
        toast.warning(`正在载入默认设置项~`);
        this.importModule("setting.js");
        LOADING.forEach(d => this.downloadModule(d));
        Reflect.has(API.modules, "rewrite.js") && toast.success(`初始化成功，刷新页面即可生效~`);
    }
    static async updateModule(...msg: string[]) {
        try {
            msg[0] && toast.warning(...msg);
            this.updating = true;
            let resource: { [key: string]: string } = await xhr.GM({
                url: 'https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@ts/resource.json',
                responseType: 'json'
            })
            let keys = Object.keys(resource);
            let list = keys.reduce((s: [string, string][], d) => {
                let str = d.split("/");
                Reflect.get(resource, d) != Reflect.get(this.resource, d) && (
                    d.includes(".js") ?
                        API.modules.includes(str[str.length - 1]) && s.push([str[str.length - 1], d]) :
                        s.push([str[str.length - 1], d])
                );
                return s;
            }, []);
            GM.setValue("resource", this.resource = resource);
            this.toModules.forEach(d => {
                keys.find(b => b.includes(d)) && (list.push([d, keys.find(b => b.includes(d))]), toast.warning(`正在添加模块${d}！请稍候~`));
            })
            this.toModules = [];
            await Promise.all(list.reduce((s: Promise<void>[], d) => {
                s.push(this.downloadModule(d[0], d[1]));
                return s;
            }, []));
            this.updating = false;
            toast.success(`脚本及其模块已更新至最新版~`);
        } catch (e) { this.updating = false; toast.error(`检查更新出错！`, e) }
    }
    static async downloadModule(name: string, url?: string) {
        try {
            if (!url) {
                url = Object.keys(this.resource).find(d => d.includes("name"));
            }
            let temp = url.endsWith(".js") ? url.replace(".js", ".min.js") : url;
            let module = await xhr.GM({
                url: `https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@${Reflect.get(this.resource, name)}/${temp}`
            })
            name.endsWith(".json") ? (module = JSON.parse(module), GM.setValue(name.replace(".json", ""), module)) : GM.setValue("modulus", API.modules);
            this.modules.push(name);
        } catch (e) { toast.error(`更新模块${name}失败，请检查网络！`) }
    }
    constructor() {
        API.API = new Proxy(this, {
            get: (target, p) => {
                return Reflect.get(window, p) || Reflect.get(this, p) || (
                    Reflect.has(API.apply, p) ? (
                        this.importModule(Reflect.get(API.apply, p), {}, true),
                        Reflect.get(this, p)
                    ) : new Error(`对象API上不存在方法${String(p)}，请检查源代码！`));
            },
            set: (_target, p, value) => {
                !Reflect.has(window, p) && Reflect.set(this, p, value);
                return true;
            }
        })
        Reflect.has(API.modules, "rewrite.js") ? this.importModule("rewrite.js") : API.firstInit();
    }
}
new API();