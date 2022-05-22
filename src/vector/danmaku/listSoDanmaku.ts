interface modules {
    /** 拦截list.so弹幕 */
    readonly "listSoDanmaku.js": string;
}
namespace API {
    let workerPostMsg = Worker.prototype.postMessage;
    let list_so: any;
    Worker.prototype.postMessage = function (aMessage, transferList) {
        if (aMessage.url && aMessage.url.includes("list.so")) {
            const obj = urlObj(aMessage.url);
            list_so = this;
            let triggerOnMsg = (danmaku: any, loadTime: any, parseTime: any) => list_so.onmessage({
                data: {
                    code: 0,
                    danmakuArray: danmaku,
                    loadTime: loadTime,
                    parseTime: parseTime,
                    sendTip: "",
                    state: 0,
                    textSide: "",
                    total: danmaku.length.toString()
                }
            });
            let loadDanmaku = (loadTime: any) => danmaku.getSegDanmaku(undefined, <number>obj.oid).then((Segments: any) => {
                // 旧播放器需要得到耗时数据(网络请求，数据处理)
                loadTime = (<any>new Date()) - loadTime;
                let parseTime: any = new Date();
                let danmaku: any = API.danmaku.danmakuFormat(Segments);
                parseTime = (<any>new Date()) - parseTime;
                triggerOnMsg(danmaku, loadTime, parseTime);
                config.downloadOther && pushDownload({
                    group: "弹幕",
                    data: danmaku,
                    up: "当前",
                    down: `N/A`,
                    callback: () => API.danmaku.saveDanmaku(danmaku, `${title || cid}`)
                });
            });
            loadDanmaku(new Date());
        } else {
            workerPostMsg.call(this, aMessage, <any>transferList);
        }
    }
}