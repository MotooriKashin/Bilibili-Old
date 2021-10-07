/**
 * 添加下载右键菜单
 */
(function () {
    API.runWhile(() => window.player, () => {
        try {
            const li = document.createElement("li");
            let flag = 0;
            li.innerHTML = '<a id="BLOD-dl-content" class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onmouseover = () => li.setAttribute("class", "context-line context-menu-function bili-old-download hover");
            li.onmouseout = () => li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onclick = () => API.downloadThis();
            document.querySelector("#bilibiliPlayer")?.addEventListener("DOMNodeInserted", e => {
                if (!flag && (<HTMLElement>e.target).className && (<HTMLElement>e.target).className.includes("context-line context-menu-function")) {
                    const node = document.querySelector(".bilibili-player-context-menu-container.black");
                    flag = setTimeout(() => {
                        if (node.querySelector(".context-menu-danmaku")) return;
                        if (node.contains(li)) return;
                        node.firstChild.appendChild(li);
                    }, 100);
                }
            })
            document.querySelector("#bilibiliPlayer")?.addEventListener("DOMNodeRemoved", e => {
                if (flag && (<HTMLElement>e.target).className && (<HTMLElement>e.target).className.includes("context-line context-menu-function")) {
                    flag = 0;
                    const node = document.querySelector(".bilibili-player-context-menu-container.black");
                    node.contains(li) && li.remove();
                }
            })
        } catch (e) { toast.error("dlContentMenu.js", e) }
    })
})();