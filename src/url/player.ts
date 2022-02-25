interface modules {
    /** 重写嵌入播放器 */
    readonly "player.js": string;
    readonly "player.html": string;
}
namespace API {
    class Player extends Rewrite {
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
            path.name = "player"; // 重写标记
            this.flushDocument();
            this.onload = () => { this.afterFlush() }
        }
        async afterFlush() {
            if (!Number(this.aid)) {
                if (this.obj.aid) this.aid = <string>abv(this.aid);
                else if (this.bvid) this.aid = <string>abv(this.bvid);
            }
            if (!Number(this.cid)) {
                this.obj = <any>(await urlInputCheck(location.href));
                this.aid = this.obj.aid;
                this.cid = this.obj.cid;
                if (!Number(this.cid)) return toast.error("初始化嵌入式播放器失败！", <any>this.obj);
            }
            const playerParam = { // 基础视频信息
                aid: this.aid,
                cid: this.cid,
                p: getUrlValue("P"),
                // autoplay: getUrlValue("autoplay"), 深恶痛绝
                as_wide: getUrlValue("as_wide"),
                bnj: getUrlValue("bnj"),
                player_type: getUrlValue("player_type"),
                season_type: getUrlValue("season_type")
            }
            if (this.obj.pgc || this.obj.ssid || this.obj.epid) { // pgc额外信息
                Reflect.set(playerParam, "seasonId", this.obj.ssid)
                Reflect.set(playerParam, "episodeId", this.obj.epid)
                Reflect.set(playerParam, "urlparam", `module%3Dbangumi%26season_type%3D${playerParam.season_type}`)
            }
            window.EmbedPlayer("player", "//static.hdslb.com/play.swf", Format.objUrl("", <Record<string, string | number>>playerParam)); // 初始化播放器
            window.addEventListener('message', e => { // 切p等消息推送，来自拜年祭等实现
                if (e.data.aid) {
                    (<any>window).__playinfo__ = undefined;
                    e.data.as_wide = 1;
                    e.data.dashSymbol = true;
                    e.data.p = 1;
                    e.data.pre_ad = "";
                    window.player.destroy();
                    window.player = new (<any>window).BilibiliPlayer(e.data); // 重新初始化播放器
                }
                if (e.data.title) {
                    mediaSession({ // 设置媒体面板
                        title: e.data.title,
                        artist: e.data.author?.name,
                        album: document.title,
                        artwork: [{
                            src: e.data.cover
                        }]
                    })
                }
            })
            window.parent.postMessage("MediaMeta"); // 请求初始媒体面板信息（拜年祭）
        }
    }
    new Player("player.html");
}