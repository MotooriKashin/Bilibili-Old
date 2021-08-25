"use strict";
/**
 * 本模块负责处理dmid跳转
 */
(function () {
    const dmid = API.urlObj(location.href).dmid;
    let progress = Number(API.urlObj(location.href).dm_progress);
    let first = 0;
    API.switchVideo(async () => {
        if (!window.player?.seek) {
            await new Promise(r => {
                API.runWhile(() => window.player?.seek, r);
            });
        }
        if (first)
            return;
        first++;
        if (progress)
            return window.player.seek(progress);
        if (dmid) {
            progress = await API.xhr({ url: `https://api.bilibili.com/x/v2/dm/thumbup/detail?oid=${API.cid}&dmid=${dmid}` });
            progress = API.jsonCheck(progress).data.progress; // 检查xhr返回值并转化为json
            progress && window.player.seek(progress / 1000 - .2);
        }
    });
})();
