import { debug } from "../../runtime/debug";
import { xhrhook } from "../../runtime/hook/xhr";
import { jsonphook } from "../../runtime/hook/jsonp";
import { setting } from "../../runtime/setting";
import { sessionStorage } from "../../runtime/storage";
import { toast } from "../../runtime/toast/toast";
import { getUrlValue } from "../../runtime/unit";
import { xhr } from "../../runtime/xhr";
import { collection } from "./collection";
import { upList } from "./up_list";
import { API } from "../../runtime/variable/variable";
import { urlObj } from "../../runtime/format/url";
import { loadScriptEs } from "../../runtime/element/create_scripts";
import { isUserScript } from "../../tampermonkey/check";
import { bangumiPage } from "../bangumi/code";

/** 模板：//api.bilibili.com/x/web-interface/view/detail?aid=${aid} */
class Detail {
    code = 0;
    data = {
        Card: { archive_count: -1, article_count: -1, card: {}, follower: -1, following: false, like_num: -1, space: {} },
        Related: <any[]>[],
        Reply: { page: {}, replies: [] },
        Spec: null,
        Tags: <any[]>[],
        View: <Record<string, any>>{},
        elec: null,
        hot_share: {},
        recommend: null,
        view_addit: {}
    }
    message = "0";
    ttl = 1;
}
function view2Detail(data: any) {
    const result = new Detail();
    if (data.v2_app_api) {
        delete data.v2_app_api.redirect_url; // 番剧重定向会导致404，弃之
        result.data.Card.follower = data.v2_app_api.owner_ext?.fans;
        result.data.Card.card = { ...data.v2_app_api.owner, ...data.v2_app_api.owner_ext };
        result.data.Tags = data.v2_app_api.tag;
        result.data.View = data.v2_app_api;
        xhrhook(`api.bilibili.com/x/web-interface/view?aid=${API.aid}`, undefined, (res) => {
            const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify(result.data.View)}}`;
            res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        xhrhook(`api.bilibili.com/x/web-interface/archive/stat?aid=${API.aid}`, undefined, (res) => {
            const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify({ ...result.data.View.stat, aid: API.aid })}}`;
            res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        return JSON.parse(JSON.stringify(result));
    }
    else return v1api(data);
}
function v1api(data: any) {
    const result = new Detail();
    const p = Number(getUrlValue("p"));
    result.data.Card.card = {
        face: "//static.hdslb.com/images/akari.jpg",
        mid: data.mid,
        name: data.author,
        vip: {}
    };
    result.data.View = {
        aid: data.aid || data.id || API.aid,
        cid: data.list[p ? p - 1 : 0].cid,
        copyright: 1,
        ctime: data.created,
        dimension: { width: 1920, height: 1080, rotate: 0 },
        duration: -1,
        owner: result.data.Card.card,
        pages: data.list,
        pic: data.pic,
        pubdate: data.lastupdatets,
        rights: {},
        stat: {
            aid: data.aid || data.id || API.aid,
            coin: data.coins,
            danmaku: data.video_review,
            dislike: 0,
            evaluation: "",
            favorite: data.favorites,
            his_rank: 0,
            like: -1,
            now_rank: 0,
            reply: -1,
            share: -1,
            view: data.play
        },
        state: 0,
        subtitle: { allow_submit: false, list: [] },
        tid: data.tid,
        title: data.title,
        tname: data.typename,
        videos: data.list.length
    }
    data.bangumi && (result.data.View.season = data.bangumi);
    xhrhook(`api.bilibili.com/x/web-interface/view?aid=${API.aid}`, undefined, (res) => {
        const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify(result.data.View)}}`;
        res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
    }, false);
    xhrhook(`api.bilibili.com/x/web-interface/archive/stat?aid=${API.aid}`, undefined, (res) => {
        const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify({ ...result.data.View.stat, aid: API.aid })}}`;
        res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
    }, false);
    return JSON.parse(JSON.stringify(result))
}
async function check(call: (res: any) => void) {
    try {
        toast.info(`正在进一步查询 av${API.aid} 的信息~`);
        /** 页面是否出错 */
        const card = await xhr({
            url: `https://api.bilibili.com/x/article/cards?ids=av${API.aid}`,
            responseType: "json"
        })
        if (card.data[`av${API.aid}`]) {
            if (card.data[`av${API.aid}`].redirect_url) {
                sessionStorage.setItem("redirect", card.data[`av${API.aid}`].redirect_url);
                call(new Detail()); // 必须先返回，否则超时跳转404
                if (isUserScript) return bangumiPage();
                return loadScriptEs("content/bangumi/bangumi.js");
            }
        }
        const data = await xhr({
            url: `https://www.biliplus.com/api/view?id=${API.aid}`,
            responseType: "json"
        }, true)
        const res = view2Detail(data);
        if (res.data.View.season) {
            sessionStorage.setItem("redirect", res.data.View.season.ogv_play_url);
            res.data.View.season = undefined;
            call(res);
            if (isUserScript) return bangumiPage();
            return loadScriptEs("content/bangumi/bangumi.js");
        }
        call(res);
        setTimeout(() => {
            toast.custom(0, "warning", "这大概是一个无效av号~", "本页面使用缓存数据生成，并无法播放！", "部分上古视频还存在评论区哦~");
        }, 1e3);
    } catch (e) {
        debug.error(e);
    }

}
/** av页深度审查 */
export function avLostCheck() {
    jsonphook("api.bilibili.com/x/web-interface/view/detail", undefined, (res, r, call) => {
        if (0 !== res.code) {
            const obj = urlObj(r);
            if (obj.aid) {
                API.aid = <number>obj.aid;
                check(call);
                return true
            }
        } else {
            if (res.data && res.data.View) {
                if (res.data.View.stein_guide_cid) {
                    sessionStorage.setItem("keepNew", "旧版页面不支持互动视频！已重定向回新版页面🤣");
                    location.reload();
                }
                Promise.resolve().then(() => {
                    setting.upList && res.data.View.staff && upList(res.data.View.staff);
                    setting.collection && res.data.View.is_season_display && res.data.View.ugc_season && collection(res.data.View);
                });
            }
        }
    }, false);
}
