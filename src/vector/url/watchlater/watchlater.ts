interface modules {
    /** 重构稍后再看 */
    readonly "watchlater.js": string;
    readonly "watchlater.html": string;
    readonly "watchlater-script.html": string;
}
namespace API {
    if (rebuildType != "重定向") windowClear();
    loadVideoScript();
    xhrhook("api.live.bilibili.com/bili/living_v2/", undefined, r => { r.responseType = "text" }, false);
    if (rebuildType == "重定向") {
        document.documentElement.replaceChildren(createElements(htmlVnode(getModule("watchlater.html"))));
        appendScripts(getModule("watchlater-script.html")).then(() => loadendEvent());
    } else {
        documentWrite(getModule("watchlater.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", `${getModule("watchlater-script.html")}</body>`));
    }
    title && (document.title = title);
    // 修复评论视频跳转接口
    window.commentAgent = { seek: (t: number) => window.player && window.player.seek(t) };
    config.enlike && new enLike("watchlater"); // 添加点赞功能
    importModule("primaryMenu.js"); // 顶栏分区修正
    importModule("banner.js"); // 顶栏banner修复
    importModule("loadByDmId.js"); // 弹幕ID跳转
}