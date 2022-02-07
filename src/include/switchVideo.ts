interface modules {
    /**
     * 监听播放器切P
     */
    readonly "switchVideo.js": string;
}
{
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
                    debug.error(d);
                    debug.error(e);
                }
            });
        }
    })
}
declare namespace API {
    /**
     * 注册切P回调
     * @param callback 切P时的回调函数
     */
    export function switchVideo(callback: Function): void;
}