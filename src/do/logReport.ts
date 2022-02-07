interface modules {
    /**
     * 拦截B站日志上报
     */
    readonly "logReport.js": string;
}
{
    Object.defineProperty(window, "reportObserver", {
        get: () => {
            return {
                forceCommit: () => true,
                reportCustomData: () => true
            }
        }
    });
    Object.defineProperty(window, "reportMsgObj", { get: () => [], set: v => true });
    API.xhrhook(["data.bilibili.com"], function (args) { this.send = () => true });
    API.xhrhook(["data.bilivideo.com"], function (args) { this.send = () => true });
}