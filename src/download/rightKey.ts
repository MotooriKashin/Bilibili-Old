interface modules {
    /** 添加右键下载菜单 */
    readonly "rightKey.js": string;
}
namespace API {
    switchVideo(() => {
        try {
            const li = document.createElement("li");
            li.innerHTML = '<a id="BOLD-dl-content" class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onmouseover = () => li.setAttribute("class", "context-line context-menu-function bili-old-download hover");
            li.onmouseout = () => li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onclick = () => download();
            let flag = 0;
            document.querySelector("#bilibiliPlayer")?.addEventListener("DOMNodeInserted", e => {
                if (!flag && (<HTMLElement>e.target).className && /context-line context-menu-function/.test((<HTMLElement>e.target).className)) {
                    const node = (<any>document).querySelector(".bilibili-player-context-menu-container.black");
                    node && (flag = setTimeout(() => {
                        if (node.querySelector(".context-menu-danmaku")) return;
                        if (node.querySelector("#BOLD-dl-content")) return;
                        if (node.contains(li)) return;
                        node.firstChild.appendChild(li);
                    }, 100));
                }
            })
            document.querySelector("#bilibiliPlayer")?.addEventListener("DOMNodeRemoved", e => {
                if (flag && (<HTMLElement>e.target).className && /context-line context-menu-function/.test((<HTMLElement>e.target).className)) {
                    flag = 0;
                    try { li.remove() } catch { };
                }
            })
        } catch (e) { toast.error("dlContentMenu.js", e) }
    });
}