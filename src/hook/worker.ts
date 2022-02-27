interface modules {
    /** 旧版播放器弹幕hook工具 */
    readonly "worker.js": string;
}
namespace API {
    let workerPostMsg = Worker.prototype.postMessage;
    let list_so: any;
    Worker.prototype.postMessage = function (aMessage, transferList) {
        if (aMessage.url && aMessage.url.includes("list.so")) {
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
            let loadDanmaku = (loadTime: any) => danmaku.getSegDanmaku().then((Segments: any) => {
                // 旧播放器需要得到耗时数据(网络请求，数据处理)
                loadTime = (<any>new Date()) - loadTime;
                let parseTime: any = new Date();
                let danmaku: any = API.danmaku.danmakuFormat(Segments);
                parseTime = (<any>new Date()) - parseTime;
                triggerOnMsg(danmaku, loadTime, parseTime);
                API.danmaku.danmaku = danmaku;
            });
            if ((<any>XMLHttpRequest.prototype).pakku_send === undefined) {
                loadDanmaku(new Date());
            }
            else {
                // 让pakku.js载入弹幕
                let url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + cid + "&pid=" + aid + "&segment_index=1";
                xhr({ url: url, responseType: "arraybuffer", credentials: true }).then((response: any) => {
                    let Segments = danmaku.segDmDecode(response);
                    // pakku.js处于“休眠中”时，不会修改响应数据，这时的response仅仅是第一个分段的弹幕数据
                    // 这种情况下需要主动去加载全部的分段(loadDanmaku)
                    let i = 1;
                    for (; i < Segments.length; i++) {
                        // pakku.js处理过的弹幕，在出现时间上按升序排列，可以用这个特征加以区别是否应该载入完整的弹幕
                        if (Segments[i - 1].progress > Segments[i].progress) break;
                    }
                    if (i != Segments.length)
                        loadDanmaku(new Date());
                    else {
                        triggerOnMsg(danmaku.danmakuFormat(Segments), "(pakku.js)", "(pakku.js)");
                    }
                });
            }
        } else {
            workerPostMsg.call(this, aMessage, <any>transferList);
        }
    }
}