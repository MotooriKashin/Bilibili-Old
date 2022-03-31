interface modules {
    /** 设置注册点，需要由设置判定是否运行的功能模块在此注册，其他请尽量在用到的地方注册 */
    readonly "setting.js": string;
}
interface config {
    /** 拦截B站日志上报 */
    logReport: boolean;
    /** 启用新版弹幕 */
    protoDm: boolean;
    /** 解除区域/平台限制 */
    limit: never;
    /** 解除限制 */
    videoLimit: boolean;
    /** 账户授权 */
    limitAccesskey: never;
    /** 泰区代理 */
    limitServer: string;
    /** 统一换回旧版顶栏 */
    section: boolean;
    /** 反查弹幕发送者 */
    danmakuHashId: boolean;
    /** 下载右键菜单 */
    downloadContentmenu: boolean;
    /** flash播放器 */
    noVideo: boolean;
    /** 页面重构模式 */
    compatible: "极端" | "默认" | "兼容";
    /** 添加点赞功能 */
    enlike: boolean;
    /** 稍后再看 */
    watchlater: boolean;
    /** 跳过充电鸣谢 */
    electric: boolean;
    /** 合作up主 */
    upList: boolean;
    /** 互动弹幕 */
    commandDm: boolean;
    /** av/BV */
    av: boolean;
    /** bangumi */
    bangumi: boolean;
    /** player */
    player: boolean;
    /** 主页 */
    index: boolean;
    /** 排行榜 */
    ranking: boolean;
    /** 番剧主页 */
    anime: boolean;
    /** 专栏 */
    read: boolean;
    /** medialist */
    medialist: boolean;
    /** 自动切换到弹幕列表 */
    danmakuFirst: boolean;
    /** 自动化操作 */
    autoDo: never;
    /** 自动滚动到播放器 */
    showBofqi: boolean;
    /** 自动宽屏 */
    screenWide: boolean;
    /** 自动关弹幕 */
    noDanmaku: boolean;
    /** 自动播放 */
    autoPlay: boolean;
    /** 自动网页全屏 */
    webFullScreen: boolean;
    /** 记忆播放速率 */
    videospeed: boolean;
    /** 修复视频心跳 */
    heartbeat: boolean;
    /** 移除未登录弹窗 */
    unloginPopover: boolean;
    /** 下载方式 */
    downloadMethod: string;
    /** User-Agent */
    useragent: string;
    /** referer */
    referer: string;
    /** 保存目录 */
    filepath: string;
    /** RPC令牌（可选） */
    rpcToken: string;
    /** RPC主机 */
    rpcServer: string;
    /** RPC端口 */
    rpcPort: number;
    /** 稍后下载 */
    IDMLater: boolean;
    /** 静默下载 */
    IDMToast: boolean;
    /** 使用TV源 */
    TVresource: boolean;
    /** 视频类型 */
    downloadList: ("mp4" | "dash" | "flv")[];
    /** 默认画质 */
    downloadQn: number;
    /** 其他下载 */
    dlDmCC: never;
    /** 弹幕、CC字幕、封面 */
    ifDlDmCC: boolean;
    /** 弹幕格式 */
    dlDmType: string;
    /** 保留番剧回目列表 */
    bangumiEplist: boolean;
    /** 显示番剧分集数据 */
    episodeData: boolean;
    /** 只显示视频历史 */
    history: boolean;
    /** 去除历史记录页面搜索框 */
    searchHistory: boolean;
    /** 主页广告 */
    indexLoc: boolean;
    /** 禁用主页个性化推荐 */
    privateRecommend: boolean;
    /** 禁止P2P上传 */
    liveP2p: boolean;
    /** 禁止挂机检测 */
    sleepCheck: boolean;
    /** 番剧出差 */
    errands: boolean;
    /** 还原个人空间相簿链接 */
    album: boolean;
    /** 显示账号注册时间 */
    jointime: boolean;
    /** 修复失效视频信息 */
    lostVideo: boolean;
    /** 全弹幕装填 */
    allDanmaku: never;
    /** 全弹幕装填：冷却时间 */
    allDanmakuDelay: number;
    /** 全弹幕装填：开始获取 */
    allDanmakuAction: never;
    /** 在线弹幕 */
    onlineDanmaku: never;
    /** 本地视频/弹幕 */
    localMedia: never;
    /** 呼出下载面板 */
    downloadNow: never;
    /** RPC测试 */
    rpcTest: never;
    /** 设置数据管理 */
    configManage: never;
    /** av页合集显示 */
    collection: boolean;
    /** 重构搜索页 */
    search: boolean;
    /** 分区主页 */
    sortIndex: boolean;
}
namespace API {
    registerSetting({
        key: "logReport",
        sort: "common",
        label: "日志拦截",
        svg: '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"></path></svg>',
        sub: "拦截B站日志上报",
        float: "网页端日志采集太频繁，稍微动下鼠标都要发送数条日志请求，给network调试带来额外的困扰。",
        type: "switch",
        value: false
    });
    registerSetting({
        key: "toast",
        sort: "common",
        type: "sort",
        label: "浮动通知",
        sub: '<a href="//github.com/CodeSeven/toastr">toastr</a>',
        svg: '<svg viewBox="0 0 16 16"><path d="M8 16a2 2 0 001.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 008 16z"></path><path fill-rule="evenodd" d="M8 1.5A3.5 3.5 0 004.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01l.001.006c0 .002.002.004.004.006a.017.017 0 00.006.004l.007.001h10.964l.007-.001a.016.016 0 00.006-.004.016.016 0 00.004-.006l.001-.007a.017.017 0 00-.003-.01l-1.703-2.554a1.75 1.75 0 01-.294-.97V5A3.5 3.5 0 008 1.5zM3 5a5 5 0 0110 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0113.482 13H2.518a1.518 1.518 0 01-1.263-2.36l1.703-2.554A.25.25 0 003 7.947V5z"></path></svg>',
        list: [
            {
                key: "toastcheck",
                sort: "common",
                type: "switch",
                label: "通知开关",
                value: true
            },
            {
                key: "toastconsole",
                sort: "common",
                type: "switch",
                label: "通知输出",
                sub: "是否输出到控制台",
                value: true
            },
            {
                key: "toasttimeout",
                sort: "common",
                type: "input",
                label: "通知时长：/s",
                sub: "通知停留显示多少秒",
                value: 4,
                input: { type: "number", min: 1 },
                pattern: /^\d+$/
            },
            {
                key: "toaststep",
                sort: "common",
                type: "input",
                label: "通知延时：/ms",
                sub: "通知之间的间隔",
                value: 250,
                input: { type: "number", min: 0, max: 10000 },
                pattern: /^\d+$/
            },
            {
                key: "toasttest",
                sort: "common",
                type: "row",
                label: "通知测试",
                sub: "立即演示",
                value: "",
                list: ["", "默认", "警告", "错误", "成功"],
                action: v => {
                    switch (v) {
                        case "默认": toast("默认通知", "蓝~");
                            break;
                        case "警告": toast.warning("警告通知", "黄~");
                            break;
                        case "错误": toast.error("错误通知", "红~");
                            break;
                        case "成功": toast.success("成功通知", "绿~");
                            break;
                    }
                }
            }
        ]
    });
    registerSetting({
        key: "av",
        sort: "rewrite",
        label: "av/BV",
        type: "switch",
        value: true,
        float: '重构以恢复旧版av视频播放页。'
    });
    registerSetting({
        key: "limit",
        sort: "player",
        label: "解除区域/平台限制",
        sub: "港澳台？泰版？仅限APP？",
        float: "同类功能脚本可能会冲突，使用专用脚本切莫开启本功能！",
        type: "sort",
        list: [
            {
                key: "videoLimit",
                sort: "player",
                label: "解除限制",
                type: "switch",
                value: false,
                sub: "区域+APP"
            }, {
                key: "limitAccesskey",
                sort: "player",
                label: "账户授权",
                sub: "泰区除外",
                type: "action",
                title: "管理",
                action: () => { importModule("accesskey.js") }
            }, {
                key: "limitServer",
                sort: "player",
                label: "泰区代理",
                type: "input",
                value: "https://global.bilibili.com",
                float: "泰区番剧限制需要自备相应的代理服务器（需要https协议头但无需末尾的斜杠！）</br>中文域名请先使用punycode转化一下。</br>本功能由于缺乏调试条件维护不善请多担待！",
                input: { type: "url", placeholder: "URL" },
                pattern: /(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/
            }
        ]
    });
    registerSetting({
        key: "protoDm",
        sort: "danmaku",
        label: "启用新版弹幕",
        sub: "proto弹幕",
        type: "switch",
        value: true,
        float: `添加旧版播放器新版proto弹幕支持。由于旧版xml弹幕已获取不到90分钟后的弹幕，本功能不建议禁用。</br>”`
    });
    registerSetting({
        key: "section",
        sort: "style",
        label: "统一换回旧版顶栏",
        sub: "针对未重构的页面",
        type: "switch",
        value: true,
        float: '非重构页面顶栏底栏也替换为旧版。'
    });
    registerSetting({
        key: "danmakuHashId",
        sort: "danmaku",
        label: "反查弹幕发送者",
        sub: "结果仅供参考！",
        type: "switch",
        value: false,
        float: '旧版播放器上右键弹幕将显示弹幕发送者。</br>※ 使用哈希逆向算法，存在碰撞可能性，所示信息仅供参考，或者干脆查不出来。'
    });
    registerSetting({
        key: "noVideo",
        sort: "player",
        label: "flash播放器",
        sub: "可用于临时不加载视频进入视频页面",
        float: "临时启用flash播放器以拦截播放器载入，如需下载视频可切换到“下载”标签呼出下载面板，恢复播放器请点击HTML5按钮或在设置中关闭本功能。",
        type: "switch",
        value: false
    });
    registerSetting({
        key: "compatible",
        sort: "common",
        label: "页面重构模式",
        svg: `<svg viewBox="0 0 24 24"><g><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></g></svg>`,
        type: "row",
        sub: "页面不正常时的选择",
        value: "默认",
        list: ["极端", "默认", "兼容"],
        float: `“默认”模式下会中止默认DOM树的解析，更有效地保障旧版页面不被新版脚本破坏，但可能引发部分浏览器扩展（如pakku.js）功能异常。</br>“兼容”模式可改善这一问题，但加剧了旧版页面被破坏的可能性。</br>另有“极端”模式，恢复经典的“重写”模式，此模式恢复的页面稳定性最佳，但与其他脚本或浏览器扩展兼容性最差，任何在本脚本之前或与本脚本同时注入页面的脚本或浏览器扩展的"content.js"功能都受到影响。</br>很抱歉还是没能找到两全的办法，请自行按需调整。`
    });
    registerSetting({
        key: "enlike",
        sort: "player",
        label: "添加点赞功能",
        sub: "自制、简陋",
        type: "switch",
        value: false,
        float: "旧版播放器的时代点赞功能还未存在，本脚本代为设计了个丑丑的点赞功能。注意对于bangumi，点赞数据计算的是单P的。"
    });
    registerSetting({
        key: "electric",
        sort: "player",
        label: "跳过充电鸣谢",
        sub: "在视频末尾",
        type: "switch",
        value: false
    });
    registerSetting({
        key: "upList",
        sort: "style",
        label: "UP主列表",
        sub: "展示合作者",
        type: "switch",
        value: false
    });
    registerSetting({
        key: "commandDm",
        sort: "danmaku",
        label: "添加互动弹幕",
        sub: "投票弹窗等",
        type: "switch",
        value: false,
        float: `可以使用新版的一些弹窗互动组件。目前可用组件：评分弹窗、投屏弹窗、关联视频跳转按钮、带“UP主”标识弹幕。</br>※ <strong>需要同时开启新版proto弹幕。</strong>`
    });

    registerSetting({
        key: "bangumi",
        sort: "rewrite",
        label: "bangumi",
        sub: "ss/ep",
        type: "switch",
        value: true,
        float: '重构以恢复旧版bangumi播放页。'
    })
    registerSetting({
        type: "switch",
        key: "watchlater",
        label: "稍后再看",
        value: true,
        sort: "rewrite",
        float: '重构以恢复旧版稍后再看。'
    });
    registerSetting({
        type: "switch",
        key: "player",
        label: "嵌入",
        value: true,
        sort: "rewrite",
        float: '重构以恢复旧版嵌入播放器。'
    });
    registerSetting({
        type: "switch",
        key: "index",
        label: "主页",
        value: true,
        sort: "rewrite",
        float: '重构以恢复旧版主页'
    });
    registerSetting({
        type: "switch",
        key: "ranking",
        label: "排行榜",
        value: true,
        sort: "rewrite",
        float: "重构以恢复旧版全站排行榜。"
    });
    registerSetting({
        key: "anime",
        sort: "rewrite",
        label: "番剧主页",
        type: "switch",
        value: false,
        float: '重构以恢复旧版番剧主页。'
    });
    registerSetting({
        type: "switch",
        key: "read",
        label: "专栏",
        value: true,
        sort: "rewrite",
        float: "重构以启用旧版专栏。"
    });
    registerSetting({
        key: "medialist",
        sort: "rewrite",
        label: "medialist",
        type: "switch",
        value: true,
        float: "用旧版av页重构medialist页面。该页面使用曾经的播单页面进行模拟，初始状态视频数据为20，你可以滚送到播单底部以动态加载更多。另外由于播单已被官方禁用，您无法对播单进行收藏等操作，也不能访问播单详情页面。"
    });
    registerSetting({
        key: "danmakuFirst",
        sort: "style",
        label: "自动切换到弹幕列表",
        sub: "默认是展示推荐视频",
        float: "自动从推荐视频切换到播放弹幕列表。",
        type: "switch",
        value: false
    });
    registerSetting({
        type: "sort",
        key: "autoDo",
        label: "自动化操作",
        sort: "player",
        sub: "进入播放页面及切P时",
        list: [{
            key: "showBofqi",
            sort: "style",
            label: "自动滚动到播放器",
            type: "switch",
            value: false
        }, {
            key: "screenWide",
            sort: "style",
            label: "自动宽屏",
            type: "switch",
            value: false,
            action: v => v && (config.webFullScreen = false)
        }, {
            key: "noDanmaku",
            sort: "style",
            label: "自动关弹幕",
            type: "switch",
            value: false
        }, {
            key: "autoPlay",
            sort: "style",
            label: "自动播放",
            type: "switch",
            value: false
        }, {
            key: "webFullScreen",
            sort: "style",
            label: "自动网页全屏",
            type: "switch",
            value: false,
            action: v => v && (config.screenWide = false)
        }, {
            key: "videospeed",
            sort: "player",
            label: "记忆播放速率",
            type: "switch",
            value: false
        }]
    });
    registerSetting({
        key: "heartbeat",
        sort: "restore",
        label: "修复视频心跳",
        sub: "出现不记录播放历史症状时的选择",
        float: "尝试修复可能被广告拦截扩展误伤的视频心跳。",
        type: "switch",
        value: false
    });
    registerSetting({
        type: "switch",
        key: "unloginPopover",
        label: "移除未登录弹窗",
        sub: "有些时候就是不喜欢登录",
        value: false,
        sort: "style"
    });
    registerSetting({
        key: "bangumiEplist",
        sort: "player",
        label: "保留番剧回目列表",
        sub: "牺牲特殊背景图",
        type: "switch",
        value: false,
        float: '部分带特殊背景图片的番剧会隐藏播放器下方的番剧回目列表，二者不可得兼，只能选一。'
    });
    registerSetting({
        key: "episodeData",
        sort: "style",
        label: "显示番剧分集数据",
        sub: "原本是合集数据",
        type: "switch",
        value: false,
        float: '有分集数据时将bangumi播放、弹幕数替换为当集数据。原合集数据将显示在鼠标焦点信息上。'
    });
    registerSetting({
        type: "switch",
        key: "history",
        label: "只显示视频历史",
        sub: "去除专栏、直播记录",
        value: false,
        sort: "style"
    });
    registerSetting({
        type: "switch",
        key: "searchHistory",
        label: "去除历史记录页面搜索框",
        sub: "其实留着也没什么",
        value: false,
        sort: "style"
    });
    registerSetting({
        type: "switch",
        key: "indexLoc",
        label: "过滤主页广告",
        sub: "banner+recommand",
        value: false,
        sort: "style",
        float: '当然指的是旧版主页。'
    });
    registerSetting({
        type: "switch",
        key: "privateRecommend",
        label: "禁用主页个性化推荐",
        sub: "还是习惯全站统一推荐",
        value: false,
        sort: "style",
        float: '禁用旧版主页banner右边的个性化推荐，恢复全站统一推荐。'
    });
    registerSetting({
        type: "switch",
        key: "liveP2p",
        label: "禁止P2P上传",
        sub: "小水管禁不起别人白嫖！",
        value: true,
        sort: "live",
        float: "禁止直播间使用WebRTC进行P2P共享上传，以免暴露ip地址，并为小水管节约带宽。"
    });
    registerSetting({
        type: "switch",
        key: "sleepCheck",
        label: "禁止挂机检测",
        sub: "就喜欢挂后台听个响不行吗！",
        value: true,
        sort: "live",
        float: "禁止直播间5分钟不操作判定挂机并切断直播，可以放心挂后台听个响。"
    });
    registerSetting({
        type: "switch",
        key: "errands",
        label: '恢复对于<a href="//space.bilibili.com/11783021" target="_blank">番剧出差</a>和<a href="//space.bilibili.com/1988098633" target="_blank">DM組</a>的访问',
        sub: '还好没赶尽杀绝',
        value: true,
        sort: "restore",
        float: '使用备份数据修复对于番剧出差官方空间的访问。'
    });
    registerSetting({
        type: "switch",
        key: "album",
        label: "还原个人空间相簿链接",
        sub: "相簿比动态页面好看",
        value: false,
        sort: "restore",
        float: '将个人空间的相簿链接从动态重定向回原来的相簿。'
    });
    registerSetting({
        type: "switch",
        key: "jointime",
        label: "显示账号注册时间",
        sub: "历史不该被隐藏",
        value: false,
        sort: "restore",
        float: '在空间显示对应账号的注册时间。'
    });
    registerSetting({
        key: "lostVideo",
        sort: "restore",
        label: "修复失效视频信息",
        sub: `有些甚至评论还在！`,
        type: "switch",
        value: false,
        float: '使用第三方数据修复收藏、频道等处的失效视频信息。（以红色删除线标记）</br>访问失效视频链接时将尝试重建av页面。</br>※ 依赖第三方数据库且未必有效，<strong>请谨慎考虑是否开启！</strong>'
    });
    registerSetting({
        type: "switch",
        sort: "download",
        key: "downloadContentmenu",
        label: "右键菜单",
        sub: "播放画面上右键添加下载菜单",
        value: false
    });
    registerSetting({
        type: "row",
        sort: "download",
        key: "downloadMethod",
        label: "下载方式",
        value: "右键保存",
        list: ["右键保存", "ef2", "aria2", "aira2 RPC"],
        action: (v) => {
            switch (v) {
                case "ef2": alertMessage(`<a href="https://github.com/MotooriKashin/ef2/releases" target="_blank">EF2</a>是作者开发的一款从浏览器中拉起IDM进行下载的中间软件，可以非常方便地传递下载数据给IDM，并支持自定义文件名、保存目录等。<strong>您必须安装了ef2和IDM才能使用本方式！</strong>`).then(d => {
                    d ? changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: false, IDMToast: false, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }) :
                        (config.downloadMethod = "右键保存", changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                    displaySetting("downloadMethod");
                })
                    break;
                case "aria2": alertMessage(`aria2是一款著名的命令行下载工具，使用本方式将在您点击下载面板中的链接时将命令行复制到您的剪切板中，您可以粘贴到cmd等终端中回车进行下载。<strong>您必须先下载aria2工具并添加系统环境变量或者在终端在打开aria2二进制文件所在目录！</strong>`).then(d => {
                    d ? changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }) :
                        (config.downloadMethod = "右键保存", changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLate: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                    displaySetting("downloadMethod");
                })
                    break;
                case "aira2 RPC": alertMessage(`aria2支持RPC方式接收下载数据，您需要在aria2配置开启RPC功能并保持后台运行，并在本脚本设置中配置好aria2主机及端口。</br>点击确定将刷新设置面板并呈现相关设置。`).then(d => {
                    d ? changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: true, IDMToast: true, rpcServer: false, rpcPort: false, rpcToken: false, rpcTest: false }) :
                        (config.downloadMethod = "右键保存", changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                    displaySetting("downloadMethod");
                })
                    break;
                default: changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true });
                    displaySetting("downloadMethod");
            }
        }
    });
    registerSetting({
        type: "action",
        key: "downloadNow",
        label: "下载面版",
        title: "呼出",
        sub: "只在视频页面有效",
        sort: "download",
        disabled: 0,
        action: () => {
            if (API.aid && API.cid) {
                API.download();
            } else toast.warning("当前并非视频页，请在视频页面打开！")
        }
    });
    registerSetting({
        type: "switch",
        sort: "download",
        key: "TVresource",
        label: "请求TV源",
        sub: "无水印",
        value: false,
        float: `请求TV端的视频源，该端口可以获取到无水印的视频源（mp4格式除外），</br><strong>此类源无法以“右键保存”方式下载，请改用ef2或者aria2，且“referer”选项必须置空！</strong></br>大会员专享类视频下载将要求电视端大会员，与一般大会员不互通。授权大会员状态请尝试设置-播放-解除区域/平台限制-账户授权(有效性待测！)`
    });
    registerSetting({
        type: "mutlti",
        sort: "download",
        key: "downloadList",
        label: "视频类型",
        sub: "右键呼出下载时请求的类型",
        value: ["mp4", "dash", "flv"],
        list: ["mp4", "dash", "flv"],
        float: '下载功能会自动读取播放器已载入的视频源并呈现在下载面板上，即使未勾选对应的视频类型。</br>勾选了也不一定能获取到该类型的视频源。'
    });
    registerSetting({
        type: "row",
        sort: "download",
        key: "downloadQn",
        label: "默认画质",
        sub: "针对flv格式",
        value: 127,
        list: ["0", 15, 16, 32, 48, 64, 74, 80, 112, 116, 120, 125, 126, 127],
        float: '画质qn参数，数值越大画质越高，0表示自动。64（720P）以上需要登录，112（1080P+）以上需要大会员。一般只需设置为最大即可，会自动获取到能获取的最高画质。'
    });
    registerSetting({
        type: "input",
        sort: "download",
        key: "useragent",
        label: "User-Agent",
        value: "Bilibili Freedoooooom/MarkII",
        input: { type: "text" },
        float: `用户代理，此值不可为空，默认使用B站客户端专属UA。`,
        hidden: config.downloadMethod == "右键保存"
    });
    registerSetting({
        type: "input",
        sort: "download",
        key: "referer",
        label: "referer",
        value: location.origin,
        input: { type: "text" },
        float: `一般为B站主域名(http://www.bilibili.com)。</br><strong>APP/TV等视频源必须为空！</strong>`,
        hidden: config.downloadMethod == "右键保存"
    });
    registerSetting({
        type: "input",
        sort: "download",
        key: "filepath",
        label: "保存目录",
        value: "",
        input: { type: "text", placeholder: "如：D\\下载" },
        float: 'windows端请注意反斜杠！',
        hidden: config.downloadMethod == "右键保存"
    });
    registerSetting({
        key: "rpcToken",
        sort: "download",
        label: "RPC令牌（可选）",
        type: "input",
        input: { type: "password" },
        value: "",
        hidden: config.downloadMethod != "aira2 RPC"
    });
    registerSetting({
        key: "rpcServer",
        sort: "download",
        label: "RPC主机",
        type: "input",
        input: { type: "url", placeholder: "如：http(s)://localhost" },
        value: "http://localhost",
        hidden: config.downloadMethod != "aira2 RPC"
    });
    registerSetting({
        key: "rpcPort",
        sort: "download",
        label: "RPC端口",
        type: "input",
        input: { type: "number", placeholder: "如：6800" },
        value: 6800,
        hidden: config.downloadMethod != "aira2 RPC"
    });
    registerSetting({
        key: "rpcTest",
        sort: "download",
        label: "RPC调试",
        type: "action",
        title: "测试",
        hidden: config.downloadMethod != "aira2 RPC",
        action: () => {
            API.aria2.getVersion()
                .then(d => toast.success(`RPC设置正常！aria2版本：${d.version}`))
                .catch(e => toast.error("RPC链接异常！请检查各项设置以及RPC主机的状况！", e))
        }
    });
    registerSetting({
        key: "IDMLater",
        sort: "download",
        label: "稍后下载",
        sub: "添加到IDM列表而不立即下载",
        type: "switch",
        value: false,
        float: "把下载链接添加到下载列表但是不立即开始下载，需要下载时再手动到IDM里开始。<strong>B站下载链接一般都有时效，太久不下载的话链接可能失效！</strong>",
        hidden: config.downloadMethod != "ef2"
    });
    registerSetting({
        key: "IDMToast",
        sort: "download",
        label: "静默下载",
        sub: "不用IDM确认框",
        type: "switch",
        value: false,
        float: "禁用IDM下载前的询问弹窗，其中可以选择修改文件名及保存目录等信息。",
        hidden: config.downloadMethod != "ef2"
    });
    registerSetting({
        key: "dlDmCC",
        sort: "download",
        label: "其他下载",
        sub: "弹幕、CC字幕等",
        type: "sort",
        list: [
            {
                key: "ifDlDmCC",
                sort: "download",
                label: "弹幕、CC字幕、封面",
                type: "switch",
                value: false
            },
            {
                key: "dlDmType",
                sort: "download",
                label: "弹幕格式",
                type: "row",
                value: "xml",
                list: ["xml", "json"],
                float: `xml是经典的B站弹幕格式，json是旧版播放器直接支持的格式，本脚本载入本地弹幕功能同时支持这两种。</br>如果只是给本脚本专用那就选json，xml对“非法字符”支持不友好，部分高级/代码/BAS弹幕可能出错。`
            }
        ]
    });
    registerSetting({
        key: "onlineDanmaku",
        sort: "danmaku",
        label: "在线弹幕",
        type: "input",
        float: '为当前旧版播放器载入其他站内视频弹幕，可以输入URL或者aid等参数。</br>※ 可配合选择是否合并已有弹幕。',
        input: { type: "url", placeholder: "URL" },
        title: "载入",
        hidden: true,
        action: (url) => {
            if (!window.player?.setDanmaku) return toast.warning("内部组件丢失，已停止！");
            danmaku.onlineDanmaku(url);
        }
    });
    registerSetting({
        key: "localMedia",
        sort: "player",
        label: "载入本地文件",
        sub: "视频/弹幕",
        type: "file",
        accept: [".mp4", ".xml", ".json"],
        float: '使用旧版播放器播放本地视频或者弹幕文件。</br>※ 视频只能为mp4格式，且编码格式被浏览器所兼容。</br>※ 若载入弹幕文件，参见弹幕设置是否合并弹幕。',
        title: "文件",
        hidden: true,
        action: (files) => {
            (!window.player?.setDanmaku) && toast.warning("内部组件丢失，无法载入弹幕文件！");
            new LocalMedia(files);
        }
    });
    registerSetting({
        key: "allDanmaku",
        sort: "danmaku",
        label: "全弹幕装填",
        type: "sort",
        float: '获取所有能获取的历史弹幕。</br><strong>※ 该操作耗时较长且可能造成B站临时封接口，请慎用！</strong>',
        hidden: true,
        list: [{
            key: "allDanmakuDelay",
            sort: "danmaku",
            label: "冷却时间：/s",
            type: "input",
            value: 3,
            input: { type: "number", min: 1, max: 60, step: 0.5 },
            float: '接口冷却时间，时间长可以降低被临时封端口的几率。'
        },
        {
            key: "allDanmakuAction",
            sort: "danmaku",
            label: "开始获取",
            type: "action",
            title: "开始",
            action: function () {
                if (!window.player?.setDanmaku) return toast.warning("内部组件丢失，已停止！");
                new AllDanmaku();
            },
            disabled: 0
        }]
    });
    path && path.name && runWhile(() => path.name && (<any>window).player, () => {
        changeSettingMode({ onlineDanmaku: false, allDanmaku: false, localMedia: false })
    });
    registerSetting({
        type: "row",
        sort: "player",
        key: "codecType",
        label: "优先载入的视频编码类型",
        sub: "AVC、HEVC或AV1",
        value: "AVC",
        list: ["AVC", "HEVC", "AV1"],
        float: '播放器会尽量优先加载所选择的编码，可根据设备解码能力与实际需要调整这个设置项。AVC兼容性最佳，AV1次之，HEVC则只有Safari支持，edge可通过一些操作进行支持。有关视频编码格式可查阅其他专业文档。',
        action: type => {
            let mime = {
                "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
                "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"',
                "AVC": 'video/mp4;codecs="avc1.640028"'
            };
            if (!MediaSource.isTypeSupported(mime[<keyof typeof mime>type])) {
                toast.warning(`播放器不支持${type}编码格式`, "将继续使用AVC编码");
                config.codecType = "AVC";
                API.displaySetting("codecType");
            }
        }
    });
    registerSetting({
        key: "configManage",
        sort: "common",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></g></svg>',
        label: "设置数据",
        sub: "备份/恢复",
        type: "action",
        title: "管理",
        action: () => API.importModule("manage.js")
    });
    registerSetting({
        key: "collection",
        sort: "rewrite",
        label: "合集",
        sub: "以分P形式呈现",
        type: "switch",
        value: true
    });
    registerSetting({
        key: "search",
        sort: "rewrite",
        label: "搜索",
        type: "switch",
        value: false
    });
    registerSetting({
        key: "sortIndex",
        sort: "rewrite",
        label: "分区主页",
        type: "switch",
        value: true,
        init: () => setCookie("i-wanna-go-back", String(2)),
        action: v => setCookie("i-wanna-go-back", String(v ? 2 : -1))
    })
}