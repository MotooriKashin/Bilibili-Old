interface modules {
    /**
     * 脚本实际入口，故取名仿效类C语言入口函数，下述内容适用于所有“模块”：  
     * 运行上下文回到了页面窗口。  
     * 访问高级API需通过`API`模块封装的API对象。
     */
    readonly "main.js": string;
    /**
     * 模块在API上以`export`关键词暴露的接口，当其他模块用到该接口时，
     * 脚本会检查该接口是否已经挂载并提前运行对应模块，即实现所谓的“按需加载”。  
     * 如果一个模块只是“库”一样的存在，为其他模块提供接口，我们称这样的模块为“按需加载”。  
     * 在编写这样一个模块时请复用API的命名空间声明，以`export`关键词声明所导出的接口，
     * 脚本将在编译过程中建立接口与所在模块的对应关系保存在本模块中，供脚本“按需加载”时检查。
     */
    readonly "apply.json": Record<string, keyof modules>;
    readonly "alert.css": string;
    readonly "button.css": string;
}
(function () {
    /**
     * UI设置项注册栈
     */
    const SETTING: any[] = [];
    /**
     * UI子菜单栈
     */
    const MENU: Record<string, any> = {};
    class Window {
        GM = GM;
        config = config;
        debug = debug;
        Format = Format;
        toast = toast;
        xhr = xhr;
        Name: string = GM.info.script.name;
        Virsion: string = GM.info.script.version;
        Handler: string = [GM.info.scriptHandler, GM.info.version].join(" ");
        uid = Number(this.getCookies().DedeUserID);
        static aids: Record<number, any> = {};
        path: any = location.href.split("/");
        constructor() {
            if (this.uid) {
                // 代理旧版退出登录页面
                if (location.href.includes("bilibili.com/login?act=exit")) this.loginExit(document.referrer);
                // 修复动态时间线
                let offset = this.getCookies()["bp_video_offset_" + this.uid];
                offset && this.setCookie("bp_t_offset_" + this.uid, offset);
            }
        }
        importModule(name?: keyof modules, args: Record<string, any> = {}) {
            if (!name) return Object.keys(modules).filter(p => typeof modules[p] === "string"); // 空调用返回所有可用模块
            if (typeof modules[name] === "string") { // 有效调用
                new Function("API", "GM", "config", "debug", "Format", "toast", "xhr", ...Object.keys(args), <string>modules[name])(API, GM, config, debug, Format, toast, xhr, ...Object.keys(args).reduce((s: object[], d) => {
                    s.push(args[d]);
                    return s;
                }, []));
            }
            else toast.warning(`模块${name}并不存在！是不是拼写错了？`) // 无效调用
        }
        getModule = (key: keyof modules) => modules[key];
        registerSetting(obj: SettingType[keyof SettingType]) {
            SETTING.push(obj);
            Window.modifyConfig(obj);
        }
        static modifyConfig(obj: any) {
            try {
                obj.value && !config[obj.key] && (config[obj.key] = obj.value);
                obj.type == "sort" && obj.list && obj.list.forEach((d: any) => { this.modifyConfig(d) });
            } catch (e) {
                debug.warn(`UI设置项注册错误！`, obj);
            }
        }
        registerMenu(obj: MenuType) {
            MENU[obj.key] = obj;
        }
        changeSettingMode(mode: Record<string, boolean>) {
            const keys = Object.keys(mode);
            SETTING.forEach(d => {
                d.key && keys.includes(d.key) && (d.hidden = mode[d.key]);
            })
        }
        getCookies() {
            return document.cookie.split('; ').reduce((s: { [name: string]: string }, d) => {
                let key = d.split('=')[0];
                let val = d.split('=')[1];
                s[key] = unescape(val);
                return s;
            }, {});
        }
        setCookie(name: string, value: string, days = 365) {
            const exp = new Date();
            exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString() + '; path=/; domain=.bilibili.com';
        }
        async loginExit(referer?: string) {
            if (!this.uid) return toast.warning("本就未登录，无法退出登录！");
            toast.warning("正在退出登录...");
            let data = this.jsonCheck(await this.xhr({
                url: "https://passport.bilibili.com/login/exit/v2",
                data: `biliCSRF=${this.getCookies().bili_jct}&gourl=${encodeURIComponent(location.href)}`,
                method: "POST",
                credentials: true
            }))
            if (data.status) {
                toast.success("退出登录！");
                if (referer) return location.replace(referer);
                setTimeout(() => location.reload(), 1000);
            }
        }
        jsonCheck(data: string | Record<string, any>) {
            let result: Record<string, any> = typeof data === "string" ? JSON.parse(data) : data;
            if ("code" in result && result.code !== 0) {
                let msg = result.msg || result.message || "";
                throw [result.code, msg];
            }
            return result;
        }
        biliQuickLogin() {
            (<any>window).biliQuickLogin ? (<any>window).biliQuickLogin() : this.loadScript("//static.hdslb.com/account/bili_quick_login.js", () => this.biliQuickLogin());
        }
        loadScript(src: string, onload?: () => void) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", () => {
                script.remove();
                onload();
            });
            document.body.appendChild(script);
        }
        getTotalTop(node: HTMLElement) {
            var sum = 0;
            do {
                sum += node.offsetTop;
                node = <HTMLElement>node.offsetParent;
            }
            while (node);
            return sum;
        }
        async saveAs(content: BufferSource | Blob | string, fileName: string, contentType: string = "text/plain") {
            const a = document.createElement("a");
            const file = new Blob([content], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.addEventListener("load", () => URL.revokeObjectURL(a.href));
            // document.body.appendChild(a);
            a.click();
        }
        readAs(file: File, type: "ArrayBuffer" | "DataURL" | "string" = "string", encoding?: string) {
            return new Promise((resolve: (value: ArrayBuffer | string) => void, reject) => {
                const reader = new FileReader();
                switch (type) {
                    case "ArrayBuffer": reader.readAsArrayBuffer(file);
                        break;
                    case "DataURL": reader.readAsDataURL(file);
                        break;
                    case "string": reader.readAsText(file, encoding || 'utf-8');
                        break;
                }
                reader.onload = () => resolve(reader.result);
                reader.onerror = e => reject(e);
            })
        }
        getUrlValue(name: string) {
            const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            const r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]); return null;
        }
        async getAidInfo(aid: number) {
            if (!Window.aids[aid]) {
                const data = await xhr({
                    url: `https://api.bilibili.com/x/web-interface/view/detail?aid=${aid}`,
                    responseType: "json",
                    credentials: true
                })
                Window.aids[aid] = data.data;
            }
            return Window.aids[aid];
        }
        strSize(str: string) {
            let size = 0;
            for (let i = 0; i < str.length; i++) {
                const code = str.charCodeAt(i);
                if (code <= 0x007f) size++;
                else if (code <= 0x07ff) size += 2;
                else if (code <= 0xffff) size += 3;
                else size += 4;
            }
            return size;
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
        addElement<T extends keyof HTMLElementTagNameMap>(tag: T, attribute?: Record<string, string>, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElementTagNameMap[T] {
            let element = document.createElement(tag);
            attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
            parrent = parrent || document.body;
            innerHTML && (element.innerHTML = innerHTML);
            replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
            return element;
        }
        runWhile(check: Function, callback: Function, delay: number = 100, stop: number = 180) {
            let timer = setInterval(() => {
                if (check()) {
                    clearInterval(timer);
                    callback();
                }
            }, delay);
            stop && setTimeout(() => clearInterval(timer), stop * 1000)
        }
        bofqiMessage(msg?: string | [string?, string?, string?], time = 3, callback?: () => void, replace = true) {
            let node = document.querySelector(".bilibili-player-video-toast-bottom");
            if (!node) {
                if (msg) {
                    if (Array.isArray(msg)) return debug.log(...msg);
                    return debug.log(msg)
                }
                return;
            }
            if (!msg) node.childNodes.forEach(d => d.remove());
            const table = document.querySelector(".bilibili-player-video-toast-item.bilibili-player-video-toast-pay") || document.createElement("div");
            table.setAttribute("class", "bilibili-player-video-toast-item bilibili-player-video-toast-pay");
            const ele = document.createElement("div");
            ele.setAttribute("class", "bilibili-player-video-toast-item-text");
            table.appendChild(ele);
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
            node.appendChild(table);
            callback && (ele.style.cursor = "pointer") && (ele.onclick = () => callback());
            (time !== 0) && setTimeout(() => {
                ele.remove();
                !table.children[0] && table.remove();
            }, time * 1000);
        }
        async alertMessage(text: string, title: string = this.Name) {
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
                this.addCss(this.getCss("alert.css", "button.css"), '', div);
                table.querySelectorAll(".button").forEach((d: HTMLElement, i) => {
                    i ? (d.onclick = () => { root.remove(), r(false) }) : (d.onclick = () => (root.remove(), r(true)))
                })
            })
        }
        getCss(...svg: (keyof modules)[]) {
            return svg.reduce((s, d) => {
                s += `\r\n${this.getModule(d)}`;
                return s;
            }, "")
        }
    }
    // 本变量需要提升
    var API = new Proxy(new Window(), {
        get: (t, p) => {
            if (window[p] && typeof window[p] !== "function") return window[p]; // 代理函数以外的全局变量，aid关键参数以本方式初始化
            if (t[p]) return t[p]; // 接口存在直接返回
            if (typeof p === "string" && modules["apply.json"][p]) { // 接口不存在访问“按需加载”关系表
                t.importModule(modules["apply.json"][p]);
                return t[p];
            }
            return undefined;
        },
        set: (t, p, v) => {
            if (window[p] && typeof window[p] !== "function") window[p] = v; // 同步函数以外的全局变量
            else t[p] = v; // 同步接口
            return true;
        }
    });
    API.importModule("vector.js"); // 进入引导模块
    window.top === window.self && API.runWhile(() => document.body, () => API.importModule("ui.js", { MENU, SETTING })); // 绘制设置UI
})();
/**
 * 自定义的模块顶层变量，最为`window`的替代以免污染全局环境。  
 * 模块暴露接口请通过本对象，并复用本命名空间声明以拓展类型声明。
 */
declare namespace API {
    /**
     * 脚本名称
     */
    const Name: string;
    /**
     * 脚本版本
     */
    const Virsion: string;
    /**
     * 脚本管理器名称及版本
     */
    const Handler: string;
    /**
     * 当前账户uid，用以判断是否登录
     */
    const uid: number;
    /**
     * 当前页面url切割，用于页面分离  
     * 其name属性存在说明页面经过重写
     */
    const path: string[] & {
        /**
         * 重写标记：用于判断页面是否(要)经过重写
         */
        name?: string
    };
    let aid: number;
    let cid: number;
    let tid: number;
    /**
     * 调用模块
     * @param name 模块名字，在modules接口中声明了可调用的模块。新编写的模块请复用modules接口声明以便开发者知道该模块存在。
     * @param args 传递给要调用模块的全局变量，以键值对形式传递，被调用模块可以用键名调用传递的键值。*这种变量在被调用模块中使用tslint会报错，请用`@ts-ignore`等注释告知编译器忽略她们。*
     * @returns 当且仅当参数`name`为假时才返回所有候选模块名，包括非脚本文件。
     */
    function importModule(name?: keyof modules, args?: Record<string, any>): (keyof modules)[];
    /**
     * 获取模块内容  
     * 这里的模块包括非脚本文件，其中json类型将直接格式化为对象。
     * @param key 模块名字，无需拓展名
     */
    function getModule(key: keyof modules): any;
    /**
     * 注册UI设置项
     * @param obj 设置项配置
     */
    function registerSetting(obj: SettingType[keyof SettingType]): void;
    /**
     * 注册UI菜单
     * @param obj 菜单配置
     */
    function registerMenu(obj: MenuType): void;
    /**
     * 临时调整设置项县隐状态，刷新设置界面后生效，刷新页面后失效。
     * @param mode 设置项名：是否隐藏（隐藏为true）
     */
    function changeSettingMode(mode: Record<string, boolean>): void;
    /**
     * 读取全部cookies，页面可能随时在写入cookies，所以请随用随取。  
     * *部分HTTPonly型cookie，在Beta版管理器中可考虑使用`GM.cookie`。*
     * @returns cookies键值对
     */
    function getCookies(): { [name: string]: string };
    /**
     * 添加/修改cookies  
     * *高级命令在Beta版管理器中可考虑使用`GM.cookie`。*
     * @param name cookie名称
     * @param value cookie值
     * @param days 保存时间，默认365天
     */
    function setCookie(name: string, value: string, days?: number): void;
    /**
     * 代理退出登录功能
     * @param referer 退出后跳转的页面URL
     */
    function loginExit(referer?: string): Promise<void>;
    /**
     * 检查B站json接口返回值并格式化为json  
     * 对于code异常将直接抛出错误！
     * @param data 返回值字符串或者json
     */
    function jsonCheck(data: string | Record<string, any>): Record<string, any>;
    /**
     * B站快捷登录
     */
    function biliQuickLogin(): void;
    /**
     * 计算节点绝对高度，相对于文档
     * @param node 文档垂直偏移：/px
     */
    function getTotalTop(node: HTMLElement): number;
    /**
     * 加载脚本链接后执行回调
     * @param src 脚本url
     * @param onload 要执行的回调函数
     */
    function loadScript(src: string, onload?: () => void): void;
    /**
     * 保存为本地文件
     * @param content 文档内容，JSON请先转化为字符串类型
     * @param fileName 保存为文件名，需包含拓展名
     * @param contentType 文档内容的MIME类型，默认为text/plain
     */
    function saveAs(content: BufferSource | Blob | string, fileName: string, contentType?: string): Promise<void>;
    /**
     * 读取本地文件
     * @param file 本地文件File，来自type="file"的input标签，`input.files`中的元素
     * @param type 将file以特定的格式编码，默认为string，即字符串形式
     * @param encoding 字符串的编码格式，默认为utf-8，仅在type="string"时有意义
     * @returns Promise托管的文件内容
     */
    function readAs(file: File): Promise<string>;
    function readAs(file: File, type: "DataURL"): Promise<string>;
    function readAs(file: File, type: "string", encoding?: string): Promise<string>;
    function readAs(file: File, type: "ArrayBuffer"): Promise<ArrayBuffer>;
    /**
     * 从url中提取指定参数
     * @param name 参数名
     * @returns 参数值，不存在返回null
     */
    function getUrlValue(name: string): string;
    /**
     * 获取aid的信息，无效aid除外
     * @param aid aid
     */
    function getAidInfo(aid: number): Promise<any>;
    /**
     * 求utf-8字符串字节数，一般用于求文件大小。
     * @param str utf-8字符串（js默认字符串格式）
     * @returns 字节数
     */
    function strSize(str: string): number;
    /**
     * 添加css样式
     * @param txt css文本
     * @param id 样式ID，用于唯一标记
     * @param parrent 添加到的父节点，默认为head
     */
    function addCss(txt: string, id?: string, parrent?: Node): Promise<void>;
    /**
     * 创建HTML节点
     * @param tag 节点名称
     * @param attribute 节点属性对象
     * @param parrent 添加到的父节点，默认为body
     * @param innerHTML 节点的innerHTML
     * @param top 是否在父节点中置顶
     * @param replaced 替换节点而不是添加，被替换的节点，将忽略父节点相关参数
     */
    function addElement<T extends keyof HTMLElementTagNameMap>(tag: T, attribute?: Record<string, string>, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElementTagNameMap[T];
    /**
     * 添加条件回调，条件为真时执行回调函数，用于检测函数运行时机  
     * @param check 一个返回布尔值的函数，用于轮询，当函数返回值为真时执行回调函数
     * @param callback 待执行的回调函数
     * @param delay 轮询间隔：/ms，默认100ms
     * @param stop 轮询最大延时：/ms，多长时间后终止轮询，不做无谓的等待，默认180ms，即3分钟。为0时永不终止直到为真。
     */
    function runWhile(check: Function, callback: Function, delay?: number, stop?: number): void;
    /**
     * 播放器通知，播放器不存在将转送到控制台
     * @param msg 消息字符串或三项数组，数组时顺序分别为普通、红色、黄色消息，可按位次置空取所需颜色。本值不存在将作为“屏显”使用。
     * @param time 消息时长：/s，默认为3，为0表示永久消息
     * @param callback 点击消息执行的回调函数
     * @param replace 替代已有消息，默认为真，即同时只显示一条消息
     */
    function bofqiMessage(msg?: string | [string?, string?, string?], time?: number, callback?: () => void, replace?: boolean): void;
    /**
     * 弹出提示框  
     * 仿造alert制作的提示框，但不具备中断页面的能力，异步返回用户点击的按钮布尔值
     * @param title 提示标题，默认为脚本名称
     * @param text 提示内容
     * @returns Promise代理的布尔值，取决于用户的点击的按钮
     */
    function alertMessage(text: string, title?: string): Promise<boolean>;
    /**
     * 获取并整合合内置Css模块
     * @param svg Css模块名序列
     * @returns 整合好的Css模块
     */
    function getCss(...svg: (keyof modules)[]): string;
}