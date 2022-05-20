interface modules {
    /** 修复历史弹幕 */
    readonly "historyDanmaku.js": string
}
namespace API {
    const id = xhrhookasync("history?type=", (args) => { // 修复历史弹幕
        const param = urlObj(args[1]);
        if (!window.player?.setDanmaku) {
            removeXhrhook(id);
            toast.warning("托管原生脚本未开启或resource资源未存在，无法修复历史弹幕~");
            return false;
        } else if (!param.date) return false;
        xhr({
            url: `https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=${cid}&date=${param.date}`,
            responseType: "arraybuffer",
            credentials: true
        }).then((seg: any) => {
            let dm = danmaku.danmakuFormat(danmaku.segDmDecode(seg));
            window.player?.setDanmaku(dm);
            config.downloadOther && pushDownload({
                group: "弹幕",
                data: dm,
                up: "历史",
                down: `N/A`,
                callback: () => API.danmaku.saveDanmaku(dm, `${title || cid}`)
            });
        }).catch((e: Error) => {
            toast.error("载入历史弹幕失败", "请尝试刷新页面");
            toast.error(<any>e);
        });
        return true;
    }, undefined, false)
}