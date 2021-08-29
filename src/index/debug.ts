class Debug {
    static log(...data: any[]) { console.log(`%c[${Format.timeFormat()}]`, "color: blue;", ...data) }
    static info(...data: any[]) { console.info(`%c[${Format.timeFormat()}]`, "color: green;", ...data) }
    static debug(...data: any[]) { console.debug(`[${Format.timeFormat()}]`, ...data) }
    static warn(...data: any[]) { console.warn(`[${Format.timeFormat()}]`, ...data) }
    static error(...data: any[]) { console.error(`[${Format.timeFormat()}]`, ...data); }
}
const debug = (...data: any[]) => Debug.log(...data);
debug.log = (...data: any[]) => Debug.log(...data);
debug.info = (...data: any[]) => Debug.info(...data);
debug.debug = (...data: any[]) => Debug.debug(...data);
debug.warn = (...data: any[]) => Debug.warn(...data);
debug.error = (...data: any[]) => Debug.error(...data);