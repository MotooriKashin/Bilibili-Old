"use strict";
/**
 * 本模块负责注册旧版播放器专属设置
 */
(function () {
    API.runWhile(() => API.path.name && window.player, () => {
        API.path.name && API.addSetting({
            key: "onlineDanmaku",
            sort: "danmaku",
            label: "在线弹幕",
            type: "input",
            float: '为当前旧版播放器载入其他站内视频弹幕，可以输入URL或者aid等参数。</br>※ 可配合选择是否合并已有弹幕。',
            input: { type: "url", placeholder: "URL" },
            title: "载入",
            action: (url) => {
                API.importModule("danmaku.js");
                API.onlineDanmaku(url);
            }
        });
        API.path.name && API.addSetting({
            key: "allDanmaku",
            sort: "danmaku",
            label: "全弹幕装填",
            type: "sort",
            float: '获取所有能获取的历史弹幕。</br><strong>※ 该操作耗时较长且可能造成B站临时封接口，请慎用！</strong>',
            list: [{
                    key: "allDanmakuDelay",
                    sort: "danmaku",
                    label: "冷却时间：/s",
                    type: "input",
                    value: 3,
                    input: { type: "number", min: 1, max: 60, step: 0.5 },
                    float: '接口冷却时间，时间长可以降低被临时封端口的几率'
                },
                {
                    key: "allDanmakuAction",
                    sort: "danmaku",
                    label: "开始获取",
                    type: "action",
                    title: "开始",
                    action: function () {
                        API.importModule("allDanmaku.js");
                        API.allDanmaku();
                    },
                    disabled: 0
                }]
        });
        API.path.name && API.addSetting({
            key: "localMedia",
            sort: "player",
            label: "载入本地文件",
            sub: "视频/弹幕",
            type: "file",
            float: '使用旧版播放器播放本地视频或者弹幕文件。</br>※ 视频只能为mp4格式，且编码格式被浏览器所兼容。</br>※ 若载入弹幕文件，参见弹幕设置是否合并弹幕。',
            title: "文件",
            action: (files) => {
                API.importModule("localMedia.js");
                API.localMedia(files);
            }
        });
    });
})();
