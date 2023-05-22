import { Toastconfig } from "./toast";
import { UiEntryType } from "./ui/entry";

/** 默认用户配置 */
export const userStatus = {
    /** 开发者模式 */
    development: true,
    /** 主页 */
    index: true,
    /** toastr */
    toast: Toastconfig,
    /** 替换全局顶栏 */
    header: true,
    /** 翻页评论区 */
    comment: true,
    /** av */
    av: true,
    /** 嵌入式播放器 */
    player: true,
    /** WebRTC */
    webRTC: false,
    /** 充电鸣谢 */
    elecShow: true,
    /** 合作UP */
    staff: false,
    /** bangumi */
    bangumi: true,
    /** 解除限制 */
    videoLimit: {
        /** 开关 */
        status: false,
        /** 服务器类型 */
        server: '内置',
        /** 东南亚（泰区）代理服务器 */
        th: 'api.global.bilibili.com',
        /** 台湾代理服务器 */
        tw: '',
        /** 香港代理服务器 */
        hk: '',
        /** 大陆代理服务器 */
        cn: ''
    },
    /** UPOS替换 */
    uposReplace: {
        /** 东南亚（泰区） */
        th: 'ks3（金山）',
        /** 港澳台 */
        gat: '不替换',
        /** 一般视频 */
        nor: '不替换',
        /** 下载 */
        download: '不替换'
    },
    /** 强制显示bangumi分p */
    bangumiEplist: false,
    /** 账户授权 */
    accessKey: {
        /** access_key */
        token: <string><unknown>undefined,
        /** 授权日期 */
        date: 0,
        /** 授权日期字符串 */
        dateStr: '',
    },
    /** 稍后再看 */
    watchlater: true,
    /** 播单 */
    playlist: true,
    /** 全站排行榜 */
    ranking: true,
    /** 专栏 */
    read: true,
    /** 搜索 */
    search: true,
    /** 相簿 */
    album: true,
    /** 注册时间 */
    jointime: false,
    /** 失效视频 */
    lostVideo: true,
    /** 纯视频历史 */
    history: true,
    /** 动态里的直播录屏 */
    liveRecord: false,
    /** 设置入口样式 */
    uiEntryType: UiEntryType,
    /** 自动化操作 */
    automate: {
        /** 展开弹幕列表 */
        danmakuFirst: false,
        /** 滚动到播放器 */
        showBofqi: false,
        /** 自动宽屏 */
        screenWide: false,
        /** 自动关弹幕 */
        noDanmaku: false,
        /** 自动播放 */
        autoPlay: false,
        /** 自动网页全屏 */
        webFullScreen: false,
        /** 记忆播放速率 */
        videospeed: false
    },
    /** 关闭抗锯齿 */
    videoDisableAA: false,
    /** 禁用直播间挂机检测 */
    disableSleepChcek: true,
    /** 禁止上报 */
    disableReport: true,
    /** 禁用评论跳转标题 */
    commentJumpUrlTitle: false,
    /** 合集 */
    ugcSection: false,
    /** 请求的文件类型 */
    downloadType: ['mp4'],
    /** 请求无水印源 */
    TVresource: false,
    /** 画质 */
    downloadQn: 127,
    /** 下载方式 */
    downloadMethod: '浏览器',
    /** User-Agent */
    userAgent: 'Bilibili Freedoooooom/MarkII',
    /** referer */
    referer: 'https://www.bilibili.com',
    /** 下载目录 */
    filepath: '',
    /** aria2 */
    aria2: {
        /** 服务器 */
        server: 'http://localhost',
        /** 端口 */
        port: 6800,
        /** 令牌 */
        token: '',
        /** 分片数目 */
        split: 4,
        /** 分片大小 */
        size: 20
    },
    ef2: {
        /** 稍后下载 */
        delay: false,
        /** 静默下载 */
        silence: false
    },
    /** 点赞功能 */
    like: false,
    /** 重构播放器脚本 */
    bilibiliplayer: true,
    /** 检查播放器脚本更新 */
    checkUpdate: true,
    /** 不登录1080P支持 */
    show1080p: false,
    /** 调整顶栏banner样式 */
    fullBannerCover: false,
    /** 原生播放器新版弹幕 */
    dmproto: true,
    /** 普权弹幕换行 */
    dmwrap: true,
    /** 弹幕格式 */
    dmExtension: 'xml',
    /** 合并已有弹幕 */
    dmContact: false,
    /** 分集数据 */
    episodeData: false,
    /** 港澳台新番时间表 */
    timeLine: false,
    /** 字幕：繁 -> 简 */
    simpleChinese: true,
    /** 资源cdn */
    cdn: 'jsdelivr',
    /** 弹幕保护计划 */
    danmakuProtect: false,
    /** 下载按钮 */
    downloadButton: false,
    /** 全区域搜索 */
    searchAllArea: false,
    /** 评论图片 */
    commentPicture: true,
    /** 分区主页 */
    home: true,
}