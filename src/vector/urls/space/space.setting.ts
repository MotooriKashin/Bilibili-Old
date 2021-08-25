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
    })
    API.addSetting({
        type: "switch",
        key: "album",
        label: "相簿链接",
        sub: "个人空间",
        value: false,
        sort: "restore",
        float: '将个人空间的相簿链接从动态重定向回原来的相簿。'
    })
    API.addSetting({
        type: "switch",
        key: "jointime",
        label: "注册时间",
        value: false,
        sort: "restore",
        float: '在空间显示对应账号的注册时间。'
    })
    API.addSetting({
        key: "lostVideo",
        sort: "restore",
        label: "失效视频信息",
        sub: `封面和标题`,
        type: "switch",
        value: false,
        float: '使用第三方数据修复收藏、频道等处的失效视频信息。（以红色删除线标记）</br>访问失效视频链接时将尝试重建av页面。</br>※ 依赖第三方数据库且未必有效，<strong>请谨慎考虑是否开启！</strong>'
    })
})();
declare namespace config {
    /**
     * 修复：番剧出差
     */
    let errands: boolean;
    /**
     * 修复：相簿链接
     */
    let album: boolean;
    /**
     * 修复：注册时间
     */
    let jointime: boolean;
    /**
     * 修复：失效视频信息
     */
    let lostVideo: boolean;
}