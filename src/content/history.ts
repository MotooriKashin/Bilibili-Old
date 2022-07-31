import { doWhile } from "../runtime/do_while";
import { xhrhook } from "../runtime/hook/xhr";
import { objUrl } from "../runtime/format/url";
import { setting } from "../runtime/setting";

/** 历史记录页面 */
export function historyPage() {
    setting.history && xhrhook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function (args) {
        let obj = new URL(args[1]), max = obj.searchParams.get("max") || "", view_at = obj.searchParams.get("view_at") || "";
        args[1] = objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: "20" });
    }, undefined, false)
    setting.searchHistory && doWhile(() => document.querySelector(".b-head-search"), () => document.querySelector(".b-head-search")?.remove());
}