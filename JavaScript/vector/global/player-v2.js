"use strict";
/**
 * 本模块负责获取视频信息以提供给CC字幕等模块
 * 视频信息接口`https://api.bilibili.com/x/player/v2`
 * 备用移动端接口`https://api.bilibili.com/x/v2/dm/view`
 */
(function () {
    API.switchVideo(() => {
        API.xhr({
            url: API.objUrl("https://api.bilibili.com/x/player/v2", { cid: API.cid, aid: API.aid }),
            responseType: "json"
        }).catch((e) => {
            API.debug.trace(e, "autoFix.js");
            return API.xhr({
                url: API.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: API.cid, aid: API.aid, type: 1 }),
                responseType: "json"
            });
        }).then((data) => {
            // CC字幕
            data?.data?.subtitle?.subtitles && (API.importModule("closedCaption.js"), API.closedCaption(data));
            // 分段进度条
            data?.data?.view_points[1] && (API.importModule("segProgress.js"), API.segProgress(data));
        });
    });
})();
