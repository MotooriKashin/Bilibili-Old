/**
 * 本模块负责重写稍后再看页面
 */
(function () {
    try {
        if (!API.uid)
            toast.warning("未登录，无法启用稍后再看！");
        else {
            API.path.name = "watchlater";
            // 备份还原旧版播放器设置数据
            API.restorePlayerSetting();
            API.scriptIntercept(["video-nano"]); // 新版播放器拦截
            API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
            API.rewriteHTML(API.getModule("watchlater.html"));
            API.addCss(API.getModule("bofqi.css"));
            // 修复评论跳转
            window.commentAgent = { seek: (t) => window.player && window.player.seek(t) };
            // 添加点赞功能
            config.enlike && API.importModule("enLike.js");
            API.addCss(API.getModule("mini-bofqi.css"));
            // 修正分区信息
            API.importModule("videoSort.js");
        }
    }
    catch (e) {
        API.trace(e, "watchlater.js", true);
    }
})();
