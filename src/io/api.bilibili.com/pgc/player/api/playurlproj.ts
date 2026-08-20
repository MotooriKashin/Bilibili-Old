import { sign } from "../../../../sign";
import type { IPlayurl } from "../../../x/player/playurl";


/** 获取视频流 */
export async function playurlproj(
    cid: bigint,
    init?: RequestInit,
    qn = 127,
    fnval = 4048,
    fnver = 0,
    build = "2040100",
    device = "android",
    mobi_app = "android_i",
    otype = "json",
    platform = "android_i",
    module = "bangumi",
) {
    const url = new URL('https://api.bilibili.com/pgc/player/api/playurlproj');
    const searchParams = new URLSearchParams(<any>{ cid, qn, fnval, fnver, build, device, mobi_app, otype, platform, module, ts: Temporal.Now.instant().epochMilliseconds });
    url.search = searchParams.toString();
    const response = await fetch(sign(url, 'bb3101000e232e27'), { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; } & IPlayurl>>response.json();
}