interface modules {
    /**
     * 模块引入点
     */
    readonly "vector.js": string;
    readonly "message.css": string;
    readonly "imroot.css": string;
}
try {
    const disable = sessionStorage.getItem("disable_rewrite");
    if (disable) {
        setTimeout(() => toast.warning(disable), 1000);
        sessionStorage.removeItem("disable_rewrite");
    }
    // 模块引导起点
    config.developer && (window.API = <any>API); // 开发者模式
    API.importModule("parameterTrim.js"); // 网址及超链接清理
    API.importModule("replyList.js"); // 回复翻页评论区及楼层号
    config.logReport && API.importModule("logReport.js"); // 拦截B站日志上报
    // 重写分别引导入口，专属对应页面的模块请转向对应引导模块
    if (!disable) {
        if (config.av && /\/video\/[AaBb][Vv]/.test(location.href)) API.importModule("av.js");
        if (config.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href)) API.importModule("bangumi.js");
        if (config.watchlater && /\/watchlater/.test(location.href)) API.importModule("watchlater.js");
        if (config.player && /player\./.test(location.href)) API.importModule("player.js");
        if (/space\.bilibili\.com/.test(location.href)) API.importModule("space.js");
        if (config.index && API.path[2] == 'www.bilibili.com' && (!API.path[3] || (API.path[3].startsWith('\?') || API.path[3].startsWith('\#') || API.path[3].startsWith('index.')))) API.importModule("index.js");
        if (config.ranking && /\/v\/popular\//.test(location.href)) API.importModule("ranking.js");
        if (/live\.bilibili\.com/.test(location.href)) API.importModule("live.js");
        if (config.anime && /\/anime\/?(\?.+)?$/.test(location.href)) API.importModule("anime.js");
        if (API.path[2] == "message.bilibili.com") API.addCss(<string>API.getModule("message.css"));
        if (window.self == window.top && API.path[2] == 'www.bilibili.com') document.domain = "bilibili.com";
        if (location.href.includes("message.bilibili.com/pages/nav/index_new_sync")) API.addCss(<string>API.getModule("imroot.css"));
        if (location.href.includes("www.bilibili.com/account/history")) API.importModule("history.js");
        if (config.read && /\/read\/[Cc][Vv]/.test(location.href)) API.importModule("read.js");
        if (config.player && /festival\/202[1-2]bnj/.test(location.href)) API.importModule("bnj.js");
        if ((config.medialist && /\/medialist\/play\//.test(location.href) && !/watchlater/.test(location.href)) || /\/playlist\/video\/pl/.test(location.href)) API.importModule("medialist.js");
    }
    // 重写之后再引导的全局模块
    API.importModule("infoNewNumber.js"); // 移除旧版顶栏失效资讯数据
    config.protoDm && API.importModule("protoDm.js"); // 旧版播放器新版protobuf弹幕支持
    API.importModule("playinfo.js"); // 视频源修复及记录
    API.importModule("player-v2.js"); // 视频信息接口
    API.importModule("automate.js"); // 自动化处理
    config.videoLimit && API.importModule("videoLimit.js"); // 解锁视频限制
    API.importModule("banner.js"); // 移植动态顶栏banner
    config.section && API.importModule("section.js"); // 还原旧版顶栏
    config.danmakuHashId && API.path.name && API.importModule("danmakuHashId.js"); // 反差弹幕发送者
    config.downloadContentmenu && API.importModule("rightKey.js"); // 下载右键菜单
    API.importModule().forEach((d: keyof modules) => { d.includes("[run]") && API.importModule(d) }); // 自运行脚本
} catch (e) { toast.error(API.Name, e) }