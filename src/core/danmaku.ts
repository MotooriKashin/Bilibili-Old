import { ApiDmWeb, DanmakuElem } from "../io/grpc/api-dm-web";
import { DanmakuBase } from "../utils/danmaku";
import { debug } from "../utils/debug";
import { fileRead, readAs, saveAs } from "../utils/file";
import { sizeFormat } from "../utils/format/size";
import { urlObj } from "../utils/format/url";
import { propertyHook } from "../utils/hook/method";
import { WorkerHook } from "../utils/hook/worker";
import { urlParam } from "../utils/utils";
import { BLOD } from "./bilibili-old";
import { toast } from "./toast";
import { user } from "./user";
import { videoInfo } from "./video-info";

class Danmaku {
    private listSoFixed = false;
    constructor() {
        user.addCallback(status => {
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
                user.userStatus!.dmwrap && that.trim();
                if (!user.userStatus!.dmproto) return false;
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
    async getSegDanmaku(aid = BLOD.aid, cid = BLOD.cid) {
        if (!cid) throw new Error(`无法获取弹幕 aid：${aid} cid：${cid}`);
        return new ApiDmWeb(aid, cid).toCmd();
    }
    /** 加载本地xml弹幕 */
    localDmXml() {
        if (!(<any>window).player) return toast.warning('未找到播放器实例！请在播放页面使用。');
        if (!(<any>window).player?.appendDm) return toast.warning('未启用【重构播放器】，无法载入弹幕！');
        const msg = toast.list('加载本地弹幕 >>>', '> 请选择一个弹幕文件，拓展名：.xml，编码：utf-8');
        fileRead('.xml')
            .then(d => {
                msg.push('> -------loading-------', `> 弹幕：${d.name}`, `> 类型：${d.type}`, `> 大小：${sizeFormat(d.size)}`);
                msg.type = 'warning';
                return readAs(d)
            })
            .then(d => {
                const dm = DanmakuBase.decodeXml(d);
                (<any>window).player.appendDm(dm, !user.userStatus!.dmContact);
                msg.push('> -------decoding-------', `> 有效弹幕数：${dm.length}`, `> 加载模式：${user.userStatus!.dmContact ? '与已有弹幕合并' : '清空已有弹幕'}`, 'fin <<<');
                msg.type = 'success';
            })
            .catch(e => {
                msg.push(e, 'fin <<<');
                debug.error(e);
                msg.type = 'error';
            })
            .finally(() => {
                msg.delay = user.userStatus!.toast.delay;
            })
    }
    /** 加载本地json弹幕 */
    localDmJson() {
        if (!(<any>window).player) return toast.warning('未找到播放器实例！请在播放页面使用。');
        if (!(<any>window).player?.appendDm) return toast.warning('未启用【重构播放器】，无法载入弹幕！');
        const msg = toast.list('加载本地弹幕 >>>', '> 请选择一个弹幕文件，拓展名：.json，编码：utf-8');
        fileRead('.json')
            .then(d => {
                msg.push('> -------loading-------', `> 弹幕：${d.name}`, `> 类型：${d.type}`, `> 大小：${sizeFormat(d.size)}`);
                msg.type = 'warning';
                return readAs(d)
            })
            .then(d => {
                const dm = JSON.parse(d);
                (<any>window).player.appendDm(dm, !user.userStatus!.dmContact);
                msg.push('> -------decoding-------', `> 有效弹幕数：${dm.length}`, `> 加载模式：${user.userStatus!.dmContact ? '与已有弹幕合并' : '清空已有弹幕'}`, 'fin <<<');
                msg.type = 'success';
            })
            .catch(e => {
                msg.push(e, 'fin <<<');
                debug.error(e);
                msg.type = 'error';
            })
            .finally(() => {
                msg.delay = user.userStatus!.toast.delay;
            })
    }
    /** 下载弹幕 */
    async download(aid = BLOD.aid, cid = BLOD.cid) {
        if (!cid) return toast.warning('未找到播放器实例！请在播放页面使用。');
        const dms: DanmakuElem[] = (<any>window).player?.getDanmaku ? (<any>window).player.getDanmaku() : await new ApiDmWeb(aid, cid).getData();
        const metadata = videoInfo.metadata;
        const title = metadata ? `${metadata.album}(${metadata.title})` : `${aid}.${cid}`;
        if (user.userStatus!.dmExtension === 'json') {
            return saveAs(JSON.stringify(dms, undefined, '\t'), `${title}.json`, 'application/json')
        }
        return saveAs(DanmakuBase.encodeXml(DanmakuBase.parseCmd(dms), cid), `${title}.xml`, 'application/xml');
    }
    /** 加载在线弹幕 */
    async onlineDm(str: string) {
        if (!(<any>window).player) return toast.warning('未找到播放器实例！请在播放页面使用。');
        if (!(<any>window).player?.appendDm) return toast.warning('未启用【重构播放器】，无法载入弹幕！');
        const msg = toast.list('加载在线弹幕 >>>', '> -------在线弹幕-------', `> 目标：${str}`);
        const { aid, cid } = await urlParam(str);
        msg.push(`> aid：${aid}`, `> cid：${cid}`);
        if (!aid || !cid) {
            msg.push('> 查询cid信息失败，已退出！');
            msg.type = 'error';
            msg.delay = toast.delay;
        } else {
            new ApiDmWeb(aid, cid).getData()
                .then(d => {
                    (<any>window).player.appendDm(d, !user.userStatus!.dmContact);
                    msg.push(`> 有效弹幕数：${d.length}`, `> 加载模式：${user.userStatus!.dmContact ? '与已有弹幕合并' : '清空已有弹幕'}`, 'fin <<<');
                    msg.type = 'success';
                })
                .catch(e => {
                    msg.push(e, 'fin <<<');
                    debug.error(e);
                    msg.type = 'error';
                })
                .finally(() => {
                    msg.delay = user.userStatus!.toast.delay;
                })
        }
    }
}
export const danmaku = new Danmaku();