/**
 * 本模块负责处理远古顶栏的动态残留问题
 */
(function () {
    try {
        API.jsonphook(["api.bilibili.com/x/web-feed/feed/unread"], function (xhr) {
            xhr.url = xhr.url.replace("feed/unread", "article/unread");
        })
    } catch (e) { API.trace(e, "unread.js") }
})();