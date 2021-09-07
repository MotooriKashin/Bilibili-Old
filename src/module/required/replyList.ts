/**
 * 本模块负责恢复翻页评论区
 */
(function () {
    API.scriptIntercept(["comment.min.js"], "comment.js");
    class ReplyList {
        init() {
            // 拦截评论脚本
            if ((<any>window).bbComment) return this.cover(); // 评论已载入直接覆盖
            // 监听评论脚本载入并覆盖
            Object.defineProperty(window, "bbComment", {
                set: () => { this.cover() },
                get: () => undefined,
                configurable: true
            })
        }
        cover() {
            delete (<any>window).bbComment; // 取消拦截
            API.importModule("comment.js"); // 载入新评论脚本
            API.addCss(`.bb-comment .comment-header .header-page, .comment-bilibili-fold .comment-header .header-page {float: right;line-height: 36px;}`);
        }
    }
    new ReplyList().init();
})();