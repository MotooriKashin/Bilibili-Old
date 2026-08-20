import type { IPlayurl } from "../../api.bilibili.com/x/player/playurl";
import { sign } from "../../sign";

/**
 * 获取视频流
 * @deprecated 403
 */
export async function playurl(
    cid: bigint,
    init?: RequestInit,
    qn = 127,
    fnval = 4048,
    fnver = 0,
    type = '',
    otype = 'json',
) {
    const url = new URL('https://interface.bilibili.com/v2/playurl');
    const searchParams = new URLSearchParams(<any>{ cid, qn, fnval, fnver, type, otype });
    url.search = searchParams.toString();
    const response = await fetch(sign(url, 'YvirImLGlLANCLvM'), { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IPlayurl; }>>response.json();
}