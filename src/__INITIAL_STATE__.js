/*
 * @module "__INITIAL_STATE__.js"
 * @description __INITIAL_STATE__数据配置，以iniState对象挂载在BLOD下
 */

(function () {
    const BLOD = window.BLOD;

    class IniState {
        constructor() {
            console.debug('import module "__INITIAL_STATE__.js"')
        }
        av(data) {
            try {
                let aid = BLOD.aid, cid = BLOD.cid, dat;
                data = BLOD.jsonCheck(data).data;
                aid = aid || data.View.aid;
                cid = cid || data.View.cid;
                dat = { aid: -1, comment: { count: 0, list: [] }, error: {}, isClient: false, p: "", player: "", playurl: {}, related: [], tags: [], upData: {}, videoData: {} };
                dat.aid = data.View.aid;
                dat.related = data.Related;
                dat.tags = data.Tags || [];
                dat.upData = data.Card.card;
                dat.upData.archiveCount = data.Card.archive_count;
                dat.videoData = data.View;
                dat.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + cid + '&aid=' + aid + '&pre_ad=")';
                return dat;
            } catch (e) { e = Array.isArray(e) ? e : [e]; BLOD.debug.error("__INITIAL_STATE__·av/BV", ...e) }
        }
        avPlus(data) {
            try {
                let aid = BLOD.aid, cid = BLOD.cid, dat;
                data = JSON.parse(data);
                dat = { aid: -1, comment: { count: 0, list: [] }, error: {}, isClient: false, p: "", player: "", playurl: {}, related: [], tags: [], upData: {}, videoData: {} };
                if (data.v2_app_api) {
                    if (data.v2_app_api.redirect_url) location.href = data.v2_app_api.redirect_url;
                    aid = aid || data.v2_app_api.aid;
                    cid = cid || data.v2_app_api.cid;
                    dat.aid = data.v2_app_api.aid;
                    dat.tags = data.v2_app_api.tag;
                    dat.upData = data.v2_app_api.owner;
                    dat.videoData = data.v2_app_api;
                } else {
                    if (data.bangumi && data.bangumi.ogv_play_url) location.href = data.bangumi.ogv_play_url;
                    aid = aid || data.aid;
                    cid = cid || data.list[0].cid;
                    dat.aid = data.aid;
                    dat.tags = [];
                    dat.upData = { "face": "https://static.hdslb.com/images/akari.jpg", name: data.author, mid: data.mid };
                    dat.videoData = { "aid": aid, "cid": cid, "config": { "relates_title": "相关推荐", "share_style": 1 }, "copyright": 2, "ctime": data.created, "desc": data.description, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 360, "dynamic": "", "owner": dat.upData, "pages": [{ "cid": cid, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 360, "from": "vupload", "page": 1, "part": "", "vid": "", "weblink": "" }], "pic": data.pic, "pubdate": data.created, "rights": { "autoplay": 0, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 0, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": aid, "coin": 0, "danmaku": 0, "dislike": 0, "favorite": 0, "his_rank": 0, "like": 0, "now_rank": 0, "reply": 0, "share": 0, "view": 0 }, "state": 0, "tid": data.tid, "title": data.title, "tname": data.typename, "videos": 1 };
                }
                dat.upData = Object.assign(dat.upData, { "DisplayRank": "0", "Official": { "desc": "", "role": 0, "title": "", "type": -1 }, "approve": false, "archiveCount": 0, "article": 0, "attention": 10, "attentions": [], "birthday": "", "description": "", "fans": 44616, "friend": 10, "level_info": { "current_exp": 0, "current_level": 6, "current_min": 0, "next_exp": 0 }, "nameplate": { "condition": "", "image": "", "image_small": "", "level": "", "name": "", "nid": 0 }, "official_verify": { "desc": "", "type": -1 }, "pendant": { "expire": 0, "image": "", "image_enhance": "", "image_enhance_frame": "", "name": "", "pid": 0 }, "place": "", "rank": "10000", "regtime": 0, "sex": "保密", "sign": "", "spacesta": 0, "vip": { "accessStatus": 0, "dueRemark": "", "theme_type": 0, "vipStatus": 0, "vipStatusWarn": "", "vipType": 1 } });
                dat.related = [];
                dat.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + cid + '&aid=' + aid + '&pre_ad=")';
                BLOD.config.reset.like = 0;
                BLOD.avPlus = true;
                return dat;
            } catch (e) { e = Array.isArray(e) ? e : [e]; BLOD.debug.error("__INITIAL_STATE__·av/BV", ...e) }
        }
        bangumi(data, epId) {
            let ep = 0, ini = {}, pug = {}, mode;
            let dat = { "ver": {}, "loginInfo": {}, "canReview": false, "userShortReview": {}, "userLongReview": {}, "userScore": 0, "userCoined": false, "isPlayerTrigger": false, "area": 0, "app": false, "mediaRating": {}, "recomList": [], "playerRecomList": [], "paster": {}, "payPack": {}, "payMent": {}, "activity": {}, "spending": 0, "sponsorTotal": { "code": 0, "result": { "ep_bp": 0, "users": 0, "mine": {}, "list": [] } }, "sponsorWeek": { "code": 0, "result": { "ep_bp": 0, "users": 0, "mine": {}, "list": [] } }, "sponsorTotalCount": 0, "miniOn": true, "seasonFollowed": false, "epStat": {}, "ssStat": {} };
            if (data.startsWith("{")) {
                // DOCUMENT被404的备用数据源，无法获取播放进度信息，以ss进入默认选择第一p
                data = BLOD.jsonCheck(data).result;
                dat.special = data.bkg_cover ? true : false;
                if (epId) { dat.epId = 1 * epId; ep = 1; } else dat.epId = ""
                dat.ssId = data.season_id;
                dat.mdId = data.media_id;
                dat.mediaInfo = {};
                dat.mediaInfo.actors = data.actors || "";
                dat.mediaInfo.alias = data.alias;
                dat.mediaInfo.areas = data.areas || [];
                dat.mediaInfo.bkg_cover = data.bkg_cover;
                dat.mediaInfo.cover = data.cover;
                dat.mediaInfo.evaluate = data.evaluate;
                dat.mediaInfo.is_paster_ads = data.is_paster_ads || 0;
                dat.mediaInfo.jp_title = data.jp_title;
                dat.mediaInfo.link = data.link;
                dat.mediaInfo.media_id = data.media_id;
                dat.mediaInfo.mode = data.mode;
                dat.mediaInfo.paster_text = "";
                dat.mediaInfo.season_id = data.season_id;
                dat.mediaInfo.season_status = data.status;
                dat.mediaInfo.season_title = data.season_title;
                dat.mediaInfo.season_type = data.type;
                dat.mediaInfo.square_cover = data.square_cover;
                dat.mediaInfo.staff = data.staff || "";
                dat.mediaInfo.stat = data.state;
                dat.mediaInfo.style = data.style || [];
                dat.mediaInfo.title = data.title;
                dat.mediaInfo.total_ep = data.total;
                dat.mediaRating = data.rating;
                dat.epList = data.episodes;
                if (ep == 0) dat.epId = (data.episodes[0] && data.episodes[0].id) || "";
                for (let i = 0; i < dat.epList.length; i++) {
                    dat.epList[i].ep_id = dat.epList[i].id;
                    dat.epList[i].episode_status = dat.epList[i].status;
                    dat.epList[i].index = dat.epList[i].title;
                    dat.epList[i].index_title = dat.epList[i].long_title;
                    if (dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
                    if (dat.epList[i].badge == "会员" || dat.epList[i].badge_type) BLOD.ids.push(dat.epList[i].cid);
                }
                dat.newestEp = data.new_ep;
                dat.seasonList = data.seasons;
                dat.rightsInfo = data.rights;
                dat.pubInfo = data.publish;
                dat.upInfo = data.up_info || {};
            }
            else {
                // 正常DOCUMENT数据源，up组主数据可能无效，将指向uid=2(站长)
                ini = JSON.parse(data.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, ""));
                pug = JSON.parse(data.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace(/PGC_USERSTATE__=/, "").replace(/<\/script>/, ""));
                dat.special = ini.mediaInfo.specialCover ? true : false;
                mode = dat.special ? 1 : 2;
                if (epId) { dat.epId = 1 * epId; ep = 1; }
                else { dat.epId = ""; if (pug.hasOwnProperty("progress")) { dat.epId = pug.progress.last_ep_id; ep = 1; } }
                dat.ssId = ini.mediaInfo.ssId;
                dat.mdId = ini.mediaInfo.id;
                dat.mediaInfo = {};
                dat.mediaInfo.actors = "";
                dat.mediaInfo.alias = ini.mediaInfo.alias;
                dat.mediaInfo.areas = [];
                dat.mediaInfo.bkg_cover = ini.mediaInfo.specialCover;
                dat.mediaInfo.cover = ini.mediaInfo.cover;
                dat.mediaInfo.evaluate = ini.mediaInfo.evaluate;
                dat.mediaInfo.is_paster_ads = 0;
                dat.mediaInfo.jp_title = ini.mediaInfo.jpTitle;
                dat.mediaInfo.link = "https://www.bilibili.com/bangumi/media/md" + dat.mdId;
                dat.mediaInfo.media_id = dat.mdId;
                dat.mediaInfo.mode = mode;
                dat.mediaInfo.paster_text = "";
                dat.mediaInfo.season_id = ini.mediaInfo.ssId;
                dat.mediaInfo.season_status = ini.mediaInfo.status;
                dat.mediaInfo.season_title = ini.mediaInfo.title;
                dat.mediaInfo.season_type = ini.mediaInfo.ssType;
                dat.mediaInfo.square_cover = ini.mediaInfo.squareCover;
                dat.mediaInfo.staff = "";
                dat.mediaInfo.stat = ini.mediaInfo.stat;
                dat.mediaInfo.style = [];
                dat.mediaInfo.title = ini.mediaInfo.title;
                dat.mediaInfo.total_ep = ini.epList.length;
                dat.mediaRating = ini.mediaInfo.rating;
                dat.epList = [];
                for (let i = 0; i < ini.sections.length; i++) ini.epList.push(...ini.sections[i].epList);
                if (ep == 0) dat.epId = (ini.epList[0] && ini.epList[0].id) || "";
                for (let i = 0; i < ini.epList.length; i++) {
                    dat.epList[i] = {};
                    dat.epList[i].aid = ini.epList[i].aid;
                    dat.epList[i].cid = ini.epList[i].cid;
                    dat.epList[i].badge = ini.epList[i].badge;
                    dat.epList[i].badge_type = ini.epList[i].badgeType;
                    dat.epList[i].cover = ini.epList[i].cover;
                    dat.epList[i].duration = -1;
                    dat.epList[i].ep_id = ini.epList[i].id;
                    dat.epList[i].episode_status = ini.epList[i].epStatus;
                    dat.epList[i].from = ini.epList[i].from;
                    dat.epList[i].index = ini.epList[i].title;
                    dat.epList[i].index_title = ini.epList[i].longTitle;
                    dat.epList[i].mid = ini.mediaInfo.upInfo.mid;
                    dat.epList[i].page = 1;
                    dat.epList[i].pub_real_time = ini.epList[i].releaseDate || ini.mediaInfo.pub.time;
                    dat.epList[i].section_id = -1;
                    dat.epList[i].section_type = 0;
                    dat.epList[i].vid = ini.epList[i].vid;
                    if (dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
                    if (dat.epList[i].badge == "会员" || dat.epList[i].badge_type) BLOD.ids.push(dat.epList[i].cid);
                }
                dat.newestEp = ini.mediaInfo.newestEp;
                dat.seasonList = [];
                for (let i = 0; i < ini.ssList.length; i++) {
                    dat.seasonList[i] = {};
                    dat.seasonList[i].badge = ini.ssList[i].badge;
                    dat.seasonList[i].badge_type = ini.ssList[i].badgeType;
                    dat.seasonList[i].cover = ini.ssList[i].cover;
                    dat.seasonList[i].media_id = -1;
                    dat.seasonList[i].new_ep = {
                        cover: ini.ssList[i].epCover,
                        id: -1,
                        index_show: ini.ssList[i].desc
                    };
                    dat.seasonList[i].season_id = ini.ssList[i].id;
                    dat.seasonList[i].season_title = ini.ssList[i].title;
                    dat.seasonList[i].season_type = ini.ssList[i].type;
                    dat.seasonList[i].stat = {
                        danmaku: 0,
                        follow: 0,
                        view: 0
                    };
                    dat.seasonList[i].title = ini.ssList[i].title;
                }
                dat.newestEp.isNew = dat.newestEp.isNew ? 1 : 0;
                dat.rightsInfo = {};
                dat.rightsInfo.allow_bp = ini.mediaInfo.rights.allowBp ? 1 : 0;
                dat.rightsInfo.allow_download = 1;
                dat.rightsInfo.allow_review = ini.mediaInfo.rights.allowReview ? 1 : 0;
                dat.rightsInfo.copyright = "bilibili";
                dat.rightsInfo.is_preview = ini.mediaInfo.rights.isPreview ? 1 : 0;
                dat.rightsInfo.watch_platform = ini.mediaInfo.rights.appOnly ? 1 : 0;
                dat.pubInfo = {};
                dat.pubInfo.is_finish = ini.mediaInfo.pub.isFinish ? 1 : 0;
                dat.pubInfo.is_started = ini.mediaInfo.pub.isStart ? 1 : 0;
                dat.pubInfo.pub_time = ini.mediaInfo.pub.time;
                dat.pubInfo.pub_time_show = ini.mediaInfo.pub.timeShow;
                dat.pubInfo.weekday = -1;
                dat.upInfo = {};
                dat.upInfo.avatar = ini.mediaInfo.upInfo.avatar;
                dat.upInfo.follower = "--";
                dat.upInfo.is_vip = ini.mediaInfo.upInfo.isAnnualVip ? 1 : 0;
                dat.upInfo.mid = ini.mediaInfo.upInfo.mid;
                dat.upInfo.pendant = {
                    image: ini.mediaInfo.upInfo.pendantImage,
                    name: ini.mediaInfo.upInfo.pendantName,
                    pid: ini.mediaInfo.upInfo.pendantId
                };
                dat.upInfo.uname = ini.mediaInfo.upInfo.name;
                dat.upInfo.verify_type = 6;
                if (dat.upInfo.mid < 1) dat.upInfo = { avatar: "//i0.hdslb.com/bfs/face/ef0457addb24141e15dfac6fbf45293ccf1e32ab.jpg", follower: 897603, is_vip: 1, mid: 2, pendant: { image: "", name: "", pid: 0 }, uname: "碧诗", verify_type: 2 }
            }
            dat.seasonStat = { "views": 0, "danmakus": 0, "coins": 0, "favorites": 0 };
            dat.userStat = { "loaded": true, "error": false, "follow": 0, "pay": 0, "payPackPaid": 0, "sponsor": 0 };
            dat.userStat.watchProgress = pug.progress;
            dat.userStat.vipInfo = pug.vip_info;
            if (pug.dialog || pug.pay == 1) {
                dat.payMent = { "price": "0.0", "promotion": "", "tip": "大会员专享观看特权哦~" };
                if (pug.dialog) {
                    dat.payMent.vip_promotion = pug.dialog.title;
                    if (pug.dialog.btn_left) dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];
                }
            }
            if (dat.epInfo.index >= 0) { dat.special = false; dat.mediaInfo.bkg_cover = ""; }
            return dat;
        }
        index(data) {
            let config = BLOD.config, debug = BLOD.debug;
            let dat = {};
            let ini = JSON.parse(data);
            dat.recommendData = [];
            for (let i = 0; i < ini.recommendList.length; i++) {
                dat.recommendData[i] = {};
                dat.recommendData[i].aid = ini.recommendList[i].aid;
                dat.recommendData[i].typename = ini.recommendList[i].tname;
                dat.recommendData[i].title = ini.recommendList[i].title;
                dat.recommendData[i].subtitle = "";
                dat.recommendData[i].play = ini.recommendList[i].stat.view;
                dat.recommendData[i].review = ini.recommendList[i].stat.reply;
                dat.recommendData[i].video_review = "";
                dat.recommendData[i].favorites = ini.recommendList[i].stat.favorite;
                dat.recommendData[i].mid = ini.recommendList[i].owner.mid;
                dat.recommendData[i].author = ini.recommendList[i].owner.name;
                dat.recommendData[i].create = ini.recommendList[i].pubdate;
                dat.recommendData[i].pic = ini.recommendList[i].pic;
                dat.recommendData[i].coins = ini.recommendList[i].stat.coin;
                dat.recommendData[i].duration = ini.recommendList[i].duration;
                dat.recommendData[i].badgepay = false;
                dat.recommendData[i].rights = ini.recommendList[i].rights;
            }
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
