interface modules {
    /**
     * 调试库
     */
    readonly "debug.js": string;
}
namespace API {
    /**
     * console的封装  
     * debug.log的重定向，剩下的请访问对应属性。
     * @param data 要输出的内容
     */
    export const debug = function (...data: any[]) { console.log(`%c[${Format.timeFormat()}]`, "color: blue;", ...data) }
    debug.log = function (...data: any[]) { console.log(`%c[${Format.timeFormat()}]`, "color: blue;", ...data) }
    debug.info = function (...data: any[]) { console.info(`%c[${Format.timeFormat()}]`, "color: green;", ...data) }
    debug.debug = function (...data: any[]) { console.debug(`[${Format.timeFormat()}]`, ...data) }
    debug.warn = function (...data: any[]) { console.warn(`[${Format.timeFormat()}]`, ...data) }
    debug.error = function error(...data: any[]) { console.error(`[${Format.timeFormat()}]`, ...data); }
}