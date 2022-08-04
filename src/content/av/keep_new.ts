import { setting } from "../../runtime/setting";
import { toast } from "../../runtime/toast/toast";
import { replaceUrl } from "../../runtime/url_clean";
import { API } from "../../runtime/variable/variable";
import { isUserScript } from "../../tampermonkey/check";
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
    // 防止babelPolyfill报错跳出
    Reflect.defineProperty(window, "_babelPolyfill", { get: () => undefined, set: () => true });
    if (isUserScript) {
        setting.windowStop && window.stop();
        // 爆破新版播放器核心脚本
        (<any>window).nanoWidgetsJsonp = true;
        Reflect.defineProperty(window, "nano", {
            get: () => new Proxy(() => true, { get: (t, p, r) => r }), set: () => true, configurable: true
        });
        Reflect.deleteProperty(window, "__INITIAL_STATE__");
        Reflect.deleteProperty(window, "player");
        Reflect.deleteProperty(window, "__playinfo__");
    }
}