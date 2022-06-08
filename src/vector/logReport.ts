interface modules {
    /** 拦截B站日志上报 */
    readonly "logReport.js": string;
}
namespace API {
    Object.defineProperty(window, "reportObserver", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    Object.defineProperty(window, "rec_rp", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    Object.defineProperty(window, "reportMsgObj", {
        get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
    });
    xhrhookAsync("data.bilibili.com", (args) => {
        debug.debug("拦截日志", ...args);
        return true;
    }, undefined, false);
    xhrhookAsync("data.bilivideo.com", (args) => {
        debug.debug("拦截日志", ...args);
        return true;
    }, undefined, false);
    xhrhookAsync("cm.bilibili.com", (args) => {
        debug.debug("拦截日志", ...args);
        return true;
    }, undefined, false);
    scriptBlock("log-reporter.js");
}