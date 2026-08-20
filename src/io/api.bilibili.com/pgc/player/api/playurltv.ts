import { sign } from "../../../../sign";
import type { IPlayurl } from "../../../x/player/playurl";


/** 获取视频流 */
export async function playurltv(
    avid: bigint,
    cid: bigint,
    init?: RequestInit,
    qn = 127,
    fnval = 4048,
    fnver = 0,
    platform = 'android',
    mobi_app = 'android_tv_yst',
    build = 102801,
) {
    const url = new URL('https://api.bilibili.com/pgc/player/api/playurltv');
    const searchParams = new URLSearchParams(<any>{ avid, cid, qn, fnval, fnver, platform, mobi_app, build, ts: Temporal.Now.instant().epochMilliseconds });
    url.search = searchParams.toString();
    const response = await fetch(sign(url, '27eb53fc9058f8c3'), { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; } & IPlayurl>>response.json();
}