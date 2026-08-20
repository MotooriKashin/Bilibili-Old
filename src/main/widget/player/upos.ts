import { log } from "../../../utils/debug.js";
import { https } from "../../../utils/url.js";

/** 清洗UPOS */
export function upos(...url: string[]) {
    let res;
    for (const d of url) {
        res = new URL(https(d, true));
        if (!res.port) break;
        log('UPOS', res.host);
    }
    return res!;
}