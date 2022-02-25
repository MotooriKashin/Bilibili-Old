interface modules {
    /** 直播页面相关 */
    readonly "live.js": string;
}
namespace API {
    config.liveP2p && importModule("WebRTC.js");
    config.sleepCheck && importModule("sleepCheck.js");
    runWhile(() => document.querySelector(".web-player-icon-roomStatus"), () => document.querySelector(".web-player-icon-roomStatus")?.remove())
}