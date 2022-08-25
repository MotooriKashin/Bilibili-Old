import { setting } from "../../runtime/setting";
import { toast } from "../../runtime/toast/toast";
import { replaceUrl } from "../../runtime/url_clean";
import { API } from "../../runtime/variable/variable";
import { isUserScript } from "../../tampermonkey/check";
import { globalVector } from "../global";

/**
 * 检查是否禁用恢复旧版页面
 * @param jsonp 定义如何处理webpackJsonp，新旧页面webpackJsonp可能跨版本，明确指出将避免一些问题
 */
export function keepNewCheck(jsonp?: 2) {
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
    API.rewrite = jsonp || 1;
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
        (<any>window).player?.pause(); // 尝试清除已销毁的新版播放器
        Reflect.deleteProperty(window, "__playinfo__");
    }
}