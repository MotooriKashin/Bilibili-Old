/**
 * 本模块负责注册`rewrite.js`相关的通用设置
 */
(function () {
    API.addSetting({
        key: "oldReply",
        sort: "style",
        label: "旧版评论样式",
        sub: `先时间后热度`,
        type: "switch",
        value: false,
        float: '使用旧版评论样式，优先按时间排序。</br>此版本不会再维护！</br>※ 依赖开启"原生脚本代理"。'
    })
    API.addSetting({
        key: "protoDm",
        sort: "danmaku",
        label: "新版弹幕",
        sub: "proto弹幕",
        type: "switch",
        value: true,
        float: `添加旧版播放器新版proto弹幕支持。由于旧版xml弹幕已获取不到90分钟后的弹幕，本功能默认启用。</br>※ <strong>部分功能依赖启用“代理原生脚本。</strong>”`
    })
    API.addSetting({
        key: "liveDm",
        sort: "danmaku",
        label: "实时弹幕",
        type: "switch",
        value: true,
        float: `修复旧版播放器实时弹幕。`
    })
    API.addSetting({
        key: "commandDm",
        sort: "danmaku",
        label: "互动弹幕",
        sub: "投票弹窗等",
        type: "switch",
        value: false,
        float: `启用后，可以使用新版播放器新增的 弹幕投票弹窗 和 关联视频跳转按钮 两项功能。</br>其他类型的互动弹幕如引导关注、三连按钮等目前还没有在脚本中实现，正在逐步开发中。</br>脚本实现的互动弹幕外观上与新播放器有较大差别，如果有建议或者遇上bug，欢迎反馈。</br>※ <strong>需要同时开启新版proto弹幕。</strong>`
    })
    API.addSetting({
        key: "logReport",
        sort: "common",
        label: "日志拦截",
        sub: "拦截B站日志上报",
        float: "网页端日志采集太频繁，稍微动下鼠标都要发送数条日志请求，给network调试带来额外的困扰。",
        type: "switch",
        value: false
    })
})();
declare namespace config {
    /**
     * 样式：旧版评论
     */
    let oldReply: boolean;
    /**
     * 弹幕：互动弹幕
     */
    let commandDm: boolean;
    /**
     * 弹幕：新版弹幕
     */
    let protoDm: boolean;
    /**
     * 弹幕：实时弹幕
     */
    let liveDm: boolean;
    /**
     * 通用：日志拦截
     */
    let logReport: boolean;
}