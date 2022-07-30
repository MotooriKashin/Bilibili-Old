import { debug } from "./debug";
import { observerAddedNodes } from "./node_observer";

const switchlist: Function[] = [];
/**
 * 注册切P回调  
 * 实际上是播放器每次初始化完成时回调，意思是首P也能用。
 * @param callback 切P时的回调函数
 */
export function switchVideo(callback: Function) {
    try {
        if (typeof callback === "function") switchlist.push(callback);
    } catch (e) {
        debug.error("switchVideo.js", e)
    }
}
observerAddedNodes((node) => {
    if (/bilibili-player-area video-state-pause/.test(node.className)) {
        switchlist.forEach(async d => {
            try {
                d()
            } catch (e) {
                debug.error(d);
                debug.error(e);
            }
        });
    }
})