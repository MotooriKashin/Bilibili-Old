namespace API {
    /**
     * 拉起B站快捷登录面板
     */
    export function biliQuickLogin() {
        (<any>window).biliQuickLogin ? (<any>window).biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => biliQuickLogin());
    }
}