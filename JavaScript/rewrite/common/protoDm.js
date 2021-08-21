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
        if (!window.setDanmaku) {
            API.removeXhrhook(id);
            return API.toast.warning("未启用“原生脚本代理”，无法修复历史弹幕！", "请在设置中开启相关支持后刷新页面重试。");
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
                window.setDanmaku(API.danmakuFormat(segDm));
                API.toXml(segDm).then(xml => API.xml = xml);
            }).catch((e) => {
                API.toast.error("载入历史弹幕失败", "请尝试刷新页面");
                API.toast.error(e);
            });
        }
    });
})();
