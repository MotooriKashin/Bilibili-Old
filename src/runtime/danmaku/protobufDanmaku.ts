import { pushDownload } from "../download/download";
import { urlObj } from "../format/url";
import { setting } from "../setting";
import { API } from "../variable/variable";
import { danmaku } from "./danmaku";
import { historyDanmaku } from "./historyDanmaku";
import { liveDanmaku } from "./liveDanmaku";

/** 加载新版弹幕 */
export function loadDanmakuEngine() {
    if (setting.protobufDanmaku) {
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
                    let Dm: any = danmaku.danmakuFormat(Segments);
                    parseTime = (<any>new Date()) - parseTime;
                    triggerOnMsg(Dm, loadTime, parseTime);
                    setting.downloadOther && pushDownload({
                        group: "弹幕",
                        data: Dm,
                        up: "当前",
                        down: `N/A`,
                        callback: () => danmaku.saveDanmaku(Dm, `${API.title || API.cid}`)
                    });
                });
                loadDanmaku(new Date());
            } else {
                workerPostMsg.call(this, aMessage, <any>transferList);
            }
        }
    }
    historyDanmaku();
    liveDanmaku();
}