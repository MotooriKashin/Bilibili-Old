/**
 * @file buvid
 * @author kashin
 */

import md5 from "md5"

let _buvid = '';
export function buvid() {
    if (_buvid) return _buvid;
    const buvid = md5(Math.random().toString()).toUpperCase();
    return _buvid = 'XX' + buvid[2] + buvid[12] + buvid[22] + buvid;
}