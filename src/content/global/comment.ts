import { addCssEs, addElement, loadScript } from "../../runtime/element/addElement";
import { storage } from "../../runtime/storage";

/** 替换评论区 */
export function loadComment() {
    let loading = false, load = false; // 是否载入
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
                    addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css" }, document.head);
                })
                Object.defineProperty(window, "bbComment", { configurable: true, value: arr[0] });
                // 出栈
                return arr[0];
            }
            return class { // 等待载入
                constructor() {
                    if (!loading) {
                        loadScript(`chrome-extension://${storage.ss.getItem("bilibili-old")}/bilibili/comment.min.js`).then(() => {
                            load = true;
                            addCssEs("content/global/comment.css");
                        })
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
                    loadScript(`chrome-extension://${storage.ss.getItem("bilibili-old")}/bilibili/comment.min.js`).then(() => {
                        load = true;
                        addCssEs("content/global/comment.css");
                    })
                }
                loading = true;
                setTimeout(() => (<any>window).initComment(...arguments), 100);
            }
        }
    })
}
