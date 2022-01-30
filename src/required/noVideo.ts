/**
 * 本模块负责强制拦截视频载入
 */
(function () {
    try {
        API.xhrhook(["/playurl?"], function (args) {
            if (config.noVideo) args[1] = API.objUrl(args[1], { aid: 1, cid: 1, ep_id: 1 })
        })
        API.switchVideo(() => {
            API.bofqiMessage(["拦截视频页媒体载入用于呼出下载面板", "取消拦截"], 3, () => {
                config.noVideo = false;
                window.player.destroy();
                (<any>window).BilibiliPlayer({ aid: API.aid, cid: API.cid });
            }, true)
        })
    } catch (e) { debug.error("noVideo.js", e) }
})();