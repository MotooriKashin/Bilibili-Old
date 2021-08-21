"use strict";
/**
 * 本模块负责重写旧版bangumi页面
 */
(function () {
    API.path.name = "bangumi";
    API.getVariable({ origin: window, target: "aid" });
    API.getVariable({ origin: window, target: "cid" });
    // 备份还原旧版播放器设置数据
    API.importModule("playerSetting.js");
    try {
        // 准备epid
        let data = (API.uid && API.xhr({ url: location.href, async: false }).match(/last_ep_id\"\:[0-9]+/)) || [];
        let id = API.path[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : null;
        id = id || (data[0] && data[0].split(":")[1]) || null;
        try {
            // 准备__INITIAL_STATE__
            if (API.path[5].startsWith('ss')) {
                data = API.xhr({
                    url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", { season_id: location.href.match(/[0-9]+/)[0] }),
                    async: false
                });
            }
            else if (API.path[5].startsWith('ep')) {
                data = API.xhr({
                    url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", { ep_id: location.href.match(/[0-9]+/)[0] }),
                    async: false
                });
            }
            API.importModule("bangumi-season.js", { __INITIAL_STATE__: data, epid: id });
        }
        catch (e) {
            if (!config.delimit)
                throw e;
            // 尝试访问泰区服务器
            if (API.path[5].startsWith('ss')) {
                data = API.xhr({
                    url: API.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, { season_id: location.href.match(/[0-9]+/)[0] }),
                    async: false
                });
            }
            else if (API.path[5].startsWith('ep')) {
                data = API.xhr({
                    url: API.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, { ep_id: location.href.match(/[0-9]+/)[0] }),
                    async: false
                });
            }
            API.importModule("bangumi-global.js", { __INITIAL_STATE__: data, epid: id });
            API.limit = true;
            API.globalLimit = true;
        }
        // __INITIAL_STATE__类型保护
        const isBANGUMI__INITIAL_STATE__ = (pet) => true;
        if (isBANGUMI__INITIAL_STATE__(API.__INITIAL_STATE__)) {
            if (API.__INITIAL_STATE__?.epInfo?.badge === "互动")
                return API.toast.warning("这似乎是个互动番剧！", "什么！番剧也能互动？", "可惜旧版播放器不支持 ಥ_ಥ");
            config.bangumiEplist && API.__INITIAL_STATE__?.epList[1] && (API.__INITIAL_STATE__.special = false, API.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined);
            window.__INITIAL_STATE__ = API.__INITIAL_STATE__;
            API.__INITIAL_STATE__.special ? API.rewriteHTML(API.getHTMLFrame("bangumi-special.html")) : API.rewriteHTML(API.getHTMLFrame("bangumi.html"));
            document.title = API.__INITIAL_STATE__.mediaInfo.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
            // 分集数据
            config.episodeData && API.importModule("episodeData.js");
            // 移除过期节点
            API.runWhile(() => document.querySelector(".new-entry"), () => document.querySelector(".new-entry")?.remove());
            // 修复数据
            API.importModule("restoreData.js");
            // 媒体控制
            API.importModule("mediaControl.js", {
                title: API.__INITIAL_STATE__.mediaInfo.title,
                artist: API.__INITIAL_STATE__.mediaInfo.jp_title,
                chapterName: (pid) => API.__INITIAL_STATE__.epList[pid].index_title,
                coverUrl: (pid) => [{ src: API.__INITIAL_STATE__.epList[pid].cover, sizes: "960x600" }],
                getPlaylistIndex: () => API.__INITIAL_STATE__.epList.reduce((s, d, i) => { s[d.cid] = i; return s; }, {})[API.cid]
            });
        }
    }
    catch (e) {
        API.debug.trace(e, "bangumi.js", true);
    }
})();
