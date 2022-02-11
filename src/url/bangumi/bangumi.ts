interface modules {
    /**
     * 重写Bangumi页面
     */
    readonly "bangumi.js": string;
    readonly "bangumi.html": string;
}
class Bangumi extends API.rewrite {
    epid = API.path[5].startsWith('ep') ? Number((<string[]>location.href.match(/[0-9]+/))[0]) : null;
    obj: Record<string, any> = {};
    constructor(html: keyof modules) {
        super(html);
        this.script = [
            {
                type: "text/javascript",
                src: "//static.hdslb.com/js/jquery.min.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/js/promise.auto.min.js"
            },
            {
                type: "text/javascript",
                src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
            },
            {
                src: "//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js",
                crossorigin: "",
                defer: "defer"
            },
            {
                src: "//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js",
                crossorigin: "",
                defer: "defer"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/phoenix/dist/js/comment.min.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/common/js/footer.js"
            },
            {
                src: "//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"
            }
        ];
        this.getIniState();
        this.onload = () => { this.afterFlush() }
    }
    async getIniState() {
        API.path.name = "bangumi";
        API.path[5].startsWith('ss') && (this.obj.season_id = location.href.match(/[0-9]+/)[0]);
        API.path[5].startsWith('ep') && (this.obj.ep_id = location.href.match(/[0-9]+/)[0]);
        if (API.uid && !this.epid) {
            const data = await xhr({ url: location.href });
            const arr = data.match(/last_ep_id\"\:[0-9]+/) || [];
            this.epid = (arr[0] && arr[0].split(":")[1]) || null;
        }
        await new Promise(r => {
            if (this.obj.season_id || this.obj.ep_id) {
                xhr({
                    url: Format.objUrl("https://bangumi.bilibili.com/view/web_api/season", this.obj),
                    responseType: "json",
                    credentials: true
                }).then(d => {
                    this.__INITIAL_STATE__ = new API.initialStateOfBangumi(d, this.epid).season();
                    r(true);
                }).catch(e => {
                    toast.error("获取bangumi数据出错！", e);
                    if (config.videoLimit) {
                        xhr({
                            url: Format.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, this.obj),
                            responseType: "json",
                            credentials: true
                        }).then(d => {
                            this.__INITIAL_STATE__ = new API.initialStateOfBangumi(d, this.epid).global();
                            API.limit = true;
                            API.globalLimit = true;
                            r(true);
                        }).catch(e => {
                            debug.error(e);
                        })
                    }
                })
            }
        });
        if (this.__INITIAL_STATE__?.epInfo?.badge === "互动") this.stop("这似乎是个互动番剧！什么！番剧也能互动？可惜旧版播放器不支持 ಥ_ಥ");
        config.bangumiEplist && this.__INITIAL_STATE__?.epList[1] && (this.__INITIAL_STATE__.special = false, this.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined);
        this.appendIniState();
        config.episodeData && API.importModule("episodeData.js"); // 显示分集数据
        API.importModule("restoreData.js"); // 修复页面数据
        API.switchVideo(() => {
            const ep = this.__INITIAL_STATE__.epList.find(d => d.cid == API.cid);
            ep && API.mediaSession({
                title: ep.index_title || this.__INITIAL_STATE__.mediaInfo.title,
                artist: this.__INITIAL_STATE__.upInfo.uname,
                album: this.__INITIAL_STATE__.mediaInfo.title,
                artwork: [{
                    src: ep.cover
                }]
            })
        })
        this.flushDocument();
    }
    appendIniState() {
        if (this.__INITIAL_STATE__.special) {
            const head = document.querySelector<HTMLDivElement>(".z-top-container.has-menu");
            head.classList.remove("has-menu");
            head.style.height = "42px";
            document.querySelector("#app").classList.add("special");
        }
        this.script.unshift({
            type: "text/javascript",
            text: `window.__INITIAL_STATE__=${JSON.stringify(this.__INITIAL_STATE__)};(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());`
        })
    }
    afterFlush() {
        API.runWhile(() => document.querySelector(".new-entry"), () => document.querySelector(".new-entry")?.remove()); // 移除过期节点
        if (document.compatMode === "BackCompat") { // 怪异模式下样式修复
            API.addCss(".header-info .count-wrapper div { height:18px; }.bili-header-m .nav-menu .profile-info .i-face { top:5px; }")
        }
    }
}
new Bangumi("bangumi.html")