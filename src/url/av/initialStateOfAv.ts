interface modules {
    /** Av页`__INITIAL_STATE__`重构工具 */
    readonly "initialStateOfAv.js": string;
}
namespace API {
    export class InitialStateOfAv {
        __INITIAL_STATE__ = {
            aid: 0,
            comment: { count: 0, list: [] },
            error: {},
            isClient: false,
            p: "",
            player: "",
            playurl: "",
            related: [],
            tags: [],
            upData: {
                face: "https://static.hdslb.com/images/akari.jpg",
                name: "",
                mid: 0,
                DisplayRank: "0",
                Official: { desc: "", role: 0, title: "", type: -1 },
                approve: false,
                archiveCount: 0,
                article: 0,
                attention: 10,
                attentions: [],
                birthday: "",
                description: "",
                fans: 44616,
                friend: 10,
                level_info: { current_exp: 0, current_level: 6, current_min: 0, next_exp: 0 },
                nameplate: { condition: "", image: "", image_small: "", level: "", name: "", mid: 0 },
                official_verify: { desc: "", type: -1 },
                pendant: { expire: 0, image: "", image_enhance: "", image_enhance_frame: "", name: "", pid: 0 },
                place: "",
                rank: 10000,
                regtime: 0,
                sex: "保密",
                sign: "",
                spacesta: 0,
                vip: { accessStatus: 0, dueRemark: "", theme_type: 0, vipStatus: 0, vipStatusWarn: "", vipType: 1 }
            },
            videoData: {
                aid: 0,
                cid: 0,
                config: { relates_title: "相关推荐", share_style: 1 },
                copyright: 2,
                ctime: "",
                desc: "",
                dimension: { height: 1080, rotate: 0, width: 1920 },
                duration: 360,
                dynamic: "",
                owner: {},
                pages: [{ cid: 0, dimension: { height: 1080, rotate: 0, width: 1920 }, duration: 360, from: "vupload", page: 1, part: "", vid: "", weblink: "" }],
                pic: "",
                pubdate: "",
                redirect_url: undefined,
                rights: { autoplay: 0, bp: 0, download: 0, elec: 0, hd5: 0, is_cooperation: 0, movie: 0, no_background: 0, no_reprint: 0, pay: 0, ugc_pay: 0, ugc_pay_preview: 0 },
                stat: {
                    aid: 0,
                    coin: 0,
                    danmaku: 0,
                    dislike: 0,
                    favorite: 0,
                    his_rank: 0,
                    like: 0,
                    now_rank: 0,
                    reply: 0,
                    share: 0,
                    view: 0
                },
                state: 0,
                stein_guide_cid: undefined,
                tid: 0,
                title: 0,
                tname: 0,
                videos: 1,
                embedPlayer: 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid:0&aid:0&pre_ad:")'
            }
        };
        data: any;
        constructor(data: any) {
            this.data = data;
        }
        detail() {
            this.data = jsonCheck(this.data).data;
            if (!this.data.View.cid && this.data.View.forward) {
                toast.warning("视频撞车了！正在跳转至原视频~");
                location.href = `https://www.bilibili.com/video/av${this.data.View.forward}`;
            }
            this.__INITIAL_STATE__.aid = this.data.View.aid;
            this.__INITIAL_STATE__.related = this.data.Related || [];
            this.__INITIAL_STATE__.tags = this.data.Tags || [];
            this.__INITIAL_STATE__.upData = this.data.Card.card || {};
            this.__INITIAL_STATE__.upData.archiveCount = this.data.Card.archive_count;
            this.__INITIAL_STATE__.videoData = this.data.View || {};
            this.__INITIAL_STATE__.videoData.embedPlayer = `EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=${this.data.View.cid}&aid=${this.data.View.aid}&pre_ad=")`;
            return this.__INITIAL_STATE__;
        }
        plus() {
            this.data = jsonCheck(this.data);
            this.data.v2_app_api && this.data.v2_app_api.redirect_url && (location.href = this.data.v2_app_api.redirect_url);
            this.data.bangumi && this.data.bangumi.ogv_play_url && (location.href = this.data.bangumi.ogv_play_url);

            this.__INITIAL_STATE__.aid = this.data.aid || aid;
            this.__INITIAL_STATE__.upData.name = this.data.author;
            this.__INITIAL_STATE__.upData.mid = this.data.mid;
            this.__INITIAL_STATE__.videoData.aid = this.data.aid || aid;
            this.__INITIAL_STATE__.videoData.cid = this.data.list[0].cid;
            this.__INITIAL_STATE__.videoData.ctime = this.data.created;
            this.__INITIAL_STATE__.videoData.pubdate = this.data.created;
            this.__INITIAL_STATE__.videoData.desc = this.data.description;
            this.__INITIAL_STATE__.videoData.pages[0].cid = this.data.list[0].cid;
            this.__INITIAL_STATE__.videoData.stat.aid = this.data.aid;
            this.__INITIAL_STATE__.videoData.stat.coin = this.data.coins;
            this.__INITIAL_STATE__.videoData.stat.danmaku = this.data.video_review;
            this.__INITIAL_STATE__.videoData.stat.favorite = this.data.favorites;
            this.__INITIAL_STATE__.videoData.stat.reply = this.data.review;
            this.__INITIAL_STATE__.videoData.stat.view = this.data.play;
            this.__INITIAL_STATE__.videoData.tid = this.data.tid;
            this.__INITIAL_STATE__.videoData.title = this.data.title;
            this.__INITIAL_STATE__.videoData.tname = this.data.typename;
            this.data.v2_app_api && (this.__INITIAL_STATE__.tags = this.data.v2_app_api.tag, this.__INITIAL_STATE__.videoData = this.data.v2_app_api);
            this.__INITIAL_STATE__.videoData.embedPlayer = `EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=${this.data.list[0].cid}&aid=${this.data.aid}&pre_ad=")`;
            switchVideo(() => bofqiMessage(["视频已失效", "加载弹幕", "缓存信息仅供参考"], 3));
            return this.__INITIAL_STATE__;
        }
        view() {
            this.data = jsonCheck(this.data);
            this.__INITIAL_STATE__.aid = aid;
            this.__INITIAL_STATE__.tags = this.data.tag || [];
            this.__INITIAL_STATE__.upData.name = this.data.author;
            this.__INITIAL_STATE__.upData.face = this.data.face;
            this.__INITIAL_STATE__.upData.mid = this.data.mid;
            this.__INITIAL_STATE__.videoData.aid = aid;
            this.__INITIAL_STATE__.videoData.cid = this.data.cid;
            this.__INITIAL_STATE__.videoData.ctime = this.data.created;
            this.__INITIAL_STATE__.videoData.pubdate = this.data.created;
            this.__INITIAL_STATE__.videoData.desc = this.data.description;
            this.__INITIAL_STATE__.videoData.pages[0].cid = this.data.cid;
            this.__INITIAL_STATE__.videoData.stat.aid = aid;
            this.__INITIAL_STATE__.videoData.stat.coin = this.data.coins;
            this.__INITIAL_STATE__.videoData.stat.danmaku = this.data.video_review;
            this.__INITIAL_STATE__.videoData.stat.favorite = this.data.favorites;
            this.__INITIAL_STATE__.videoData.stat.reply = this.data.review;
            this.__INITIAL_STATE__.videoData.stat.view = this.data.play;
            this.__INITIAL_STATE__.videoData.tid = this.data.tid;
            this.__INITIAL_STATE__.videoData.title = this.data.title;
            this.__INITIAL_STATE__.videoData.tname = this.data.typename;
            this.__INITIAL_STATE__.videoData.embedPlayer = `EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=${this.data.cid}&aid=${aid}&pre_ad=")`;
            return this.__INITIAL_STATE__;
        }
    }
}