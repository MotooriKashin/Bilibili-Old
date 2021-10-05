/**
 * 本模块负责获取视频信息以提供给CC字幕等模块
 * 视频信息接口`https://api.bilibili.com/x/player/v2`  
 * 备用移动端接口`https://api.bilibili.com/x/v2/dm/view`
 */
(function () {
    try {
        API.switchVideo(() => {
            let ready = false; // 载入时机标记
            API.xhrhook(["api.bilibili.com/x/player/carousel.so"], function (args) { ready = true });
            xhr({
                url: API.objUrl("https://api.bilibili.com/x/player/v2", { cid: <any>API.cid, aid: <any>API.aid }),
                responseType: "json",
                credentials: true
            }).catch((e: Error) => {
                API.trace(e, "autoFix.js");
                return xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: <any>API.cid, aid: <any>API.aid, type: <any>1 }),
                    responseType: "json",
                    credentials: true
                })
            }).then((data: any) => {
                API.runWhile(() => ready, () => {
                    // CC字幕
                    data?.data?.subtitle?.subtitles && API.closedCaption(data);
                    // 分段进度条
                    config.segProgress && data?.data?.view_points[1] && API.segProgress(data);
                })
            })
        })
    } catch (e) { API.trace(e, "player-v2.js", true) }
})();