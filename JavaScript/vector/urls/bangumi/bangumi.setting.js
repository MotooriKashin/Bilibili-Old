"use strict";
/**
 * 本模块负责注册bangumi页相关设置项
 */
(function () {
    API.addSetting({
        key: "bangumi",
        sort: "rewrite",
        label: "bangumi",
        sub: "ss/ep",
        type: "switch",
        value: true,
        float: '重写以恢复旧版bangumi播放页。'
    });
    API.addSetting({
        key: "limit",
        sort: "player",
        label: "区域/平台限制",
        type: "sort",
        list: [
            {
                key: "videoLimit",
                sort: "player",
                label: "解除限制",
                type: "switch",
                value: false,
                sub: "区域/APP"
            }, {
                key: "limitServer",
                sort: "player",
                label: "泰区代理",
                type: "input",
                value: "https://api.global.bilibili.com",
                float: "泰区番剧限制需要自备相应的代理服务器（无需末尾的斜杠！）。</br>本功能由于缺乏调试条件维护不善请多担待！",
                input: { type: "url", placeholder: "URL" },
                pattern: /(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/
            }
        ]
    });
    API.addSetting({
        key: "bangumiEplist",
        sort: "player",
        label: "保留番剧回目列表",
        type: "switch",
        value: false,
        float: '部分带特殊背景图片的番剧会隐藏播放器下方的番剧回目列表，二者不可得兼，只能选一。'
    });
    API.addSetting({
        key: "episodeData",
        sort: "style",
        label: "显示番剧分集数据",
        type: "switch",
        value: false,
        float: '有分集数据时将bangumi播放、弹幕数替换为当集数据。原合集数据将显示在鼠标焦点信息上。'
    });
})();
