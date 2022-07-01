import { pushDownload } from "../download/download";
import { urlObj } from "../format/url";
import { removeXhrhook, xhrhookAsync } from "../hook/xhr";
import { setting } from "../setting";
import { toast } from "../toast/toast";
import { VAR } from "../variable/variable";
import { xhr } from "../xhr";
import { danmaku } from "./danmaku";

/** 修复历史弹幕 */
export function historyDanmaku() {
    const id = xhrhookAsync("history?type=", (args) => { // 修复历史弹幕
        const param = urlObj(args[1]);
        if (!VAR.player?.setDanmaku) {
            removeXhrhook(id);
            return false;
        } else if (!param.date) return false;
        xhr({
            url: `https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=${VAR.cid}&date=${param.date}`,
            responseType: "arraybuffer",
            credentials: true
        }).then((seg: any) => {
            let dm = danmaku.danmakuFormat(danmaku.segDmDecode(seg));
            VAR.player?.setDanmaku(dm);
            setting.downloadOther && pushDownload({
                group: "弹幕",
                data: dm,
                up: "历史",
                down: `N/A`,
                callback: () => danmaku.saveDanmaku(dm, `${VAR.title || VAR.cid}`)
            });
        }).catch((e: Error) => {
            toast.error("载入历史弹幕失败", "请尝试刷新页面");
            toast.error(<any>e);
        });
        return true;
    }, undefined, false)
}
