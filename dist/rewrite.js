/**
 * 本模负责重写引导
 */
try {
    API.uid = Number(API.getCookies().DedeUserID);
    API.path = location.href.split("/");
    if (API.uid) {
        // 代理旧版退出登录页面
        if (location.href.includes("bilibili.com/login?act=exit"))
            API.loginExit(document.referrer);
        // 修复动态时间线
        let offset = API.getCookies()["bp_video_offset_" + API.uid];
        offset && (document.cookie = "bp_t_offset_" + API.uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; BLOD.path=/");
    }
    /**
     * 分离页面进入重写判定
     */
    if (config.av && /\/video\/[AaBb][Vv]/.test(location.href))
        API.importModule("av.js");
    if (config.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href))
        API.importModule("bangumi.js");
    if (config.watchlater && /\/watchlater\//.test(location.href))
        API.importModule("watchlater.js");
    if (config.player && /player\./.test(location.href))
        API.importModule("player.js");
    if (/space\.bilibili\.com/.test(location.href))
        API.importModule("space.js");
    if (config.index && API.path[2] == 'www.bilibili.com' && (!API.path[3] || (API.path[3].startsWith('\?') || API.path[3].startsWith('\#') || API.path[3].startsWith('index.'))))
        API.importModule("index.js");
    if (config.ranking && /\/v\/popular\//.test(location.href))
        API.importModule("ranking.js");
    if (/live\.bilibili\.com/.test(location.href))
        API.importModule("live.js");
    if (/\/medialist\/play\//.test(location.href))
        API.importModule("mediaList.js");
    if (API.path[2] == "message.bilibili.com")
        API.addCss(API.getModule("message.css"));
    if (window.self == window.top && API.path[2] == 'www.bilibili.com')
        document.domain = "bilibili.com";
    if (location.href.includes("message.bilibili.com/pages/nav/index_new_sync"))
        API.addCss(API.getModule("imroot.css"));
    if (location.href.includes("www.bilibili.com/account/history"))
        API.importModule("history.js");
    if (/dmid/.test(location.href) && /dm_progress/.test(location.href))
        API.importModule("loadByDmid.js");
    if (config.read && /\/read\/[Cc][Vv]/.test(location.href))
        API.importModule("read.js");
    API.scriptIntercept(["bilibiliPlayer.min.js"], "bilibiliPlayer.js"); // 播放器脚本拦截
    API.path.name && API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
    config.logReport && API.scriptIntercept(["log-reporter"]); // 日志拦截
    /**
     * 若页面不需要重写，直接进入正常引导
     */
    (!API.path.name || config.rewriteMethod == "同步") && API.importModule("vector.js");
}
catch (e) {
    API.trace(e, "rewrite.js", true);
}
