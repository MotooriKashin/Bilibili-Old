import { DmWebViewReply } from "../../../../../../proto/DmWebViewReply";

/** 获取弹幕详情 */
export async function view(
    oid: bigint,
    pid: bigint,
    init?: RequestInit,
    type = 1,
) {
    const url = new URL('https://api.bilibili.com/x/v2/dm/web/view');
    const searchParams = new URLSearchParams(<any>{ oid, pid, type });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return DmWebViewReply.decode(await response.bytes());
}