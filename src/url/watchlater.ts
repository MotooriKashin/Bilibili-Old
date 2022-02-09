interface modules {
    /**
     * 重写稍后再看页面
     */
    readonly "watchlater.js": string;
    readonly "watchlater.html": string;
    readonly "mini-bofqi.css": string;
}
class Watchlater extends API.rewrite {
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
        API.path.name = "watchlater";
        this.mediaSession();
        this.flushDocument();
        this.onload = () => { this.afterFlush() }
    }
    mediaSession() {
        API.jsonphook("api.bilibili.com/x/v2/history/toview/web", undefined, obj => {
            API.switchVideo(async () => {
                const data = obj.data.list.find(d => d.aid == API.aid);
                data && API.mediaSession({
                    title: data.pages.find(d => d.cid == API.cid).part || data.title,
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
        config.enlike && API.importModule("enLike.js"); // 添加点赞功能
        API.addCss(API.getModule("mini-bofqi.css")); // 修正迷你播放器样式
        API.importModule("videoSort.js"); // 修正分区信息
        API.path.forEach(d => { d.includes("av") && (API.aid = Number(/[0-9]+/.exec(d)[0])) })
    }
}
new Watchlater("watchlater.html");