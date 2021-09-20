/**
 * 本模块负责获取视频信息以提供给CC字幕等模块
 * 视频信息接口`https://api.bilibili.com/x/player/v2`
 * 备用移动端接口`https://api.bilibili.com/x/v2/dm/view`
 */
(function () {
    try {
        API.switchVideo(() => {
            let ready = false; // 载入时机标记
            API.xhrhook(["api.bilibili.com/x/player/carousel.so"], function (args) { ready = true; });
            xhr({
                url: API.objUrl("https://api.bilibili.com/x/player/v2", { cid: API.cid, aid: API.aid }),
                responseType: "json"
            }).catch((e) => {
                API.trace(e, "autoFix.js");
                return xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: API.cid, aid: API.aid, type: 1 }),
                    responseType: "json"
                });
            }).then((data) => {
                API.runWhile(() => ready, () => {
                    var _a, _b, _c;
                    // CC字幕
                    ((_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.subtitle) === null || _b === void 0 ? void 0 : _b.subtitles) && API.closedCaption(data);
                    // 分段进度条
                    ((_c = data === null || data === void 0 ? void 0 : data.data) === null || _c === void 0 ? void 0 : _c.view_points[1]) && API.segProgress(data);
                });
            });
        });
    }
    catch (e) {
        API.trace(e, "player-v2.js", true);
    }
})();
