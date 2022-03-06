interface modules {
    /** 重写Bangumi页面 */
    readonly "bangumi.js": string;
    readonly "bangumi.html": string;
}
namespace API {
    class Bangumi extends Rewrite {
        epid = path[5].startsWith('ep') ? Number((<string[]>location.href.match(/[0-9]+/))[0]) : null;
        /** 页面数据请求参数 */
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
            path.name = "bangumi"; // 重写标记
            pgc = true; // pgc标记
            path[5].startsWith('ss') && (this.obj.season_id = (<any>location.href).match(/[0-9]+/)[0]);
            path[5].startsWith('ep') && (this.obj.ep_id = (<any>location.href).match(/[0-9]+/)[0]);
            if (uid && !this.epid) { // ss页面需要获取历史ep信息
                const data = await xhr({ url: location.href });
                const arr = data.match(/last_ep_id\"\:[0-9]+/) || [];
                this.epid = (arr[0] && arr[0].split(":")[1]) || null;
            }
            await new Promise(r => { // 请求页面信息并构造__INITIAL_STATE__
                if (this.obj.season_id || this.obj.ep_id) {
                    xhr({ // 默认接口
                        url: Format.objUrl("https://bangumi.bilibili.com/view/web_api/season", this.obj),
                        responseType: "json",
                        credentials: true
                    }).then(d => {
                        this.__INITIAL_STATE__ = new InitialStateOfBangumi(d, <number>this.epid).season();
                        r(true);
                    }).catch(e => { // 泰区接口
                        toast.error("获取bangumi数据出错！", e);
                        if (config.videoLimit) {
                            this.obj.access_key = GM.getValue("access_key", "");
                            xhr({
                                url: Format.objUrl(`${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season`, this.obj),
                                responseType: "json",
                                credentials: true
                            }).then(d => {
                                this.__INITIAL_STATE__ = new InitialStateOfBangumi(d, <number>this.epid).global();
                                limit = true;
                                globalLimit = true;
                                r(true);
                            }).catch(e => {
                                toast.error(e);
                            })
                        }
                    })
                }
            });
            if (this.__INITIAL_STATE__?.epInfo?.badge === "互动") this.stop("这似乎是个互动番剧！什么！番剧也能互动？可惜旧版播放器不支持 ಥ_ಥ");
            config.bangumiEplist && this.__INITIAL_STATE__?.epList[1] && (this.__INITIAL_STATE__.special = false, this.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined); // 特殊背景
            this.appendIniState();
            config.episodeData && importModule("episodeData.js"); // 显示分集数据
            importModule("restoreData.js"); // 修复页面数据
            switchVideo(() => { // 切p回调
                const ep = this.__INITIAL_STATE__.epList.find((d: any) => d.cid == cid);
                ep && mediaSession({
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
            if (this.__INITIAL_STATE__.special) { // 特殊背景页面样式修改
                const head: any = document.querySelector<HTMLDivElement>(".z-top-container.has-menu");
                head.classList.remove("has-menu");
                head.style.height = "42px";
                document.querySelector<any>("#app").classList.add("special");
            }
            this.script.unshift({ // 写入__INITIAL_STATE__
                type: "text/javascript",
                text: `window.__INITIAL_STATE__=${JSON.stringify(this.__INITIAL_STATE__)};(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());`
            })
        }
        afterFlush() {
            config.enlike && importModule("enLike.js"); // 添加点赞功能
            runWhile(() => document.querySelector(".new-entry"), () => document.querySelector(".new-entry")?.remove()); // 移除过期节点
            if (document.compatMode === "BackCompat") { // 怪异模式下样式修复
                addCss(".header-info .count-wrapper div, .ulike { height:18px !important; }.bili-header-m .nav-menu .profile-info .i-face { top:5px; }")
            }
        }
    }
    new Bangumi("bangumi.html");
}