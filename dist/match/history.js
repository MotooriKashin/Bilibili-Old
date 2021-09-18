/**
 * 本模块负责处理历史记录页面
 */
try {
    config.history && API.xhrhook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function (args) {
        let obj = API.urlObj(args[1]), max = obj.max || "", view_at = obj.view_at || "";
        args[1] = API.objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: "20" });
    });
    config.searchHistory && API.runWhile(() => document.querySelector(".b-head-search"), () => { var _a; return (_a = document.querySelector(".b-head-search")) === null || _a === void 0 ? void 0 : _a.remove(); });
}
catch (e) {
    API.trace(e, "history.js");
}
