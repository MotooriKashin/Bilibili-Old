import protobuf from "protobufjs/light";
import { fileRead, saveAs } from "../lib/file";
import { crc32 } from "../lib/crc32";
import { debug } from "../debug";
import { setting } from "../setting";
import { toast } from "../toast/toast";
import { uid } from "../variable/uid";
import { xhr } from "../xhr";
import bilibiliDanmaku from "./bilibili_danmaku.json";
import { loadCommandDm } from "./command_dm";
import { urlParam } from "../url_param";
import { pushDownload } from "../download/download";
import { LocalMedia } from "./local_danmaku";
import { allDanmaku } from "./all_danmaku";
import { API } from "../variable/variable";
import { objUrl } from "../format/url";
// 启动protobuf引擎
const root = protobuf.Root.fromJSON(bilibiliDanmaku);
/** 来自danmakuProtobuf.json文件 */
type nested = "DmWebViewReply" | "CommandDm" | "DmSegConfig" | "DanmakuFlagConfig" | "DmSegMobileReply" | "DanmakuElem" | "DanmuWebPlayerConfig";
const danmakuType = new Proxy(<Record<nested, {
    decode: (res: Uint8Array) => any,
    encode: (json: Record<PropertyKey, any>) => ArrayBuffer
}>>{}, {
    get: (t, p: nested, r) => {
        if (!t[p]) {
            t[p] = <any>root.lookupType(`bilibili.${p}`);
        }
        return t[p];
    },
    set: (t, p, v, r) => true
});
/** 弹幕加载进度工具 */
const loadProgress = {
    /** 弹幕显示面板 */
    get root() { return document.querySelector(".bilibili-player-danmaku-load-status") },
    /** 当前进度 **不可外部调用，请用无下划线替代** */
    _pos: 0,
    /** 分包总数 **不可外部调用，请用无下划线替代** */
    _total: 0,
    /** 出错计数 **不可外部调用，请用无下划线替代** */
    _error: 0,
    set total(v: number) {
        this._total = v;
        this.root && (this.root.innerHTML = `载入弹幕数据（${this._pos || "--"}${this._error ? (this._error) : ""}/${parseInt(<any>this._total) || "--"}）`);
    },
    get total() { return this._total },
    set pos(v: number) {
        this._pos = v;
        this.root && (this.root.innerHTML = `载入弹幕数据（${this._pos || "--"}${this._error ? (this._error) : ""}/${parseInt(<any>this._total) || "--"}）`);
    },
    get pos() { return this._pos },
    set error(v: number) {
        this._error = v;
        this.root && (this.root.innerHTML = `载入弹幕数据（${this._pos || "--"}${this._error ? (this._error) : ""}/${parseInt(<any>this._total) || "--"}）`);
    },
    get error() { return this._error },
    /** 清空计数 */
    clear() {
        if (this._error) {
            toast.warning("部分弹幕包丢失~", `${this._error}/${parseInt(<any>this._total)}`);
            debug.error(`弹幕分包：${parseInt(<any>this._total)}`, `成功：${this._pos}`, `失败：${this._error}`);
        }
        else debug("加载弹幕成功~", `分包总数：${parseInt(<any>this._total)}`);
        this._pos = 0;
        this._total = 0;
        this._error = 0;
    }
}
class Danmaku {
    /** 弹幕元数据存档 */
    dmView: Record<string | number, any> = {};
    /**
     * 生成xml形式的弹幕
     * @param danmaku protoSeg.decode(new Uint8Array(this.response)).elems
     * @returns 委托对象，表示生成的xml形式的弹幕字符串
     */
    toXml(danmaku: (danmaku | danmakuNew)[]) {
        let DM: danmaku[] = Reflect.has(danmaku[0], "idStr") ? this.danmakuFormat(<danmakuNew[]>danmaku) : <danmaku[]>danmaku;
        this.sortDmById(DM, "dmid");
        let xml = DM.reduce((s, d) => {
            s += `<d p="${d.stime},${d.mode},${d.size},${d.color},${d.date},${d.class},${d.uid},${d.dmid}">${d.text.replace(/[<">'&]/g, (a: string) => { return <string>{ '<': '&lt;', '"': '&quot;', '>': '&gt;', "'": '&#39;', '&': '&amp;' }[a] }).replace(/(\n|\r\n)/g, "/n")}</d>\r\n`;
            return s;
        }, '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.api.bilibili.com</chatserver><chatid>' + API.cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source>\r\n');
        xml += "</i>";
        /**
         * remove-invalid-xml-characters.js
         * @link https://gist.github.com/john-doherty/b9195065884cdbfd2017a4756e6409cc
         * @license MIT
         * @see https://en.wikipedia.org/wiki/Valid_characters_in_XML
         */
        var regex = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
        return xml.replace(regex, '');
    }
    /**
     * 将弹幕数组按弹幕id升序排序
     * @param danmaku 要排序的弹幕数组
     * @param key 弹幕id的属性名，应为dmid或idStr
     */
    sortDmById(danmaku: (danmaku | danmakuNew)[], key: "dmid" | "idStr") {
        let egx = /^\d+$/;
        for (let i = 0, d: any; i < danmaku.length; i++) {
            d = danmaku[i];
            // 判断输入是否纯数字
            if (!egx.test(d[key])) throw "请输入数字字符串";
            // 强制转化输入为字符串
            if (typeof d[key] !== "string") d[key] = String(d[key]);
            // 去除数字开头占位的0
            d[key] = d[key].replace(/^0+/, "");
        }
        danmaku.sort((a: any, b: any) => this.bigInt(a[key], b[key]) ? 1 : -1);
    }
    /**
     * 将新版弹幕数组转化为旧版弹幕数组
     * @param dm 新版弹幕数组
     * @returns 旧版弹幕数组
     */
    danmakuFormat(dm: danmakuNew[]) {
        if (!dm) return [];
        let danmaku = dm.map(function (v) {
            let result: danmaku = {
                class: v.pool,
                color: v.color,
                date: v.ctime,
                dmid: v.idStr,
                mode: v.mode,
                size: v.fontsize,
                stime: v.progress / 1000,
                text: (v.mode != 8 && v.mode != 9) ? v.content.replace(/(\/n|\\n|\n|\r\n)/g, '\n') : v.content,
                uid: v.midHash,
                weight: v.weight
            };
            // 添加图片弹幕信息
            if (v.action && v.action.startsWith("picture:")) result.html = `<img src="//${v.action.split(":")[1]}" style="width:auto;height:56.25px;">`;
            // 利用bilibiliPlayer.js的这行代码，可以添加指定的css类到弹幕上
            // b.AH && (e.className = e.className + " " + b.AH);
            if (v.styleClass !== undefined) result.AH = v.styleClass;
            return result;
        });
        this.sortDmById(danmaku, "dmid");
        return danmaku;
    }
    /**
     * 比较大小，仅用于弹幕排序
     * @param num1 数字字符串 1
     * @param num2 数字字符串 2
     * @returns 前者大于后者返回真，否则返回假，相等也返回假
     */
    bigInt(num1: string, num2: string) {
        // 数位不同，前者大为真，否则为假
        if (num1.length > num2.length) return true;
        else if (num1.length < num2.length) return false;
        else {
            // 数位相同，逐位比较
            for (let i = 0; i < num1.length; i++) {
                // 任意一位前者大为真
                if (num1[i] > num2[i]) return true;
                // 任意一位前者小为假
                if (num1[i] < num2[i]) return false;
                // 仅当位相等时继续比较下一位
            }
            // 包括相等情况返回假
            return false;
        }
    }
    /** 解码protobuf弹幕 */
    segDmDecode(response: any): danmakuNew[] {
        return danmakuType.DmSegMobileReply.decode(new Uint8Array(response)).elems;
    }
    async getSegDanmaku(aid = API.aid, cid = API.cid) {
        try {
            if (!aid || !cid) throw `无法获取弹幕 aid：${aid} cid：${cid}`;
            const dmMeta = await this.dmWebView(aid, cid);
            // dmSge.total代表的分片总数，有时错误地为100
            // 故需要按照 视频时长/分片时长(一般是360秒) 把分片总数计算出来
            const pageSize = dmMeta.dmSge.pageSize ? dmMeta.dmSge.pageSize / 1000 : 360;
            loadProgress.total = ((<any>window).player && (<any>window).player.getDuration && ((<any>window).player.getDuration() / pageSize + 1)) || dmMeta.dmSge.total;
            // 其他视频的分片总数已经不能从当前window下获取
            if (aid && (aid != API.aid)) loadProgress.total = dmMeta.dmSge.total;
            let result: danmakuNew[] = []; // 弹幕栈
            const req: Promise<danmakuNew[]>[] = []; // 请求栈
            for (let index = 1; index <= loadProgress.total; index++) {
                req.push(this.dmWebSeg(index, aid, cid));
            }
            (await Promise.all(req)).forEach(d => result = result.concat(d));
            result = result.concat(await this.specialDms(aid, cid, dmMeta));
            dmMeta.commandDms.length > 0 && (result = result.concat(this.upHighlightDm(dmMeta.commandDms)));
            setting.commandDm && dmMeta.commandDms && Promise.resolve().then(() => { loadCommandDm(dmMeta.commandDms, aid, cid) })
            return result;
        } catch (e) {
            toast.error("加载弹幕出错~");
            debug.error("加载弹幕出错~", e);
        }
    }
    /**
     * 获取弹幕元数据
     * @param aid aid
     * @param cid cid
     */
    async dmWebView(aid = API.aid, cid = API.cid) {
        try {
            if (this.dmView[cid]) return this.dmView[cid];
            const data = await xhr({
                url: objUrl("https://api.bilibili.com/x/v2/dm/web/view", {
                    type: 1,
                    oid: cid,
                    pid: aid
                }),
                credentials: true,
                responseType: "arraybuffer"
            }, true)
            return this.dmView[cid] = danmakuType.DmWebViewReply.decode(new Uint8Array(data));
        } catch (e) {
            toast.error("加载弹幕元数据出错！");
            throw e;
        }
    }
    /**
     * 获取弹幕分包
     * @param i 索引
     * @param aid aid
     * @param cid cid
     */
    async dmWebSeg(i: number, aid = API.aid, cid = API.cid) {
        try {
            const data = await xhr({
                url: objUrl("https://api.bilibili.com/x/v2/dm/web/seg.so", {
                    type: 1,
                    oid: cid,
                    pid: aid,
                    segment_index: i
                }),
                credentials: true,
                responseType: "arraybuffer"
            });
            loadProgress.pos++;
            return this.segDmDecode(data);
        } catch (e) {
            loadProgress.error++;
            debug.error(`加载弹幕分包 ${i} 出错`);
            return [];
        }
    }
    /**
     * 获取特殊弹幕  可用于单独获取特殊弹幕
     * @param aid aid
     * @param cid cid
     * @param config 弹幕元数据
     */
    async specialDms(aid = API.aid, cid = API.cid, config?: any) {
        let result: danmakuNew[] = [];
        try {
            config = config || await this.dmWebView(aid, cid);
            if (config.specialDms.length > 0) {
                loadProgress.total += config.specialDms.length;
                const data = await Promise.all(config.specialDms.reduce((s: Promise<any>[], d: string) => {
                    s.push(this.dmSpSeg(d.replace("http:", "https:")))
                    return s;
                }, <Promise<any>[]>[]));
                data.forEach(d => result = result.concat(d));
            }
        } catch (e) {
            debug.error("获取特殊弹幕出错~", e);
        }
        loadProgress.clear();
        return result;
    }
    /**
     * 获取特殊弹幕分包
     * @param url 分包链接
     */
    async dmSpSeg(url: string) {
        try {
            const data = await xhr({
                url,
                responseType: "arraybuffer"
            })
            loadProgress.pos++;
            return this.segDmDecode(data);
        } catch (e) {
            loadProgress.error++;
            debug("获取特殊弹幕出错~", url, e);
            return [];
        }
    }
    /** up主高亮弹幕 */
    upHighlightDm(dms: any[]) {
        try {
            return dms.reduce((s, d) => {
                if (d.command == "#UP#") {
                    d.styleClass = "danmaku-up-icon";
                    d.color = 16777215;
                    d.pool = 0;
                    d.fontsize = 25;
                    d.ctime = new Date(d.mtime).getTime() / 1000;
                    d.mode = 1;
                    d.midHash = crc32(d.mid);
                }
                return s;
            }, <any[]>[]);
        } catch (e) {
            debug.error("UP主高亮弹幕", e);
            return [];
        }
    }
    /**
     * 载入本地弹幕
     * @param xml 读取本地弹幕文件得到的字符串
     * @param append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
     */
    loadLocalDm(xml: string, append: boolean) {
        let doc = new DOMParser().parseFromString(xml, "application/xml");
        let dm = doc.querySelectorAll("d");
        if (dm.length == 0) {
            toast.warning("从弹幕文件中没有获取到任何弹幕！");
            return;
        }
        let danmaku: danmaku[] = [];
        let attr: string[], v: Element, mode: number;
        for (let i = 0; i < dm.length; i++) {
            v = dm[i];
            attr = (<string>v.getAttribute('p')).split(",");
            mode = parseInt(attr[1]);
            danmaku[i] = {
                class: parseInt(attr[5]),
                color: parseInt(attr[3]),
                date: parseInt(attr[4]),
                dmid: attr[7],
                mode: mode,
                size: parseInt(attr[2]),
                stime: parseFloat(attr[0]),
                text: <string>((mode != 8 && mode != 9) ? (<string>v.textContent).replace(/(\/n|\\n|\n|\r\n)/g, '\n') : v.textContent),
                uid: attr[6]
            };
        }
        this.sortDmById(danmaku, "dmid");
        /**
         * bilibiliPlayer.js 21394行已经添加如下代码，用于设置弹幕池
         * @param  {Array} dm 弹幕数组
         * @param  {Boolean} append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
         */
        // setDanmaku = (dm) => {......}

        if (!(<any>window).player?.setDanmaku) return toast.error("刷新弹幕列表失败：播放器内部调用丢失！");
        (<any>window).player?.setDanmaku(danmaku, append);
    }
    /**
     * 获取历史弹幕
     * @param date 历史弹幕日期，yyyy-mm-dd格式：如 2009-06-24
     * @param cid 弹幕所在视频的 cid，不填则取当前视频的cid
     * @returns 解析好的弹幕数组
     */
    async getHistoryDanmaku(date: string, cid = API.cid) {
        if (!date || !uid) return;
        let dm = await xhr({
            url: objUrl("https://api.bilibili.com/x/v2/dm/web/history/seg.so", {
                type: String(1),
                oid: String(cid),
                date: date
            }),
            responseType: "arraybuffer",
            credentials: true
        });
        return this.segDmDecode(dm);
    }
    /**
     * 保存弹幕为文件
     * @param dm 弹幕数组
     * @param fileName 保存文件名
     */
    saveDanmaku(dm: danmaku[], fileName?: string) {
        let data = setting.danmakuSaveType === "xml" ? this.toXml(dm) : JSON.stringify(dm, undefined, '\t');
        saveAs(data, `${fileName || API.title || API.cid}${setting.danmakuSaveType === "xml" ? ".xml" : ".json"}`);
    }
}
/** 旧版播放器对应的弹幕对象 */
export interface danmaku {
    class: number;
    color: number;
    date: number;
    dmid: string;
    mode: number;
    size: number;
    stime: number;
    text: string;
    uid: string;
    html?: string;
    AH?: string;
    zIndex?: number;
    weight?: number;
}
/** proto弹幕对象 */
export interface danmakuNew {
    pool: number;
    color: number;
    ctime: number;
    idStr: string;
    mode: number;
    fontsize: number;
    progress: number;
    content: string;
    midHash: string;
    weight: number;
    action?: string;
    styleClass?: string
}
/** 弹幕相关 */
export const danmaku = new Danmaku();
window.addEventListener("message", async ev => {
    if (typeof ev.data === "object") {
        if (ev.data.$type == "onlineDanmaku") {
            if (!(<any>window).player) return toast.warning("请在播放页面使用本功能 →_→");
            if (!(<any>window).player.setDanmaku) return toast.warning("内部组件丢失！", "请检查【托管原生脚本】功能是否开启！");
            if (!ev.data.url) return toast.warning("请输入视频链接或参数~");
            toast.info(`正在解析url：${ev.data.url}`);
            try {
                const d = await urlParam(ev.data.url, false);
                if (d.aid && d.cid) {
                    toast.info("参数解析成功，正在获取弹幕数据~", d);
                    debug(ev.data.url, d);
                    let dm = await danmaku.getSegDanmaku(d.aid, d.cid);
                    if (dm) {
                        const dat = danmaku.danmakuFormat(dm);
                        toast.success("获取弹幕成功~");
                        (<any>window).player?.setDanmaku(dat, setting.danmakuContact);
                        setting.downloadOther && pushDownload({
                            group: "弹幕",
                            data: dat,
                            up: "在线",
                            down: `N/A`,
                            callback: () => danmaku.saveDanmaku(dat, ev.data.url)
                        });
                    }
                    else {
                        toast.error("获取弹幕失败，请在控制台检查原因~");
                    }
                } else {
                    toast.warning("提取弹幕参数失败，请检查输入~");
                }
            } catch (e) {
                toast.error("在线弹幕", e);
                debug.error("在线弹幕", e);
            }
        }
        if (typeof ev.data === "object") {
            if (ev.data.$type == "localMedia") {
                fileRead(".mp4,.json", true).then(d => {
                    d && new LocalMedia(d);
                })
            }
        }
        if (ev.data.$type == "allDanmaku") {
            allDanmaku();
        }
    }
})