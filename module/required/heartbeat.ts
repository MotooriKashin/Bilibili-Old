/**
 * 本模块负责处理可能被广告屏蔽拓展误伤的视频心跳
 */
try {
    API.xhrhook(['api.bilibili.com/x/report/web/heartbeat'], function (args) {
        args[1] = args[1].replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
    })
} catch (e) { API.trace(e, "replyList.js", true) }