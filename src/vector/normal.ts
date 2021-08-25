/**
 * 本模块负责引导重写之后默认运行的模块  
 * 一般的通用模块都从这里引导
 */
(async function () {
    API.importModule("playinfoRecord.js"); // playinfo
    API.importModule("unread.js"); // 远古动态
    API.importModule("autoFix.js"); // 自动化处理
    API.importModule("player-v2.js"); // 视频信息
    API.importModule("sectionTypo.js"); // 顶栏文字
    config.heartbeat && API.importModule("heartbeat.js"); // 视频心跳
    config.videoLimit && API.importModule("videoLimit.js"); // 播放限制
    config.bannerGif && API.importModule("bannerGif.js"); // 顶栏动图
    config.noVideo && API.importModule("noVideo.js"); // 拦截视频
    config.replyList && API.importModule("replyList.js"); // 翻页评论
    config.section && API.importModule("section.js"); // 顶栏底栏
    config.danmakuHashId && API.path.name && API.importModule("danmakuHashId.js"); // 弹幕反查
})();