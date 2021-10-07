(function () {
    class Debug {
        static log(...data: any[]) { console.log(`%c[${API.timeFormat()}]`, "color: blue;", ...data) }
        static info(...data: any[]) { console.info(`%c[${API.timeFormat()}]`, "color: green;", ...data) }
        static debug(...data: any[]) { console.debug(`[${API.timeFormat()}]`, ...data) }
        static warn(...data: any[]) { console.warn(`[${API.timeFormat()}]`, ...data) }
        static error(...data: any[]) { console.error(`[${API.timeFormat()}]`, ...data); }
    }
    // @ts-ignore
    API.debug = (...data: any[]) => Debug.log(...data);
    Reflect.ownKeys(Debug).forEach(d => typeof Debug[d] == "function" && Reflect.set(Reflect.get(API, "debug"), d, Debug[d]));
})();
declare const debug: {
    (...data: any[]): void;
    log(...data: any[]): void;
    info(...data: any[]): void;
    debug(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
}