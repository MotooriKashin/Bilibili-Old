interface modules {
    /** 旧版评论区 */
    readonly "bbComment.js": string;
    readonly "comment.css": string;
}
namespace API {
    let loading = false, load = false, timer = 0; // 是否载入
    const arr: any[] = []; // 接口暂存
    Object.defineProperty(window, "bbComment", {
        configurable: true,
        set: v => {
            if (!load) {
                // 压栈
                arr.unshift(v);
            }
        },
        get: () => {
            if (load) {
                Promise.resolve().then(() => {
                    document.querySelectorAll("style").forEach(d => {
                        d.textContent && d.textContent.includes("热门评论") && d.remove();
                    });
                    addCss(getModule("comment.css"));
                    addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css" }, document.head);
                })
                Object.defineProperty(window, "bbComment", { configurable: true, value: arr[0] });
                // 出栈
                return arr[0];
            }
            return class { // 等待载入
                constructor() {
                    if (!loading) {
                        let text = GM.GM_getResourceText("comment.js");
                        if (text) {
                            new Function(text)();
                        }
                        else {
                            toast.warning("外部资源：comment.js 加载失败！", "无法恢复翻页评论区！");
                        }
                        load = true;
                    }
                    loading = true;
                    setTimeout(() => new (<any>window).bbComment(...arguments), 100);
                }
                on() { }
            }
        }
    });
    Object.defineProperty(window, "initComment", {
        configurable: true,
        set: v => true,
        get: () => {
            if (load) {
                Promise.resolve().then(() => {
                    document.querySelectorAll("style").forEach(d => {
                        d.textContent && d.textContent.includes("热门评论") && d.remove();
                    });
                    addCss(getModule("comment.css"));
                    addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css" }, document.head);
                })
                function initComment(tar: string, init: Record<"oid" | "pageType" | "userStatus", any>) {
                    new arr[0](tar, init.oid, init.pageType, init.userStatus);
                }
                Object.defineProperty(window, "initComment", { configurable: true, value: initComment });
                // 出栈
                return initComment;
            }
            return function () {
                if (!loading) {
                    let text = GM.GM_getResourceText("comment.js");
                    if (text) {
                        new Function(text)();
                    }
                    else {
                        toast.warning("外部资源：comment.js 加载失败！", "无法恢复翻页评论区！");
                    }
                    load = true;
                }
                loading = true;
                setTimeout(() => (<any>window).initComment(...arguments), 100);
            }
        }
    })
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
        const params = urlObj(param);
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