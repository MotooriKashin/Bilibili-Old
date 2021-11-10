/**
 * 本模块负责恢复翻页评论区
 */
(function () {
    try {
        API.scriptIntercept(["comment.min.js"], "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/comment.min.js");
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
                new Function(GM.getResourceText(config.oldReplySort ? "comment.min.js" : "comment.js"))(); // 载入旧版脚本
                API.addElement("link", { href: "//static.hdslb.com/phoenix/dist/css/comment.min.css", rel: "stylesheet" }, document.head);
                API.addCss(API.getCss("comment.css"));
                config.oldReplySort && API.addCss(API.getCss("oldReplySort.css"))
            }
        }
        new ReplyList().init();
        API.jsonphook(["api.bilibili.com/x/v2/reply?"], (xhr) => {
            !xhr.url.includes("mobi_app") && (xhr.url += `&mobi_app=android`);
        })
        config.commentLinkDetail && API.importModule("commentLinkDetail.js");
    } catch (e) { toast.error("replyList.js", e) }
})();