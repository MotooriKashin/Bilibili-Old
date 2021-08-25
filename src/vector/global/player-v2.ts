/**
 * 本模块负责获取视频信息以提供给CC字幕等模块
 * 视频信息接口`https://api.bilibili.com/x/player/v2`  
 * 备用移动端接口`https://api.bilibili.com/x/v2/dm/view`
 */
(function () {
    API.switchVideo(() => {
        API.xhr({
            url: API.objUrl("https://api.bilibili.com/x/player/v2", { cid: <any>API.cid, aid: <any>API.aid }),
            responseType: "json"
        }).catch((e: Error) => {
            API.debug.trace(e, "autoFix.js");
            return API.xhr({
                url: API.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: <any>API.cid, aid: <any>API.aid, type: <any>1 }),
                responseType: "json"
            })
        }).then((data: any) => {
            // CC字幕
            data?.data?.subtitle?.subtitles && (API.importModule("closedCaption.js"), API.closedCaption(data));
            // 分段进度条
            data?.data?.view_points[1] && (API.importModule("segProgress.js"), API.segProgress(data))
        })
    })
})();