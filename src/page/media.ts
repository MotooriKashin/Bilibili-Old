import { jsonCheck } from "../io/api";
import { xhrHook } from "../utils/hook/xhr";

export class PageMedia {
    constructor() {
        this.limit();
    }
    /** 解除限制 */
    protected limit() {
        xhrHook("user/status", undefined, res => {
            try {
                const result = jsonCheck(res.response);
                result.result.area_limit = 0;
                result.result.ban_area_show = 0;
                res.responseType === "json" ? res.response = result : res.response = res.responseText = JSON.stringify(result);
            } catch (e) { }
        }, false);
    }
}