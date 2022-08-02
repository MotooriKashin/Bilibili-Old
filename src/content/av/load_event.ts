import { doWhile } from "../../runtime/do_while";

/** 页面load事件检查 重构页面完成可能发生在`load`事件后，此时需要再次发送该事件以让依赖该事件启动的任务执行 */
export function loadEvent() {
    doWhile(() => document.readyState === "complete", () => {
        document.querySelector("#jvs-cert") || window.dispatchEvent(new ProgressEvent("load"));
    })
}