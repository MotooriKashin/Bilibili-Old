/**
 * 添加下载右键菜单
 */
(function () {
    try {
        API.runWhile(() => window.player, () => {
            var _a, _b;
            const li = document.createElement("li");
            let flag = 0;
            li.innerHTML = '<a id="BLOD-dl-content" class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onmouseover = () => li.setAttribute("class", "context-line context-menu-function bili-old-download hover");
            li.onmouseout = () => li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onclick = () => API.downloadThis();
            (_a = document.querySelector("#bilibiliPlayer")) === null || _a === void 0 ? void 0 : _a.addEventListener("DOMNodeInserted", e => {
                if (!flag && e.target.className && e.target.className.includes("context-line context-menu-function")) {
                    const node = document.querySelector(".bilibili-player-context-menu-container.black");
                    flag = setTimeout(() => {
                        if (node.querySelector(".context-menu-danmaku"))
                            return;
                        if (node.contains(li))
                            return;
                        node.firstChild.appendChild(li);
                    }, 100);
                }
            });
            (_b = document.querySelector("#bilibiliPlayer")) === null || _b === void 0 ? void 0 : _b.addEventListener("DOMNodeRemoved", e => {
                if (flag && e.target.className && e.target.className.includes("context-line context-menu-function")) {
                    flag = 0;
                    const node = document.querySelector(".bilibili-player-context-menu-container.black");
                    node.contains(li) && li.remove();
                }
            });
        });
    }
    catch (e) {
        API.trace(e, "dlContentMenu.js");
    }
})();
