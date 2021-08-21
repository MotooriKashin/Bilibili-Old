/**
 * 本模块负责重构av/BV页__INITIAL_STATE__  
 * 请以`__INITIAL_STATE__`名义传入原始数据，重构结果以API对象的同名属性的形式返回  
 * 原始数据对应来源`//api.bilibili.com/x/web-interface/view/detail?aid`  
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
        // @ts-ignore：传递的参数
        let data = API.jsonCheck(__INITIAL_STATE__).data;
        if (!data.View.cid && data.View.forward) {
            API.toast.warning("视频撞车了！正在跳转至原视频~");
            location.href = `https://www.bilibili.com/video/av${data.View.forward}`;
        }
        result.aid = data.View.aid;
        result.related = data.Related || [];
        result.tags = data.Tags || [];
        result.upData = data.Card.card || {};
        result.upData.archiveCount = data.Card.archive_count;
        result.videoData = data.View || {};
        result.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + data.View.cid + '&aid=' + data.View.aid + '&pre_ad=")';
        API.__INITIAL_STATE__ = result;
    } catch (e) { API.debug.trace(e, "av-detail.js", true) }
})();
declare namespace API {
    /**
     * 重构的__INITIAL_STATE__数据
     */
    let __INITIAL_STATE__: AV__INITIAL_STATE__ | BANGUMI__INITIAL_STATE__ | INDEX__INITIAL_STATE__;
}
interface AV__INITIAL_STATE__ {
    aid: number;
    comment: { count: number; list: [] };
    error: {};
    isClient: false;
    p: string;
    player: string;
    playurl: string;
    related: any[];
    tags: any[];
    upData: {
        face: string;
        name: string;
        mid: number;
        DisplayRank: string;
        Official: {
            desc: string;
            role: number;
            title: string;
            type: number;
        };
        approve: boolean;
        archiveCount: number;
        article: number;
        attention: number;
        attentions: any[];
        birthday: string;
        description: string;
        fans: number;
        friend: number;
        level_info: { current_exp: number; current_level: number; current_min: number; next_exp: number };
        nameplate: { condition: string; image: string; image_small: string; level: string; name: string; mid: number };
        official_verify: { desc: string; type: number };
        pendant: { expire: number; image: string; image_enhance: string; image_enhance_frame: string; name: string; pid: number };
        place: string;
        rank: number;
        regtime: number;
        sex: string;
        sign: string;
        spacesta: number;
        vip: { accessStatus: number; dueRemark: string; theme_type: number; vipStatus: number; vipStatusWarn: string; vipType: number }
    };
    videoData: {
        aid: number;
        cid: number;
        config: { relates_title: string; share_style: number };
        copyright: number;
        ctime: string;
        desc: string;
        dimension: { height: number; rotate: number; width: number };
        duration: number;
        dynamic: string;
        owner: { [name: string]: any };
        pages: [{ cid: number; dimension: { height: number; rotate: number; width: number }; duration: number; from: string; page: number; part: string; vid: string; weblink: string }];
        pic: string;
        pubdate: string;
        redirect_url?: string;
        rights: { autoplay: number; bp: number; download: number; elec: number; hd5: number; is_cooperation: number; movie: number; no_background: number; no_reprint: number; pay: number; ugc_pay: number; ugc_pay_preview: number };
        stat: {
            aid: number;
            coin: number;
            danmaku: number;
            dislike: number;
            favorite: number;
            his_rank: number;
            like: number;
            now_rank: number;
            reply: number;
            share: number;
            view: number
        };
        staff?: string;
        state: number;
        stein_guide_cid?: number;
        tid: number;
        title: number;
        tname: number;
        videos: number;
        embedPlayer: string
    }
}
