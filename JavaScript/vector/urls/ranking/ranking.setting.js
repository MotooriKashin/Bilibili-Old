"use strict";
/**
 * 本模块负责注册全站排行榜相关设置
 */
(function () {
    API.addSetting({
        type: "switch",
        key: "ranking",
        label: "排行榜",
        value: true,
        sort: "rewrite",
        float: "重写以恢复旧版全站排行榜。"
    });
})();
