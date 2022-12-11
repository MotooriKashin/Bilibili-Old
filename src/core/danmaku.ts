import { BLOD } from "../bilibili-old";
import { ApiDmWeb } from "../io/grpc/api-dm-web";
import { urlObj } from "../utils/format/url";
import { propertyHook } from "../utils/hook/method";
import { WorkerHook } from "../utils/hook/worker";

export class Danmaku {
    private listSoFixed = false;
    constructor(private BLOD: BLOD) {
        BLOD.userLoadedCallback(status => {
            if (!status.bilibiliplayer) {
                this.listSoFix();
            }
        })
    }
    /** 原生旧版播放器使用protobuf弹幕 */
    listSoFix() {
        if (this.listSoFixed) return;
        this.listSoFixed = true;
        const that = this;
        new WorkerHook().postMessage(function (message) {
            if (message.url && message.url.includes("list.so")) {
                that.BLOD.status.dmwrap && that.trim();
                if (!that.BLOD.status.dmproto) return false;
                const params = urlObj(message.url);
                const startTime = new Date().getTime();
                that.getSegDanmaku(undefined, params.oid)
                    .then(d => {
                        this.dispatchEvent(new MessageEvent('message', {
                            data: {
                                code: 0,
                                danmakuArray: d,
                                loadTime: new Date().getTime() - startTime,
                                parseTime: Math.random(),
                                sendTip: "",
                                state: 0,
                                textSide: "",
                                total: d.length.toString()
                            }
                        }))
                    })
                    .catch(e => {
                        console.error('protobuf 弹幕获取失败', e);
                    })
                return true;
            }
            return false;
        })
    }
    /** 允许普权弹幕排版 */
    trim() {
        propertyHook(String.prototype, 'trim', function (this: String) { return String(this) });
    }
    async getSegDanmaku(aid = this.BLOD.aid, cid = this.BLOD.cid) {
        if (!cid) throw new Error(`无法获取弹幕 aid：${aid} cid：${cid}`);
        return new ApiDmWeb(aid, cid).toCmd();
    }
}