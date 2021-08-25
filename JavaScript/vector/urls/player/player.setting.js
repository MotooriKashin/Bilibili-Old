"use strict";
/**
 * 本模块负责注册嵌入播放器相关设置
 */
(function () {
    API.addSetting({
        type: "switch",
        key: "player",
        label: "嵌入",
        value: true,
        sort: "rewrite",
        float: '重写以恢复旧版嵌入播放器。'
    });
})();
