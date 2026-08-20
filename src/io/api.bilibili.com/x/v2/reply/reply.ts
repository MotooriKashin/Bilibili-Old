/** 获取评论楼中楼 */
export async function reply(
    root: bigint | string,
    oid: bigint,
    pn = 1,
    type = 1,
    init?: RequestInit,
    ps = 10,
) {
    const url = new URL('https://api.bilibili.com/x/v2/reply/reply');
    const searchParams = new URLSearchParams(<any>{ root, oid, pn, type, ps });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: ISubReply; }>>response.json();
}

interface ISubReply {
    page: { count: number; size: number };
    replies?: ISubReplies[];
}

export interface ISubReplies {
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
    };
    floor?: number;
    reply_control: { location?: string };
    ctime: number;
    like: number;
    up_action: { like: boolean; reply: boolean; };
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