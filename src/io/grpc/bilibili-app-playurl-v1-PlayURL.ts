import { Root } from "protobufjs/light";
import playurl from '../../json/playurl.json';
import { GrpcMetaData, Type } from "./bilibili-metadata-Metadata";
import { fnval, fnver, qn } from "../fnval";

export class GrpcBilibiliAppPlayUrlV1 extends GrpcMetaData {
    /** 命名空间 */
    protected static Root: Root;
    protected package = 'bilibili.app.playurl.v1';
    protected service = 'PlayURL';
    constructor(protected accessKey?: string) {
        super(accessKey);
        GrpcBilibiliAppPlayUrlV1.Root || (GrpcBilibiliAppPlayUrlV1.Root = Root.fromJSON(playurl));
    }
    protected lookupType<T extends object>(type: string) {
        return <Type<T>>GrpcBilibiliAppPlayUrlV1.Root.lookupType(`${this.package}.${type}`)
    }
    /** 获取播放地址 */
    PlayURL(req: PlayURLReq) {
        return this.request<PlayURLReq, PlayURLReply>(
            'PlayURL',
            'PlayURLReq',
            'PlayURLReply',
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
}
/** 播放地址请求参数 */
interface PlayURLReq {
    /** aid */
    aid: number;
    /** cid */
    cid: number;
    /** qn清晰度 */
    qn?: number;
    /** fnval */
    fnver?: number;
    /**
     * 0 flv请求，优先返回flv格式视频地址  
     * 1 flv请求，只返回mp4格式的视频地址  
     * 16 优先返回DASH-H265视频的JSON内容  
     * 64 设备支持HDR 视频播放，此位为0，代表不支持HDR，为1，代表支持HDR  
     * 128 是否需要4k视频，此位为0，代表不需要4k视频，为1，代表需要4k视频  
     * 256 是否需要杜比音频，此位为0，代表不需要杜比音频，为1，代表需要杜比音频  
     * fnval 每位(为1)标识一个功能, 其中HDR/4K位数 与 视频格式位数是可 或 关系，如：80 (01010000) 代表需要请求DASH格式的视频且设备支持HDR  
     */
    fnval?: number;
    /** 下载参数 0-非下载 1-下载flv 2-下载dash */
    download?: number;
    /** 返回url是否强制使用域名(非ip地址), 1-http域名 2-https域名 */
    forceHost?: number;
    /** 是否需要4k清晰度 */
    fourk?: boolean;
    /** 当前页面 */
    spmid?: string;
    /** 上级页面 */
    fromSpmid?: string;
}
/** 播放地址返回结果 */
export interface PlayURLReply {
    /** 视频的清晰度 */
    quality: number;
    /** 视频的格式 */
    format: string;
    /** 视频的总时长, 单位为ms */
    timelength: number;
    /** 视频的编码号 */
    videoCodecid: number;
    /** 请求的fnver */
    fnver: number;
    /** 请求的fnval */
    fnval: number;
    /** 是否支持投影 */
    videoProject: boolean;
    /** 视频播放url的列表，有durl则没dash字段 */
    durl: ResponseUrl[];
    /** DASH视频的MPD格式文件,有dash则没durl字段 */
    dash: ResponseDash;
    /** 表示cid是否非全二压，1表示非全二压 */
    noRexcode: number;
    /** 互动视频升级提示 */
    upgradeLimit: UpgradeLimit;
    /** 清晰度描述的列表 */
    supportFormats: FormatDescription[];
    /** 视频类型 1-flv 2-dash 3-mp4（只标识一个清晰度的格式） */
    type: VideoType;
}
/** flv url信息 */
interface ResponseUrl {
    /** 分片序列号 */
    order: number;
    /** 分片的时长, 单位ms */
    length: number;
    /** 分片的大小, 单位Byte */
    size: number;
    /** 分片的url地址 */
    url: string;
    /** 分片的备用url地址列表 */
    backupUrl: string[];
    /** 分片的md5,只有离线下载才有值 */
    md5: string;
}
/** dash信息 */
interface ResponseDash {
    /** dash视频信息 */
    video: DashItem[];
    audio: DashItem[];
}
/** dash具体信息 */
interface DashItem {
    /** dash的清晰度 */
    id: number;
    /** dash的url地址 */
    baseUrl: string;
    /** dash的backup url地址 */
    backupUrl: string[];
    /** dash的信息 */
    bandwidth: number;
    /** dash的信息 */
    codecid: number;
    /** 视频分片的md5,只有dash离线下载才有值 */
    md5: string;
    /** 视频分片的大小, 单位Byte,只有dash离线下载才有值 */
    size: number;
    /** dash的信息 */
    frameRate: string;
}
/** 互动视频升级信息 */
interface UpgradeLimit {
    /** 错误码 */
    code: number;
    /** 错误信息 */
    message: string;
    /** 图片 */
    image: string;
    /** 升级按钮信息 */
    button: UpgradeButton;
}
/** 互动视频升级按钮信息 */
interface UpgradeButton {
    /** 标题 */
    title: string;
    /** 链接 */
    link: string;
}
/** 清晰度描述 */
interface FormatDescription {
    /** 清晰度qn */
    quality: number;
    /** 清晰度格式 */
    format: string;
    /** 清晰度描述 */
    description: string;
    /** 新描述（6.9版本开始使用） */
    newDescription: string;
    /** 选中态的清晰度描述 */
    displayDesc: string;
    /** 选中态的清晰度描述的角标 */
    superscript: string;
}
/** 投屏地址请求参数 */
interface ProjectReq {
    /** aid */
    aid: number;
    /** cid */
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
    /** 是否需要4k清晰度（6.8版本开始已集成到fnval表示，该字段可不传） */
    fourk?: number;
    /** 当前页面 */
    spmid?: string;
    /** 上级页面 */
    fromSpmid?: string;
    /** 使用协议 默认乐播=0，自建协议=1，云投屏=2，airplay=3 */
    protocol?: number;
    /** 投屏设备 默认其他=0，OTT设备=1 */
    deviceType?: number;
}
/** 投屏地址返回结果 */
interface ProjectReply {
    project: PlayURLReply;
}
/** 播放view请求参数 */
interface PlayViewReq {
    /** aid */
    aid: number;
    /** cid */
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
    /** 是否需要4k清晰度（6.8版本开始已集成到fnval表示，该字段可不传） */
    fourk?: number;
    /** 当前页面 */
    spmid?: string;
    /** 上级页面 */
    fromSpmid?: string;
    /** 青少年模式 */
    teenagersMode?: number;
    /** 优先返回视频格式(h264 ,h265) */
    preferCodecType?: CodeType;
    /** 业务类型 */
    business?: Business;
}
/** 播放页返回结果 */
interface PlayViewReply {
    /** play基础信息 */
    videoInfo: VideoInfo;
    /** 云控配置信息-用户维度 */
    playConf: PlayAbilityConf;
    /** 互动视频升级提示 */
    upgradeLimit: UpgradeLimit;
    /** Chronos灰度管理（6.6版本开始不返回，已迁移到ViewProgress接口） */
    chronos: Chronos;
    /** 云控是否可用配置-稿件维度 */
    playArc: PlayArcConf;
    /** 播放事件 */
    event: Event;
}
/** 控制面板信息req */
interface PlayConfReq { }
/** 控制面板信息reply */
interface PlayConfReply {
    /** 云控配置信息 */
    playConf: PlayAbilityConf;
}
/** 播放三点配置信息 */
interface PlayAbilityConf {
    /** 后台播放 */
    backgroundPlayConf: CloudConf;
    /** 镜像反转 */
    flipConf: CloudConf;
    /** 视频的是否支持投屏 */
    castConf: CloudConf;
    /** 反馈 */
    feedbackConf: CloudConf;
    /** 字幕 */
    subtitleConf: CloudConf;
    /** 播放速度 */
    playbackRateConf: CloudConf;
    /** 定时停止播放 */
    timeUpConf: CloudConf;
    /** 播放方式 */
    playbackModeConf: CloudConf;
    /** 画面尺寸 */
    scaleModeConf: CloudConf;
    /** 顶 */
    likeConf: CloudConf;
    /** 踩 */
    dislikeConf: CloudConf;
    /** 投币 */
    coinConf: CloudConf;
    /** 充电 */
    elecConf: CloudConf;
    /** 分享 */
    shareConf: CloudConf;
    /** 截图/gif */
    screenShotConf: CloudConf;
    /** 锁屏 */
    lockScreenConf: CloudConf;
    /** 相关推荐 */
    recommendConf: CloudConf;
    /** 倍速 */
    playbackSpeedConf: CloudConf;
    /** 清晰度 */
    definitionConf: CloudConf;
    /** 选集 */
    selectionsConf: CloudConf;
    /** 下一集 */
    nextConf: CloudConf;
    /** 编辑弹幕 */
    editDmConf: CloudConf;
    /** 小窗 */
    smallWindowConf: CloudConf;
    /** 播放震动 */
    shakeConf: CloudConf;
    /** 外层面板弹幕设置（实验组1） */
    outerDmConf: CloudConf;
    /** 三点内弹幕设置（实验组2） */
    innerDmConf: CloudConf;
    /** 全景 */
    panoramaConf: CloudConf;
    /** 杜比 */
    dolbyConf: CloudConf;
}
/** 播放三点配置信息-稿件维度 */
interface PlayArcConf {
    /** 后台播放 */
    backgroundPlayConf: ArcConf;
    /** 镜像反转 */
    flipConf: ArcConf;
    /** 视频的是否支持投屏 */
    castConf: ArcConf;
    /** 反馈 */
    feedbackConf: ArcConf;
    /** 字幕 */
    subtitleConf: ArcConf;
    /** 播放速度 */
    playbackRateConf: ArcConf;
    /** 定时停止播放 */
    timeUpConf: ArcConf;
    /** 播放方式 */
    playbackModeConf: ArcConf;
    /** 画面尺寸 */
    scaleModeConf: ArcConf;
    /** 顶 */
    likeConf: ArcConf;
    /** 踩 */
    dislikeConf: ArcConf;
    /** 投币 */
    coinConf: ArcConf;
    /** 充电 */
    elecConf: ArcConf;
    /** 分享 */
    shareConf: ArcConf;
    /** 截图/gif */
    screenShotConf: ArcConf;
    /** 锁屏 */
    lockScreenConf: ArcConf;
    /** 相关推荐 */
    recommendConf: ArcConf;
    /** 倍速 */
    playbackSpeedConf: ArcConf;
    /** 清晰度 */
    definitionConf: ArcConf;
    /** 选集 */
    selectionsConf: ArcConf;
    /** 下一集 */
    nextConf: ArcConf;
    /** 编辑弹幕 */
    editDmConf: ArcConf;
    /** 小窗 */
    smallWindowConf: ArcConf;
    /** 播放震动 */
    shakeConf: ArcConf;
    /** 外层面板弹幕设置（实验组1 */
    outerDmConf: ArcConf;
    /** 三点内弹幕设置（实验组2） */
    innerDmConf: ArcConf;
    /** 全景 */
    panoramaConf: ArcConf;
    /** 杜比 */
    dolbyConf: ArcConf;
}
/** 播放地址返回结果 */
export interface VideoInfo {
    /** 视频的清晰度 */
    quality: number;
    /** 视频的格式 */
    format: string;
    /** 视频的总时长, 单位为ms */
    timelength: number;
    /** 视频的编码号 */
    videoCodecid: number;
    /** 流信息 */
    streamList: Stream[];
    /** aduio */
    dashAudio: DashItem;
    /** dolby */
    dolby: DolbyItem;
}
interface PlayAbilityConf { }
/** 视频的拥有的清晰度描述的列表 */
interface Stream {
    streamInfo: StreamInfo;
    content: {
        /** DASH视频的MPD格式文件,有dash则没durl字段 */
        dashVideo: DashVideo;
        /** 视频播放url的列表，有durl则没dash字段 */
        segmentVideo: SegmentVideo;
    }
}
interface StreamInfo {
    /** 清晰度qn */
    quality: number;
    /** 清晰度格式 */
    format: string;
    /** 清晰度描述 */
    description: string;
    /** 错误码 */
    errCode: PlayErr;
    /** 不满足播放条件时的提示文案 */
    limit: StreamLimit;
    needVip: boolean;
    needLogin: boolean;
    /** 是否是完整的 */
    intact: boolean;
    /** 表示cid是否非全二压，true表示非全二压 */
    noRexcode: boolean;
    /** 清晰度属性位（每位为1表示不同属性，第0位为1->是HDR） */
    attribute: number;
    /** 新描述（6.9版本开始使用） */
    newDescription: string;
    /** 选中态的清晰度描述 */
    displayDesc: string;
    /** 选中态的清晰度描述的角标 */
    superscript: string;
}
/** 不满足播放条件时的提示文案 */
interface StreamLimit {
    /** 标题 */
    title: string;
    /** 跳转地址 */
    uri: string;
    /** 提示信息 */
    msg: string;
}
/** dash信息 */
interface DashVideo {
    /** dash的url地址 */
    baseUrl: string;
    /** dash的backup url地址 */
    backupUrl: string[];
    /** dash的信息 */
    bandwidth: number;
    /** dash的信息 */
    codecid: number;
    /** 视频分片的md5,只有dash离线下载才有值 */
    md5: string;
    /** 视频分片的大小, 单位Byte,只有dash离线下载才有值 */
    size: number;
    /** dash视频信息id,default id */
    audioId: number;
    /** 表示cid是否非全二压，true表示非全二压 */
    noRexcode: boolean;
}
interface PlayConfEditReply { }
/** 编辑控制面板 */
interface PlayConfEditReq {
    playConf: PlayConfState[];
}
interface PlayConfState {
    /** 云控类型 */
    confType: ConfType;
    /** true:展示 false:隐藏 */
    show: boolean;
    /** 云控value */
    fieldValue: FieldValue;
}
/** DASH视频的MPD格式文件,有dash则没durl字段 */
interface SegmentVideo {
    segment: ResponseUrl[]
}
/** DolbyItem */
interface DolbyItem {
    /** 杜比类型 */
    type: DolbyItemType;
    /** 杜比音频信息 */
    audio: DashItem[];
}
enum PlayErr {
    NoErr = 0,
    /** 管控类型的错误码 */
    WithMultiDeviceLoginErr = 1
}
enum DolbyItemType {
    /** NONE */
    NONE = 0,
    /** 普通杜比音效 */
    COMMON = 1,
    /** 全景杜比音效 */
    ATMOS = 2
}
/** 设备维度 */
interface CloudConf {
    /** 是否展示功能 */
    show: boolean;
    /** 标记类型 */
    confType: ConfType;
    fieldValue: FieldValue;
}
interface FieldValue {
    value: {
        switch: boolean;
    }
}
/** 稿件维度 */
interface ArcConf {
    /** 是否可用 */
    isSupport: boolean;
}
/** Chronos灰度管理 */
interface Chronos {
    /** 唯一key */
    md5: string;
    /** 文件地址 */
    file: string;
}
/** Event */
interface Event {
    shake: Shake;
}
/** Shake Event */
interface Shake {
    file: string;
}
enum ConfType {
    /** default */
    NoType = 0,
    /** 镜像反转 */
    FLIPCONF = 1,
    /** 视频投屏 */
    CASTCONF = 2,
    /** 反馈 */
    FEEDBACK = 3,
    /** 字幕 */
    SUBTITLE = 4,
    /** 播放速度 */
    PLAYBACKRATE = 5,
    /** 定时停止播放 */
    TIMEUP = 6,
    /** 播放方式 */
    PLAYBACKMODE = 7,
    /** 画面尺寸 */
    SCALEMODE = 8,
    /** 后台播放 */
    BACKGROUNDPLAY = 9,
    /** 顶 */
    LIKE = 10,
    /** 踩 */
    DISLIKE = 11,
    /** 投币 */
    COIN = 12,
    /** 充电 */
    ELEC = 13,
    /** 分享 */
    SHARE = 14,
    /** 截图/gif */
    SCREENSHOT = 15,
    /** 锁屏 */
    LOCKSCREEN = 16,
    /** 相关推荐 */
    RECOMMEND = 17,
    /** 倍速 */
    PLAYBACKSPEED = 18,
    /** 清晰度 */
    DEFINITION = 19,
    /** 选集 */
    SELECTIONS = 20,
    /** 下一集 */
    NEXT = 21,
    /** 编辑弹幕 */
    EDITDM = 22,
    /** 小窗 */
    SMALLWINDOW = 23,
    /** 播放震动 */
    SHAKE = 24,
    /** 外层面板弹幕设置（实验组1） */
    OUTERDM = 25,
    /** 三点内弹幕设置（实验组2） */
    INNERDM = 26,
    /** 全景 */
    PANORAMA = 27,
    /** 杜比 */
    DOLBY = 28
}
/** 视频格式(h264 ,h265) */
export enum CodeType {
    /** default */
    NOCODE = 0,
    /** 编码264 */
    CODE264 = 1,
    /** 编码265 */
    CODE265 = 2
}
/** 业务类型 */
enum Business {
    /** 未知类型 */
    UNKNOWN = 0,
    /** story业务 */
    STORY = 1
}
/** 视频类型 */
enum VideoType {
    Unknown = 0,
    /** flv格式 */
    FLV = 1,
    /** dash格式 */
    DASH = 2,
    /** mp4格式 */
    MP4 = 3
}