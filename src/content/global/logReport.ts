/** 日志拦截 */
export function blockReport() {
    Object.defineProperty(window, "reportObserver", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    Object.defineProperty(window, "rec_rp", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    Object.defineProperty(window, "reportMsgObj", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
}