// module "rewrite.js"

const BLOD = window.BLOD;
const debug = BLOD.debug;
const config = BLOD.config;
const LOCATION = document.location.href.split('/');
const rewrite = {
    av: async () => {
        BLOD.path.name = "av";
        BLOD.ml = await BLOD.getValue("medialist");
        BLOD.deleteValue("medialist");
        if (config.reset.bvid2av && LOCATION[4].toLowerCase().startsWith('bv')) {
            BLOD.aid = BLOD.abv(LOCATION[4]);
            history.replaceState(null, null, "https://www.bilibili.com/video/av" + BLOD.aid + location.search + location.hash);
        }
        try {
            if (!config.rewrite.av) throw ["未启用旧版av页", location.href];
            BLOD.aid = BLOD.aid || LOCATION[4].match(/[0-9]+/)[0];
            let page = BLOD.BLOD.xhr.false(BLOD.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: BLOD.aid })).responseText;
            await import(await BLOD.getResourceUrl("__INITIAL_STATE__"));
            BLOD.__INITIAL_STATE__ = BLOD.iniState.av(page);
            if (!BLOD.__INITIAL_STATE__) throw "av/BV号可能无效！";
            if (BLOD.__INITIAL_STATE__.videoData.redirect_url) throw ["番剧重定向：", BLOD.__INITIAL_STATE__.videoData.redirect_url];
            if (BLOD.__INITIAL_STATE__.videoData.stein_guide_cid) throw ["忽略互动视频：", "av" + BLOD.aid];
            BLOD.aid = BLOD.__INITIAL_STATE__.aid ? BLOD.__INITIAL_STATE__.aid : BLOD.aid;
            BLOD.tid = BLOD.__INITIAL_STATE__.videoData.tid ? BLOD.__INITIAL_STATE__.videoData.tid : BLOD.tid;
            window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
            BLOD.write(await BLOD.getResourceText("av"));
            document.title = BLOD.__INITIAL_STATE__.videoData.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
        } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·av/BV", ...e) }
    },
    watchlater: async () => {
        BLOD.path.name = "watchlater";
        try {
            if (!config.rewrite.watchlater) throw ["未启用旧版稍后再看", location.href];
            if (!BLOD.uid) throw ["未登录", "无法启用旧版稍后再看"];
            BLOD.write(await BLOD.getResourceText("watchlater"));
            if (LOCATION[5]) {
                BLOD.aid = LOCATION[5].match(/[0-9]+/) ? LOCATION[5].match(/[0-9]+/)[0] : BLOD.aid;
                if (LOCATION[5].toLowerCase().startsWith('bv')) {
                    BLOD.aid = BLOD.abv(LOCATION[5]);
                    LOCATION[5] = "av" + BLOD.aid;
                    history.replaceState(null, null, LOCATION.join("/"));
                }
            }
        } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·稍后再看", ...e) }
    },
    bangumi: async () => {
        BLOD.path.name = "bangumi";
        try {
            if (!config.rewrite.bangumi) throw ["未启用旧版Bangumi", location.href];
            BLOD.pgc = true;
            let page = BLOD.BLOD.xhr.false(location.href).responseText;
            BLOD.__INITIAL_STATE__ = page.includes("__INITIAL_STATE__=") ?
                JSON.parse(page.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "")) : "";
            if (!BLOD.__INITIAL_STATE__) {
                if (LOCATION[5].startsWith('ss')) {
                    page = BLOD.false(BLOD.objUrl("https://api.bilibili.com/pgc/view/web/season", { season_id: location.href.match(/[0-9]+/)[0] })).responseText;
                } else if (LOCATION[5].startsWith('ep')) {
                    page = BLOD.false(BLOD.objUrl("https://api.bilibili.com/pgc/view/web/season", { ep_id: location.href.match(/[0-9]+/)[0] })).responseText;
                }
            }
            let id = LOCATION[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : "";
            await import(await BLOD.getResourceUrl("__INITIAL_STATE__"));
            BLOD.__INITIAL_STATE__ = BLOD.iniState.bangumi(page, id);
            if (BLOD.__INITIAL_STATE__ && BLOD.__INITIAL_STATE__.epInfo && BLOD.__INITIAL_STATE__.epInfo.badge === "互动") throw ["忽略互动视频：", location.href];
            window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
            if (page.match('"specialCover":""') || !BLOD.__INITIAL_STATE__.special) BLOD.write(await BLOD.getResourceText("bangumi"));
            else BLOD.write(await BLOD.getResourceText("cinema"));
            document.title = page.match(/<title.*?>.+?<\/title>/) ?
                page.match(/<title.*?>.+?<\/title>/)[0].replace(/<title.*?>/, "").replace(/<\/title>/, "") : BLOD.__INITIAL_STATE__.mediaInfo.title;

        } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·Bangumi", ...e) }
    },
    blackboard: async () => {
        BLOD.path.name = "blackboard";
        if (BLOD.path[4].startsWith('html5player')) {
            if (BLOD.path[4].includes("3521416") && BLOD.path[4].includes("6041635")) {
                location.replace(BLOD.objUrl("https://www.bilibili.com/blackboard/html5player.html", { "aid": 3521416, "cid": 192446449 }));
            }
        }
        try {
            if (!config.rewrite.frame) throw ["未启用旧版嵌入播放器", location.href];
            if (BLOD.path[4].startsWith('newplayer')) {
                let obj = BLOD.urlObj(location.href),
                    season_type = obj.season_type || "",
                    player_type = obj.player_type || "";
                BLOD.aid = 1 * obj.aid || (obj.aid ? BLOD.abv(obj.aid) : undefined) || (obj.bvid ? BLOD.abv(obj.bvid) : undefined);
                BLOD.cid = obj.cid || "";
                try {
                    BLOD.cid = BLOD.cid || BLOD.jsonCheck(BLOD.BLOD.xhr.false(
                        BLOD.objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": BLOD.aid })).responseText).data[0].cid
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·嵌入", ...e) }
                location.replace(BLOD.objUrl("https://www.bilibili.com/blackboard/html5player.html",
                    { "aid": BLOD.aid, "cid": BLOD.cid, "season_type": season_type, "player_type": player_type, "as_wide": 1, }));
                debug.log("嵌入播放器", "aid=", BLOD.aid, " cid=", BLOD.cid);
            }
        } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·嵌入", ...e) }
    },
    playlist: async () => {
        BLOD.path.name = "playlist";
        if (BLOD.path[4] == "video") {
            BLOD.write(await BLOD.getResourceText("playlist"));
        }
        if (BLOD.path[4] == "detail") {
            BLOD.__INITIAL_STATE__ = { mid: "", pid: "", plinfoData: {}, pllistData: {} }
            try {
                let page = BLOD.jsonCheck(
                    BLOD.BLOD.xhr.false(BLOD.objUrl("https://api.bilibili.com/x/playlist/video/toview", { pid: BLOD.path[5].match(/[0-9]+/)[0] })).responseText).data;
                BLOD.__INITIAL_STATE__.mid = page.mid;
                BLOD.__INITIAL_STATE__.pid = page.pid;
                BLOD.__INITIAL_STATE__.plinfoData = { attr: page.attr, count: page.count, cover: page.cover, ctime: page.ctime, description: page.description, favored: page.favored, id: page.id, is_favorite: page.is_favorite, mid: page.mid, mtime: page.mtime, owner: page.owner, pid: page.pid, stat: page.stat, state: page.state, type: page.type, };
                BLOD.__INITIAL_STATE__.pllistData = page.list;
            }
            catch (e) {
                e = Array.isArray(e) ? e : [e]; debug.error("播单", ...e);
                BLOD.__INITIAL_STATE__ = JSON.parse(await BLOD.getResourceText("playlistjson"));
                window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
            }
            BLOD.write(await BLOD.getResourceText("playlistdetail"));
        }
    },
    s: async () => {
        BLOD.path.name = "s";
        if (!config.reset.static) return;
        location.replace(location.href.replace("s/video", "video"));
    },
    home: async () => {
        try {
            if (!config.rewrite.home) throw ["未启用旧版主页", location.href];
            BLOD.path.name = "home";
            if (!window.__INITIAL_STATE__) {
                let page = BLOD.xhr.false(location.href).responseText;
                BLOD.__INITIAL_STATE__ = page.includes("__INITIAL_STATE__=") ? page.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : "";
            }
            else BLOD.__INITIAL_STATE__ = JSON.stringify(window.__INITIAL_STATE__);
            window.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__ = BLOD.iniState.home(BLOD.__INITIAL_STATE__);
            BLOD.write(API.pageframe.home);
        }
        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·主页", ...e) }
    }
}

BLOD.rewrite = rewrite;