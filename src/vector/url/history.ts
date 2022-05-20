interface modules {
    /** 历史记录页面 */
    readonly "history.js": string;
}
namespace API {
    config.history && xhrhook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function (args) {
        let obj = urlObj(args[1]), max = obj.max || "", view_at = obj.view_at || "";
        args[1] = objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: "20" });
    }, undefined, false)
    config.searchHistory && doWhile(() => document.querySelector(".b-head-search"), () => document.querySelector(".b-head-search")?.remove());
}