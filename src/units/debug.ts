(function () {
    class Debug {
        static log(...data: any[]) { console.log(`%c[${API.timeFormat()}]`, "color: blue;", ...data) }
        static info(...data: any[]) { console.info(`%c[${API.timeFormat()}]`, "color: green;", ...data) }
        static debug(...data: any[]) { console.debug(`[${API.timeFormat()}]`, ...data) }
        static warn(...data: any[]) { console.warn(`[${API.timeFormat()}]`, ...data) }
        static error(...data: any[]) { console.error(`[${API.timeFormat()}]`, ...data); }
        static group(...info: any[]) {
            console.groupCollapsed(`[${API.timeFormat()}]`, ...info);
            const result = new Proxy(Debug, {
                get: (t, p) => {
                    return new Proxy(Debug[p], {
                        apply: (target, thisArg, argArray) => {
                            target.call(thisArg, ...argArray);
                            return result
                        }
                    })
                }
            })
            return result;
        }
        static end() { console.groupEnd() }
    }
    // @ts-ignore
    API.debug = new Proxy(Debug.log, { get: (t, p) => Debug[p] })
})()
declare const debug: {
    (...data: any[]): void;
    log(...data: any[]): void;
    info(...data: any[]): void;
    debug(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    /**
     * 组合控制台信息，可以链式调用其他属性  
     * **必须配合end成对使用！**
     * @param groupName 组合名称
     * @param rest 其他补充数据
     * @example
     * debug.group(123).log(1).warn(2).group(456).debug(654).end().end();
     */
    group(...info: any[]): any;
}