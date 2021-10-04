/**
 * 本模块负责恢复翻页评论区
 */
(function () {
    try {
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
                API.addElement("link", { href: "//static.hdslb.com/phoenix/dist/css/comment.min.css", rel: "stylesheet" }, document.head);
                API.addCss(`
                .bb-comment .comment-header .header-page, .comment-bilibili-fold .comment-header .header-page {
                    float: right;line-height: 36px;
                }.bb-comment .comment-list .list-item .user .text-con, .comment-bilibili-fold .comment-list .list-item .user .text-con {
                    margin-left: initial;
                }.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con .user>a, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con .user>a {
                    margin-left: initial;
                }`);
            }
        }
        new ReplyList().init();
        API.jsonphook(["api.bilibili.com/x/v2/reply?"], (xhr) => {
            !xhr.url.includes("mobi_app") && (xhr.url += `&mobi_app=android`);
        })
        config.commentLinkDetail && API.importModule("commentLinkDetail.js");
    } catch (e) { API.trace(e, "replyList.js", true) }
})();