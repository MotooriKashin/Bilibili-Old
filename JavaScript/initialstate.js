/**
 * @module initialstate
 * @description __INITIAL_STATE__数据配置
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main  */
    const toast = BLOD.toast; /** @see debug */

    class IniState {
        constructor() {
            this.__INITIAL_STATE__ = {
                av: {
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
                        tid: 0,
                        title: 0,
                        tname: 0,
                        videos: 1,
                        embedPlayer: 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=0&aid=0&pre_ad=")'
                    }
                },
                bangumi: {
                    activity: {},
                    app: false,
                    area: 0,
                    canReview: true,
                    epId: 0,
                    epInfo: {},
                    epList: [],
                    epStat: { isPay: true, isVip: false, payPack: 0, status: 1, vipNeedPay: false },
                    isPlayerTrigger: false,
                    loginInfo: {},
                    mdId: 0,
                    mediaInfo: {
                        actors: "",
                        alias: "",
                        areas: [],
                        bkg_cover: "",
                        cover: "",
                        evaluate: "",
                        is_paster_ads: 0,
                        jp_title: "",
                        link: "",
                        media_id: 0,
                        mode: 1,
                        paster_text: "",
                        season_id: 0,
                        season_status: 0,
                        season_title: "",
                        season_type: 1,
                        square_cover: "",
                        staff: "",
                        style: [],
                        title: "",
                        total_ep: 0
                    },
                    mediaRating: {},
                    miniOn: 1,
                    newestEp: {},
                    paster: {},
                    payMent: {},
                    payPack: {},
                    playerRecomList: [],
                    pubInfo: "",
                    recomList: [],
                    rightsInfo: {},
                    seasonFollowed: false,
                    seasonList: [],
                    seasonStat: {},
                    special: false,
                    spending: 0,
                    sponsorTotal: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } },
                    sponsorTotalCount: 0,
                    sponsorWeek: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } },
                    ssId: 0,
                    ssStat: {},
                    upInfo: {},
                    userCoined: 1,
                    userLongReview: {},
                    userScore: -1,
                    userShortReview: {},
                    userStat: {},
                    ver: {}
                },
                index: {
                    recommendData: [],
                    locsData: {
                        31: [{ id: 36585, contract_id: "", pos_num: 1, name: "小黑屋弹幕举报", pic: "https://i0.hdslb.com/bfs/archive/0aa2f32c56cb65b6d453192a3015b65e62537b9a.jpg", litpic: "", url: "https://www.bilibili.com/blackboard/activity-dmjbfj.html", style: 0, agency: "", label: "", intro: "", creative_type: 0, request_id: "1546354354629q172a23a61a62q626", src_id: 32, area: 0, is_ad_loc: true, ad_cb: "", title: "", server_type: 0, cm_mark: 0, stime: 1520478000, mid: "14629218" }]
                    },
                }
            }

            BLOD.iniState = {
                av: (data) => this.av(data),
                avPlus: (data) => this.avPlus(data),
                bangumi: (data, epId) => this.bangumi(data, epId),
                thaiBangumi: (data, epId) => this.thaiBangumi(data, epId),
                index: (data) => this.index(data)
            };
        }
        /**
         * 构造av页数据，使用B站API
         * @param {string} data 远程返回的json字符串
         */
        av(data) {
            try {
                data = BLOD.jsonCheck(data).data;
                let __INITIAL_STATE__ = this.__INITIAL_STATE__.av;
                __INITIAL_STATE__.aid = data.View.aid;
                __INITIAL_STATE__.related = data.Related || [];
                __INITIAL_STATE__.tags = data.Tags || [];
                __INITIAL_STATE__.upData = data.Card.card || {};
                __INITIAL_STATE__.upData.archiveCount = data.Card.archive_count;
                __INITIAL_STATE__.videoData = data.View || {};
                __INITIAL_STATE__.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + data.View.cid + '&aid=' + data.View.aid + '&pre_ad=")'

                if (__INITIAL_STATE__.videoData.staff) BLOD.staff = __INITIAL_STATE__.videoData.staff;
                return __INITIAL_STATE__;
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("__INITIAL_STATE__", ...e); }
        }
        /**
         * 构造av页数据，使用Biliplus源
         * @param {string} data 远程返回的json字符串
         */
        avPlus(data) {
            try {
                data = BLOD.jsonCheck(data);
                // 处理重定向
                if (data.v2_app_api && data.v2_app_api.redirect_url) location.href = data.v2_app_api.redirect_url;
                if (data.bangumi && data.bangumi.ogv_play_url) location.href = data.bangumi.ogv_play_url;

                let __INITIAL_STATE__ = this.__INITIAL_STATE__.av;
                __INITIAL_STATE__.aid = data.aid || BLOD.aid;
                __INITIAL_STATE__.upData.name = data.author;
                __INITIAL_STATE__.upData.mid = data.mid;
                __INITIAL_STATE__.videoData.aid = data.aid || BLOD.aid;
                __INITIAL_STATE__.videoData.cid = data.list[0].cid;
                __INITIAL_STATE__.videoData.ctime = data.created;
                __INITIAL_STATE__.videoData.pubdate = data.created;
                __INITIAL_STATE__.videoData.desc = data.description;
                __INITIAL_STATE__.videoData.pages[0].cid = data.list[0].cid;
                __INITIAL_STATE__.videoData.stat.aid = data.aid;
                __INITIAL_STATE__.videoData.stat.coin = data.coins;
                __INITIAL_STATE__.videoData.stat.danmaku = data.video_review;
                __INITIAL_STATE__.videoData.stat.favorite = data.favorites;
                __INITIAL_STATE__.videoData.stat.reply = data.review;
                __INITIAL_STATE__.videoData.stat.view = data.play;
                __INITIAL_STATE__.videoData.tid = data.tid;
                __INITIAL_STATE__.videoData.title = data.title;
                __INITIAL_STATE__.videoData.tname = data.typename;
                if (data.v2_app_api) {
                    __INITIAL_STATE__.tags = data.v2_app_api.tag;
                    __INITIAL_STATE__.videoData = data.v2_app_api
                }
                __INITIAL_STATE__.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + data.list[0].cid + '&aid=' + data.aid + '&pre_ad=")';
                // 禁用部分功能
                BLOD.config.reset.like = 0;
                BLOD.avPlus = true;

                return __INITIAL_STATE__;
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("__INITIAL_STATE__", ...e); }
        }
        /**
         * 构造bangumi数据
         * @param {string} data 远程返回的json字符串
         * @param {number} [epId] epid数据
         */
        bangumi(data, epId) {
            // https://bangumi.bilibili.com/view/web_api/season
            epId = 1 * epId || null;
            data = BLOD.jsonCheck(data).result;
            let ids = [];
            data.episodes.forEach(d => {
                ids.push(d.ep_id);
                if (d.badge == "会员" || d.badge_type) BLOD.ids.push(d.cid)
            });

            let __INITIAL_STATE__ = this.__INITIAL_STATE__.bangumi;
            __INITIAL_STATE__.activity = data.activity || {};
            __INITIAL_STATE__.epId = epId || ids[0];
            __INITIAL_STATE__.epInfo = data.episodes[ids.indexOf(epId)] || data.episodes[0];
            __INITIAL_STATE__.epList = data.episodes;
            __INITIAL_STATE__.mdId = data.media_id;
            __INITIAL_STATE__.mediaInfo.actors = data.actors;
            __INITIAL_STATE__.mediaInfo.alias = data.alias;
            __INITIAL_STATE__.mediaInfo.areas = data.areas;
            __INITIAL_STATE__.mediaInfo.bkg_cover = data.bkg_cover;
            __INITIAL_STATE__.mediaInfo.cover = data.cover;
            __INITIAL_STATE__.mediaInfo.evaluate = data.evaluate;
            __INITIAL_STATE__.mediaInfo.is_paster_ads = data.is_paster_ads;
            __INITIAL_STATE__.mediaInfo.jp_title = data.jp_title;
            __INITIAL_STATE__.mediaInfo.link = data.link;
            __INITIAL_STATE__.mediaInfo.media_id = data.media_id;
            __INITIAL_STATE__.mediaInfo.mode = data.mode;
            __INITIAL_STATE__.mediaInfo.paster_text = data.paster_text;
            __INITIAL_STATE__.mediaInfo.season_id = data.season_id;
            __INITIAL_STATE__.mediaInfo.season_status = data.season_status;
            __INITIAL_STATE__.mediaInfo.season_title = data.season_title;
            __INITIAL_STATE__.mediaInfo.season_type = data.season_type;
            __INITIAL_STATE__.mediaInfo.square_cover = data.square_cover;
            __INITIAL_STATE__.mediaInfo.staff = data.staff;
            __INITIAL_STATE__.mediaInfo.style = data.style;
            __INITIAL_STATE__.mediaInfo.title = data.title;
            __INITIAL_STATE__.mediaInfo.total_ep = data.total_ep;
            __INITIAL_STATE__.mediaRating = data.rating || {};
            __INITIAL_STATE__.newestEp = data.newest_ep;
            __INITIAL_STATE__.payMent = data.payment || {};
            __INITIAL_STATE__.pubInfo = data.publish;
            __INITIAL_STATE__.rightsInfo = data.rights;
            __INITIAL_STATE__.seasonList = data.seasons || [];
            __INITIAL_STATE__.seasonStat = data.stat;
            __INITIAL_STATE__.special = data.bkg_cover ? true : false;
            __INITIAL_STATE__.ssId = data.season_id;
            __INITIAL_STATE__.upInfo = data.up_info;

            return __INITIAL_STATE__;
        }
        /**
         * 处理泰区隐藏番剧
         * @param {string} data xhr返回的json字符串
         * @param {number} epId epid数据
         * @returns 
         */
        thaiBangumi(data, epId) {
            // https://api.global.bilibili.com/view/web_api/season
            epId = 1 * epId || null;
            data = BLOD.jsonCheck(data).result;
            let ids = [], epList = [];
            data.modules.forEach(d => {
                d.data.episodes.forEach(d => {
                    d.ctime = "";
                    d.duration = 1;
                    d.ep_id = d.id;
                    d.episode_status = d.status;
                    d.index = d.title;
                    d.index_title = d.long_title;
                    d.mid = 2;
                    d.page = 1;
                    d.premiere = false;
                    d.pub_real_time = "";
                    d.section_id = 0;
                    d.section_type = 0;
                    d.vid = "";
                    epList.push(d);
                    ids.push(d.id);
                })
            });
            let __INITIAL_STATE__ = this.__INITIAL_STATE__.bangumi;
            __INITIAL_STATE__.activity = data.activity_dialog || {};
            __INITIAL_STATE__.epId = epId || ids[0];
            __INITIAL_STATE__.epInfo = epList[ids.indexOf(epId)] || epList[0];
            __INITIAL_STATE__.epList = epList;
            __INITIAL_STATE__.mediaInfo.actors = data.actor.info;
            __INITIAL_STATE__.mediaInfo.alias = data.alias;
            __INITIAL_STATE__.mediaInfo.areas = data.areas;
            __INITIAL_STATE__.mediaInfo.cover = data.cover;
            __INITIAL_STATE__.mediaInfo.evaluate = data.evaluate;
            __INITIAL_STATE__.mediaInfo.link = data.link;
            __INITIAL_STATE__.mediaInfo.mode = data.mode;
            __INITIAL_STATE__.mediaInfo.season_id = data.season_id;
            __INITIAL_STATE__.mediaInfo.season_status = data.season_status;
            __INITIAL_STATE__.mediaInfo.season_title = data.season_title;
            __INITIAL_STATE__.mediaInfo.staff = data.staff;
            __INITIAL_STATE__.mediaInfo.style = data.styles;
            __INITIAL_STATE__.mediaInfo.title = data.title;
            __INITIAL_STATE__.mediaInfo.total_ep = ids.length;
            __INITIAL_STATE__.newestEp = data.new_ep;
            __INITIAL_STATE__.pubInfo = data.publish;
            __INITIAL_STATE__.pubInfo.is_started = 1;
            __INITIAL_STATE__.rightsInfo = data.rights;
            __INITIAL_STATE__.seasonStat = data.stat;
            __INITIAL_STATE__.ssId = data.season_id;


            return __INITIAL_STATE__;
        }
        /**
         * 构造主页数据
         * @param {string} data 远程返回的json字符串
         */
        index(data) {
            try {
                data = JSON.parse(data);
                let __INITIAL_STATE__ = this.__INITIAL_STATE__.index;
                data.recommendData && data.recommendData.item.forEach(i => {
                    __INITIAL_STATE__.recommendData.push({
                        aid: BLOD.abv(i.bvid),
                        typename: "",
                        title: i.title,
                        subtitle: "",
                        play: i.stat.view,
                        review: "",
                        video_review: "",
                        favorites: "",
                        mid: i.owner.mid,
                        author: i.owner.name,
                        creat: "",
                        pic: i.pic,
                        coins: "",
                        duration: i.duration,
                        badgepay: false,
                        rights: ""
                    })
                });
                __INITIAL_STATE__.locsData = data.locsData;
                __INITIAL_STATE__.locsData[23] = data.locsData[3197];
                return __INITIAL_STATE__;
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("__INITIAL_STATE__", ...e); }
        }

    }
    new IniState();

})();
