import { doWhile } from "../../runtime/doWhile";
import { setting } from "../../runtime/setting";
import { sleepCheck } from "./sleepCheck";

/** live页面 */
export function livePage() {
    setting.sleepCheck && sleepCheck();
    // 移除水印
    doWhile(() => document.querySelector(".web-player-icon-roomStatus"), d => d.remove())
}