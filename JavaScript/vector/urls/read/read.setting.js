"use strict";
/**
 * 本模块负责专栏页面相关设置
 */
(function () {
    API.addSetting({
        type: "switch",
        key: "read",
        label: "专栏",
        value: true,
        sort: "rewrite",
        float: "重写以启用旧版专栏。"
    });
})();
