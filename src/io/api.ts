
/** 检查并转化json接口返回值。**出错时将直接抛出！** */
export function jsonCheck<T extends IJsonRespense>(str: string | T) {
    const result: IJsonRespense = typeof str === 'string' ? JSON.parse(str) : str;
    if (result.code === 0) return <T>result;
    throw new Error(`${result.code} ${result.message}`, { cause: result.code });
}

/** fetch 返回值类型 */
export type FetchResponseType = 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData';
/** API io 基础配置 */
export interface IApiData {
    /** 返回值类型 */
    responseType?: FetchResponseType;
    credentials?: RequestCredentials;
}
/** json接口顶层标准 */
interface IJsonRespense {
    code: number;
    message: string;

    [key: string]: any;
}
/** json owner */
export interface IOwner {
    mid: number;
    name: string;
    face: string;
}
export interface IUpper extends IOwner {
    display_name: string;
    fans: number;
    followed: number;
    official_desc: string;
    official_role: number;
    official_title: string;
    vip_due_date: number;
    vip_pay_type: number;
    vip_statue: number;
    vip_type: number;
}
/** json stat */
export interface IStat {
    view: number;
    like: number;
    danmaku: number;
    follow: number;
    series_follow: number;
    aid: number;
    coin: number;
    dislike: number;
    favorite: number;
    his_rank: number;
    now_rank: number;
    reply: number;
    share: number;
    evaluation: string;
}
export interface IRight {
    arc_pay: number;
    autoplay: number;
    bp: number;
    download: number;
    elec: number;
    hd5: number;
    is_cooperation: number;
    movie: number;
    no_background: number;
    no_reprint: number;
    pay: number;
    pay_free_watch: number;
    ugc_pay: number;
    ugc_pay_preview: number;
}
export interface IAidPage {
    cid: number;
    dimension: { width: number; height: number; rotate: number; }
    duration: number;
    from: string;
    page: number;
    part: string;
    vid: string;
    weblink: string;
}
export interface ISubtitle {
    allow_submit: boolean;
    list: unknown;
}
export interface IStaf {
    name: string;
    title: string;
    face: string;
    mid: number;
    vip: {
        status: number;
    };
}
export interface IAidDatail {
    aid: number;
    bvid: string;
    cid: number;
    copyright: number;
    ctime: number;
    desc: string;
    desc_v2?: { biz_id: number; raw_text: string; type: number }[];
    dimension: IDimension;
    duration: number;
    dynamic: string;
    honor_reply?: unknown;
    is_chargeable_season: boolean;
    is_season_display: boolean;
    is_story: boolean;
    is_ogv: boolean;
    like_icon?: string;
    mission_id: number;
    no_cache: boolean;
    ogv_info?: unknown;
    owner: IOwner;
    owner_ext?: {
        fans: number;
    };
    pages?: IAidPage[];
    pic: string;
    premiere?: unknown;
    pub_location: string;
    pubdate: number;
    rcmd_reason: string;
    rights: IRight;
    season?: unknown;
    season_type: number;
    short_link: string;
    short_link_v2: string;
    stat: IStat;
    staff?: IStaf;
    state: number;
    subtitle?: ISubtitle;
    tag?: unknown[];
    teenage_mode: number;
    tid: number;
    title: string;
    tname: string;
    user_garb?: { url_image_ani_cut: string };
    videos: number;
    redirect_url?: string;
}
export interface IAidInfo {
    attr: number;
    bv_id: string;
    cnt_info: {
        coin: number;
        collect: number;
        danmaku: number;
        play: number;
        reply: number;
        share: number;
        thumb_down: number;
        thumb_up: number;
    };
    coin: { max_num: number; coin_number: number; };
    copy_right: number;
    cover: string;
    duration: number;
    elec_info: unknown;
    fav_state: number;
    id: number;
    index: number;
    intro: string;
    like_state: number;
    link: string;
    offset: number;
    page: number;
    pages: {
        dimension: { width: number; height: number; rotate: number; }
        duration: number;
        from: string;
        id: number;
        intro: string;
        link: string;
        metas: { quality: number; size: number; }[];
        page: number;
        title: string;
    }[];
    pubtime: number;
    rights: IRight;
    short_link: string;
    tid: number;
    title: string;
    type: number;
    upper: IUpper;
}
export interface IDimension {
    width: number;
    height: number;
    rotate: number;
}