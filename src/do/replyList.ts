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
    API.scriptIntercept(["comment.min.js"], URL.createObjectURL(new Blob([GM.getResourceText(script)])));
    API.jsonphook(["api.bilibili.com/x/v2/reply?"], (xhr) => {
        tag && (tag = false, API.addCss(API.getCss("comment.css")), config.oldReplySort && API.addCss(API.getCss("oldReplySort.css")));
        !xhr.url.includes("mobi_app") && (xhr.url += `&mobi_app=android`);
    })
    API.addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css", type: "text/css" }, document.head)
}