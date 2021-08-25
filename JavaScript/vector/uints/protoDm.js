"use strict";
/**
 * 本模块负责使旧版播放器支持新版弹幕
 */
(function () {
    // 导入弹幕函数支持
    API.importModule("danmaku.js");
    // 修复一般弹幕
    API.importModule("worker.js");
    // 修复历史弹幕
    let id = API.xhrhook(["history?type="], function (args) {
        if (!window.player?.setDanmaku) {
            API.removeXhrhook(id);
            return API.toast.warning("内部组件丢失！");
        }
        let param = API.urlObj(args[1]);
        if (param.date) {
            Object.defineProperty(this, "response", { writable: true });
            Object.defineProperty(this, "readyState", { writable: true });
            Object.defineProperty(this, "status", { writable: true });
            Object.defineProperty(this, "send", { writable: true });
            this.readyState = 4;
            this.status = 200;
            this.send = () => { };
            let history = "https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=" + API.cid + "&date=" + param.date;
            API.xhr({
                url: history,
                responseType: "arraybuffer"
            }).then((seg) => {
                let segDm = API.segDmDecode(seg);
                window.player?.setDanmaku(API.danmaku = API.danmakuFormat(segDm));
            }).catch((e) => {
                API.toast.error("载入历史弹幕失败", "请尝试刷新页面");
                API.toast.error(e);
            });
        }
    });
})();
