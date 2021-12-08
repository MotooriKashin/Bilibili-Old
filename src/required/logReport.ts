/**
 * 本模块负责拦截B站各种日志上报
 */
(function () {
    class Over {
        static temp = new Proxy(() => true, { get: () => Over.temp });
        static block(para: string, target: any = window) {
            Object.defineProperty(target, para, { get: () => Over.temp, set: () => true })
        }
    }
    Over.block("__statisObserver"); // 直播间日志
    Over.block("__tempPvTracker"); // 直播间日志
    API.xhrhook(["data.bilibili.com"], function (args) { this.send = () => true });
    API.xhrhook(["data.bilivideo.com"], function (args) { this.send = () => true });
})();