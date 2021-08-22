"use strict";
/**
 * 本模块负责注册主页相关设置
 */
(function () {
    API.addSetting({
        type: "switch",
        key: "index",
        label: "主页",
        value: true,
        sort: "rewrite",
        float: '重写以恢复旧版主页'
    });
    API.addSetting({
        type: "switch",
        key: "indexLoc",
        label: "主页广告",
        sub: "banner+recommand",
        value: false,
        sort: "style",
        float: '重写以恢复旧版主页'
    });
    API.addSetting({
        type: "switch",
        key: "privateRecommend",
        label: "禁用主页个性化推荐",
        value: false,
        sort: "style",
        float: '禁用旧版主页banner右边的个性化推荐，恢复全站统一推荐。'
    });
})();
