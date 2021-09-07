/**
 * 本页面负责引导全局模块运行，一般全局生效运行的模块请将导入命令写在这里
 */
(function () {
    API.importModule("parameterTrim.js"); // 网址清理
    API.importModule("infoNewNumber.js"); // 旧版顶栏咨询数
    config.protoDm && API.importModule("protoDm.js"); // 新版弹幕
    config.liveDm && API.importModule("webSocket.js"); // 实时弹幕
    config.logReport && API.importModule("sendBeacon.js"); // 日志拦截
    API.scriptIntercept(["bilibiliPlayer.min.js"], "bilibiliPlayer.js"); // 播放器脚本拦截
    API.path.name && API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
    config.logReport && API.scriptIntercept(["log-reporter"]); // 日志拦截
    API.importModule("playinfoRecord.js"); // playinfo记录
    API.importModule("unread.js"); // 远古动态
    API.importModule("autoFix.js"); // 自动化处理
    API.importModule("player-v2.js"); // 视频信息
    API.importModule("sectionTypo.js"); // 顶栏文字
    config.heartbeat && API.importModule("heartbeat.js"); // 视频心跳
    config.videoLimit && API.importModule("videoLimit.js"); // 播放限制
    config.bannerGif && API.importModule("bannerGif.js"); // 顶栏动图
    config.noVideo && API.importModule("noVideo.js"); // 视频拦截
    config.replyList && API.importModule("replyList.js"); // 翻页评论
    config.section && API.importModule("section.js"); // 顶栏底栏
    config.danmakuHashId && API.path.name && API.importModule("danmakuHashId.js"); // 弹幕反查
})();
