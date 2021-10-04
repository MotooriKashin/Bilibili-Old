/**
 * 本模块负责处理dmid跳转
 */
(function () {
    try {
        const dmid = API.urlObj(location.href).dmid;
        let progress = Number(API.urlObj(location.href).dm_progress);
        let first = 0;
        API.switchVideo(async () => {
            var _a;
            if (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.seek)) {
                await new Promise(r => {
                    API.runWhile(() => { var _a; return (_a = window.player) === null || _a === void 0 ? void 0 : _a.seek; }, r);
                });
            }
            if (first)
                return;
            first++;
            if (progress)
                return window.player.seek(progress);
            if (dmid) {
                progress = await xhr({
                    url: `https://api.bilibili.com/x/v2/dm/thumbup/detail?oid=${API.cid}&dmid=${dmid}`,
                    credentials: true
                });
                progress = API.jsonCheck(progress).data.progress; // 检查xhr返回值并转化为json
                progress && window.player.seek(progress / 1000 - .2);
            }
        });
    }
    catch (e) {
        API.trace(e, "loadByDmid.js");
    }
})();
