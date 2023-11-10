/**
 * @file passport.bilibili.com/x/passport-tv-login/qrcode/poll
 * @author kashin
 */

import { jsonCheck } from "../../../../api";
import { ApiSign } from "../../../../api-sign";
import { buvid } from "../../../../buvid";
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
            'user-agent': 'Mozilla/5.0 BiliDroid/6.72.0 (bbcallen@gmail.com) os/android model/XQ-CT72 mobi_app/android build/6720300 channel/bilih5 innerVer/6720310 osVer/12 network/2',
            'buvid': buvid(),
        },
        credentials: 'include',
        body: new ApiSign('', '27eb53fc9058f8c3').sign({
            build: '6720300',
            c_locale: 'zh-Hans_CN',
            channel: 'website',
            local_id: buvid(),
            mobi_app: 'android',
            platform: 'android',
            s_locale: 'zh-Hans_CN',
            ts: Math.floor(Date.now() / 1000),
            auth_code: authCode,
        }).param,
    });
    const json = await response.json();
    return <string>jsonCheck(json).data.access_token;
}