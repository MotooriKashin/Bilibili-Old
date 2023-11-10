/**
 * @file 安卓平台信息
 * @author kashin
 */

import md5 from "md5";

export enum Android {
    /** 应用版本号 */
    build = '7540300',
    c_locale = 'zh-Hans_CN',
    s_locale = 'zh-Hans_CN',
    platform = 'android',
    mobi_app = 'android',
    'user-agent' = 'Mozilla/5.0 BiliDroid/7.54.0 (bbcallen@gmail.com) os/android model/XQ-CT72 mobi_app/android build/7540300 channel/bilih5 innerVer/7540310 osVer/12 network/2',
}

let _buvid = '';
export function buvid() {
    if (_buvid) return _buvid;
    const buvid = md5(Math.random().toString()).toUpperCase();
    return _buvid = 'XX' + buvid[2] + buvid[12] + buvid[22] + buvid;
} 