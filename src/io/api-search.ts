import { ApiSign, jsonCheck } from "./api";
import { URLS } from "./urls";

type ISearchTypeAndroid = 'activity' | 'article' | 'bangumi' | 'bili_user' | 'live' | 'live_all'
    | 'live_master' | 'live_room' | 'live_user' | 'media_bangumi' | 'media_ft'
    | 'movie' | 'operation_card' | 'pgc' | 'special' | 'topic' | 'tv' | 'upuser' | 'user'
    | 'video';
type ISearchType = 'bangumi' | 'special' | 'topic' | 'upuser' | 'video';
interface ISearchVideo {
    aid: number;
    arcrank: string;
    arcurl: string;
    author: string;
    badgepay: boolean;
    description: string;
    duration: string;
    favorites: number;
    fulltext: string[];
    hit_columns: string[];
    id: number;
    is_pay: number;
    is_ugc_inline: number;
    is_union_video: number;
    like: number;
    mid: number;
    new_rec_tags: string[];
    pic: string;
    play: number;
    pubdate: number;
    rank_index: number;
    rank_offset: number;
    rank_score: number;
    rec_tags: unknown;
    review: number;
    senddate: number;
    tag: string;
    timeline_style: { enable: boolean; };
    title: string;
    type: string;
    typeid: string;
    typename: string;
    video_review: number;
    view_type: string;
}
interface ISearchBangumi {
    bangumi_id: number;
    bgmlist: unknown[];
    brief: string;
    catlist: unknown;
    cover: string;
    cv: string;
    danmaku_count: number;
    eplist: unknown[];
    evaluate: string;
    favorites: number;
    hit_columns: string[];
    is_finish: number;
    newest_cat: string;
    newest_ep_id: number;
    newest_ep_index: string;
    newest_season: string;
    play_count: number;
    pubdate: number;
    rank_index: number;
    rank_offset: number;
    rank_score: number;
    season_id: number;
    spid: number;
    staff: string;
    status: number;
    styles: string;
    title: string;
    total_count: number;
    type: string;
    typeurl: string;
}
interface IApiSearchAndroid {
    app_display_option: { search_page_visual_opti: number };
    cache: number;
    code: number;
    cost_time: {
        as_request: string;
        as_request_format: string;
        as_response_format: string;
        deserialize_response: string;
        illegal_handler: string;
        is_risk_query: string;
        main_handler: string;
        mysql_request: string;
        params_check: string;
        save_cache: string;
        total: string;
    };
    crr_query: string;
    egg_hit: number;
    egg_info: unknown;
    exp_bits: number;
    exp_list: { 5515: boolean; 6609: boolean; 7709: boolean; };
    exp_str: string;
    msg: string;
    numPages: number;
    numResults: number;
    offline_cache: { timestamp: number; query: string; };
    page: number;
    pageinfo: Record<ISearchTypeAndroid, { numResults: number; pages: number; total: number; }>;
    pagesize: number;
    qv_id: string;
    result: {
        media_bangumi: {
            all_net_icon: string;
            all_net_name: string;
            all_net_url: string;
            angle_color: number;
            angle_title: string;
            areas: string;
            corner: number;
            cover: string;
            cv: string;
            desc: string;
            display_info: {
                bg_color: string;
                bg_color_night: string;
                bg_style: number;
                border_color: string;
                border_color_night: string;
                text: string;
                text_color: string;
                text_color_night: string;
            }[];
            fix_pubtime_str: string;
            goto_url: string;
            hit_columns: string[];
            hit_epids: string;
            is_avid: boolean;
            is_ogv_inline: number;
            media_id: number;
            media_mode: number;
            media_score: { score: number; user_count: number; };
            media_type: number;
            org_title: string;
            play_state: number;
            pubtime: number;
            rank_index: number;
            rank_offset: number;
            rank_score: number;
            season_id: number;
            staff: string;
            styles: string;
            title: string;
            type: string;
        }[];
        video: ISearchVideo[];
    };
    rqt_type: string;
    seid: string;
    show_column: number;
    show_module_list: string[];
    suggest_keyword: string;
    top_tlist: Record<ISearchTypeAndroid, number>;
}
export interface IApiSearch {
    cache: number;
    code: number;
    cost: {
        as_request: string;
        as_request_format: string;
        as_response_format: string;
        deserialize_response: string;
        illegal_handler: string;
        main_handler: string;
        params_check: string;
        total: string;
    };
    cost_time: unknown;
    crr_query: string;
    egg_hit: number;
    egg_info: unknown;
    exp_bits: number;
    exp_list: unknown;
    exp_str: string;
    msg: string;
    numPages: number;
    numResults: number;
    page: number;
    'page caches': { 'hit cache': number; };
    pageinfo: Record<ISearchType, { numResults: number; total: number; pages: number; }>;
    pagesize: number;
    result: {
        bangumi: ISearchBangumi[];
        tv: ISearchBangumi[];
        movie: ISearchBangumi[];
        video: ISearchVideo[];
    };
    rqt_type: string;
    seid: string;
    sengine: { usage: string; count: string; };
    show_column: number;
    show_module_list: string[];
    stoken: string;
    suggest_keyword: string;
    top_tlist: { special: number; topic: number; upuser: number; video: number; bangumi: number; };
    total: number;
    track_id: string;
}
export class ApiSearch extends ApiSign {
    constructor(keyword: string) {
        super(URLS.SEARCH, 'c1b107428d337928');
        this.data = Object.assign({ keyword: keyword }, {
            type: 'json',
            build: 404000,
            main_ver: 'v4',
            page: 1,
            pagesize: 20,
            platform: 'android',
            search_type: 'all',
            source_type: 0,
            bangumi_num: 1,
            special_num: 1,
            topic_num: 1,
            upuser_num: 1,
            tv_num: 1,
            movie_num: 1
        });
    }
    async getData() {
        const response = await fetch(this.sign());
        const json = await response.json();
        return <IApiSearchAndroid>jsonCheck(json);
    }
    /**
     * 转换为网页版搜索结果
     * @param data 本api结果
     */
    static toSearchV2(data: IApiSearchAndroid) {
        const { code, result } = data;
        delete (<any>data).code;
        delete (<any>data).result;
        delete (<any>data).cache;
        return {
            code,
            data: Object.assign(data, {
                result: Object.entries(result).map(d => {
                    return {
                        result_type: d[0],
                        data: d[1]
                    }
                })
            }),
            message: "0",
            ttl: 1
        }
    }
}