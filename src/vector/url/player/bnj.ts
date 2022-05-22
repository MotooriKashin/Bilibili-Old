interface modules {
    readonly "bnj.js": string;
    readonly "bnj.css": string;
}
namespace API {
    addCss(getModule("bnj.css"));
    // loadVideoScript(".festival-video-player", true);
    doWhile(() => (<any>window).__INITIAL_STATE__, () => {
        // 替换播放器节点
        const node = document.querySelector<any>("#bilibili-player").parentElement;
        const root = node.attachShadow({ mode: "closed" }); // 使用shadow覆盖视频节点而不影响页面其他功能
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.bilibili.com/blackboard/html5player.html?aid=${(<any>window).__INITIAL_STATE__.videoInfo.aid}&cid=${(<any>window).__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1`;
        iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
        root.appendChild(iframe);
    });
    // 销毁顶层播放器
    doWhile(() => window.player, () => {
        try {
            window.player.stop();
        } catch (e) { }
        Object.defineProperty(window, "player", { get: () => (<any>window).oldPlayer, configurable: true })
    });
}