/*
 * @module "initialstate.js"
 * @description initialstate数据配置，以iniState对象挂载在BLOD下
 */

(function () {
    const BLOD = window.BLOD;

    class IniState {
        constructor() {
            console.debug('import module "initialstate.js"')
        }
        av(data) {
            try {
                let aid = BLOD.aid, cid = BLOD.cid;
                data = BLOD.jsonCheck(data).data;
                aid = aid || data.View.aid;
                cid = cid || data.View.cid;
                return {
                    "aid": aid,
                    "comment": { count: 0, list: [] },
                    "error": {},
                    "isClient": false,
                    "p": "",
                    "player": "",
                    "playurl": {},
                    "related": data.Related || [],
                    "tags": data.Tags || [],
                    "upData": Object.assign(data.Card.card, { "archiveCount": data.Card.archive_count }),
                    "videoData": Object.assign(data.View, { "embedPlayer": 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + cid + '&aid=' + aid + '&pre_ad=")' })
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; BLOD.debug.error("__INITIAL_STATE__·av/BV", ...e) }
        }
        avPlus(data) {
            try {
                let aid = BLOD.aid, cid = BLOD.cid;
                data = BLOD.jsonCheck(data);
                aid = aid || data.aid;
                cid = cid || data.list[0].cid;
                if (data.v2_app_api && data.v2_app_api.redirect_url) location.href = data.v2_app_api.redirect_url;
                if (data.bangumi && data.bangumi.ogv_play_url) location.href = data.bangumi.ogv_play_url;
                BLOD.config.reset.like = 0;
                BLOD.avPlus = true;
                return Object.assign({
                    "aid": aid,
                    "comment": { count: 0, list: [] },
                    "error": {},
                    "isClient": false,
                    "p": "",
                    "player": "",
                    "playurl": {},
                    "related": [],
                    "tags": [],
                    "upData": Object.assign({ "face": (data.v2_app_api && data.v2_app_api.owner && data.v2_app_api.owner.face) || "https://static.hdslb.com/images/akari.jpg", name: data.author, mid: data.mid }, { "DisplayRank": "0", "Official": { "desc": "", "role": 0, "title": "", "type": -1 }, "approve": false, "archiveCount": 0, "article": 0, "attention": 10, "attentions": [], "birthday": "", "description": "", "fans": 44616, "friend": 10, "level_info": { "current_exp": 0, "current_level": 6, "current_min": 0, "next_exp": 0 }, "nameplate": { "condition": "", "image": "", "image_small": "", "level": "", "name": "", "nid": 0 }, "official_verify": { "desc": "", "type": -1 }, "pendant": { "expire": 0, "image": "", "image_enhance": "", "image_enhance_frame": "", "name": "", "pid": 0 }, "place": "", "rank": "10000", "regtime": 0, "sex": "保密", "sign": "", "spacesta": 0, "vip": { "accessStatus": 0, "dueRemark": "", "theme_type": 0, "vipStatus": 0, "vipStatusWarn": "", "vipType": 1 } }),
                    "videoData": Object.assign({ "aid": aid, "cid": cid, "config": { "relates_title": "相关推荐", "share_style": 1 }, "copyright": 2, "ctime": data.created, "desc": data.description, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 360, "dynamic": "", "owner": Object.assign({ "face": (data.v2_app_api && data.v2_app_api.owner && data.v2_app_api.owner.face) || "https://static.hdslb.com/images/akari.jpg", name: data.author, mid: data.mid }, { "DisplayRank": "0", "Official": { "desc": "", "role": 0, "title": "", "type": -1 }, "approve": false, "archiveCount": 0, "article": 0, "attention": 10, "attentions": [], "birthday": "", "description": "", "fans": 44616, "friend": 10, "level_info": { "current_exp": 0, "current_level": 6, "current_min": 0, "next_exp": 0 }, "nameplate": { "condition": "", "image": "", "image_small": "", "level": "", "name": "", "nid": 0 }, "official_verify": { "desc": "", "type": -1 }, "pendant": { "expire": 0, "image": "", "image_enhance": "", "image_enhance_frame": "", "name": "", "pid": 0 }, "place": "", "rank": "10000", "regtime": 0, "sex": "保密", "sign": "", "spacesta": 0, "vip": { "accessStatus": 0, "dueRemark": "", "theme_type": 0, "vipStatus": 0, "vipStatusWarn": "", "vipType": 1 } }), "pages": [{ "cid": cid, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 360, "from": "vupload", "page": 1, "part": "", "vid": "", "weblink": "" }], "pic": data.pic, "pubdate": data.created, "rights": { "autoplay": 0, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 0, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": aid, "coin": data.coins, "danmaku": data.video_review, "dislike": 0, "favorite": data.favorites, "his_rank": 0, "like": 0, "now_rank": 0, "reply": data.review, "share": 0, "view": data.play }, "state": 0, "tid": data.tid, "title": data.title, "tname": data.typename, "videos": 1 }, { "embedPlayer": 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + cid + '&aid=' + aid + '&pre_ad=")' })
                }, data.v2_app_api ? {
                    "aid": data.v2_app_api.aid,
                    "tags": data.v2_app_api.tag,
                    "videoData": Object.assign(data.v2_app_api, { "embedPlayer": 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + cid + '&aid=' + aid + '&pre_ad=")' })
                } : {})
            } catch (e) { e = Array.isArray(e) ? e : [e]; BLOD.debug.error("__INITIAL_STATE__·avPlus", ...e) }
        }
        bangumi(data, epId) {
            // https://bangumi.bilibili.com/view/web_api/season
            epId = 1 * epId || null;
            data = BLOD.jsonCheck(data).result;
            let ids = [], ini = BLOD.__INITIAL_STATE__ || {};
            data.episodes.forEach(d => {
                ids.push(d.ep_id);
                if (d.badge == "会员" || d.badge_type) BLOD.ids.push(d.cid)
            });
            return {
                "activity": data.activity || {},
                "app": false,
                "area": 0,
                "canReview": true,
                "epId": epId || ids[0],
                "epInfo": data.episodes[ids.indexOf(epId)] || data.episodes[0],
                "epList": data.episodes,
                "epStat": { "isPay": true, "isVip": false, "payPack": 0, "status": 1, "vipNeedPay": false },
                "isPlayerTrigger": false,
                "loginInfo": {},
                "mdId": data.media_id,
                "mediaInfo": {
                    "actors": data.actors,
                    "alias": data.alias,
                    "areas": data.areas,
                    "bkg_cover": data.bkg_cover,
                    "cover": data.cover,
                    "evaluate": data.evaluate,
                    "is_paster_ads": data.is_paster_ads,
                    "jp_title": data.jp_title,
                    "link": data.link,
                    "media_id": data.media_id,
                    "mode": data.mode,
                    "paster_text": data.paster_text,
                    "season_id": data.season_id,
                    "season_status": data.season_status,
                    "season_title": data.season_title,
                    "season_type": data.season_type,
                    "square_cover": data.square_cover,
                    "staff": data.staff,
                    "style": data.style,
                    "title": data.title,
                    "total_ep": data.total_ep
                },
                "mediaRating": data.rating || {},
                "miniOn": 1,
                "newestEp": data.newest_ep,
                "paster": {},
                "payMent": data.payment || {},
                "payPack": {},
                "playerRecomList": [],
                "pubInfo": data.publish,
                "recomList": [],
                "rightsInfo": data.rights,
                "seasonFollowed": false,
                "seasonList": data.seasons || [],
                "seasonStat": data.stat,
                "special": data.bkg_cover ? true : false,
                "spending": 0,
                "sponsorTotal": { "code": 0, "result": { "ep_bp": 0, "list": [], "mine": {}, "users": 0 } },
                "sponsorTotalCount": 0,
                "sponsorWeek": { "code": 0, "result": { "ep_bp": 0, "list": [], "mine": {}, "users": 0 } },
                "ssId": data.season_id,
                "ssStat": {},
                "upInfo": data.up_info,
                "userCoined": 1,
                "userLongReview": {},
                "userScore": -1,
                "userShortReview": {},
                "userStat": {},
                "ver": {}
            }
        }
        index(data) {
            let config = BLOD.config, debug = BLOD.debug;
            let dat = {};
            let ini = JSON.parse(data);
            dat.recommendData = [];
            ini.recommendData && ini.recommendData.item.forEach(i => {
                dat.recommendData.push({
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
            dat.locsData = ini.locsData;
            dat.locsData[23] = ini.locsData[3197];
            if (config.reset.adloc) for (let key in dat.locsData) if (dat.locsData[key]) for (let i = dat.locsData[key].length - 1; i >= 0; i--) if (dat.locsData[key][i].is_ad) { debug.debug("移除广告", key, dat.locsData[key][i]); dat.locsData[key].splice(i, 1); }
            if (dat.locsData[31][0] && dat.locsData[31][0].id == 0) dat.locsData[31] = [{ "id": 36585, "contract_id": "", "pos_num": 1, "name": "小黑屋弹幕举报", "pic": "https://i0.hdslb.com/bfs/archive/0aa2f32c56cb65b6d453192a3015b65e62537b9a.jpg", "litpic": "", "url": "https://www.bilibili.com/blackboard/activity-dmjbfj.html", "style": 0, "agency": "", "label": "", "intro": "", "creative_type": 0, "request_id": "1546354354629q172a23a61a62q626", "src_id": 32, "area": 0, "is_ad_loc": true, "ad_cb": "", "title": "", "server_type": 0, "cm_mark": 0, "stime": 1520478000, "mid": "14629218" }];
            return dat;
        }
    }

    const exports = new IniState();
    BLOD.iniState = exports;
})();
