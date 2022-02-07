interface modules {
    /**
     * 回复翻页评论区及楼层号
     */
    readonly "replyList.js": string;
    readonly "comment.css": string;
}
{
    let tag = true;
    API.scriptIntercept(["comment.min.js"], URL.createObjectURL(new Blob([GM.getResourceText("comment.js")])));
    API.jsonphook(["api.bilibili.com/x/v2/reply?"], (xhr) => {
        tag && (tag = false, API.addCss(API.getCss("comment.css")));
        !xhr.url.includes("mobi_app") && (xhr.url += `&mobi_app=android`);
    })
    API.addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css", type: "text/css" }, document.head)
}