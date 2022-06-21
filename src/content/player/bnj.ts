import { doWhile } from "../../runtime/doWhile";
import { addCssEs } from "../../runtime/element/addElement";

/** 拜年祭页面 */
export function bnj() {
    addCssEs("content/player/bnj.css");
    (<any>window).bnj = false; // 是否载入
    const arr: any[] = []; // 接口暂存
    // 以嵌入式播放器替换原播放器
    doWhile(() => (<any>window).__INITIAL_STATE__, () => {
        // 替换播放器节点
        const node = document.querySelector<any>("#bilibili-player").parentElement;
        const root = node.attachShadow({ mode: "closed" }); // 使用shadow覆盖视频节点而不影响页面其他功能
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.bilibili.com/blackboard/html5player.html?aid=${(<any>window).__INITIAL_STATE__.videoInfo.aid}&cid=${(<any>window).__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1&bnj=1`;
        iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
        root.appendChild(iframe);
    });
    // 暂存播放器启动命令
    Object.defineProperty(window, "EmbedPlayer", {
        configurable: true,
        set: v => {
            if (!(<any>window).bnj) {
                // 压栈
                arr.unshift(v);
            }
        },
        get: () => {
            if ((<any>window).bnj) {
                Object.defineProperty(window, "EmbedPlayer", { configurable: true, value: arr[0] });
                // 出栈
                return arr[0];
            } else {
                return function () {
                    // 轮询播放器启动命令
                    setTimeout(() => (<any>window).EmbedPlayer(...arguments), 100);
                }
            }
        }
    });
}