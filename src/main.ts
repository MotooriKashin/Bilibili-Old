interface modules {
    /** 主模块，提供模块命名空间`API`对象 */
    readonly "main.js": string;
    /** 模块中`export`导出的接口索引表，按需加载基础数据，编译过程中自动生成 */
    readonly "apply.json": Record<string, keyof modules>;
}
{
    const API = new Proxy(new (class {
        /** 封装脚本管理器API的顶级对象 */
        GM = GM;
        /** 脚本名称 */
        Name: string = GM.info.script.name;
        /** 当前版本 */
        Virsion: string = GM.info.script.version;
        /** 脚本管理器及版本 */
        Handler: string = [GM.info.scriptHandler, GM.info.version].join(" ");
        /** 当前URL解构的数组 */
        path = location.href.split("/");
        get aid() { return Reflect.get(window, "aid") }
        set aid(v) { Reflect.set(window, "aid", v) }
        get cid() { return Reflect.get(window, "cid") }
        set cid(v) { Reflect.set(window, "cid", v) }
        get __INITIAL_STATE__() { return Reflect.get(window, "__INITIAL_STATE__") }
        set __INITIAL_STATE__(v) { Reflect.set(window, "__INITIAL_STATE__", v) }
        /**
         * 加载模块
         * @param name 模块名称
         * @param args 需要传递的变量，该变量可以在该模块中像全局变量一样使用。格式：{变量名: 变量值}
         * @returns 空调用直接返回可选模块
         */
        importModule(name?: keyof modules, args: Record<string, any> = {}) {
            if (!name) {
                // 空调用直接返回可选模块
                return (<(keyof modules)[]>Object.keys(modules)).filter(p => typeof modules[p] === "string")
            } else if (typeof modules[name] === "string") {
                new Function("GM", "API", ...Object.keys(args), <string>modules[name])(GM, API, ...Object.keys(args).reduce((s: object[], d) => {
                    s.push(args[d]);
                    return s;
                }, []));
            } else return (<typeof globalThis.API><unknown>this).toast.error(`模块${name}并不存在！`);
        }
        /**
         * 获取模块内容
         * @param key 模块名称
         * @returns 模块内容
         */
        getModule = <T extends keyof modules>(key: T): modules[T] => modules[key];
    })(), {
        get: (t, p, r) => {
            // 接口存在直接返回
            if (Reflect.has(t, p)) return Reflect.get(t, p);
            if (typeof p === "string" && p in <Record<string, string>>modules["apply.json"]) {
                // 接口未加载加载所在模块
                t.importModule(modules["apply.json"][p]);
                return Reflect.get(t, p);
            }
            return undefined;
        }
    })
    API.importModule("vector.js"); // 引导模块
}
/** 
 * 模块顶层对象，相当于全局变量`window`一样的存在。
 * 模块中请以本对象为命名空间，所有属性及方法便可以像全局变量一样直接使用。
 * 模块如果需要提供属性及方法给其他模块使用，请在该变量或函数前添加`export`关键词——**“库”限定**。  
 * 实现实际功能的代码与声明函数等工具的代码请分开在不同的模块文件中，前者称为“功能模块”，后者称为“库”。
 * 本项目实现了“库”的按需加载，在使用“库”中定义的属性及接口前无需检查该“库”是否已加载。
 * “功能模块”则须要自行在适当的时机和位置使用`importModule`主动加载。  
 * **禁止在“功能模块”使用`export`关键词暴露任何东西**，以免按需加载时执行了不必要的功能！
 * 除非那个“功能模块”是基础模块，也就是必然已经加载过的模块。
 */
declare namespace API {
    /** 脚本名称 */
    const Name: string;
    /** 当前版本 */
    const Virsion: string;
    /** 脚本管理器及版本 */
    const Handler: string
    /** 当前URL解构的数组 */
    const path: string[] & {
        /** 重写标记*/
        name: string
    };
    /**
     * 加载模块
     * @param name 模块名称
     * @param args 需要传递的变量，该变量可以在该模块中像全局变量一样使用。格式：{变量名: 变量值}
     * @returns 空调用直接返回可选模块
     */
    function importModule(name?: keyof modules | undefined, args?: Record<string, any>): (keyof modules)[] | undefined;
    /**
     * 获取模块内容
     * @param key 模块名称
     * @returns 模块内容
     */
    function getModule<T extends keyof modules>(key: T): modules[T];
    let aid: number;
    let cid: number;
    let tid: number;
    let __INITIAL_STATE__: Record<string, any>;
}