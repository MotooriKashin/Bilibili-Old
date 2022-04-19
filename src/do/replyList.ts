interface modules {
    /**
     * 回复翻页评论区及楼层号
     */
    readonly "replyList.js": string;
    readonly "comment.css": string;
    readonly "oldReplySort.css": string;
}
interface config {
    /** 评论区优先展示按时间排序 */
    oldReplySort: boolean;
    /** 托管原生脚本 */
    trusteeship: boolean;
    /** 还原评论中的超链接 */
    commentLinkDetail: boolean;
}
namespace API {
    registerSetting({
        key: "oldReplySort",
        sort: "style",
        label: "评论区优先展示按时间排序",
        sub: "疏于维护的特别需求",
        type: "switch",
        value: false,
        float: "B站曾经默认优先以时间顺序展示评论，并在最前列展示几条热评。本脚本尝试恢复过本功能，但如今已疏于维护。"
    });
    registerSetting({
        key: "trusteeship",
        sort: "common",
        label: "托管原生脚本",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></g></svg>',
        type: "switch",
        value: true,
        float: "脚本修改了部分B站原生脚本以解决常规手段无法解决的问题，但由于托管CDN没有国内节点等原因可能访问不畅，如果出现页面其他情况都正常唯独播放器加载不出来的情况可以尝试开启。<strong>关闭本选项将导致部分功能不可用，如非必要请勿关闭！</strong>",
        sub: "代为修复和维护"
    });
    registerSetting({
        key: "commentLinkDetail",
        sort: "style",
        label: "还原评论中的超链接",
        sub: "av、ss或ep",
        type: "switch",
        value: false
    });
    let tag = true, timer: number;
    const script = config.oldReplySort ? "comment.min.js" : "comment.js";
    config.trusteeship && scriptIntercept("comment.min.js", undefined, url => {
        setTimeout(() => { // 评论样式
            addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css" }, document.head);
            tag && (tag = false, addCss(getCss("comment.css")), config.oldReplySort && addCss(getCss("oldReplySort.css")));
        });
        const text = GM.getResourceText(script);
        if (!text) setTimeout(() => { toast.error("comment.js 资源加载失败！您可以在设置中临时关闭“托管原生脚本”。"); displaySetting("trusteeship") })
        return text;
    });
    config.commentLinkDetail && observerAddedNodes((node) => { // 还原评论链接
        if (/l_id/.test(node.id) || /reply-wrap/.test(node.className)) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                timer = <any>undefined;
                document.querySelectorAll<HTMLAnchorElement>(".comment-jump-url").forEach((d, i, e) => {
                    if (d.href && !d.href.includes(d.text)) {
                        const arr = d.href.split("/");
                        let text = arr[arr.length - 1] || arr[arr.length - 2];
                        text.toLowerCase().startsWith("bv") && (text = <string>abv(text));
                        e[i].title = d.text;
                        e[i].text = text;
                    }
                })
            }, 100)
        }
    });
    /** 楼层号栈 */
    const oids: Record<string, number> = new Proxy({}, {
        set: (t, p, v, r) => {
            !Reflect.has(t, p) && Promise.resolve().then(() => {
                let rp = document.querySelector(`[data-id="${<string>p}"]`);
                rp && addElement("span", { class: "floor" }, <Element>rp.querySelector(".info"), `#${v}`, true);
            })
            return Reflect.set(t, p, v, r)
        }
    });
    const oidc: (Promise<any>)[] = [];
    jsonphook("api.bilibili.com/x/v2/reply/reply?", param => {
        const params = Format.urlObj(param);
        const { oid, root, type } = params;
        oidc.push(url.getJson("api.bilibili.com/x/v2/reply/detail", { oid, root, type }))
        params.root && !Reflect.has(oids, params.root) && url.getJson("api.bilibili.com/x/v2/reply/detail", { oid, root, type }, true);
        return param;
    }, r => {
        setTimeout(() => oidc.shift()?.then(d => {
            if (d.code === 0) {
                const root = d.data.root;
                oids[root.rpid] = root.floor;
                root.replies.forEach((d: any) => {
                    oids[d.rpid] = d.floor;
                });
            }
        }))
        return r
    }, false);
}