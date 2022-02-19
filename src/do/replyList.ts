interface modules {
    /**
     * 回复翻页评论区及楼层号
     */
    readonly "replyList.js": string;
    readonly "comment.css": string;
    readonly "oldReplySort.css": string;
}
{
    let tag = true, timer: number;
    const script = config.oldReplySort ? "comment.min.js" : "comment.js";
    config.trusteeship && API.scriptIntercept("comment.min.js", undefined, url => {
        setTimeout(() => {
            API.addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css" }, document.head);
        });
        const text = GM.getResourceText(script);
        if (!text) setTimeout(() => { toast.error("comment.js 资源加载失败！您可以在设置中临时关闭“托管原生脚本”。"); API.displaySetting("trusteeship") })
        return text;
    })
    API.jsonphook("api.bilibili.com/x/v2/reply", url => {
        tag && (tag = false, API.addCss(API.getCss("comment.css")), config.oldReplySort && API.addCss(API.getCss("oldReplySort.css")));
        url += "&mobi_app=android";
        return url;
    }, undefined, false);
    config.commentLinkDetail && API.observerAddedNodes((node) => {
        if (/l_id/.test(node.id) || /reply-wrap/.test(node.className)) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                timer = undefined;
                document.querySelectorAll(".comment-jump-url").forEach((d: HTMLAnchorElement, i, e: NodeListOf<HTMLAnchorElement>) => {
                    if (d.href && !d.href.includes(d.text)) {
                        const arr = d.href.split("/");
                        let text = arr[arr.length - 1] || arr[arr.length - 2];
                        text.toLowerCase().startsWith("bv") && (text = <string>API.abv(text));
                        e[i].title = d.text;
                        e[i].text = text;
                    }
                })
            }, 100)
        }
    })
}