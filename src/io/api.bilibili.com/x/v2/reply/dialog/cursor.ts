import type { IReplies } from "..";

/** 获取评论对话 */
export async function cursor(
    root: bigint | string,
    dialog: bigint | string,
    oid: bigint,
    min_floor = 0,
    type = 1,
    init?: RequestInit,
    size = 20,
) {
    const url = new URL('https://api.bilibili.com/x/v2/reply/dialog/cursor');
    const searchParams = new URLSearchParams(<any>{ root, dialog, oid, min_floor, type, size });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: ICursor; }>>response.json();
}

interface ICursor {
    replies?: IReplies[];
    cursor: { next: number, is_end: boolean };
}