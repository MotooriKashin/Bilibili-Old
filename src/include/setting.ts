interface modules {
    /**
     * 像脚本设置UI添加设置项初始数据  
     * 带有`value`设置将同步到`config`变量以存储到本地。  
     * 追加设置项请同时拓展`config`接口声明以告知该设置的作用，属性名为`key`的值。
     */
    readonly "setting.js": string;
}
interface config {
    /**
     * 开发者模式
     */
    developer: boolean;
    /**
     * 托管原生脚本
     */
    trusteeship: boolean;
    /**
     * 重构：av/BV
     */
    av: boolean;
    /**
     * 样式：UP主列表
     */
    upList: boolean;
    /**
     * 播放：跳过充电鸣谢
     */
    electric: boolean;
    /**
     * 播放：点赞功能
     */
    enlike: boolean;
    /**
     * 重构：medialist
     */
    medialist: boolean;
    /**
     * 重构：主页
     */
    index: boolean;
    /**
     * 样式：过滤主页广告
     */
    indexLoc: boolean;
    /**
     * 样式：去除个性化推荐
     */
    privateRecommend: boolean;
    /**
     * 弹幕：互动弹幕
     */
    commandDm: boolean;
    /**
     * 弹幕：新版弹幕
     */
    protoDm: boolean;
    /**
     * 通用：日志拦截
     */
    logReport: boolean;
    /**
     * 修复：视频心跳
     */
    heartbeat: boolean;
    /**
     * 播放：拦截视频
     */
    noVideo: boolean;
    /**
     * 样式：顶栏动图
     */
    bannerGif: boolean;
    /**
     * 样式：弹幕优先
     */
    danmakuFirst: boolean;
    /**
     * 样式：自动滚动到播放器
     */
    showBofqi: boolean;
    /**
     * 样式：自动宽屏
     */
    screenWide: boolean;
    /**
     * 样式：自动关弹幕
     */
    noDanmaku: boolean;
    /**
     * 样式：自动播放
     */
    autoPlay: boolean;
    /**
     * 播放：分段进度条
     */
    segProgress: boolean;
    /**
     * 样式：翻页评论
     */
    replyList: boolean;
    /**
     * 样式：顶栏底栏
     */
    section: boolean;
    /**
     * 播放：弹幕合并
     */
    concatDanmaku: boolean;
    /**
     * 弹幕：弹幕反查
     */
    danmakuHashId: boolean;
    /**
     * 弹幕：全弹幕装填冷却时间
     */
    allDanmakuDelay: number;
    /**
     * 修复：番剧出差
     */
    errands: boolean;
    /**
     * 修复：相簿链接
     */
    album: boolean;
    /**
     * 修复：注册时间
     */
    jointime: boolean;
    /**
     * 修复：失效视频信息
     */
    lostVideo: boolean;
    /**
     * 重构：bangumi
     */
    bangumi: boolean;
    /**
     * 播放：解除限制
     */
    videoLimit: boolean;
    /**
     * 播放：泰区代理服务器
     */
    limitServer: string;
    /**
     * 播放：番剧回目列表
     */
    bangumiEplist: boolean;
    /**
     * 样式：番剧分集数据
     */
    episodeData: boolean;
    /**
     * 重构：稍后再看
     */
    watchlater: boolean;
    /**
     * 样式：只显示视频历史
     */
    history: boolean;
    /**
     * 样式：去除历史记录页面搜索框
     */
    searchHistory: boolean;
    /**
     * 直播：P2P上传
     */
    liveP2p: boolean;
    /**
     * 直播：禁止挂机检测
     */
    sleepCheck: boolean;
    /**
     * 重构：嵌入播放器
     */
    player: boolean;
    /**
     * 重构：排行榜
     */
    ranking: boolean;
    /**
     * 重构：专栏
     */
    read: boolean;
    /**
     * 样式：登录弹窗
     */
    unloginPopover: boolean;
    /**
     * 下载：右键菜单
     */
    downloadContentmenu: boolean;
    /**
     * 下载：视频类型
     */
    downloadList: ("mp4" | "dash" | "flv")[];
    /**
     * 下载：画质参数
     */
    downloadQn: number;
    /**
     * 下载：下载方式
     */
    downloadMethod: string;
    /**
     * 下载：UserAgent
     */
    useragent: string;
    /**
     * 下载：保存目录
     */
    filepath: string;
    /**
     * 下载：稍后下载
     */
    IDMLater: boolean;
    /**
     * 下载：静默下载
     */
    IDMToast: boolean;
    /**
     * 下载：RPC主机
     */
    rpcServer: string;
    /**
     * 下载：RPC端口
     */
    rpcPort: number;
    /**
     * 下载：referer
     */
    referer: string;
    /**
     * 下载：RPC令牌
     */
    rpcToken: string;
    /**
     * 下载：其他下载
     */
    ifDlDmCC: boolean;
    /**
     * 下载：弹幕类型
     */
    dlDmType: string;
    /**
     * 样式：评论超链接
     */
    commentLinkDetail: boolean;
    /**
     * 样式：旧版评论排序
     */
    oldReplySort: boolean;
    /**
     * 重构：番剧分区
     */
    anime: boolean;
    /**
     * 样式：自动网页全屏
     */
    webFullScreen: boolean;
}
/**
 * 已注册的菜单，通过`registerMenu`新建项请补充这里的可能值
 * **本变量仅作为类型声明接口类似的东西存在，不可参与到任何实际运行代码中！**
 */
type MenuKey = "common" | "rewrite" | "restore" | "style" | "danmaku" | "player" | "live" | "download"

{
    // 注册设置菜单
    API.registerMenu({ key: "common", name: "通用", svg: '<svg viewBox="0 0 24 24"><g><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g></svg>' });
    API.registerMenu({ key: "rewrite", name: "重构", svg: `<svg viewBox="0 0 24 24"><g><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g></svg>` });
    API.registerMenu({ key: "restore", name: "修复", svg: `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>` });
    API.registerMenu({ key: "style", name: "样式", svg: `<svg viewBox="0 0 24 24"><g><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>` });
    API.registerMenu({ key: "danmaku", name: "弹幕", svg: `<svg viewBox="0 0 22 22"><path d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z"></path><path d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z"></path></svg>` });
    API.registerMenu({ key: "player", name: "播放", svg: `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>` });
    API.registerMenu({ key: "live", name: "直播", svg: `<svg viewBox="0 0 1024 1024"><path d="M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0"></path><path d="M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556 0.142222 143.985778-64.156444 144.128-143.616 0.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-0.142222-143.701333 63.857778-144.128 143.104-0.426667 79.459556 63.644444 144.213333 143.104 144.64h0.512"></path><path d="M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504"></path></svg>` });
    API.registerMenu({ key: "download", name: "下载", svg: `<svg viewBox="0 0 24 24"><g><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g></svg>` });

    // 注册设置项
    API.registerSetting({
        key: "developer",
        sort: "common",
        label: "开发者模式",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g></svg>',
        type: "switch",
        value: false,
        float: '开发者模式将暴露核心变量 <b>API</b> 到页面顶级对象 window，可以借此在控制台调试部分功能。',
        sub: '暴露 API 到 window',
        action: (value) => {
            value ? (!(<any>window).API && ((<any>window).API = API)) : ((<any>window).API && delete (<any>window).API)
        }
    })
    API.registerSetting({
        key: "trusteeship",
        sort: "common",
        label: "托管原生脚本",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></g></svg>',
        type: "switch",
        value: true,
        float: "脚本修改了部分B站原生脚本以解决常规手段无法解决的问题，但由于托管CDN没有国内节点等原因可能访问不畅，如果出现页面其他情况都正常唯独播放器加载不出来的情况可以尝试开启。<strong>关闭本选项将导致部分功能不可用，如非必要请勿关闭！</strong>",
        sub: "代为修复和维护"
    })
    config.developer && ((<any>window).API = API);
    API.registerSetting({
        key: "av",
        sort: "rewrite",
        label: "av/BV",
        type: "switch",
        value: true,
        float: '重构以恢复旧版av视频播放页。'
    })
    API.registerSetting({
        key: "upList",
        sort: "style",
        label: "UP主列表",
        sub: "展示视频合作者",
        type: "switch",
        value: false
    })
    API.registerSetting({
        key: "electric",
        sort: "player",
        label: "跳过充电鸣谢",
        sub: "在视频末尾",
        type: "switch",
        value: false
    })
    API.registerSetting({
        key: "enlike",
        sort: "player",
        label: "添加点赞功能",
        sub: "自制、简陋",
        type: "switch",
        value: false,
        float: "旧版播放器的时代点赞功能还未存在，本脚本代为设计了个丑丑的点赞功能。注意对于bangumi，点赞数据计算的是单P的。"
    })
    API.registerSetting({
        key: "medialist",
        sort: "rewrite",
        label: "medialist",
        type: "switch",
        value: true,
        float: "用旧版av页重构medialist页面。该页面使用曾经的播单页面进行模拟，初始状态视频数据为20，你可以滚送到播单底部以动态加载更多。另外由于播单已被官方禁用，您无法对播单进行收藏等操作，也不能访问播单详情页面。"
    })
    API.registerSetting({
        type: "switch",
        key: "index",
        label: "主页",
        value: true,
        sort: "rewrite",
        float: '重构以恢复旧版主页'
    })
    API.registerSetting({
        type: "switch",
        key: "indexLoc",
        label: "过滤主页广告",
        sub: "banner+recommand",
        value: false,
        sort: "style",
        float: '当然指的是旧版主页。'
    })
    API.registerSetting({
        type: "switch",
        key: "privateRecommend",
        label: "禁用主页个性化推荐",
        sub: "还是习惯全站统一推荐",
        value: false,
        sort: "style",
        float: '禁用旧版主页banner右边的个性化推荐，恢复全站统一推荐。'
    })
    API.registerSetting({
        key: "protoDm",
        sort: "danmaku",
        label: "启用新版弹幕",
        sub: "proto弹幕",
        type: "switch",
        value: true,
        float: `添加旧版播放器新版proto弹幕支持。由于旧版xml弹幕已获取不到90分钟后的弹幕，本功能不建议禁用。</br>”`
    })
    API.registerSetting({
        key: "commandDm",
        sort: "danmaku",
        label: "添加互动弹幕",
        sub: "投票弹窗等",
        type: "switch",
        value: false,
        float: `可以使用新版的一些弹窗互动组件。目前可用组件：评分弹窗、投屏弹窗、关联视频跳转按钮、带“UP主”标识弹幕。</br>※ <strong>需要同时开启新版proto弹幕。</strong>`
    })
    API.registerSetting({
        key: "logReport",
        sort: "common",
        label: "日志拦截",
        svg: '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"></path></svg>',
        sub: "拦截B站日志上报",
        float: "网页端日志采集太频繁，稍微动下鼠标都要发送数条日志请求，给network调试带来额外的困扰。",
        type: "switch",
        value: false
    })
    API.registerSetting({
        key: "heartbeat",
        sort: "restore",
        label: "修复视频心跳",
        sub: "出现不记录播放历史症状时的选择",
        float: "尝试修复可能被广告拦截扩展误伤的视频心跳。",
        type: "switch",
        value: false
    })
    API.registerSetting({
        key: "noVideo",
        sort: "player",
        label: "flash播放器",
        sub: "可用于临时不加载视频进入视频页面",
        float: "临时启用flash播放器以拦截播放器载入，如需下载视频可切换到“下载”标签呼出下载面板，恢复播放器请点击HTML5按钮或在设置中关闭本功能。",
        type: "switch",
        value: false
    })
    API.registerSetting({
        key: "bannerGif",
        sort: "style",
        label: "丰富顶栏动图",
        sub: '搜索框下gif',
        float: "替换顶栏动图接口，避免单调。",
        type: "switch",
        value: true
    })
    API.registerSetting({
        key: "danmakuFirst",
        sort: "style",
        label: "自动切换到弹幕列表",
        sub: "默认是展示推荐视频",
        float: "自动从推荐视频切换到播放弹幕列表。",
        type: "switch",
        value: false
    })
    API.registerSetting({
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
        }]
    })
    API.registerSetting({
        key: "segProgress",
        sort: "player",
        label: "分段进度条",
        sub: "仅限看点视频",
        type: "switch",
        value: false
    })
    API.registerSetting({
        key: "replyList",
        sort: "style",
        label: "恢复评论翻页",
        sub: "可以选择跳转而不必一直下拉",
        type: "switch",
        value: true,
        float: '恢复旧版翻页评论区。</br>重构过的页面除外，那些默认就是翻页评论区。'
    })
    API.registerSetting({
        key: "section",
        sort: "style",
        label: "统一换回旧版顶栏",
        sub: "针对未重构的页面",
        type: "switch",
        value: true,
        float: '非重构页面顶栏底栏也替换为旧版。'
    })
    API.registerSetting({
        key: "concatDanmaku",
        sort: "danmaku",
        label: "合并载入弹幕",
        sub: "本地弹幕/在线弹幕",
        type: "switch",
        value: false,
        float: '载入本地弹幕文件或者在线弹幕时是否与播放器当前弹幕合并。'
    })
    API.registerSetting({
        key: "danmakuHashId",
        sort: "danmaku",
        label: "反查弹幕发送者",
        sub: "结果仅供参考！",
        type: "switch",
        value: false,
        float: '旧版播放器上右键弹幕将显示弹幕发送者。</br>※ 使用哈希逆向算法，存在碰撞可能性，所示信息仅供参考，或者干脆查不出来。'
    })
    API.registerSetting({
        type: "switch",
        key: "errands",
        label: '恢复对于<a href="//space.bilibili.com/11783021" target="_blank">番剧出差</a>和<a href="//space.bilibili.com/1988098633" target="_blank">DM組</a>的访问',
        sub: '还好没赶尽杀绝',
        value: true,
        sort: "restore",
        float: '使用备份数据修复对于番剧出差官方空间的访问。'
    })
    API.registerSetting({
        type: "switch",
        key: "album",
        label: "还原个人空间相簿链接",
        sub: "相簿比动态页面好看",
        value: false,
        sort: "restore",
        float: '将个人空间的相簿链接从动态重定向回原来的相簿。'
    })
    API.registerSetting({
        type: "switch",
        key: "jointime",
        label: "显示账号注册时间",
        sub: "历史不该被隐藏",
        value: false,
        sort: "restore",
        float: '在空间显示对应账号的注册时间。'
    })
    API.registerSetting({
        key: "lostVideo",
        sort: "restore",
        label: "修复失效视频信息",
        sub: `有些甚至评论还在！`,
        type: "switch",
        value: false,
        float: '使用第三方数据修复收藏、频道等处的失效视频信息。（以红色删除线标记）</br>访问失效视频链接时将尝试重建av页面。</br>※ 依赖第三方数据库且未必有效，<strong>请谨慎考虑是否开启！</strong>'
    })
    API.registerSetting({
        key: "bangumi",
        sort: "rewrite",
        label: "bangumi",
        sub: "ss/ep",
        type: "switch",
        value: true,
        float: '重构以恢复旧版bangumi播放页。'
    })
    API.registerSetting({
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
                action: () => { API.importModule("accesskey.js") }
            }, {
                key: "limitServer",
                sort: "player",
                label: "泰区代理",
                type: "input",
                value: "https://api.global.bilibili.com",
                float: "泰区番剧限制需要自备相应的代理服务器（需要https协议头但无需末尾的斜杠！）</br>中文域名请先使用punycode转化一下。</br>本功能由于缺乏调试条件维护不善请多担待！",
                input: { type: "url", placeholder: "URL" },
                pattern: /(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/
            }
        ]
    })
    API.registerSetting({
        key: "bangumiEplist",
        sort: "player",
        label: "保留番剧回目列表",
        sub: "牺牲特殊背景图",
        type: "switch",
        value: false,
        float: '部分带特殊背景图片的番剧会隐藏播放器下方的番剧回目列表，二者不可得兼，只能选一。'
    })
    API.registerSetting({
        key: "episodeData",
        sort: "style",
        label: "显示番剧分集数据",
        sub: "原本是合集数据",
        type: "switch",
        value: false,
        float: '有分集数据时将bangumi播放、弹幕数替换为当集数据。原合集数据将显示在鼠标焦点信息上。'
    })
    API.registerSetting({
        type: "switch",
        key: "watchlater",
        label: "稍后再看",
        value: true,
        sort: "rewrite",
        float: '重构以恢复旧版稍后再看。'
    })
    API.registerSetting({
        type: "switch",
        key: "history",
        label: "只显示视频历史",
        sub: "去除专栏、直播记录",
        value: false,
        sort: "style"
    })
    API.registerSetting({
        type: "switch",
        key: "searchHistory",
        label: "去除历史记录页面搜索框",
        sub: "其实留着也没什么",
        value: false,
        sort: "style"
    })
    API.registerSetting({
        type: "switch",
        key: "liveP2p",
        label: "禁止P2P上传",
        sub: "小水管禁不起别人白嫖！",
        value: true,
        sort: "live",
        float: "禁止直播间使用WebRTC进行P2P共享上传，以免暴露ip地址，并为小水管节约带宽。"
    })
    API.registerSetting({
        type: "switch",
        key: "sleepCheck",
        label: "禁止挂机检测",
        sub: "就喜欢挂后台听个响不行吗！",
        value: true,
        sort: "live",
        float: "禁止直播间5分钟不操作判定挂机并切断直播，可以放心挂后台听个响。"
    })
    API.registerSetting({
        type: "switch",
        key: "player",
        label: "嵌入",
        value: true,
        sort: "rewrite",
        float: '重构以恢复旧版嵌入播放器。'
    })
    API.registerSetting({
        type: "switch",
        key: "ranking",
        label: "排行榜",
        value: true,
        sort: "rewrite",
        float: "重构以恢复旧版全站排行榜。"
    })
    API.registerSetting({
        type: "switch",
        key: "read",
        label: "专栏",
        value: true,
        sort: "rewrite",
        float: "重构以启用旧版专栏。"
    })
    API.registerSetting({
        type: "switch",
        key: "unloginPopover",
        label: "移除未登录弹窗",
        sub: "有些时候就是不喜欢登录",
        value: false,
        sort: "style"
    })
    API.registerSetting({
        key: "downloadPicture",
        type: "picture",
        sort: "download",
        src: '//s2.hdslb.com/bfs/static/blive/blfe-album-detail/static/img/empty-hint.7b606b9.jpg',
        hidden: !API.aid,
        callback: function () {
            API.aid && API.getAidInfo(API.aid).then(d => {
                this.innerHTML = `<picture><img src="${d.View.pic.replace("http:", "")}"></picture>`
            })
        }
    })
    API.runWhile(() => API.aid, () => { API.changeSettingMode({ downloadPicture: false }) })
    API.registerSetting({
        type: "action",
        key: "downloadThis",
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
    })
    API.registerSetting({
        type: "switch",
        sort: "download",
        key: "downloadContentmenu",
        label: "右键菜单",
        sub: "播放画面上右键添加下载菜单",
        value: false
    })
    API.registerSetting({
        type: "mutlti",
        sort: "download",
        key: "downloadList",
        label: "视频类型",
        sub: "右键呼出下载时请求的类型",
        value: ["mp4", "dash", "flv"],
        list: ["mp4", "dash", "flv"],
        float: '下载功能会自动读取播放器已载入的视频源并呈现在下载面板上，即使未勾选对应的视频类型。</br>勾选了也不一定能获取到该类型的视频源。'
    })
    API.registerSetting({
        type: "row",
        sort: "download",
        key: "downloadQn",
        label: "默认画质",
        sub: "针对flv格式",
        value: 127,
        list: ["0", 15, 16, 32, 48, 64, 74, 80, 112, 116, 120, 125, 126, 127],
        float: '画质qn参数，数值越大画质越高，0表示自动。64（720P）以上需要登录，112（1080P+）以上需要大会员。一般只需设置为最大即可，会自动获取到能获取的最高画质。'
    })
    API.registerSetting({
        type: "row",
        sort: "download",
        key: "downloadMethod",
        label: "下载方式",
        value: "右键保存",
        list: ["右键保存", "ef2", "aria2", "aira2 RPC"],
        action: (v) => {
            switch (v) {
                case "ef2": API.alertMessage(`<a href="https://github.com/MotooriKashin/ef2/releases" target="_blank">EF2</a>是作者开发的一款从浏览器中拉起IDM进行下载的中间软件，可以非常方便地传递下载数据给IDM，并支持自定义文件名、保存目录等。<strong>您必须安装了ef2和IDM才能使用本方式！</strong>`).then(d => {
                    d ? API.changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: false, IDMToast: false, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }) :
                        (config.downloadMethod = "右键保存", API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                    API.displaySetting("downloadMethod");
                })
                    break;
                case "aria2": API.alertMessage(`aria2是一款著名的命令行下载工具，使用本方式将在您点击下载面板中的链接时将命令行复制到您的剪切板中，您可以粘贴到cmd等终端中回车进行下载。<strong>您必须先下载aria2工具并添加系统环境变量或者在终端在打开aria2二进制文件所在目录！</strong>`).then(d => {
                    d ? API.changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }) :
                        (config.downloadMethod = "右键保存", API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLate: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                    API.displaySetting("downloadMethod");
                })
                    break;
                case "aira2 RPC": API.alertMessage(`aria2支持RPC方式接收下载数据，您需要在aria2配置开启RPC功能并保持后台运行，并在本脚本设置中配置好aria2主机及端口。</br>点击确定将刷新设置面板并呈现相关设置。`).then(d => {
                    d ? API.changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: true, IDMToast: true, rpcServer: false, rpcPort: false, rpcToken: false, rpcTest: false }) :
                        (config.downloadMethod = "右键保存", API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                    API.displaySetting("downloadMethod");
                })
                    break;
                default: API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true });
                    API.displaySetting("downloadMethod");
            }
        }
    })
    API.registerSetting({
        type: "input",
        sort: "download",
        key: "useragent",
        label: "User-Agent",
        value: "Bilibili Freedoooooom/MarkII",
        input: { type: "text" },
        float: `用户代理，此值不可为空，默认使用B站客户端专属UA。`,
        hidden: config.downloadMethod == "右键保存"
    })
    API.registerSetting({
        type: "input",
        sort: "download",
        key: "referer",
        label: "referer",
        value: location.origin,
        input: { type: "text" },
        float: `一般为B站主域名(http://www.bilibili.com)。</br><strong>APP/TV等视频源必须为空！</strong>`,
        hidden: config.downloadMethod == "右键保存"
    })
    API.registerSetting({
        type: "input",
        sort: "download",
        key: "filepath",
        label: "保存目录",
        value: "",
        input: { type: "text", placeholder: "如：D\\下载" },
        float: 'windows端请注意反斜杠！',
        hidden: config.downloadMethod == "右键保存"
    })
    API.registerSetting({
        key: "IDMLater",
        sort: "download",
        label: "稍后下载",
        sub: "添加到IDM列表而不立即下载",
        type: "switch",
        value: false,
        float: "把下载链接添加到下载列表但是不立即开始下载，需要下载时再手动到IDM里开始。<strong>B站下载链接一般都有时效，太久不下载的话链接可能失效！</strong>",
        hidden: config.downloadMethod != "ef2"
    })
    API.registerSetting({
        key: "IDMToast",
        sort: "download",
        label: "静默下载",
        sub: "不用IDM确认框",
        type: "switch",
        value: false,
        float: "禁用IDM下载前的询问弹窗，其中可以选择修改文件名及保存目录等信息。",
        hidden: config.downloadMethod != "ef2"
    })
    API.registerSetting({
        key: "rpcServer",
        sort: "download",
        label: "RPC主机",
        type: "input",
        input: { type: "url", placeholder: "如：http(s)://localhost" },
        value: "http://localhost",
        hidden: config.downloadMethod != "aira2 RPC"
    })
    API.registerSetting({
        key: "rpcPort",
        sort: "download",
        label: "RPC端口",
        type: "input",
        input: { type: "number", placeholder: "如：6800" },
        value: 6800,
        hidden: config.downloadMethod != "aira2 RPC"
    })
    API.registerSetting({
        key: "rpcToken",
        sort: "download",
        label: "RPC令牌（可选）",
        type: "input",
        input: { type: "password" },
        value: "",
        hidden: config.downloadMethod != "aira2 RPC"
    })
    API.registerSetting({
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
    })
    API.registerSetting({
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
    })
    // 旧版播放器专属设置
    API.registerSetting({
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
            API.danmaku.onlineDanmaku(url);
        }
    })
    API.registerSetting({
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
            value: <any>3,
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
                new API.allDanmaku();
            },
            disabled: 0
        }]
    })
    API.registerSetting({
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
            new API.localMedia(files);
        }
    })
    API.path && API.path.name && API.runWhile(() => API.path.name && (<any>window).player, () => {
        API.changeSettingMode({ onlineDanmaku: false, allDanmaku: false, localMedia: false })
    })
    API.registerSetting({
        key: "commentLinkDetail",
        sort: "style",
        label: "还原评论中的超链接",
        sub: "av、ss或ep",
        type: "switch",
        value: false
    })
    API.registerSetting({
        key: "configManage",
        sort: "common",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></g></svg>',
        label: "设置数据",
        sub: "备份/恢复",
        type: "action",
        title: "管理",
        action: () => API.importModule("manage.js")
    })
    API.registerSetting({
        key: "oldReplySort",
        sort: "style",
        label: "评论区优先展示按时间排序",
        sub: "疏于维护的特别需求",
        type: "switch",
        value: false,
        float: "B站曾经默认优先以时间顺序展示评论，并在最前列展示几条热评。本脚本尝试恢复过本功能，但如今已疏于维护。"
    })
    API.registerSetting({
        key: "anime",
        sort: "rewrite",
        label: "番剧分区",
        type: "switch",
        value: false,
        float: '重构以恢复旧版番剧分区。'
    })
    API.registerSetting({
        type: "row",
        sort: "player",
        key: "codecType",
        label: "优先载入的视频编码类型",
        value: "AVC",
        list: ["AVC", "HEVC", "AV1"],
        float: '播放器会尽量优先加载所选择的编码，可根据设备解码能力与实际需要调整这个设置项',
        action: type => {
            let mime = {
                "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
                "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"',
                "AVC": 'video/mp4;codecs="avc1.640028"'
            };
            if(!MediaSource.isTypeSupported(mime[type])) {
                toast.warning(`播放器不支持${type}编码格式`, "将继续使用AVC编码");
                config.codecType = "AVC";
            }
        }
    })
}
/**
 * 设置菜单标签
 */
interface MenuType {
    /**
     * 菜单项主键  
     * 新增时请一并拓展`MenuKey`名
     */
    key: string;
    /**
     * 菜单项名称
     */
    name: string;
    /**
     * 菜单项svg图标
     */
    svg?: string;
}
interface SettingCommon {
    /**
     * 设置项主键    
     * **注意不能与已有设置项重复**
     */
    key: string;
    /**
     * 菜单所属菜单名
     */
    sort: MenuKey;
    /**
     * svg格式的图标
     */
    svg?: string;
    /**
     * 设置项名称
     */
    label: string;
    /**
     * 设置项副名称，一般用于简介
     */
    sub?: string;
    /**
     * 设置项的浮动信息，用于详细说明设置项    
     * 该内容可以包含\<i\>、\<strong\>等HTML便签用于格式化信息  
     * ※ 理论上支持所有能以\<div\>为父节点的标签
     */
    float?: string;
    /**
     * 设置UI呼出时的回调，可用于调整显示。  
     */
    callback?: (this: HTMLDivElement) => void;
    /**
     * 隐藏设置，可用changeSettingMode方法改变其显示状态。  
     */
    hidden?: boolean;
}
interface SettingType {
    switch: SettingCommon & {
        /**
         * 滑块开关类设置
         */
        type: "switch";
        /**
         * 初始值  
         * **含有本项的设置会保存到本地，请使用type值拓展`config`接口以让别人知道本设置项存在**
         */
        value: boolean;
        /**
         * 用户调整设置时的回调函数，第一个参数为当前value值
         */
        action?: (value: Boolean) => void;
    }
    row: SettingCommon & {
        /**
         * 下拉框类设置
         */
        type: "row";
        /**
         * 初始值  
         * **含有本项的设置会保存到本地，请使用type值拓展`config`接口以让别人知道本设置项存在**
         */
        value: string | number;
        /**
         * 待选值列表
         */
        list: (string | number)[];
        /**
         * 用户调整设置时的回调函数，第一个参数为当前value值
         */
        action?: (value: string) => void
    }
    action: SettingCommon & {
        /**
         * 按钮型设置
         */
        type: "action";
        /**
         * 按钮上的文字
         */
        title: string;
        /**
         * 按下按钮时的会体哦啊函数
         */
        action: () => void;
        /**
         * 按钮禁用间隔，单位：/s，默认值3，0表示永远禁用。
         */
        disabled?: number;
    }
    input: SettingCommon & {
        /**
         * 输入框型设置
         */
        type: "input";
        /**
         * input标签属性
         */
        input: input;
        /**
         * 用户输入后的回调函数，第一个参数为用户输入的值
         */
        action?: (value: string) => void;
        /**
         * 在输入框后添加一个按钮，其值为按钮上的文字
         */
        title?: string;
        /**
         * 输入框中默认值  
         * **含有本项的设置会保存到本地，请使用type值拓展`config`接口以让别人知道本设置项存在**
         */
        value?: string | number;
        /**
         * 用于判定合法输入的正则表达式
         */
        pattern?: RegExp;
        /**
         * 按钮禁用间隔，单位：/s，默认值3，0表示永远禁用。
         */
        disabled?: number;
    }
    file: SettingCommon & {
        /**
         * 文件选择按钮型设置
         */
        type: "file";
        /**
         * 按钮上的文字
         */
        title: string;
        /**
         * 允许的文件拓展名列表，如`.txt`
         */
        accept?: string[];
        /**
         * 是否允许多选
         */
        multiple?: boolean;
        /**
         * 用户选择文件后的回调，第一个参数为`input.files`
         */
        action: (files: FileList) => void
    }
    mutlti: SettingCommon & {
        /**
         * 复选框类设置，区别下拉框型设置，可以不定多选。
         */
        type: "mutlti";
        /**
         * 默认选取的值列表，必须为`list`的子集  
         * **含有本项的设置会保存到本地，请使用type值拓展`config`接口以让别人知道本设置项存在**
         */
        value: string[];
        /**
         * 可选的值列表，为`value`的超集
         */
        list: string[];
        /**
         * 用户改变选择后的回调函数，第一个参数为`value`
         */
        action?: (value: string[]) => void
    }
    sort: SettingCommon & {
        /**
         * 设置分组，可将几个设置分为一组
         */
        type: "sort";
        /**
         * 组名
         */
        label: string;
        /**
         * 被分组的其他设置
         */
        list: SettingType[keyof SettingType][];
    }
    custom: SettingCommon & {
        /**
         * 自定义的设置
         */
        type: "custom";
        /**
         * 自定义的html字符串，支持以div标签为父标签的html标签
         */
        custom: string;
        /**
         * 设置UI呈现时的回调函数，将设置项本身作为第一个参数
         */
        flesh?: (obj: SettingType["custom"]) => void;
    }
    picture: Omit<SettingCommon, "label"> & {
        /**
         * 图片类设置
         */
        type: "picture";
        /**
         * 图片url
         */
        src: string;
    }
    icon: Omit<SettingCommon, "label" | "sort" | "key"> & {
        /**
         * 图标类设置
         */
        type: "icon";
        /**
         * 鼠标焦点时提示的文字
         */
        title: string;
        /**
         * 点击该图标时的回调
         */
        action: (node: HTMLDivElement) => void;
    }
}
/**
 * input标签的可选属性
 */
interface input {
    /**
     * 选择提交的文件类型，仅限type="file"  
     * `audio/*` `video/*` `image/*` `MIME_type`  
     */
    accept?: string;
    /**
     * 图像输入的替代文本，仅限type="image"
     */
    alt?: string;
    /**
     * 自动完成输入
     */
    autocomplete?: "on" | "off";
    /**
     * 页面加载时自动焦点
     */
    autofocus?: "autofocus";
    /**
     * 页面加载时自动选中，仅限ype="checkbox"或type="radio"
     */
    checked?: "checked";
    /**
     * 禁用输入框
     */
    disabled?: "disabled";
    /**
     * 所属的表单，复数时以逗号间隔
     */
    form?: string;
    /**
     * 提交表单时的URL，仅限type="submit"或type="image"
     */
    formaction?: string;
    /**
     * 表单数据使用的编码，仅限type="submit"或type="image"
     */
    formenctypeNew?: string;
    /**
     * 表单提交使用的HTTP方法，仅限type="submit"或type="image"
     */
    formmethod?: "GET" | "POST";
    /**
     * 覆盖表单标签的`novalidate`属性
     */
    formnovalidate?: "formnovalidate";
    /**
     * 由谁处理表单相应，取值内置关键词或对应的`framename`
     */
    formtarget?: "_blank" | "_self" | "_parent" | "_top" | string;
    /**
     * 元素高度：/px，仅限type="image"
     */
    height?: number;
    /**
     * 绑定的<datalist>元素的id
     */
    list?: string;
    /**
     * 接受输入的最大值
     */
    max?: number | string;
    /**
     * 输入框最大字符数
     */
    maxlength?: number;
    /**
     * 接受输入的最小值
     */
    min?: number | string;
    /**
     * 允许多个输入，仅限type="file"或type="email"
     */
    multiple?: "multiple";
    /**
     * 元素名称
     */
    name?: string;
    /**
     * 输入提示信息
     */
    placeholder?: string;
    /**
     * 只读元素
     */
    readonly?: "readonly";
    /**
     * 禁止空提交
     */
    required?: "required";
    /**
     * 元素可见宽度
     */
    size?: number;
    /**
     * 提交按钮的图片URL
     */
    src?: string;
    /**
     * 输入的合法间隔
     */
    step?: number;
    /**
     * 输入框类型
     */
    type?: "button" | "checkbox" | "color" | "date" | "datetime" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week"
    /**
     * 元素的宽度：/px，仅限type="image"
     */
    width?: number;
}