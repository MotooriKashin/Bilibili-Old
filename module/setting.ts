/**
 * 本模块负责集中注册相关设置项
 */
(function () {
    // 注册设置菜单
    API.registerMenu({ key: "common", name: "通用", svg: '<svg viewBox="0 0 24 24"><g><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g></svg>' });
    API.registerMenu({ key: "rewrite", name: "重写", svg: `<svg viewBox="0 0 24 24"><g><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g></svg>` });
    API.registerMenu({ key: "restore", name: "修复", svg: `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>` });
    API.registerMenu({ key: "style", name: "样式", svg: `<svg viewBox="0 0 24 24"><g><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>` });
    API.registerMenu({ key: "danmaku", name: "弹幕", svg: `<svg viewBox="0 0 22 22"><path d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z"></path><path d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z"></path></svg>` });
    API.registerMenu({ key: "player", name: "播放", svg: `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>` });
    API.registerMenu({ key: "live", name: "直播", svg: `<svg viewBox="0 0 1024 1024"><path d="M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0"></path><path d="M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556 0.142222 143.985778-64.156444 144.128-143.616 0.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-0.142222-143.701333 63.857778-144.128 143.104-0.426667 79.459556 63.644444 144.213333 143.104 144.64h0.512"></path><path d="M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504"></path></svg>` });
    API.registerMenu({ key: "module", name: "更新", svg: `<svg viewBox="0 0 24 24"><g><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"></path></g></svg>` });

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
    config.developer && ((<any>window).API = API);
    API.registerSetting({
        key: "rewriteMethod",
        sort: "rewrite",
        label: "重写模式",
        sub: "兼容性选项",
        type: "row",
        value: "同步",
        list: ["同步", "异步"],
        float: '同步模式能够更有效阻断原生脚本执行，减少原生脚本对于页面的破坏，<strong>缺点是与其他脚本或拓展兼容性不佳</strong>。</br>异步模式尝试提高兼容性，相对应的阻断效果下降，新版页面一闪而过现象加剧且受网络延时影响更大。'
    })
    API.registerSetting({
        key: "av",
        sort: "rewrite",
        label: "av/BV",
        type: "switch",
        value: true,
        float: '重写以恢复旧版av视频播放页。'
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
        float: "旧版播放器的时代点赞功能还未存在，本脚本代为设计了个丑丑的点赞功能。"
    })
    API.registerSetting({
        key: "medialist",
        sort: "rewrite",
        label: "medialist",
        type: "switch",
        value: false,
        float: "用旧版av页重构medialist页面。"
    })
    API.registerSetting({
        type: "switch",
        key: "index",
        label: "主页",
        value: true,
        sort: "rewrite",
        float: '重写以恢复旧版主页'
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
        float: `添加旧版播放器新版proto弹幕支持。由于旧版xml弹幕已获取不到90分钟后的弹幕，本功能默认启用。</br>”`
    })
    API.registerSetting({
        key: "liveDm",
        sort: "danmaku",
        label: "修复实时弹幕",
        sub: "及时接收别人新发的弹幕",
        type: "switch",
        value: true,
        float: `修复旧版播放器实时弹幕。`
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
        label: "拦截视频载入",
        sub: "用于临时不加载视频进入视频页面",
        float: "拦截播放器载入视频，强行使视频失效。",
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
            value: false
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
        float: '恢复旧版翻页评论区。'
    })
    API.registerSetting({
        key: "section",
        sort: "style",
        label: "统一换回旧版顶栏",
        sub: "针对未重写的页面",
        type: "switch",
        value: true,
        float: '非重写页面顶栏底栏也替换为旧版。'
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
        label: '恢复对于<a href="//space.bilibili.com/11783021" target="_blank">番剧出差</a>的访问',
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
        float: '重写以恢复旧版bangumi播放页。'
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
                key: "limitServer",
                sort: "player",
                label: "泰区代理",
                type: "input",
                value: "https://api.global.bilibili.com",
                float: "泰区番剧限制需要自备相应的代理服务器（无需末尾的斜杠！）。</br>本功能由于缺乏调试条件维护不善请多担待！",
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
        float: '重写以恢复旧版稍后再看。'
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
        key: "liveStream",
        label: "拦截直播流/轮播流",
        sub: "那我为什么点开直播？",
        value: false,
        sort: "live",
        float: "将直播间设为未开播状态，不加载直播流或者轮播视频，适用于想打开直播间但不想浪费带宽或流量的情况。</br>※ 脚本注入不够快时可能拦截失败，硬刷新`Ctrl+Shift+R`/`Shift + F5`可解。"
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
        key: "anchor",
        label: "禁用天选时刻",
        sub: "反正中不了的，哼！",
        value: false,
        sort: "live"
    })
    API.registerSetting({
        type: "switch",
        key: "pkvm",
        label: "禁用大乱斗",
        sub: "挡着我欣赏主播了",
        value: false,
        sort: "live"
    })
    API.registerSetting({
        type: "switch",
        key: "player",
        label: "嵌入",
        value: true,
        sort: "rewrite",
        float: '重写以恢复旧版嵌入播放器。'
    })
    API.registerSetting({
        type: "switch",
        key: "ranking",
        label: "排行榜",
        value: true,
        sort: "rewrite",
        float: "重写以恢复旧版全站排行榜。"
    })
    API.registerSetting({
        type: "switch",
        key: "read",
        label: "专栏",
        value: true,
        sort: "rewrite",
        float: "重写以启用旧版专栏。"
    })
    API.registerSetting({
        type: "switch",
        key: "unloginPopover",
        label: "移除未登录弹窗",
        sub: "有些时候就是喜欢不登录",
        value: false,
        sort: "style"
    })

    // 旧版播放器专属设置
    API.path.name && API.runWhile(() => API.path.name && (<any>window).player, () => {
        API.registerSetting({
            key: "onlineDanmaku",
            sort: "danmaku",
            label: "在线弹幕",
            type: "input",
            float: '为当前旧版播放器载入其他站内视频弹幕，可以输入URL或者aid等参数。</br>※ 可配合选择是否合并已有弹幕。',
            input: { type: "url", placeholder: "URL" },
            title: "载入",
            action: (url) => {
                if (!window.player?.setDanmaku) return toast.warning("内部组件丢失，已停止！");
                API.onlineDanmaku(url);
            }
        })
        API.registerSetting({
            key: "allDanmaku",
            sort: "danmaku",
            label: "全弹幕装填",
            type: "sort",
            float: '获取所有能获取的历史弹幕。</br><strong>※ 该操作耗时较长且可能造成B站临时封接口，请慎用！</strong>',
            list: [{
                key: "allDanmakuDelay",
                sort: "danmaku",
                label: "冷却时间：/s",
                type: "input",
                value: <any>3,
                input: { type: "number", min: 1, max: 60, step: 0.5 },
                float: '接口冷却时间，时间长可以降低被临时封端口的几率'
            },
            {
                key: "allDanmakuAction",
                sort: "danmaku",
                label: "开始获取",
                type: "action",
                title: "开始",
                action: function () {
                    if (!window.player?.setDanmaku) return toast.warning("内部组件丢失，已停止！");
                    API.allDanmaku();
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
            action: (files) => {
                (!window.player?.setDanmaku) && toast.warning("内部组件丢失，无法载入弹幕文件！");
                API.localMedia(files);
            }
        })
    })
})();
/**
 * 已注册的菜单，通过`registerMenu`新建项请补充这里的可能值
 * **本变量仅作为类型声明接口类似的东西存在，不可参与到任何实际运行代码中！**
 */
declare const settingSort: "common" | "rewrite" | "restore" | "style" | "danmaku" | "player" | "live" | "module" | "custom"
/**
 * 已注册设置项
 */
declare namespace config {
    /**
     * 开发者模式
     */
    let developer: boolean;
    /**
     * 重写：av/BV
     */
    let av: boolean;
    /**
     * 样式：UP主列表
     */
    let upList: boolean;
    /**
     * 播放：跳过充电鸣谢
     */
    let electric: boolean;
    /**
     * 播放：点赞功能
     */
    let enlike: boolean;
    /**
     * 重写：medialist
     */
    let medialist: boolean;
    /**
     * 重写：主页
     */
    let index: boolean;
    /**
     * 样式：过滤主页广告
     */
    let indexLoc: boolean;
    /**
     * 样式：去除个性化推荐
     */
    let privateRecommend: boolean;
    /**
     * 弹幕：互动弹幕
     */
    let commandDm: boolean;
    /**
     * 弹幕：新版弹幕
     */
    let protoDm: boolean;
    /**
     * 弹幕：实时弹幕
     */
    let liveDm: boolean;
    /**
     * 通用：日志拦截
     */
    let logReport: boolean;
    /**
     * 修复：视频心跳
     */
    let heartbeat: boolean;
    /**
     * 播放：拦截视频
     */
    let noVideo: boolean;
    /**
     * 样式：顶栏动图
     */
    let bannerGif: boolean;
    /**
     * 样式：弹幕优先
     */
    let danmakuFirst: boolean;
    /**
     * 样式：自动滚动到播放器
     */
    let showBofqi: boolean;
    /**
     * 样式：自动宽屏
     */
    let screenWide: boolean;
    /**
     * 样式：自动关弹幕
     */
    let noDanmaku: boolean;
    /**
     * 样式：自动播放
     */
    let autoPlay: boolean;
    /**
     * 播放：分段进度条
     */
    let segProgress: boolean;
    /**
     * 样式：翻页评论
     */
    let replyList: boolean;
    /**
     * 样式：顶栏底栏
     */
    let section: boolean;
    /**
     * 播放：弹幕合并
     */
    let concatDanmaku: boolean;
    /**
     * 弹幕：弹幕反查
     */
    let danmakuHashId: boolean;
    /**
     * 弹幕：全弹幕装填冷却时间
     */
    let allDanmakuDelay: number;
    /**
     * 修复：番剧出差
     */
    let errands: boolean;
    /**
     * 修复：相簿链接
     */
    let album: boolean;
    /**
     * 修复：注册时间
     */
    let jointime: boolean;
    /**
     * 修复：失效视频信息
     */
    let lostVideo: boolean;
    /**
     * 重写：bangumi
     */
    let bangumi: boolean;
    /**
     * 播放：解除限制
     */
    let videoLimit: boolean;
    /**
     * 播放：泰区代理服务器
     */
    let limitServer: string;
    /**
     * 播放：番剧回目列表
     */
    let bangumiEplist: boolean;
    /**
     * 样式：番剧分集数据
     */
    let episodeData: boolean;
    /**
     * 重写：稍后再看
     */
    let watchlater: boolean;
    /**
     * 样式：只显示视频历史
     */
    let history: boolean;
    /**
     * 样式：去除历史记录页面搜索框
     */
    let searchHistory: boolean;
    /**
     * 直播：拦截直播流
     */
    let liveStream: boolean;
    /**
     * 直播：P2P上传
     */
    let liveP2p: boolean;
    /**
     * 直播：禁止挂机检测
     */
    let sleepCheck: boolean;
    /**
     * 直播：禁用天选时刻
     */
    let anchor: boolean;
    /**
     * 直播：禁用大乱斗
     */
    let pkvm: boolean;
    /**
     * 重写：嵌入播放器
     */
    let player: boolean;
    /**
     * 重写：排行榜
     */
    let ranking: boolean;
    /**
     * 重写：专栏
     */
    let read: boolean;
    /**
     * 重写：重写模式
     */
    let rewriteMethod: string;
    /**
     * 样式：登录弹窗
     */
    let unloginPopover: boolean;
}
/**
 * 工具栏按钮
 */
interface ToolIcon {
    /**
     * 类型标志，用于识别这是工具栏按钮设置项
     */
    type: "icon";
    /**
     * 按钮 svg 图标字符串
     */
    svg: string;
    /**
     * 鼠标焦点按钮时提示的文字
     */
    title: string;
    /**
     * 鼠标单击时的回调
     */
    action: (node: HTMLDivElement) => void;
}
/**
 * 菜单项
 */
interface Menuitem {
    /**
     * 菜单主键（唯一），可以取已有的，也可以自定义
     */
    key: string;
    /**
     * 主键名字，简短的菜单分类名字，与 key 一一对应
     */
    name: string;
    /**
     * 菜单图标 svg 字符串
     */
    svg?: string;
}
/**
 * 图片类菜单项，可以作为banner或者下一项设置的图解说明等
 */
interface ItemPic {
    /**
     * 类型标志，用于识别这是图片类设置项
     */
    type: "picture";
    /**
     * 菜单归属分类菜单，也可以新建
     */
    sort: string;
    /**
     * 图片 URL
     */
    src: string;
}
interface ItemCommon {
    /**
     * 设置唯一主键，将作为全局变量`config`的属性名。  
     * **注意不能与已有设置项重复**
     */
    key: string;
    /**
     * 菜单归属分类菜单  
     * 可以使用已有的，参见接口`settingSort`  
     * 若要新建，请使用`API.registerMenu`添加，并补充`settingSort`声明的可能值
     */
    sort: typeof settingSort;
    /**
     * 设置 svg 图片
     */
    svg?: string;
    /**
     * 设置内容
     */
    label: string;
    /**
     * 内容附加简短介绍
     */
    sub?: string;
    /**
     * 鼠标移动到设置项时浮动信息，可以详细介绍设置的信息  
     * 该内容可以包含\<i\>、\<strong\>等HTML便签用于格式化信息  
     * ※ 理论上支持所有能以\<div\>为父节点的标签
     */
    float?: string;
}
/**
 * 开关类菜单项，用以给用户判断是否开启某些功能等  
 * 可以在`action`属性添加回调函数以立即响应用户的开关操作  
 * 否则可能需要刷新页面才会生效
 */
interface ItemSwh extends ItemCommon {
    /**
     * 类型标志，用于识别这是开关类设置项
     */
    type: "switch";
    /**
     * 设置的值，添加设置项时将作为默认值  
     * 实际时将以用户本地配置`config[key]`为准
     */
    value: boolean;
    /**
     * 点击该设置时的回调函数  
     * 将调整后的`value`作为参数传递  
     * 设置节点本身将作为`this`传递
     */
    action?: (value: Boolean) => void;
}
/**
 * 下拉框类菜单项，用于给用户从多个数值选一个等  
 * 可以在`action`属性添加回调函数以立即响应用户的开关操作  
 * 否则可能需要刷新页面才会生效
 */
interface ItemRow extends ItemCommon {
    /**
     * 类型标志，用于识别这是下拉框类设置项
     */
    type: "row";
    /**
     * 默认取值
     * 实际时将以用户本地配置`config[key]`为准
     */
    value: string;
    /**
     * 下拉框可选值列表
     */
    list: string[];
    /**
     * 改变选值后的回调函数  
     * 将调整后的`value`作为参数传递  
     * 设置节点本身将作为`this`传递
     */
    action?: (value: string) => void
}
/**
 * 按钮设置，用以用户点击按钮执行操作
 * 必须在`action`属性添加回调函数
 */
interface ItemPus extends ItemCommon {
    /**
     * 类型标志，用于识别这是按钮设置项
     */
    type: "action";
    /**
     * 按钮上的文字
     */
    title: string;
    /**
     * 点击按钮执行的回调函数  
     * 设置节点本身将作为this传入
     */
    action: () => void,
    /**
     * 点击按钮后临时禁用按钮多长时间，单位：/s，默认为 3  
     * 0 表示一直禁用直到刷新面板
     */
    disabled?: number;
}
/**
 * 输入框设置项，用以提供一个输入框与用户交互等
 * 需要自行将HTML的`input`标签配置以对象形式写入`input`属性
 */
interface ItemIpt {
    /**
     * 类型标志，用于识别这是输入框设置项
     */
    type: "input";
    /**
     * 菜单归属分类菜单，也可以新建
     */
    sort: string;
    /**
     * 设置 svg 图片
     */
    svg?: string;
    /**
     * 鼠标移动到设置项时浮动信息，可以详细介绍设置的信息  
     * 该内容可以包含<i>、<strong>等HTML便签用于格式化信息  
     * ※ 理论上支持所有能以<div>为父节点的标签
     */
    float?: string;
    /**
     * 输入框前面的文字，用来提示该输入框是干什么的
     */
    label: string;
    /**
     * 用于给`input`标签添加的属性  
     * 请自行通过合适的属性来指定`input`类型及其他要求
     */
    input: input;
    /**
     * 回调函数，用于接受用户输入内容以执行操作  
     * 将输入值作为参数传递  
     * 设置节点本身将作为`this`传递
     */
    action?: (value: string) => void;
    /**
     * 输入框后按钮上的文字
     */
    title?: string;
    /**
     * 设置项主键（唯一），可选  
     */
    key: string;
    /**
     * 默认值，输入框内的默认值
     * 这意味着本设置将保存到本地 config
     */
    value?: string;
    /**
     * 用于判断输入的正则表达式
     */
    pattern?: RegExp;
    /**
     * 点击按钮后临时禁用按钮多长时间，单位：/s，默认为 3  
     * 0 表示一直禁用直到刷新面板
     */
    disabled?: number;
}
/**
 * 文件选择设置项，用于提取本地文件读取等
 */
interface ItemFie extends ItemCommon {
    /**
     * 类型标志，用于识别这是文件选择设置项
     */
    type: "file";
    /**
     * 按钮上的文字
     */
    title: string;
    /**
     * 文件拓展名列表：如 `.txt`
     */
    accept?: string[];
    /**
     * 是否允许文件多选
     */
    multiple?: boolean;
    /**
     * 点击按钮执行的回调函数  
     * 设置节点本身将作为this传递
     * 将文件列表`input.files`作为参数传递
     */
    action: (files: FileList) => void
}
/**
 * 多选类菜单项，用以提供一组数据供用户不定多选等  
 * 可以在`action`属性添加回调函数以立即响应用户的开关操作
 * 如果值只有一个等于另一种形式的开关菜单只是回调还是数组  
 * 注意：任意选项改变都会触发回调
 */
interface ItemMut extends ItemCommon {
    /**
     * 类型标志，用于识别这是输入框设置项
     */
    type: "mutlti";
    /**
     * 设置主键（唯一），将作为用户本地设置`config`的属性名称
     */
    key: string;
    /**
     * 默认取值列表
     * 实际时将以用户本地配置`config[key]`为准
     */
    value: string[];
    /**
     * 所有选项列表
     */
    list: string[];
    /**
     * 改变选值后的回调函数  
     * 将调整后的`value`作为参数传递  
     * 设置节点本身将作为`this`传递
     */
    action?: (value: string[]) => void
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
/**
 * 归档一组设置，这组设置将在点击本条设置后展开  
 * 用于分组一些关联性很强或者同类的设置  
 * 可以看作是在菜单中再分类
 */
interface ItemSor extends ItemCommon {
    /**
     * 类型标志，用于识别这是分组集合设置项
     */
    type: "sort";
    /**
     * 类别名称
     */
    label: string;
    /**
     * 设置组，包含该类下属设置项
     */
    list: (ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon | ItemCus)[]
    ;
}
/**
 * 自定义设置项，本设置项支持使用HTML语法自定义设置项值的部分  
 * 如果预定义的设置类型满足不了需求，那么此种类型可能满足需求
 */
interface ItemCus extends ItemCommon {
    /**
     * 类型标志，用于识别这是自定义设置
     */
    type: "custom";
    /**
     * 设置主键（唯一），用于唯一确定设置项
     */
    key: string;
    /**
     * 要自定义显示的设置内容，可以使用所有支持在\<div\>标签下的HTML标签  
     * 内容完全封装在独立的shadowDOM中，这意味这可以使用独立的<style>标签而不用担心样式指示器影响到页面其他部分
     */
    custom: string;
    /**
     * 一个回调函数，设置项绘制后将执行该回调并将本设置数据以参数形式传递  
     * 您可以设置这个回调函数以接受参数信息，并在需要时对其进行更新，更新结果会及时同步在设置界面中。
     */
    flesh?: (obj: ItemCus) => void;
}
declare namespace API {
    /**
     * 注册设置项  
     * 脚本内置多种设置模型，用于往脚本设置界面添加设置
     * @param obj 设置对象
     */
    function registerSetting(obj: ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon | ItemCus): void;
    /**
     * 注册设置项所属菜单信息
     * @param obj 用于将设置分类，设置项中sort值即可这里注册的key值
     */
    function registerMenu(obj: Menuitem): void;
}
