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
    API.addSetting({
        key: "heartbeat",
        sort: "restore",
        label: "视频心跳",
        sub: "不记录播放历史时",
        float: "尝试修复可能被广告拦截扩展误伤的视频心跳。",
        type: "switch",
        value: false
    })
    API.addSetting({
        key: "noVideo",
        sort: "player",
        label: "拦截视频",
        float: "拦截播放器载入视频，强行使视频失效。",
        type: "switch",
        value: false
    })
    API.addSetting({
        key: "bannerGif",
        sort: "style",
        label: "替换顶栏动图",
        float: "替换顶栏动图接口，避免单调。",
        type: "switch",
        value: true
    })
    API.addSetting({
        key: "danmakuFirst",
        sort: "style",
        label: "展开弹幕列表",
        float: "自动从推荐视频切换到播放弹幕列表。",
        type: "switch",
        value: false
    })
    API.addSetting({
        key: "showBofqi",
        sort: "style",
        label: "自动滚动到播放器",
        type: "switch",
        value: false
    })
    API.addSetting({
        key: "screenWide",
        sort: "style",
        label: "自动宽屏",
        type: "switch",
        value: false
    })
    API.addSetting({
        key: "noDanmaku",
        sort: "style",
        label: "自动关弹幕",
        type: "switch",
        value: false
    })
    API.addSetting({
        key: "autoPlay",
        sort: "style",
        label: "自动播放",
        type: "switch",
        value: false
    })
    API.addSetting({
        key: "segProgress",
        sort: "player",
        label: "分段进度条",
        type: "switch",
        value: false
    })
    API.addSetting({
        key: "replyList",
        sort: "style",
        label: "翻页评论",
        type: "switch",
        value: true,
        float: '恢复旧版翻页评论区，仅控制非重写页面，重写页面默认开启。'
    })
    API.addSetting({
        key: "section",
        sort: "style",
        label: "旧版顶栏底栏",
        type: "switch",
        value: true,
        float: '非重写页面顶栏底栏也替换为旧版。'
    })
    API.addSetting({
        key: "concatDanmaku",
        sort: "danmaku",
        label: "合并载入弹幕",
        type: "switch",
        value: false,
        float: '载入本地弹幕文件或者在线弹幕时是否与播放器当前弹幕合并。'
    })
    API.addSetting({
        key: "danmakuHashId",
        sort: "danmaku",
        label: "反查弹幕发送者",
        type: "switch",
        value: false,
        float: '旧版播放器上右键弹幕将显示弹幕发送者。</br>※ 使用哈希逆向算法，存在碰撞可能性，所示信息仅供参考，或者干脆查不出来。'
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
    /**
     * 修复：视频心跳
     */
    let heartbeat: boolean;
    /**
     * 播放：拦截视频
     */
    let noVideo: boolean;
    /**
     * 样式：顶栏动图
     */
    let bannerGif: boolean;
    /**
     * 样式：弹幕优先
     */
    let danmakuFirst: boolean;
    /**
     * 样式：自动滚动到播放器
     */
    let showBofqi: boolean;
    /**
     * 样式：自动宽屏
     */
    let screenWide: boolean;
    /**
     * 样式：自动关弹幕
     */
    let noDanmaku: boolean;
    /**
     * 样式：自动播放
     */
    let autoPlay: boolean;
    /**
     * 播放：分段进度条
     */
    let segProgress: boolean;
    /**
     * 样式：翻页评论
     */
    let replyList: boolean;
    /**
     * 样式：顶栏底栏
     */
    let section: boolean;
    /**
     * 播放：弹幕合并
     */
    let concatDanmaku: boolean;
    /**
     * 弹幕：弹幕反查
     */
    let danmakuHashId: boolean;
    /**
     * 弹幕：全弹幕装填冷却时间
     */
    let allDanmakuDelay: number;
}