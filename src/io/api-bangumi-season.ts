import { objUrl } from "../utils/format/url";
import { IOwner, jsonCheck } from "./api";
import { IPendant } from "./api-view-detail";
import { URLS } from "./urls";

export async function apiBangumiSeason(data: IBangumiSeasonData) {
    const response = await fetch(objUrl(URLS.BANGUMI_SEASON, <any>data), { credentials: 'include' });
    const json = await response.json();
    return <IBangumiSeasonResponse>jsonCheck(json).result;
}

interface IBangumiSeasonData {
    season_id?: number;
    ep_id?: number;
}
export interface IBangumiEpisode {
    aid: number;
    attr: number;
    bvid: string;
    cid: number;
    cover: string;
    ctime: string;
    duration: number;
    ep_id: number;
    episode_status: number;
    episode_type: number;
    from: string;
    index: string;
    index_title: string;
    mid: number;
    page: number;
    premiere: boolean;
    pub_real_time: string;
    section_id: number;
    section_type: number;
    vid: string;
}
interface IPayment {
    discount: number;
    pay_type: {
        allow_discount: number;
        allow_pack: number;
        allow_ticket: number;
        allow_time_limit: number;
        allow_vip_discount: number;
        forbid_bb: number;
    }
    price: string;
    promotion: string;
    tip: string;
    vip_discount: number;
    vip_first_switch: string;
    vip_promotion: string;
}
interface ISeasons {
    badge: string;
    badge_type: number;
    cover: string;
    media_id: number;
    new_ep: { cover: string; id: 84798, index_show: string; };
    season_id: number;
    season_title: string;
    season_type: number;
    stat: { danmaku: number; follow: number; view: number; };
    title: string;
}
export interface IBangumiSeasonResponse {
    activity: { id: number; pendant: IPendant[], pendant_ops_img: string; pendant_ops_link: string; title: string; }
    actors: string;
    alias: string;
    areas: { id: number; name: string }[];
    bkg_cover?: string;
    cover: string;
    episodes: IBangumiEpisode[];
    evaluate: string;
    is_paster_ads: number;
    jp_title: string;
    link: string;
    media_id: number;
    mode: number;
    newest_ep: { desc: string; id: string; index: string; is_new: number; pub_real_time: string; }
    paster_text: string;
    payment: IPayment
    publish: { is_finish: number; is_started: number; pub_time: string; pub_time_show: string; weekday: number; };
    rating: { count: number; score: number; };
    rights: {
        allow_bp: number;
        allow_bp_rank: number;
        allow_download: number;
        allow_review: number;
        can_watch: number;
        copyright: string;
        is_preview: number;
        watch_platform: number;
    };
    season_id: number;
    season_status: number;
    season_title: string;
    season_type: number;
    seasons: ISeasons[];
    series_title: string;
    square_cover: string;
    staff: string;
    stat: {
        coins: number;
        danmakus: number;
        favorites: number;
        reply: number;
        share: number;
        views: number;
    };
    style: string[];
    title: string;
    total_ep: number;
    up_info?: IOwner;
    pay_pack?: unknown;
}