import { ApiSign, IStat, jsonCheck } from "./api";
import { URLS } from "./urls";

interface ApiGlobalOgvViewDate {
    season_id?: number;
    ep_id?: number;
    access_key: string;
    build?: number;
    mobi_app?: string;
    s_locale?: string;
}
export interface IGlobalOgvEpisode {
    aid: number;
    cid: number;
    cover: string;
    dimension: { height: number; rotate: number; width: number; };
    from: string;
    id: number;
    jump: {
        ed: { end: number; end_ms: number; start: number; start_ms: number; };
        op: { end: number; end_ms: number; start: number; start_ms: number; };
    };
    long_title: string;
    long_title_display: string;
    share_url: string;
    status: number;
    subtitles?: {
        id: number;
        is_machine: boolean;
        key: string;
        title: string;
        url: string;
    }[];
    title: number;
    title_display: number;
}
interface IGlobalOgvViewResponse {
    activity_dialog: unknown;
    actor: { info: string; title: string; };
    alias: string;
    areas: { id: number; name: string; }[];
    comment_restriction: string;
    cover: string;
    detail: string;
    dynamic_subtitle: string;
    evaluate: string;
    horizon_cover: string;
    limit?: unknown;
    link: string;
    login_dialog: unknown;
    mode: number;
    modules: {
        can_ord_desc: number;
        data: { episodes: IGlobalOgvEpisode[] };
        id: number;
        module_style: { hidden: number; line: number; show_pages: unknown; };
        more: string;
        partition: number;
        style: string;
        title: string;
    }[];
    new_ep: { id: number; new_ep_display: string; title: string; };
    no_comment: string;
    open_skip_switch: boolean;
    origin_name: string;
    pay_pack: unknown;
    payment: unknown;
    publish: {
        is_finish: number;
        is_started: number;
        pub_time: string;
        pub_time_show: string;
        release_date_show: string;
        time_length_show: string;
        unknow_pub_date: number;
        weekday: number;
    };
    rating: unknown;
    refine_cover: string;
    rights: {
        allow_bp: number;
        allow_bp_rank: number;
        allow_download: number;
        allow_review: number;
        area_limit: number;
        ban_area_show: number;
        can_watch: number;
        copyright: string;
        forbidPre: number;
        is_preview: number;
        onlyVipDownload: number;
    }
    season_id: number;
    season_title: string;
    series?: {
        seasons: {
            season_id: number;
            quarter_title: string;
        }[]
    };
    share_copy: string;
    share_url: string;
    short_link: string;
    square_cover: string;
    staff: unknown;
    stat: {
        coins: number;
        danmakus: number;
        favorites: number;
        followers: number;
        hot: number;
        likes: number;
        play: number;
        reply: number;
        series_play: number;
        share: number;
        views: number;
    };
    stat_format: { likes: string; play: string; reply: string; share: string; };
    status: number;
    styles: { id: number; name: string; url: string; }[];
    subtitle: string;
    subtitle_suggest_key: string;
    title: string;
    total: number;
    type: number;
    type_name: string;
    up_info: unknown;
    update_partten: string;
    user_status: { demand_no_pay_epids?: number[]; follow: number; like_state: number; vip: number; };
}
export class ApiGlobalOgvView extends ApiSign {
    protected fetch: Promise<Response>;
    constructor(data: ApiGlobalOgvViewDate, server = 'api.global.bilibili.com') {
        super(URLS.GLOBAL_OGV_VIEW.replace('api.global.bilibili.com', server), '7d089525d3611b1c');
        data = Object.assign({
            build: 108003,
            mobi_app: 'bstar_a',
            s_locale: 'zh_SG'
        }, data);
        this.fetch = fetch(this.sign(<any>data));
    }
    getDate() {
        return new Promise((resolve: (value: IGlobalOgvViewResponse) => void, reject) => {
            this.fetch
                .then(d => d.json())
                .then(d => resolve(jsonCheck(d).result))
                .catch(e => reject(e));
        });
    }
}