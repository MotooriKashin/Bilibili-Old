interface modules {
    /** 拦截B站日志上报 */
    readonly "logReport.js": string;
}
namespace API {
    Object.defineProperty(window, "reportObserver", { get: () => undefined, set: () => true });
    Object.defineProperty(window, "reportMsgObj", { get: () => new Proxy({}, { get: () => () => { } }), set: () => true });
    xhrhookasync("data.bilibili.com", (args) => { debug.debug("拦截日志", ...args); return true }, undefined, false);
    xhrhookasync("data.bilivideo.com", (args) => { debug.debug("拦截日志", ...args); return true }, undefined, false);
    scriptBlock("log-reporter.js");
}