import { isUserScript } from "../../tampermonkey/check";
import { addCssEs, loadScript } from "../element/add_element";
import { toast } from "../toast/toast";

/** 加载旧版播放器脚本 最好启动播放器时再加载，否则若jQuery被覆盖可能引发各种问题 */
export async function loadBilibiliPlayer() {
    if (!(<any>window).jQuery) await loadScript("//static.hdslb.com/js/jquery.min.js");
    if (isUserScript) {
        const player = GM_getResourceText("bilibiliPlayer.js");
        (<any>window).player?.pause(); // 尝试清除已销毁的新版播放器
        Reflect.deleteProperty(window, "player");
        if (player) return new Function(GM_getResourceText("bilibiliPlayer.js"))();
        return loadScript("//static.hdslb.com/player/js/bilibiliPlayer.min.js").then(() => {
            toast.warning("bilibiliPlayer.min.js 已回滚~", "当前可能无法访问 jsdelivr ！", "反查弹幕发送者等部分播放器增强功能暂时无法使用🤣");
        });
    }
    addCssEs("bilibili/bilibiliPlayer.css");
    return await loadScript(`chrome-extension://${sessionStorage.getItem("bilibili-old")}/bilibili/bilibiliPlayer.js`);
}