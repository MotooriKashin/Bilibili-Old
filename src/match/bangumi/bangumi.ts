/**
 * 本模块负责重写旧版bangumi页面
 */
(function () {
    try {
        class Bangumi {
            epid = API.path[5].startsWith('ep') ? (<string[]>location.href.match(/[0-9]+/))[0] : null;
            obj = {};
            isBANGUMI__INITIAL_STATE__ = (pet: AV__INITIAL_STATE__ | BANGUMI__INITIAL_STATE__): pet is BANGUMI__INITIAL_STATE__ => true;
            constructor() {
                API.path.name = "bangumi";
                API.path[5].startsWith('ss') && Reflect.set(this.obj, "season_id", location.href.match(/[0-9]+/)[0]);
                API.path[5].startsWith('ep') && Reflect.set(this.obj, "ep_id", location.href.match(/[0-9]+/)[0]);
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            async prepareA() {
                if (API.uid && !this.epid) {
                    const data = await xhr({ url: location.href });
                    const arr = data.match(/last_ep_id\"\:[0-9]+/) || [];
                    this.epid = (arr[0] && arr[0].split(":")[1]) || null;
                }
                await new Promise(r => {
                    // 准备__INITIAL_STATE__
                    if (Reflect.has(this.obj, "season_id") || Reflect.has(this.obj, "ep_id")) {
                        (<Promise<JSON>>xhr({
                            url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", this.obj),
                            responseType: "json",
                            credentials: true
                        })).then(d => {
                            API.importModule("bangumi-season.js", { __INITIAL_STATE__: d, epid: this.epid }, true);
                            r(true);
                        }).catch(e => {
                            toast.error("获取bangumi数据出错！", e);
                            config.videoLimit && (<Promise<JSON>>xhr({
                                url: API.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, this.obj),
                                responseType: "json",
                                credentials: true
                            })).then(d => {
                                API.importModule("bangumi-global.js", { __INITIAL_STATE__: d, epid: this.epid }, true);
                                r(true);
                                API.limit = true;
                                API.globalLimit = true;
                            }).catch(e => { debug.error(e); API.importModule("vector.js"); });
                        })
                    }
                })
                this.write();
            }
            prepareB() {
                if (API.uid && !this.epid) {
                    const data = xhr({ url: location.href, async: false });
                    const arr = data.match(/last_ep_id\"\:[0-9]+/) || [];
                    this.epid = (arr[0] && arr[0].split(":")[1]) || null;
                }
                let d = xhr({
                    url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", this.obj),
                    async: false,
                    credentials: true
                })
                try {
                    API.importModule("bangumi-season.js", { __INITIAL_STATE__: d, epid: this.epid }, true);
                } catch (e) {
                    toast.error("获取bangumi数据出错！", e);
                    if (!config.videoLimit) return;
                    d = xhr({
                        url: API.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, this.obj),
                        async: false
                    })
                    API.importModule("bangumi-global.js", { __INITIAL_STATE__: d, epid: this.epid }, true);
                    API.limit = true;
                    API.globalLimit = true;
                }
                this.write();
            }
            write() {
                if (this.isBANGUMI__INITIAL_STATE__(API.__INITIAL_STATE__)) {
                    if (API.__INITIAL_STATE__?.epInfo?.badge === "互动") return (delete API.path.name, toast.warning("这似乎是个互动番剧！", "什么！番剧也能互动？", "可惜旧版播放器不支持 ಥ_ಥ"), API.importModule("vector.js"));
                    // 备份还原旧版播放器设置数据
                    API.restorePlayerSetting();
                    API.scriptIntercept(["video-nano"]); // 新版播放器拦截
                    API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
                    config.bangumiEplist && API.__INITIAL_STATE__?.epList[1] && (API.__INITIAL_STATE__.special = false, API.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined);
                    (<any>window).__INITIAL_STATE__ = API.__INITIAL_STATE__;
                    API.__INITIAL_STATE__.special ? API.rewriteHTML(API.getModule("bangumi-special.html").replace("static.hdslb.com/js/video.min.js", "cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/video.min.js")) : API.rewriteHTML(API.getModule("bangumi.html").replace("static.hdslb.com/js/video.min.js", "cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/video.min.js"));
                    document.title = API.__INITIAL_STATE__.mediaInfo.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                    // 分集数据
                    config.episodeData && API.importModule("episodeData.js");
                    // 移除过期节点
                    API.runWhile(() => document.querySelector(".new-entry"), () => document.querySelector(".new-entry")?.remove());
                    // 修复数据
                    API.importModule("restoreData.js");
                    // 媒体控制
                    let getPlaylistIndex = () => (<BANGUMI__INITIAL_STATE__>API.__INITIAL_STATE__).epList.findIndex(v => v.cid == ((<any>window).cid || API.cid));
                    Object.defineProperty(window, "pageno", { get: () => getPlaylistIndex() + 1 });
                    API.importModule("mediaControl.js", {
                        getPlaylistIndex: () => getPlaylistIndex(),
                        mediaInfo: (pid: number) => {
                            if (this.isBANGUMI__INITIAL_STATE__(API.__INITIAL_STATE__))
                                return {
                                    title: API.__INITIAL_STATE__.mediaInfo.title,
                                    artist: API.__INITIAL_STATE__.mediaInfo.jp_title,
                                    chapterName: API.__INITIAL_STATE__.epList[pid].index_title,
                                    coverUrl: [{ src: API.__INITIAL_STATE__.epList[pid].cover, sizes: "960x600" }]
                                }
                        }
                    })
                }
            }
        }
        new Bangumi();
    } catch (e) { toast.error("bangumi.js", e); API.importModule("vector.js"); }
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