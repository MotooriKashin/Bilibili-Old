interface modules {
    /** 重构搜索 */
    readonly "search.js": string;
    readonly "search.html": string;
    readonly "search-script.html": string;
}
namespace API {
    if (rebuildType =="重定向") {
        document.documentElement.replaceChildren(createElements(htmlVnode(getModule("search.html"))));
        appendScripts(getModule("search-script.html")).then(() => loadendEvent());
    } else {
        windowClear();
        documentWrite(getModule("search.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", `${getModule("search-script.html")}</body>`));
    }
}