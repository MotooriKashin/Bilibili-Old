/**
 * 本模块hook了Worker以使旧版播放器支持新版proto弹幕
 */
(function () {
    try {
        let workerPostMsg = Worker.prototype.postMessage;
        let list_so;
        Worker.prototype.postMessage = function (aMessage, transferList) {
            if (aMessage.url && aMessage.url.includes("list.so")) {
                list_so = this;
                let triggerOnMsg = (danmaku, loadTime, parseTime) => list_so.onmessage({
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
                let loadDanmaku = (loadTime) => API.getSegDanmaku().then((Segments) => {
                    // 旧播放器需要得到耗时数据(网络请求，数据处理)
                    loadTime = new Date() - loadTime;
                    let parseTime = new Date();
                    let danmaku = API.danmakuFormat(Segments);
                    parseTime = new Date() - parseTime;
                    triggerOnMsg(danmaku, loadTime, parseTime);
                    API.danmaku = danmaku;
                });
                if (XMLHttpRequest.prototype.pakku_send === undefined) {
                    loadDanmaku(new Date());
                }
                else {
                    // 让pakku.js载入弹幕
                    let url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + API.cid + "&pid=" + API.aid + "&segment_index=1";
                    xhr({ url: url, responseType: "arraybuffer", credentials: true }).then((response) => {
                        let Segments = API.segDmDecode(response);
                        // pakku.js处于“休眠中”时，不会修改响应数据，这时的response仅仅是第一个分段的弹幕数据
                        // 这种情况下需要主动去加载全部的分段(loadDanmaku)
                        let i = 1;
                        for (; i < Segments.length; i++) {
                            // pakku.js处理过的弹幕，在出现时间上按升序排列，可以用这个特征加以区别是否应该载入完整的弹幕
                            if (Segments[i - 1].progress > Segments[i].progress)
                                break;
                        }
                        if (i != Segments.length)
                            loadDanmaku(new Date());
                        else {
                            triggerOnMsg(API.danmaku = API.danmakuFormat(Segments), "(pakku.js)", "(pakku.js)");
                        }
                    });
                }
            }
            else {
                workerPostMsg.call(this, aMessage, transferList);
            }
        };
    }
    catch (e) {
        API.trace(e, "worker.js", true);
    }
})();
