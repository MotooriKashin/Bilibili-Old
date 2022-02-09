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
    API.xhrhookasync("data.bilibili.com", undefined, undefined, false);
    API.xhrhookasync("data.bilivideo.com", undefined, undefined, false);
}