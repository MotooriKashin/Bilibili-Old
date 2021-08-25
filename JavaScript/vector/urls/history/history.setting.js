"use strict";
/**
 * 本模块负责注册历史记录页面相关设置
 */
(function () {
    API.addSetting({
        type: "switch",
        key: "history",
        label: "只显示视频历史",
        sub: "去除专栏、直播记录",
        value: false,
        sort: "style"
    });
    API.addSetting({
        type: "switch",
        key: "searchHistory",
        label: "去除历史记录页面搜索框",
        sub: "其实留着也没什么",
        value: false,
        sort: "style"
    });
})();
