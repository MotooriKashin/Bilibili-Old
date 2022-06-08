interface modules {
    /** 排行榜 */
    readonly "ranking.js": string;
    readonly "ranking.html": string;
    readonly "ranking-script.html": string;
}
namespace API {
    if (rebuildType != "重定向") windowClear();
    // 三日接口以外过期
    jsonphook(["api.bilibili.com/x/web-interface/ranking", "arc_type=0"], d => d.replace(/day=\d+/, "day=3"), undefined, false);
    if (rebuildType == "重定向") {
        document.documentElement.replaceChildren(createElements(htmlVnode(getModule("ranking.html"))));
        appendScripts(getModule("ranking-script.html")).then(() => loadendEvent());
    } else {
        // ranking网址才会触发初始化
        const url = document.referrer;
        replaceUrl(url.includes("ranking") ? url : objUrl("https://www.bilibili.com/ranking", urlObj(location.href)));
        documentWrite(getModule("ranking.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", `${getModule("ranking-script.html")}</body>`));
    }
    // 高分辨率屏修补
    addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
    importModule("primaryMenu.js"); // 顶栏分区修正
    importModule("banner.js"); // 顶栏banner修复
}