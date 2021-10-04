/**
 * 本模块负责模块的维护工作
 */
(function () {
    try {
        class Module {
            /**
             * 设置项updateTime的副本，绘制设置界面时传递而来，可以用来及时更新设置内容  
             * 本设置项值的部分已自动绑定async属性，无需主动更新  
             * **本值可能undefined！如果没绘制设置的话，使用时务必检查真值情况**
             */
            setting: ItemCus;
            /**
             * 上一次检查更新时间戳  
             * 使用set访问器绑定了setting.custom，如果后者存在的话
             */
            static async: number;
            set async(v: number) {
                Module.async = v;
                this.setting && (this.setting.custom = <any>v);
            }
            get async() { return Module.async }
            /**
             * 当前时间戳
             */
            now = new Date().getTime();
            /**
             * 检查更新，禁止重复操作
             */
            updating: boolean;
            /**
             * 模块更新信息表
             */
            resource: { [name: string]: string } = {};
            /**
             * 模块对应resource键名，即文件名对应相对路径
             */
            moduleUrl: { [name: string]: string } = {};
            /**
             * 需要更新的模块表
             */
            updateList: string[] = [];
            /**
             * 当前模块存储
             */
            modules: { [name: string]: any } = {};
            /**
             * 是否弹出更新提示
             */
            toast: boolean;
            constructor() {
                this.async = GM.getValue<number>("updateAsync");
                !this.async && GM.setValue("updateAsync", this.async = this.now);
                this.checkAsync() && this.checkUpdate();
            }
            static async localModule(files: FileList) {
                if (files.length === 0) return;
                const data: { txt: File[], json: File[] } = { txt: [], json: [] };
                Array.from(files).forEach(d => {
                    /\.json$/.test(d.name) ? data.json.push(d) : data.txt.push(d);
                });
                (await Promise.all(data.json.reduce((s: Promise<string | ArrayBuffer>[], d) => {
                    s.push(this.readFile(d))
                    return s;
                }, []))).forEach((d, i) => {
                    try {
                        GM.setValue(data.json[i].name.replace(".json", ""), JSON.parse(<string>d));
                        toast.success(`成功本地安装模块 ${data.json[i].name}`);
                    } catch (e) { API.trace(e, "localModule") }
                });
                const module = GM.getValue("modules", {});
                (await Promise.all(data.txt.reduce((s: Promise<string | ArrayBuffer>[], d) => {
                    s.push(this.readFile(d))
                    return s;
                }, []))).forEach((d, i) => {
                    try {
                        Reflect.set(module, data.txt[i].name, d);
                        toast.success(`成功本地安装模块 ${data.txt[i].name}`);
                    } catch (e) { API.trace(e, "localModule") }
                });
                GM.setValue("modules", module);
            }
            static readFile(file: File) {
                return new Promise((resolve: (value: string) => void, reject) => {
                    if (!file) reject(toast.error('无效文件路径！'));
                    const reader = new FileReader();
                    reader.readAsText(file, 'utf-8');
                    reader.onload = () => {
                        resolve(<string>reader.result);
                    }
                    reader.onerror = () => {
                        reject(toast.error('读取文件出错，请重试！'));
                    }
                })
            }
            flesh(obj: ItemCus) {
                this.setting = obj;
            }
            buildTable() {
                this.updateList = [];
                const resource = GM.getValue<{ [name: string]: string }>("resource", {});
                this.modules = GM.getValue<{ [name: string]: any }>("modules", {});
                Object.keys(this.resource).forEach(d => {
                    const arr = d.split("/");
                    Reflect.set(this.moduleUrl, d, arr[arr.length - 1]);
                    Reflect.get(resource, d) != Reflect.get(this.resource, d) && this.updateList.push(d);
                })
                GM.getValue<string[]>("@resource", []).forEach(d => {
                    const arr = d.split("/");
                    Reflect.set(this.moduleUrl, d, arr[arr.length - 1]);
                    this.updateList.push(d);
                });
            }
            checkAsync() {
                let result: number = 0;
                switch (config.updateModule) {
                    case "一天": result = 864e5;
                        break;
                    case "三天": result = 2592e5;
                        break;
                    case "一周": result = 6048e5;
                        break;
                    case "一月": result = 2592e6;
                        break;
                }
                return result ? this.now - this.async >= result : false;
            }
            printfServer(file: string, hash: string = "master") {
                let server = "";
                switch (config.updateServer) {
                    case "Github": server = `https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/${hash}/${file}`;
                        break;
                    case "jsdelivr": server = `https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@${hash}/${file}`;
                        break;
                }
                file && /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w-,.\/?%&=]*)?/.test(file) && (server = file);
                return server;
            }
            async checkUpdate(...msg: string[]) {
                try {
                    if (this.updating) return;
                    GM.setValue("updateAsync", this.now);
                    this.updating = true;
                    this.toast = Boolean(msg[0]);
                    msg[0] && toast(...msg);
                    this.resource = await xhr({
                        url: this.printfServer("resource.json"),
                        responseType: "json"
                    });
                    this.buildTable();
                    await Promise.all(this.updateList.reduce((s: Promise<void>[], d) => {
                        s.push(this.download(d, Reflect.get(this.resource, d)));
                        return s;
                    }, []));
                    this.updating = false;
                    GM.setValue("modules", this.modules);
                    this.toast && toast.success("更新完成~");
                    xhr({
                        url: this.printfServer("meta.json"),
                        responseType: "json"
                    }).then(d => {
                        const v = d.version;
                        debug(`最新版本：${v}`);
                        if (v != API.Virsion) {
                            this.toast && toast.warning(`脚本本体也有更新！`, `当前版本：${API.Virsion}`, `最新版本：${v}`);
                            this.toast && API.alertMessage(`脚本本体有更新，是否立即更新到${v}版本？点击“确定”将立即跳转到脚本更新页面。</br>您也可以使用Tampermonkey自带的更新检查功能获取更新。`, undefined).then(d => {
                                d ? window.open(this.printfServer("main.user.js")) : toast("取消操作！", "更新功能交还给Tampermonkey")
                            })
                        }
                    })
                } catch (e) {
                    API.trace(e, "检查更新", this.toast);
                    this.toast && config.updateServer == "Github" && toast.warning("Github源可能链接不畅，推荐尝试使用jsdelivrCDN源！")
                    this.updating = false;
                }
            }
            async download(file: string, hash: string = "master") {
                let result = await xhr({ url: this.printfServer(file, hash) });
                file.endsWith(".json") ? GM.setValue(Reflect.get(this.moduleUrl, file).replace(".json", ""), JSON.parse(result)) : Reflect.set(this.modules, Reflect.get(this.moduleUrl, file), result);
                this.toast && toast.success(`更新模块 ${Reflect.get(this.moduleUrl, file)}`);
            }
            clear() {
                this.modules = GM.getValue<{ [name: string]: any }>("modules", {});
                const resource = GM.getValue<{ [name: string]: string }>("resource", {});
                const arr = Object.keys(resource);
                GM.getValue<string[]>("@resource", []).forEach(d => arr.push(d));
                GM.getValue<string[]>("thirdModule", []).forEach(d => arr.push(d));
                let i = 0;
                const name = arr.reduce((s: string[], d) => {
                    const arr = d.split("/");
                    s.push(arr[arr.length - 1]);
                    return s;
                }, []);
                Object.keys(this.modules).forEach(d => {
                    !name.includes(d) && (i++, delete this.modules[d], toast(`清理失效模块 ${d}`));
                })
                GM.setValue("modules", this.modules);
                i ? toast.success(`清理完成，共清理 ${i} 个失效模块！`) : toast("本地缓存很干净，未找到任何失效模块！")
            }
        }
        const module = new Module();
        class Third {
            third = GM.getValue<string[]>("thirdModule", []);
            body: HTMLDivElement;
            pause: boolean;
            modules: { [name: string]: any } = GM.getValue<{ [name: string]: any }>("modules", {});
            constructor() {
                const box = API.element.popupbox({ maxWidth: "360px", maxHeight: "300px" });
                API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, box, `<span>第三方组件管理<span>`);
                API.addElement("div", { style: 'margin-bottom: 10px;' }, box, `<div>第三方组件就是非正式的模块，相当于全局默认运行的模块。来源可能是还没正式发布的模块，也可能是第三方编写的模块，只能自行通过本界面添加和管理。</br><strong>来历不明的第三方组件可能存在安全风险，请确定掂量后操作！</strong></div>`);
                box.appendChild(API.element.hr());
                const title = API.addElement("div", { style: 'display: flex;grid-gap: 0;gap: 0;flex-shrink: 0;margin-bottom: 10px;flex-direction: row;align-items: center;justify-content: space-between;' }, box, `<div style="font-weight: bold;">已安装组件</div>`);
                const action = API.addElement("div", { style: "display: flex;align-items: center;" }, title);
                action.appendChild(API.element.input((v) => { this.url(v) }, undefined, { type: "url", placeholder: "第三方组件在线URL" }, /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w-,.\/?%&=]*)?\.js/));
                action.appendChild(API.element.file((v) => { this.file(v) }, true, "本地", [".js"]));
                this.body = <HTMLDivElement>API.addElement("div", { style: 'margin-inline: 10px;overflow: auto;' }, box);
                this.list();
            }
            async url(url: string) {
                if (this.pause) return;
                this.pause = true;
                const arr = url.split("/");
                const name = arr[arr.length - 1];
                const data = await xhr({ url: url });
                Reflect.set(this.modules, name, data);
                !this.third.includes(name) && this.third.push(name);
                GM.setValue("thirdModule", this.third);
                GM.getValue("modules", this.modules);
                toast.success(`成功第三方组件 ${name}`);
                this.body.innerHTML = "";
                this.list();
            }
            file(files: FileList) {
                Module.localModule(files);
                Array.from(files).forEach(d => {
                    !this.third.includes(d.name) && this.third.push(d.name)
                });
                GM.setValue("thirdModule", this.third);
                this.body.innerHTML = "";
                this.list();
            }
            list() {
                this.third.forEach((d, i) => {
                    const item = API.addElement("div", { style: 'display: flex;grid-gap: 0;gap: 0;flex-shrink: 0;margin-bottom: 10px;flex-direction: row;align-items: center;justify-content: space-between;' }, this.body, `<div>${d}</div>`);
                    const icon = API.element.svg(`<svg viewBox="0 0 48 48"><rect x="22.96" y="16" width="2" height="22"/><rect x="29.96" y="16" width="2" height="22"/><rect x="15.96" y="16" width="2" height="22"/><path d="M44,7H33V5a5,5,0,0,0-5-5H20a5,5,0,0,0-5,5V7H4V9H6.68V39a9,9,0,0,0,9,9H32.23a9,9,0,0,0,9-9V9H44ZM17,5a3,3,0,0,1,3-3h8a3,3,0,0,1,3,3V7H17ZM39.23,39a7,7,0,0,1-7,7H15.68a7,7,0,0,1-7-7V9H39.23Z"/></svg>`);
                    icon.onclick = () => {
                        this.third.splice(i, 1);
                        GM.setValue("thirdModule", this.third);
                        item.remove();
                        toast(`移除第三方组件 ${d}`)
                    }
                    item.appendChild(icon);
                })
            }
        }
        class Config {
            box: HTMLDivElement;
            constructor() {
                this.box = API.element.popupbox({ maxWidth: "360px", maxHeight: "300px" });
                API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, this.box, `<span>设置数据<span>`);
                API.addElement("div", { style: 'margin-bottom: 10px;' }, this.box, `<div>设置数据包含您个人对于设置的自定义调整，不包括内置的模块、安装的第三方模块以及各种功能缓存的数据。您可以选择恢复默认数据、导出为本地文件或者从本地文件中恢复。</div>`);
                this.box.appendChild(API.element.hr());
                const body = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;" }, this.box);
                body.appendChild(API.element.button(() => { this.restore() }, "默认", 0));
                body.appendChild(API.element.button(() => { this.output() }, "导出", 0));
                body.appendChild(API.element.file((v) => { this.input(v) }, false, "导入", [".json"]));
            }
            restore() {
                GM.deleteValue("config");
                toast.warning("已恢复默认数据，请及时刷新页面避免数据紊乱！")
                API.alertMessage(`已恢复默认数据，请及时<strong>刷新</strong>页面避免数据紊乱！`, "恢复默认设置").then(d => { d && location.reload() });
            }
            output() {
                API.saveAs(JSON.stringify(config, undefined, "\t"), `config ${API.timeFormat(undefined, true)}.json`, "application/json");
            }
            input(v: FileList) {
                v && v[0] && API.readAs(v[0]).then(d => {
                    const data: { [name: string]: any } = JSON.parse(d);
                    Object.keys(data).forEach(d => Reflect.has(config, d) && Reflect.set(config, d, data[d]));
                    toast.success("已导入本地设置数据，请刷新页面生效！")
                })
            }
        }

        API.registerSetting({
            key: "updateTime",
            sort: "module",
            label: "上次更新时间",
            type: "custom",
            custom: API.timeFormat(module.async, true),
            flesh: (obj) => module.flesh(obj)
        })
        API.registerSetting({
            key: "updateModule",
            sort: "module",
            label: "自动检查更新",
            sub: "不包含第三方组件",
            type: "row",
            value: "三天",
            list: ["一天", "三天", "一周", "一月", "永不"],
            float: '脚本会自动检查内部组件的更新，请选择一个合适的检查更新间隔。</br><strong>如非特别需求请不要禁用更新检查。</strong>'
        })
        API.registerSetting({
            key: "updateServer",
            sort: "module",
            label: "更新源",
            sub: "依据网络状况",
            type: "row",
            value: "jsdelivr",
            list: ["Github", "jsdelivr"],
            float: 'Github原生源同步及时，但一般很难访问。jsdelivrCDN可能有缓存延迟，但链接稳定。</br>jsdelivr源由于缓存可能会有一天左右时间的延迟，无法保证立即更新到最新版本。Github直连源没有延迟但国内大概难以访问。'
        })
        API.registerSetting({
            key: "updateNow",
            sort: "module",
            label: "主动检查",
            sub: "立即检查更新",
            type: "action",
            title: "立即",
            disabled: 0,
            action: () => { module.checkUpdate('正在检查更新~') }
        })
        API.registerSetting({
            key: "localModule",
            sort: "module",
            label: "安装本地模块",
            sub: 'js、css、json或html',
            type: 'file',
            title: '选择',
            accept: [".js", ".css", ".json", ".html"],
            multiple: true,
            float: '从本地磁盘安装脚本的模块文件（编码格式utf-8），包括js、css、json和html。</br>js/css文件将直接以文本形式保存，可通过使用`API.getMoudle`方法以文件+拓展名形式获取，json则以对象形式保存，可通过`GM.getValue`方法以无拓展名形式获取。</br>※ 本项目以文件名+拓展名索引模块，<strong>切勿添加同名模块！</strong>，以本地方式更新模块除外。</br>※ <strong>硬刷新页面后才会生效！</strong>',
            action: (files) => {
                Module.localModule(files);
            }
        })
        API.registerSetting({
            key: "thirdModule",
            sort: "module",
            label: "第三方组件",
            sub: "非正式模块",
            type: "action",
            title: "管理",
            float: '所谓第三方模块就是未能正式成为本脚本模块的模块，可能是还在测试的新功能。总之与内置的模块js文件没有任何区别。这种模块只能通过本选项安装，安装后默认全局运行。',
            action: () => new Third()
        })
        API.registerSetting({
            key: "removeDisabled",
            sort: "module",
            label: "清理失效模块",
            sub: "优化模块缓存",
            type: "action",
            title: "清理",
            float: '由于版本更新、本地安装等诸多原因，脚本可能缓存了一些过时、失效甚至错误的模块数据，可以使用本功能进行整理。</br>暂不支持清理json数据，强迫症可尝试恢复出厂值选项！</br>已安装的第三方组件不会被清除，大可放心！',
            action: () => module.clear()
        })
        API.registerSetting({
            key: "recoveryModule",
            sort: "module",
            label: "恢复出厂值设置",
            sub: "移除所有设置数据！",
            type: "action",
            title: "恢复",
            disabled: 0,
            action: () => {
                API.alertMessage("将移除所有模块，设置，插件等数据，恢复到全新安装脚本的状态！您确定？", "恢复出厂值设置").then(d => {
                    if (d) {
                        GM.listValues().forEach(d => GM.deleteValue(d));
                        toast.warning("已恢复出厂数据，刷新页面后请重新初始化！");
                    } else {
                        toast("取消操作");
                    }
                })
            }
        })
        API.registerSetting({
            key: "configManage",
            sort: "common",
            svg: '<svg viewBox="0 0 24 24"><g><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></g></svg>',
            label: "设置数据",
            sub: "备份/恢复",
            type: "action",
            title: "管理",
            action: () => new Config()
        })
    } catch (e) { API.trace(e, "manage.js") }
})();
declare namespace config {
    /**
     * 模块：检查更新
     * */
    let updateModule: string;
    /**
     * 模块：更新源
     */
    let updateServer: string;
}