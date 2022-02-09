interface modules {
    /**
     * 重写av页面
     */
    readonly "av.js": string;
    /**
     * av页脚本框架
     */
    readonly "av.html": string;
}
class Av extends API.rewrite {
    constructor(html: keyof modules) {
        super(html);
        this.script = [
            {
                type: "text/javascript",
                src: "//static.hdslb.com/js/jquery.min.js"
            },
            {
                type: "text/javascript",
                src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
            },
            {
                type: "text/javascript",
                text: `window.getInternetExplorerVersion=function(){var rv=-1;if(navigator.appName=="Microsoft Internet Explorer"){var ua=navigator.userAgent;var re=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");if(re.exec(ua)!=null){rv=parseFloat(RegExp.$1)}}return rv};function getQueryString(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");var r=window.location.search.substr(1).match(reg);if(r!=null){return unescape(r[2])}return null}`
            },
            {
                src: "//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js",
                crossorigin: "",
                defer: "defer"
            },
            {
                src: "//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js",
                crossorigin: "",
                defer: "defer"
            },
            {
                src: "//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js",
                crossorigin: "",
                defer: "defer"
            },
            {
                type: "text/javascript",
                text: `var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&getInternetExplorerVersion()!==9){$("#__bofqi").innerHTML='<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>';if(vd.embedPlayer){var p=getQueryString("p")?getQueryString("p")-1:0;var player={aid:vd.aid,cid:(vd.pages[p]&&vd.pages[p].cid)||vd.pages[0].cid};EmbedPlayer("player","//static.hdslb.com/play.swf","cid="+player.cid+"&aid="+player.aid+"&pre_ad=")}if(vd.embed){$("#bofqi").html(vd.embed)}}else{$("#bofqi").remove()};`,
                defer: "defer"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/phoenix/dist/js/comment.min.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/js/jquery.qrcode.min.js"
            },
            {
                type: "text/javascript",
                charset: "utf-8",
                src: "//static.hdslb.com/common/js/footer.js"
            }
        ];
        this.getIniState();
        this.onload = () => { this.afterFlush() }
    }
    async getIniState() {
        if (API.path[4].toLowerCase().startsWith('bv')) API.aid = <number>API.abv(API.path[4].split("#")[0].split("?")[0]);
        API.aid = API.aid || Number((<RegExpExecArray>/[0-9]+/.exec(String(API.path[4])))[0]);
        API.path.name = "av";
        await new Promise(r => {
            xhr({
                url: Format.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: API.aid }),
                responseType: "json",
                credentials: true
            }).then(d => {
                this.__INITIAL_STATE__ = new API.initialStateOfAv(d).detail();
                this.appendIniState();
                r(true);
            }).catch(e => {
                toast.error(`获取av号信息失败，尝试访问第三方接口~`, e);
                xhr({
                    url: Format.objUrl("https://www.biliplus.com/api/view", { id: API.aid, update: 1 }),
                    responseType: "json"
                }).then(d => {
                    this.__INITIAL_STATE__ = new API.initialStateOfAv(d).plus();
                    this.appendIniState();
                    r(true);
                }).catch(e => {
                    toast.error(`第三方接口也没有获取到有效数据~`, e);
                    new API.url().getJson("api.bilibili.com/view", { id: API.aid, page: this.url.searchParams.get("p") }).then(d => {
                        this.__INITIAL_STATE__ = new API.initialStateOfAv(d).view();
                        this.appendIniState();
                        API.switchVideo(() => { toast.warning("这可能是个Bangumi，可惜未能获取到ssid，无法跳转~") });
                        r(true);
                    }).catch(e => {
                        toast.error(`上古接口还是没能获取到有效数据~`);
                        throw e;
                    })
                })
            })
        });
        if (this.__INITIAL_STATE__.videoData.redirect_url) return toast.warning("番剧重定向...", this.__INITIAL_STATE__.videoData.redirect_url);
        if (this.__INITIAL_STATE__.videoData.stein_guide_cid) this.stop("这似乎是个互动视频！抱歉！旧版播放器无法支持 ಥ_ಥ");
        API.aid = this.__INITIAL_STATE__.aid;
        API.tid = this.__INITIAL_STATE__.videoData.tid;
        API.switchVideo(() => {
            API.mediaSession({
                title: this.__INITIAL_STATE__.videoData.pages.find(t => t.cid == API.cid).part || this.__INITIAL_STATE__.videoData.title,
                artist: this.__INITIAL_STATE__.videoData.owner.name,
                album: this.__INITIAL_STATE__.videoData.title,
                artwork: [{
                    src: this.__INITIAL_STATE__.videoData.pic
                }]
            })
        })
        this.flushDocument();
    }
    appendIniState() {
        this.script.unshift({
            type: "text/javascript",
            text: `window.__INITIAL_STATE__=${JSON.stringify(this.__INITIAL_STATE__)};(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());`
        })
    }
    afterFlush() {
        API.runWhile(() => document.getElementsByClassName("bili-header-m report-wrap-module")[1], () => document.getElementsByClassName("bili-header-m report-wrap-module")[1].remove()); // 移除失效顶栏
        window.commentAgent = { seek: (t: number) => window.player && window.player.seek(t) }; // 修复评论跳转
        API.importModule("hookWebpackJsonp.js"); // 修复原生代码错误
        config.enlike && API.importModule("enLike.js"); // 添加点赞功能
        config.upList && this.__INITIAL_STATE__.videoData.staff && API.importModule("upList.js", { staff: this.__INITIAL_STATE__.videoData.staff }); // 合作UP主
        API.importModule("descBV.js"); // 修复简介中超链接
        config.commandDm && API.importModule("commandDm.js"); // 互动弹幕
        API.importModule("videoSort.js"); // 修正分区信息
        config.electric && API.jsonphook("api.bilibili.com/x/web-interface/elec/show", url => Format.objUrl(url, { aid: 1, mid: 1 }));
        /dmid/.test(location.href) && /dm_progress/.test(location.href) && API.importModule("loadByDmid.js");
    }
}
if (/\/s\//.test(location.href)) location.replace(location.href.replace("s/video", "video"));
new Av("av.html");