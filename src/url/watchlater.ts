interface modules {
    /** 重写稍后再看页面 */
    readonly "watchlater.js": string;
    readonly "watchlater.html": string;
    readonly "mini-bofqi.css": string;
}
namespace API {
    class Watchlater extends Rewrite {
        constructor(html: keyof modules) {
            super(html);
            this.script = [
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.qrcode.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/common/js/footer.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/swfobject.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/account/bili_quick_login.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/phoenix/dist/js/comment.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/mstation/js/upload/moxie.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/mstation/js/upload/plupload.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/elec_2/dist/js/later_elec.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"
                }
            ];
            path.name = "watchlater"; // 重写标记
            this.mediaSession();
            this.flushDocument();
            this.onload = () => { this.afterFlush() }
        }
        mediaSession() {
            jsonphook("api.bilibili.com/x/v2/history/toview/web", undefined, obj => { // 记录稍后再看数据
                switchVideo(async () => { // 切p回调
                    const data = obj.data.list.find((d: any) => d.aid == aid);
                    data && mediaSession({ // 媒体设置面板
                        title: data.pages.find((d: any) => d.cid == cid).part || data.title,
                        artist: data.owner.name,
                        album: data.title,
                        artwork: [{
                            src: data.pic
                        }]
                    })
                })
                return obj;
            })
        }
        afterFlush() {
            window.commentAgent = { seek: (t: number) => window.player && window.player.seek(t) }; // 修复评论跳转
            config.enlike && importModule("enLike.js"); // 添加点赞功能
            addCss(getModule("mini-bofqi.css")); // 修正迷你播放器样式
            importModule("videoSort.js"); // 修正分区信息
            path.forEach(d => { d.includes("av") && (aid = Number((<RegExpExecArray>/[0-9]+/.exec(d))[0])) });
        }
    }
    if (path[5] && path[5].startsWith("watchlater") && config.watchlater) location.replace("https://www.bilibili.com/watchlater/#/"); // 重定向medialist型稍后再看
    new Watchlater("watchlater.html");
}