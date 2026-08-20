import { fetch } from "../../../../../../../main/widget/fetch";
import type { IPlayurl } from "../../../../../../api.bilibili.com/x/player/playurl";
import { sign } from "../../../../../../sign";

/**
 * 获取视频流
 * @deprecated 502
 */
export async function playurl(
    aid: bigint,
    cid: bigint,
    init?: RequestInit,
    qn = 127,
    fnval = 4048,
    fnver = 0,
    device = "android",
    force_host = 1,
    mobi_app = "android_i",
    platform = "android_i",
    build = 2100110,
    otype = 'json',
) {
    const url = new URL('https://apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl');
    const searchParams = new URLSearchParams(<any>{ aid, cid, qn, fnval, fnver, device, force_host, mobi_app, platform, build, otype });
    url.search = searchParams.toString();
    const response = await fetch(sign(url, "bb3101000e232e27"), { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IPlayurl; }>>response.json();
}