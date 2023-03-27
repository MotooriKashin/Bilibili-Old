import { Root, Type } from "protobufjs/light";
import dmproto from '../../json/dm-web.json';
import { DanmakuBase } from "../../utils/danmaku";
import { objUrl } from "../../utils/format/url";
import { URLS } from "../urls";

/** 分段弹幕配置 */
interface DmSegConfig {
    pageSize: number;
    total: number;
}
/** ai云屏蔽弹幕的配置 */
interface DanmakuFlagConfig {
    /** 云屏蔽等级 */
    recFlag: number;
    /** 云屏蔽文案 */
    recText: string;
    /** 云屏蔽开关 */
    recSwitch: number;
}
/** 指令弹幕 */
interface CommandDm {
    /** 弹幕id */
    id: number;
    /** oid */
    oid: number;
    /** mid */
    mid: number;
    /** 弹幕指令 */
    command: string;
    /** 弹幕内容 */
    content: string;
    /** 弹幕位置 */
    progress: number;
    /** 创建时间 */
    ctime: string;
    /** 修改时间 */
    mtime: string;
    /** extra */
    extra: string;
    /** id string类型 */
    idStr: string;
}
/** 具体数值意义 https://info.bilibili.co/pages/viewpage.action?pageId=114161867 */
interface DanmuWebPlayerConfig {
    /** 是否开启弹幕 */
    dmSwitch: boolean;
    /** AI 智能推荐弹幕，是否开启 */
    aiSwitch: boolean;
    /** AI 智能推荐弹幕，屏蔽等级 */
    aiLevel: number;
    /** 是否屏蔽顶端弹幕 */
    blocktop: boolean;
    /** 是否屏蔽滚动弹幕 */
    blockscroll: boolean;
    /** 是否屏蔽底端弹幕 */
    blockbottom: boolean;
    /** 是否屏蔽彩色弹幕 */
    blockcolor: boolean;
    /** 是否屏蔽高级弹幕 */
    blockspecial: boolean;
    preventshade: boolean;
    dmask: boolean;
    /** 弹幕不透明度 */
    opacity: number;
    /** 弹幕显示区域（0.25=1/4屏；0.5=半屏；0.75=3/4屏；1.0=满屏; 2.0=无限） */
    dmarea: number;
    speedplus: number;
    fontsize: number;
    screensync: boolean;
    speedsync: boolean;
    fontfamily: string;
    bold: boolean;
    fontborder: number;
    drawType: string;
}
/** 弹幕view返回 */
interface DmWebViewReply {
    /** 弹幕区是否关闭 */
    state: number;
    text: string;
    textSide: string;
    dmSge: DmSegConfig;
    flag: DanmakuFlagConfig;
    /** 高级弹幕链接地址 （上传到bfs） */
    specialDms: string[];
    /** check box 是否展示 */
    checkBox: boolean;
    /** 弹幕数 */
    count: number;
    commandDms: CommandDm[];
    dmSetting: DanmuWebPlayerConfig;
    /** 用户举报弹幕，cid维度屏蔽 */
    reportFilter: string[];
}
/** elems 弹幕列表 */
export interface DanmakuElem {
    /** 弹幕id */
    id: number;
    /** 弹幕位置 */
    progress: number;
    /** 弹幕类型 */
    mode: number;
    /** 弹幕字体 */
    fontsize: number;
    /** 弹幕颜色 */
    color: number;
    /** 弹幕发送者md5哈希 */
    midHash: string;
    /** 弹幕文本内容 */
    content: string;
    /** 弹幕发送时间  时间戳 */
    ctime: number;
    /** 弹幕权重 越高显示优先级越高 */
    weight?: number;
    /** 弹幕动作 */
    action?: string;
    /** 弹幕池 */
    pool: number;
    /** 弹幕id_str */
    idStr: string;
    /** 弹幕属性位 0保护弹幕 1直播弹幕 2高赞弹幕 */
    attr?: DMAttrBit;
}
// 弹幕属性位值
enum DMAttrBit {
    // 保护弹幕
    DMAttrBitProtect,
    // 直播弹幕
    DMAttrBitFromLive,
    // 高赞弹幕
    DMAttrHighLike,
}
interface DmSegMobileReply {
    elems: DanmakuElem[];
}
export interface DanmakuCmd {
    /** 弹幕池 */
    class: DanmakuElem['pool'];
    pool: DanmakuElem['pool'];
    /** 弹幕颜色 */
    color: DanmakuElem['color'];
    /** 弹幕发送时间  时间戳 */
    date: DanmakuElem['ctime'];
    /** 弹幕id */
    dmid: DanmakuElem['idStr'];
    /** 弹幕类型 */
    mode: DanmakuElem['mode'];
    /** 弹幕字体 */
    size: DanmakuElem['fontsize'];
    /** 弹幕位置 */
    stime: DanmakuElem['progress'];
    /** 弹幕文本内容 */
    text: DanmakuElem['content'];
    /** 弹幕发送者md5哈希 */
    uhash: DanmakuElem['midHash'];
    uid: DanmakuElem['midHash'];
    /** 弹幕权重 越高显示优先级越高 */
    weight?: DanmakuElem['weight'];
    /** 图片弹幕 */
    html?: DanmakuElem['action'];
    /** 弹幕属性位 0保护弹幕 1直播弹幕 2高赞弹幕 */
    attr?: DanmakuElem['attr'];
    mid?: number;
    rnd?: string;
    uname?: string;
}
export class ApiDmWeb {
    protected static Root: Root;
    protected static DmWebViewReply: Type;
    protected static DmSegMobileReply: Type;
    protected static RootInit() {
        this.Root = Root.fromJSON(dmproto);
        this.DmWebViewReply = this.Root.lookupType('DmWebViewReply');
        this.DmSegMobileReply = this.Root.lookupType('DmSegMobileReply');
    }
    danmaku: DanmakuElem[] = [];
    constructor(private aid: number, private cid: number) {
        ApiDmWeb.Root || ApiDmWeb.RootInit();
    }
    /** 获取新版弹幕 */
    async getData() {
        if (!this.danmaku.length) {
            const dmWebView = await this.DmWebViewReply();
            const pageSize = dmWebView.dmSge.pageSize ? dmWebView.dmSge.pageSize / 1000 : 360;
            const total = (this.aid == (<any>window).aid && ((<any>window).player?.getDuration?.() / pageSize + 1)) || dmWebView.dmSge.total;
            const promises: Promise<any>[] = [];
            for (let i = 1; i <= total; i++) {
                promises.push(
                    this.DmSegMobileReply(i)
                        .then(d => {
                            d.elems && (this.danmaku = this.danmaku.concat(d.elems));
                        })
                        .catch(e => {
                            console.warn('弹幕丢包：', `segment_index=${i}`, e);
                        })
                )
            }
            dmWebView.specialDms && dmWebView.specialDms.forEach(d => {
                promises.push(
                    this.specialDm(d.replace('http:', ''))
                        .then(d => {
                            d.elems && (this.danmaku = this.danmaku.concat(d.elems));
                        })
                        .catch(e => {
                            console.warn('高级弹幕丢包：', d, e);
                        })
                )
            });
            await Promise.all(promises);
            DanmakuBase.sortDmById(this.danmaku);
        }
        return this.danmaku;
    }
    /** 获取旧版弹幕 */
    async toCmd() {
        const danmaku = await this.getData();
        return DanmakuBase.parseCmd(danmaku);
    }
    /** 获取弹幕分包 */
    private async DmWebViewReply() {
        const response = await fetch(objUrl(URLS.DM_WEB_VIEW, {
            type: 1,
            oid: this.cid,
            pid: this.aid,
        }), { credentials: 'include', cache: 'force-cache' });
        const arraybuffer = await response.arrayBuffer();
        const msg = ApiDmWeb.DmWebViewReply.decode(new Uint8Array(arraybuffer));
        return <DmWebViewReply>ApiDmWeb.DmWebViewReply.toObject(msg);
    }
    /** 获取弹幕分包 */
    private async DmSegMobileReply(segment_index: number = 1) {
        const response = await fetch(objUrl(URLS.DM_WEB_SEG_SO, {
            type: 1,
            oid: this.cid,
            pid: this.aid,
            segment_index
        }), { credentials: 'include' });
        const arraybuffer = await response.arrayBuffer();
        const msg = ApiDmWeb.DmSegMobileReply.decode(new Uint8Array(arraybuffer));
        return <DmSegMobileReply>ApiDmWeb.DmSegMobileReply.toObject(msg);
    }
    /** 获取高级弹幕 */
    private async specialDm(url: string) {
        const response = await fetch(url);
        const arraybuffer = await response.arrayBuffer();
        const msg = ApiDmWeb.DmSegMobileReply.decode(new Uint8Array(arraybuffer));
        return <DmSegMobileReply>ApiDmWeb.DmSegMobileReply.toObject(msg);
    }
}