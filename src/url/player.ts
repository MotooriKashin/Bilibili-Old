interface modules {
    /**
     * 重写嵌入播放器
     */
    readonly "player.js": string;
    readonly "player.html": string;
}
class Player extends API.rewrite {
    obj = Format.urlObj(location.href);
    aid = this.obj.aid || this.obj.avid;
    bvid = this.obj.bvid;
    cid = this.obj.cid;
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
                src: "//static.hdslb.com/player/js/whitelist.js"
            }
        ];
        API.path.name = "player";
        this.flushDocument();
        this.onload = () => { this.afterFlush() }
    }
    async afterFlush() {
        if (!Number(this.aid)) {
            if (this.obj.aid) this.aid = <string>API.abv(this.aid);
            else if (this.bvid) this.aid = <string>API.abv(this.bvid);
        }
        if (!Number(this.cid)) {
            this.obj = <any>(await API.urlInputCheck(location.href));
            this.aid = this.obj.aid;
            this.cid = this.obj.cid;
            if (!Number(this.cid)) return toast.error("初始化嵌入式播放器失败！", <any>this.obj);
        }
        const playerParam = { // 基础视频信息
            aid: this.aid,
            cid: this.cid,
            p: API.getUrlValue("P"),
            // autoplay: API.getUrlValue("autoplay"), 深恶痛绝
            as_wide: API.getUrlValue("as_wide"),
            bnj: API.getUrlValue("bnj"),
            player_type: API.getUrlValue("player_type"),
            season_type: API.getUrlValue("season_type")
        }
        if (this.obj.pgc || this.obj.ssid || this.obj.epid) {
            playerParam["seasonId"] = this.obj.ssid;
            playerParam["episodeId"] = this.obj.epid;
            playerParam["urlparam"] = `module%3Dbangumi%26season_type%3D${playerParam.season_type}`;
        }
        window.EmbedPlayer("player", "//static.hdslb.com/play.swf", Format.objUrl("", playerParam));
        window.addEventListener('message', e => {
            if (e.data.aid) {
                (<any>window).__playinfo__ = undefined;
                e.data.as_wide = 1;
                e.data.dashSymbol = true;
                e.data.p = 1;
                e.data.pre_ad = "";
                // history.replaceState(undefined, undefined, Format.objUrl("https://www.bilibili.com/blackboard/html5player.html", { aid: e.data.aid, cid: e.data.cid }));
                window.player.destroy();
                window.player = new (<any>window).BilibiliPlayer(e.data);
            }
            if (e.data.title) {
                API.mediaSession({
                    title: e.data.title,
                    artist: e.data.author?.name,
                    album: document.title,
                    artwork: [{
                        src: e.data.cover
                    }]
                })
            }
        })
        window.parent.postMessage("MediaMeta");
    }
}
new Player("player.html")