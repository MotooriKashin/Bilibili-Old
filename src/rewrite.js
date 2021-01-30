/*
 * @module "rewrite.js"
 * @description 重写模块，按需加载，以rewrite对象挂载在BLOD下
 */
(function () {
    const BLOD = window.BLOD;
    const toast = BLOD.toast;

    class Write {
        constructor() {
            console.debug('import module "rewrite.js"');
        }
        av() {
            BLOD.path.name = "av";
            BLOD.ml = BLOD.getValue("medialist");
            BLOD.deleteValue("medialist");
            try {
                if (!BLOD.config.rewrite.av) return;
                BLOD.reset.playerSetting();
                if (BLOD.path[4].toLowerCase().startsWith('bv')) BLOD.aid = BLOD.abv(BLOD.path[4]);
                BLOD.aid = BLOD.aid || BLOD.path[4].match(/[0-9]+/)[0];
                let page = BLOD.xhr.false(BLOD.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: BLOD.aid }));
                BLOD.__INITIAL_STATE__ = BLOD.iniState.av(page);
                if (!BLOD.__INITIAL_STATE__) {
                    page = BLOD.xhr.false(BLOD.objUrl("https://www.biliplus.com/api/view", { id: BLOD.aid }));
                    BLOD.__INITIAL_STATE__ = BLOD.iniState.avPlus(page);
                    if (!BLOD.config.reset.lostvideo) return toast.error("av/BV号可能无效！", "设置中启用【失效视频】将尝试访问第三方缓存数据");
                }
                if (!BLOD.__INITIAL_STATE__) return toast.error("av/BV号可能无效！");
                if (BLOD.__INITIAL_STATE__.videoData.redirect_url) return toast.warning("番剧重定向...", BLOD.__INITIAL_STATE__.videoData.redirect_url);
                if (BLOD.__INITIAL_STATE__.videoData.stein_guide_cid) return toast.warning("这似乎是个互动视频！", "抱歉！旧版播放器无法支持 ಥ_ಥ");
                BLOD.aid = BLOD.__INITIAL_STATE__.aid ? BLOD.__INITIAL_STATE__.aid : BLOD.aid;
                BLOD.tid = BLOD.__INITIAL_STATE__.videoData.tid ? BLOD.__INITIAL_STATE__.videoData.tid : BLOD.tid;
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
                BLOD.write(BLOD.reset.oldScript(BLOD.getResourceText("av")));
                document.title = BLOD.title || BLOD.__INITIAL_STATE__.videoData.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                BLOD.reset.fixSort.video();
                BLOD.reset.setLike();
                BLOD.reset.setMediaList.init();
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("页面重写", ...e); }
        }
        watchlater() {
            try {
                if (!BLOD.config.rewrite.watchlater) return;
                if (!BLOD.uid) return toast.warning("未登录！", "无法启用稍后再看");
                BLOD.reset.playerSetting();
                BLOD.path.name = "watchlater";
                BLOD.write(BLOD.reset.oldScript(BLOD.getResourceText("watchlater")));
                BLOD.reset.setLike();
                BLOD.reset.fixSort.watchlater();
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("页面重写", ...e); }
        }
        bangumi() {
            try {
                if (!BLOD.config.rewrite.bangumi) return;
                BLOD.reset.playerSetting();
                BLOD.path.name = "bangumi";
                BLOD.pgc = true;
                let data = (BLOD.uid && BLOD.xhr.false(location.href).match(/last_ep_id\"\:[0-9]+/)) || [];
                let id = BLOD.path[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : null;
                id = id || (data[0] && data[0].split(":")[1]) || null;
                if (BLOD.path[5].startsWith('ss')) {
                    data = BLOD.xhr.false(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { season_id: location.href.match(/[0-9]+/)[0] }));
                } else if (BLOD.path[5].startsWith('ep')) {
                    data = BLOD.xhr.false(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { ep_id: location.href.match(/[0-9]+/)[0] }));
                }
                BLOD.__INITIAL_STATE__ = BLOD.iniState.bangumi(data, id);
                if (BLOD.__INITIAL_STATE__ && BLOD.__INITIAL_STATE__.epInfo && BLOD.__INITIAL_STATE__.epInfo.badge === "互动") return toast.warning("这似乎是个互动番剧！", "什么！番剧也能互动？", "可惜旧版播放器不支持 ಥ_ಥ");
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
                if (data.match('"specialCover":""') || !BLOD.__INITIAL_STATE__.special) BLOD.write(BLOD.reset.oldScript(BLOD.getResourceText("bangumi")));
                else BLOD.write(BLOD.reset.oldScript(BLOD.getResourceText("cinema")));
                document.title = BLOD.title || BLOD.__INITIAL_STATE__.mediaInfo.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                if (BLOD.__INITIAL_STATE__) BLOD.reset.setBangumi.init(BLOD.__INITIAL_STATE__);

            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("页面重写", ...e); }
        }
        blackboard() {
            if (BLOD.path[4].startsWith('html5player')) {
                if (BLOD.path[4].includes("3521416") && BLOD.path[4].includes("6041635")) {
                    location.replace(BLOD.objUrl("https://www.bilibili.com/blackboard/html5player.html", { "aid": 3521416, "cid": 192446449 }));
                }
            }
            try {
                if (!BLOD.config.rewrite.frame) return;
                BLOD.reset.playerSetting();
                BLOD.path.name = "blackboard";
                if (BLOD.path[4].startsWith('newplayer')) {
                    let obj = BLOD.urlObj(location.href),
                        season_type = obj.season_type || null,
                        player_type = obj.player_type || null;
                    BLOD.aid = 1 * obj.aid || (obj.aid ? BLOD.abv(obj.aid) : undefined) || (obj.bvid ? BLOD.abv(obj.bvid) : undefined);
                    BLOD.cid = obj.cid || "";
                    try {
                        BLOD.cid = BLOD.cid || BLOD.jsonCheck(BLOD.xhr.false(
                            BLOD.objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": BLOD.aid }))).data[0].cid
                    }
                    catch (e) { e = Array.isArray(e) ? e : [e]; BLOD.debug.error("框架·嵌入", ...e) }
                    location.replace(BLOD.objUrl("https://www.bilibili.com/blackboard/html5player.html", { "aid": BLOD.aid, "cid": BLOD.cid, "season_type": season_type, "player_type": player_type, "as_wide": 1, }));
                    toast.success("嵌入式播放器", "aid：", BLOD.aid, " cid：", BLOD.cid);
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("页面重写", ...e); }
        }
        playlist() {
            BLOD.path.name = "playlist";
            if (BLOD.path[4] == "video") {
                BLOD.write(BLOD.reset.oldScript(BLOD.getResourceText("playlist")));
                toast.warning("播单页相关接口已失效！", "脚本也无法恢复 ಥ_ಥ");
            }
            if (BLOD.path[4] == "detail") {
                BLOD.__INITIAL_STATE__ = { mid: "", pid: "", plinfoData: {}, pllistData: {} }
                try {
                    let page = BLOD.jsonCheck(BLOD.xhr.false(BLOD.objUrl("https://api.bilibili.com/x/playlist/video/toview", { pid: BLOD.path[5].match(/[0-9]+/)[0] }))).data;
                    BLOD.__INITIAL_STATE__.mid = page.mid;
                    BLOD.__INITIAL_STATE__.pid = page.pid;
                    BLOD.__INITIAL_STATE__.plinfoData = { attr: page.attr, count: page.count, cover: page.cover, ctime: page.ctime, description: page.description, favored: page.favored, id: page.id, is_favorite: page.is_favorite, mid: page.mid, mtime: page.mtime, owner: page.owner, pid: page.pid, stat: page.stat, state: page.state, type: page.type, };
                    BLOD.__INITIAL_STATE__.pllistData = page.list;
                }
                catch (e) {
                    e = Array.isArray(e) ? e : [e];
                    BLOD.debug.error("播单", ...e);
                    BLOD.__INITIAL_STATE__ = JSON.parse(BLOD.getResourceText("playlistjson"));
                }
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
                BLOD.write(BLOD.reset.oldScript(BLOD.getResourceText("playlistdetail")));
                toast.warning("无法播单例表！", "这里使用的是一例备份数据以供参考");
            }
        }
        medialist() {
            if (BLOD.path[5].startsWith("ml")) {
                BLOD.ml = 1 * BLOD.path[5].match(/[0-9]+/)[0];
                // 保存收藏号并调用av跳转
                if (!BLOD.config.rewrite.medialist) return;
                BLOD.path.name = "medialist";
                BLOD.setValue("medialist", BLOD.ml);
                BLOD.reset.setMediaList.init(BLOD.ml);
            }
            // 新版稍后再看跳转到旧版稍后再看
            if (BLOD.path[5].startsWith("watchlater") && BLOD.config.rewrite.watchlater) location.replace("https://www.bilibili.com/watchlater/#/");
        }
        s() {
            if (!BLOD.config.reset.static) return;
            BLOD.path.name = "s";
            location.replace(location.href.replace("s/video", "video"));
        }
        space() {
            BLOD.mid = BLOD.path[3] ? 1 * BLOD.path[3] : BLOD.mid;
            BLOD.reset.setJoinTime();
        }
        index() {
            try {
                if (!BLOD.config.rewrite.home) return;
                BLOD.path.name = "index";
                if (!window.__INITIAL_STATE__) {
                    let page = BLOD.xhr.false(location.href);
                    BLOD.__INITIAL_STATE__ = page.includes("__INITIAL_STATE__=") ? page.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : "";
                }
                else BLOD.__INITIAL_STATE__ = JSON.stringify(window.__INITIAL_STATE__);
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__ = BLOD.iniState.index(BLOD.__INITIAL_STATE__);
                BLOD.write(BLOD.getResourceText("index"));
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("页面重写", ...e); }
        }
        rank() {
            try {
                if (!BLOD.config.rewrite.rank) return;
                BLOD.path.name = "rank";
                let refer = document.referrer.split("/"), page;
                if (refer && refer[4] && refer[4] == "all") page = BLOD.jsonCheck(BLOD.xhr.false(BLOD.objUrl("https://api.bilibili.com/x/web-interface/ranking/v2", { rid: refer[5], day: 3 })));
                else page = BLOD.jsonCheck(BLOD.xhr.false(BLOD.objUrl("https://api.bilibili.com/x/web-interface/ranking/v2", { rid: 0, day: 3 })));
                page.data.list.forEach(((e, i, l) => {
                    l[i] = Object.assign(l[i], { author: l[i].owner.name, coins: l[i].stat.coin, mid: l[i].owner.mid, play: l[i].stat.view, pts: l[i].score, trend: null, video_review: l[i].stat.danmaku });
                    if (l[i].others) {
                        l[i].others.forEach(((e, i, l) => {
                            l[i] = Object.assign(l[i], { author: l[i].owner.name, coins: l[i].stat.coin, mid: l[i].owner.mid, play: l[i].stat.view, pts: l[i].score, trend: null, video_review: l[i].stat.danmaku });
                        }));
                    }
                }))
                BLOD.__INITIAL_STATE__ = { loading: false, rankRouteParams: { arc_type: 0, day: 3, rankTab: "all", rid: 1 * refer[5] || 0, season_type: 1 }, showTypes: true, times: [{ name: "日排行", value: 1 }, { name: "三日排行", value: 3 }, { name: "周排行", value: 7 }, { name: "月排行", value: 30 }], typeList: [{ name: "全部投稿", value: 0 }, { name: "近期投稿", value: 1 }] };
                BLOD.__INITIAL_STATE__.channels = [{ name: "全站", tid: 0 }, { name: "动画", tid: 1 }, { name: "国创相关", tid: 168 }, { name: "音乐", tid: 3 }, { name: "舞蹈", tid: 129 }, { name: "游戏", tid: 4 }, { name: "科技", tid: 36 }, { name: "数码", tid: 188 }, { name: "生活", tid: 160 }, { name: "美食", tid: 211 }, { name: "鬼畜", tid: 119 }, { name: "时尚", tid: 155 }, { name: "娱乐", tid: 5 }, { name: "影视", tid: 181 }];
                BLOD.__INITIAL_STATE__.rankList = page.data.list;
                BLOD.__INITIAL_STATE__.note = page.data.note;
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
                BLOD.write(BLOD.reset.oldScript(BLOD.getResourceText("ranking")));
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("页面重写", ...e); }
        }
    }

    const exports = () => {
        let rewrite = new Write();
        function makeExports(type) {
            return function (...msg) {
                return rewrite[type](...msg);
            }
        }
        let method = BLOD.write
        method.av = makeExports("av");
        method.watchlater = makeExports("watchlater");
        method.bangumi = makeExports("bangumi");
        method.blackboard = makeExports("blackboard");
        method.playlist = makeExports("playlist");
        method.medialist = makeExports("medialist");
        method.s = makeExports("s");
        method.space = makeExports("space");
        method.index = makeExports("index");
        method.rank = makeExports("rank");
        return method;
    }

    BLOD.rewrite = exports();
})()