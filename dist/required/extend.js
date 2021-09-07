/**
 * 本模块负责拓展一些小工具，这些工具不便写在主模块中
 */
(function () {
    function getCookies() {
        return document.cookie.split('; ').reduce((s, d) => {
            let key = d.split('=')[0];
            let val = d.split('=')[1];
            s[key] = val;
            return s;
        }, {});
    }
    API.getCookies = () => getCookies();
    async function loginExit(referer) {
        if (!API.uid)
            return toast.warning("本就未登录，无法退出登录！");
        toast.warning("正在退出登录...");
        let data = API.jsonCheck(await xhr({
            url: "https://passport.bilibili.com/login/exit/v2",
            data: `biliCSRF=${API.getCookies().bili_jct}&gourl=${encodeURIComponent(location.href)}`,
            method: "POST",
        }));
        if (data.status) {
            toast.success("退出登录！");
            if (referer)
                return location.replace(referer);
            setTimeout(() => location.reload(), 1000);
        }
    }
    API.loginExit = (referer) => loginExit(referer);
    function jsonCheck(data) {
        let result = typeof data === "string" ? JSON.parse(data) : data;
        if ("code" in result && result.code !== 0) {
            let msg = result.msg || result.message || "";
            throw [result.code, msg];
        }
        return result;
    }
    API.jsonCheck = (data) => jsonCheck(data);
    function restorePlayerSetting() {
        let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
        let settings_copy = GM.getValue("bilibili_player_settings", {});
        if (bilibili_player_settings) {
            let settings = JSON.parse(bilibili_player_settings);
            if (settings?.video_status?.autopart !== "")
                GM.setValue("bilibili_player_settings", settings);
            else if (settings_copy)
                localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
        }
        else if (settings_copy) {
            localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
        }
    }
    API.restorePlayerSetting = () => restorePlayerSetting();
    function biliQuickLogin() {
        window.biliQuickLogin ? window.biliQuickLogin() : window.$ ? window.$.getScript("//static.hdslb.com/account/bili_quick_login.js", () => window.biliQuickLogin()) : false;
    }
    API.biliQuickLogin = () => biliQuickLogin();
    function getTotalTop(node) {
        var sum = 0;
        do {
            sum += node.offsetTop;
            node = node.offsetParent;
        } while (node);
        return sum;
    }
    API.getTotalTop = (node) => getTotalTop(node);
})();
