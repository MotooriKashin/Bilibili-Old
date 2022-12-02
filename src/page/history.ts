import { BLOD } from "../bilibili-old";
import { objUrl } from "../utils/format/url";
import { xhrHook } from "../utils/hook/xhr";

export class PageHistory {
    constructor(protected BLOD: BLOD) {
        BLOD.userLoadedCallback(status => {
            status.history && this.archive();
        })
    }
    /** 纯视频历史记录 */
    protected archive() {
        xhrHook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function (args) {
            let obj = new URL(args[1]), max = obj.searchParams.get("max") || "", view_at = obj.searchParams.get("view_at") || "";
            args[1] = objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: "20" });
        }, undefined, false);
    }
}