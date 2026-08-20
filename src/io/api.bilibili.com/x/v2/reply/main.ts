import type { IReplies } from ".";

/** 获取评论 */
export async function main(
    oid: bigint,
    mode = 3,
    type = 1,
    seek_rpid: string | number = '',
    init?: RequestInit,
    plat = 1,
) {
    const url = new URL('https://api.bilibili.com/x/v2/reply/main');
    const searchParams = new URLSearchParams(<any>{ oid, mode, seek_rpid, type, plat });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IReply; }>>response.json();
}

export interface IReply {
    control: {
        root_input_text: string;
    };
    replies: IReplies[];
    upper: {
        mid: number;
    };
    top_replies?: IReplies[];
}