interface modules {
    /** 旧版播放器protobuf弹幕支持 */
    readonly "protoDm.js": string;
}
namespace API {
    importModule("worker.js");
    importModule("webSocket.js");
    const id = xhrhookasync("history?type=", (args) => { // 修复历史弹幕
        const param = Format.urlObj(args[1]);
        if (!window.player?.setDanmaku) {
            removeXhrhook(id);
            toast.warning("内部组件丢失！");
            return false;
        } else if (!param.date) return false;
        xhr({
            url: `https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=${cid}&date=${param.date}`,
            responseType: "arraybuffer",
            credentials: true
        }).then((seg: any) => {
            let dm = danmaku.danmakuFormat(danmaku.segDmDecode(seg));
            window.player?.setDanmaku(dm);
            danmaku.danmaku = dm;
        }).catch((e: Error) => {
            toast.error("载入历史弹幕失败", "请尝试刷新页面");
            toast.error(<any>e);
        });
        return true;
    }, undefined, false)
}