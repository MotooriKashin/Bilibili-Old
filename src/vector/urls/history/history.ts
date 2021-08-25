/**
 * 本模块负责处理历史记录页面
 */
(function () {
    config.history && API.xhrhook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function (args) {
        let obj = API.urlObj(args[1]), max = obj.max || "", view_at = obj.view_at || "";
        args[1] = API.objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: "20" });
    })
    config.searchHistory && API.runWhile(() => document.querySelector(".b-head-search"), () => document.querySelector(".b-head-search")?.remove());
})();