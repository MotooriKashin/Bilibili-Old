/**
 * @file https://passport.bilibili.com/login/exit/v2
 * @author kashin
 */

import { getCookies } from "../utils/cookie";
import { URLS } from "./urls";

/** https://passport.bilibili.com/login/exit/v2 */
export async function passportLoginExit() {
    const { DedeUserID, bili_jct } = getCookies()
    await fetch(URLS.PASSPORT_LOGIN_EXIT, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `biliCSRF=${bili_jct}&gourl=https%3A%2F%2Fwww.bilibili.com%2F`
    });
    return `https://passport.biligame.com/crossDomain?DedeUserID=${DedeUserID}&DedeUserID__ckMd5=&SESSDATA=&bili_jct=&gourl=https%3A%2F%2Fwww.bilibili.com%2F`
}