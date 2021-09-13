/**
 * 本模块负责模块的维护工作
 */
(function () {
    class Module {
        constructor() {
            /**
             * 当前时间戳
             */
            this.now = new Date().getTime();
            /**
             * 模块更新信息表
             */
            this.resource = {};
            /**
             * 模块对应resource键名，即文件名对应相对路径
             */
            this.moduleUrl = {};
            /**
             * 需要更新的模块表
             */
            this.updateList = [];
            /**
             * 当前模块存储
             */
            this.modules = {};
            this.async = GM.getValue("updateAsync", this.now);
            this.checkAsync() && this.checkUpdate();
        }
        set async(v) {
            Module.async = v;
            this.setting && (this.setting.custom = v);
        }
        get async() { return Module.async; }
        static async localModule(files) {
            if (files.length === 0)
                return;
            const data = { txt: [], json: [] };
            Array.from(files).forEach(d => {
                /\.json$/.test(d.name) ? data.json.push(d) : data.txt.push(d);
            });
            (await Promise.all(data.json.reduce((s, d) => {
                s.push(this.readFile(d));
                return s;
            }, []))).forEach((d, i) => {
                try {
                    GM.setValue(data.json[i].name.replace(".json", ""), JSON.parse(d));
                    toast.success(`成功本地安装模块 ${data.json[i].name}`);
                }
                catch (e) {
                    API.trace(e, "localModule");
                }
            });
            const module = GM.getValue("modules", {});
            (await Promise.all(data.txt.reduce((s, d) => {
                s.push(this.readFile(d));
                return s;
            }, []))).forEach((d, i) => {
                try {
                    Reflect.set(module, data.txt[i].name, d);
                    toast.success(`成功本地安装模块 ${data.txt[i].name}`);
                }
                catch (e) {
                    API.trace(e, "localModule");
                }
            });
            GM.setValue("modules", module);
        }
        static readFile(file) {
            return new Promise((resolve, reject) => {
                if (!file)
                    reject(toast.error('无效文件路径！'));
                const reader = new FileReader();
                reader.readAsText(file, 'utf-8');
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(toast.error('读取文件出错，请重试！'));
                };
            });
        }
        flesh(obj) {
            this.setting = obj;
        }
        buildTable() {
            const resource = GM.getValue("resource", {});
            this.modules = GM.getValue("modules", {});
            Object.keys(this.resource).forEach(d => {
                const arr = d.split("/");
                Reflect.set(this.moduleUrl, d, arr[arr.length - 1]);
                Reflect.get(resource, d) != Reflect.get(this.resource, d) && this.updateList.push(d);
            });
            GM.getValue("@resource", []).forEach(d => this.updateList.push(d));
        }
        checkAsync() {
            let result = 0;
            switch (config.updateModule) {
                case "一天":
                    result = 864e5;
                    break;
                case "三天":
                    result = 2592e5;
                    break;
                case "一周":
                    result = 6048e5;
                    break;
                case "一月":
                    result = 2592e6;
                    break;
            }
            GM.setValue("updateAsync", this.now);
            return result ? this.now - this.async >= result : false;
        }
        printfServer(file, hash = "ts") {
            let server = "";
            switch (config.updateServer) {
                case "Github":
                    server = `https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/${hash}/${file}`;
                    break;
                case "jsdelivr":
                    server = `https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@${hash}/${file}`;
                    break;
            }
            file && /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(file) && (server = file);
            return server;
        }
        async checkUpdate(...msg) {
            try {
                if (this.updating)
                    return;
                this.updating = true;
                msg[0] && toast(...msg);
                this.resource = await xhr({
                    url: this.printfServer("resource.json"),
                    responseType: "json"
                });
                this.buildTable();
                await Promise.all(this.updateList.reduce((s, d) => {
                    s.push(this.download(d, Reflect.get(this.resource, d)));
                    return s;
                }, []));
                this.updating = false;
                msg && toast.success("更新完成~");
            }
            catch (e) {
                API.trace(e, "检查更新");
            }
        }
        async download(file, hash = "ts") {
            let result = await xhr({ url: this.printfServer(file, hash) });
            file.endsWith(".json") ? GM.setValue(Reflect.get(this.moduleUrl, file).replace(".json", ""), JSON.parse(result)) : Reflect.set(this.modules, Reflect.get(this.moduleUrl, file), result);
            GM.setValue("modules", this.modules);
        }
    }
    const module = new Module();
    API.registerSetting({
        key: "updateTime",
        sort: "module",
        label: "上次更新时间",
        type: "custom",
        custom: API.timeFormat(module.async, true),
        flesh: (obj) => module.flesh(obj)
    });
    API.registerSetting({
        key: "updateModule",
        sort: "module",
        label: "自动检查更新",
        sub: "不包含第三方组件",
        type: "row",
        value: "三天",
        list: ["一天", "三天", "一周", "一月", "永不"],
        float: '脚本会自动检查内部组件的更新，请选择一个合适的检查更新间隔。</br><strong>如非特别需求请不要禁用更新检查。</strong>'
    });
    API.registerSetting({
        key: "updateServer",
        sort: "module",
        label: "更新源",
        sub: "依据网络状况",
        type: "row",
        value: "jsdelivr",
        list: ["Github", "jsdelivr"],
        float: 'Github原生源同步及时，但一般很难访问。jsdelivrCDN可能有缓存延迟，但链接稳定。'
    });
    API.registerSetting({
        key: "updateNow",
        sort: "module",
        label: "主动检查",
        sub: "立即检查更新",
        type: "action",
        title: "立即",
        disabled: 0,
        action: () => { module.checkUpdate(); }
    });
    API.registerSetting({
        key: "localModule",
        sort: "module",
        label: "安装本地模块",
        sub: 'js、css或json',
        type: 'file',
        title: '选择',
        accept: [".js", ".css", ".json", ".html"],
        multiple: true,
        float: '从本地磁盘安装脚本的模块文件（编码格式utf-8），包括js、css和json。</br>js/css文件将直接以文本形式保存，可通过使用`API.getMoudle`方法以文件+拓展名形式获取，json则以对象形式保存，可通过`GM.getValue`方法以无拓展名形式获取。</br>※ 本项目以文件名+拓展名索引模块，<strong>切勿添加同名模块！</strong>，以本地方式更新模块除外。</br>※ <strong>硬刷新页面后才会生效！</strong>',
        action: (files) => {
            Module.localModule(files);
        }
    });
    API.registerSetting({
        key: "thirdModule",
        sort: "module",
        label: "安装第三方模块",
        sub: "js",
        type: "file",
        title: "选择",
        accept: [".js"],
        multiple: true,
        float: '所谓第三方模块就是未能正式成为本脚本模块的模块，可能是还在测试的新功能。总之与内置的模块js文件没有任何区别。这种模块只能通过本选项安装，安装后默认全局运行。',
        action: (files) => {
            Module.localModule(files);
            const third = GM.getValue("thirdModule", []);
            Array.from(files).forEach(d => {
                !third.includes(d.name) && third.push(d.name);
            });
            GM.setValue("thirdModule", third);
        }
    });
})();
