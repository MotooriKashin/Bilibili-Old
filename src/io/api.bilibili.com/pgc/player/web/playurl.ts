import type { IPlayurl } from "../../../x/player/playurl";

/** 获取视频流 */
export async function playurl(
    avid: bigint,
    cid: bigint,
    ep_id: bigint,
    init?: RequestInit,
    qn = 127,
    fnval = 4048,
    fnver = 0,
    session = crypto.randomUUID().replaceAll('-', ''),
) {
    const url = new URL('https://api.bilibili.com/pgc/player/web/playurl');
    const searchParams = new URLSearchParams(<any>{ avid, cid, ep_id, qn, fnval, fnver, session });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; result: IPlayurl; }>>response.json();
}