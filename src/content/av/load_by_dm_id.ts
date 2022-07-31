import { doWhile } from "../../runtime/do_while";
import { urlObj } from "../../runtime/format/url";
import { switchVideo } from "../../runtime/switch_video";
import { jsonCheck } from "../../runtime/unit";
import { API } from "../../runtime/variable/variable";
import { xhr } from "../../runtime/xhr";

/** 根据url中的弹幕ID跳转视频 */
export function loadByDmId() {
    const dmid = urlObj(location.href).dmid;
    let progress: any = Number(urlObj(location.href).dm_progress);
    let first = 0;
    switchVideo(async () => {
        if (!(<any>window).player?.seek) {
            await new Promise(r => {
                doWhile(() => (<any>window).player?.seek, r)
            })
        }
        if (first) return;
        first++;
        if (progress) return (<any>window).player.seek(progress);
        if (dmid) {
            progress = await xhr({
                url: `https://api.bilibili.com/x/v2/dm/thumbup/detail?oid=${API.cid}&dmid=${dmid}`,
                credentials: true
            }, true);
            progress = jsonCheck(progress).data.progress; // 检查xhr返回值并转化为json
            progress && (<any>window).player.seek(progress / 1000 - .2);
        }
    })
}
