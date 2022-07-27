interface config {
    /** 开发者模式 */
    developer: boolean;
    /** 重构模式 */
    rebuildType: string;
    /** 重构av页 */
    av: boolean;
    /** 重构主页 */
    index: boolean;
    /** 托管原生脚本 */
    trusteeship: boolean;
    /** 重构bangumi */
    bangumi: boolean;
    /** 重构稍后再看 */
    watchlater: boolean;
    /** 重构子播放器页面 */
    player: boolean;
    /** 重构播单 */
    medialist: boolean;
    /** 重构排行榜 */
    ranking: boolean;
    /** 重构专栏 */
    read: boolean;
    /** 重构搜索 */
    search: boolean;
    /** 禁用直播p2p */
    liveP2p: boolean;
    /** 禁用直播间挂机检测 */
    sleepCheck: boolean;
    /** 修复访问受限的账号空间 */
    errands: boolean;
    /** 恢复相簿重定向 */
    album: boolean;
    /** 显示账户注册时间 */
    jointime: boolean;
    /** 修复失效视频信息 */
    lostVideo: boolean;
    /** 不让评论区超链接显示为标题 */
    commentLinkDetail: boolean;
    /** 过滤动态中的直播回放 */
    liveRecord: boolean;
    /** 历史记录只包含视频历史 */
    history: boolean;
    /** 去除历史搜索框 */
    searchHistory: boolean;
    /** 使用新版proto弹幕 */
    protobufDanmaku: boolean;
    /** 替换新版顶栏 */
    section: boolean;
    /** 翻查弹幕发送者信息 */
    danmakuHashId: boolean;
    /** 修复被误伤的视频心跳 */
    heartbeat: boolean;
    /** 解除视频播放限制 */
    videoLimit: {
        /** 是否启用 */
        switch: boolean;
        /** 代理服务器 */
        server: "内置" | "自定义",
        /** 大陆 */
        cn: string;
        /** 香港 */
        hk: string;
        /** 台湾 */
        tw: string;
        /** 泰国 */
        th: string;
    };
    /** 视频渲染抗锯齿 */
    videoDisableAA: boolean;
    /** 日志拦截 */
    logReport: boolean;
    /** 添加点赞功能 */
    enlike: boolean;
    /** 展示合作UP主 */
    upList: boolean;
    /** 互动弹幕 */
    commandDm: boolean;
    /** 保留番剧回目列表 */
    bangumiEplist: boolean;
    /** 视频合集 */
    collection: boolean;
    /** 分区主页 */
    sortIndex: boolean;
    /** 启用CC字幕 */
    closedCaption: boolean;
    /** 分段进度条 */
    segProgress: boolean;
    /** 贴边隐藏设置 */
    settingEntryType: boolean;
    /** 自动化操作 */
    automate: {
        /** 优先展示弹幕列表 */
        danmakuFirst: boolean,
        /** 自动滚动到播放器 */
        showBofqi: boolean,
        /** 自动宽屏 */
        screenWide: boolean,
        /** 自动关闭弹幕 */
        noDanmaku: boolean,
        /** 自动播放 */
        autoPlay: boolean,
        /** 自动网页全屏 */
        webFullScreen: boolean,
        /** 记忆播放速率 */
        videospeed: boolean;
        /** 跳过充电鸣谢 */
        electric: boolean;
    };
    /** 在线弹幕 */
    onlineDanmaku: {
        /** 视频url或参数 */
        url: string;
        /** 是否合并已有弹幕 */
        concat: boolean;
    };
    /** 本地弹幕 */
    localMedia: {
        /** 是否合并已有弹幕 */
        concat: boolean;
        /** 本地文件 */
        file: FileList;
    };
    /** 全弹幕装填 */
    allDanmaku: {
        /** 接口冷却时间 */
        delay: number;
    };
    /** 设置数据管理 */
    configManage: never;
    /** 默认下载类型 */
    downlaodType: string[];
    /** 立即下载 */
    downloadNow: never;
    /** 请求tv源 */
    TVresource: boolean;
    /** 请求画质参数 */
    downloadQn: string;
    /** 下载按钮 */
    downloadBtn: boolean;
    /** 其他下载 */
    downloadOther: boolean;
    /** 保存弹幕格式 */
    danmakuSaveType: "xml" | "json";
    /** 下载方式 */
    downloadMethod: "默认" | "IDM+ef2" | "aria2" | "aria2+rpc";
    /** User-Agent */
    userAgent: string;
    /** referer */
    referer: string;
    /** 保存目录 */
    filepath: string;
    /** aria2rpc */
    aria2: {
        /** 令牌 */
        token: string;
        /** 主机 */
        server: string;
        /** 端口 */
        port: string;
    };
    /** ef2 */
    IDM: {
        wait: boolean;
        silence: boolean;
    }
    /** 动态顶栏 */
    animatedBanner: boolean;
    /** 账户授权 */
    accessKey: {
        /** access_key */
        key: string,
        /** 授权日期 */
        date: string,
    };
    /** 添加港澳台新番时间表 */
    timeline: boolean;
    /** 主页个性化推荐 */
    privateRecommend: boolean;
    /** 分集数据 */
    episodeData: boolean;
    /** 替换UPOS服务器 */
    uposReplace: {
        /** 一般视频 */
        nor: "ks3（金山）" | "ks3b（金山）" | "ks3c（金山）" | "ks32（金山）" | "kodo（七牛）" | "kodob（七牛）" | "cos（腾讯）" | "cosb（腾讯）" | "coso1（腾讯）" | "coso2（腾讯）" | "bos（腾讯）" | "hw（华为）" | "hwb（华为）" | "uphw（华为）" | "js（华为）" | "hk（香港）" | "akamai（海外）" | "不替换";
        /** 港澳台+大陆代理 */
        gat: "ks3（金山）" | "ks3b（金山）" | "ks3c（金山）" | "ks32（金山）" | "kodo（七牛）" | "kodob（七牛）" | "cos（腾讯）" | "cosb（腾讯）" | "coso1（腾讯）" | "coso2（腾讯）" | "bos（腾讯）" | "hw（华为）" | "hwb（华为）" | "uphw（华为）" | "js（华为）" | "hk（香港）" | "akamai（海外）" | "不替换";
        /** 泰区代理 */
        th: "ks3（金山）" | "ks3b（金山）" | "ks3c（金山）" | "ks32（金山）" | "kodo（七牛）" | "kodob（七牛）" | "cos（腾讯）" | "cosb（腾讯）" | "coso1（腾讯）" | "coso2（腾讯）" | "bos（腾讯）" | "hw（华为）" | "hwb（华为）" | "uphw（华为）" | "js（华为）" | "hk（香港）" | "akamai（海外）";
        /** 下载 */
        dl: "ks3（金山）" | "ks3b（金山）" | "ks3c（金山）" | "ks32（金山）" | "kodo（七牛）" | "kodob（七牛）" | "cos（腾讯）" | "cosb（腾讯）" | "coso1（腾讯）" | "coso2（腾讯）" | "bos（腾讯）" | "hw（华为）" | "hwb（华为）" | "uphw（华为）" | "js（华为）" | "hk（香港）" | "akamai（海外）" | "不替换";
    };
    /** 评论ip属地 */
    commentLocation: boolean;
}
namespace API {
    const CONFIG = GM.GM_getValue<config>("config", <config>{});
    /** 计时器id */
    let timer: number;
    /** 保存设置 */
    export function saveConfig() {
        clearTimeout(timer);
        timer = setTimeout(() => GM.GM_setValue("config", JSON.parse(JSON.stringify(CONFIG))), 1e3);
    }
    export const config = new Proxy(CONFIG, {
        set: (t, p: keyof config, v) => {
            Reflect.set(t, p, v);
            saveConfig();
            return true;
        },
        get: <T extends keyof config>(t: config, p: T, r: config) => {
            const result = t[p];
            return (isArray(result) || isObject(result)) ? new Proxy(result, new ProxyHandler(saveConfig)) : result;
        }
    });
    /** upos服务器 */
    const UPOS = ['ks3（金山）', 'ks3b（金山）', 'ks3c（金山）', 'ks32（金山）', 'kodo（七牛）', 'kodob（七牛）', 'cos（腾讯）', 'cosb（腾讯）', 'coso1（腾讯）', 'coso2（腾讯）', 'bos（腾讯）', 'hw（华为）', 'hwb（华为）', 'uphw（华为）', 'js（华为）', 'hk（香港）', 'akamai（海外）'];
    registerMenu([
        { key: "common", name: "通用", svg: getModule("wrench.svg") },
        { key: "rewrite", name: "重构", svg: getModule("note.svg") },
        { key: "danmaku", name: "弹幕", svg: getModule("dmset.svg") },
        { key: "restore", name: "修复", svg: getModule("stethoscope.svg") },
        { key: "player", name: "播放", svg: getModule("play.svg") },
        { key: "style", name: "样式", svg: getModule("palette.svg") },
        { key: "live", name: "直播", svg: getModule("bioscope.svg") },
        { key: "download", name: "下载", svg: getModule("download.svg") }
    ])
    registerSetting([
        {
            key: "developer",
            menu: "common",
            label: "开发者模式",
            svg: getModule("warn.svg"),
            type: "switch",
            value: false,
            float: `暴露顶层命名空间到全局，变量名API，挂载有脚本导出的所有接口，可以在全局作用域中使用，方便进行调试等操作。`,
            sub: "暴露顶层命名空间",
            callback: v => {
                v ? (!window.API && (window.API = API)) : (window.API && Reflect.deleteProperty(window, "API"));
            }
        },
        {
            key: "settingEntryType",
            menu: "common",
            label: "贴边隐藏设置入口",
            svg: getModule("gear.svg"),
            type: "switch",
            value: false,
            sub: '右下角贴边隐藏',
            float: '原滋原味保护旧版页面，不添加、修改或删除任何元素是本脚本的终极追求。<br>开启后将贴边隐藏设置入口，页面加载完成时也不会有任何提示，需要将鼠标移动到页面右下角以上一定感应区域才会显现。<br>※ <strong>Firefox用户切莫开启！</strong>',
            callback: () => {
                showSettingEntry();
            }
        },
        {
            key: "logReport",
            menu: "common",
            label: "日志拦截",
            svg: getModule("linechart.svg"),
            sub: "拦截B站日志上报",
            float: "网页端日志采集太频繁，稍微动下鼠标都要发送数条日志请求，给调试工作带来额外的困扰，所以一股脑都屏蔽了干净。<br>ps：APP端其实日志更多，只能说眼不见为净吧~",
            type: "switch",
            value: false
        },
        {
            key: "trusteeship",
            menu: "common",
            label: "托管原生脚本",
            svg: getModule("migrate.svg"),
            sub: "代为修复和维护",
            float: '托管修复后的原生脚本，很多功能依赖此基础，如非必要请不要关闭。<br>由于jsdelivr CDN被墙，托管资源加载不正常时请临时关闭。',
            type: "switch",
            value: true,
            callback: v => {
                if (v) {
                    let isReadry = false;
                    ["bilibiliPlayer.js", "comment.js"].forEach(d => {
                        isReadry = GM.GM_getResourceText(d) ? true : false;
                    });
                    if (isReadry) {
                        toast.success("外部资源安装成功~", "可以正常【托管原生脚本】~");
                    } else {
                        toast.warning("部分资源加载失败 ಥ_ಥ", "即将关闭【托管原生脚本】功能！", "请等网络通常后再尝试开启！");
                        setTimeout(() => { config.trusteeship = false }, 1e3);
                    }
                }
            }
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
                    sub: '感谢 <a href="//github.com/CodeSeven/toastr" target="_blank">toastr</a> 提供支持！'
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
                    callback: v => {
                        toast[config.toast.type](v);
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
                    callback: v => {
                        if (v === "自定义") {
                            if (!config.accessKey.key) {
                                alert("自定义服务器一般都要求您授权登录才能使用，是否前往【账户授权】设置？", undefined, [
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
            key: "rebuildType",
            menu: "common",
            label: "页面重构模式",
            svg: getModule("vernier.svg"),
            type: "select",
            sub: "改善脚本兼容性",
            value: "重写",
            candidate: ["重定向", "重写"],
            float: `重定向：先重定向再重写页面框架，完全避免被新版页面污染，减少页面出问题的概率。<br>重写：直接重写页面，所有在本脚本之前注入的浏览器扩展和脚本都将失效！<br>※ 本脚本一直在尝试使用各种方法在优化重构页面方案同时改进兼容性，但始终没有完美的解决办法，只能说非常抱歉！`
        },
        {
            key: "enlike",
            menu: "player",
            label: "添加点赞功能",
            sub: "自制、简陋",
            type: "switch",
            value: false,
            float: "旧版播放器的时代点赞功能还未存在，本脚本代为设计了个丑丑的点赞功能。注意对于bangumi，点赞数据计算的是单P的。"
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
            key: "medialist",
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
                    callback: v => v && (config.automate.webFullScreen = false)
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
                    callback: v => v && (config.automate.screenWide = false)
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
            key: "errands",
            label: '恢复对限制UP主空间的访问',
            sub: '<a href="//space.bilibili.com/11783021" target="_blank">哔哩哔哩番剧出差</a>、<a href="//space.bilibili.com/1988098633" target="_blank">b站_DM組</a>和<a href="//space.bilibili.com/2042149112" target="_blank">b站_EN組</a>',
            value: true,
            menu: "restore",
            float: '使用备份数据修复对于港澳台官方番剧、影视剧和综艺投稿账户的访问。'
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
            callback: v => {
                let mime = {
                    "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
                    "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"',
                    "AVC": 'video/mp4;codecs="avc1.640028"'
                };
                if (!MediaSource.isTypeSupported(mime[<keyof typeof mime>v])) {
                    toast.warning(`播放器不支持${v}编码格式`, "将继续使用AVC编码");
                    config.codecType = "AVC";
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
            key: "sortIndex",
            menu: "rewrite",
            label: "分区主页",
            sub: "暂未实现，请善用B站施舍的【回到旧版】按钮",
            type: "switch",
            value: true,
            callback: v => setCookie("i-wanna-go-back", String(v ? 2 : -1))
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
            key: "onlineDanmaku",
            menu: "danmaku",
            name: "在线弹幕",
            type: "list",
            list: [
                {
                    key: "url",
                    label: "视频链接或参数",
                    type: "input",
                    float: '请提供对应视频的完整url或者能提取有效信息的参数，比如：<br>av806828803<br>av806828803?p=1<br>BV1T34y1o72w<br>ss3398<br>ep84795<br>aid=806828803<br>aid=806828803&p=1<br>avid=806828803<br>bvid=1T34y1o72w<br>bvid=BV1T34y1o72w<br>ssid=3398<br>epid=84795<br>season_id=3398<br>ep_id=84795',
                    props: { placeholder: "av806828803" }
                },
                {
                    key: "concat",
                    label: "合并已有弹幕",
                    type: "switch",
                    value: false
                },
                {
                    key: "action",
                    label: "(👉ﾟヮﾟ)👉",
                    type: "button",
                    value: async () => {
                        if (!window.player) return toast.warning("请在播放页面使用本功能 →_→");
                        if (!window.player.setDanmaku) return toast.warning("内部组件丢失！", "请检查【托管原生脚本】功能是否开启！");
                        if (!config.onlineDanmaku.url) return toast.warning("请输入视频链接或参数~");
                        toast.info(`正在解析url：${config.onlineDanmaku.url}`);
                        try {
                            const d = await urlParam(config.onlineDanmaku.url, false);
                            if (d.aid && d.cid) {
                                toast.info("参数解析成功，正在获取弹幕数据~", d);
                                debug(config.onlineDanmaku.url, d);
                                let dm = await danmaku.getSegDanmaku(d.aid, d.cid);
                                if (dm) {
                                    const dat = danmaku.danmakuFormat(dm);
                                    toast.success("获取弹幕成功~");
                                    window.player?.setDanmaku(dat, config.onlineDanmaku.concat);
                                    config.downloadOther && pushDownload({
                                        group: "弹幕",
                                        data: dat,
                                        up: "在线",
                                        down: `N/A`,
                                        callback: () => danmaku.saveDanmaku(dat, config.onlineDanmaku.url)
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

                    },
                    button: "加载"
                }
            ]
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
            key: "localMedia",
            menu: "player",
            type: "list",
            name: "播放本地文件",
            list: [
                {
                    key: "concat",
                    label: "与已有弹幕合并",
                    type: "switch",
                    value: false
                },
                {
                    key: "file",
                    label: "选择本地文件或者弹幕",
                    type: "input",
                    props: { type: "file", accept: "video/mp4,application/xml,application/json", multiple: "multiple" },
                    callback: v => {
                        new LocalMedia(<FileList>v);
                    }
                }
            ]
        },
        {
            key: "allDanmaku",
            menu: "danmaku",
            type: "list",
            name: "全弹幕装填",
            list: [
                {
                    key: "delay",
                    type: "slider",
                    label: "冷却时间",
                    value: 3,
                    min: 1,
                    max: 30,
                    precision: 29
                },
                {
                    key: "action",
                    label: "(👉ﾟヮﾟ)👉",
                    type: "button",
                    value: () => {
                        allDanmaku();
                    },
                    button: "开始",
                    float: '通过获取所有历史弹幕来实现，但每天的历史弹幕池其实有上限（远低于普通弹幕池），超出的部分是获取不到的，所以最后获取到的总数其实未必达得到【全弹幕】的要求（甚至可能不如普通弹幕池）。另外高级弹幕、代码弹幕等并不在历史弹幕池内，如果普通池内没有，想通过本功能来获取只是徒劳。'
                }
            ]
        },
        {
            key: "configManage",
            menu: "common",
            type: "button",
            label: "设置数据",
            sub: "备份/还原",
            svg: getModule("blind.svg"),
            value: () => {
                alert("设置数据包含您个人对于设置的自定义调整，您可以选择恢复默认数据、导出为本地文件或者从本地文件中恢复。", "设置数据", [
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
            callback: v => {
                if (v) {
                    config.referer = "";
                    toast.warning("您选择获取TV源，已经referer设置置空~", "注意：TV源无法使用默认方式下载");
                } else {
                    config.referer = location.origin;
                    toast.warning("您放弃获取TV源，已经referer设置为默认值");
                }
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
            key: "downloadBtn",
            menu: "download",
            type: "switch",
            label: "下载按钮",
            sub: "播放器右上角",
            value: false
        },
        {
            key: "downloadNow",
            menu: "download",
            type: "button",
            label: "下载面板",
            sub: "下载当前视频",
            value: () => {
                downloadDefault()
            },
            button: "呼出"
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
            key: "downloadMethod",
            menu: "download",
            type: "select",
            label: "下载方式",
            value: "默认",
            candidate: ["默认", "IDM+ef2", "aria2", "aria2+rpc"],
            callback: v => {
                switch (v) {
                    case "IDM+ef2": alert(
                        'IDM（Internet Download Manager）是Windows端著名的的下载工具，通过作者的另一款名为<a href="https://github.com/MotooriKashin/ef2" target="_blank">ef2</a>辅助工具，本脚本支持直接从浏览器拉起IDM下载文件。<br>是否确定使用本方式？',
                        "下载方式",
                        [
                            {
                                name: "确定",
                                callback: () => { showSetting("IDM") }
                            },
                            {
                                name: "取消",
                                callback: () => config.downloadMethod = "默认"
                            }
                        ]
                    )
                        break;
                    case "aria2": alert(
                        'aria2是全平台著名的命令行下载工具，本方式将复制下载命令到剪切板以方便使用aria2进行下载，<br>是否确定使用本方式下载？',
                        "下载方式",
                        [
                            {
                                name: "确定",
                                callback: () => { showSetting("aria2") }
                            },
                            {
                                name: "取消",
                                callback: () => config.downloadMethod = "默认"
                            }
                        ]
                    )
                        break;
                    case "aria2+rpc": alert(
                        'aria2支持rpc模式，从浏览器端直接发送下载命令，第一次使用须要到下面配置rpc设置，是否使用本方式进行下载？',
                        "下载方式",
                        [
                            {
                                name: "确定",
                                callback: () => { showSetting("aria2") }
                            },
                            {
                                name: "取消",
                                callback: () => config.downloadMethod = "默认"
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
            value: location.origin,
            candidate: [location.origin]
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
                    value: () => {
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
                    float: "网页端B站使用cookie来判断用户身份，但是移动端或者授权第三方登录，则使用一个名为access_key的参数。B站有一些只有APP/TV端才能获取的数据，启用本功能将赋予本脚本访问那些数据的能力。<strong>与【解除限制】功能一起使用时请自行确定代理服务器的安全性！</strong>",
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
                    label: config.accessKey?.key ? "撤销授权" : "授权操作",
                    float: '',
                    button: config.accessKey?.key ? "撤销" : "授权",
                    value: () => {
                        if (config.accessKey.key) {
                            alert('注销授权只是保证本脚本不再使用已授权的参数，如果第三方服务器保存有该鉴权，本脚本也无法让人家吐出来＞﹏＜。如果要真正完全销毁该鉴权，可以考虑修改密码等操作，这样会强制所有登录失效，唯一的问题是您的所有设备都必须重新登录。<br>请确认您的操作~', "撤销授权", [
                                {
                                    name: "确认撤销",
                                    callback: () => { AccessKey.remove() }
                                },
                                {
                                    name: "取消操作",
                                    callback: () => { }
                                }
                            ]);
                        } else {
                            alert('请仔细阅读上面各项说明并慎重操作，【确认授权】表示您同意本脚本能以网页端以外的鉴权向B站官方服务器证明您的身份，以执行一些本来网页端无权进行的操作。如果【解除限制】中自定义了第三方解析服务器，请仔细斟酌第三方的可信度，<strong>如无必要，切莫授权！</strong>。<br>请确认您的操作~', "撤销授权", [
                                {
                                    name: "确认授权",
                                    callback: () => {
                                        AccessKey.get();
                                    }
                                },
                                {
                                    name: "取消操作",
                                    callback: () => { }
                                }
                            ]);
                        }
                    }
                }
            ]
        },
        {
            key: "timeline",
            menu: "style",
            type: "switch",
            label: "港澳台新番时间表",
            sub: '<a href="//www.bilibili.com/anime/timeline/" target="_blank">立即前往</a>',
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
                    candidate: ["不替换"].concat(UPOS)
                },
                {
                    key: "gat",
                    type: "select",
                    label: "代理：港澳台或大陆",
                    sub: "看情况",
                    value: "不替换",
                    float: `解除港澳台限制获取到的视频服务器必定是海外的Akamai，在一些大陆网络中可能体验并不好，可以看情况指定其他服务器。港澳台（及海外）网络访问大陆服务器同理。<br>※ 替换的服务器大概率有【referer】【UserAgent】限制，脚本尝试通过GM钩子绕过，方案可能并不稳定，若出问题请禁用替换或者前往Github反馈。`,
                    candidate: ["不替换"].concat(UPOS)
                },
                {
                    key: "th",
                    type: "select",
                    label: "代理：泰区",
                    sub: "必选",
                    value: "ks3（金山）",
                    float: `泰区视频返回的服务器ban了大陆IP，所以必须进行替换！请根据自身网络情况选择。<br>※ 替换的服务器有【referer】【UserAgent】限制，脚本尝试通过GM钩子绕过，方案可能并不稳定，若出问题前往Github反馈。`,
                    candidate: UPOS
                },
                {
                    key: "dl",
                    type: "select",
                    label: "下载",
                    sub: "不推荐",
                    value: "不替换",
                    float: `替换下载功能获取到的视频服务器，对于播放器已获取到的视频源，已经在上面的选项中处理过了。剩下的跟一般视频同理，不推荐替换。<br>※ 注意有【referer】【UserAgent】限制视频源，请在下载面板将【referer】置空，【UserAgent】设为有效值（默认值肯定有效！）`,
                    candidate: ["不替换"].concat(UPOS)
                }
            ]
        },
        {
            key: "commentLocation",
            menu: "style",
            type: "switch",
            label: "显示评论ip属地",
            sub: "国内省级，国外国级",
            value: true
        }
    ]);
}