/**
 * 本模块负责重写旧版bangumi页面
 */
(function () {
    API.path.name = "bangumi";
    // 备份还原旧版播放器设置数据
    API.restorePlayerSetting();
    try {
        // 准备epid
        let epid = API.path[5].startsWith('ep') ? (<string[]>location.href.match(/[0-9]+/))[0] : null;
        new Promise(r => {
            API.uid ? (<Promise<string>>xhr({ url: location.href })).then(d => {
                let arr = d.match(/last_ep_id\"\:[0-9]+/) || [];
                epid = (arr[0] && arr[0].split(":")[1]) || null;
                r(epid);
            }).catch(e => { debug.error("获取epid出错！", e) }) : r(epid);
        }).then(d => {
            // 准备__INITIAL_STATE__
            const obj = {};
            API.path[5].startsWith('ss') && Reflect.set(obj, "season_id", location.href.match(/[0-9]+/)[0]);
            API.path[5].startsWith('ep') && Reflect.set(obj, "ep_id", location.href.match(/[0-9]+/)[0]);
            if (Reflect.has(obj, "season_id") || Reflect.has(obj, "ep_id")) {
                (<Promise<JSON>>xhr({
                    url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", obj),
                    responseType: "json"
                })).then(d => {
                    API.importModule("bangumi-season.js", { __INITIAL_STATE__: d, epid: epid });
                }).catch(e => {
                    toast.error("获取bangumi数据出错！", e);
                    config.videoLimit && (<Promise<JSON>>xhr({
                        url: API.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, obj),
                        responseType: "json"
                    })).then(d => {
                        API.importModule("bangumi-global.js", { __INITIAL_STATE__: d, epid: epid });
                        API.limit = true;
                        API.globalLimit = true;
                    }).catch(e => { debug.error(e) })
                })
            }
        }).finally(() => {
            // __INITIAL_STATE__类型保护
            const isBANGUMI__INITIAL_STATE__ = (pet: AV__INITIAL_STATE__ | BANGUMI__INITIAL_STATE__ | INDEX__INITIAL_STATE__): pet is BANGUMI__INITIAL_STATE__ => true;
            if (isBANGUMI__INITIAL_STATE__(API.__INITIAL_STATE__)) {
                if (API.__INITIAL_STATE__?.epInfo?.badge === "互动") return toast.warning("这似乎是个互动番剧！", "什么！番剧也能互动？", "可惜旧版播放器不支持 ಥ_ಥ");
                config.bangumiEplist && API.__INITIAL_STATE__?.epList[1] && (API.__INITIAL_STATE__.special = false, API.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined);
                (<any>window).__INITIAL_STATE__ = API.__INITIAL_STATE__;
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
                    chapterName: (pid: any) => (<BANGUMI__INITIAL_STATE__>API.__INITIAL_STATE__).epList[pid].index_title,
                    coverUrl: (pid: any) => [{ src: (<BANGUMI__INITIAL_STATE__>API.__INITIAL_STATE__).epList[pid].cover, sizes: "960x600" }],
                    getPlaylistIndex: () => (<BANGUMI__INITIAL_STATE__>API.__INITIAL_STATE__).epList.reduce((s, d, i) => { s[d.cid] = i; return s }, {})[API.cid]
                })
            }
        })
    } catch (e) { API.trace(e, "bangumi.js", true) }
})();
declare namespace API {
    /**
     * 区域限制标记
     */
    let limit: boolean;
    /**
     * 区域（泰区）限制标记
     */
    let globalLimit: boolean;
}