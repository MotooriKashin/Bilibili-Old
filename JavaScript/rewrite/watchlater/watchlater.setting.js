"use strict";
/**
 * 本模块负责注册稍后再看相关设置项
 */
(function () {
    API.addSetting({
        type: "switch",
        key: "watchlater",
        label: "稍后再看",
        value: true,
        sort: "rewrite",
        float: '重写以恢复旧版稍后再看。'
    });
})();
