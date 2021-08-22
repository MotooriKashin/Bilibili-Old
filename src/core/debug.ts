/**
 * 本模块负责实现调试信息输出
 */
(function () {
    class Debug {
        static log(...data: any[]) { console.log(`%c[${API.timeFormat()}]`, "color: blue;", ...data) }
        static info(...data: any[]) { console.info(`%c[${API.timeFormat()}]`, "color: green;", ...data) }
        static debug(...data: any[]) { console.debug(`[${API.timeFormat()}]`, ...data) }
        static warn(...data: any[]) { console.warn(`[${API.timeFormat()}]`, ...data) }
        static error(...data: any[]) { console.error(`[${API.timeFormat()}]`, ...data); }
    }
    /**
     * 旧版播放器弹窗消息
     * @param time 弹窗时长/s
     * @param text 一般消息
     * @param red 红色消息
     * @param yellow 红色消息
     * @param replace 替换已有消息
     * @param callback 红色消息回调
     */
    function msg(time: number = 3, text: string, red: string = "", yellow: string = "", replace: boolean = true, callback?: () => {}) {
        let node = document.querySelector(".bilibili-player-video-toast-bottom");
        time = time * 1000 || 3000;
        if (!node) return Debug.log(text, red, yellow); // 播放器不存在，打印消息到控制台
        if (!text && node.children[0]) return node.children[0].remove(); // 空调用清空消息
        if (replace) {
            if (node.children[0]) node = API.addElement("div", { class: "bilibili-player-video-toast-item bilibili-player-video-toast-pay" }, node, "", false, node.children[0]);
            else node = API.addElement("div", { class: "bilibili-player-video-toast-item bilibili-player-video-toast-pay" }, node);
        } else node = API.addElement("div", { class: "bilibili-player-video-toast-item bilibili-player-video-toast-pay" }, node);
        node.innerHTML = '<div class="bilibili-player-video-toast-item-text"></div>';
        let item = node.children[0], timeout: number;
        text && (API.addElement("span", { class: "video-float-hint-text" }, item, text));
        red && callback ? (API.addElement("span", { class: "video-float-hint-btn hint-red;cursor: pointer;" }, item, red)).onclick = () => {
            node && node.remove();
            clearTimeout(timeout);
            callback();
        } : (API.addElement("span", { class: "video-float-hint-btn hint-red" }, item, red));
        yellow && (API.addElement("span", { class: "video-float-hint-btn" }, item, yellow));
        timeout = setTimeout(() => node && node.remove(), time);
    }
    /**
     * 跟踪错误信息
     * @param e 错误信息
     * @param label 错误标签
     * @param toast 是否浮窗弹出
     */
    function trace(e: Error, label: string = "", toast: boolean = false) {
        let err = Array.isArray(e) ? e : [e];
        toast ? API.toast.error(label, ...err) : API.debug.error(label, ...err);
    }
    const debug = (...data: any[]) => Debug.log(...data);
    debug.log = (...data: any[]) => Debug.log(...data);
    debug.info = (...data: any[]) => Debug.info(...data);
    debug.debug = (...data: any[]) => Debug.debug(...data);
    debug.warn = (...data: any[]) => Debug.warn(...data);
    debug.error = (...data: any[]) => Debug.error(...data);
    debug.msg = msg;
    debug.trace = trace;
    API.debug = debug;
})();
declare namespace API {
    let debug: {
        (...data: any[]): void;
        log(...data: any[]): void;
        info(...data: any[]): void;
        debug(...data: any[]): void;
        warn(...data: any[]): void;
        error(...data: any[]): void;
        /**
         * 旧版播放器弹窗消息
         * @param time 弹窗时长/s
         * @param text 一般消息
         * @param red 红色消息
         * @param yellow 红色消息
         * @param replace 替换已有消息
         * @param callback 红色消息回调
         */
        msg(time: number, text: string, red?: string, yellow?: string, replace?: boolean, callback?: (() => {})): void;
        /**
         * 跟踪错误信息
         * @param e 错误信息
         * @param label 错误标签
         * @param toast 是否浮窗弹出
         */
        trace(e: Error, label?: string, toast?: boolean): void
    }
}