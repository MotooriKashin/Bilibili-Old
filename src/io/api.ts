import md5 from "md5";
import { URL } from "../utils/format/url";

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
/** 检查并转化json接口返回值。**出错时将直接抛出！** */
export function jsonCheck(str: string | IJsonRespense) {
    const result: IJsonRespense = typeof str === 'string' ? JSON.parse(str) : str;
    if (result.code === 0) return result;
    throw new Error(`${result.code} ${result.message}`, { cause: result.code });
}
enum APP_KEY {
    /** 安卓 客户端 一般用途 */
    '1d8b6e7d45233436' = '560c52ccd288fed045859ed18bffd973',
    /** 安卓 客户端 4.x */
    'c1b107428d337928' = 'ea85624dfcf12d7cc7b2b3a94fac1f2c',
    /** 安卓 概念版 */
    '07da50c9a0bf829f' = '25bdede4e1581c836cab73a48790ca6e',
    /** 安卓 东南亚 */
    '7d089525d3611b1c' = 'acd495b248ec528c2eed1e862d393126',
    '9e5ded06c39bf5c4' = '583e398ed0f980290b5903aba30b4cc4',
    /** ios 客户端 一般用途 **授权第三方登录** */
    '27eb53fc9058f8c3' = 'c2ed53a74eeefe3cf99fbd01d8c9c375',
    /** 未知 */
    '85eb6835b0a1034e' = '2ad42749773c441109bdc0191257a664',
    /** TV 客户端 */
    '4409e2ce8ffd12b8' = '59b43e04ad6965f34319062b478f83dd',
    /** 安卓 biliLink */
    '37207f2beaebf8d7' = 'e988e794d4d4b6dd43bc0e89d6e90c43',
    /** PC UWP */
    '84956560bc028eb7' = '94aba54af9065f71de72f5508f1cd42e',
    /** 安卓 国际版 */
    'bb3101000e232e27' = '36efcfed79309338ced0380abd824ac1',
    /** 安卓 biliLink 取流专用 */
    'fb06a25c6338edbc' = 'fd10bd177559780c2e4a44f1fa47fa83',
    /** 安卓 客户端 取流专用 */
    'iVGUTjsxvpLeuDCf' = 'aHRmhWMLkdeMuILqORnYZocwMBpMEOdt',
    /** 安卓 概念版 */
    '178cf125136ca8ea' = '34381a26236dd1171185c0beb042e1c6',
    /** 安卓 客户端 */
    '57263273bc6b67f6' = 'a0488e488d1567960d3a765e8d129f90',
    /** 安卓 车机版 */
    '8d23902c1688a798' = '710f0212e62bd499b8d3ac6e1db9302a',
    /** 安卓 概念版 */
    '7d336ec01856996b' = 'a1ce6983bc89e20a36c37f40c4f1a0dd',
    /** 安卓 国际版 */
    '8e16697a1b4f8121' = 'f5dd03b752426f2e623d7badb28d190a',
    /** PC 投稿工具 */
    'aae92bc66f3edfab' = 'af125a0d5279fd576c1b4418a3e8276d',
    /** 安卓 国际版 */
    'ae57252b0c09105d' = 'c75875c596a69eb55bd119e74b07cfe3',
    /** 安卓 客户端 登录专用 */
    'bca7e84c2d947ac6' = '60698ba2f68e01ce44738920a0ffe768',
    /** 安卓 轻视频 */
    'cc578d267072c94d' = 'ffb6bb4c4edae2566584dbcacfc6a6ad',
    /** 安卓 漫画 */
    'cc8617fd6961e070' = '3131924b941aac971e45189f265262be',
    /** ios 客户端 取流专用 */
    'YvirImLGlLANCLvM' = 'JNlZNgfNGKZEpaDTkCdPQVXntXhuiJEM',
    /** interface 0..3 */
    'f3bb208b3d081dc8' = 'f7c926f549b9becf1c27644958676a21',
    /** interface 4..7 */
    '4fa4601d1caa8b48' = 'f7c926f549b9becf1c27644958676a21',
    /** interface 8..11 */
    '452d3958f048c02a' = 'f7c926f549b9becf1c27644958676a21',
    /** interface 12..15 */
    '86385cdc024c0f6c' = 'f7c926f549b9becf1c27644958676a21',
    /** interface 16..19 */
    '5256c25b71989747' = 'f7c926f549b9becf1c27644958676a21',
    /** interface 20..23 */
    'e97210393ad42219' = 'f7c926f549b9becf1c27644958676a21',
    /** 安卓 必剪 */
    '5dce947fe22167f9' = '',
    /** 上古 */
    '8e9fc618fbd41e28' = ''
}
enum APP_SECRET {
    /** VIP */
    '9b288147e5474dd2aa67085f716c560d',
    /** PlayUrl */
    '1c15888dc316e05a15fdd0a02ed6584f'
}
export class ApiSign {
    protected get ts() {
        return new Date().getTime();
    }
    constructor(protected url: string, protected appkey: keyof typeof APP_KEY) { }
    /**
     * URL签名
     * @param searchParams 查询参数，会覆盖url原有参数
     * @param api 授权api，**授权第三方登录专用**
     * @returns 签名后的api
     */
    protected sign(searchParams: Record<string, string | number> = {}, api = '') {
        const url = new URL(this.url);
        Object.assign(url.params, searchParams, { ts: this.ts });
        delete url.params.sign;
        api && (this.appkey = "27eb53fc9058f8c3");
        const appSecret = this.appSecret;
        url.params.appkey = this.appkey;
        url.sort();
        url.params.sign = md5((api ? `api=${decodeURIComponent(api)}` : url.param) + appSecret);
        return url.toJSON();
    }
    protected get appSecret() {
        switch (this.appkey) {
            case 'f3bb208b3d081dc8':
            case '4fa4601d1caa8b48':
            case '452d3958f048c02a':
            case '86385cdc024c0f6c':
            case '5256c25b71989747':
            case 'e97210393ad42219':
                switch (Math.trunc(new Date().getHours() / 4)) {
                    case 0:
                        this.appkey = 'f3bb208b3d081dc8';
                        break;
                    case 1:
                        this.appkey = '4fa4601d1caa8b48';
                        break;
                    case 2:
                        this.appkey = '452d3958f048c02a';
                        break;
                    case 3:
                        this.appkey = '86385cdc024c0f6c';
                        break;
                    case 4:
                        this.appkey = '5256c25b71989747';
                        break;
                    case 5:
                        this.appkey = 'e97210393ad42219';
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return APP_KEY[this.appkey];
    }
}