import { Root } from "protobufjs/light";
import playurl from '../../json/playurl.json';
import { GrpcMetaData, Type } from "./metadata";
import { fnval, fnver, qn } from "../fnval";

export class GrpcBilibiliAppPlayUrlV1 extends GrpcMetaData {
    /** 命名空间 */
    protected static Root: Root;
    /** Type<PlayURLReq> */
    protected static PlayURLReq: Type<PlayURLReq>;
    /** Type<PlayURLReply> */
    protected static PlayURLReply: Type<PlayURLReply>;
    /** 初始化命名空间及Type */
    protected static RootInit() {
        this.Root = Root.fromJSON(playurl);
        this.PlayURLReq = <any>this.Root.lookupType('PlayURLReq');
        this.PlayURLReply = <any>this.Root.lookupType('PlayURLReply');
    }
    protected package = 'bilibili.app.playurl.v1.PlayURL';
    /** Type<PlayURLReq> */
    protected get PlayURLReq() {
        return GrpcBilibiliAppPlayUrlV1.PlayURLReq;
    }
    /** Type<PlayURLReply> */
    protected get PlayURLReply() {
        return GrpcBilibiliAppPlayUrlV1.PlayURLReply;
    }
    constructor(protected access_key?: string) {
        super(access_key);
        GrpcBilibiliAppPlayUrlV1.Root || GrpcBilibiliAppPlayUrlV1.RootInit();
    }
    /**
     * 获取播放地址
     * @param req PlayURLReq
     * @example 
     * await new GrpcBilibiliAppPlayUrlV1().PlayURL({aid:589936965,cid:392681949})
     */
    async PlayURL(req: PlayURLReq) {
        const response = await this.fetch(
            'PlayURL',
            this.PlayURLReq.encode(this.PlayURLReq.fromObject(Object.assign(<PlayURLReq>{
                qn,
                fnval,
                fnver,
                // download: 2,
                force_host: 2
            }, req))).finish()
        );
        const arraybuffer = await response.arrayBuffer();
        // 需要剔除5字节的grpc压缩及字节标记！
        return this.PlayURLReply.toObject(this.PlayURLReply.decode(new Uint8Array(arraybuffer.slice(5))))
    }
}
/** 播放地址请求参数 */
interface PlayURLReq {
    /** aid */
    aid: number;
    /** cid */
    cid: number;
    /** qn清晰度 */
    qn: number;
    /** fnval */
    fnver: number;
    /**
     * 0 flv请求，优先返回flv格式视频地址  
     * 1 flv请求，只返回mp4格式的视频地址  
     * 16 优先返回DASH-H265视频的JSON内容  
     * 64 设备支持HDR 视频播放，此位为0，代表不支持HDR，为1，代表支持HDR  
     * 128 是否需要4k视频，此位为0，代表不需要4k视频，为1，代表需要4k视频  
     * 256 是否需要杜比音频，此位为0，代表不需要杜比音频，为1，代表需要杜比音频  
     * fnval 每位(为1)标识一个功能, 其中HDR/4K位数 与 视频格式位数是可 或 关系，如：80 (01010000) 代表需要请求DASH格式的视频且设备支持HDR  
     */
    fnval: number;
    /** 下载参数 0-非下载 1-下载flv 2-下载dash */
    download: number;
    /** 返回url是否强制使用域名(非ip地址), 1-http域名 2-https域名 */
    force_host: number;
    /** 是否需要4k清晰度 */
    fourk: boolean;
    /** 当前页面 */
    spmid: string;
    /** 上级页面 */
    from_spmid: string;
}
/** 播放地址返回结果 */
interface PlayURLReply {
    /** 视频的清晰度 */
    quality: number;
    /** 视频的格式 */
    format: string;
    /** 视频的总时长, 单位为ms */
    timelength: number;
    /** 视频的编码号 */
    video_codecid: number;
    /** 请求的fnver */
    fnver: number;
    /** 请求的fnval */
    fnval: number;
    /** 是否支持投影 */
    video_project: boolean;
    /** 视频播放url的列表，有durl则没dash字段 */
    durl: ResponseUrl[];
    /** DASH视频的MPD格式文件,有dash则没durl字段 */
    dash: ResponseDash;
    /** 表示cid是否非全二压，1表示非全二压 */
    no_rexcode: number;
    /** 互动视频升级提示 */
    upgrade_limit: UpgradeLimit;
    /** 清晰度描述的列表 */
    support_formats: FormatDescription[];
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
    backup_url: string[];
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
    base_url: string;
    /** dash的backup url地址 */
    backup_url: string[];
    /** dash的信息 */
    bandwidth: number;
    /** dash的信息 */
    codecid: number;
    /** 视频分片的md5,只有dash离线下载才有值 */
    md5: string;
    /** 视频分片的大小, 单位Byte,只有dash离线下载才有值 */
    size: number;
    /** dash的信息 */
    frame_rate: string;
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
    new_description: string;
    /** 选中态的清晰度描述 */
    display_desc: string;
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
    qn: number;
    /** fnver */
    fnver: number;
    /** fnval */
    fnval: number;
    /** 下载参数 0-非下载 1-下载flv 2-下载dash */
    download: number;
    /** 返回url是否强制使用域名(非ip地址), 1-http域名 2-https域名 */
    force_host: number;
    /** 是否需要4k清晰度（6.8版本开始已集成到fnval表示，该字段可不传） */
    fourk: number;
    /** 当前页面 */
    spmid: string;
    /** 上级页面 */
    from_spmid: string;
    /** 使用协议 默认乐播=0，自建协议=1，云投屏=2，airplay=3 */
    protocol: number;
    /** 投屏设备 默认其他=0，OTT设备=1 */
    device_type: number;
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
    qn: number;
    /** fnver */
    fnver: number;
    /** fnval */
    fnval: number;
    /** 下载参数 0-非下载 1-下载flv 2-下载dash */
    download: number;
    /** 返回url是否强制使用域名(非ip地址), 1-http域名 2-https域名 */
    force_host: number;
    /** 是否需要4k清晰度（6.8版本开始已集成到fnval表示，该字段可不传） */
    fourk: number;
    /** 当前页面 */
    spmid: string;
    /** 上级页面 */
    from_spmid: string;
    /** 青少年模式 */
    teenagers_mode: number;
    /** 优先返回视频格式(h264 ,h265) */
    prefer_codec_type: CodeType;
    /** 业务类型 */
    business: Business;
}
/** 播放页返回结果 */
interface PlayViewReply {
    /** play基础信息 */
    video_info: VideoInfo;
    /** 云控配置信息-用户维度 */
    play_conf: PlayAbilityConf;
    /** 互动视频升级提示 */
    upgrade_limit: UpgradeLimit;
    /** Chronos灰度管理（6.6版本开始不返回，已迁移到ViewProgress接口） */
    chronos: Chronos;
    /** 云控是否可用配置-稿件维度 */
    play_arc: PlayArcConf;
    /** 播放事件 */
    event: Event;
}
/** 控制面板信息req */
interface PlayConfReq { }
/** 控制面板信息reply */
interface PlayConfReply {
    /** 云控配置信息 */
    play_conf: PlayAbilityConf;
}
/** 播放三点配置信息 */
interface PlayAbilityConf {
    /** 后台播放 */
    background_play_conf: CloudConf;
    /** 镜像反转 */
    flip_conf: CloudConf;
    /** 视频的是否支持投屏 */
    cast_conf: CloudConf;
    /** 反馈 */
    feedback_conf: CloudConf;
    /** 字幕 */
    subtitle_conf: CloudConf;
    /** 播放速度 */
    playback_rate_conf: CloudConf;
    /** 定时停止播放 */
    time_up_conf: CloudConf;
    /** 播放方式 */
    playback_mode_conf: CloudConf;
    /** 画面尺寸 */
    scale_mode_conf: CloudConf;
    /** 顶 */
    like_conf: CloudConf;
    /** 踩 */
    dislike_conf: CloudConf;
    /** 投币 */
    coin_conf: CloudConf;
    /** 充电 */
    elec_conf: CloudConf;
    /** 分享 */
    share_conf: CloudConf;
    /** 截图/gif */
    screen_shot_conf: CloudConf;
    /** 锁屏 */
    lock_screen_conf: CloudConf;
    /** 相关推荐 */
    recommend_conf: CloudConf;
    /** 倍速 */
    playback_speed_conf: CloudConf;
    /** 清晰度 */
    definition_conf: CloudConf;
    /** 选集 */
    selections_conf: CloudConf;
    /** 下一集 */
    next_conf: CloudConf;
    /** 编辑弹幕 */
    edit_dm_conf: CloudConf;
    /** 小窗 */
    small_window_conf: CloudConf;
    /** 播放震动 */
    shake_conf: CloudConf;
    /** 外层面板弹幕设置（实验组1） */
    outer_dm_conf: CloudConf;
    /** 三点内弹幕设置（实验组2） */
    inner_dm_conf: CloudConf;
    /** 全景 */
    panorama_conf: CloudConf;
    /** 杜比 */
    dolby_conf: CloudConf;
}
/** 播放三点配置信息-稿件维度 */
interface PlayArcConf {
    /** 后台播放 */
    background_play_conf: ArcConf;
    /** 镜像反转 */
    flip_conf: ArcConf;
    /** 视频的是否支持投屏 */
    cast_conf: ArcConf;
    /** 反馈 */
    feedback_conf: ArcConf;
    /** 字幕 */
    subtitle_conf: ArcConf;
    /** 播放速度 */
    playback_rate_conf: ArcConf;
    /** 定时停止播放 */
    time_up_conf: ArcConf;
    /** 播放方式 */
    playback_mode_conf: ArcConf;
    /** 画面尺寸 */
    scale_mode_conf: ArcConf;
    /** 顶 */
    like_conf: ArcConf;
    /** 踩 */
    dislike_conf: ArcConf;
    /** 投币 */
    coin_conf: ArcConf;
    /** 充电 */
    elec_conf: ArcConf;
    /** 分享 */
    share_conf: ArcConf;
    /** 截图/gif */
    screen_shot_conf: ArcConf;
    /** 锁屏 */
    lock_screen_conf: ArcConf;
    /** 相关推荐 */
    recommend_conf: ArcConf;
    /** 倍速 */
    playback_speed_conf: ArcConf;
    /** 清晰度 */
    definition_conf: ArcConf;
    /** 选集 */
    selections_conf: ArcConf;
    /** 下一集 */
    next_conf: ArcConf;
    /** 编辑弹幕 */
    edit_dm_conf: ArcConf;
    /** 小窗 */
    small_window_conf: ArcConf;
    /** 播放震动 */
    shake_conf: ArcConf;
    /** 外层面板弹幕设置（实验组1 */
    outer_dm_conf: ArcConf;
    /** 三点内弹幕设置（实验组2） */
    inner_dm_conf: ArcConf;
    /** 全景 */
    panorama_conf: ArcConf;
    /** 杜比 */
    dolby_conf: ArcConf;
}
/** 播放地址返回结果 */
interface VideoInfo {
    /** 视频的清晰度 */
    quality: number;
    /** 视频的格式 */
    format: string;
    /** 视频的总时长, 单位为ms */
    timelength: number;
    /** 视频的编码号 */
    video_codecid: number;
    /** 流信息 */
    stream_list: Stream[];
    /** aduio */
    dash_audio: DashItem;
    /** dolby */
    dolby: DolbyItem;
}
interface PlayAbilityConf { }
/** 视频的拥有的清晰度描述的列表 */
interface Stream {
    stream_info: StreamInfo;
    content: {
        /** DASH视频的MPD格式文件,有dash则没durl字段 */
        dash_video: DashVideo;
        /** 视频播放url的列表，有durl则没dash字段 */
        segment_video: SegmentVideo;
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
    err_code: PlayErr;
    /** 不满足播放条件时的提示文案 */
    limit: StreamLimit;
    need_vip: boolean;
    need_login: boolean;
    /** 是否是完整的 */
    intact: boolean;
    /** 表示cid是否非全二压，true表示非全二压 */
    no_rexcode: boolean;
    /** 清晰度属性位（每位为1表示不同属性，第0位为1->是HDR） */
    attribute: number;
    /** 新描述（6.9版本开始使用） */
    new_description: string;
    /** 选中态的清晰度描述 */
    display_desc: string;
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
    base_url: string;
    /** dash的backup url地址 */
    backup_url: string[];
    /** dash的信息 */
    bandwidth: number;
    /** dash的信息 */
    codecid: number;
    /** 视频分片的md5,只有dash离线下载才有值 */
    md5: string;
    /** 视频分片的大小, 单位Byte,只有dash离线下载才有值 */
    size: number;
    /** dash视频信息id,default id */
    audio_id: number;
    /** 表示cid是否非全二压，true表示非全二压 */
    no_rexcode: boolean;
}
interface PlayConfEditReply { }
/** 编辑控制面板 */
interface PlayConfEditReq {
    play_conf: PlayConfState[];
}
interface PlayConfState {
    /** 云控类型 */
    conf_type: ConfType;
    /** true:展示 false:隐藏 */
    show: boolean;
    /** 云控value */
    field_value: FieldValue;
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
    conf_type: ConfType;
    field_value: FieldValue;
}
interface FieldValue {
    value: {
        switch: boolean;
    }
}
/** 稿件维度 */
interface ArcConf {
    /** 是否可用 */
    is_support: boolean;
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
enum CodeType {
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