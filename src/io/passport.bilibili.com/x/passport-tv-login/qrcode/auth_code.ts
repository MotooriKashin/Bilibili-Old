/**
 * @file passport.bilibili.com/x/passport-tv-login/qrcode/auth_code
 * @author kashin
 */

import { Android, buvid } from "../../../../android";
import { jsonCheck } from "../../../../api";
import { ApiSign } from "../../../../api-sign";
import { URLS } from "../../../../urls";

/** passport.bilibili.com/x/passport-tv-login/qrcode/auth_code */
export async function authCode() {
    const response = await GM.fetch(URLS.PASSPORT_AUTH_CODE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'user-agent': Android["user-agent"],
            'buvid': buvid(),
        },
        credentials: 'include',
        body: new ApiSign('', '27eb53fc9058f8c3').sign({
            build: Android.build,
            c_locale: Android.c_locale,
            channel: 'website',
            local_id: buvid(),
            mobi_app: Android.mobi_app,
            platform: Android.platform,
            s_locale: Android.s_locale,
            ts: Math.floor(Date.now() / 1000),
        }).param,
    });
    const json = await response.json();
    return <string>jsonCheck(json).data.auth_code;
}