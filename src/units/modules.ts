/**
 * 本模块是脚本模块主入口
 */
(function () {
    // @ts-expect-error 接收模块字符串
    const modules = MODULES;
    /**
     * 已载入模块
     */
    const modulesLoaded: Record<string, any> = [];
    /**
     * 初始化脚本设置数据
     */
    const CONFIG: Record<string, any> = {};
    const config: Record<string, any> = new Proxy(CONFIG, {
        set: (_target, p: string, value) => {
            CONFIG[p] = value;
            GM.setValue<{ [name: string]: any }>("config", CONFIG);
            return true;
        },
        get: (_target, p: string) => CONFIG[p]
    })
    const SETTING: any[] = [];
    const MENU: Record<string, any> = {};
    const shadow = new Proxy(API, {
        get: (t, p) => {
            return (Reflect.has(window, p) && typeof window[p] !== "function") ? Reflect.get(window, p) : (Reflect.get(t, p) || (
                Reflect.has(modules["apply.json"], p) ? (
                    importModule(modules["apply.json"][p], {}),
                    Reflect.get(t, p)
                ) : undefined));
        },
        set: (t, p, value) => {
            (Reflect.has(window, p) && typeof window[p] !== "function") ? Reflect.set(window, p, value) : Reflect.set(t, p, value);
            return true;
        }
    });
    /**
     * 载入模块
     * @param name 模块名字
     * @param args 传递给对方的全局变量：格式{变量名：变量值}
     * @param force 是否强制载入，一般模块只会载入一次，需要二次载入请将本值设为真
     */
    function importModule(name?: string, args: Record<string, any> = {}, force?: boolean) {
        if (!name) return Object.keys(modules);
        if (modulesLoaded.includes(name) && !force) return modulesLoaded;
        if (Reflect.has(modules, name)) {
            !modulesLoaded.includes(name) && modulesLoaded.push(name);
            new Function("API", "GM", "debug", "toast", "xhr", "config", "importModule", ...Object.keys(args), Reflect.get(modules, name))
                (shadow, GM, Reflect.get(shadow, "debug"), Reflect.get(shadow, "toast"), Reflect.get(shadow, "xhr"), config, importModule, ...Object.keys(args).reduce((s: object[], d) => {
                    s.push(args[d]);
                    return s;
                }, []))
        }
    }
    function modifyConfig(obj: any) {
        Reflect.has(obj, "value") && !Reflect.has(config, Reflect.get(obj, "key")) && Reflect.set(config, Reflect.get(obj, "key"), Reflect.get(obj, "value"));
        Reflect.get(obj, "type") == "sort" && Reflect.has(obj, "list") && Reflect.get(obj, "list").forEach((d: any) => modifyConfig(d));
    }
    Object.entries(GM.getValue<Record<string, any>>("config", {})).forEach(k => Reflect.set(config, k[0], k[1]));
    Reflect.set(shadow, "config", config);
    Reflect.set(shadow, "importModule", importModule);
    Reflect.set(shadow, "getModule", (name: string) => Reflect.get(modules, name));
    Reflect.set(shadow, "registerSetting", (obj: any) => { SETTING.push(obj); modifyConfig(obj); });
    Reflect.set(shadow, "registerMenu", (obj: any) => Reflect.set(MENU, Reflect.get(obj, "key"), obj));
    Reflect.set(shadow, "changeSettingMode", (mode: Record<string, boolean>) => {
        const keys = Object.keys(mode);
        SETTING.forEach(d => {
            Reflect.has(d, "key") && keys.includes(Reflect.get(d, "key")) && Reflect.set(d, "hidden", Reflect.get(mode, Reflect.get(d, "key")));
        })
    });
    Reflect.set(shadow, "drawUiInterface", () => {
        window.self === window.top && shadow.runWhile(() => document.body, () => {
            importModule("ui.js", { MENU, SETTING });
        });
        new Promise(r => Reflect.deleteProperty(shadow, "drawUiInterface"));
    });

    new Function("API", Reflect.get(modules, "debug.js"))(shadow);
    new Function("API", "debug", "config", Reflect.get(modules, "toast.js"))(shadow, Reflect.get(shadow, "debug"), config);
    new Function("API", "GM", Reflect.get(modules, "xhr.js"))(shadow, GM);

    importModule("rewrite.js");
})();