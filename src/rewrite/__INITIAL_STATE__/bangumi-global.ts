/**
 * 本模块负责重构bangumi页__INITIAL_STATE__
 * 请以`__INITIAL_STATE__`名义传入原始数据，重构结果以API对象的同名属性的形式返回
 * 同时传入的还有以`epid`的名义指定回目，默认值为0即第一回
 * 原始数据对应来源`//api.global.bilibili.com/view/web_api/season?season_id/ep_id`
 * 重构__INITIAL_STATE__是非常精细的工具，请务必耐心细致
 * 由于数据来源于Ajax，具有非常高的不确定性，主体代码请务必写在`try{}catch{}`结构中以免报错
 */
(function () {
    try {
        const result: BANGUMI__INITIAL_STATE__ = {
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
            pubInfo: {},
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
        }
        // @ts-expect-error：传递参数
        let epId = Number(epid) || null, data = API.jsonCheck(__INITIAL_STATE__).result;
        let ids: number[] = [], epList: { [name: string]: any }[] = [];
        data.modules.forEach((d: any) => {
            d.data.episodes.forEach((d: any) => {
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
        result.activity = data.activity_dialog || {};
        result.epId = epId || ids[0];
        result.epInfo = epId ? epList[ids.indexOf(epId)] : epList[0];
        result.epList = epList;
        result.mediaInfo.actors = data.actor.info;
        result.mediaInfo.alias = data.alias;
        result.mediaInfo.areas = data.areas;
        result.mediaInfo.cover = data.cover;
        result.mediaInfo.evaluate = data.evaluate;
        result.mediaInfo.link = data.link;
        result.mediaInfo.mode = data.mode;
        result.mediaInfo.season_id = data.season_id;
        result.mediaInfo.season_status = data.season_status;
        result.mediaInfo.season_title = data.season_title;
        result.mediaInfo.staff = data.staff;
        result.mediaInfo.style = data.styles;
        result.mediaInfo.title = data.title;
        result.mediaInfo.total_ep = ids.length;
        result.newestEp = data.new_ep;
        result.pubInfo = data.publish;
        result.pubInfo.is_started = 1;
        result.rightsInfo = data.right;
        result.seasonStat = data.stat;
        result.ssId = data.season_id;
        API.__INITIAL_STATE__ = result;
    } catch (e) { API.debug.trace(e, "bangumi-global.js", true) }
})();