import { BLOD } from "../bilibili-old";
import { ApiDmWeb, DanmakuElem } from "../io/grpc/api-dm-web";
import { DanmakuBase } from "../utils/danmaku";
import { debug } from "../utils/debug";
import { fileRead, readAs, saveAs } from "../utils/file";
import { sizeFormat } from "../utils/format/size";
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
    /** 加载本地xml弹幕 */
    localDmXml() {
        if (!(<any>window).player) return this.BLOD.toast.warning('未找到播放器实例！请在播放页面使用。');
        if (!(<any>window).player?.appendDm) return this.BLOD.toast.warning('未启用【重构播放器】，无法载入弹幕！');
        const data = ['请选择一个弹幕文件，拓展名：.xml，编码：utf-8'];
        const toast = this.BLOD.toast.toast(0, 'info', ...data);
        fileRead('.xml', false)
            .then(d => {
                if (d && d[0]) {
                    data.push('-------loading-------', `弹幕：${d[0].name}`, `类型：${d[0].type}`, `大小：${sizeFormat(d[0].size)}`);
                    toast.data = data;
                    toast.type = 'warning';
                    return readAs(d[0])
                }
                throw new Error(data[0]);
            })
            .then(d => {
                const dm = DanmakuBase.decodeXml(d);
                (<any>window).player.appendDm(dm, !this.BLOD.status.dmContact);
                data.push('-------decoding-------', `有效弹幕数：${dm.length}`, `加载模式：${this.BLOD.status.dmContact ? '与已有弹幕合并' : '清空已有弹幕'}`);
                toast.data = data;
                toast.type = 'success';
            })
            .catch(e => {
                data.push(e);
                debug.error(e);
                toast.data = data;
                toast.type = 'error';
            })
            .finally(() => {
                toast.delay = this.BLOD.status.toast.delay;
            })
    }
    /** 加载本地json弹幕 */
    localDmJson() {
        if (!(<any>window).player) return this.BLOD.toast.warning('未找到播放器实例！请在播放页面使用。');
        if (!(<any>window).player?.appendDm) return this.BLOD.toast.warning('未启用【重构播放器】，无法载入弹幕！');
        const data = ['请选择一个弹幕文件，拓展名：.json，编码：utf-8'];
        const toast = this.BLOD.toast.toast(0, 'info', ...data);
        fileRead('.json', false)
            .then(d => {
                if (d && d[0]) {
                    data.push('-------loading-------', `弹幕：${d[0].name}`, `类型：${d[0].type}`, `大小：${sizeFormat(d[0].size)}`);
                    toast.data = data;
                    toast.type = 'warning';
                    return readAs(d[0])
                }
                throw new Error(data[0]);
            })
            .then(d => {
                const dm = JSON.parse(d);
                (<any>window).player.appendDm(dm, !this.BLOD.status.dmContact);
                data.push('-------decoding-------', `有效弹幕数：${dm.length}`, `加载模式：${this.BLOD.status.dmContact ? '与已有弹幕合并' : '清空已有弹幕'}`);
                toast.data = data;
                toast.type = 'success';
            })
            .catch(e => {
                data.push(e);
                debug.error(e);
                toast.data = data;
                toast.type = 'error';
            })
            .finally(() => {
                toast.delay = this.BLOD.status.toast.delay;
            })
    }
    /** 下载弹幕 */
    async download(aid = this.BLOD.aid, cid = this.BLOD.cid) {
        if (!cid) return this.BLOD.toast.warning('未找到播放器实例！请在播放页面使用。');
        const dms: DanmakuElem[] = (<any>window).player?.getDanmaku ? (<any>window).player.getDanmaku() : await new ApiDmWeb(aid, cid).getData();
        const metadata = this.BLOD.videoInfo.metadata;
        const title = metadata ? `${metadata.album}(${metadata.title})` : `${aid}.${cid}`;
        if (this.BLOD.status.dmExtension === 'json') {
            return saveAs(JSON.stringify(dms, undefined, '\t'), `${title}.json`, 'application/json')
        }
        return saveAs(DanmakuBase.encodeXml(DanmakuBase.parseCmd(dms), cid), `${title}.xml`, 'application/xml');
    }
}