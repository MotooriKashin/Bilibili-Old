import { doWhile } from "../../runtime/do_while";
import { setting } from "../../runtime/setting";
import { sleepCheck } from "./sleep_check";

/** live页面 */
export function livePage() {
    setting.sleepCheck && sleepCheck();
    // 移除水印
    doWhile(() => document.querySelector(".web-player-icon-roomStatus"), d => d.remove())
}