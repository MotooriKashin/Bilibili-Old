import { debug } from "../../runtime/debug";
import { unitFormat } from "../../runtime/format/unit";
import { objUrl } from "../../runtime/format/url";
import { switchVideo } from "../../runtime/switchVideo";
import { jsonCheck } from "../../runtime/unit";
import { API } from "../../runtime/variable/variable";
import { xhr } from "../../runtime/xhr";

let first = 0; // 首p指示
/** bangumi分集数据 */
export function episodeData() {
    switchVideo(async () => {
        try {
            first++;
            let views = <HTMLSpanElement>(<HTMLDivElement>document.querySelector(".view-count")).querySelector("span");
            let danmakus = <HTMLSpanElement>(<HTMLDivElement>document.querySelector(".danmu-count")).querySelector("span");
            if (first === 1) {
                const [view, danmaku] = [
                    unitFormat(API.__INITIAL_STATE__.mediaInfo.stat.views),
                    unitFormat(API.__INITIAL_STATE__.mediaInfo.stat.danmakus)
                ];
                // 首p时辈分总播放数和总弹幕数
                views.setAttribute("title", "总播放数 " + view);
                danmakus.setAttribute("title", "总弹幕数 " + danmaku);
                debug.log("总播放数：", view, "总弹幕数", danmaku);
            }
            let data = await xhr({
                url: objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": API.aid }),
                credentials: true
            }); // 获取分集数据
            data = jsonCheck(data).data;
            let view = data.view;
            let danmaku = data.danmaku;
            view = unitFormat(view);
            danmaku = unitFormat(danmaku);
            views.innerText = view;
            danmakus.innerText = danmaku;
            debug.debug("播放", view + " 弹幕", danmaku);
        } catch (e) { debug.error("episodeData.js", e) }
    })
}
