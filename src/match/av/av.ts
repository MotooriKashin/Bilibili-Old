/**
 * 本模块负责重写av/BV页，由`rewrite.js`按需引导
 * 其他只在重写过的旧版页面生效的功能可添加在本模块中，但更推荐编写在单独的模块中然后将引导代码写在本模块中。
 */
(function () {
    try {
        class Av {
            // __INITIAL_STATE__类型保护
            isAV__INITIAL_STATE__ = (pet: AV__INITIAL_STATE__ | BANGUMI__INITIAL_STATE__): pet is AV__INITIAL_STATE__ => true;
            constructor() {
                // 重定向SEO页面
                if (/\/s\//.test(location.href)) location.replace(location.href.replace("s/video", "video"));
                API.path.name = "av";
                // 获取aid
                if (API.path[4].toLowerCase().startsWith('bv')) API.aid = <number>API.abv(API.path[4].split("#")[0].split("?")[0]);
                API.aid = API.aid || Number((<RegExpExecArray>/[0-9]+/.exec(String(API.path[4])))[0]);
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            /**
             * 异步构造__INITIAL_STATE__前置
             */
            async prepareA() {
                await new Promise(r => {
                    (<Promise<JSON>>xhr({
                        url: API.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: <any>API.aid }),
                        responseType: "json",
                        credentials: true
                    })).then(d => {
                        API.importModule("av-detail.js", { __INITIAL_STATE__: d }, true);
                        r(true);
                    }).catch(e => {
                        toast.error("获取av号信息出错，尝试访问第三方接口~", e);
                        (<Promise<JSON>>xhr({
                            url: API.objUrl("https://www.biliplus.com/api/view", { id: <any>API.aid }),
                            responseType: "json"
                        })).then(d => {
                            API.importModule("av-biliplus.js", { __INITIAL_STATE__: d }, true);
                            r(true);
                        }).catch(e => {
                            toast.error("第三方接口也出错，", e);
                            API.importModule("vector.js");
                        })
                    })
                })
                this.write();
            }
            /**
             * 同步构造__INITIAL_STATE__前置
             */
            prepareB() {
                let d = xhr({
                    url: API.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: <any>API.aid }),
                    async: false
                })
                try {
                    API.importModule("av-detail.js", { __INITIAL_STATE__: d }, true);
                } catch (e) {
                    toast.error("获取av号信息出错，尝试访问第三方接口~", e);
                    d = xhr({
                        url: API.objUrl("https://www.biliplus.com/api/view", { id: <any>API.aid }),
                        async: false
                    })
                    API.importModule("av-biliplus.js", { __INITIAL_STATE__: d }, true);
                }
                this.write();
            }
            /**
             * 实际重写页面过程，依赖__INITIAL_STATE__前置
             */
            write() {
                if (this.isAV__INITIAL_STATE__(API.__INITIAL_STATE__)) {
                    if (!API.__INITIAL_STATE__) throw "无法重写av页 ಥ_ಥ";
                    if (API.__INITIAL_STATE__.videoData.redirect_url) return toast.warning("番剧重定向...", API.__INITIAL_STATE__.videoData.redirect_url);
                    if (API.__INITIAL_STATE__.videoData.stein_guide_cid) return (delete API.path.name, toast.warning("这似乎是个互动视频！", "抱歉！旧版播放器无法支持 ಥ_ಥ"), API.importModule("vector.js"));
                    // 备份还原旧版播放器设置数据
                    API.restorePlayerSetting();
                    API.scriptIntercept(["video-nano"]); // 新版播放器拦截
                    API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
                    API.aid = API.__INITIAL_STATE__.aid;
                    API.tid = API.__INITIAL_STATE__.videoData.tid;
                    (<any>window).__INITIAL_STATE__ = API.__INITIAL_STATE__;
                    config.noVideo && delete (<any>window).__playinfo__;
                    API.rewriteHTML(API.getModule("av.html").replace("static.hdslb.com/js/video.min.js", "cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/video.min.js"));
                    document.title = API.__INITIAL_STATE__.videoData.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                    API.addCss(API.getModule("bofqi.css"));
                    // 移除失效顶栏
                    API.runWhile(() => document.getElementsByClassName("bili-header-m report-wrap-module")[1], () => document.getElementsByClassName("bili-header-m report-wrap-module")[1].remove());
                    // 修复评论跳转
                    (<any>window).commentAgent = { seek: (t: any) => (<any>window).player && (<any>window).player.seek(t) };
                    // 添加点赞功能
                    config.enlike && API.importModule("enLike.js");
                    // 构造媒体页
                    sessionStorage.getItem("medialist") && API.importModule("mediaList.js");
                    // 和作UP主
                    config.upList && API.__INITIAL_STATE__.videoData.staff && API.importModule("upList.js", { staff: API.__INITIAL_STATE__.videoData.staff });
                    // 视频简介中的bv转超链接
                    API.importModule("descBV.js");
                    // 修复原生代码错误
                    API.importModule("hookWebpackJsonp.js");
                    // 互动弹幕
                    config.commandDm && API.importModule("commandDm.js");
                    // 修正分区信息
                    API.importModule("videoSort.js");
                    // 添加媒体控制
                    API.importModule("mediaControl.js", {
                        getPlaylistIndex: () => (<any>window).player.getPlaylistIndex(),
                        mediaInfo: (pid: number, playList: any) => {
                            if (this.isAV__INITIAL_STATE__(API.__INITIAL_STATE__))
                                return {
                                    title: API.__INITIAL_STATE__.videoData.title,
                                    artist: API.__INITIAL_STATE__.videoData.owner.name,
                                    chapterName: playList[pid].part,
                                    coverUrl: [{ src: API.__INITIAL_STATE__.videoData.pic, sizes: "320x180" }]
                                }
                        }
                    })
                    // 跳过充电鸣谢
                    config.electric && API.jsonphook(["api.bilibili.com/x/web-interface/elec/show"], function (xhr) { xhr.url = API.objUrl(xhr.url.split("?")[0], Object.assign(API.urlObj(xhr.url), { aid: 1, mid: 1 })) })
                }
            }
        }
        new Av();
    } catch (e) { debug.error("av.js", e); API.importModule("vector.js"); }
})();