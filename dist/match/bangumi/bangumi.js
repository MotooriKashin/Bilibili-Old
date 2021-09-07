/**
 * 本模块负责重写旧版bangumi页面
 */
API.path.name = "bangumi";
// 备份还原旧版播放器设置数据
API.restorePlayerSetting();
API.scriptIntercept(["video-nano"]); // 新版播放器拦截
API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
(async function () {
    try {
        let epid = API.path[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : null;
        if (API.uid) {
            const data = await xhr({ url: location.href });
            const arr = data.match(/last_ep_id\"\:[0-9]+/) || [];
            epid = (arr[0] && arr[0].split(":")[1]) || null;
        }
        await new Promise(r => {
            // 准备__INITIAL_STATE__
            const obj = {};
            API.path[5].startsWith('ss') && Reflect.set(obj, "season_id", location.href.match(/[0-9]+/)[0]);
            API.path[5].startsWith('ep') && Reflect.set(obj, "ep_id", location.href.match(/[0-9]+/)[0]);
            if (Reflect.has(obj, "season_id") || Reflect.has(obj, "ep_id")) {
                xhr({
                    url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", obj),
                    responseType: "json"
                }).then(d => {
                    API.importModule("bangumi-season.js", { __INITIAL_STATE__: d, epid: epid });
                    r(true);
                }).catch(e => {
                    toast.error("获取bangumi数据出错！", e);
                    config.videoLimit && xhr({
                        url: API.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, obj),
                        responseType: "json"
                    }).then(d => {
                        API.importModule("bangumi-global.js", { __INITIAL_STATE__: d, epid: epid });
                        r(true);
                        API.limit = true;
                        API.globalLimit = true;
                    }).catch(e => { debug.error(e); API.importModule("vector.js"); });
                });
            }
        });
        const isBANGUMI__INITIAL_STATE__ = (pet) => true;
        if (isBANGUMI__INITIAL_STATE__(API.__INITIAL_STATE__)) {
            if (API.__INITIAL_STATE__?.epInfo?.badge === "互动")
                return toast.warning("这似乎是个互动番剧！", "什么！番剧也能互动？", "可惜旧版播放器不支持 ಥ_ಥ");
            config.bangumiEplist && API.__INITIAL_STATE__?.epList[1] && (API.__INITIAL_STATE__.special = false, API.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined);
            window.__INITIAL_STATE__ = API.__INITIAL_STATE__;
            API.__INITIAL_STATE__.special ? API.rewriteHTML(API.getModule("bangumi-special.html")) : API.rewriteHTML(API.getModule("bangumi.html"));
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
        API.trace(e, "bangumi.js", true);
        API.importModule("vector.js");
    }
})();
