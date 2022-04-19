interface modules {
    /** 引导模块，主要功能模块引导运行处 */
    readonly "vector.js": string;
    readonly "message.css": string;
    readonly "imroot.css": string;
}
namespace API {
    /** 账号id，判定是否登录 */
    export const uid = Number(getCookies().DedeUserID);
    const NOREWRITE = sessionStorage.getItem("NOREWRITE");
    if (NOREWRITE) {
        // 临时禁用重写功能
        setTimeout(() => {
            toast.warning(NOREWRITE);
            sessionStorage.removeItem("NOREWRITE");
        }, 1000);
    }
    importModule("parameterTrim.js"); // 网址及超链接清理
    importModule("replyList.js"); // 回复翻页评论区及楼层号
    config.logReport && importModule("logReport.js"); // 拦截B站日志上报
    config.protoDm && importModule("protoDm.js"); // 旧版播放器新版protobuf弹幕支持
    if (!NOREWRITE) {
        if (config.av && /\/video\/[AaBb][Vv]/.test(location.href)) importModule("av.js");
        if (config.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href)) importModule("bangumi.js");
        if (config.watchlater && /\/watchlater/.test(location.href)) importModule("watchlater.js");
        if (config.player && /player\./.test(location.href)) importModule("player.js");
        if (/space\.bilibili\.com/.test(location.href)) importModule("space.js");
        if (config.index && path[2] == 'www.bilibili.com' && (!path[3] || (path[3].startsWith('\?') || path[3].startsWith('\#') || path[3].startsWith('index.')))) importModule("index.js");
        if (config.ranking && /\/v\/popular\//.test(location.href)) importModule("ranking.js");
        if (/live\.bilibili\.com/.test(location.href)) importModule("live.js");
        if (config.anime && /\/anime\/?(\?.+)?$/.test(location.href)) importModule("anime.js");
        if (path[2] == "message.bilibili.com") API.addCss(<string>API.getModule("message.css"));
        if (window.self == window.top && path[2] == 'www.bilibili.com') document.domain = "bilibili.com";
        if (location.href.includes("message.bilibili.com/pages/nav/index_new_sync")) API.addCss(<string>API.getModule("imroot.css"));
        if (location.href.includes("www.bilibili.com/account/history")) importModule("history.js");
        if (config.read && /\/read\/[Cc][Vv]/.test(location.href)) importModule("read.js");
        if (config.player && /\/festival\//.test(location.href)) importModule("bnj.js");
        if ((config.medialist && /\/medialist\/play\//.test(location.href) && !/watchlater/.test(location.href)) || /\/playlist\/video\/pl/.test(location.href)) importModule("medialist.js");
        if (config.search && path[2] == "search.bilibili.com") importModule("search.js");
    }
    importModule("infoNewNumber.js"); // 移除旧版顶栏失效资讯数据
    importModule("playinfo.js"); // 视频源修复及记录
    importModule("player-v2.js"); // 视频信息接口
    importModule("automate.js"); // 自动化处理
    config.videoLimit && importModule("videoLimit.js"); // 解锁视频限制
    importModule("banner.js"); // 移植动态顶栏banner
    config.section && importModule("section.js"); // 还原旧版顶栏
    config.danmakuHashId && path.name && importModule("danmakuHashId.js"); // 反查弹幕发送者
    config.downloadContentmenu && importModule("rightKey.js"); // 下载右键菜单
    (<(keyof modules)[]>importModule()).forEach((d: keyof modules) => { d.includes("[run]") && importModule(d) }); // 自运行脚本
}