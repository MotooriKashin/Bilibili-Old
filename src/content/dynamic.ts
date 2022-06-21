import { xhrhook } from "../runtime/hook/xhr";
import { jsonCheck } from "../runtime/unit";

/** 动态页 */
export function dynamicPage() {
    xhrhook("api.bilibili.com/x/polymer/web-dynamic/v1/feed/all", undefined, r => {
        try {
            const response = jsonCheck(r.response);
            response.data.items = response.data.items.filter((d: any) => d.modules?.module_dynamic?.major?.archive?.badge?.text != "直播回放");
            r.responseType === "json" ? r.response = response : r.response = r.responseText = JSON.stringify(response);
        } catch (e) { }
    }, false);
}