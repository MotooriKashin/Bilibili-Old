/**
 * 本模块负责恢复翻页评论区
 */
(function () {
    try {
        API.scriptIntercept(["comment.min.js"], "comment.js");
        class ReplyList {
            init() {
                // 拦截评论脚本
                if (window.bbComment)
                    return this.cover(); // 评论已载入直接覆盖
                // 监听评论脚本载入并覆盖
                Object.defineProperty(window, "bbComment", {
                    set: () => { this.cover(); },
                    get: () => undefined,
                    configurable: true
                });
            }
            cover() {
                delete window.bbComment; // 取消拦截
                API.importModule("comment.js"); // 载入新评论脚本
                API.addElement("link", { href: "//static.hdslb.com/phoenix/dist/css/comment.min.css", rel: "stylesheet" });
                API.addCss(`.bb-comment .comment-header .header-page, .comment-bilibili-fold .comment-header .header-page {float: right;line-height: 36px;}`);
            }
        }
        new ReplyList().init();
    }
    catch (e) {
        API.trace(e, "replyList.js", true);
    }
})();
