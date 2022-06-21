import { setting } from "../../runtime/setting";
import { album } from "./album";
import { jointime } from "./jointime";
import { lostVideo } from "./lostVideo";
import { midInfo } from "./midInfo";

/** 个人空间 */
export function spacePage() {
    const path = location.href.split("/");
    const mid = Number(path[3] && path[3].split("?")[0]);
    (mid == 11783021 || mid == 1988098633 || mid == 2042149112) && midInfo(mid);
    setting.album && album();
    setting.jointime && jointime(mid);
    setting.lostVideo && lostVideo();
}