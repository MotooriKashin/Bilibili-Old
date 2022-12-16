import { objUrl } from "../utils/format/url";
import { xhrHook } from "../utils/hook/xhr";
import { getUrlValue } from "../utils/utils";
import { IAidDatail } from "./api";
import { IApiViewResponse } from "./api-view";
import { ApiViewDetail } from "./api-view-detail";

interface IApiViewPlusResponse extends IApiViewResponse {
    v2_app_api?: IAidDatail;
    bangumi?: unknown;
}
export class apiBiliplusView {
    protected fetch: Promise<Response>;
    constructor(protected aid: number | string) {
        this.fetch = fetch(objUrl('//www.biliplus.com/api/view', {
            id: aid
        }))
    }
    async getDate() {
        const respense = await this.fetch;
        return <IApiViewPlusResponse>await respense.json()

    }
    /** 转化为`apiViewDetail`格式 */
    async toDetail() {
        const json = await this.getDate();
        return <ApiViewDetail>this.view2Detail(json);
    }
    protected view2Detail(data: IApiViewPlusResponse) {
        const result = new ApiViewDetail();
        if (data.v2_app_api) {
            delete data.v2_app_api.redirect_url; // 番剧重定向会导致404，弃之
            result.data.Card.follower = data.v2_app_api.owner_ext?.fans!;
            result.data.Card.card = <any>{ ...data.v2_app_api.owner, ...data.v2_app_api.owner_ext };
            result.data.Tags = data.v2_app_api.tag!;
            result.data.View = data.v2_app_api;
            xhrHook(`api.bilibili.com/x/web-interface/view?aid=${this.aid}`, undefined, (res) => {
                const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify(result.data.View)}}`;
                res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
            }, false);
            xhrHook(`api.bilibili.com/x/web-interface/archive/stat?aid=${this.aid}`, undefined, (res) => {
                const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify({ ...result.data.View.stat, aid: this.aid })}}`;
                res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
            }, false);
            return JSON.parse(JSON.stringify(result));
        } else return this.view2Detail_v1(data);
    }
    protected view2Detail_v1(data: IApiViewPlusResponse) {
        const result = new ApiViewDetail();
        const p = Number(getUrlValue("p"));
        result.data.Card.card = <any>{
            face: "//static.hdslb.com/images/akari.jpg",
            mid: data.mid,
            name: data.author,
            vip: <any>{}
        };
        result.data.View = <any>{
            aid: data.aid || data.id || this.aid,
            cid: data.list[p ? p - 1 : 0].cid,
            copyright: 1,
            ctime: data.created,
            dimension: { width: 1920, height: 1080, rotate: 0 },
            duration: -1,
            owner: result.data.Card.card,
            pages: data.list.map(d => {
                d.dimension = { width: 1920, height: 1080, rotate: 0 };
                return d;
            }),
            pic: data.pic,
            pubdate: data.lastupdatets,
            rights: <any>{},
            stat: <any>{
                aid: data.aid || data.id || this.aid,
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
        };
        data.bangumi && (result.data.View.season = data.bangumi);
        xhrHook(`api.bilibili.com/x/web-interface/view?aid=${this.aid}`, undefined, (res) => {
            const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify(result.data.View)}}`;
            res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        xhrHook(`api.bilibili.com/x/web-interface/archive/stat?aid=${this.aid}`, undefined, (res) => {
            const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify({ ...result.data.View.stat, aid: this.aid })}}`;
            res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        return JSON.parse(JSON.stringify(result))
    }
}