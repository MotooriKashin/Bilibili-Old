import type { ISubReplies } from "./reply";

/** 获取评论 */
export async function reply(
    oid: bigint,
    pn = 1,
    sort = 2,
    type = 1,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/x/v2/reply');
    const searchParams = new URLSearchParams(<any>{ oid, pn, sort, type });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IReply; }>>response.json();
}

export interface IReply {
    page: { count: number; size: number };
    control: {
        root_input_text: string;
    };
    replies: IReplies[];
    upper: {
        mid: number;
    };
    top_replies?: IReplies[];
}

export interface IReplies {
    member: {
        mid: string;
        avatar: string;
        vip: {
            nickname_color: string;
        };
        uname: string;
        level_info: { current_level: number };
        is_senior_member: number;
        nameplate: { image: string };
        user_sailing?: { cardbg?: { image: string; fan: { color_format?: { colors: [string, string], gradients: [number, number] }, num_prefix: string; num_desc: string } } };
        fans_detail?: {
            medal_name: string;
            level: number;
            medal_color_name: number;
            medal_color_level: number;
            medal_color_border: number;
            medal_color: number;
            medal_color_end: number;
            medal_level_bg_color: number;
        };
        pendant: { image_enhance: string };
        official_verify: { type: number };
    };
    content: {
        message: string;
        at_name_to_mid_str?: Record<string, string>;
        emote?: Record<string, { url: string; meta: { size: number } }>;
        pictures?: {
            img_src: string;
            img_height: number;
            img_width: number;
        }[];
    };
    floor?: number;
    reply_control: { location?: string };
    ctime: number;
    like: number;
    up_action: { like: boolean; reply: boolean; };
    rcount: number;
    replies?: ISubReplies[];
    rpid_str: string;
    dialog_str: string;
    root_str: string;
    parent_str: string;
    /**
     * | 0 | 1 | 2 |
     * | - | - | - |
     * |   | 赞 | 踩 |
     */
    action: number;
}