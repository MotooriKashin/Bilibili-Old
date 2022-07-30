import linechart from "../../images/svg/linechart.svg";
import blind from "../../images/svg/blind.svg";
import warn from "../../images/svg/warn.svg";
import { showAlert } from "../element/alert";
import { toast } from "../toast/toast";
import { settingMG } from "./manage.js";
import { aria2 } from "../download/aria2";
import { AccessKey } from "./access_key";
import { UPOS } from "../player/upos_replace";
import DEFAULT_SETTING from "./setting.json";
import { MenuName } from "./menu";
import { HTMLInputAttribudeMap } from "../element/input_area/input_area";
import { sessionStorage } from "../storage";

interface SettingList {
    /** 主键 */
    key: keyof typeof DEFAULT_SETTING;
    /** 设置项类型 */
    type: "list";
    /** 所属菜单 */
    menu: keyof MenuName;
    /** 设置列表 */
    list: (SettingL[keyof SettingL])[];
    /** 组合名称 */
    name: string;
}
interface SettingO {
    /** 名称 */
    label: string;
    /** 图标 */
    svg?: string;
    /** 副标题 */
    sub?: string;
    /** 浮动信息 */
    float?: string;
}
/** 通用设置内容，用于继承 */
interface SettingConfig extends SettingO {
    /** 主键 */
    key: keyof typeof DEFAULT_SETTING;
    /** 所属菜单 */
    menu: keyof MenuName;

}
interface SettingN extends SettingO {
    /** 主键 */
    key: string;
}
/** 设置项配置 */
interface Setting {
    /** 开关 */
    switch: SettingConfig & {
        /** 设置项类型 */
        type: "switch";
        /** 默认值 */
        value: boolean;
        callback?: (v: boolean) => void
    };
    /** 复选 */
    checkbox: SettingConfig & {
        /** 设置项类型 */
        type: "checkbox";
        /** 默认值 */
        value: string[];
        /** 候选值 */
        candidate: string[];
        callback?: (v: boolean) => void
    };
    /** 按钮 */
    button: SettingConfig & {
        /** 设置项类型 */
        type: "button";
        /** 点击回调 */
        func: () => void;
        /** 按钮标题 */
        button?: string;
    };
    /** 单选 */
    select: SettingConfig & {
        /** 设置项类型 */
        type: "select";
        /** 默认值 */
        value: string;
        /** 候选值 */
        candidate: string[];
        /** 候选值对应的样式 */
        styles?: Record<string, string>
        callback?: (v: string) => void
    };
    /** 滑动条 */
    slider: SettingConfig & {
        /** 设置项类型 */
        type: "slider";
        /** 默认值 ∈ [min, max] */
        value: number;
        /** 最小值 默认0 */
        min?: number;
        /** 最大值 默认100 */
        max?: number;
        /** 刻度数 默认100 */
        precision?: number;
        /** 变动时显示当前值 默认真 */
        hint?: boolean;
        callback?: (v: number) => void
    };
    /** 输入框 */
    input: SettingConfig & {
        /** 设置项类型 */
        type: "input";
        /** 默认值 */
        value?: string;
        /** 候选值 可作为提示 */
        candidate?: string[];
        /** 输入框（HTMLInputElement）属性 */
        props?: HTMLInputAttribudeMap;
        change?: (v: string | FileList) => void
    };
}
interface SettingL {
    /** 开关 */
    switch: SettingN & {
        /** 设置项类型 */
        type: "switch";
        /** 默认值 */
        value: boolean
        callback?: (v: boolean) => void
    };
    /** 复选 */
    checkbox: SettingN & {
        /** 设置项类型 */
        type: "checkbox";
        /** 默认值 */
        value: string[];
        /** 候选值 */
        candidate: string[];
        callback?: (v: boolean) => void
    };
    /** 按钮 */
    button: SettingN & {
        /** 设置项类型 */
        type: "button";
        /** 点击回调 */
        func: () => void;
        /** 按钮标题 */
        button?: string;
    };
    /** 单选 */
    select: SettingN & {
        /** 设置项类型 */
        type: "select";
        /** 默认值 */
        value: string;
        /** 候选值 */
        candidate: string[];
        /** 候选值对应的样式 */
        styles?: Record<string, string>;
        callback?: (v: string) => void;
    };
    /** 滑动条 */
    slider: SettingN & {
        /** 设置项类型 */
        type: "slider";
        /** 默认值 ∈ [min, max] */
        value: number;
        /** 最小值 默认0 */
        min?: number;
        /** 最大值 默认100 */
        max?: number;
        /** 刻度数 默认100 */
        precision?: number;
        /** 变动时显示当前值 默认真 */
        hint?: boolean;
        callback?: (v: number) => void
    };
    /** 输入框 */
    input: SettingN & {
        /** 设置项类型 */
        type: "input";
        /** 默认值 */
        value?: string;
        /** 候选值 可作为提示 */
        candidate?: string[];
        /** 输入框（HTMLInputElement）属性 */
        props?: HTMLInputAttribudeMap;
        change?: (v: string | FileList) => void
    };
}

const upos = Object.keys(UPOS);

/** 【后台脚本】跳转到设置 */
export function showSetting(str: string) {
    window.postMessage({
        $type: "showSetting",
        data: str
    })
}

/** 【后台脚本】设置数据配置 请将默认数导出一份到./include/setting.json供背景脚本使用 */
export const settingDefault: (Setting[keyof Setting] | SettingList)[] = [
    {
        key: "development",
        menu: "common",
        label: "开发者模式",
        svg: warn,
        sub: "暴露调试接口到控制台",
        type: "switch",
        value: false
    },
    {
        key: "logReport",
        menu: "common",
        label: "日志拦截",
        svg: linechart,
        sub: "拦截B站日志上报",
        float: "网页端日志采集太频繁，稍微动下鼠标都要发送数条日志请求，给调试工作带来额外的困扰，所以一股脑都屏蔽了干净。<br>ps：APP端其实日志更多，只能说眼不见为净吧~",
        type: "switch",
        value: false
    },
    {
        key: "toast",
        menu: "common",
        type: "list",
        name: "toastr",
        list: [
            {
                key: "status",
                type: "switch",
                label: "开关",
                value: true,
                sub: '感谢 <a href="https://github.com/CodeSeven/toastr" target="_blank">toastr</a> 提供支持！'
            },
            {
                key: "rtl",
                type: "switch",
                label: "镜像",
                sub: "左右翻转",
                value: false
            },
            {
                key: "position",
                type: "select",
                label: "位置",
                value: "top-right",
                sub: "四角",
                candidate: ["top-right", "top-left", "bottom-right", "bottom-left"]
            },
            {
                key: "delay",
                type: "slider",
                label: "时长",
                sub: "单位：/秒",
                value: 4,
                min: 1,
                max: 60,
                precision: 59
            },
            {
                key: "type",
                type: "select",
                label: "类型",
                sub: "测试限定",
                value: "warning",
                candidate: ["info", "success", "warning", "error"],
                styles: {
                    info: "color: #2F96B4",
                    success: "color: #51A351",
                    warning: "color: #F89406",
                    error: "color: #BD362F"
                }
            },
            {
                key: "test",
                type: "input",
                label: "测试",
                sub: '请输入一句话~',
                candidate: ["Hello World!"],
                change: (v: string | FileList) => {
                    const setting = sessionStorage.getItem("setting");
                    setting.toast && toast[<"info">setting.toast.type](v);
                }
            }
        ]
    },
    {
        key: "av",
        menu: "rewrite",
        label: "av/BV",
        type: "switch",
        value: true,
        sub: '旧版一般视频播放页面'
    },
    {
        key: "videoLimit",
        menu: "player",
        type: "list",
        name: "解除区域/APP限制",
        list: [
            {
                key: "switch",
                type: "switch",
                label: "开关",
                value: false
            },
            {
                key: "server",
                type: "select",
                label: "服务器类型",
                sub: `<a href="https://github.com/yujincheng08/BiliRoaming/wiki/%E5%85%AC%E5%85%B1%E8%A7%A3%E6%9E%90%E6%9C%8D%E5%8A%A1%E5%99%A8" target="_blank">公共反代服务器</a>`,
                value: "内置",
                candidate: ["内置", "自定义"],
                float: `如果选择自定义则需要填写下面的代理服务器，并且转到【账户授权】进行第三方服务器授权。内置服务器则支持以游客身份获取数据，但只能获取flv格式，且大会员画质还是需要授权。<br>※ 内置服务器不支持泰区。`,
                callback: (v: string) => {
                    if (v === "自定义") {
                        const setting = sessionStorage.getItem("setting");
                        if (!setting.accessKey.key) {
                            showAlert("自定义服务器一般都要求您授权登录才能使用，是否前往【账户授权】设置？", undefined, [
                                {
                                    name: "是",
                                    callback: () => {
                                        showSetting("accessKey")
                                    }
                                },
                                {
                                    name: "否",
                                    callback: () => { }
                                }
                            ])
                        }
                    }
                }
            },
            {
                key: "cn",
                type: "input",
                label: "大陆",
                sub: "大陆反代",
                props: { type: "url", placeholder: "www.example.com" },
                float: '海外用户用来观看大陆限定视频的代理服务器。<br>※ <strong>启用【账户授权】意味着该服务器能获取您的部分账户权限，请自行确认服务器可靠性！</strong>'
            },
            {
                key: "hk",
                type: "input",
                label: "香港",
                sub: "香港反代",
                props: { type: "url", placeholder: "www.example.com" },
                float: '香港以外的用户用来观看香港澳门限定视频的代理服务器。<br>※ <strong>启用【账户授权】意味着该服务器能获取您的部分账户权限，请自行确认服务器可靠性！</strong>'
            }
            ,
            {
                key: "tw",
                type: "input",
                label: "台湾",
                sub: "台湾反代",
                props: { type: "url", placeholder: "www.example.com" },
                float: '台湾以外的用户用来观看台湾限定视频的代理服务器。<br>※ <strong>启用【账户授权】意味着该服务器能获取您的部分账户权限，请自行确认服务器可靠性！</strong>'
            }
            ,
            {
                key: "th",
                type: "input",
                label: "泰国",
                sub: "泰国（东南亚）反代",
                props: { type: "url", placeholder: "www.example.com" },
                float: '用来观看泰国（东南亚）限定视频的代理服务器。<br>※ <strong>启用【账户授权】意味着该服务器能获取您的部分账户权限，请自行确认服务器可靠性！</strong>'
            }
        ]
    },
    {
        key: "uposReplace",
        menu: "player",
        type: "list",
        name: "替换UPOS服务器",
        list: [
            {
                key: "nor",
                type: "select",
                label: "一般视频",
                sub: "不推荐",
                value: "不替换",
                float: `对于一般视频应该充分相信B站分配给你的视频服务器就是最合适的，所以一般不推荐主动替换。`,
                candidate: ["不替换"].concat(upos)
            },
            {
                key: "gat",
                type: "select",
                label: "代理：港澳台或大陆",
                sub: "看情况",
                value: "不替换",
                float: `解除港澳台限制获取到的视频服务器必定是海外的Akamai，在一些大陆网络中可能体验并不好，可以看情况指定其他服务器。港澳台（及海外）网络访问大陆服务器同理。<br>※ 替换后若出问题请禁用替换或者前往Github反馈。`,
                candidate: ["不替换"].concat(upos)
            },
            {
                key: "th",
                type: "select",
                label: "代理：泰区",
                sub: "必选",
                value: "ks3（金山）",
                float: `泰区视频返回的服务器ban了大陆IP，所以必须进行替换！请根据自身网络情况选择。<br>※ 替换后若出问题前往Github反馈。`,
                candidate: upos
            },
            {
                key: "dl",
                type: "select",
                label: "下载",
                sub: "不推荐",
                value: "不替换",
                float: `替换下载功能获取到的视频服务器，对于播放器已获取到的视频源，已经在上面的选项中处理过了。剩下的跟一般视频同理，不推荐替换。<br>※ 注意有【referer】【UserAgent】限制视频源，请在下载面板将【referer】置空，【UserAgent】设为有效值（默认值肯定有效！）`,
                candidate: ["不替换"].concat(upos)
            }
        ]
    },
    {
        key: "protobufDanmaku",
        menu: "danmaku",
        label: "启用新版弹幕",
        sub: "protobuf",
        type: "switch",
        value: true,
        float: `为旧版播放器添加proto弹幕支持。由于旧版xml弹幕已获取不到90分钟后的弹幕，本功能不建议禁用。`
    },
    {
        key: "section",
        menu: "style",
        label: "统一换回旧版顶栏",
        sub: "针对未重构的页面",
        type: "switch",
        value: true,
        float: '非重构页面顶栏底栏也替换为旧版。'
    },
    {
        key: "danmakuHashId",
        menu: "danmaku",
        label: "反查弹幕发送者",
        sub: "结果仅供参考！",
        type: "switch",
        value: false,
        float: '旧版播放器上右键弹幕将显示弹幕发送者。</br>※ 使用哈希逆向算法，存在碰撞可能性，所示信息仅供参考，或者干脆查不出来。'
    },
    {
        key: "flash",
        menu: "player",
        label: "flash播放器",
        sub: "可用于临时不加载视频进入视频页面",
        float: "临时启用flash播放器以拦截播放器载入，如需下载视频可切换到“下载”标签呼出下载面板，恢复播放器请点击HTML5按钮或在设置中关闭本功能。",
        type: "switch",
        value: false
    },
    {
        key: "enlike",
        menu: "player",
        label: "添加点赞功能",
        sub: "自制、简陋",
        type: "switch",
        value: false,
        float: "旧版播放器的时代点赞功能还未存在，本扩展代为设计了个丑丑的点赞功能。注意对于bangumi，点赞数据计算的是单P的。"
    },
    {
        key: "upList",
        menu: "style",
        label: "UP主列表",
        sub: "展示合作者",
        type: "switch",
        value: false
    },
    {
        key: "commandDm",
        menu: "danmaku",
        label: "添加互动弹幕",
        sub: "投票弹窗等",
        type: "switch",
        value: false,
        float: `可以使用新版的一些弹窗互动组件。目前可用组件：评分弹窗、投屏弹窗、关联视频跳转按钮、带“UP主”标识弹幕。</br>※ <strong>需要同时开启新版proto弹幕。</strong>`
    },
    {
        key: "bangumi",
        menu: "rewrite",
        label: "bangumi",
        sub: "旧版Bangumi页面",
        type: "switch",
        value: true
    },
    {
        type: "switch",
        key: "watchlater",
        label: "稍后再看",
        value: true,
        menu: "rewrite",
        sub: '旧版稍后再看页面'
    },
    {
        type: "switch",
        key: "player",
        label: "嵌入",
        value: true,
        menu: "rewrite",
        sub: '旧版嵌入式播放器'
    },
    {
        type: "switch",
        key: "index",
        label: "主页",
        value: true,
        menu: "rewrite",
        sub: '旧版主页'
    },
    {
        type: "switch",
        key: "ranking",
        label: "排行榜",
        value: true,
        menu: "rewrite",
        sub: "旧版全站排行榜"
    },
    {
        type: "switch",
        key: "read",
        label: "专栏",
        value: true,
        menu: "rewrite",
        sub: "旧版专栏页面"
    },
    {
        key: "playlist",
        menu: "rewrite",
        label: "medialist",
        sub: "旧版播单相关页面",
        type: "switch",
        value: true,
        float: "使用旧版播单页面重构medialist相关页面，初始状态视频数据为20，可以滚送到播单底部以动态加载更多。另外由于播单已被官方禁用，您无法对播单进行收藏等操作，也不能访问播单详情页面。"
    },
    {
        key: "automate",
        menu: "player",
        type: "list",
        name: "自动化操作",
        list: [
            {
                key: "danmakuFirst",
                label: "自动展开弹幕列表",
                float: "自动从推荐视频切换到播放弹幕列表。",
                type: "switch",
                value: false
            },
            {
                key: "showBofqi",
                label: "自动滚动到播放器",
                type: "switch",
                value: false
            },
            {
                key: "screenWide",
                label: "自动宽屏",
                type: "switch",
                value: false,
                callback: (v: any) => {
                    if (v) {
                        const setting = sessionStorage.getItem("setting");
                        setting.automate.webFullScreen = false
                        chrome.storage.local.set({ setting });
                    }
                }
            },
            {
                key: "noDanmaku",
                label: "自动关弹幕",
                type: "switch",
                value: false
            },
            {
                key: "autoPlay",
                label: "自动播放",
                type: "switch",
                value: false
            },
            {
                key: "webFullScreen",
                label: "自动网页全屏",
                type: "switch",
                value: false,
                callback: (v: any) => {
                    if (v) {
                        const setting = sessionStorage.getItem("setting");
                        setting.automate.screenWide = false
                        chrome.storage.local.set({ setting });
                    }
                }
            },
            {
                key: "videospeed",
                label: "记忆播放速率",
                type: "switch",
                value: false
            },
            {
                key: "electric",
                label: "跳过充电鸣谢",
                type: "switch",
                value: false
            }
        ]
    },
    {
        key: "heartbeat",
        menu: "restore",
        label: "修复视频心跳",
        sub: "出现不记录播放历史症状时的选择",
        float: "尝试修复可能被广告拦截扩展误伤的视频心跳。",
        type: "switch",
        value: false
    },
    {
        key: "bangumiEplist",
        menu: "player",
        label: "保留番剧回目列表",
        sub: "牺牲特殊背景图",
        type: "switch",
        value: false,
        float: '部分带特殊背景图片的番剧会隐藏播放器下方的番剧回目列表，二者不可得兼，只能选一。'
    },
    {
        type: "switch",
        key: "history",
        label: "只显示视频历史",
        sub: "去除专栏、直播记录",
        value: false,
        menu: "style"
    },
    {
        type: "switch",
        key: "searchHistory",
        label: "去除历史记录页面搜索框",
        sub: "其实留着也没什么",
        value: false,
        menu: "style"
    },
    {
        type: "switch",
        key: "liveP2p",
        label: "禁止P2P上传",
        sub: "小水管禁不起别人白嫖！",
        value: true,
        menu: "live",
        float: "禁止直播间使用WebRTC进行P2P共享上传，以免暴露ip地址，并为小水管节约带宽。"
    },
    {
        type: "switch",
        key: "sleepCheck",
        label: "禁止挂机检测",
        sub: "就喜欢挂后台听个响不行吗！",
        value: true,
        menu: "live",
        float: "禁止直播间5分钟不操作判定挂机并切断直播，可以放心挂后台听个响。"
    },
    {
        type: "switch",
        key: "album",
        label: "还原个人空间相簿链接",
        sub: "相簿也是时泪啊",
        value: false,
        menu: "restore",
        float: '将个人空间的相簿链接从动态重定向回原来的相簿。'
    },
    {
        type: "switch",
        key: "jointime",
        label: "显示账号注册时间",
        sub: "历史不该被隐藏",
        value: false,
        menu: "restore",
        float: '在空间显示对应账号的注册时间。'
    },
    {
        key: "lostVideo",
        menu: "restore",
        label: "修复失效视频信息",
        sub: `有些甚至评论还在！`,
        type: "switch",
        value: false,
        float: '使用第三方数据修复收藏、频道等处的失效视频信息。（以红色删除线标记）</br>访问失效视频链接时将尝试重建av页面。'
    },
    {
        type: "select",
        menu: "player",
        key: "codecType",
        label: "视频编码",
        sub: "AVC、HEVC或AV1",
        value: "AVC",
        candidate: ["AVC", "HEVC", "AV1"],
        float: '指定播放器优先加载的视频编码格式，可根据设备解码能力与实际需要调整这个设置项。<br>※ AVC：兼容性最好，文件体积较大<br>※ AV1：兼容性次之，文件体积较小<br>※ HEVC：兼容性最差，文件体积较小<br>压制效果要分视频讨论，在AVC大幅降低码率的今天，AV1或许可能是画质最好的选择，但一般都只能软解（考验硬件水平以及比硬解费电）。HEVC则除了Safari用户外不推荐考虑，令微软、谷歌都抛弃的版权流氓！',
        callback: (v: any) => {
            let mime = {
                "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
                "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"',
                "AVC": 'video/mp4;codecs="avc1.640028"'
            };
            if (!MediaSource.isTypeSupported(mime[<keyof typeof mime>v])) {
                toast.warning(`播放器不支持${v}编码格式`, "将继续使用AVC编码");
                const setting = sessionStorage.getItem("setting");
                setting.codecType = "AVC";
                chrome.storage.local.set({ setting });
            }
        }
    },
    {
        key: "collection",
        menu: "rewrite",
        label: "合集",
        sub: "以分P形式呈现",
        type: "switch",
        value: true
    },
    {
        key: "search",
        menu: "rewrite",
        label: "搜索",
        sub: '旧版搜索页面',
        type: "switch",
        value: true
    },
    {
        key: "liveRecord",
        menu: "live",
        label: "直播回放",
        sub: "过滤动态中的直播回放",
        type: "switch",
        value: false
    },
    {
        key: "closedCaption",
        menu: "player",
        label: "CC字幕",
        sub: '移植自<a href="https://greasyfork.org/scripts/378513" target="_blank">Bilibili CC字幕工具</a>',
        type: "switch",
        value: true,
        float: '没有简体中文时将提供一个繁体到简体的硬翻译，不考虑使用习惯等情况的那种。'
    },
    {
        key: "segProgress",
        menu: "player",
        label: "分段进度条",
        sub: "视频看点",
        type: "switch",
        value: false
    },
    {
        key: "videoDisableAA",
        menu: "player",
        label: "禁用视频渲染抗锯齿",
        sub: '详见<a href="https://github.com/MotooriKashin/Bilibili-Old/issues/292" target="_blank">#292</a>说明',
        type: "switch",
        value: false,
        float: `听说chrome渲染视频，在视频像素跟屏幕像素不是1:1对应的情况下，使用的抗锯齿算法会导致画面模糊，而且可能还会产生色差。屏幕分辨率与视频分辨率差别越大越明显。本选项用来提供一个【锯齿】【模糊】二选一的选项，请根据自身观感决定启用与否。`
    },
    {
        key: "comment",
        menu: "style",
        label: "翻页评论区",
        sub: "非重写页面",
        type: "switch",
        value: false
    },
    {
        key: "commentLinkDetail",
        menu: "style",
        label: "还原评论中的超链接",
        sub: "av、ss或ep",
        type: "switch",
        value: false
    },
    {
        key: <any>"configManage",
        menu: "common",
        type: "button",
        label: "设置数据",
        sub: "备份/还原",
        svg: blind,
        func: () => {
            showAlert("设置数据包含您个人对于设置的自定义调整，您可以选择恢复默认数据、导出为本地文件或者从本地文件中恢复。", "设置数据", [
                { name: "默认", callback: settingMG.restore },
                { name: "导出", callback: settingMG.output },
                { name: "导入", callback: settingMG.input },
            ]);
        },
        button: "管理"
    },
    {
        key: "downlaodType",
        menu: "download",
        type: "checkbox",
        label: "类型",
        sub: "请求的文件类型",
        float: '请求的文件类型，实际显示取决于服务器是否提供了该类型的文件。而播放器已载入的文件将直接推送到下载面板，无论这里是否勾选了对应类型。换言之：这里决定的是发送请求的类型而不是实际获取到的类型。各类型简介如下：<br>※ mp4：后缀名.mp4，无需任何后续操作的最适合的下载类型，但是画质选择极少，一般最高不超过1080P，如果画质类型为【预览】则说明是付费视频的预览片段，下载意义不大。<br>※ DASH：新型浏览体解决方案，可以看成是把一个mp4文件拆开成一个只有画面的文件和一个只有声音的文件，提供的后缀名都是.m4s，为了方便可以将画面文件修改为.m4v，声音文件修改为.m4a。这种类型下载一个画面文件+一个声音文件，然后用ffmmpeg等工具混流为一个完整视频文件，在下载面板中声音文件显示为【aac】，画面文件则可能有可能存在【avc】【hev】【av1】三种，代表了画面的编码算法，任选其一即可。一般而言在乎画质选【hev】（部分画质如【杜比视界】似乎只以这种格式提供），在乎兼容性【avc】（毕竟mp4默认编码），【av1】则是新型编码标准，12代CPU或30系显卡以外的PC硬件都不支持硬解（不过还可以软解，效果看CPU算力），属于“站未来”的类型。<br>※ flv：flash时代（已落幕）的流媒体遗存，后缀名.flv，本是媲美mp4的格式，如果一个文件没有分成多个片段的话，如果下载面板只有一个片段，那么祝贺本视频没有遭遇到“分尸”，下载后无需后续操作，直接当成mp4文件即可，如果有多个片段，则需全部下载后用ffmpeg等工具拼接起来（与DASH分别代表了两种切片类型，一个是音视频分流，一个是时间轴分段），段数大于2还不如改下载DASH，DASH只要下载2个文件而且还有专属画质。',
        value: ["mp4"],
        candidate: ["mp4", "flv", "DASH"]
    },
    {
        key: "TVresource",
        menu: "download",
        type: "switch",
        label: "获取TV源",
        sub: "可能无水印",
        float: `B站TV端视频源一般都没有水印，因为会员和主站不互通，如非tv大会员将获取不到专属画质。<strong>获取到的下载源将不支持【默认】下载方式</strong>`,
        value: false,
        callback: (v: any) => {
            const setting = sessionStorage.getItem("setting");
            if (v) {
                setting.referer = "";
                toast.warning("您选择获取TV源，已经referer设置置空~", "注意：TV源无法使用默认方式下载");
            } else {
                setting.referer = "https://www.bilibili.com";
                toast.warning("您放弃获取TV源，已经referer设置为默认值");
            }
            chrome.storage.local.set({ setting })
        }
    },
    {
        key: "downloadQn",
        menu: "download",
        type: "select",
        label: "画质参数",
        sub: "flv限定",
        float: `以数字代表的画质参数，因为mp4不能选择画质而DASH默认提供所有画质，所以只对flv格式有效。一般无脑选最高即可，不存在或者权限不足时会主动向下降级，目前最高画质是127（8K）。`,
        value: "127",
        candidate: ["0", "15", "16", "32", "48", "64", "74", "80", "112", "116", "120", "125", "126", "127"]
    },
    {
        key: "downloadOther",
        menu: "download",
        type: "switch",
        label: "其他下载",
        sub: "提供弹幕、字幕等的下载",
        value: false
    },
    {
        key: "danmakuSaveType",
        menu: "danmaku",
        type: "select",
        label: "弹幕格式",
        sub: "下载",
        value: "xml",
        candidate: ["xml", "json"]
    },
    {
        key: "danmakuContact",
        menu: "danmaku",
        type: "switch",
        label: "合并已有弹幕",
        sub: "载入本地文件或者在线弹幕时",
        value: false
    },
    {
        key: "allDanmaku",
        menu: "danmaku",
        type: "slider",
        label: "全弹幕装填冷却时间",
        sub: "单位：/s",
        value: 3,
        min: 1,
        max: 30,
        precision: 29
    },
    {
        key: "downloadMethod",
        menu: "download",
        type: "select",
        label: "下载方式",
        value: "默认",
        candidate: ["默认", "IDM+ef2", "aria2", "aria2+rpc"],
        callback: (v: any) => {
            switch (v) {
                case "IDM+ef2": showAlert(
                    'IDM（Internet Download Manager）是Windows端著名的的下载工具，通过作者的另一款名为<a href="https://github.com/MotooriKashin/ef2" target="_blank">ef2</a>辅助工具，本扩展支持直接从浏览器拉起IDM下载文件。<br>是否确定使用本方式？',
                    "下载方式",
                    [
                        {
                            name: "确定",
                            callback: () => { showSetting("IDM") }
                        },
                        {
                            name: "取消",
                            callback: () => {
                                const setting = sessionStorage.getItem("setting");
                                setting.downloadMethod = "默认";
                                chrome.storage.local.set({ setting });
                            }
                        }
                    ]
                )
                    break;
                case "aria2": showAlert(
                    'aria2是全平台著名的命令行下载工具，本方式将复制下载命令到剪切板以方便使用aria2进行下载，<br>是否确定使用本方式下载？',
                    "下载方式",
                    [
                        {
                            name: "确定",
                            callback: () => { showSetting("aria2") }
                        },
                        {
                            name: "取消",
                            callback: () => {
                                const setting = sessionStorage.getItem("setting");
                                setting.downloadMethod = "默认";
                                chrome.storage.local.set({ setting })
                            }
                        }
                    ]
                )
                    break;
                case "aria2+rpc": showAlert(
                    'aria2支持rpc模式，从浏览器端直接发送下载命令，第一次使用须要到下面配置rpc设置，是否使用本方式进行下载？',
                    "下载方式",
                    [
                        {
                            name: "确定",
                            callback: () => { showSetting("aria2") }
                        },
                        {
                            name: "取消",
                            callback: () => {
                                const setting = sessionStorage.getItem("setting");
                                setting.downloadMethod = "默认";
                                chrome.storage.local.set({ setting });
                            }
                        }
                    ]
                )
                    break;
            }
        },
        float: '默认下载方式请不要直接左键点击，右键另存为是更正确合理的操作。'
    },
    {
        key: "userAgent",
        menu: "download",
        type: "input",
        label: "User-Agent",
        sub: '高级设置',
        float: 'B站视频一般都需要有效User-Agent，否则会403。（默认下载方式以外才有意义。）<br>※ <strong>本项会同时影响替换UPOS服务器后能否播放，默认值才是经检验的最合适的值！</strong>',
        value: "Bilibili Freedoooooom/MarkII",
        candidate: ["Bilibili Freedoooooom/MarkII"]
    },
    {
        key: "referer",
        menu: "download",
        type: "input",
        label: "referer",
        sub: "高级设置",
        float: 'B站视频一般填主站域名即可，其他会403。<strong>TV源/泰区视频必须置空！港澳台替换UPOS服务器后也可能需要置空。</strong>（默认下载方式以外才有意义。）',
        value: "https://www.bilibili.com",
        candidate: ["https://www.bilibili.com"]
    },
    {
        key: "filepath",
        menu: "download",
        type: "input",
        label: "下载目录",
        sub: "Windows端注意反斜杠！",
        float: '（默认下载方式以外才有意义。）'
    },
    {
        key: "aria2",
        menu: "download",
        type: "list",
        name: "aria2",
        list: [
            {
                key: "token",
                type: "input",
                label: "令牌",
                sub: "token",
                props: { type: "password" },
                float: '如果没有使用token可置空'
            },
            {
                key: "server",
                type: "input",
                label: "主机",
                sub: "url",
                props: { type: "url", placeholder: "http://localhost" },
                value: 'http://localhost'
            },
            {
                key: "port",
                type: "input",
                label: "端口",
                props: { type: "number", placeholder: "6800" },
                value: "6800"
            },
            {
                key: "test",
                type: "button",
                label: "测试RPC连接",
                button: "测试",
                func: () => {
                    const msg = toast.custom(0, "info", "正在测试RPC连接可用性~");
                    aria2.getVersion()
                        .then(d => {
                            if (msg) {
                                msg.type = "success";
                                msg.data = [`RPC设置正常！aria2版本：${d.version}`];
                                msg.delay = 3;
                            }
                            console.log(`RPC设置正常！`, d);
                        }).catch(e => {
                            if (msg) {
                                msg.type = "error";
                                msg.data = ["RPC链接不正常 ಥ_ಥ", "请检查aria2设置等再试~"];
                                msg.delay = 3;
                            }
                            console.error("RPC链接异常！请检查aria2设置等再试~", e)
                        })
                }
            }
        ]
    },
    {
        key: "animatedBanner",
        menu: "style",
        type: "switch",
        label: "动态banner",
        sub: "移植自新版顶栏",
        value: false
    },
    {
        key: "accessKey",
        menu: "common",
        type: "list",
        name: "账户授权",
        list: [
            {
                key: "key",
                type: "input",
                label: "Token",
                sub: "access_key",
                float: "网页端B站使用cookie来判断用户身份，但是移动端或者授权第三方登录，则使用一个名为access_key的参数。B站有一些只有APP/TV端才能获取的数据，启用本功能将赋予本扩展访问那些数据的能力。<strong>与【解除限制】功能一起使用时请自行确定代理服务器的安全性！</strong>",
                props: { type: "text", readonly: "readonly" }
            },
            {
                key: "date",
                type: "input",
                label: "授权日期",
                sub: "有效期不超过30天",
                float: "和cookie一样，access_key这个鉴权参数一般有有效期限，经验告诉我们一般是一个月，过期作废。因为授权是敏感操作，请自行判断是否过期并慎重考虑是否重新授权。",
                props: { type: "text", readonly: "readonly" }
            },
            {
                key: "action",
                type: "button",
                label: "账户授权",
                sub: "风险操作",
                svg: warn,
                func: () => {
                    new AccessKey();
                },
                button: "操作"
            }
        ]
    },
    {
        key: "timeline",
        menu: "style",
        type: "switch",
        label: "港澳台新番时间表",
        sub: '<a href="https://www.bilibili.com/anime/timeline/" target="_blank">立即前往</a>',
        float: `在主页番剧分区中，可能需主动从最新切换到响应的星期才会显示当天的数据。`,
        value: false
    },
    {
        key: "privateRecommend",
        menu: "style",
        type: "switch",
        label: "主页个性化推荐",
        sub: "默认是全站统一推荐",
        value: false
    },
    {
        key: "episodeData",
        menu: "style",
        type: "switch",
        label: "分集数据",
        sub: "Bangumi",
        float: `对于Bangumi，显示单集播放量和弹幕，原合计数据显示在鼠标焦点提示文本中。`,
        value: false
    },
    {
        key: "IDM",
        menu: "download",
        type: "list",
        name: "ef2",
        list: [
            {
                key: "wait",
                type: "switch",
                label: "稍后下载",
                sub: "添加到IDM下载列表",
                float: '需要手动到IDM中开始下载，注意B站下载链接有时效，请及时下载！',
                value: false
            },
            {
                key: "silence",
                type: "switch",
                label: "静默下载",
                sub: "无需二次确认",
                float: '取消IDM下载确认对话框，那里会询问是否开启下载以及文件名、保存目录等信息。',
                value: false
            }
        ]
    }
];