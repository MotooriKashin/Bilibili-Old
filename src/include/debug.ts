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
    export const debug = function (...data: any[]) { setTimeout(console.log.bind(console, `%c[${Format.timeFormat()}]`, "color: blue;", ...data)) }
    debug.log = function (...data: any[]) { setTimeout(console.log.bind(console, `%c[${Format.timeFormat()}]`, "color: blue;", ...data)) }
    debug.info = function (...data: any[]) { setTimeout(console.info.bind(console, `%c[${Format.timeFormat()}]`, "color: green;", ...data)) }
    debug.debug = function (...data: any[]) { setTimeout(console.debug.bind(console, `[${Format.timeFormat()}]`, ...data)) }
    debug.warn = function (...data: any[]) { setTimeout(console.warn.bind(console, `[${Format.timeFormat()}]`, ...data)) }
    debug.error = function error(...data: any[]) { setTimeout(console.error.bind(console, `[${Format.timeFormat()}]`, ...data)) }
}