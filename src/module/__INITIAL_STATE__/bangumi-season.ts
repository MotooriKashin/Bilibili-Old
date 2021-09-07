/**
 * 本模块负责重构bangumi页__INITIAL_STATE__  
 * 请以`__INITIAL_STATE__`名义传入原始数据，重构结果以API对象的同名属性的形式返回  
 * 同时传入的还有以`epid`的名义指定回目，默认值为0即第一回  
 * 原始数据对应来源`//bangumi.bilibili.com/view/web_api/season?season_id/ep_id`
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
        API.vipCid = [];
        let ids = data.episodes.reduce((s: number[], d: { [name: string]: any }) => {
            s.push(d.ep_id);
            (d.badge == "会员" || d.badge_type) && API.vipCid.push(d.cid);
            return s;
        }, []);
        result.activity = data.activity || {};
        result.epId = epId || ids[0];
        result.epInfo = data.episodes[ids.indexOf(epId)] || data.episodes[0];
        result.epList = data.episodes;
        result.mdId = data.media_id;
        result.mediaInfo.actors = data.actors;
        result.mediaInfo.alias = data.alias;
        result.mediaInfo.areas = data.areas;
        result.mediaInfo.bkg_cover = data.bkg_cover;
        result.mediaInfo.cover = data.cover;
        result.mediaInfo.evaluate = data.evaluate;
        result.mediaInfo.is_paster_ads = data.is_paster_ads;
        result.mediaInfo.jp_title = data.jp_title;
        result.mediaInfo.link = data.link;
        result.mediaInfo.media_id = data.media_id;
        result.mediaInfo.mode = data.mode;
        result.mediaInfo.paster_text = data.paster_text;
        result.mediaInfo.season_id = data.season_id;
        result.mediaInfo.season_status = data.season_status;
        result.mediaInfo.season_title = data.season_title;
        result.mediaInfo.season_type = data.season_type;
        result.mediaInfo.square_cover = data.square_cover;
        result.mediaInfo.staff = data.staff;
        result.mediaInfo.style = data.style;
        result.mediaInfo.title = data.title;
        result.mediaInfo.total_ep = data.total_ep;
        result.mediaRating = data.rating || {};
        result.newestEp = data.newest_ep;
        result.payMent = data.payment || {};
        result.pubInfo = data.publish;
        result.seasonList = data.seasons || [];
        result.seasonStat = data.stat;
        result.special = data.bkg_cover ? true : false;
        result.ssId = data.season_id;
        result.upInfo = data.up_info;

        API.__INITIAL_STATE__ = result;
    } catch (e) { API.trace(e, "bangumi-season.js", true) }
})();
interface BANGUMI__INITIAL_STATE__ {
    activity: { [name: string]: any };
    app: boolean;
    area: number;
    canReview: boolean;
    epId: number;
    epInfo: { [name: string]: any };
    epList: any[];
    epStat: { isPay: boolean; isVip: boolean; payPack: number; status: number; vipNeedPay: boolean };
    isPlayerTrigger: boolean;
    loginInfo: { [name: string]: any };
    mdId: number;
    mediaInfo: {
        actors: string;
        alias: string;
        areas: any[];
        bkg_cover?: string;
        cover: string;
        evaluate: string;
        is_paster_ads: number;
        jp_title: string;
        link: string;
        media_id: number;
        mode: number;
        paster_text: string;
        season_id: number;
        season_status: number;
        season_title: string;
        season_type: number;
        square_cover: string;
        staff: string;
        style: any[];
        title: string;
        total_ep: number
    };
    mediaRating: { [name: string]: any };
    miniOn: number;
    newestEp: { [name: string]: any };
    paster: { [name: string]: any };
    payMent: { [name: string]: any };
    payPack: { [name: string]: any };
    playerRecomList: any[];
    pubInfo: { [name: string]: any };
    recomList: any[];
    rightsInfo: { [name: string]: any };
    seasonFollowed: false;
    seasonList: any[];
    seasonStat: { [name: string]: any };
    special: boolean;
    spending: number;
    sponsorTotal: { code: number; result: { ep_bp: number; list: any[]; mine: { [name: string]: any }; users: number } };
    sponsorTotalCount: number;
    sponsorWeek: { code: number; result: { ep_bp: number; list: any[]; mine: { [name: string]: any }; users: number } };
    ssId: number;
    ssStat: { [name: string]: any };
    upInfo: { [name: string]: any };
    userCoined: number;
    userLongReview: { [name: string]: any };
    userScore: number;
    userShortReview: { [name: string]: any };
    userStat: { [name: string]: any };
    ver: { [name: string]: any }
}
declare namespace API {
    /**
     * 记录需要vip的bangumi回目对应的cid
     */
    let vipCid: number[]
}