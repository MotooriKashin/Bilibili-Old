/**
 * 旧版播放器脚本hook
 */
(function () {
    Object.defineProperty(window, "EmbedPlayer", {
        set: (v) => {
            delete window.EmbedPlayer;
            const script = GM.getResourceText("video.js");
            if (!script) return window.EmbedPlayer = v;
            new Function(script)();
        },
        get: () => undefined,
        configurable: true
    });
    API.scriptIntercept(["bilibiliPlayer.min.js"], URL.createObjectURL(new Blob([GM.getResourceText("bilibiliPlayer.js")])));
})();
interface Window {
    EmbedPlayer: () => void
}