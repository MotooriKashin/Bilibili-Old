interface modules {
    /** 重构Bangumi */
    readonly "bangumi.js": string;
    readonly "bangumi.html": string;
    readonly "bangumi-script.html": string;
}
namespace API {
    if (rebuildType != "重定向") windowClear();
    pgc = true;
    location.href.replace(/[sS][sS]\d+/, d => ssid = <any>Number(d.substring(2)));
    location.href.replace(/[eE][pP]\d+/, d => epid = <any>Number(d.substring(2)));
    loadVideoScript();
    // 修复末尾番剧推荐
    xhrhook("api.bilibili.com/pgc/web/recommend/related/recommend", args => {
        // 原接口不返回针对ssid/epid的数据
        args[1] = args[1].replace("web/recommend", "season/web");
    }, r => {
        try {
            const result = jsonCheck(r.response);
            result.result = result.data.season;
            r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
        } catch (e) { }
    });
    // 修复追番数据
    xhrhook("bangumi.bilibili.com/ext/web_api/season_count", args => {
        // bangumi接口已追番数据恒等于0
        args[1] = args[1].replace("bangumi.bilibili.com/ext/web_api/season_count", "api.bilibili.com/pgc/web/season/stat");
    }, r => {
        try {
            const result = jsonCheck(r.response);
            result.result.favorites = result.result.follow;
            r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
        } catch (e) { }
    }, true);
    // 修复相关视频推荐 接口来自md页面
    const related: Record<string, string> = {};
    xhrhookasync("x/web-interface/archive/related", () => ((<any>window).__INITIAL_STATE__).mediaInfo.title, async (u, t) => {
        let result = '{ code: 0, data: [], message: "0" }';
        if (related[((<any>window).__INITIAL_STATE__).mediaInfo.title]) {
            result = related[((<any>window).__INITIAL_STATE__).mediaInfo.title];
        } else {
            try {
                const info = await xhr({
                    url: `https://api.bilibili.com/x/tag/info?tag_name=${((<any>window).__INITIAL_STATE__).mediaInfo.title}`,
                    responseType: "json"
                });
                related[((<any>window).__INITIAL_STATE__).mediaInfo.title] = result = await xhr({
                    url: `https://api.bilibili.com/x/web-interface/tag/top?tid=${info.data.tag_id}`
                });
            } catch (e) {
                debug.error("相关视频推荐", e);
            }
        }
        return t === "json" ? { response: JSON.parse(result) } : { response: result, responseText: result }
    }, false)

    if (rebuildType == "重定向") {
        document.documentElement.replaceChildren(createElements(htmlVnode(getModule("bangumi.html"))));
        appendScripts(getModule("bangumi-script.html")).then(() => loadendEvent());
    } else {
        (<any>window).__Iris__ = true; // 精确爆破新版番剧脚本
        documentWrite(getModule("bangumi.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", `${getModule("bangumi-script.html")}</body>`))
    }
    title && (document.title = title);
    doWhile(() => (<any>window).__INITIAL_STATE__, d => {
        bangumiInitialState().then(() => {
            config.enlike && new enLike("bangumi");
            if (d.special) {
                // 带海报的bangumi隐藏顶栏banner和wrapper
                addCss("#bili-header-m > #banner_link,#bili-header-m > .bili-wrapper{ display: none; }");
            }
            // -> bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js:1148
            // epid回调经常无法触发导致不加载评论区，手动加载之
            (<any>document).querySelector("#app")?.__vue__.loadComment();
        });
    });
    importModule("primaryMenu.js"); // 顶栏分区修正
    importModule("banner.js"); // 顶栏banner修复
    importModule("loadByDmId.js"); // 弹幕ID跳转
}