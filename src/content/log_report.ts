/** 日志拦截 */
export function blockReport() {
    Reflect.defineProperty(window, "reportObserver", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    Reflect.defineProperty(window, "rec_rp", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    Reflect.defineProperty(window, "reportMsgObj", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
}