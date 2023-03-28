import { Root } from "protobufjs/light";
import playurl from '../../json/playurl.json';
import { CodeType, PlayURLReply, VideoInfo } from "./bilibili-app-playurl-v1-PlayURL";
import { GrpcMetaData, Type } from "./bilibili-metadata-Metadata";
import { qn, fnval, fnver } from "../fnval";

export class GrpcBilibiliPgcGatewayPlayerV1 extends GrpcMetaData {
    /** 命名空间 */
    protected static Root: Root;
    protected package = 'bilibili.pgc.gateway.player.v1';
    protected service = 'PlayURL';
    protected lookupType<T extends object>(type: string): Type<T> {
        return <Type<T>>GrpcBilibiliPgcGatewayPlayerV1.Root.lookupType(`${this.package}.${type}`)
    }
    constructor(protected accessKey?: string) {
        super(accessKey);
        GrpcBilibiliPgcGatewayPlayerV1.Root || (GrpcBilibiliPgcGatewayPlayerV1.Root = Root.fromJSON(playurl));
    }
    /** 获取播放地址和云控配置信息 */
    PlayView(req: PlayViewReq) {
        return this.request<PlayViewReq, PlayViewReply>(
            'PlayView',
            'PlayViewReq',
            'PlayViewReply',
            Object.assign({
                qn,
                fnval,
                fnver,
                forceHost: 2
            }, req)
        )
    }
    /** 获取投屏地址 */
    Project(req: ProjectReq) {
        return this.request<ProjectReq, ProjectReply>(
            'Project',
            'ProjectReq',
            'ProjectReply',
            Object.assign({
                qn,
                fnval,
                fnver,
                forceHost: 2,
                protocol: 0,
                deviceType: 0
            }, req)
        )
    }
}

/** 播放view请求参数 */
interface PlayViewReq {
    /** epId */
    epId: number;
    /** cid 互动视频或者垫片需要 */
    cid: number;
    /** qn清晰度 */
    qn?: number;
    /** fnver */
    fnver?: number;
    /** fnval */
    fnval?: number;
    /** 下载参数 0-非下载 1-下载flv 2-下载dash */
    download?: number;
    /** 返回url是否强制使用域名(非ip地址), 1-http域名 2-https域名 */
    forceHost?: number;
    /** 是否需要4k清晰度 */
    fourk?: number;
    /** 当前页面 */
    spmid?: string;
    /** 上级页面 */
    fromSpmid?: string;
    /** 青少年模式 */
    teenagersMode?: number;
    /** 优先返回视频格式(h264 ,h265) */
    preferCodecType?: CodeType;
    /** 是否强制请求预览视频 */
    isPreview?: boolean;
    /** 一起看房间id */
    roomId?: number;
}
/** 投屏参数 */
interface ProjectReq {
    /** epId */
    epId: number;
    /** cid 互动视频或者垫片需要 */
    cid: number;
    /** qn清晰度 */
    qn?: number;
    /** fnver */
    fnver?: number;
    /** fnval */
    fnval?: number;
    /** 下载参数 0-非下载 1-下载flv 2-下载dash */
    download?: number;
    /** 返回url是否强制使用域名(非ip地址), 1-http域名 2-https域名 */
    forceHost?: number;
    /** 是否需要4k清晰度 */
    fourk?: number;
    /** 当前页面 */
    spmid?: string;
    /** 上级页面 */
    fromSpmid?: string;
    /** 使用协议 默认乐播=0，自建协议=1，云投屏=2 */
    protocol: number;
    /** 投屏设备 默认其他=0，OTT设备=1 */
    deviceType: number;
}
/** 播放页返回结果 */
interface PlayViewReply {
    /** play基础信息 */
    videoInfo: VideoInfo;
    /** 云控配置信息, 是否禁用 */
    playConf: PlayAbilityConf;
    /** 业务需要的其他信息 */
    business: BusinessInfo;
    /** 播放事件 */
    event: Event;
}
/** Event */
interface Event {
    shake: Shake;
}
/** Shake Event */
interface Shake {
    file: string;
}
/** 云控配置信息, 是否禁用 */
interface PlayAbilityConf {
    /** 后台播放 */
    backgroundPlayDisable: boolean;
    /** 镜像反转 */
    flipDisable: boolean;
    /** 视频的是否支持投屏 */
    castDisable: boolean;
    /** 反馈 */
    feedbackDisable: boolean;
    /** 字幕 */
    subtitleDisable: boolean;
    /** 播放速度 */
    playbackRateDisable: boolean;
    /** 定时停止播放 */
    timeUpDisable: boolean;
    /** 播放方式 */
    playbackModeDisable: boolean;
    /** 画面尺寸 */
    scaleModeDisable: boolean;
    /** 顶 */
    likeDisable: boolean;
    /** 踩 */
    dislikeDisable: boolean;
    /** 投币 */
    coinDisable: boolean;
    /** 充电 */
    elecDisable: boolean;
    /** 分享 */
    shareDisable: boolean;
    /** 截图/gif */
    screenShotDisable: boolean;
    /** 锁屏 */
    lockScreenDisable: boolean;
    /** 相关推荐 */
    recommendDisable: boolean;
    /** 倍速 */
    playbackSpeedDisable: boolean;
    /** 清晰度 */
    definitionDisable: boolean;
    /** 选集 */
    selectionsDisable: boolean;
    /** 下一集 */
    nextDisable: boolean;
    /** 编辑弹幕 */
    editDmDisabl: boolean;
    /** 小窗 */
    smallWindowDisable: boolean;
    /** 播放振动 */
    shakeDisable: boolean;
    /** 外层面板弹幕设置（实验组1） */
    outerDmDisable: boolean;
    /** 三点内弹幕设置（实验组2） */
    innerDmDisable: boolean;
    /** 一起看入口 */
    freyaEnterDisable: boolean;
    /** 杜比入口 */
    dolbyDisable: boolean;
    /** 全屏一起看入口 */
    freyaFullDisable: boolean;
}
/** 其他业务信息 */
interface BusinessInfo {
    /** 当前视频是否是预览 */
    isPreview: boolean;
    /** 用户是否承包过 */
    bp: number;
    /** drm使用 */
    marlinToken: string;
}
/** 投屏地址返回结果 */
interface ProjectReply {
    project: PlayURLReply;
}
/** 直播播放请求参数 */
interface LivePlayViewReq {
    /** epId */
    epId: number;
    /** 0, 10000[原画], 400[蓝光], 250[超清], 150[高清], 80[流畅] */
    quality: 80 | 150 | 250 | 400 | 10000;
    /** 
     * 请求的流类型，按位表示
     * |  | 蒙版 | p2p | dash | hevc | 音频 |
     * | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 值 | 1 | 1 | 1 | 1 | 1 |
     **/
    ptype: number;
    /** 是否请求https的url */
    https: boolean;
    /** 0 默认直播间播放 1 投屏播放 */
    playType: number;
    /** 投屏设备 默认其他=0，OTT设备=1 */
    deviceType: number;
}
/** 直播返回信息 */
interface LivePlayViewReply {
    /** 房间信息 */
    roomInfo: RoomInfo;
    /** 播放信息 */
    playInfo: LivePlayInfo;
}
/** 房间信息 */
interface RoomInfo {
    /** 房间长号 */
    roomId: number;
    /** 主播uid */
    uid: number;
    /** Model1：房间信息（状态相关） */
    status: RoomStatusInfo;
    /** Model2：房间信息（展示相关） */
    show: RoomShowInfo;
}
/** 播放信息 */
interface LivePlayInfo {
    currentQn: number;
    qualityDescription: QualityDescription[];
    durl: ResponseDataUrl[];
}
/** 房间信息(状态） */
interface RoomStatusInfo {
    /** 直播间状态 0未开播，1直播中；2轮播中； */
    liveStatus: number;
    /** 横竖屏方向 0横屏，1竖屏 */
    liveScreenType: number;
    /** 是否开播过标识 */
    liveMark: number;
    /** 封禁状态：0未封禁；1审核封禁; 2全网封禁 */
    lockStatus: number;
    /** 封禁时间戳 */
    lockTime: number;
    /** 隐藏状态 0不隐藏，1隐藏 */
    hiddenStatus: number;
    /** 隐藏时间戳 */
    hiddenTime: number;
    /** 直播类型 0默认 1摄像头直播 2录屏直播 3语音直播 */
    liveType: number;
    roomShield: number;
}
/** 房间信息(展示) */
interface RoomShowInfo {
    /** 短号 */
    shortId: number;
    /** 人气值 */
    popularityCount: number;
    /** 最近一次开播时间戳 */
    liveStartTime: number;
}
interface QualityDescription {
    qn: number;
    desc: string;
}
interface ResponseDataUrl {
    url: string;
    /**
     * 表示stream类型,按位表示  
     * |  | mask | p2p | dash | hevc | only-audio |
     * | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 值 | 1 | 1 | 1 | 1 | 1 |
     */
    streamType: number;
    /**
     * 表示支持p2p的cdn厂商,按位表示
     * | CDN | hw | bdy | bsy | ws | txy | qn | js | bvc |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 值 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
     */
    ptag: number;
}