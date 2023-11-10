/**
 * @file passport.bilibili.com/x/passport-tv-login/qrcode/poll
 * @author kashin
 */

import { Android, buvid } from "../../../../android";
import { jsonCheck } from "../../../../api";
import { ApiSign } from "../../../../api-sign";
import { URLS } from "../../../../urls";

/**
 * passport.bilibili.com/x/passport-tv-login/qrcode/poll
 * 
 * @param authCode 二维码
 */
export async function poll(authCode: string) {
    const response = await GM.fetch(URLS.PASSPORT_QRCODE_POLL, {
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
            auth_code: authCode,
        }).param,
    });
    const json = await response.json();
    return <string>jsonCheck(json).data.access_token;
}