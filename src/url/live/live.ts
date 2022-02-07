interface modules {
    /**
     * 直播页面相关
     */
    readonly "live.js": string;
}
{
    config.liveP2p && API.importModule("WebRTC.js");
    config.sleepCheck && API.importModule("sleepCheck.js");
    API.runWhile(() => document.querySelector(".web-player-icon-roomStatus"), () => document.querySelector(".web-player-icon-roomStatus")?.remove())
}