/**
 * 本模块负责重写av/BV页，由`rewrite.js`按需引导
 * 其他只在重写过的旧版页面生效的功能可添加在本模块中，但更推荐编写在单独的模块中然后将引导代码写在本模块中。
 * */
(function () {
    // 重定向SEO页面
    if (/\/s\//.test(location.href)) location.replace(location.href.replace("s/video", "video"));
    API.path.name = "av";
    API.getVariable({ origin: window, target: "aid" });
    API.getVariable({ origin: window, target: "cid" });
    // 备份还原旧版播放器设置数据
    API.importModule("playerSetting.js");
    // 获取aid
    if (API.path[4].toLowerCase().startsWith('bv')) API.aid = API.abv(API.path[4].split("#")[0].split("?")[0]);
    API.aid = API.aid || Number((<RegExpExecArray>/[0-9]+/.exec(String(API.path[4])))[0]);
    try {
        // 准备__INITIAL_STATE__
        let data = API.xhr({
            url: API.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: <string>API.aid }),
            async: false
        });
        API.importModule("av-detail.js", { __INITIAL_STATE__: data });
        if (!API.__INITIAL_STATE__) {
            data = API.xhr({
                url: API.objUrl("https://www.biliplus.com/api/view", { id: <string>API.aid }),
                async: false
            });
            API.importModule("av-biliplus.js", { __INITIAL_STATE__: data });
            if (!config.lostVideo) return API.toast.error("av/BV号可能无效！", "尝试设置中启用【失效视频】重建页面？");
        }
        // __INITIAL_STATE__类型保护
        const isAV__INITIAL_STATE__ = (pet: AV__INITIAL_STATE__ | BANGUMI__INITIAL_STATE__ | INDEX__INITIAL_STATE__): pet is AV__INITIAL_STATE__ => true;
        if (isAV__INITIAL_STATE__(API.__INITIAL_STATE__)) {
            if (!API.__INITIAL_STATE__) return API.toast.error("av/BV号可能无效！");
            if (API.__INITIAL_STATE__.videoData.redirect_url) return API.toast.warning("番剧重定向...", API.__INITIAL_STATE__.videoData.redirect_url);
            if (API.__INITIAL_STATE__.videoData.stein_guide_cid) return API.toast.warning("这似乎是个互动视频！", "抱歉！旧版播放器无法支持 ಥ_ಥ");
            API.aid = API.__INITIAL_STATE__.aid;
            API.tid = API.__INITIAL_STATE__.videoData.tid;
            (<any>window).__INITIAL_STATE__ = API.__INITIAL_STATE__;
            API.rewriteHTML(GM.getResourceText("av.html"));
            document.title = API.__INITIAL_STATE__.videoData.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
            API.addCss(GM.getResourceText("bofqi.css"));
            // 移除失效顶栏
            API.runWhile(() => document.getElementsByClassName("bili-header-m report-wrap-module")[1], () => document.getElementsByClassName("bili-header-m report-wrap-module")[1].remove());
            // 修复评论跳转
            (<any>window).commentAgent = { seek: (t: any) => (<any>window).player && (<any>window).player.seek(t) };
            // 添加点赞功能
            config.enlike && API.importModule("enLike.js");
            // 构造媒体页
            GM.getValue<number>("medialist", 0) && API.importModule("mediaList.js");
            // 和作UP主
            config.upList && API.__INITIAL_STATE__.videoData.staff && API.importModule("upList.js", { staff: API.__INITIAL_STATE__.videoData.staff });
            // 视频简介中的bv转超链接
            API.importModule("descBV.js");
            // 修复原生代码错误
            API.importModule("hookWebpackJsonp.js");
            // 互动弹幕
            config.commandDm && API.importModule("commandDm.js");
            // 添加媒体控制
            API.importModule("mediaControl.js", {
                title: API.__INITIAL_STATE__.videoData.title,
                artist: API.__INITIAL_STATE__.videoData.owner.name,
                chapterName: (pid: any, playList: any[]) => playList[pid].part,
                coverUrl: () => [{ src: (<AV__INITIAL_STATE__>API.__INITIAL_STATE__).videoData.pic, sizes: "320x180" }],
                getPlaylistIndex: () => (<any>window).player.getPlaylistIndex()
            })
            // 跳过充电鸣谢
            API.jsonphook(["api.bilibili.com/x/web-interface/elec/show"], function (xhr) { this.url = API.objUrl(this.url.split("?")[0], Object.assign(API.urlObj(this.url), { aid: 1, mid: 1 })) })
        }
    } catch (e) { API.debug.trace(e, "av.ts", true) }
})();
