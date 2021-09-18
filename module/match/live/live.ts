/**
 * 本模块负责引导直播相关模块  
 */
try {
    config.liveStream && API.importModule("liveStream.js");
    config.liveP2p && API.importModule("WebRTC.js");
    config.sleepCheck && API.importModule("sleepCheck.js");
    config.anchor && API.runWhile(() => document.querySelector("anchor-guest-box-id"), () => document.querySelector("anchor-guest-box-id")?.remove(), 500, 0);
    config.pkvm && API.runWhile(() => document.querySelector("chaos-pk-vm"), () => document.querySelector("chaos-pk-vm")?.remove(), 500, 0);
    API.runWhile(() => document.querySelector(".web-player-icon-roomStatus"), () => document.querySelector(".web-player-icon-roomStatus")?.remove())
} catch (e) { API.trace(e, "live.js", true) }