import { loadScript } from "../utils/element";

/** Bilibili快捷登录 */
export function biliQuickLogin() {
    (<any>window).biliQuickLogin ? (<any>window).biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => biliQuickLogin());
}