/**
 * @file passport.bilibili.com/x/passport-tv-login/h5/qrcode/confirm
 * @author kashin
 */

import { getCookies } from "../../../../../../utils/cookie";
import { objUrl } from "../../../../../../utils/format/url";
import { jsonCheck } from "../../../../../api";
import { buvid } from "../../../../../buvid";
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
            'user-agent': 'Mozilla/5.0 BiliDroid/6.72.0 (bbcallen@gmail.com) os/android model/XQ-CT72 mobi_app/android build/6720300 channel/bilih5 innerVer/6720310 osVer/12 network/2',
            'buvid': buvid(),
        },
        credentials: 'include',
        body: objUrl('', { auth_code: authCode, csrf, scanning_type: 1 }),
    });
    const json = await response.json();
    return <string>jsonCheck(json).data.gourl;
}