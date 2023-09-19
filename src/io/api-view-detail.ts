import { objUrl } from "../utils/format/url";
import { IAidDatail, jsonCheck } from "./api";
import { URLS } from "./urls";

export class ApiViewDetail {
    code = 0;
    data: IApiViewDetailResponse = <any>{
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
export async function apiViewDetail(aid: number) {
    const response = await fetch(objUrl(URLS.VIEW_DETAIL, {
        aid
    }));
    const json = await response.json();
    return <IApiViewDetailResponse>jsonCheck(json).data;
}

interface IOfficial {
    role: number;
    title: string;
    desc: string;
    type: number;
}
interface ILevelInfo {
    current_level: number;
    current_min: number;
    current_exp: number;
    next_exp: number;
}
interface INameplate {
    condition: string;
    image: string;
    image_small: string;
    level: string;
    name: string;
    nid: number;
}

export interface IPendant {
    expire: number;
    image: string;
    image_enhance: string;
    image_enhance_frame: string;
    name: string;
    pid: number;
}
interface IVip {
    avatar_subscript: number;
    avatar_subscript_url: string;
    due_date: number;
    label: {
        bg_color: string;
        bg_style: number;
        border_color: string;
        img_label_uri_hans: string;
        img_label_uri_hans_static: string;
        img_label_uri_hant: string;
        img_label_uri_hant_static: string;
        label_theme: string;
        path: string;
        text: string;
        text_color: string;
        use_img_label: boolean;
    }
    nickname_color: string;
    role: number;
    status: number;
    theme_type: number;
    tv_vip_pay_type: number;
    tv_vip_status: number;
    type: number;
    vipStatus: number;
    vipType: number;
    vip_pay_type: number;
}
export interface IUserInfo {
    DisplayRank: string;
    Official: IOfficial;
    approve: boolean;
    article: number;
    attention: number;
    attentions: string[];
    birthday: string;
    description: string;
    face: string;
    face_nft: number;
    face_nft_type: number;
    fans: number;
    friend: number;
    is_senior_member: number;
    level_info: ILevelInfo;
    mid: number;
    name: string;
    nameplate: INameplate;
    official_verify: { type: number; desc: string; }
    pendant: IPendant;
    place: string;
    rank: string;
    regtime: number;
    sex: string;
    sign: string;
    spacesta: number;
    vip: IVip;
}
interface IUserCard {
    archive_count: number;
    article_count: number;
    card: IUserInfo;
    follower: number;
    following: boolean;
    like_num: number;
    space: { s_img: string; l_img: string }
}

interface IReply {
    action: number;
    assist: number;
    attr: number;
    content: { message: string; plat: number; device: string; }
    count: number;
    ctime: number;
    dialog: number;
    fansgrade: number;
    floor: number;
    like: number;
    mid: number;
    oid: number;
    parent: number;
    rcount: number;
    replies: IReply[];
    root: number;
    rpid: number;
    show_follow: boolean;
    state: number;
    type: number;
}
export interface IApiViewDetailResponse {
    Card: IUserCard;
    Related: IAidDatail[];
    Reply: {
        page: { acount: number; count: number; num: number; size: number; };
        replies: IReply[];
    };
    Spec: unknown;
    Tags: unknown[];
    View: IAidDatail;
    elec: unknown;
    guide: unknown;
    hot_share: { show: boolean; list: unknown[] };
    recommend: unknown;
    view_addit: boolean[];
}