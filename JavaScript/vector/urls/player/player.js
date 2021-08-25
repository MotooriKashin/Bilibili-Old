"use strict";
/**
 * 本模块负责重写旧版嵌入播放器
 */
(function () {
    API.path.name = "player";
    API.getVariable({ origin: window, target: "aid" });
    API.getVariable({ origin: window, target: "cid" });
    // 备份还原旧版播放器设置数据
    API.importModule("playerSetting.js");
    API.rewriteHTML(API.getHTMLFrame("player.html"));
})();
