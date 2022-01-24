/**
 * 本模块负责执行切P调用监听
 */
(function () {
    const switchlist: Function[] = [];
    /**
     * 注册切P回调
     * @param callback 切P时的回调函数
     */
    function switchVideo(callback: Function) {
        try {
            if (typeof callback === "function") switchlist.push(callback);
        } catch (e) { toast.error("switchVideo.js", e) }
    }
    API.switchVideo = (callback: Function) => switchVideo(callback);
    API.observerAddedNodes((node) => {
        if (/bilibili-player-area video-state-pause/.test(node.className)) {
            switchlist.forEach(async d => {
                try {
                    d()
                } catch (e) {
                    debug.group("switchVideo.js").error(e).error(d).end();
                }
            });
        }
    })
})();
declare namespace API {
    /**
     * 注册切P回调
     * @param callback 切P时的回调函数
     */
    export function switchVideo(callback: Function): void;
}