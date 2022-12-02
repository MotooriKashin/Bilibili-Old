import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

/**
 * 是否点赞
 * @param aid 视频aid
 */
export async function apiLikeHas(aid: number) {
    const response = await fetch(objUrl(URLS.HAS_LIKE, { aid }), {
        credentials: 'include'
    });
    const json = await response.json();
    return <number>jsonCheck(json).data;
}