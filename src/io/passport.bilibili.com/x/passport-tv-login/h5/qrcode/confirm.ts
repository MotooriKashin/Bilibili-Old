/**
 * @file passport.bilibili.com/x/passport-tv-login/h5/qrcode/confirm
 * @author kashin
 */

import { getCookies } from "../../../../../../utils/cookie";
import { objUrl } from "../../../../../../utils/format/url";
import { Android, buvid } from "../../../../../android";
import { jsonCheck } from "../../../../../api";
import { URLS } from "../../../../../urls";

/**
 * passport.bilibili.com/x/passport-tv-login/h5/qrcode/confirm
 * 
 * @param authCode 二维码
 * @param csrf cookie.bili_jct
 */
export async function confirm(authCode: string, csrf = getCookies().bili_jct) {
    const response = await GM.fetch(URLS.PASSPORT_QRCODE_CONFIRM, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'user-agent': Android["user-agent"],
            'buvid': buvid(),
        },
        credentials: 'include',
        body: objUrl('', { auth_code: authCode, csrf, scanning_type: 1 }),
    });
    const json = await response.json();
    return <string>jsonCheck(json).data.gourl;
}