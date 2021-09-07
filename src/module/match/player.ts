/**
 * 本模块负责重写旧版嵌入播放器
 */
(function () {
    API.path.name = "player";
    // 备份还原旧版播放器设置数据
    API.restorePlayerSetting();
    API.rewriteHTML(API.getModule("player.html"));
})();