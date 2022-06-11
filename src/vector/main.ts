interface modules {
    /** 模块入口点 */
    readonly "main.js": string;
    /** 模块导出的接口索引表 *编译时自动生成* */
    readonly "apply.json": Record<string, keyof modules>;
}
{
    /** 模块顶层命名空间 */
    const API = new Proxy(new (class {
        /** 封装脚本管理器API的顶级对象 */
        GM = GM;
        /** 脚本名称 */
        Name: string = GM.info.script.name;
        /** 当前版本 */
        Virsion: string = GM.info.script.version;
        /** 脚本管理器及版本 */
        Handler: string = [GM.info.scriptHandler, GM.info.version].join(" ");
        /**
         * 加载模块
         * @param name 模块名称
         * @param args 需要传递的全局变量。格式：{变量名: 变量值} *需要忽略代码检查*
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
            } else return// (<typeof globalThis.API><unknown>this).toast.error(`模块${name}并不存在！`);
        }
        /**
         * 获取模块内容
         * @param key 模块名称
         * @returns 模块内容
         */
        getModule = <T extends keyof modules>(key: T): modules[T] => modules[key];
    })(), {
        get(t, p, r) {
            // 接口存在直接返回
            if (Reflect.has(t, p)) return Reflect.get(t, p, r);
            if (typeof p === "string" && p in <Record<string, string>>modules["apply.json"]) {
                // 接口未加载加载所在模块
                t.importModule(modules["apply.json"][p]);
                return Reflect.get(t, p, r);
            }
            return undefined;
        }
    });
    API.importModule("polyfill.js"); // polyfill
    API.importModule("vector.js"); // 引导模块
}
/** 
 * 模块顶层命名空间
 */
declare namespace API {
    /** 脚本名称 */
    const Name: string;
    /** 当前版本 */
    const Virsion: string;
    /** 脚本管理器及版本 */
    const Handler: string
    /**
     * 加载模块
     * @param name 模块名称
     * @param args 需要传递的全局变量。格式：{变量名: 变量值} *需要忽略代码检查*
     * @returns 空调用直接返回可选模块
     */
    function importModule(name?: keyof modules | undefined, args?: Record<string, any>): (keyof modules)[] | undefined;
    /**
     * 获取模块内容
     * @param key 模块名称
     * @returns 模块内容
     */
    function getModule<T extends keyof modules>(key: T): modules[T];
}