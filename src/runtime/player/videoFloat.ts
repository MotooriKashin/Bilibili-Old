import { createElement } from "../element/createElement";
import { htmlVnode } from "../element/htmlVnode";

/**
 * 播放器浮动信息
 * @param data 信息文本
 * @param hint 附加信息，将高亮显示
 * @param callback 点击附加信息时回调
 * @param time 显示时长
 */
export function videoFloat(data: string, hint?: string, callback?: () => void, time = 5) {
    const node = document.querySelector<HTMLDivElement>(".bilibili-player-video-toast-wrp");
    if (node && data) {
        const flt = <HTMLDivElement>node.appendChild(createElement(htmlVnode(
            `<div class="bilibili-player-video-toast-bottom">
                    <div class="bilibili-player-video-toast-item bilibili-player-video-toast-pay">
                        <span class="video-float-hint-text">${data}</span>
                        ${hint ? `<span class="video-float-hint-btn${callback ? " hint-red" : ""}">${hint}</span>` : ""}
                    </div>
                </div>`
        )[0]));
        if (callback && hint) {
            (<HTMLSpanElement>flt.children[0].children[1]).addEventListener("click", callback);
        }
        if (time && !isNaN(time)) {
            setTimeout(() => flt.remove(), time * 1000);
        }
    }
}