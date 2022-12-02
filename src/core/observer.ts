import { debug } from "../utils/debug";

const nodelist: Function[] = [];
const observe = new MutationObserver(async d => d.forEach(d => {
    d.addedNodes[0] && nodelist.forEach(f => {
        try {
            f(d.addedNodes[0])
        } catch (e) { debug.error('MutationObserver', e) }
    })
}));
observe.observe(document, { childList: true, subtree: true });
/**
 * 监听新添节点
 * @param callback 添加节点回调，将新添节点信息作为第一个参数传入
 */
export function observerAddedNodes(callback: (node: HTMLElement) => void) {
    try {
        if (typeof callback === "function") nodelist.push(callback);
        return nodelist.length - 1;
    } catch (e) { debug.error(e) }
}
const switchlist: Function[] = [];
/**
 * 切P回调，播放器初次载入也会触发
 * @param callback 回调函数
 */
export function switchVideo(callback: Function) {
    try {
        if (typeof callback === "function") switchlist.push(callback);
    } catch (e) { debug.error("switchVideo", e) }
}
observerAddedNodes((node) => {
    if (/video-state-pause/.test(node.className)) {
        switchlist.forEach(async d => {
            try {
                d()
            } catch (e) { debug.error(d); }
        });
    }
})