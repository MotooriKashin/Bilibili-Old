import { fetch } from "../../../main/widget/fetch";
import type { IPlayurl } from "../../api.bilibili.com/x/player/playurl";
import { sign } from "../../sign";

/**
 * 获取视频流
 * @deprecated 404
 */
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
) {
    const url = new URL('https://app.bilibili.com/v2/playurlproj');
    const searchParams = new URLSearchParams(<any>{ cid, qn, fnval, fnver, build, device, mobi_app, otype, platform });
    url.search = searchParams.toString();
    const response = await fetch(sign(url, 'bb3101000e232e27'), { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; } & IPlayurl>>response.json();
}