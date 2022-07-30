import { toast } from "../../runtime/toast/toast";
import { replaceUrl } from "../../runtime/url_clean";
import { API } from "../../runtime/variable/variable";
import { globalVector } from "../global";

/** 检查是否禁用恢复旧版页面 */
export function keepNewCheck() {
    const keepNew = sessionStorage.getItem("keepNew");
    const redirect = sessionStorage.getItem("redirect");
    if (keepNew) {
        toast.warning(keepNew);
        sessionStorage.removeItem("keepNew");
        // 全局入口
        globalVector();
        throw new Error("禁用旧版页面重构！");
    }
    if (redirect) {
        replaceUrl(redirect);
        sessionStorage.removeItem("redirect");
    }
    API.rewrite = true;
}