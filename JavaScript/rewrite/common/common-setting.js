"use strict";
/**
 * 本模块负责注册`rewrite.js`相关的通用设置
 */
(function () {
    API.addSetting({
        key: "lostVideo",
        sort: "restore",
        label: "失效视频信息",
        sub: `封面和标题`,
        type: "switch",
        value: false,
        float: '使用第三方数据修复收藏、频道等处的失效视频信息。（以红色删除线标记）</br>访问失效视频链接时将尝试重建av页面。</br>※ 依赖第三方数据库且未必有效，<strong>请谨慎考虑是否开启！</strong>'
    });
    API.addSetting({
        key: "oldReply",
        sort: "style",
        label: "旧版评论样式",
        sub: `先时间后热度`,
        type: "switch",
        value: false,
        float: '使用旧版评论样式，优先按时间排序。</br>此版本不会再维护！'
    });
    API.addSetting({
        key: "protoDm",
        sort: "danmaku",
        label: "新版弹幕",
        sub: "proto弹幕",
        type: "switch",
        value: true,
        float: `添加旧版播放器新版proto弹幕支持。由于旧版xml弹幕已获取不到90分钟后的弹幕，本功能默认启用。</br>※ <strong>部分功能依赖启用“代理原生脚本”`
    });
    API.addSetting({
        key: "liveDm",
        sort: "danmaku",
        label: "实时弹幕",
        type: "switch",
        value: true,
        float: `修复旧版播放器实时弹幕。`
    });
    API.addSetting({
        key: "commandDm",
        sort: "danmaku",
        label: "互动弹幕",
        sub: "投票弹窗等",
        type: "switch",
        value: false,
        float: `启用后，可以使用新版播放器新增的 弹幕投票弹窗 和 关联视频跳转按钮 两项功能。</br>其他类型的互动弹幕如引导关注、三连按钮等目前还没有在脚本中实现，正在逐步开发中。</br>脚本实现的互动弹幕外观上与新播放器有较大差别，如果有建议或者遇上bug，欢迎反馈。</br>※需要同时开启新版proto弹幕。`
    });
    API.addSetting({
        key: "logReport",
        sort: "common",
        label: "日志拦截",
        sub: "拦截B站日志上报",
        float: "网页端日志采集太频繁，稍微动下鼠标都要发送数条日志请求，给network调试带来额外的困扰。",
        type: "switch",
        value: false
    });
})();
