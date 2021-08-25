"use strict";
/**
 * 本模块负责注册个人空间相关的设置
 */
(function () {
    API.addSetting({
        type: "switch",
        key: "errands",
        label: '恢复对于<a href="//space.bilibili.com/11783021">番剧出差</a>的访问',
        sub: '还好没赶尽杀绝',
        value: true,
        sort: "restore",
        float: '使用备份数据修复对于番剧出差官方空间的访问。'
    });
    API.addSetting({
        type: "switch",
        key: "album",
        label: "还原个人空间相簿链接",
        sub: "相簿比动态页面好看",
        value: false,
        sort: "restore",
        float: '将个人空间的相簿链接从动态重定向回原来的相簿。'
    });
    API.addSetting({
        type: "switch",
        key: "jointime",
        label: "显示账号注册时间",
        sub: "历史不该被隐藏",
        value: false,
        sort: "restore",
        float: '在空间显示对应账号的注册时间。'
    });
    API.addSetting({
        key: "lostVideo",
        sort: "restore",
        label: "修复失效视频信息",
        sub: `有些甚至评论还在！`,
        type: "switch",
        value: false,
        float: '使用第三方数据修复收藏、频道等处的失效视频信息。（以红色删除线标记）</br>访问失效视频链接时将尝试重建av页面。</br>※ 依赖第三方数据库且未必有效，<strong>请谨慎考虑是否开启！</strong>'
    });
})();
