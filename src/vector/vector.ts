interface modules {
    /** 模块主动引导点 */
    readonly "vector.js": string;
}
namespace API {
    if (uid) {
        // 修复动态时间戳
        const offset = getCookies()[`bp_video_offset_${uid}`];
        if (offset) {
            setCookie(`bp_t_offset_${uid}`, offset);
        }
    }
    config.developer && Reflect.set(window, "API", API);
    // 重写模式下，引导之前加载的模块注册的回调都会失效
    // 为此，相关回调包装在`loadAfterClear`方法中
    importModule("urlCleaner.js"); // url清洁
    importModule("bbComment.js"); // 评论区
    // 重构引导
    const keepNew = sessionStorage.getItem("keepNew");
    const vector: string[] = sessionStorage.getItem("vector")?.split(" ");
    sessionStorage.removeItem("vector");
    if (keepNew) {
        sessionStorage.removeItem("keepNew");
        Promise.resolve().then(() => toast.warning("这似乎是一个互动视频？", "旧版页面并不支持 ಥ_ಥ"));
    } else if (rebuildType == "重定向" && vector && vector[1]) {
        const name = <string>vector.shift();
        const url = (<string>vector.shift()).split("/");
        // 还原url地址
        url[2] = location.href.split("/")[2];
        replaceUrl(url.join("/"));
        vector[0] && (title = vector.join(" ")) // 记录标题
        path = location.href.split("/"); // 重构path属性
        document.documentElement.removeAttribute("style"); // 移除根元素style样式
        switch (name) {
            case "index": importModule("index.js"); // 主页
                break;
            case "av": importModule("av.js"); // av
                break;
            case "bangumi": importModule("bangumi.js"); // bangumi
                break;
            case "watchlater": importModule("watchlater.js"); // watchlater
                break
            case "player": importModule("player.js"); // player
                break;
            case "playlist": importModule("playlist.js"); // playlist
                break;
            case "ranking": importModule("ranking.js"); // 排行榜
                break;
            case "read": importModule("read.js");
                break;
            case "search": importModule("search.js");
                break;
        }
    } else {
        // 重构判定
        if (config.index && path[2] == 'www.bilibili.com' && (!path[3] || (path[3].startsWith('\?') || path[3].startsWith('\#') || path[3].startsWith('index.')))) {
            rebuildType == "重定向" ? redirect("index") : importModule("index.js");
        }
        if (config.av && /\/video\/[AaBb][Vv]/.test(location.href)) {
            rebuildType == "重定向" ? redirect("av", location.href.replace("s/video", "video")) : importModule("av.js");
        }
        if (config.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href)) {
            rebuildType == "重定向" ? redirect("bangumi") : importModule("bangumi.js");
        }
        if (config.watchlater && /\/watchlater/.test(location.href)) {
            rebuildType == "重定向" ? redirect("watchlater") : importModule("watchlater.js");
        }
        if (config.player && /player\./.test(location.href) && !location.href.includes("ancient")) {
            rebuildType == "重定向" ? redirect("player") : importModule("player.js");
        }
        if ((config.medialist && /\/medialist\/play\//.test(location.href) && !/watchlater/.test(location.href)) || /\/playlist\/video\/pl/.test(location.href)) {
            rebuildType == "重定向" ? redirect("playlist") : importModule("playlist.js");
        }
        if (config.player && /\/festival\//.test(location.href)) {
            importModule("bnj.js");
        }
        if (config.ranking && /\/v\/popular\//.test(location.href)) {
            rebuildType == "重定向" ? redirect("ranking", document.referrer) : importModule("ranking.js");
        }
        if (config.read && /\/read\/[Cc][Vv]/.test(location.href)) {
            rebuildType == "重定向" ? redirect("read") : importModule("read.js");
        }
        if (config.search && path[2] == "search.bilibili.com") {
            rebuildType == "重定向" ? redirect("search") : importModule("search.js");
        };
        if (/live\.bilibili\.com/.test(location.href)) {
            importModule("live.js");
        }
        if (/space\.bilibili\.com/.test(location.href)) {
            importModule("space.js");
        }
        if (config.liveRecord && path[2] == "t.bilibili.com") {
            importModule("dynamic.js");
        }
        if (location.href.includes("www.bilibili.com/account/history")) {
            importModule("history.js");
        }
        if (window.self == window.top && path[2] == 'www.bilibili.com') {
            document.domain = "bilibili.com";
        }
        if (path[2] == "message.bilibili.com") {
            importModule("message.js");
        }
        if (/bangumi\/media\/md/.test(location.href)) {
            importModule("media.js");
        }
        if (config.timeline && /anime\/timeline/.test(location.href)) {
            importModule("timeline.js");
        }
    }
    config.logReport && importModule("logReport.js"); // 日志拦截
    importModule("protobufDanmaku.js"); // 新版弹幕
    config.section && importModule("globalSection.js"); // 还原旧版顶栏
    importModule("playinfo.js"); // 视频源修复及记录
    importModule("automate.js"); // 自动化操作
    doWhile(() => document.readyState === 'complete', () => {
        window.top === window.self && showSettingEntry(); // 绘制设置UI
    });
}