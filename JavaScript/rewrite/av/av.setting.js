"use strict";
/**
 * 本模块负责注册av页相关设置
 */
(function () {
    API.addSetting({
        key: "av",
        sort: "rewrite",
        label: "av/BV",
        type: "switch",
        value: true,
        float: '重写以恢复旧版av视频播放页。'
    });
    API.addSetting({
        key: "upList",
        sort: "style",
        label: "UP主列表",
        sub: "展示视频合作者",
        type: "switch",
        value: false
    });
    API.addSetting({
        key: "electric",
        sort: "player",
        label: "跳过充电鸣谢",
        type: "switch",
        value: false
    });
    API.addSetting({
        key: "enlike",
        sort: "player",
        label: "添加点赞功能",
        type: "switch",
        value: false,
        float: "旧版播放器的时代点赞功能还未存在，本脚本代为设计了个丑丑的点赞功能。"
    });
    API.addSetting({
        key: "medialist",
        sort: "rewrite",
        label: "medialist",
        type: "switch",
        value: false,
        float: "用旧版av页重构medialist页面。"
    });
})();
