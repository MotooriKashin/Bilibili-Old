/**
 * 本模块负责拦截直播间流媒体
 */
try {
    Object.defineProperty(window, "__NEPTUNE_IS_MY_WAIFU__", { get: () => undefined, set: () => true });
    API.xhrhook(["api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo"], function (args) {
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                try {
                    let response = API.jsonCheck(this.responseText);
                    response.data.live_time = -1;
                    response.data.playurl_info = null;
                    if (response.data) {
                        response.data.live_status = 0;
                    }
                    toast.warning("已拦截直播流，可在设置中解除限制！");
                    Object.defineProperty(this, 'response', { writable: true });
                    Object.defineProperty(this, 'responseText', { writable: true });
                    (<any>this).response = (<any>this).responseText = JSON.stringify(response);
                } catch (e) { API.trace(e, "liveStream.js") }
            }
        })
    })
} catch (e) { API.trace(e, "liveStream.js", true) }