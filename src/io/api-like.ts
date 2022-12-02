import { jsonCheck } from "./api";
import { URLS } from "./urls";

/**
 * 点赞
 * @param aid 视频aid
 * @param bili_jct 鉴权cookie键值
 * @param like 点赞/取消
 */
export async function apiLike(aid: number, bili_jct: string, like = false) {
    const response = await fetch(URLS.LIKE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `aid=${aid}&like=${like ? 1 : 2}&csrf=${bili_jct}`,
        credentials: 'include'
    });
    const json = await response.json();
    return jsonCheck(json);
}