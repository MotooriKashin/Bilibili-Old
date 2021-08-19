/**
 * 本模块负责重构av/BV页__INITIAL_STATE__
 * 请以`__INITIAL_STATE__`名义传入原始数据，重构结果以API对象的同名属性的形式返回
 * 原始数据对应来源`//www.biliplus.com/api/view?aid`
 * 重构__INITIAL_STATE__是非常精细的工具，请务必耐心细致
 * 由于数据来源于Ajax，具有非常高的不确定性，主体代码请务必写在`try{}catch{}`结构中以免报错
 */
(function () {
    try {
        const result: AV__INITIAL_STATE__ = {
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
        }
        let data = API.jsonCheck(__INITIAL_STATE__);
        // 处理重定向
        data.v2_app_api && data.v2_app_api.redirect_url && (location.href = data.v2_app_api.redirect_url);
        data.bangumi && data.bangumi.ogv_play_url && (location.href = data.bangumi.ogv_play_url);
        result.aid = data.aid || API.aid;
        result.upData.name = data.author;
        result.upData.mid = data.mid;
        result.videoData.aid = data.aid || API.aid;
        result.videoData.cid = data.list[0].cid;
        result.videoData.ctime = data.created;
        result.videoData.pubdate = data.created;
        result.videoData.desc = data.description;
        result.videoData.pages[0].cid = data.list[0].cid;
        result.videoData.stat.aid = data.aid;
        result.videoData.stat.coin = data.coins;
        result.videoData.stat.danmaku = data.video_review;
        result.videoData.stat.favorite = data.favorites;
        result.videoData.stat.reply = data.review;
        result.videoData.stat.view = data.play;
        result.videoData.tid = data.tid;
        result.videoData.title = data.title;
        result.videoData.tname = data.typename;
        data.v2_app_api && (result.tags = data.v2_app_api.tag, result.videoData = data.v2_app_api);
        result.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + data.list[0].cid + '&aid=' + data.aid + '&pre_ad=")';
        // API.switchVideo(()=>API.debug.msg(300,"视频已失效","加载弹幕","缓存信息仅供参考",true,()=>API.importModule("")))
    } catch (e) { API.debug.trace(e, "av-biliplus.js"), true }
})();