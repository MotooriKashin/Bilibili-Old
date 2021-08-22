"use strict";
/**
 * 本模块负责注册个人空间相关的设置
 */
(function () {
    API.addSetting({
        type: "switch",
        key: "errands",
        label: "番剧出差",
        sub: '<a href="//space.bilibili.com/11783021">11783021</a>',
        value: true,
        sort: "restore",
        float: '使用备份数据修复对于番剧出差官方空间的访问。'
    });
    API.addSetting({
        type: "switch",
        key: "album",
        label: "相簿链接",
        sub: "个人空间",
        value: false,
        sort: "restore",
        float: '将个人空间的相簿链接从动态重定向回原来的相簿。'
    });
    API.addSetting({
        type: "switch",
        key: "jointime",
        label: "注册时间",
        value: false,
        sort: "restore",
        float: '在空间显示对应账号的注册时间。'
    });
})();
