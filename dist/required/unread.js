/**
 * 本模块负责处理远古顶栏的动态残留问题
 */
(function () {
    API.jsonphook(["api.bilibili.com/x/web-feed/feed/unread"], function (xhr) {
        this.url = this.url.replace("feed/unread", "article/unread");
    });
})();
