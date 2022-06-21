import { xhrhook } from "../runtime/hook/xhr";
import { jsonCheck } from "../runtime/unit";

/** bangumi 详情页面 */
export function mediaPage() {
    // 解除限制
    xhrhook("user/status", undefined, res => {
        try {
            const result = jsonCheck(res.response);
            result.result.area_limit = 0;
            result.result.ban_area_show = 0;
            res.responseType === "json" ? res.response = result : res.response = res.responseText = JSON.stringify(result);
        } catch (e) { }
    }, false);
}