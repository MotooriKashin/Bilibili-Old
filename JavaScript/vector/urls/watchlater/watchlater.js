"use strict";
/**
 * 本模块负责重写稍后再看页面
 */
(function () {
    if (!API.uid)
        return API.toast.warning("未登录，无法启用稍后再看！");
    API.path.name = "watchlater";
    API.getVariable({ origin: window, target: "aid" });
    API.getVariable({ origin: window, target: "cid" });
    // 备份还原旧版播放器设置数据
    API.importModule("playerSetting.js");
    API.rewriteHTML(GM.getResourceText("watchlater.html"));
    API.addCss(GM.getResourceText("bofqi.css"));
    // 修复评论跳转
    window.commentAgent = { seek: (t) => window.player && window.player.seek(t) };
    // 添加点赞功能
    config.enlike && API.importModule("enLike.js");
    API.addCss(GM.getResourceText("mini-bofqi.css"));
})();
