interface modules {
    /**
     * 拦截B站日志上报
     */
    readonly "logReport.js": string;
}
{
    Object.defineProperty(window, "reportObserver", { get: () => undefined, set: v => true });
    Object.defineProperty(window, "reportMsgObj", { get: () => undefined, set: v => true });
    API.xhrhookasync("data.bilibili.com", undefined, undefined, false);
    API.xhrhookasync("data.bilivideo.com", undefined, undefined, false);
    API.scriptBlock("log-reporter.js");
}