interface modules {
    /**
     * 回复翻页评论区及楼层号
     */
    readonly "replyList.js": string;
    readonly "comment.css": string;
    readonly "oldReplySort.css": string;
}
{
    let tag = true;
    const script = config.oldReplySort ? "comment.min.js" : "comment.js";
    API.scriptIntercept("comment.min.js", undefined, url => {
        return GM.getResourceText(script);
    })
    API.jsonphook("api.bilibili.com/x/v2/reply?", url => {
        tag && (tag = false, API.addCss(API.getCss("comment.css")), config.oldReplySort && API.addCss(API.getCss("oldReplySort.css")));
        url.includes("mobi_app") && (url += "&mobi_app=android");
        return url;
    }, undefined, false);
    API.addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css", type: "text/css" }, document.head)
}