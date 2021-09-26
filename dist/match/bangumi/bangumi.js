/**
 * 本模块负责重写旧版bangumi页面
 */
(function () {
    try {
        class Bangumi {
            constructor() {
                this.epid = API.path[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : null;
                this.obj = {};
                this.isBANGUMI__INITIAL_STATE__ = (pet) => true;
                API.path.name = "bangumi";
                // 备份还原旧版播放器设置数据
                API.restorePlayerSetting();
                API.scriptIntercept(["video-nano"]); // 新版播放器拦截
                API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
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
                        xhr({
                            url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", this.obj),
                            responseType: "json",
                            credentials: true
                        }).then(d => {
                            API.importModule("bangumi-season.js", { __INITIAL_STATE__: d, epid: this.epid });
                            r(true);
                        }).catch(e => {
                            toast.error("获取bangumi数据出错！", e);
                            config.videoLimit && xhr({
                                url: API.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, this.obj),
                                responseType: "json",
                                credentials: true
                            }).then(d => {
                                API.importModule("bangumi-global.js", { __INITIAL_STATE__: d, epid: this.epid });
                                r(true);
                                API.limit = true;
                                API.globalLimit = true;
                            }).catch(e => { debug.error(e); API.importModule("vector.js"); });
                        });
                    }
                });
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
                    async: false
                });
                try {
                    API.importModule("bangumi-season.js", { __INITIAL_STATE__: d, epid: this.epid });
                }
                catch (e) {
                    toast.error("获取bangumi数据出错！", e);
                    if (!config.videoLimit)
                        return;
                    d = xhr({
                        url: API.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, this.obj),
                        async: false
                    });
                    API.importModule("bangumi-global.js", { __INITIAL_STATE__: d, epid: this.epid });
                    API.limit = true;
                    API.globalLimit = true;
                }
                this.write();
            }
            write() {
                var _a, _b, _c;
                if (this.isBANGUMI__INITIAL_STATE__(API.__INITIAL_STATE__)) {
                    if (((_b = (_a = API.__INITIAL_STATE__) === null || _a === void 0 ? void 0 : _a.epInfo) === null || _b === void 0 ? void 0 : _b.badge) === "互动")
                        return toast.warning("这似乎是个互动番剧！", "什么！番剧也能互动？", "可惜旧版播放器不支持 ಥ_ಥ");
                    config.bangumiEplist && ((_c = API.__INITIAL_STATE__) === null || _c === void 0 ? void 0 : _c.epList[1]) && (API.__INITIAL_STATE__.special = false, API.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined);
                    window.__INITIAL_STATE__ = API.__INITIAL_STATE__;
                    API.__INITIAL_STATE__.special ? API.rewriteHTML(API.getModule("bangumi-special.html")) : API.rewriteHTML(API.getModule("bangumi.html"));
                    document.title = API.__INITIAL_STATE__.mediaInfo.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                    // 分集数据
                    config.episodeData && API.importModule("episodeData.js");
                    // 移除过期节点
                    API.runWhile(() => document.querySelector(".new-entry"), () => { var _a; return (_a = document.querySelector(".new-entry")) === null || _a === void 0 ? void 0 : _a.remove(); });
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
        }
        new Bangumi();
    }
    catch (e) {
        API.trace(e, "bangumi.js", true);
        API.importModule("vector.js");
    }
})();
