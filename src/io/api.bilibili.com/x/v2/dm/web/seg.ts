import { DmSegMobileReply } from "../../../../../../proto/DmSegMobileReply";

/** 获取弹幕分包 */
export async function seg(
    oid: bigint,
    pid: bigint,
    segment_index = 1,
    init?: RequestInit,
    type = 1,
) {
    const url = new URL('https://api.bilibili.com/x/v2/dm/web/seg.so');
    const searchParams = new URLSearchParams(<any>{ oid, pid, type, segment_index });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return DmSegMobileReply.decode(await response.bytes());

}