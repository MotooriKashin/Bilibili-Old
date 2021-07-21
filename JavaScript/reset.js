/**
 * @module reset
 * @description 全局处理
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; // 模块上下文，由主模块定义
    const config = BLOD.config; // 脚本设置
    const xhr = BLOD.xhr; // XMLHttpRequest
    const toast = BLOD.toast; // Toastr
    const debug = BLOD.debug; // 调试信息

    class Reset {
        constructor() {
            this.switch = []; // 切P调用集
            BLOD.joinNode((msg) => this.switchCallback(msg)); // 添加切P监听
            BLOD.joinSwitchVideo = (callback) => this.switchVideo(callback); // 暴露切P调用接口

            this.switchVideo(() => {
                if (BLOD.avPlus) {
                    debug.msg(300, "视频已失效！", "加载弹幕", "缓存信息仅供参考", true, () => {
                        new OnlineDanmaku("aid=" + BLOD.aid + "&cid=" + BLOD.cid);
                    })
                }
                if (config.reset.novideo) {
                    debug.msg(300, "拦截视频页媒体载入用于呼出下载面板", "取消拦截", null, true, () => {
                        config.reset.novideo = 0;
                        BLOD.GM.setValue("config", config);
                        window.BilibiliPlayer({ aid: BLOD.aid, cid: BLOD.cid });
                    })
                }
                if (config.reset.download) { BLOD.xml = ""; BLOD.mdf = ""; }; // 刷新下载数据
                if (config.reset.selectdanmu && document.getElementsByClassName("bilibili-player-filter-btn")[1]) document.getElementsByClassName("bilibili-player-filter-btn")[1].click(); // 切换到弹幕列表
                setTimeout(() => {
                    if (config.reset.viewbofqi) BLOD.bofqiToView(); // 自动滚动到播放器
                    if (config.reset.widescreen && document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff")) document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").click(); // 自动宽屏
                    if (config.reset.danmakuoff && !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off")) {
                        if (document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")) {
                            document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku").click(); // 自动关闭弹幕
                        }
                    }
                });
                if (config.reset.autoplay) setTimeout(() => { window.player && window.player.play && window.player.play() }, 1000) // 自动播放
                if ((config.reset.closedCaption || config.reset.segProgress) && BLOD.path.name) {
                    //查询有无字幕，暂未支持泰区
                    BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/x/player/v2", { cid: BLOD.cid, aid: BLOD.aid }))
                        .catch(e => {
                            e = Array.isArray(e) ? e : [e];
                            debug.error("CC字幕接口", ...e);
                            // 移动端接口
                            return BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: BLOD.cid, aid: BLOD.aid, type: 1 }));
                        }).then((videoInfo) => {
                            videoInfo = BLOD.jsonCheck(videoInfo);
                            if (config.reset.closedCaption) {
                                BLOD.importModule("closedCaption"); // 添加cc字幕
                                BLOD.ClosedCaption(videoInfo);
                            }
                            if (config.reset.segProgress)
                                new SegProgress(videoInfo); // 添加分段进度条
                        });
                }
            })
        }
        /**
         * 添加切P调用
         * @param {function} callback 切P时回调
         */
        switchVideo(callback) {
            if (typeof callback === "function") this.switch.push(callback);
        }
        /**
         * 切P回调
         * @param {Event} msg 节点变动事件
         */
        switchCallback(msg) {
            if (/bilibili-player-video-btn-start/.test(msg.target.className)) {
                this.switch.forEach(d => d());
            }
        }
    }
    new Reset();

    /**
     * @class ReplyList
     * @description 恢复评论翻页
     */
    class ReplyList {
        constructor() {
            if (BLOD.path.name) return; // 忽略重写过的页面
            if (!config.reset.replyList) return;
            // 拦截评论脚本
            if (window.bbComment) return this.cover(); // 评论已载入直接覆盖
            // 监听评论脚本载入并覆盖
            Object.defineProperty(window, "bbComment", {
                set: () => { this.cover() },
                get: () => undefined,
                configurable: true
            })
        }
        cover() {
            delete window.bbComment; // 取消拦截
            BLOD.importModule("reply"); // 载入新评论脚本
        }
    }
    BLOD.joinNormal(() => new ReplyList());

    /**
     * @class ParameterTrim
     * @description URL处理，包含BV=>av，参数清理等
     */
    class ParameterTrim {
        constructor() {
            this.param = [
                "spm_id_from",
                "from_source",
                "msource",
                "bsource",
                "seid",
                "source",
                "session_id",
                "visit_id",
                "sourceFrom",
                "from_spmid"
            ];
            this.url = [];

            this.location(); // 优先处理地址栏
            BLOD.joinNormal(() => this.aitem()); // 正常回调
            BLOD.joinSwitchVideo(() => { this.location(); this.aitem(); }); // 切P回调
            BLOD.joinNode(() => { this.aitem() }); // 节点变动回调
        }
        /**
         * 处理地址栏
         */
        location() {
            this.url[1] = location.href; // 暂存URL，以便比较URL变化
            if (this.url[0] != this.url[1]) {
                let href = this.triming(location.href); // 处理链接
                if (!href.includes("#") && location.href.includes("#")) href = href + location.hash; // 还原锚
                window.history.replaceState(null, null, href); // 推送到地址栏
                this.url[0] = location.href; // 刷新暂存
            }
        }
        /**
         * 处理a标签
         */
        aitem() {
            document.querySelectorAll("a").forEach(d => {
                if (d.href && d.href.includes("bilibili.tv")) d.href = d.href.replace("bilibili.tv", "bilibili.com"); // 修复tv域名残留
                if (d.href && d.href.includes("www.bilibili.com/tag")) d.href = d.href.replace("tag", "topic"); // 修复topic链接
                if (d.href && d.href.includes("account.bilibili.com/login?act=exit")) {
                    // 代理旧版推出登录
                    d.href = "javascript:void(0);";
                    d.onclick = () => BLOD.loginExit();
                }
                if (d.href && !this.url.includes(d.href)) {
                    let hash = d.href.includes("#") ? "#" + d.href.split("#")[1] : ""; // 记录锚
                    hash = hash.includes("/") ? "" : hash; // 锚不在参数后，丢弃
                    d.href = this.triming(d.href, config.reset.bvid2av); // 清理参数
                    if (d.href.includes("?")) d.href = d.href + hash; // 还原锚
                    this.url.push(d.href); // 记处理过的参数，不再二次处理
                }
            })
        }
        /**
         * BV=>av
         * @param {string} url 被转化的链接
         * @param {boolean} [av] 是否转化为av
         */
        triming(url, av = true) {
            let obj = this.search(url); // 清理参数
            url = url.split("?")[0].split("/"); // 分割URL
            if (av) {
                url.forEach((d, i, e) => {
                    if (d.includes("#")) d = d.split("#")[0]; // 处理锚
                    if (d.toLowerCase().startsWith('bv')) e[i] = "av" + BLOD.abv(d); // BV=>av
                });
            }
            url = url.join("/"); // 还原URL
            return BLOD.objUrl(url, obj); // 还原参数
        }
        /**
         * 清除无用参数
         * @param {string} url 带参数的链接
         */
        search(url) {
            let obj = BLOD.urlObj(url); // 参数对象
            obj.bvid && (obj.aid = BLOD.abv(obj.bvid)); // 存在bvid，添加aid
            obj.aid && !Number(obj.aid) && (obj.aid = BLOD.abv(obj.aid)); // aid误为bvid，转化
            if (obj.from && obj.from == "search") obj.from = null; // 清理无效from参数
            this.param.forEach(d => {
                if (obj[d]) obj[d] = null; // 移除无效参数
            })
            return obj; // 返回有效参数
        }
    }
    new ParameterTrim();

    /**
     * 移除付费预览框
     * @param {HTMLElement} node 预览框节点
     */
    async function removePreview(node) {
        try {
            if (!config.reset.preview) return;
            let hint = document.getElementsByClassName("video-float-hint-text")[0];
            // 倒计时长度，单位：秒
            let i = 10;
            let sec = document.createElement("span");
            sec.setAttribute("class", "video-float-hint-btn second-cut");
            hint.parentNode.appendChild(sec);
            function cut() {
                sec.innerText = i - 1 + "s";
                if (i == 0) {
                    node.remove();
                    toast("移除付费预览提示框");
                    return;
                }
                i = i - 1;
                window.setTimeout(cut, 1000);
            }
            new cut();
        }
        catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("付费预览", ...e); }
    }
    BLOD.joinNode((msg) => {
        // 移除付费预览框
        if (/bilibili-player-video-toast-pay/.test(msg.target.className)) removePreview(msg.target)
        // 创建邮件下载菜单
        if (config.reset.download && /bilibili-player-context-menu-container black/.test(msg.target.className)) {
            BLOD.importModule("download");
            BLOD.download.right(msg.target);
        }
        // 移除登录弹窗
        if (!BLOD.uid && (/van-popover-\d+/.test(msg.target.id) || /lt-row/.test(msg.target.className))) msg.target.style.opacity = 0;
    });

    /**
     * @class Sction
     * @description 替换非重写页面的顶栏和底栏
     */
    class Sction {
        constructor() {
            this.emap = [
                { type: "text/javascript", src: "//static.hdslb.com/js/jquery.min.js" },
                { class: "z-top-container has-menu" },
                { type: "text/javascript", src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js" },
                { class: "footer bili-footer report-wrap-module", id: "home_footer" },
                { type: "text/javascript", src: "//static.hdslb.com/common/js/footer.js" }
            ]
            this.id = BLOD.joinNode(() => this.replace()); // 节点变动监听
            BLOD.jsonphook((xhr, jsonp) => {
                // 修复资讯区更新数目
                if (jsonp.url.includes('api.bilibili.com/x/web-interface/online')) {
                    let jsonpCallback = jsonp.jsonpCallback;
                    let call = window[jsonpCallback];
                    if (call) {
                        window[jsonpCallback] = function (v) {
                            v.data && (v.data.region_count[165] = v.data.region_count[202]);
                            return call.call(jsonp, v);
                        }
                    }
                }
            });
        }
        /**
         * 替换顶栏底栏
         * @returns {void}
         */
        replace() {
            if (!this.typo && document.querySelector("#bili-header-m")) { this.typo = true; this.fixTypo() }
            if (!this.tag) {
                this.blur = document.querySelector(".blur-bg");
                if (this.blur) {
                    this.tag = true;
                    if (config.reset.headblur) {
                        // 顶栏透明
                        this.blur.removeAttribute("style");
                    } else {
                        // 使顶栏模糊效果不再错位
                        BLOD.addCss("@supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {.blur-bg {background:none !important;-webkit-backdrop-filter: blur(4px);backdrop-filter: blur(4px)}}");
                    }
                    this.avatarAnimation();
                }
            }
            if (!config.reset.grobalboard) return;
            this.head = document.querySelector("#internationalHeader");
            this.foot = document.querySelector(".international-footer");

            if (document.querySelector("#bili-header-m") && document.querySelector("#internationalHeader")) {
                document.querySelector("#internationalHeader").remove(); // 重写完成移除新版顶栏
                BLOD.quitNode(this.id) // 取消节点监听
                this.avatarAnimation();
            }
            if (this.head && !this.flag1) {
                this.flag1 = true; // 标记重写过
                if (!window.$) BLOD.addElement("script", this.emap[0], undefined, true); // 检查jQuery
                this.head.setAttribute("style", "visibility:hidden;"); // 旧版顶栏未构建完临时隐藏新版
                if (document.querySelector(".mini-type") && !location.href.includes("blackboard/topic_list") && !location.href.includes("blackboard/x/act_list")) { this.emap[1].class = "z-top-container"; } // 识别mini顶栏
                if (BLOD.path.mhead) this.emap[1].class = "z-top-container"; // 识别标记的mini顶栏
                BLOD.addElement("div", this.emap[1], undefined, true); // 创建顶栏节点
                BLOD.addElement("script", this.emap[2], undefined, true); // 载入顶栏脚本
            }
            if (this.foot && !this.flag2) {
                this.flag2 = true;; // 标记重写过
                this.foot.remove();
                BLOD.addElement("div", this.emap[3]);
                BLOD.addElement("script", this.emap[4]);
            }
        }
        /**
         * 修复顶栏文字
         */
        fixTypo() {
            let node = document.querySelector("#bili-header-m").getElementsByClassName('nav-name');
            if (node[0]) {
                for (let i = 0; i < node.length; i++) {
                    if (node[i].textContent == "科技") {
                        node[i].textContent = "知识";
                        node[i].parentNode.href = "//www.bilibili.com/v/knowledge/";
                        node[i].parentNode.parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/knowledge/science/"><span>科学科普</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/social_science/"><span>社科·法律·心理</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/humanity_history/"><span>人文历史</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/business/"><span>财经商业</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/campus/"><span>校园学习</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/career/"><span>职业职场</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/design/"><span>设计·创意</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/skill/"><span>野生技能协会</span></a></li>`
                    }
                    if (node[i].textContent == "数码") {
                        node[i].textContent = "科技";
                        node[i].parentNode.href = "//www.bilibili.com/v/tech/";
                        node[i].parentNode.parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/tech/digital/"><span>数码</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/application/"><span>软件应用</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/computer_tech/"><span>计算机技术</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/industry/"><span>工业·工程·机械</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/diy/"><span>极客DIY</span></a></li>`
                    }
                    if (node[i].textContent == "广告") {
                        node[i].textContent = "资讯";
                        node[i].parentNode.href = "//www.bilibili.com/v/information/";
                        node[i].parentNode.parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/information/hotspot/"><span>热点</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/global/"><span>环球</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/social/"><span>社会</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/multiple/"><span>综合</span></a></li>`
                    }
                    if (node[i].textContent == "生活") {
                        node[i].parentNode.parentNode.children[1].children[2].remove(); // 移除美食圈
                        node[i].parentNode.parentNode.children[1].children[2].remove(); // 移除动物圈
                    }
                    if (node[i].textContent == "娱乐") node[i].parentNode.parentNode.children[1].lastChild.remove();
                }
            }
        }
        /**
         * 鼠标悬停在顶栏头像上时，头像的放大动画
         * @see 带注释css： https://github.com/MotooriKashin/Bilibili-Old/commit/b4009bb2dda204139e89f934afa206b302246911
         */
        avatarAnimation() {
            BLOD.addCss(".bili-header-m .profile-info .i-face .face{border:0}.bili-header-m .profile-info .i-face .pendant{transform:scale(0.5);width:112px;height:112px;left:-41px;bottom:-46px;opacity:0;transition:opacity .1s ease-in}.bili-header-m .profile-info.on .i-face{left:8px;top:0;height:32px;width:32px;transform:translateY(10px) translateX(-16px) scale(2);transform-origin:top left}.bili-header-m .profile-info.on .i-face .legalize{transform:scale(0.5) translate(10px,15px)}.bili-header-m .profile-info.on .i-face .pendant{opacity:1}.bili-header-m .profile-info.on .i-face .face{border:0;box-shadow:0 0 0 2px #fff}.bili-header-m .profile-info.on .i-face.scale-in{transform:translateY(5px) translateX(-10px) scale(1.75)}.bili-header-m .profile-info.on .scale-in .face{height:32px;width:32px}.bili-header-m .profile-info.on .i-face.scale-in .legalize{transform:scale(0.5) translate(38px,48px)}");
        }
    }
    new Sction();

    /**
     * @class HookTimeOut
     * @description hook setTimeout过滤旧版播放器强制初始化错误
     * @see indefined {@link https://github.com/indefined/UserScripts/issues/39#issuecomment-745279894}
     */
    class HookTimeOut {
        constructor() {
            this.hook = setTimeout;
            window.setTimeout = (...args) => {
                if (args[1] && args[1] == 1500 && args[0] && args[0].toString() == "function(){f.cz()}") {
                    toast.warning("禁用播放器强制初始化！", ...args)
                    return Number.MIN_VALUE;
                }
                return this.hook.call(window, ...args);
            }

        }
        relese() {
            window.setTimeout = this.hook;
        }
    }

    /**
     * 重构APP端playurl，result/data上层目录需另外构建
     * @see miyouzi {@link https://github.com/miyouzi/bilibili-helper/raw/0316840c56b3295377fc0f6b7095daa54bc6ac9d/packages/unblock-area-limit/src/api/biliplus.ts}
     */
    class RebuildPlayerurl {
        constructor() {
            this.playurl = {
                accept_description: ["高清 1080P+", "高清 1080P", "高清 720P", "清晰 480P", "流畅 360P"],
                accept_format: "hdflv2,flv,flv720,flv480,mp4",
                accept_quality: [112, 80, 64, 32, 16],
                bp: 0,
                code: 0,
                dash: {
                    audio: [],
                    dolby: { audio: [], type: "NONE" },
                    duration: 0,
                    min_buffer_time: 1.5,
                    minBufferTime: 1.5,
                    video: []
                },
                fnval: 0,
                fnver: 0,
                format: "flv480",
                from: "local",
                has_paid: false,
                is_preview: 0,
                message: "",
                no_rexcode: 1,
                quality: 32,
                result: "suee",
                seek_param: "start",
                seek_type: "offset",
                status: 2,
                support_formats: [
                    {
                        description: "高清 1080P+",
                        display_desc: "1080P",
                        format: "hdflv2",
                        need_login: true,
                        need_vip: true,
                        new_description: "1080P 高码率",
                        quality: 112,
                        superscript: "高码率"
                    },
                    {
                        description: "高清 1080P",
                        display_desc: "1080P",
                        format: "flv",
                        need_login: true,
                        new_description: "1080P 高清",
                        quality: 80,
                        superscript: ""
                    },
                    {
                        description: "高清 720P",
                        display_desc: "720P",
                        format: "flv720",
                        need_login: true,
                        new_description: "720P 高清",
                        quality: 64,
                        superscript: ""
                    },
                    {
                        description: "清晰 480P",
                        display_desc: "480P",
                        format: "flv480",
                        new_description: "480P 清晰",
                        quality: 32,
                        superscript: ""
                    },
                    {
                        description: "流畅 360P",
                        display_desc: "360P",
                        format: "mp4",
                        new_description: "360P 流畅",
                        quality: 16,
                        superscript: ""
                    }
                ],
                timelength: 0,
                type: "DASH",
                video_codecid: 7,
                video_project: true
            }
            this.codecs = {
                default: {
                    30112: 'avc1.640028', // 1080P+
                    30102: 'hev1.1.6.L120.90', // HEVC 1080P+
                    30080: 'avc1.640028', // 1080P
                    30077: 'hev1.1.6.L120.90', // HEVC 1080P
                    30064: 'avc1.64001F', // 720P
                    30066: 'hev1.1.6.L120.90', // HEVC 720P
                    30032: 'avc1.64001E', // 480P
                    30033: 'hev1.1.6.L120.90', // HEVC 480P
                    30011: 'hev1.1.6.L120.90', // HEVC 360P
                    30016: 'avc1.64001E', // 360P
                    30280: 'mp4a.40.2', // 高码音频
                    30232: 'mp4a.40.2', // 中码音频
                    30216: 'mp4a.40.2', // 低码音频
                },
                app: {
                    30016: 'avc1.64001E', // APP源 360P
                    30032: 'avc1.64001F', // APP源 480P
                    30064: 'avc1.640028', // APP源 720P
                    30080: 'avc1.640032', // APP源 1080P
                    30216: 'mp4a.40.2', // APP源 低码音频
                    30232: 'mp4a.40.2', // APP源 中码音频
                    30280: 'mp4a.40.2' // APP源 高码音频 
                }
            }
            this.frameRate = {
                30112: '16000/672',
                30102: '16000/672',
                30080: '16000/672',
                30077: '16000/656',
                30064: '16000/672',
                30066: '16000/656',
                30032: '16000/672',
                30033: '16000/656',
                30011: '16000/656',
                30016: '16000/672'
            }
            this.resolution = {
                30112: [1920, 1080], // 1080P+
                30102: [1920, 1080], // HEVC 1080P+
                30080: [1920, 1080], // 1080P
                30077: [1920, 1080], // HEVC 1080P
                30064: [1280, 720], // 720P
                30066: [1280, 720], // HEVC 720P
                30032: [852, 480], // 480P
                30033: [852, 480], // HEVC 480P
                30011: [640, 360], // HEVC 360P
                30016: [640, 360], // 360P
            }
        }
        /**
         * 获取链接ids
         * @param {string} url 下载链接
         * @param {number} duration 媒体时长
         */
        getIdxs(url, duration) {
            let range = Math.round(duration * 3.5);
            range = range < 6000 ? 6000 : range;
            return BLOD.xhr(url, 'arraybuffer', { 'Range': `bytes=0-${range}` }, false);
        }
        /**
         * 过滤问题音频
         * @param {[]} audio 音频数据数组
         */
        fixAudio(audio) {
            return audio.reduce((arr, d) => {
                if (d.id == 30232 || d.id == 30280 || d.id == 30216) arr.push(d);
                return arr;
            }, [])
        }
        /**
         * 重构APP端数据
         * @param {{}} app 原始数据对象
         */
        async appPlayurl(app) {
            if (app.durl) return app;
            if (app.dash.duration) {
                app.dash.audio = this.fixAudio(app.dash.audio);
                return app;
            }
            toast("重构DASH数据中...");
            for (let key in app) this.playurl[key] = app[key];
            // duration向上取整
            this.playurl.dash.duration = Math.ceil(app.timelength / 1000);
            this.playurl.dash.minBufferTime = this.playurl.dash.min_buffer_time = 1.5;
            // 构造Promise序列以同时获取所有DASH媒体segment数据
            // 本应由播放器自行获取，B站官方称之为【首帧优化】却在缺失时直接报错导致播放器无法正常载入视频
            let arr = [];
            this.playurl.dash.video.forEach((d, i, e) => {
                arr.push((async (d) => {
                    BLOD["sidx" + String(BLOD.cid)] = BLOD["sidx" + String(BLOD.cid)] || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (d.SegmentBase) BLOD["sidx" + String(BLOD.cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange]
                    if (!BLOD["sidx" + String(BLOD.cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        // 首个“sidx”出现4字节之前的部分为索引起始点
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        // 首个“mooc”出现前5字节结束索引
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        // 挂载到BLOD下，切换清晰度直接继承使用（以cid为切p标记）
                        BLOD["sidx" + String(BLOD.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-video：", id, BLOD["sidx" + String(BLOD.cid)][id]);
                    }
                    d.segment_base = {
                        initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                        index_range: BLOD["sidx" + String(BLOD.cid)][id][1]
                    };
                    d.SegmentBase = {
                        Initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                        indexRange: BLOD["sidx" + String(BLOD.cid)][id][1]
                    }
                    d.backupUrl = d.backup_url = d.backupUrl || d.backup_url || [];
                    d.baseUrl = d.base_url;
                    d.codecs = d.codecs || this.codecs.app[id] || this.codecs.default[id];
                    d.frameRate = d.frame_rate = d.frameRate || d.frame_rate || this.frameRate[id];
                    d.height = d.height || this.resolution[id][1];
                    d.width = d.width || this.resolution[id][0];
                    d.mimeType = d.mime_type = d.mimeType || d.mime_type || 'video/mp4';
                    d.sar = d.sar || "1:1";
                    d.startWithSAP = d.start_with_sap = d.startWithSAP || d.start_with_sap || 1;
                })(e[i]))
            })
            this.playurl.dash.audio = this.fixAudio(this.playurl.dash.audio);
            this.playurl.dash.audio.forEach((d, i, e) => {
                arr.push((async (d) => {
                    BLOD["sidx" + String(BLOD.cid)] = BLOD["sidx" + String(BLOD.cid)] || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (d.SegmentBase) BLOD["sidx" + String(BLOD.cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange]
                    if (!BLOD["sidx" + String(BLOD.cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        BLOD["sidx" + String(BLOD.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-audio：", id, BLOD["sidx" + String(BLOD.cid)][id]);
                    }
                    d.segment_base = {
                        initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                        index_range: BLOD["sidx" + String(BLOD.cid)][id][1]
                    };
                    d.SegmentBase = {
                        Initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                        indexRange: BLOD["sidx" + String(BLOD.cid)][id][1]
                    }
                    d.backupUrl = d.backup_url = d.backupUrl || d.backup_url || [];
                    d.baseUrl = d.base_url;
                    d.codecs = d.codecs || this.codecs.app[id] || this.codecs.default[id] || "mp4a.40.2";
                    d.mimeType = d.mime_type = d.mimeType || d.mime_type || 'audio/mp4';
                })(e[i]))
            })
            toast("等待数据回传...");
            if (arr[0]) await Promise.all(arr);

            // video排序
            let avc = [], hev = [], video = [];
            this.playurl.dash.video.forEach(d => {
                if (d.codecid == 7) avc.push(d);
                else hev.push(d);
            })
            let length = avc.length > hev.length ? avc.length : hev.length;
            for (let i = length - 1; i >= 0; i--) {
                if (avc[i]) video.push(avc[i]);
                if (hev[i]) video.push(hev[i]);
            }
            this.playurl.dash.video = video;
            toast.success("DASH数据重构成功！", "正在投喂给播放器...");
            debug.log(this.playurl);
            return this.playurl;
        }
        /**
         * 重构Thailand数据
         * @param {{}} ogv 原始数据
         */
        async ogvPlayurl(ogv) {
            toast("重构DASH数据中...");
            this.playurl.quality = ogv.data.video_info.quality;
            let num = this.playurl.accept_quality.indexOf(this.playurl.quality);
            this.playurl.format = this.playurl.accept_format.split(",")[num];
            this.playurl.timelength = ogv.data.video_info.timelength;

            this.playurl.accept_quality.splice(0, num);
            this.playurl.support_formats.splice(0, num);
            this.playurl.accept_description.splice(0, num);
            this.playurl.accept_format = this.playurl.accept_format.split(",");
            this.playurl.accept_format.splice(0, num);
            this.playurl.accept_format = this.playurl.accept_format.join(",");

            this.playurl.dash.duration = Math.ceil(this.playurl.timelength / 1000);
            this.playurl.dash.minBufferTime = this.playurl.dash.min_buffer_time = 1.5;

            let arr = [];
            ogv.data.video_info.stream_list.forEach(d => {
                if (d.dash_video && d.dash_video.base_url) {
                    arr.push((async (d) => {
                        BLOD["sidx" + String(BLOD.cid)] = BLOD["sidx" + String(BLOD.cid)] || {};
                        let id = d.dash_video.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                        if (!BLOD["sidx" + String(BLOD.cid)][id]) {
                            let data = new Uint8Array(await this.getIdxs(d.dash_video.base_url, this.playurl.dash.duration));
                            let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                            let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                            let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                            BLOD["sidx" + String(BLOD.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                            debug("DASH-video：", id, BLOD["sidx" + String(BLOD.cid)][id]);
                        }
                        this.playurl.dash.video.push({
                            SegmentBase: {
                                Initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                                indexRange: BLOD["sidx" + String(BLOD.cid)][id][1]
                            },
                            segment_base: {
                                initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                                index_range: BLOD["sidx" + String(BLOD.cid)][id][1]
                            },
                            backupUrl: [],
                            backup_url: [],
                            bandwidth: d.dash_video.bandwidth,
                            baseUrl: d.dash_video.base_url,
                            base_url: d.dash_video.base_url,
                            codecid: d.dash_video.codecid,
                            codecs: this.codecs.app[id] || this.codecs.default[id],
                            frameRate: this.frameRate[id],
                            frame_rate: this.frameRate[id],
                            height: this.resolution[id][1],
                            id: d.stream_info.quality,
                            md5: d.dash_video.md5,
                            mimeType: "video/mp4",
                            mime_type: "video/mp4",
                            sar: "1:1",
                            size: d.dash_video.size,
                            startWithSAP: 1,
                            start_with_sap: 1,
                            width: this.resolution[id][0]
                        })
                    })(d))
                }
            })
            ogv.data.video_info.dash_audio.forEach(d => {
                arr.push((async (d) => {
                    BLOD["sidx" + String(BLOD.cid)] = BLOD["sidx" + String(BLOD.cid)] || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (!BLOD["sidx" + String(BLOD.cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        BLOD["sidx" + String(BLOD.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-audio：", id, BLOD["sidx" + String(BLOD.cid)][id]);
                    }
                    this.playurl.dash.audio.push({
                        SegmentBase: {
                            Initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                            indexRange: BLOD["sidx" + String(BLOD.cid)][id][1]
                        },
                        segment_base: {
                            initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                            index_range: BLOD["sidx" + String(BLOD.cid)][id][1]
                        },
                        backupUrl: [],
                        backup_url: [],
                        bandwidth: d.bandwidth,
                        baseUrl: d.base_url,
                        base_url: d.base_url,
                        codecid: d.codecid,
                        codecs: this.codecs.app[id] || this.codecs.default[id],
                        frameRate: "",
                        frame_rate: "",
                        height: 0,
                        id: id,
                        md5: d.md5,
                        mimeType: "audio/mp4",
                        mime_type: "audio/mp4",
                        sar: "",
                        size: d.size,
                        startWithSAP: 0,
                        start_with_sap: 0,
                        width: 0
                    })
                })(d))
            })
            toast("等待数据回传...");
            await Promise.all(arr);
            toast.success("DASH数据重构成功！", "正在投喂给播放器...");
            debug.log(this.playurl);
            return this.playurl;
        }
    }

    /**
     * @class PlayLimit
     * @description 模拟xhr send代理链接
     */
    class PlayLimit {
        constructor() {
            BLOD.playLimit = {
                mobile: (xhr, url) => this.mobile(xhr, url),
                bigvip: (xhr, url) => this.bigvip(xhr, url),
                area: (xhr, url) => this.area(xhr, url)
            }
        }
        /**
         * 使用移动端接口
         * @param {XMLHttpRequest} xhr 代理的XMLHttpRequest对象
         * @param {string} url 代理的URL
         */
        async mobile(xhr, url) {
            this.defineProperty(xhr) // 解锁XMLHttpRequest只读属性
            this.accesskey = BLOD.GM.getValue("access_key") || null; // 读取移动端鉴权，需要单独在设置里开启
            this.obj = BLOD.urlObj(url); // 转化url为对象备用
            this.obj = Object.assign(this.obj, { access_key: this.accesskey, fnval: null, fnver: null, platform: "android_i" }) // 重构url对象，移动端接口缺少Idxs，强制返回flv
            try {
                toast.info("尝试解除APP限制... 使用移动端flv接口");
                this.response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.urlSign("https://api.bilibili.com/pgc/player/api/playurl", this.obj, 1))); // 构造并访问移动端接口
                this.response = { "code": 0, "message": "success", "result": this.response };
                BLOD.__playinfo__ = this.response; // 记录播放地址
                toast.success("解除APP限制！", "aid=" + BLOD.aid, "cid=" + BLOD.cid);
            } catch (e) {
                e = Array.isArray(e) ? e : [e];
                toast.error("解除APP限制失败", ...e);
                this.response = { "code": -404, "message": e, "data": null }; // 代理失败，修改返回值为404
            }
            this.postResponse(xhr, url); // 推送给播放器
        }
        /**
         * 特殊视频
         * @param {XMLHttpRequest} xhr 代理的XMLHttpRequest对象
         * @param {string} url 代理的URL
         */
        async bigvip(xhr, url) {
            this.defineProperty(xhr) // 解锁XMLHttpRequest只读属性
            this.response = BLOD.bigvip ? await BLOD.bigvip(BLOD.urlObj(url)) : { "code": -404, "message": "错误", "data": null };
            BLOD.__playinfo__ = this.response; // 记录播放地址
            this.postResponse(xhr, url); // 推送给播放器
        }
        /**
         * 一般区域限制
         * @param {XMLHttpRequest} xhr 代理的XMLHttpRequest对象
         * @param {string} url 代理的URL
         */
        async area(xhr, url) {
            if (BLOD.thailand) return this.thailand(xhr, url); // 转到泰区
            this.defineProperty(xhr) // 解锁XMLHttpRequest只读属性
            this.accesskey = BLOD.GM.getValue("access_key") || null; // 读取移动端鉴权，需要单独在设置里开启
            this.obj = BLOD.urlObj(url); // 转化url为对象备用
            this.obj = Object.assign(this.obj, { access_key: this.accesskey, module: "bangumi" }) // 重构url对象
            this.obj.fnval = this.obj.fnval ? 16 : null; // 该接口目前只支持16
            try {
                toast.info("尝试解除区域限制... 访问代理服务器");
                this.response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl("https://www.biliplus.com/BPplayurl.php", this.obj))); // 访问代理服务器
                this.response = await new RebuildPlayerurl().appPlayurl(this.response); // 重构DASH情形
                this.response = { "code": 0, "message": "success", "result": this.response };
                BLOD.__playinfo__ = this.response; // 记录播放地址
                toast.success("解除区域限制！", "aid=" + BLOD.aid, "cid=" + BLOD.cid);
            } catch (e) {
                e = Array.isArray(e) ? e : [e];
                toast.error("解除区域限制失败", ...e);
                this.response = { "code": -404, "message": e, "data": null }; // 代理失败，修改返回值为404
            }
            this.postResponse(xhr, url); // 推送给播放器
        }
        /**
         * 泰区限制
         * @param {XMLHttpRequest} xhr 代理的XMLHttpRequest对象
         * @param {string} url 代理的URL
         */
        async thailand(xhr, url) {
            this.defineProperty(xhr) // 解锁XMLHttpRequest只读属性
            this.obj = BLOD.urlObj(url); // 转化url为对象备用
            this.thai = BLOD.GM.getValue("thaiLand") || "https://api.global.bilibili.com";
            try {
                toast.info("尝试解除泰区限制... 访问代理服务器");
                this.response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl(`${this.thai}/intl/gateway/v2/ogv/playurl`, { aid: this.obj.avid || BLOD.aid, ep_id: this.obj.ep_id, download: 1 }))); // 访问代理服务器
                this.response = await new RebuildPlayerurl().ogvPlayurl(this.response); // 重构DASH情形
                this.response = { "code": 0, "message": "success", "result": this.response };
                BLOD.__playinfo__ = this.response; // 记录播放地址
                toast.success("解除泰区限制！", "aid=" + BLOD.aid, "cid=" + BLOD.cid);
            } catch (e) {
                e = Array.isArray(e) ? e : [e];
                toast.error("解除泰区限制失败", ...e);
                this.response = { "code": -404, "message": e, "data": null }; // 代理失败，修改返回值为404
            }
            this.postResponse(xhr, url); // 推送给播放器
        }
        /**
         * 解锁XMLHttpRequest只读属性
         * @param {XMLHttpRequest} xhr 代理的XMLHttpRequest对象
         */
        defineProperty(xhr) {
            this.hookTimeOut = new HookTimeOut(); // 禁用播放器强制初始化
            this.response = {}; // xhr返回值
            this.progress = setInterval(() => { xhr.dispatchEvent(new ProgressEvent("progress")) }, 50); // 模拟xhr进展事件，50ms/次
            xhr.dispatchEvent(new ProgressEvent("loadstart")); // 模拟xhr loadstart事件
            Object.defineProperty(xhr, "response", { writable: true }); // 解锁response属性
            Object.defineProperty(xhr, "responseText", { writable: true }); // 解锁responseText属性
            Object.defineProperty(xhr, "responseURL", { writable: true }); // 解锁responseURL属性
            Object.defineProperty(xhr, "readyState", { writable: true }); // 解锁readyState属性
            Object.defineProperty(xhr, "status", { writable: true }); // 解锁status属性
            xhr.status = 200; // 模拟链接成功
            xhr.readyState = 2; // 模拟链接进展
            xhr.dispatchEvent(new ProgressEvent("readystatechange")); // 模拟xhr readystatechange事件，对应对readyState的修改
        }
        /**
         * 推送返回值给播放器
         * @param {XMLHttpRequest} xhr 代理的XMLHttpRequest对象
         * @param {string} url 代理的URL
         */
        postResponse(xhr, url) {
            clearInterval(this.progress); // 停止模拟xhr响应
            xhr.responseURL = url; // 写入xhr url
            xhr.response = xhr.responseText = JSON.stringify(this.response); // 写入返回值
            xhr.readyState = 4; // 写入xhr 返回标记
            xhr.dispatchEvent(new ProgressEvent("readystatechange")); // 模拟xhr readystatechange事件，对应对readyState的修改
            xhr.dispatchEvent(new ProgressEvent("load")); // 模拟xhr load事件
            xhr.dispatchEvent(new ProgressEvent("loadend")); // 模拟xhr loadend事件
            this.hookTimeOut.relese(); // 释放播放器延时
        }
    }
    new PlayLimit();

    /**
     * @class RelpyFloor
     * @description 修复评论楼层，大部分已由原生脚本负责，这里只负责远古评论楼中楼
     */
    class RelpyFloor {
        constructor() {
            this.floor = []; // 楼层记录
            this.key = ["top", "hots", "replies", "root"]; // 评论类型
            BLOD.replyFloor = (v) => this.replyFloor(v); // 暴露评论记录

            BLOD.joinNode((msg) => {
                if ((/l_id/.test(msg.target.id) || /reply-wrap/.test(msg.target.className))) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        delete this.timer;
                        this.fix(); // 处理楼中楼
                        if (config.reset.commentjump) this.renameCommentJump(); // 还原跳转链接
                    }, 100)
                }
            })
        }
        /**
         * 整理评论楼层数据
         * @param {{}} v 评论返回值，由jsonp hook捕获
         */
        replyFloor(v) {
            v = v.data;
            if (!v) return;
            if (v.upper && v.upper.top) {
                if (Array.isArray(v.top)) v.top.push(v.upper.top);
                else v.top = v.upper.top;
            }
            this.key.forEach((d) => {
                if (v[d]) {
                    d = Array.isArray(v[d]) ? v[d] : [v[d]]
                    d.forEach((d) => {
                        this.floor[d.rpid] = d.floor;
                        if (d.replies) {
                            d.replies.forEach((d) => {
                                this.floor[d.rpid] = d.floor;
                            })
                        }
                    })
                }
            })
        }
        /**
         * 处理楼中楼
         */
        fix() {
            let floor = this.floor || {};
            let li = document.querySelectorAll(".reply-item.reply-wrap");
            if (li[0]) {
                li.forEach((d) => {
                    let span = d.querySelector(".floor");
                    let id = d.getAttribute("data-id");
                    if (!span && floor[id]) {
                        span = d.querySelector(".info");
                        span.innerHTML = '<span class="floor-num" style="float: left;color: #aaa;padding-right: 10px;">#' + floor[id] + '</span>' + span.innerHTML;
                    }
                })
            } else {
                li = document.querySelectorAll("li");
                li.forEach((d) => {
                    if (d.id.includes("l_id_")) {
                        let span = d.querySelector(".floor-date");
                        let id = d.id.split('_')[2];
                        if (span.parentNode.children.length === 1 && floor[id]) {
                            span.parentNode.innerHTML = '<span class="floor-num" style="float: left;color: #aaa;padding-right: 10px;">#' + floor[id] + '</span>' + span.outerHTML;
                        }
                    }
                })
            }
        }
        /**
         * 还原评论跳转链接为av号
         */
        renameCommentJump() {
            if (!config.reset.commentjump) return;
            document.querySelectorAll(".comment-jump-url").forEach((d, i, e) => {
                if (d.href && !d.href.includes(d.innerText)) {
                    d = d.href.split("/");
                    d = d[d.length - 1] || d[d.length - 2];
                    if (config.reset.bvid2av && d.toLowerCase().startsWith('bv')) d = BLOD.abv(d);
                    e[i].title = e[i].innerHTML;
                    e[i].innerHTML = d;
                }
            })
        }
    }
    new RelpyFloor();

    /**
     * @class LocalMedia
     * @description 使旧版播放器支持载入本地视频或弹幕
     */
    class LocalMedia {
        constructor() {
            if (document.querySelector("#local-danmaku")) return;
            this.element = '<label class="button" role="button" title="载入本地视频或弹幕">本地文件<input id="local-danmaku" type="file" accept=".mp4,.xml,.json" multiple/></label>';
            this.style = '.bpui-checkbox-text.local-danmaku label{ cursor: pointer; } .bpui-checkbox-text.local-danmaku #local-danmaku { opacity:0; width: 0; }';
            let icon = document.querySelector(".bilibili-player-iconfont-danmaku");
            if (!icon) return;
            icon.onmouseover = () => {
                if (this.timer) return;
                if (!BLOD.setDanmaku) return debug.warn("无法启动本地文件功能");
                this.timer = setTimeout(() => this.init(), 100);
            }
        }
        /**
         * 初始化按钮
         */
        init() {
            this.parrent = document.querySelector(".bilibili-player-danmaku-setting-lite");
            if (!this.parrent) return;
            BLOD.addCss(this.style, "localDmStyle");
            this.parrent = this.parrent.children[2];
            this.node = BLOD.addElement("span", { class: "bpui-checkbox-text local-danmaku" }, this.parrent);
            this.node.innerHTML = this.element;
            this.input = this.node.querySelector("#local-danmaku");
            this.input.onchange = () => { this.change() }
        }
        /**
         * 读取文件地址
         */
        change() {
            const file = this.input.files;
            if (file.length === 0) {
                this.input.value = "";
                return toast.warning("请选择本地视频或弹幕文件！", "视频：.mp4（且符合浏览器支持的编码）", "弹幕：.xml, .json");
            }
            this.data = Array.from(file).reduce((d, i) => {
                /\.xml$/.test(i.name) && d.xml.push(i); // xml弹幕
                /\.json$/.test(i.name) && d.json.push(i); // json弹幕
                /\.mp4$/.test(i.name) && d.mp4.push(i); // mp4视频
                return d;
            }, { mp4: [], xml: [], json: [] })
            if (!this.data.xml[0] && !this.data.json[0] && !this.data.mp4[0]) {
                this.input.value = "";
                return toast.warning("未能识别到任何有效文件信息 →_→");
            }
            this.video();
            this.danmaku();
            // 成功载入清除上传文件控件内容
            this.input.value = "";
        }
        /**
         * 读取文件内容
         * @param {File} file 记录本地文件信息的 file 对象
         */
        readFile(file) {
            return new Promise((resolve, reject) => {
                if (!file) reject(toast.error('无效文件路径！'));
                const reader = new FileReader();
                reader.readAsText(file, 'utf-8');
                reader.onload = () => {
                    resolve(reader.result);
                }
                reader.onerror = () => {
                    reject(toast.error('读取文件出错，请重试！'));
                    // 成功失败清除上传文件控件内容
                    this.input.value = ""
                }
            })
        }
        /**
         * 载入弹幕
         * @returns {void}
         */
        async danmaku() {
            if (!BLOD.loadLocalDm) {
                this.input.value = "";
                return toast.error("载入本地弹幕失败：本地弹幕组件丢失！");
            }
            if (!this.data.xml[0] && !this.data.json[0]) return;
            this.data.xml.forEach(async (d, i) => {
                // 读取xml弹幕
                let data = await this.readFile(d);
                toast("本地弹幕：" + d.name, "载入模式：" + ((i || config.reset.concatDanmaku) ? "与当前弹幕合并" : "替换当前弹幕"));
                BLOD.loadLocalDm(data, i || config.reset.concatDanmaku);
            })
            this.data.json.forEach(async (d, i) => {
                // 读取json弹幕
                let data = JSON.parse(await this.readFile(d)) || [];
                toast("本地弹幕：" + d.name, "载入模式：" + ((this.data.xml[0] || i || config.reset.concatDanmaku) ? "与当前弹幕合并" : "替换当前弹幕"));
                BLOD.setDanmaku(data, this.data.xml[0] || i || config.reset.concatDanmaku);
            })
            debug.msg();
            this.offset = 0; // 记录或重置弹幕偏移时间
            if (!BLOD.offsetDanmaku) return toast.error("绑定键盘事件失败：弹幕偏移组件丢失！")
            else {
                toast("已绑定键盘事件", "可以通过键盘 , 和 . 两个键（即上标为 < 和 > 的两个键）提前或延后弹幕偏移，频度1秒/次");
                if (!this.keyboard) {
                    this.keyboard = true;
                    document.addEventListener("keydown", (ev) => {
                        switch (ev.key) {
                            case ",":
                                BLOD.offsetDanmaku(-1);
                                this.offset--;
                                debug.msg(undefined, "弹幕偏移：", this.offset + " 秒");
                                break;
                            case ".":
                                BLOD.offsetDanmaku(1);
                                this.offset++;
                                debug.msg(undefined, "弹幕偏移：", this.offset + " 秒");
                                break;
                            default:
                                break;
                        }
                    })
                }
            }
        }
        /**
         * 载入视频
         */
        video() {
            if (this.data.mp4[0]) {
                toast.warning("载入本地视频中...", "请无视控制台大量报错！")
                let video = document.querySelector("video");
                video.src = URL.createObjectURL(this.data.mp4[0]);
                toast.success("本地视频：" + this.data.mp4[0].name);
                document.querySelector(".bilibili-player-video-progress").addEventListener("click", e => {
                    // 修复鼠标事件
                    video.currentTime = document.querySelector(".bpui-slider-handle").style.left / 100 * video.duration;
                })
                document.querySelector(".bilibili-player-video-time-total").textContent = this.time(video.duration); // 修复总时长
            }
        }
        /**
         * 格式化时间轴
         * @param {number} time 时间/秒
         * @returns {number} mm:ss
         */
        time(time) {
            time = Number(time) || 0;
            let s = time % 60;
            let m = (time - s) / 60;
            s = (Array(2).join('0') + s).slice(-2);
            m = m < 10 ? (Array(2).join('0') + m).slice(-2) : m;
            return `${m}:${s}`
        }
    }
    if (config.reset.localDanmaku) BLOD.joinSwitchVideo(() => setTimeout(() => { new LocalMedia() }, 1000));

    /**
     * @class DanmakuHashId
     * @description 反查弹发送者信息
     */
    class DanmakuHashId {
        /**
         * 反查弹发送者信息
         * @param {string} crc 8 位 crc32 哈希值
         * @returns 预生成的占位文本
         */
        constructor(crc) {
            BLOD.importModule("crc");
            this.style = `.bb-comment, .comment-bilibili-fold {
                font-family: Microsoft YaHei,Arial,Helvetica,sans-serif;
                font-size: 0;
                zoom: 1;
                min-height: 100px;
                background: #fff;
            }.bb-comment .comment-list, .comment-bilibili-fold .comment-list {
                padding-top: 20px;
            }.bb-comment *, .comment-bilibili-fold * {
                box-sizing: content-box;
            }.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face {
                display: inline-block;
                position: relative;
                margin-right: 10px;
                vertical-align: top;
            }.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face img, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face img {
                width: 24px;
                height: 24px;
                border-radius: 50%;
            }.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con {
                display: inline-block;
                width: calc(100% - 34px);
            }.bb-comment .comment-list .list-item .user, .comment-bilibili-fold .comment-list .list-item .user {
                font-size: 12px;
                font-weight: 700;
                line-height: 18px;
                padding-bottom: 4px;
                display: block;
                word-wrap: break-word;
                position: relative;
            }.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con .user .name, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con .user .name {
                position: relative;
                top: -1px;
            }.bb-comment .comment-list .list-item .reply-box .reply-item .level, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .level {
                margin: 0 15px 0 8px;
            }.bb-comment .comment-list .list-item .user .level.l0,.comment-bilibili-fold .comment-list .list-item .user .level.l0 {
                background-position: -23px -28px
            }.bb-comment .comment-list .list-item .user .level.l1,.comment-bilibili-fold .comment-list .list-item .user .level.l1 {
                background-position: -23px -92px
            }.bb-comment .comment-list .list-item .user .level.l2,.comment-bilibili-fold .comment-list .list-item .user .level.l2 {
                background-position: -23px -156px
            }.bb-comment .comment-list .list-item .user .level.l3,.comment-bilibili-fold .comment-list .list-item .user .level.l3 {
                background-position: -23px -220px
            }.bb-comment .comment-list .list-item .user .level.l4,.comment-bilibili-fold .comment-list .list-item .user .level.l4 {
                background-position: -23px -284px
            }.bb-comment .comment-list .list-item .user .level.l5,.comment-bilibili-fold .comment-list .list-item .user .level.l5 {
                background-position: -23px -348px
            }.bb-comment .comment-list .list-item .user .level.l6,.comment-bilibili-fold .comment-list .list-item .user .level.l6 {
                background-position: -23px -412px
            }.bb-comment .comment-list .list-item .user .level.l7,.comment-bilibili-fold .comment-list .list-item .user .level.l7 {
                background-position: -23px -476px
            }.bb-comment .comment-list .list-item .user .level.l8,.comment-bilibili-fold .comment-list .list-item .user .level.l8 {
                background-position: -23px -540px
            }.bb-comment .comment-list .list-item .user .level.l9,.comment-bilibili-fold .comment-list .list-item .user .level.l9 {
                background-position: -23px -604px
            }.bb-comment .comment-list .list-item .user .level, .comment-bilibili-fold .comment-list .list-item .user .level {
                display: inline-block;
                width: 19px;
                height: 9px;
                vertical-align: middle;
                margin: 0 8px;
                background: url(data:image/png;base64,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) no-repeat;
            }`;
            BLOD.addCss(this.style, "danmaku-hash");
            // 设置正在查询的弹幕数量
            DanmakuHashId.count = DanmakuHashId.count ? DanmakuHashId.count + 1 : 1;
            // 当前查询弹幕排序
            this.count = DanmakuHashId.count;
            // 临时缓存已查询的 mid
            DanmakuHashId.catch = DanmakuHashId.catch || {};
            this.hash = crc;
            this.mid = BLOD.midcrc(this.hash);
            this.getInfo();
            return [this.hash, this.mid];;
        }
        async getInfo() {
            try {
                this.node = document.querySelector(".bilibili-player-context-menu-container.active");
                if (!this.node) return setTimeout(() => { this.getInfo() }, 100);
                this.node = this.node.children[0];
                let j = 0; // 找到的节点序号
                for (let i = this.node.children.length - 1; i >= 0; i--) {
                    if (this.node.children[i].textContent.includes("mid")) {
                        this.dm = this.node.children[i];
                        j++;
                        if (this.count === j) break;
                    }
                }
                if (!this.dm) return setTimeout(() => { this.getInfo() }, 100);
                if (this.dm.tagName != "LI") return;
                DanmakuHashId.catch[this.mid] = DanmakuHashId.catch[this.mid] || BLOD.jsonCheck(await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/web-interface/card", { mid: this.mid })));
                this.dm.innerHTML = '<div style="min-height:0px;z-index:-5;background-color: unset;" class="bb-comment"><div style="padding-top: 0;" class="comment-list"><div class="list-item"><div class="reply-box"><div style="padding:0px" class="reply-item reply-wrap"><div style="margin-left: 15px;vertical-align: middle;" data-usercard-mid="' +
                    this.mid + '" class="reply-face"><img src="' +
                    DanmakuHashId.catch[this.mid].data.card.face + '@52w_52h.webp" alt=""></div><div class="reply-con"><div class="user" style="padding-bottom: 0;top: 3px;"><a style="display:initial;padding: 0px;" data-usercard-mid="' +
                    this.mid + '" href="//space.bilibili.com/' +
                    this.mid + '" target="_blank" class="' +
                    (DanmakuHashId.catch[this.mid].data.card.vip.vipType > 1 ? "name vip-red-name" : "name") + '">' + DanmakuHashId.catch[this.mid].data.card.name + '</a> ' +
                    DanmakuHashId.catch[this.mid].data.card.sex + '<a style="display:initial;padding: 0px;" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' +
                    DanmakuHashId.catch[this.mid].data.card.level_info.current_level + '"></i></a></div></div></div></div></div></div></div>';
                DanmakuHashId.count--;
            } catch (e) { DanmakuHashId.count--; e = Array.isArray(e) ? e : [e]; toast.error("弹幕反查", ...e); }
        }
    }
    BLOD.danmakuHashId = (crc) => {
        let check = new DanmakuHashId(crc);
        return "hash: " + check[0] + " mid: " + check[1];
    }

    /**
     * @class OnlineDanmaku
     * @description 允许旧版播放器载入任意url弹幕
     */
    class OnlineDanmaku {
        /**
         * 所需获取弹幕的对应链接
         * @param {string} url 所需获取弹幕的对应链接
         * @param {HTMLElement} [right] 用于创建下载所获得弹幕所在的父节点
         */
        constructor(url, right) {
            this.url = url;
            this.node = right;
            if (document.querySelector("#BLOD-dm-dl")) document.querySelector("#BLOD-dm-dl").remove();
            if (BLOD.bloburl.xml) {
                window.URL.revokeObjectURL(BLOD.bloburl.xml);
                BLOD.bloburl.xml = "";
            }
            this.init(url);
        }
        async init() {
            try {
                let obj = await BLOD.urlInputCheck(this.url);
                this.aid = obj.aid; this.cid = obj.cid;
                if (this.aid && this.cid) {
                    BLOD.getSegDanmaku(this.aid, this.cid).then(d => {
                        let danmaku = AllDanmaku.format(d, this.aid);
                        toast("在线弹幕：aid=" + this.aid + " cid=" + this.cid, "载入模式：" + (config.reset.concatDanmaku ? "与当前弹幕合并" : "替换当前弹幕"));
                        BLOD.setDanmaku(danmaku, config.reset.concatDanmaku);
                        this.download(d);
                    })
                } else {
                    toast.warning("未能获取到任何视频信息", "请检查输入的视频链接是否有效！", "若是第三方接口抽风也可重试看看");
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("在线弹幕", ...e); }
        }
        /**
         * 回显弹幕链接到设置面板
         * @param {[]} arr 新版弹幕数组
         */
        async download(arr) {
            arr = await BLOD.toXml(arr);
            BLOD.xml = arr;
            if (!this.node) return;
            this.div = BLOD.addElement("div", { id: "BLOD-dm-dl" }, this.node);
            this.blob = new Blob([arr]);
            BLOD.bloburl.xml = URL.createObjectURL(this.blob);
            this.div.innerHTML = `<a href=${BLOD.bloburl.xml} target="_blank" download="${this.cid}.xml">获取在线弹幕成功，可以右键另存为文件！</a>`;
            if (BLOD.cid && window.player) {
                let config = BLOD.GM.getValue("onlineDanmaku") || {};
                config[BLOD.cid] = [this.aid, this.cid];
                BLOD.GM.setValue("onlineDanmaku", config);
            }
        }
    }
    BLOD.onlineDanmaku = OnlineDanmaku;

    /**
     * @class AllDanmaku
     * @description 实现全弹幕装填功能
     */
    class AllDanmaku {
        /**
         * 全弹幕入口
         * @param {number} delay 接口冷却时间，单位：秒
         * @param {HTMLElement} [button] 调用按钮，用于获取中临时禁用
         * @returns 返回函数本身，操作都在异步了所以返回值意义不大
         */
        constructor(delay, button) {
            this.delay = delay || 5;
            this.button = button;
            // 异步获取中，临时禁用按钮
            this.button && this.button.setAttribute("disabled", true);
            let state = document.querySelector("#BLOD-UI-state");
            if (state) state.remove();
            toast("正在尝试获取全部弹幕请耐心等待。。。", "获取延时请尽量调大，以免短时间内大量请求被临时封端口！");
            this.pubdate = new Date(2009, 0);
            if (window.__INITIAL_STATE__) {
                if (window.__INITIAL_STATE__.videoData && window.__INITIAL_STATE__.videoData.pubdate) {
                    this.pubdate = new Date(1E3 * window.__INITIAL_STATE__.videoData.pubdate);
                } else if (window.__INITIAL_STATE__.epInfo && window.__INITIAL_STATE__.epInfo.pub_real_time) {
                    this.pubdate = new Date(window.__INITIAL_STATE__.epInfo.pub_real_time);
                }
            } else {
                let time = document.querySelector("div.tm-info.tminfo > time");
                time && (this.pubdate = new Date(time.innerHTML));
            }
            this.pubdate = BLOD.timeFormat(this.pubdate, 1).split(" ")[0]; // 视频上传日期
            this.today = BLOD.timeFormat(undefined, 1).split(" ")[0]; // 当天日期
            this.time = this.today;
            this.arrP = this.pubdate.split("-");
            this.danmaku = [];
            if (!this.pubdate) return toast.warning("投稿日期获取失败！无法获取全部弹幕！");
            this.init();
        }
        /**
         * 按日期拉取弹幕
         * @returns 调用月份判断
         */
        async init() {
            try {
                // 获取当日日期
                this.arrT = this.time.split("-");
                // 如果年份小于投稿日，说明获取成功
                if (this.arrT[0] < this.arrP[0]) return this.done(1);
                // 年份相等但月份小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1]) return this.done(1);
                // 年月都相等，但日期小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2]) return this.done(1);
                // 日期未早于投稿日，正常请求日期数据
                toast("正在获取 " + this.time + " 日的弹幕。。。");
                let danmaku = await BLOD.getHistoryDanmaku(this.time);
                BLOD.sortDmById(danmaku, "idStr");
                danmaku.reverse();
                // 取最早一条弹幕的时间
                this.time = BLOD.timeFormat(danmaku[danmaku.length - 1].ctime * 1000, 1).split(" ")[0];
                this.danmaku = this.danmaku.concat(danmaku);
                toast("数据返回！已获取弹幕数：" + BLOD.unitFormat(this.danmaku.length));
                this.arrT = this.time.split("-");
                // 如果当天不是投稿日，转入日期检查
                if (this.pubdate != this.today) return this.check();
                // 否则结束弹幕获取，当前弹幕就是能获取到的全弹幕
                this.done(1);
            } catch (e) {
                e = Array.isArray(e) ? e : [e];
                toast.error("全弹幕装填", ...e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                    this.done();
                } else {
                    // 失败退出，取消按钮禁用
                    this.button && this.button.removeAttribute("disabled");
                    toast.error("弹幕获取出错！", "已退出！");
                }
            }
        }
        /**
         * 按月份判断有弹幕时间
         * @returns 调用获取日期弹幕或者循环月份判断
         */
        async check() {
            try {
                // 如果年份小于投稿日，说明获取成功
                if (this.arrT[0] < this.arrP[0]) return this.done(1);
                // 年份相等但月份小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1]) return this.done(1);
                // 年月都相等，但日期小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2]) return this.done(1);
                // 日期未早于投稿日，正常请求月份数据
                let data = await BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/x/v2/dm/history/index", {
                    type: 1,
                    oid: BLOD.cid,
                    month: this.arrT.slice(0, 2).join("-")
                }))
                data = BLOD.jsonCheck(data).data;
                if (data && data[0]) {
                    // 当月有弹幕，进入日期判断
                    for (let i = data.length - 1; i >= 0; i--) {
                        let date = data[i].split("-");
                        if (date[2] < this.arrT[2]) {
                            // 当日在已获取弹幕之前，记录并跳出循环
                            this.timeT = data[i];
                            break;
                        }
                    }
                    if (this.timeT) {
                        // 延时转入日期请求
                        this.time = this.timeT;
                        this.timeT = undefined;
                        toast(`技能冷却中。。。请稍待 ${this.delay} 秒钟`);
                        return setTimeout(() => this.init(), this.delay * 1000);
                    } else {
                        // 当月有弹幕但都不在已请求日之前，月份 -1 重载
                        if (this.arrT[1] > 1) {
                            this.arrT[1]--;
                            this.arrT[1] = (Array(2).join('0') + this.arrT[1]).slice(-2);
                        }
                        else this.arrT = [this.arrT[0] - 1, 12, 31];
                        toast(`获取前一个月数据 ${this.arrT.slice(0, 2).join("-")} 请稍待 ${this.delay} 秒钟`);
                        return setTimeout(() => this.check(), this.delay * 1000);
                    }
                } else {
                    // 当月无弹幕直接月份 -1 重载，月份等于 1 则取上年最后一天
                    if (this.arrT[1] > 1) {
                        this.arrT[1]--;
                        if (this.arrT[1] < 10) this.arrT[1] = (Array(2).join('0') + this.arrT[1]).slice(-2);
                    } else this.arrT = [this.arrT[0] - 1, 12, 31];
                    toast(`获取前一个月数据 ${this.arrT.slice(0, 2).join("-")} 请稍待 ${this.delay} 秒钟`);
                    return setTimeout(() => this.check(), this.delay * 1000);
                }
            } catch (e) {
                e = Array.isArray(e) ? e : [e];
                toast.error("全弹幕装填", ...e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                    this.done();
                } else {
                    // 失败退出，取消按钮禁用
                    this.button && this.button.removeAttribute("disabled");
                    toast.error("弹幕获取出错！", "已退出！");
                }
            }
        }
        /**
         * 载入弹幕
         * @param {Boolean} [boolean] 判断获取成功还是失败，成功请传入真值。
         */
        async done(boolean) {
            try {
                // 历史弹幕里不包含代码弹幕必须额外处理
                toast("正在获取BAS/代码弹幕专包。。。")
                this.danmaku = this.danmaku.concat(await BLOD.getSegDanmaku(undefined, undefined, true));
                toast("数据返回！正在整合。。。")
            } catch (e) { }
            let danmaku = AllDanmaku.format(this.danmaku, BLOD.aid);
            if (boolean) toast.success("全弹幕获取成功，正在装填。。。", "总弹幕量：" + BLOD.unitFormat(this.danmaku.length), "同时推送至下载面板，可右键保存 π_π");
            BLOD.setDanmaku(danmaku);
            // 成功获取弹幕，取消按钮禁用
            this.button && this.button.removeAttribute("disabled");
            BLOD.toXml(this.danmaku).then(d => { BLOD.xml = d });
        }
        /**
         * 将新版弹幕数组转化为旧版弹幕数组
         * @param {[]} dm 新版弹幕数组
         * @param {number} [aid] 视频aid，默认取当前视频aid
         * @returns {[]} 旧版弹幕数组
         */
        static format(dm, aid) {
            aid = aid || BLOD.aid
            let danmaku = dm.map(function (v) {
                return {
                    class: v.pool,
                    color: v.color,
                    date: v.ctime,
                    dmid: v.idStr,
                    mode: v.mode,
                    size: v.fontsize,
                    stime: v.progress / 1000,
                    text: (v.mode != 8 && v.mode != 9) ? v.content.replace(/(\/n|\\n|\n|\r\n)/g, '\n') : v.content,
                    uid: v.midHash
                };
            });
            //对av400000(2012年11月)之前视频中含有"/n"的弹幕的进行专门处理
            if (aid && aid < 400000) {
                let textData;
                for (let i = 0; i < danmaku.length; i++) {
                    textData = danmaku[i];
                    if (textData.text.includes('\n')) {
                        textData.class = 1;
                        textData.zIndex = textData.stime * 1000;
                        if (!(textData.text.includes("█") || textData.text.includes("▂"))) {
                            textData.zIndex = textData.zIndex + 1;
                        }
                    }
                }
            }
            BLOD.sortDmById(danmaku, "dmid");
            return danmaku;
        }
    }
    BLOD.AllDanmaku = AllDanmaku;

    /**
     * @class SegProgress
     * @description 实现分段进度条功能
     */
    class SegProgress {
        static cssInited = false
        constructor(resp) {
            if (!resp.data.view_points || resp.data.view_points.length == 0) return;
            this.init(resp.data.view_points);
        }
        async init(view_points) {
            if (!SegProgress.cssInited) {
                SegProgress.cssInited = true;
                BLOD.addCss(`.bilibili-progress-segmentation{height:29px;position:absolute;top:-12px}
                            .bilibili-progress-segmentation:hover > div > div{border-color:#fb7299;border-style:solid;border-width:0 2px;width:100%;height:3px;top:6px;left:-2px;position:relative;background:#fb7299}
                            .bilibili-progress-segmentation > div{box-sizing:border-box;border-style:solid;border-color:#fb7299;border-left-width:2px;position:absolute;width:100%;height:6px;top:12px}
                            .bilibili-progress-detail-chapter{top:-96px;position:absolute;width:100%;font-size:17px;font-weight:bold;color:#fff;text-shadow:0 0 5px #000}
                            .bilibili-progress-segmentation:last-child > div{border-right-width:2px}
                            .bilibili-player-filter-chapter:hover{color:#00a1d6}
                            .bilibili-player-chapterList{position:relative;height:100%;width:100%;overflow:auto}
                            .bilibili-player-chapterList::-webkit-scrollbar{width:6px}
                            .bilibili-player-chapterList::-webkit-scrollbar-track{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList::-webkit-scrollbar-thumb{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-track{background-color:#edf2f9}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-thumb{background-color:#a2a2a2}
                            .bilibili-player-chapter-info{width:100%;height:72px;margin-top:5px;white-space:normal;font-size:14px;position:relative;cursor:pointer}
                            .bilibili-player-chapter-info > img{position:absolute;left:15px;top:4px;border-radius:2px}
                            .bilibili-player-chapter-info > p{padding-top:5px;margin:0 5px 5px 138px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;height:43px}
                            .bilibili-player-chapter-info:hover > p{color:#00a1d6}
                            .bilibili-player-chapter-info > span{color:#99a2aa}
                            .bilibili-player-chapter-info.active{background-color:#f3f3f3}`);
            }
            let duration = view_points[view_points.length - 1].to;
            let ratio = player.getDuration() / duration / duration;
            let sliderTracker = document.querySelector(".bilibili-player-video-progress .bpui-slider-tracker");  // 播放器进度条的div  // 播放器进度条的div
            let chptName = document.createElement("div"); // 显示在视频预览缩略图上方的看点标题
            chptName.className = "bilibili-progress-detail-chapter";
            document.querySelector(".bilibili-player-video-progress-detail").appendChild(chptName);

            // 添加分段进度条
            for (let v of view_points) {
                let seg = document.createElement("div");
                seg.className = "bilibili-progress-segmentation";
                seg.style.width = (v.to - v.from) * ratio * 100 + "%";
                seg.style.left = v.from * ratio * 100 + "%";
                seg.innerHTML = '<div><div></div></div>';
                seg.onmouseenter = (content => () => chptName.innerHTML = content)(v.content)
                sliderTracker.appendChild(seg);
            }

            // 添加“视频看点”面板
            let wrapList = document.querySelector("div.bilibili-player-wraplist"); // 获取播放器右侧面板的容器div
            let panels = wrapList.children;
            let chptInfo = null; // 数组，存放每一看点的UI卡片

            let chptPanel = document.createElement("div"); // “视频看点”面板
            chptPanel.style.display = "none";
            chptPanel.className = "bilibili-player-filter-wrap bilibili-player-chapterList";
            wrapList.appendChild(chptPanel);

            let chptBtn = document.createElement("div"); // “视频看点”按钮
            chptBtn.className = "bilibili-player-filter-btn bilibili-player-filter-chapter bpui-component bpui-button bpui-button-type-small button";
            chptBtn.innerHTML = '<span class="bpui-button-text"><span>视频看点</span></span>';
            document.querySelector("div.bilibili-player-filter").appendChild(chptBtn);

            // 用当前播放进度刷新面板
            function refreshState() {
                if (!chptInfo) return;
                let progress = player.getCurrentTime();
                for (let i = 0, v; i < view_points.length; i++) {
                    v = view_points[i];
                    if (progress < v.to) {
                        let active = document.querySelector(".bilibili-player-chapter-info.active");
                        active && active.classList.remove("active");
                        chptInfo[i].classList.add("active");
                        break;
                    }
                }
            }
            let timeFormat = t => t < 10 ? "0" + t : t;
            chptBtn.onclick = () => {
                let activePanel = document.querySelector("div.bilibili-player-filter-btn.active");
                if (activePanel == chptBtn) return;
                // 切换按钮的激活状态
                activePanel.classList.remove("active");
                chptBtn.classList.add("active");
                for (let i = 0; i < panels.length; i++) {
                    const element = panels[i];
                    if (element.style.display == "block") {
                        element.style.display = "none";
                        break;
                    }
                }
                // 创建各个看点对应的UI卡片
                if (!chptInfo) {
                    chptInfo = [];
                    for (let i = 0, v; i < view_points.length; i++) {
                        v = view_points[i];
                        let div = document.createElement("div");
                        div.className = "bilibili-player-chapter-info";
                        div.innerHTML = `<img width="112" height="63" src="${v.imgUrl}"/>
                                        <p class="chapter-name">${v.content}</p>
                                        <span style="margin-left: 138px">${timeFormat(Math.floor(v.from / 60))}:${timeFormat(v.from % 60)}</span>
                                        <span style="margin-right: 5px; float: right;">${(v.to - v.from) >= 60 ? `${Math.floor((v.to - v.from) / 60)}分` : ""}${(v.to - v.from) % 60}秒</span>`;
                        div.onclick = (jumpto => () => {
                            player.seek(jumpto);
                            let active = document.querySelector(".bilibili-player-chapter-info.active");
                            active && active.classList.remove("active");
                            div.classList.add("active");
                        })(v.from);
                        chptInfo[i] = div;
                        chptPanel.appendChild(div);
                    }
                };
                chptPanel.style.display = "block";
                // 将当前的播放进度对应的UI卡片显示为灰色底色
                refreshState();
            }
            player.addEventListener("video_media_seeked", refreshState);
            chptPanel.onmouseenter = refreshState;
            class timer {
                static handle
                static start() { if (!timer.handle) timer.handle = setInterval(refreshState, 3000) }
                static stop() { if(timer.handle) { clearInterval(timer.handle); timer.handle = null } }
            }
            player.addEventListener("video_media_playing", timer.start);
            player.addEventListener("video_media_pause", timer.stop);
            if(player.getState() == "PLAYING") timer.start();
        }
    }

})();