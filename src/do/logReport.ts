interface modules {
    /**
     * 拦截B站日志上报
     */
    readonly "logReport.js": string;
}
{
    Object.defineProperty(window, "reportObserver", { get: () => undefined, set: () => true });
    Object.defineProperty(window, "reportMsgObj", { get: () => new Proxy({}, { get: () => () => { } }), set: () => true });
    API.xhrhookasync("data.bilibili.com", (args) => { debug.debug("拦截日志", ...args); return true }, undefined, false);
    API.xhrhookasync("data.bilivideo.com", (args) => { debug.debug("拦截日志", ...args); return true }, undefined, false);
    API.scriptBlock("log-reporter.js");
}