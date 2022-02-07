/**
 * console封装，模块中请使用`debug`实例
 */
class Debug {
    static log(...data: any[]) { console.log(`%c[${Format.timeFormat()}]`, "color: blue;", ...data) }
    static info(...data: any[]) { console.info(`%c[${Format.timeFormat()}]`, "color: green;", ...data) }
    static debug(...data: any[]) { console.debug(`[${Format.timeFormat()}]`, ...data) }
    static warn(...data: any[]) { console.warn(`[${Format.timeFormat()}]`, ...data) }
    static error(...data: any[]) { console.error(`[${Format.timeFormat()}]`, ...data); }
}
const debug: typeof Debug & typeof Debug["log"] = new Proxy(<any>Debug, { apply: (target, thisArg, argArray) => { target.log(...argArray) } });