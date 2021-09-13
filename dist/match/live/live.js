/**
 * 本模块负责引导直播相关模块
 * WebRTC相关代码来自
 * @see WebRTC-Control {@link https://mybrowseraddon.com/webrtc-control.html}
 */
(function () {
    config.liveStream && API.importModule("liveStream.js");
    config.liveP2p && API.importModule("WebRTC.js");
    config.sleepCheck && API.importModule("sleepCheck.js");
    config.anchor && API.runWhile(() => document.querySelector("anchor-guest-box-id"), () => { var _a; return (_a = document.querySelector("anchor-guest-box-id")) === null || _a === void 0 ? void 0 : _a.remove(); }, 500, 0);
    config.pkvm && API.runWhile(() => document.querySelector("chaos-pk-vm"), () => { var _a; return (_a = document.querySelector("chaos-pk-vm")) === null || _a === void 0 ? void 0 : _a.remove(); }, 500, 0);
    API.runWhile(() => document.querySelector(".web-player-icon-roomStatus"), () => { var _a; return (_a = document.querySelector(".web-player-icon-roomStatus")) === null || _a === void 0 ? void 0 : _a.remove(); });
})();
