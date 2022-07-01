import { bindKeyMap } from "./hook/keymap.js";
import { setting } from "./setting.js";
import { VAR } from "./variable/variable.js";

/** 注册播放按键 */
export function playerKeyMap() {
    // 注册键盘事件
    bindKeyMap("F", () => { // 全屏
        document.querySelector<HTMLDivElement>(".icon-24fullscreen")?.click();
    });
    bindKeyMap("D", () => { // 弹幕
        document.querySelector<HTMLDivElement>(".bilibili-player-video-btn-danmaku")?.click();
    });
    bindKeyMap("[", () => { // 上一p
        VAR.player.prev();
    });
    bindKeyMap("]", () => { // 下一p
        VAR.player.next();
    });
    bindKeyMap("enter", () => { // 输入框
        document.querySelector<HTMLInputElement>(".bilibili-player-video-danmaku-input")?.select();
    });
    bindKeyMap("V", () => {
        // 开启或关闭视频缩放渲染的抗锯齿
        // 详见https://github.com/MotooriKashin/Bilibili-Old/issues/292
        let video = <HTMLDivElement>document.querySelector("#bilibiliPlayer .bilibili-player-video video");
        if (video) {
            let filter = video.style.filter;
            if (filter.includes("contrast")) {
                filter = filter.replace("contrast(1)", "");
                setting.videoDisableAA = false;
            } else {
                filter += "contrast(1)";
                setting.videoDisableAA = true;
            }
            video.style.filter = filter;
        }
    });
}