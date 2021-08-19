/**
 * 本模块负责重构bangumi页__INITIAL_STATE__  
 * 请以`__INITIAL_STATE__`名义传入原始数据，重构结果以API对象的同名属性的形式返回  
 * 同时传入的还有epid以指定回目，默认值为0即第一回  
 * 原始数据对应来源`//bangumi.bilibili.com/view/web_api/season?season_id/ep_id`
 * 重构__INITIAL_STATE__是非常精细的工具，请务必耐心细致  
 * 由于数据来源于Ajax，具有非常高的不确定性，主体代码请务必写在`try{}catch{}`结构中以免报错
 */
(function () {

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
        bkg_cover: string;
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
    pubInfo: string;
    recomList: any[];
    rightsInfo: { [name: string]: any };
    seasonFollowed: false;
    seasonList: any[];
    seasonStat: { [name: string]: any };
    special: false;
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