/**
 * @module rewrite
 * @description 重写页面框架模块，重写操作会完全刷新DOM，必须越快越好
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; // 模块上下文，由主模块定义
    const config = BLOD.config; // 脚本设置
    const xhr = BLOD.xhr; // XMLHttpRequest
    const toast = BLOD.toast; // Toastr
    const debug = BLOD.debug; // 调试信息

    /**
     * @class Rewrite
     * @description 重写页面
     */
    class Rewrite {
        constructor() {
            this.playerStyle = `#bofqi .player {
                width: 980px;
                height: 620px;
                display: block;
            }
            
            @media screen and (min-width:1400px) {
                #bofqi .player {
                    width: 1160px;
                    height: 720px
                }
            }`;
            this.playerStyleC = `#bofqi .player {
                width: 980px;
                height: 620px;
                display: block;
            }
            
            @media screen and (min-width:1400px) {
                #bofqi .player {
                    width: 1294px;
                    height: 792px
                }
                #__bofqi {
                    min-height: 760px;
                }
                .bili-wrapper {
                    width: 1294px;
                }
                .bgray-btn-wrap {
                    margin-left: 647px !important;
                }
                .fixed-nav-m {
                    margin-left: 657px;
                }
                .bili-wrapper {
                    width: 1294px !important;
                }
                .primary-menu {
                    width: 1294px !important;
                }
            }
            
            @media screen and (min-width:2800px) {
                #bofqi .player {
                    width: 1934px;
                    height: 1152px
                }
                #__bofqi {
                    min-height: 1120px;
                }
                .bili-wrapper {
                    width: 1934px;
                }
                .bgray-btn-wrap {
                    margin-left: 967px !important;
                }
                .fixed-nav-m {
                    margin-left: 977px;
                }
                .bili-wrapper {
                    width: 1934px !important;
                }
                .primary-menu {
                    width: 1934px !important;
                }
            }`;
            this.oldreply = `.bb-comment .comment-list .list-item .user-face img, .comment-bilibili-fold .comment-list .list-item .user-face img {
                width: 48px;
                height: 48px;
                border-radius: 50%;
            }
            .bb-comment .comment-list .list-item .user-face .pendant, .comment-bilibili-fold .comment-list .list-item .user-face .pendant {
                width: 86px;
                height: 86px;
                position: absolute;
                top: -19px;
                left: -19px;
                display: block;
            }
            .bb-comment .comment-list .list-item .user-face .pendant img, .comment-bilibili-fold .comment-list .list-item .user-face .pendant img {
                border: 0;
                border-radius: 0;
                width: 86px;
                height: 86px;
            }`;
            this.miniPlayer = `.bilibili-player .bilibili-player-area .bilibili-player-video-wrap.mini-player .bilibili-player-video-danmaku {
                top: 30px;
                height: 240px;
            }
            .bilibili-player .bilibili-player-area .bilibili-player-video-wrap.mini-player .bilibili-player-video-bas-danmaku {
                top: 30px;
                height: 240px;
            }
            .bilibili-player .bilibili-player-area .bilibili-player-video-wrap.mini-player .bilibili-player-video-adv-danmaku {
                top: 30px;
                height: 240px;
            }`;
            this.imroot = `.im-root,.im-root .im-list-box * {
                font-size:12px;
                line-height:42px;
            }
            .im-root .im-list-box {
                width:100%;
            }
            .im-root .im-list-box .im-list {
                line-height:42px;
                height:42px;
            }
            .im-root .im-list-box .im-notify.im-number {
                height: 14px;
                line-height: 13px;
                border-radius: 10px;
                padding: 1px 3px;
                font-size: 12px;
                min-width: 20px;
                text-align: center;
                color: #fff;
            }
            .im-root .im-list-box .im-notify.im-number.im-center {
                top: 14px;
                left: 80px;
            }
            .im-root .im-list-box .im-notify.im-dot {
                top: 11px;
                right: -10px;
                width: 8px;
                height: 8px;
                border-radius: 100%;
            }
            .im-root .im-list-box .im-notify.im-dot.im-center {
                top: 16px;
                right: 20px;
            }`;
            this.iconLike = BLOD.GM.getResourceText("iconLike");
            this.iconDislike = BLOD.GM.getResourceText("iconDislike");

            if (config.rewrite.av && /\/video\/[AaBb][Vv]/.test(location.href)) this.av();
            if (config.rewrite.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href)) this.bangumi();
            if (config.rewrite.watchlater && /\/watchlater\//.test(location.href)) this.watchlater();
            if (config.rewrite.frame && /player\./.test(location.href)) this.blackboard();
            if (/space\.bilibili\.com/.test(location.href)) this.space();
            if (config.rewrite.home && BLOD.path[2] == 'www.bilibili.com' && (!BLOD.path[3] || (BLOD.path[3].startsWith('\?') || BLOD.path[3].startsWith('\#') || BLOD.path[3].startsWith('index.')))) this.index();
            if (config.rewrite.rank && /\/v\/popular\//.test(location.href)) this.rank();
            if (/live\.bilibili\.com/.test(location.href)) this.live();
            if (/\/medialist\/play\//.test(location.href)) this.medialist();

            if (BLOD.path[2] == "message.bilibili.com") BLOD.addCss(".container[data-v-6969394c] { height: calc(100vh - 42px) !important;} .container[data-v-1c9150a9] { height: calc(100vh - 42px) !important;}"); // 修复消息页样式
            if (window.self == window.top && BLOD.path[2] == 'www.bilibili.com') document.domain = "bilibili.com"; // 处理子页面跨域
            if (location.href.includes("message.bilibili.com/pages/nav/index_new_sync")) BLOD.addCss(this.imroot); // 修复顶栏消息框
            if (location.href.includes("www.bilibili.com/account/history")) {
                // 隐藏历史记录搜索
                if (config.reset.searchHistory) BLOD.joinNode(() => BLOD.removeElement("b-head-search", "class"));
                if (config.reset.history) {
                    // 只显示视频历史
                    BLOD.xhrhook((xhr, args) => {
                        if (args[1].includes('api.bilibili.com/x/web-interface/history/cursor') && args[1].includes("business")) {
                            let obj = BLOD.urlObj(args[1]), max = obj.max || "", view_at = obj.view_at || "";
                            args[1] = BLOD.objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: 20 });
                        }
                    })
                }
            }
            if (/dmid/.test(location.href) && /dm_progress/.test(location.href)) BLOD.joinSwitchVideo(() => this.loadByDmid()); // 处理弹幕跳转
            if (config.rewrite.read && /\/read\/[Cc][Vv]/.test(location.href)) this.read();
        }
        /**
         * av/BV
         * @returns {void}
         */
        av() {
            try {
                if (/\/s\//.test(location.href)) location.replace(location.href.replace("s/video", "video")); // 重定向SEO页面
                BLOD.path.name = true; // 重写指示，有些操作无需再重写页面生效
                this.ml = BLOD.GM.getValue("medialist"); // 读取临时储存，检查是否medialist跳转而来
                BLOD.GM.deleteValue("medialist"); // 清除临时储存
                BLOD.importModule("initialstate"); // 准备__INITIAL_STATE__重构
                if (config.reset.novideo || config.reset.forceFlv) BLOD.getVariable(window, "__playinfo__", undefined, [undefined]); // 清除__playinfo__缓存
                BLOD.playerSetting(); // 还原旧版播放器设置
                // 获取aid
                if (BLOD.path[4].toLowerCase().startsWith('bv')) BLOD.aid = BLOD.abv(BLOD.path[4].split("#")[0].split("?")[0]); // 若为BV，转为aid
                BLOD.aid = BLOD.aid || BLOD.path[4].match(/[0-9]+/)[0]; // 若为av，直接读取
                this.page = xhr.false(BLOD.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: BLOD.aid })); // 获取__INITIAL_STATE__
                BLOD.__INITIAL_STATE__ = BLOD.iniState.av(this.page); // 重构__INITIAL_STATE__
                if (!BLOD.__INITIAL_STATE__) {
                    // 尝试访问第三方缓存数据
                    this.page = xhr.false(BLOD.objUrl("https://www.biliplus.com/api/view", { id: BLOD.aid }));
                    BLOD.__INITIAL_STATE__ = BLOD.iniState.avPlus(this.page);
                    if (!config.reset.lostvideo) return toast.error("av/BV号可能无效！", "设置中启用【失效视频】将尝试访问第三方缓存数据");
                }
                if (!BLOD.__INITIAL_STATE__) return toast.error("av/BV号可能无效！"); // 获取__INITIAL_STATE__失败
                if (BLOD.__INITIAL_STATE__.videoData.redirect_url) return toast.warning("番剧重定向...", BLOD.__INITIAL_STATE__.videoData.redirect_url); // 页面重定向
                if (BLOD.__INITIAL_STATE__.videoData.stein_guide_cid) return toast.warning("这似乎是个互动视频！", "抱歉！旧版播放器无法支持 ಥ_ಥ"); // 忽略互动视频
                // 记录关键变量
                BLOD.aid = BLOD.__INITIAL_STATE__.aid ? BLOD.__INITIAL_STATE__.aid : BLOD.aid;
                BLOD.tid = BLOD.__INITIAL_STATE__.videoData.tid ? BLOD.__INITIAL_STATE__.videoData.tid : BLOD.tid;
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__; // 写入旧版__INITIAL_STATE__
                BLOD.write(this.oldScript(BLOD.GM.getResourceText("av"))); // 重写av页
                document.title = BLOD.__INITIAL_STATE__.videoData.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili"; // 主动写入标签页标题
                config.reset.playerStyle ? BLOD.addCss(this.playerStyleC) : BLOD.addCss(this.playerStyle); // 修正播放器样式
                if (config.reset.oldreply) BLOD.addCss(this.oldreply); // 修正旧版评论样式
                let n = BLOD.joinNode(() => {
                    // 移除原失效顶栏
                    BLOD.removeElement("bili-header-m report-wrap-module", "class", false, 1, () => { BLOD.quitNode(n) });
                })
                this.fixVideoSeek(); // 修复评论跳转链接
                this.videoSort(); // 修复分区数据
                if (config.reset.like) BLOD.joinSwitchVideo(() => this.setLike()); // 切P回调添加点赞功能
                if (this.ml) this.setMediaList(); // 如果存在媒体缓存，构造媒体页
                if (BLOD.staff && config.reset.uplist) this.uplist(); // 添加UP主列表
                if (config.reset.commandDm) this.commandDm(); // 添加互动弹幕
                BLOD.joinSwitchVideo(() => this.avdesc()); // 视频简介BV号转化
                this.hookWebpackJsonp(); // hook原生代码以修复bug
                if (config.reset.electric) {
                    // 跳过充电鸣谢
                    BLOD.jsonphook((xhr, jsonp) => {
                        if (jsonp.url.includes("api.bilibili.com/x/web-interface/elec/show")) jsonp.url = BLOD.objUrl(jsonp.url.split("?")[0], Object.assign(BLOD.urlObj(jsonp.url), { aid: 1, mid: 1 }));
                    })
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("页面重写", ...e); }
        }
        /**
         * 重写Bangumi
         * @returns {void}
         */
        bangumi() {
            try {
                BLOD.path.name = true; // 重写指示，有些操作无需再重写页面生效
                BLOD.importModule("initialstate"); // 准备__INITIAL_STATE__重构
                BLOD.playerSetting(); // 还原旧版播放器设置
                BLOD.pgc = true; // Bangumi指示，一般用于视频链接获取区分
                let data = (BLOD.uid && xhr.false(location.href).match(/last_ep_id\"\:[0-9]+/)) || []; // 尝试获取历史记录
                let id = BLOD.path[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : null; // 尝试获取epid
                id = id || (data[0] && data[0].split(":")[1]) || null; // 存在epid直接覆盖历史
                try {
                    // 尝试获取__INITIAL_STATE__，分ss/ep两种情况
                    if (BLOD.path[5].startsWith('ss')) {
                        data = xhr.false(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { season_id: location.href.match(/[0-9]+/)[0] }));
                    } else if (BLOD.path[5].startsWith('ep')) {
                        data = xhr.false(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { ep_id: location.href.match(/[0-9]+/)[0] }));
                    }
                    BLOD.__INITIAL_STATE__ = BLOD.iniState.bangumi(data, id); // 重构__INITIAL_STATE__
                } catch (e) {
                    // 无法获取__INITIAL_STATE__，尝试泰区接口，需要区域代理
                    let thai = BLOD.GM.getValue("thaiLand") || "https://api.global.bilibili.com"; // 获取泰区代理
                    if (!config.reset.limit) throw e; // 未启用解除区域限制功能
                    try {
                        // 尝试获取__INITIAL_STATE__，同样分ss/ep两种情况
                        if (BLOD.path[5].startsWith('ss')) {
                            data = BLOD.xhr.false(BLOD.objUrl(`${thai}/intl/gateway/v2/ogv/view/app/season`, { season_id: location.href.match(/[0-9]+/)[0] }));
                        } else if (BLOD.path[5].startsWith('ep')) {
                            data = BLOD.xhr.false(BLOD.objUrl(`${thai}/intl/gateway/v2/ogv/view/app/season`, { ep_id: location.href.match(/[0-9]+/)[0] }));
                        }
                        BLOD.__INITIAL_STATE__ = BLOD.iniState.thaiBangumi(data, id); // 重构__INITIAL_STATE__
                        BLOD.limit = 1; // 区域限制标志
                        BLOD.thailand = true; // 泰区标志，用于解除限制类型区分
                    } catch (no) { throw e }
                }
                if (BLOD.__INITIAL_STATE__ && BLOD.__INITIAL_STATE__.epInfo && BLOD.__INITIAL_STATE__.epInfo.badge === "互动") return toast.warning("这似乎是个互动番剧！", "什么！番剧也能互动？", "可惜旧版播放器不支持 ಥ_ಥ"); // 忽略互动视频
                if (!config.reset.bangumiCover && BLOD.__INITIAL_STATE__ && BLOD.__INITIAL_STATE__.epList && BLOD.__INITIAL_STATE__.epList[1]) {
                    // Bangumi存在特殊背景，但为了显示分集，清除特殊背景
                    BLOD.__INITIAL_STATE__.special = false;
                    BLOD.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined;
                }
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__; // 写入旧版__INITIAL_STATE__
                // 重写Bangumi页面，区分特殊背景页面
                if (!BLOD.__INITIAL_STATE__.special) BLOD.write(this.oldScript(BLOD.GM.getResourceText("bangumi")));
                else BLOD.write(this.oldScript(BLOD.GM.getResourceText("cinema")));
                if (config.reset.oldreply) BLOD.addCss(this.oldreply); // 修正旧版评论样式
                document.title = BLOD.__INITIAL_STATE__.mediaInfo.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili"; // 主动写入标题
                if (BLOD.__INITIAL_STATE__ && config.reset.episodedata) BLOD.joinSwitchVideo(() => this.episodeData()); // 切P回调分集数据
                let rid = BLOD.joinNode(() => {
                    BLOD.removeElement("new-entry", "class", false, 0, () => BLOD.quitNode(rid));
                })
                BLOD.xhrhook((xhr, args) => {
                    // 修复追番数据
                    if (args[1].includes('bangumi.bilibili.com/ext/web_api/season_count?')) {
                        xhr.addEventListener('readystatechange', () => {
                            if (xhr.readyState === 4) {
                                try {
                                    let response = BLOD.jsonCheck(xhr.responseText);
                                    response.result.favorites = response.result.follow;
                                    Object.defineProperty(xhr, 'response', { writable: true });
                                    Object.defineProperty(xhr, 'responseText', { writable: true });
                                    xhr.response = xhr.responseText = JSON.stringify(response);
                                } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧追番信息", ...e) }
                            }
                        });
                        args[1] = args[1].replace('bangumi.bilibili.com/ext/web_api/season_count', 'api.bilibili.com/pgc/web/season/stat');
                    }
                    // 修复片尾番剧推荐
                    if (args[1].includes('api.bilibili.com/pgc/web/recommend/related/recommend')) {
                        xhr.addEventListener('readystatechange', () => {
                            if (xhr.readyState === 4) {
                                try {
                                    let response = BLOD.jsonCheck(xhr.responseText);
                                    if (response.result && response.result.season) response.result = response.result.season;
                                    Object.defineProperty(xhr, 'response', { writable: true });
                                    Object.defineProperty(xhr, 'responseText', { writable: true });
                                    xhr.response = xhr.responseText = JSON.stringify(response);
                                } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("番剧推荐", ...e) }
                            }
                        })
                    }
                    // 修复番剧推荐
                    if (args[1].includes('comment.bilibili.com/playtag')) {
                        args[1] = "https://comment.bilibili.com/playtag,2-2?html5=1";
                        this.pgcRecommend();
                    }

                })
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("页面重写", ...e); }
        }
        /**
         * 稍后再看
         * @returns {void}
         */
        watchlater() {
            if (!BLOD.uid) return toast.warning("未登录！", "无法启用稍后再看"); // 忽略未登录用户
            BLOD.path.name = true; // 重写指示，有些操作无需再重写页面生效
            BLOD.playerSetting(); // 还原旧版播放器设置
            BLOD.write(this.oldScript(BLOD.GM.getResourceText("watchlater"))); // 重写稍后再看
            config.reset.playerStyle ? BLOD.addCss(this.playerStyleC) : BLOD.addCss(this.playerStyle); // 修正播放器样式
            if (config.reset.oldreply) BLOD.addCss(this.oldreply); // 修正旧版评论样式
            this.fixVideoSeek(); // 修复评论跳转链接
            this.watchlaterSort(); // 修复分区数据
            if (config.reset.like) BLOD.joinSwitchVideo(() => this.setLike()); // 切P回调添加点赞功能
            BLOD.addCss(this.miniPlayer); // 修正mini播放器大小
        }
        /**
         * 嵌入播放器
         * @returns {void}
         */
        blackboard() {
            BLOD.path.name = true; // 重写指示，有些操作无需再重写页面生效
            BLOD.playerSetting(); // 还原旧版播放器设置
            BLOD.write(this.oldScript(BLOD.GM.getResourceText("player")));
        }
        /**
         * 播单页面，失效。相关接口已404
         */
        playlist() {
            if (BLOD.path[4] == "video") {
                // playlist播放页面
                BLOD.path.name = true; // 重写指示，有些操作无需再重写页面生效
                BLOD.write(this.oldScript(BLOD.GM.getResourceText("playlist")));
                toast.warning("播单页相关接口已失效！", "脚本也无法恢复 ಥ_ಥ");
            }
            if (BLOD.path[4] == "detail") {
                // playlist详情页面
                BLOD.path.name = true; // 重写指示，有些操作无需再重写页面生效
                BLOD.__INITIAL_STATE__ = { mid: "", pid: "", plinfoData: {}, pllistData: {} }
                try {
                    let page = BLOD.jsonCheck(xhr.false(BLOD.objUrl("https://api.bilibili.com/x/playlist/video/toview", { pid: BLOD.path[5].match(/[0-9]+/)[0] }))).data;
                    BLOD.__INITIAL_STATE__.mid = page.mid;
                    BLOD.__INITIAL_STATE__.pid = page.pid;
                    BLOD.__INITIAL_STATE__.plinfoData = { attr: page.attr, count: page.count, cover: page.cover, ctime: page.ctime, description: page.description, favored: page.favored, id: page.id, is_favorite: page.is_favorite, mid: page.mid, mtime: page.mtime, owner: page.owner, pid: page.pid, stat: page.stat, state: page.state, type: page.type, };
                    BLOD.__INITIAL_STATE__.pllistData = page.list;
                }
                catch (e) {
                    e = Array.isArray(e) ? e : [e];
                    debug.error("播单", ...e);
                    BLOD.__INITIAL_STATE__ = JSON.parse(BLOD.getResourceText("playlistjson"));
                }
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
                BLOD.write(this.oldScript(BLOD.GM.getResourceText("playlistdetail")));
                toast.warning("无法获取播单例表！", "这里使用的是一例备份数据以供参考");
            }
        }
        /**
         * 媒体播放页
         * @returns {void}
         */
        medialist() {
            if (BLOD.path[5].startsWith("ml")) {
                this.ml = 1 * BLOD.path[5].match(/[0-9]+/)[0];
                // 保存收藏号并调用av跳转
                if (!config.rewrite.medialist) return;
                BLOD.GM.setValue("medialist", this.ml);
                this.setMediaList(this.ml);
            }
            // 新版稍后再看跳转到旧版稍后再看
            if (BLOD.path[5].startsWith("watchlater") && config.rewrite.watchlater) location.replace("https://www.bilibili.com/watchlater/#/");
        }
        /**
         * 个人主页
         */
        async space() {
            BLOD.mid = (BLOD.path[3] && BLOD.path[3].split("?")[0]) || BLOD.mid;
            if (BLOD.mid && config.reset.jointime) {
                // 添加注册时间
                try {
                    let data = await xhr.GM(BLOD.objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": BLOD.mid }));
                    data = BLOD.jsonCheck(data);
                    // 格式化时间戳，不是13位，主动补位
                    let jointime = BLOD.timeFormat(data.card.regtime * 1000, 1);
                    if (BLOD.big) toast(data.card.name + " mid：" + BLOD.mid, "注册时间：" + jointime, "生日：" + data.card.birthday);
                    debug.log("注册时间", data.card.name, jointime);
                    document.addEventListener("DOMNodeInserted", (msg) => {
                        let birthday = document.querySelector(".birthday");
                        if (birthday) {
                            if (document.querySelector(".jointime")) return;
                            else {
                                let div = BLOD.addElement("div", { class: "item jointime" }, birthday.parentNode);
                                div.innerHTML = `<span class="icon"></span><span class="text">${jointime}</span>`;
                                BLOD.addCss(".user .info .meta .row {height : 88px;white-space : normal;}.user .info .jointime .icon {background-position : -209px -84px;}.user .info .jointime .text {color : #00a1d6;}}")
                            }
                        }
                    });
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("注册时间", ...e); }
            }
            if (config.reset.lostvideo) this.lostVideo();
        }
        /**
         * 主页
         */
        index() {
            BLOD.path.name = true; // 重写指示，有些操作无需再重写页面生效
            BLOD.importModule("initialstate"); // 准备__INITIAL_STATE__重构
            // 获取__INITIAL_STATE__
            if (!window.__INITIAL_STATE__) {
                let page = xhr.false(location.href);
                BLOD.__INITIAL_STATE__ = page.includes("__INITIAL_STATE__=") ? page.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : "";
            }
            else BLOD.__INITIAL_STATE__ = JSON.stringify(window.__INITIAL_STATE__);
            BLOD.__INITIAL_STATE__ = BLOD.iniState.index(BLOD.__INITIAL_STATE__); // 重构__INITIAL_STATE__
            // 移除广告
            if (BLOD.config.reset.adloc) for (let key in BLOD.__INITIAL_STATE__.locsData) if (BLOD.__INITIAL_STATE__.locsData[key]) for (let i = BLOD.__INITIAL_STATE__.locsData[key].length - 1; i >= 0; i--) if (BLOD.__INITIAL_STATE__.locsData[key][i].is_ad) { BLOD.debug.debug("移除广告", key, BLOD.__INITIAL_STATE__.locsData[key][i]); BLOD.__INITIAL_STATE__.locsData[key].splice(i, 1); }
            window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__; //写入旧版__INITIAL_STATE__
            BLOD.write(BLOD.GM.getResourceText("index")); // 重写主页
            let rid = BLOD.joinNode(() => {
                // 移除无效节点
                BLOD.removeElement("ver", "class");
                BLOD.removeElement("fixed_app_download", "id", false, 0, () => BLOD.quitNode(rid));
            })
            BLOD.xhrhook((xhr, args) => {
                // 修复直播推荐
                if (args[1].includes('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec')) {
                    xhr.addEventListener('readystatechange', () => {
                        if (xhr.readyState === 4) {
                            try {
                                let response = xhr.responseText.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
                                response = JSON.parse(response);
                                response.data.text_link = { text: "233秒居然能做这些！", link: "//vc.bilibili.com" };
                                if (response.data.recommend) {
                                    for (let i = 0; i < response.data.recommend.length; i++) {
                                        response.data.recommend[i].pic = response.data.recommend[i].cover;
                                        response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
                                    }
                                }
                                if (response.data.preview) for (let i = 0; i < response.data.preview.length; i++) response.data.preview[i].url = response.data.preview[i].link;
                                Object.defineProperty(xhr, 'response', { writable: true });
                                Object.defineProperty(xhr, 'responseText', { writable: true });
                                xhr.response = xhr.responseText = JSON.stringify(response);
                            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("获取直播数据推荐及排行失败！", ...e); }
                        }
                    })
                    args[1] = args[1].includes("List") ? args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web') : arg[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
                }
            })
            BLOD.jsonphook((xhr, jsonp) => {
                // 广告区转资讯区
                if (jsonp.url.includes("region") && jsonp.url.includes("rid=165")) jsonp.url = jsonp.url.replace("rid=165", "rid=202");
                // 用户热点最新投稿修复资讯区最新投稿
                if (jsonp.url.includes("newlist") && jsonp.url.includes("rid=165")) jsonp.url = jsonp.url.replace("rid=165", "rid=203");
                // 取消原创排行榜
                if (jsonp.url.includes("region") && jsonp.url.includes("original=1")) jsonp.url = jsonp.url.replace("original=1", "original=0");
                // 修复置顶推荐
                if (jsonp.url.includes("api.bilibili.com/x/web-interface/ranking/index")) jsonp.url = jsonp.url.replace("ranking/index", "index/top");
            })
            BLOD.joinNode((msg) => {
                // 失效分区转换
                if (msg.target.id == "bili_ad" || msg.target.className == "report-wrap-module elevator-module") this.fixNews(msg.target);
                // 覆盖个性化推荐
                if (/bili-wrapper/.test(msg.target.className)) this.fixRecommand();
                // 修复主页排行：电视剧、电影、纪录片
                if (msg.target.id == "bili_movie" || msg.target.id == "bili_teleplay" || msg.target.id == "bili_documentary") this.fixRank(msg.target);
            })
        }
        /**
         * 排行榜
         */
        rank() {
            try {
                BLOD.path.name = true; // 重写指示，有些操作无需再重写页面生效
                let refer = document.referrer.split("/"), page;
                // 获取__INITIAL_STATE__
                if (refer && refer[4] && refer[4] == "all") page = BLOD.jsonCheck(xhr.false(BLOD.objUrl("https://api.bilibili.com/x/web-interface/ranking/v2", { rid: refer[5], day: 3 })));
                else page = BLOD.jsonCheck(xhr.false(BLOD.objUrl("https://api.bilibili.com/x/web-interface/ranking/v2", { rid: 0, day: 3 })));
                // 重构__INITIAL_STATE__
                page.data.list.forEach(((e, i, l) => {
                    l[i] = Object.assign(l[i], { author: l[i].owner.name, coins: l[i].stat.coin, mid: l[i].owner.mid, play: l[i].stat.view, pts: l[i].score, trend: null, video_review: l[i].stat.danmaku });
                    if (l[i].others) {
                        l[i].others.forEach(((e, i, l) => {
                            l[i] = Object.assign(l[i], { author: l[i].owner.name, coins: l[i].stat.coin, mid: l[i].owner.mid, play: l[i].stat.view, pts: l[i].score, trend: null, video_review: l[i].stat.danmaku });
                        }));
                    }
                }))
                BLOD.__INITIAL_STATE__ = { loading: false, rankRouteParams: { arc_type: 0, day: 3, rankTab: "all", rid: 1 * refer[5] || 0, season_type: 1 }, showTypes: true, times: [{ name: "日排行", value: 1 }, { name: "三日排行", value: 3 }, { name: "周排行", value: 7 }, { name: "月排行", value: 30 }], typeList: [{ name: "全部投稿", value: 0 }, { name: "近期投稿", value: 1 }] };
                BLOD.__INITIAL_STATE__.channels = [{ name: "全站", tid: 0 }, { name: "动画", tid: 1 }, { name: "国创相关", tid: 168 }, { name: "音乐", tid: 3 }, { name: "舞蹈", tid: 129 }, { name: "游戏", tid: 4 }, { name: "知识", tid: 36 }, { name: "科技", tid: 188 }, { name: "生活", tid: 160 }, { name: "美食", tid: 211 }, { name: "鬼畜", tid: 119 }, { name: "时尚", tid: 155 }, { name: "娱乐", tid: 5 }, { name: "影视", tid: 181 }];
                BLOD.__INITIAL_STATE__.rankList = page.data.list;
                BLOD.__INITIAL_STATE__.note = page.data.note;
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__; // 写入旧版__INITIAL_STATE__
                BLOD.write(this.oldScript(BLOD.GM.getResourceText("ranking"))); // 重写排行榜
                BLOD.addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}"); // 修复自适应样式
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("页面重写", ...e); }
        }
        /**
         * 直播页
         */
        live() {
            if (BLOD.config.reset.roomplay) BLOD.getVariable(window, "__NEPTUNE_IS_MY_WAIFU__", undefined, [undefined]); // 清除live缓存
            if (config.reset.nop2p) {
                window.RTCPeerConnection = undefined;
                window.RTCDataChannel = () => { };
                toast.warning("禁用直播间p2p上传！");
            }
            if (config.reset.nosleep) {
                // 阻止直播间挂机检测
                this.setInterval = setInterval;
                this.clock = 0;
                window.setInterval = (...args) => {
                    if (args[1] && args[1] == 300000 && args[0] && args[0].toString() == "function(){e.triggerSleepCallback()}") {
                        if (!this.clock) {
                            toast.warning("成功阻止直播间挂机检测！", ...args);
                            this.clock++;
                        }
                        return Number.MIN_VALUE;
                    }
                    return this.setInterval.call(window, ...args);
                }
            }
            if (config.reset.noanchor) BLOD.joinNode(() => BLOD.removeElement("anchor-guest-box-id", "id", null, null, () => toast.warning("拦截天选时刻！")));
            if (config.reset.nopkvm) BLOD.joinNode(() => BLOD.removeElement("chaos-pk-vm", "id", null, null, () => toast.warning("拦截大乱斗！")));
            BLOD.joinNode(() => BLOD.removeElement("web-player-icon-roomStatus", "class")); // 移除直播水印
            if (config.reset.roomplay) BLOD.xhrhook((xhr, args) => {
                if (args[1].includes('api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo')) {
                    xhr.addEventListener('readystatechange', () => {
                        if (xhr.readyState === 4) {
                            try {
                                let response = BLOD.jsonCheck(xhr.responseText);
                                if (response.data) {
                                    response.data.live_status = 0;
                                    response.data.live_time = -1;
                                    response.data.playurl_info = null;
                                }
                                toast.warning("拦截直播间视频流！", "关闭【直播拦截】功能可恢复正常！")
                                Object.defineProperty(xhr, 'response', { writable: true });
                                Object.defineProperty(xhr, 'responseText', { writable: true });
                                xhr.response = xhr.responseText = JSON.stringify(response);
                            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("直播拦截", ...e) }
                        }
                    });
                }
            })
        }
        /**
         * 专栏
         */
        read() {
            BLOD.path.name = true; // 重写指示，有些操作无需再重写页面生效
            let page = xhr.false(location.href); // 获取页面数据
            let data = page.includes("__INITIAL_STATE__=") ? JSON.parse(page.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "")) : ""; //读取__INITIAL_STATE__
            let bar = [ // bar库
                [0, "推荐", "home"],
                [2, "动画", "douga"],
                [1, "游戏", "game"],
                [28, "影视", "cinephile"],
                [3, "生活", "life"],
                [29, "兴趣", "interest"],
                [16, "轻小说", "lightnovel"],
                [17, "科技", "technology"],
                [41, "笔记", "note"]
            ]
            let bars = bar.reduce((o, d) => { // 构造bar
                o = o + `<a href="//www.bilibili.com/read/${d[2]}?from=articleDetail" target="_self" class="tab-item${data.readInfo.category.parent_id == d[0] ? " on" : ""}" data-tab-id="${d[0]}"><span>${d[1]}</span></a>`;
                return o;
            }, `<div class="nav-tab-bar"><a href="https://www.bilibili.com/read/home?from=articleDetail" target="_self" class="logo"></a>`) + "</div>";
            // 构造up主信息
            let upinfo = `<div class="up-info-holder"><div class="fixed-box"><div class="up-info-block">
            <a class="up-face-holder" href="//space.bilibili.com/${data.readInfo.author.mid}" target="_blank"><img class="up-face-image" data-face-src="${data.readInfo.author.face.replace("http:", "")}" src="//static.hdslb.com/images/member/noface.gif" /></a><div class="up-info-right-block"><div class="row">
            <a class="up-name" href="//space.bilibili.com/${data.readInfo.author.mid}" target="_blank">${data.readInfo.author.name}</a> <span class="level"></span><div class="nameplate-holder"><i class="nameplate"></i></div></div><div class="row-2">粉丝: <span class="fans-num"></span> <span class="view">阅读:</span> <span class="view-num"></span></div></div></div><div class="follow-btn-holder"><span class="follow-btn">关注</span></div><div class="up-article-list-block hidden"><div class="block-title">推荐文章</div><ul class="article-list"></ul></div><div class="more"><div class="top-bar"><label>更多</label></div><a class="ac-link" href="//www.bilibili.com/read/apply/" target="_blank"><div class="link"><span class="icon"></span><p class="title">成为创作者</p><p class="info">申请成为专栏UP主</p></div></a> <a href="//www.bilibili.com/blackboard/help.html#%C3%A4%C2%B8%C2%93%C3%A6%C2%A0%C2%8F%C3%A7%C2%9B%C2%B8%C3%A5%C2%85%C2%B3" target="_blank"><div class="help"><span class="icon"></span><p class="title">专栏帮助</p><p class="info">查看专栏使用说明</p></div></a></div></div>
            </div><div class="right-side-bar"><div class="to-comment"><div class="comment-num-holder"><span class="comment-num"></span></div></div><div class="to-top"></div></div>`;
            // 构造标题
            let head = `<div class="head-container"><div class="banner-img-holder"></div><div class="bangumi-rating-container"></div><div class="argue-flag hidden"></div><div class="title-container">
            <h1 class="title">${data.readInfo.title}</h1><div class="info">
            <a class="category-link" href="//www.bilibili.com/read/${bar.find(d => {
                if (d[0] == data.readInfo.category.parent_id) return d;
            })[2]}#rid=${data.readInfo.category.id}" target="_blank"><span>${data.readInfo.category.name}</span></a> <span class="create-time" data-ts="${data.readInfo.ctime}"></span><div class="article-data"></div>
            </div></div><div style="display:none" class="author-container">
            <a class="author-face" href="//space.bilibili.com/${data.readInfo.author.mid}" target="_blank"><img data-face-src="${data.readInfo.author.face.replace("http:", "")}" src="${data.readInfo.author.face.replace("http:", "")}" class="author-face-img" /></a> <a class="author-name" href="//space.bilibili.com/${data.readInfo.author.mid}" target="_blank">${data.readInfo.author.name}</a><div class="attention-btn slim-border">关注</div></div></div>`;
            let body = `<div class="article-holder">${data.readInfo.content}</div><p class="original">本文为我原创</p>`; // 文章本体
            let tag = (data.readInfo.tags || []).reduce((o, d) => {
                // 构造tag
                o = o + `<li data-tag-id="${d.tid}" class="tag-item"><span class="tag-border"><span class="tag-border-inner"></span></span> <span class="tag-content">${d.name}</span></li>`;
                return o;
            }, `<ul class="tag-container">`) + `</ul><div class="article-action"><div class="ops"><span class="like-btn"><i class="icon-video-details_like"></i> <span>--</span></span> <span class="coin-btn"><i class="icon-video-details_throw-coin"></i> <span>--</span></span> <span class="fav-btn"><i class="icon-video-details_collection"></i> <span>--</span></span> <span class="share-container share-btn">分享到：<span></span></span></div><div class="more"><!-- <i class="icon-general_more-actions"></i> --><div class="more-ops-list"><ul><li value="0">投诉或建议</li></ul></div></div></div><div class="article-list-holder-block"></div><div class="draft-holder-block"></div><div class="b-head comment-title-block"><span class="b-head-t comment-results" style="display: inline;"></span> <span class="b-head-t">评论</span></div><div class="comment-holder"></div>`;
            window.original = { // 写入全局依赖
                cvid: data.cvid,
                author: {
                    name: data.readInfo.author.name,
                    mid: data.readInfo.author.mid,
                },
                banner_url: data.readInfo.banner_url || (data.readInfo && data.readInfo.image_urls[0]) || null,
                reprint: data.readInfo.reprint,
                summary: data.readInfo.summary,
                media: "",
                actId: data.readInfo.act_id,
                dispute: {
                    dispute: "",
                    dispute_url: ""
                },
                spoiler: "0"
            }
            data = `<div class="page-container">${bars + upinfo + head + body + tag}</div>`; // 总合成
            delete window.webpackJsonp; // 移除原生页面残留
            BLOD.write(this.oldScript(BLOD.GM.getResourceText("read")).replace(`<div class="page-container"></div>`, data)); // 重写专栏
        }
        /**
         * 替换原生脚本，不直接修改页面框架
         * @param {string} html 页面框架
         * @returns {string} 修改过的网页框架
         */
        oldScript(html) {
            let comment = config.reset.oldreply ? "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c74067196af49a16cb6e520661df7d4d1e7f04e5/src/comment.min.js" : "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/comment.min.js";
            html = html.replace("//static.hdslb.com/js/video.min.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/video.min.js");
            html = html.replace("//static.hdslb.com/player/js/bilibiliPlayer.min.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/bilibiliPlayer.min.js");
            // CDN未更新前，两种conment.js都匹配一次
            html = html.replace("//static.hdslb.com/phoenix/dist/js/comment.min.js", comment);
            html = html.replace("//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js", comment);
            html = html.replace("//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js");
            return html;
        }
        /**
         * 修复评论跳转链接
         */
        fixVideoSeek() {
            window.commentAgent = {
                seek: (t) => window.player && window.player.seek(t)
            }
        }
        /**
         * 处理av页分区数据
         */
        async videoSort() {
            let sort = JSON.parse(BLOD.GM.getResourceText("sort"));
            let timer = window.setInterval(() => {
                let tminfo = document.getElementsByClassName("tm-info");
                if (tminfo[0]) {
                    window.clearInterval(timer);
                    if (!(BLOD.tid in sort)) return;
                    let nodes = tminfo[0].childNodes;
                    // 创建分区信息节点并写入tid对应的分区数据
                    nodes[1].replaceWith(nodes[0].cloneNode(true));
                    nodes[2].replaceWith(nodes[0].cloneNode(true));
                    nodes[2].childNodes[1].remove();
                    nodes[1].childNodes[0].href = sort[sort[BLOD.tid][0]][2];
                    nodes[1].childNodes[0].innerText = sort[sort[BLOD.tid][0]][1];
                    nodes[2].childNodes[0].href = sort[BLOD.tid][2];
                    nodes[2].childNodes[0].innerText = sort[BLOD.tid][1];
                }
            }, 1000);
        }
        /**
         * 处理稍后再看
         * @param {*} [data] 相当于变量声明
         */
        async watchlaterSort(data) {
            let sort = JSON.parse(BLOD.GM.getResourceText("sort"));
            let timer = window.setInterval(async () => {
                let tminfo = document.getElementsByClassName("tm-info");
                // 判断是否是稍后再看页面
                if (tminfo[0] && BLOD.aid) {
                    window.clearInterval(timer);
                    let child = tminfo[0].childNodes;
                    if (child[2].nodeType === 8) {
                        try {
                            // 通过链接获取tid
                            data = await xhr(BLOD.objUrl("https://api.bilibili.com/x/web-interface/view", { "aid": BLOD.aid }));
                            BLOD.tid = BLOD.jsonCheck(data).data.tid;
                            if (!(BLOD.tid in sort)) return;
                            // 创建分区信息节点并写入tid对应的分区数据
                            child[2].replaceWith(child[0].cloneNode(true));
                            child[4].replaceWith(child[0].cloneNode(true));
                            child[4].childNodes[1].remove();
                            child[2].childNodes[0].href = sort[sort[BLOD.tid][0]][2];
                            child[2].childNodes[0].innerText = sort[sort[BLOD.tid][0]][1];
                            child[4].childNodes[0].href = sort[BLOD.tid][2];
                            child[4].childNodes[0].innerText = sort[BLOD.tid][1];
                        }
                        catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("分区信息", ...e); }
                    }
                }
            }, 1000);
        }
        /**
         * 添加点赞功能
         */
        async setLike() {
            if (this.like) return;
            this.like = true; // 避免切P重复调用
            let node = document.querySelector(".coin");
            let number = document.querySelector(".number");
            let span = document.createElement("span");
            span.setAttribute("class", "u like");
            span.setAttribute("style", "margin-left : 24px;margin-right : 10px;");
            let i = BLOD.addElement("i", { class: "l-icon-move", style: "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + this.iconDislike }, span);
            let b = BLOD.addElement("b", { class: "l-icon-moved", style: "width : 22px;height : 22px;display : none;" }, span)
            let text = document.createTextNode("点赞 --");
            let arg = text;
            let like = false;
            span.appendChild(text);
            if (node && number) {
                number.insertBefore(span, node);
                try {
                    span.onclick = async () => {
                        if (like) {
                            // 取消点赞
                            let msg = "aid=" + BLOD.aid + "&like=2&csrf=" + BLOD.getCookies().bili_jct;
                            data = await xhr.post("https://api.bilibili.com/x/web-interface/archive/like", msg);
                            data = BLOD.jsonCheck(data).ttl;
                            toast.warning("取消点赞！");
                            like = false;
                            i.setAttribute("style", "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + this.iconDislike);
                            b.setAttribute("style", "width : 22px;height : 22px;display : none;");
                            if (arg.nodeValue.match("万")) return;
                            let number = 1 * arg.nodeValue.match(/[0-9]+/) - 1;
                            text = document.createTextNode(" 点赞 " + number);
                            arg.replaceWith(text);
                            arg = text;
                        } else {
                            if (!BLOD.uid) return BLOD.biliQuickLogin(); // 登录判断
                            // 点赞
                            let msg = "aid=" + BLOD.aid + "&like=1&csrf=" + BLOD.getCookies().bili_jct;
                            data = await xhr.post("https://api.bilibili.com/x/web-interface/archive/like", msg);
                            data = BLOD.jsonCheck(data).ttl;
                            toast.success("点赞成功！");
                            like = true;
                            i.setAttribute("style", "width : 22px;height : 22px;display : none;");
                            b.setAttribute("style", "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + this.iconLike);
                            if (arg.nodeValue.match("万")) return;
                            let number = 1 * arg.nodeValue.match(/[0-9]+/) + 1;
                            text = document.createTextNode(" 点赞 " + number);
                            arg.replaceWith(text);
                            arg = text;
                        }
                    }
                    let data = await xhr(BLOD.objUrl("https://api.bilibili.com/x/web-interface/view", { "aid": BLOD.aid }));
                    data = BLOD.jsonCheck(data).data.stat.like;
                    document.querySelector(".like").setAttribute("title", "点赞人数" + data);
                    text = document.createTextNode(" 点赞 " + BLOD.unitFormat(data));
                    arg.replaceWith(text);
                    arg = text;
                    if (!BLOD.uid) return;
                    data = BLOD.jsonCheck(await xhr(BLOD.objUrl("https://api.bilibili.com/x/web-interface/archive/has/like", { "aid": BLOD.aid }))).data;
                    if (data == 1) {
                        // 点赞过点亮图标
                        i.setAttribute("style", "width : 22px;height : 22px;display : none;");
                        b.setAttribute("style", "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + this.iconLike);
                        like = true;
                    }
                } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("点赞功能", ...e); }
            }
        }
        /**
         * 构造媒体页数据
         * @param {*} [data] 判断页面是否已经跳转到av页
         */
        async setMediaList(data) {
            if (data) {
                try {
                    // 获取首个视频av并跳转
                    toast("尝试前往构造媒体页...", "media_id：" + this.ml);
                    data = await xhr(BLOD.objUrl("https://api.bilibili.com/x/v1/medialist/detail", { "media_id": this.ml, "pn": 1, "ps": 1 }));
                    data = BLOD.jsonCheck(data).data;
                    location.replace("https://www.bilibili.com/video/av" + data.medias[0].id);
                }
                catch (e) {
                    // 跳转失败，清理残余
                    e = Array.isArray(e) ? e : [e];
                    BLOD.GM.setValue("medialist", 0);
                    toast.error(...e);
                }
            } else {
                try {
                    toast("重构媒体页信息中...")
                    let avs = [], value = [], promises = [];
                    // 获取收藏列表，这里获取只能获取到aid
                    data = await xhr(BLOD.objUrl("https://api.bilibili.com/x/v1/medialist/resource/ids4Player", { "media_id": this.ml }));
                    data = BLOD.jsonCheck(data).data;
                    for (let i = 0; i < data.medias.length; i++) {
                        BLOD.ids[i] = data.medias[i].id;
                        avs[i] = "av" + data.medias[i].id;
                    }
                    // 同时获取所有aid对应的数据，使用Promise.all对齐，该api会直接忽略失效视频
                    while (avs.length) {
                        let i = avs.length > 20 ? 20 : avs.length;
                        value = avs.splice(0, i);
                        promises.push(xhr.true(BLOD.objUrl("https://api.bilibili.com/x/article/cards", { "ids": value.join("%2C") })));
                    }
                    value = [];
                    data = await Promise.all(promises);
                    // 格式化数据并排序
                    for (let i = 0; i < data.length; i++) {
                        data[i] = BLOD.jsonCheck(data[i]);
                        for (let key in data[i].data) avs.push(data[i].data[key]);
                    }
                    for (let i = 0; i < BLOD.ids.length; i++) {
                        for (let j = 0; j < avs.length; j++) {
                            if (avs[j].aid == BLOD.ids[i]) {
                                value.push(avs[j]);
                                break;
                            }
                        }

                    }
                    BLOD.ids = value;
                    let timer = window.setInterval(() => {
                        if (window.BilibiliPlayer) {
                            clearInterval(timer);
                            // 将视频列表重构为稍后再看列表
                            for (let i = 0; i < BLOD.ids.length; i++) {
                                BLOD.ids[i].progress = 0;
                                BLOD.ids[i].add_at = BLOD.ids[i].ctime;
                                BLOD.ids[i].pages = [];
                                BLOD.ids[i].pages[0] = {};
                                BLOD.ids[i].pages[0].cid = BLOD.ids[i].cid;
                                BLOD.ids[i].pages[0].dimension = BLOD.ids[i].dimension;
                                BLOD.ids[i].pages[0].duration = BLOD.ids[i].duration;
                                BLOD.ids[i].pages[0].from = "vupload";
                                BLOD.ids[i].pages[0].page = 1;
                                BLOD.ids[i].pages[0].part = BLOD.ids[i].title;
                                BLOD.ids[i].pages[0].vid = "";
                                BLOD.ids[i].pages[0].weblink = "";
                            }
                            let toview = { "code": 0, "message": "0", "ttl": 1, "data": { "count": BLOD.ids.length, "list": BLOD.ids } };
                            // 保存初始aid，以便判断是否切p
                            BLOD.oid = BLOD.ids[0].aid;
                            debug.debug("收藏列表", toview);
                            // 构造初始化参数并重新初始化播放器
                            BLOD.obj = { "aid": BLOD.ids[0].aid, "cid": BLOD.ids[0].cid, "watchlater": encodeURIComponent(JSON.stringify(toview)) }; // 重构初始化播放器参数
                            toast.success("重构成功！", "二次刷新播放器...");
                            window.BilibiliPlayer(BLOD.obj);
                            let bpui = document.getElementsByClassName("bpui-button-text");
                            let t = setInterval(() => {
                                // 更新列表名称
                                if (bpui[1]) {
                                    clearInterval(t);
                                    bpui[1].firstChild.innerText = "收藏列表";
                                }
                            }, 100);
                            BLOD.joinSwitchVideo(() => {
                                // 切P监听
                                if (!BLOD.aid) BLOD.aid = window.aid || BLOD.aid;
                                if (BLOD.oid) {
                                    if (BLOD.oid != window.aid) {
                                        // 收藏播放切p判断
                                        BLOD.aid = window.aid || BLOD.aid;
                                        BLOD.oid = window.aid;
                                        this.mediaListRestore();
                                    }
                                }
                            })
                        }
                    }, 100);
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("收藏播放页", ...e); }
            }
        }
        /**
         * 媒体页切P更新
         * @param {*} [data] 相当于变量声明
         */
        async mediaListRestore(data) {
            toast("更新页面信息...", "部分非关键信息不会去额外获取");
            history.replaceState(null, null, "https://www.bilibili.com/video/av" + BLOD.aid + location.search + location.hash);
            for (let i = 0; i < BLOD.ids.length; i++) if (BLOD.ids[i].aid == BLOD.aid) data = BLOD.ids[i];
            let video_info = document.getElementById("viewbox_report");
            let up_info = document.getElementById("v_upinfo")
            let arc_toolbar_report = document.getElementById("arc_toolbar_report");
            document.title = data.title;
            video_info.innerHTML = '<h1 title="' + data.title + '"><!----><span>' + data.title + '</span></h1>' +
                '<div class="tm-info tminfo"><span class="crumb"><a href="//www.bilibili.com">主页</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/">动画</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/mad/">MAD·AMV</a></span><time>' + BLOD.timeFormat(data.pubdate * 1000, true) + '</time><a class="btn-appeal">稿件投诉</a></div>' +
                '<div class="number"><span title="总播放数' + data.stat.view + '" class="v play">' + BLOD.unitFormat(data.stat.view) + '</span><span title="总弹幕数' + data.stat.danmaku + '" class="v dm">' + BLOD.unitFormat(data.stat.danmaku) + '</span><span title="本日日排行数据过期后，再纳入本稿件的历史排行数据进行对比得出" class="v rank">最高全站日排行' + data.stat.like + '名</span><span class="line"></span><span class="u like" style="margin-right : 5px;" title="点赞人数' + data.stat.his_rank + '"><i class="l-icon-move" style="width : 22px;height : 22px;background-position : -660px -2068px;"></i><b class="l-icon-moved" style="width : 22px;height : 22px;background-position : -725px -2068px;display : none;"></b> 点赞 ' + BLOD.unitFormat(data.stat.like) + '</span><span report-id="coinbtn1" title="投硬币枚数' + data.stat.coin + '" class="u coin"><i class="c-icon-move"></i><b class="c-icon-moved" style="background-position: -2340px -60px; display: none;"></b> 硬币 ' + BLOD.unitFormat(data.stat.coin) + '</span> <span report-id="collect1" title="收藏人数' + data.stat.favorite + '" class="u fav"><i class="f-icon-move" style="background-position: 0px 0px;"></i><b class="f-icon-moved" style="background-position: -1740px -60px; display: none;"></b> 收藏 ' + BLOD.unitFormat(data.stat.favorite) + '</span></div>';
            up_info.innerHTML = '<div class="u-face fl"><!----><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="head" class="a"><img src="' + data.owner.face + '@68w_68h.webp" width="68" height="68" class="up-face" /><!----><!----><i title="企业/团体认证" class="auth o-auth"></i></a></div>' +
                '<div class="info"><div class="user clearfix"><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="name" class="name is-vip">' + data.owner.name + '</a><a href="//message.bilibili.com/#whisper/mid' + data.owner.mid + '" target="_blank" report-id="message" class="message icon">发消息</a></div><div class="sign static"><span>up主简介</span><!----></div><div class="number clearfix"><span title="投稿数--">投稿：--</span><span title="粉丝数--">粉丝：--</span></div><div class="btn followe"><a report-id="follow1" class="bi-btn b-gz"><span class="gz">+ 关注</span><span class="ygz">已关注</span><span class="qxgz">取消关注</span></a><a report-id="charge" class="bi-btn b-cd elecrank-btn"><span class="cd">充电</span><span class="wtcd">为TA充电</span></a></div></div>';
            arc_toolbar_report.children[0].children[0].title = "分享人数" + data.stat.share;
            arc_toolbar_report.children[0].children[0].innerHTML = '<span class="t">分享</span><span class="num">' + BLOD.unitFormat(data.stat.share) + '</span><i class="icon"></i>';
            arc_toolbar_report.children[2].title = "收藏人数" + data.stat.favorite;
            arc_toolbar_report.children[2].innerHTML = '<div class="btn-item"><i class="icon-move f-icon-moved" style="display: none;"></i><b class="icon-move f-icon-move"></b><span class="t">收藏</span><span class="num">' + BLOD.unitFormat(data.stat.favorite) + '</span></div>';
            arc_toolbar_report.children[3].title = "投硬币枚数" + data.stat.coin;
            arc_toolbar_report.children[3].innerHTML = '<div class="btn-item"><i class="icon-move c-icon-moved" style="display: none;"></i><b class="icon-move c-icon-move"></b><span class="t">硬币</span><span class="num">' + BLOD.unitFormat(data.stat.coin) + '</span></div>';
            document.getElementById("v_tag").children[0].setAttribute("hidden", "hidden");
            document.getElementById("v_desc").children[1].innerText = data.desc;
            new window.bbComment(".comment", window.aid, 1, window.UserStatus.userInfo, "");
            data.stat.like ? video_info.children[2].children[2].setAttribute("style", "display: inline-block;") : video_info.children[2].children[2].setAttribute("style", "display: none;");
            let bpui = document.getElementsByClassName("bpui-button-text");
            let t = setInterval(() => {
                // 更新列表名称
                if (bpui[1]) {
                    clearInterval(t);
                    bpui[1].firstChild.innerText = "收藏列表";
                }
            }, 100);
        }
        /**
         * 构造UP主列表
         */
        uplist() {
            let timer = setInterval(() => {
                let info = document.querySelector("#v_upinfo");
                if (info) {
                    clearInterval(timer);
                    let fl = '<span class="title">UP主列表</span><div class="up-card-box">';
                    BLOD.staff.forEach(d => {
                        let mid = d.mid;
                        let face = d.face;
                        let title = d.title;
                        let vip = (d.vip && d.vip.status) ? 'name-text is-vip' : 'name-text';
                        let name = d.name;
                        fl = fl + `<div class="up-card">
                        <a href="//space.bilibili.com/${mid}" data-usercard-mid="${mid}" target="_blank" class="avatar">
                        <img src="${face}@48w_48h.webp" /><!---->
                        <span class="info-tag">${title}</span><!----></a>
                        <div class="avatar">
                        <a href="//space.bilibili.com/${mid}" data-usercard-mid="${mid}" target="_blank" class="${vip}">${name}</a>
                        </div></div>`;
                    })
                    info.innerHTML = fl + '</div>';
                }
            }, 100);
        }
        /**
         * 添加互动弹幕
         */
        async commandDm() {
            // 互动弹幕
            BLOD.addCss(BLOD.GM.getResourceText("commandDmStyle"));
            BLOD.importModule("commandDm");
        }
        /**
         * 显示分集数据
         */
        async episodeData() {
            try {
                this.firstep = this.firstep ? this.firstep + 1 : 1; // 首p指示
                let views = document.querySelector(".view-count").querySelector("span");
                let danmakus = document.querySelector(".danmu-count").querySelector("span");
                if (this.firstep === 1) {
                    // 首p时辈分总播放数和总弹幕数
                    views.setAttribute("title", "总播放数 " + views.innerText);
                    danmakus.setAttribute("title", "总弹幕数 " + danmakus.innerText);
                    debug.debug("总播放数", views.innerText, " 总弹幕数", danmakus.innerText);
                }
                let data = await xhr(BLOD.objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": BLOD.aid })); // 获取分集数据
                data = BLOD.jsonCheck(data).data;
                let view = data.view;
                let danmaku = data.danmaku;
                view = BLOD.unitFormat(view);
                danmaku = BLOD.unitFormat(danmaku);
                views.innerText = view;
                danmakus.innerText = danmaku;
                debug.debug("播放", view + " 弹幕", danmaku);
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分集数据", ...e) }
        }
        /**
         * 转化简介中的BV号
         */
        async avdesc() {
            let desc = document.getElementsByClassName("info");
            if (desc[1] && desc[1].parentNode && desc[1].parentNode.id == "v_desc") {
                if (desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                    let paster = desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i);
                    for (let i = 0; i < paster.length; i++) {
                        let newer = "av" + BLOD.abv(paster[i]);
                        newer = '<a target="_blank" href="//www.bilibili.com/video/' + newer + '">' + newer + '</a>';
                        desc[1].innerHTML = desc[1].outerHTML.replace(paster[i], newer);
                    }
                }
            }
        }
        /**
         * 修复失效视频信息
         */
        async lostVideo() {
            try {
                BLOD.joinNode((msg) => {
                    // 空间主页展示的失效频道视频
                    if (/section channel guest/.test(msg.target.className)) {
                        let items = msg.target.querySelectorAll(".small-item.disabled");
                        items.forEach(d => {
                            let aid = d.getAttribute("data-aid"); // 获取aid
                            aid = Number(aid) || BLOD.abv(aid); // 转化为数字
                            d.setAttribute("class", "small-item fakeDanmu-item");
                            d.setAttribute("data-aid", aid);
                            d.children[0].href = `//www.bilibili.com/video/av${aid}`;
                            d.children[1].href = `//www.bilibili.com/video/av${aid}`;
                            d.children[0].setAttribute("target", "_blank");
                            d.children[1].setAttribute("target", "_blank");
                            d.children[0].setAttribute("class", "cover cover-normal");
                            d.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                            this.getLostVideo(aid).then(data => {
                                d.children[1].setAttribute("title", data[0]);
                                d.children[1].text = data[0];
                                d.children[0].children[0].alt = data[0];
                                d.children[0].children[0].src = data[1];
                            })
                        })

                    }
                })
                BLOD.joinNode((msg) => {
                    // 收藏及频道失效视频
                    if (/small-item disabled/.test(msg.target.className)) {
                        let aid = msg.target.getAttribute("data-aid"); // 获取aid
                        aid = Number(aid) || BLOD.abv(aid); // 转化为数字
                        msg.target.setAttribute("class", "small-item fakeDanmu-item");
                        msg.target.setAttribute("data-aid", aid);
                        msg.target.children[0].href = `//www.bilibili.com/video/av${aid}`;
                        msg.target.children[1].href = `//www.bilibili.com/video/av${aid}`;
                        msg.target.children[0].setAttribute("target", "_blank");
                        msg.target.children[1].setAttribute("target", "_blank");
                        msg.target.children[0].setAttribute("class", "cover cover-normal");
                        msg.target.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                        this.getLostVideo(aid).then(data => {
                            msg.target.children[1].setAttribute("title", data[0]);
                            msg.target.children[1].text = data[0];
                            msg.target.children[0].children[0].alt = data[0];
                            msg.target.children[0].children[0].src = data[1];
                        })
                    }
                })
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("失效视频", ...e) }
        }
        /**
         * 获取失效视频信息，感谢Biliplus、jijidown提供接口
         * @param {number} aid 对应aid
         * @returns {Promise<[]>} [标题, 封面]
         */
        async getLostVideo(aid) {
            let result = []; // 失效视频信息缓存
            try { // 尝试访问Biliplus
                let data = await xhr.GM(`https://www.biliplus.com/video/av${aid}`);
                if (data.match(/\<title\>.+?\ \-\ AV/)) {
                    result[0] = data.match(/\<title\>.+?\ \-\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
                    result[1] = data.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
                }
            } catch (e) { debug.warn(`获取 av${aid} 信息失败！当前尝试`, "Biliplus", e) }
            if (!result[0] || !result[1]) {
                try { // 标题或封面无效，尝试访问Biliplus CID缓存库
                    let data = await xhr.GM(`https://www.biliplus.com/all/video/av${aid}/`);
                    if (data.match('/api/view_all?')) {
                        data = data.match(/\/api\/view_all\?.+?\',cloudmoe/)[0].replace(/\',cloudmoe/, "");
                        data = await xhr.GM(`//www.biliplus.com${data}`);
                        data = BLOD.jsonCheck(data).data;
                        result[0] = result[0] || data.info.title;
                        result[1] = result[1] || data.info.pic;
                    }
                } catch (e) { e = Array.isArray(e) ? e : [e]; debug.warn(`获取 av${aid} 信息失败！当前尝试`, "Biliplus CID缓存库", ...e) }
            }
            if (!result[0] || !result[1]) {
                try { // 标题或封面依旧无效，尝试访问jijidown
                    let data = await xhr.GM(`https://www.jijidown.com/video/${aid}`);
                    if (data.match('window._INIT')) {
                        result[0] = result[0] || data.match(/\<title\>.+?\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
                        result[1] = result[1] || data.match(/\"img\":\ \".+?\",/)[0].match(/http.+?\",/)[0].replace(/",/, "");
                    }
                } catch (e) { debug.warn(`获取 av${aid} 信息失败！当前尝试`, "jijidown", e) }
            }
            result[0] = result[0] || `av${aid}` // 无法获取有效数据，将标题改为av号
            result[1] = result[1] ? result[1].replace("http:", "") : "//i0.hdslb.com/bfs/archive/be27fd62c99036dce67efface486fb0a88ffed06.jpg"; //无法获取有效数据，将封面改为哭脸
            return result;
        }
        /**
         * 修复番剧推荐
         */
        async pgcRecommend() {
            try {
                this.pgcR = this.pgcR || BLOD.jsonCheck(await xhr(BLOD.objUrl("https://api.bilibili.com/pgc/web/recommend/related/recommend", { season_id: window.__INITIAL_STATE__.ssId }))).result;
                let node = document.querySelector(".bilibili-player-recommend");
                if (!node) return setTimeout(() => this.pgcRecommend());
                node = node.querySelector(".mCSB_container");
                if (!node) return setTimeout(() => this.pgcRecommend());
                let element = '';
                this.pgcR.forEach(d => {
                    let temp = `<a class="bilibili-player-recommend-video" href="${d.url}" target="_blank">
                    <div class="bilibili-player-recommend-left">
                    <img src="${d.new_ep.cover || d.cover}@160w_100h.webp" alt="${d.title}" class="mCS_img_loaded" />
                    <span class="player-tooltips-trigger"><i class="bilibili-player-iconfont icon-22wait-normal"></i></span>
                    </div>
                    <div class="bilibili-player-recommend-right">
                    <div class="bilibili-player-recommend-title" title="${d.title}">${d.title}</div>
                    <div class="bilibili-player-recommend-click"><i class="bilibili-player-iconfont icon-12iconplayed"></i>${BLOD.unitFormat(d.stat.view)}</div>
                    <div class="bilibili-player-recommend-danmaku"><i class="bilibili-player-iconfont icon-12icondanmu"></i>${BLOD.unitFormat(d.stat.danmaku)}</div>
                    </div></a>`;
                    element = element + temp;
                });
                node.innerHTML = element;
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧推荐", ...e); }
            try {
                if (!this.avR) {
                    let data = await xhr(BLOD.objUrl("https://api.bilibili.com/x/tag/info", { tag_name: encodeURI(window.__INITIAL_STATE__.mediaInfo.title) }));
                    data = BLOD.jsonCheck(data);
                    data = await xhr(BLOD.objUrl("https://api.bilibili.com/x/web-interface/tag/top", { tid: data.data.tag_id }));
                    this.avR = BLOD.jsonCheck(data).data;
                }
                let element = "";
                this.avR.forEach(d => {
                    let temp = `<li class="recom-item">
                    <a href="https://www.bilibili.com/video/av${d.aid}" target="_blank" title="${d.title}">
                    <div class="recom-img"><div class="common-lazy-img">
                    <img alt="${d.title}" src="${d.pic.replace("http:", "")}@224w_140h.webp" lazy="loaded">
                    </div></div>
                    <div class="recom-info">
                    <div class="info-title">${d.title}</div>
                    <div class="info-count">
                    <div class="play-count"><i></i><span>${BLOD.unitFormat(d.stat.view)}</span></div>
                    <div class="danmu-count"><i></i><span>${BLOD.unitFormat(d.stat.danmaku)}</span></div>
                    </div></div></a></li>`;
                    element = element + temp;
                });
                document.querySelector(".recom-list.clearfix").innerHTML = element;
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("番剧推荐", ...e); }
        }
        /**
         * 替换主页分区
         * @param {HTMLElement} node 分区节点
         */
        async fixNews(node) {
            try {
                if (node.id == "bili_ad") {
                    let sight = node.getElementsByTagName("a");
                    node = node.getElementsByClassName("name");
                    if (node[0]) node[0].text = "资讯";
                    for (let i = 0; i < sight.length; i++) if (sight[i].href.includes("www.bilibili.com/v/ad/ad/")) sight[i].href = "https://www.bilibili.com/v/information/";
                    let rcon = document.createElement("div");
                    rcon.setAttribute("class", "r-con");
                    rcon.innerHTML = '<div class="r-con"><header style="margin-bottom: 14px"><h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3></header><div class="carousel-module"><div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp" width="260" height="280"/></a></div></div></div>';
                    document.getElementById("ranking_ad").replaceWith(rcon);
                    document.querySelector(".icon.icon_t.icon-ad").setAttribute("style", BLOD.GM.getResourceText("news") + "background-position: unset");
                    sight = document.querySelector("#bili_technology").querySelector(".name");
                    sight.href = "//www.bilibili.com/v/knowledge/";
                    sight.innerHTML = "知识";
                    sight = document.querySelector("#bili_digital").querySelector(".name");
                    sight.href = "//www.bilibili.com/v/tech/";
                    sight.innerHTML = "科技";
                }
                if (node.className == "report-wrap-module elevator-module") {
                    for (let item of node.children[1].children) {
                        if (item.innerHTML == "广告") item.innerHTML = "资讯";
                        if (item.innerHTML == "科技") item.innerHTML = "知识";
                        if (item.innerHTML == "数码") item.innerHTML = "科技";
                    }
                }

            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("主页分区", ...e); }
        }
        /**
         * 修复主页排行：电视剧、电影、纪录片
         * @param {HTMLElement} node 分区节点
         */
        async fixRank(node) {
            // 这些分区排行榜已全部采用类似番剧排行的模式，故采用相似的节点覆盖
            let sort = {
                bili_movie: ["ranking_movie", 2, "https://www.bilibili.com/ranking/cinema/23/0/3"],
                bili_teleplay: ["ranking_teleplay", 5, "https://www.bilibili.com/ranking/cinema/11/0/3"],
                bili_documentary: ["ranking_documentary", 3, "https://www.bilibili.com/ranking/cinema/177/0/3"]
            }
            sort = sort[node.id];
            if (!sort) return;
            let section = node.getElementsByClassName("sec-rank report-wrap-module zone-rank")[0];
            section.innerHTML = '<header class="rank-head"><h3>排行</h3></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list"></ul></div><a href="' + sort[2] + '" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>';
            try {
                let data = await xhr(BLOD.objUrl("https://api.bilibili.com/pgc/season/rank/web/list", { season_type: sort[1], day: 3 }));
                data = BLOD.jsonCheck(data).data;
                node = node.getElementsByClassName("bangumi-rank-list rank-list")[0];
                for (let i = 0; i < 8; i++) {
                    let li = document.createElement("li"),
                        cl = i < 3 ? "rank-item highlight" : "rank-item",
                        fw;
                    li.setAttribute("class", cl);
                    li.innerHTML = '<i class="ri-num">' + (i + 1) + '</i><a href="' + data.list[i].url + '" target="_blank" title="' + data.list[i].title + ' 播放:' + data.list[i].stat.view + '" class="ri-info-wrap"><p class="ri-title">' + data.list[i].title + '</p><span class="ri-total">' + data.list[i].new_ep.index_show + '</span></a>';
                    li.onmouseover = () => {
                        fw = document.createElement("div");
                        fw.setAttribute("class", "bangumi-info-module");
                        fw.setAttribute("style", 'left: ' + li.getBoundingClientRect().left + 'px; top: ' + (BLOD.getTotalTop(li) - 150) + 'px;');
                        fw.innerHTML = '<div class="v-preview clearfix"><div class="lazy-img cover"><img alt="' + data.list[i].title + '" src="' + data.list[i].cover + '" /></div><div><p class="title">' + data.list[i].title + '</p><p class="desc">' + data.list[i].new_ep.index_show + '</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>' + BLOD.unitFormat(data.list[i].stat.view) + '</span><span class="danmu"><i class="icon"></i>' + BLOD.unitFormat(data.list[i].stat.danmaku) + '</span><span class="fav"><i class="icon"></i>' + BLOD.unitFormat(data.list[i].stat.follow) + '</span></div>';
                        document.body.appendChild(fw);
                    }
                    li.onmouseout = () => fw.remove();
                    node.appendChild(li);
                }
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("分区排行", ...e); }
        }
        /**
         * 处理主页个性化推荐
         */
        async fixRecommand() {
            try {
                let node = document.querySelector(".recommend-module.clearfix"); // 父节点
                let prev = BLOD.addElement("span", { class: "rec-btn prev" }, node, false, document.querySelector(".rec-btn.prev")); // 替换切换按钮
                let next = BLOD.addElement("span", { class: "rec-btn next" }, node, false, document.querySelector(".rec-btn.next")); // 替换切换按钮
                prev.innerHTML = next.innerHTML = "切换"; // 命名按钮
                prev.onclick = next.onclick = async () => {
                    // 按钮单击回调
                    document.querySelectorAll(".groom-module.home-card").forEach(d => d.remove()); // 移除现有数据
                    let wait = BLOD.addElement("div", { class: "load-state" }, node, true); // 添加loading临时节点
                    wait.innerHTML = '<span class="loading">正在加载...</span><!----><!---->'; // 写入loading提示
                    this.indexRecommend = this.indexRecommend && this.indexRecommend.length > 20 ? this.indexRecommend : BLOD.jsonCheck(await xhr("https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3", undefined, undefined, !config.reset.indiRecommand)).data.item; // 请求推荐数据，分情况，个性化推荐每次都请求，全站推荐只请求一次
                    this.indexFlag = this.indexRecommend.length < 20 ? 10 : this.indexFlag || ((BLOD.uid && config.reset.indiRecommand) ? 10 : 20); // 设置遍历起始点，个性化推荐固定为10
                    wait.remove(); // 移除loading节点
                    for (let i = this.indexFlag - 1; i >= this.indexFlag - 10; i--) {
                        // 依次创建推荐数据，长度固定为10
                        BLOD.addElement("div", { class: "groom-module home-card" }, node, true).innerHTML = `<a href="//www.bilibili.com/video/av${this.indexRecommend[i].aid || this.indexRecommend[i].id}" target="_blank" title="${this.indexRecommend[i].title}">
                        <img src="${this.indexRecommend[i].pic.replace("http:", "")}@160w_100h.webp" alt="${this.indexRecommend[i].title}" width="160" height="100" class="pic">
                        "><!----><div class="card-mark"><p class="title">${this.indexRecommend[i].title}</p><p class="author">up主：${this.indexRecommend[i].owner.name}</p><p class="play">播放：${BLOD.unitFormat(this.indexRecommend[i].stat.view)}</p></div></a><div class="watch-later-trigger w-later"></div></div>`
                    }
                    this.indexFlag = this.indexRecommend.length < 20 ? 10 : this.indexFlag < 30 ? this.indexFlag + 10 : 10; // 对于全站推荐，刷新遍历起始点
                }
                if (BLOD.uid && config.reset.indiRecommand) prev.click(); // 移除个性化推荐
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("主页推荐", ...e); }
        }
        async loadByDmid() {
            if (!window.player || !window.player.seek) return setTimeout(() => { this.loadByDmid() }, 100); // 检查跳转引擎
            if (this.dmid) return; // 检查重复标记
            this.dmid = BLOD.urlObj(location.href).dmid; // 获取dmid
            this.progress = Number(BLOD.urlObj(location.href).dm_progress); // 获取时间轴信息
            if (this.progress) {
                // 时间轴有效直接跳转
                return window.player.seek(this.progress / 1000 - .2);
            }
            if (this.dmid) {
                this.progress = await xhr(`https://api.bilibili.com/x/v2/dm/thumbup/detail?oid=${BLOD.cid}&dmid=${this.dmid}`); // 获取时间轴信息
                this.progress = BLOD.jsonCheck(this.progress).data.progress; // 检查xhr返回值并转化为json
                this.progress && window.player.seek(this.progress / 1000 - .2);
            }
        }
        /**
         * hook webpackJsonp
         */
        hookWebpackJsonp() {
            let webpackJsonpFunction;
            Object.defineProperty(window, "webpackJsonp", {
                get() {
                    if (webpackJsonpFunction) {
                        return (chunkIds, moreModules, executeModules) => {
                            function inject(index, replaceFn) {
                                let code = moreModules[index].toString();
                                moreModules[index] = new Function("t", "e", "i", "(" + replaceFn(code) + ")(t,e,i)");
                            }
                            // length == 716 -> vendor.js
                            //        == 717 -> video.b1b7706abd590dd295794f540f7669a5d8d978b3.js
                            if (moreModules.length == 717) {
                                // 暴露UI组件
                                // .onCoinSuccess(n)   页面变为已投币n枚的状态
                                // .onFollow()         变为已关注状态
                                // .favSubmit(bool)    设置收藏状态，参数bool: true -> “已收藏”状态 false -> 未收藏状态
                                inject(274, code => code.replace("init:function(){", "init:function(){BLOD.biliUIcomponents=this;"));
                                // 修复：收藏视频时，在“添加到收藏夹”弹窗中，如果将视频从收藏夹A删除，并同时添加到收藏夹B，点击确定后窗口不消失的问题
                                /* 报错原因示意：
                                    jQuery.when(deferredA,deferredB).done((resultA,resultB) => {
                                        let codeA = resultA[0].code; // Cannot read property 'code' of undefined
                                        let codeA = resultA.code;    // 本应该写成这样
                                    })
                                */
                                inject(251, code => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
                            }
                            return webpackJsonpFunction(chunkIds, moreModules, executeModules);
                        }
                    }
                },
                set(func) {
                    webpackJsonpFunction = func;
                }
            });
        }
    }
    new Rewrite();

})();