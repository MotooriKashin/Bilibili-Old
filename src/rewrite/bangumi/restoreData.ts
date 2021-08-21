/**
 * 本模块负责修复Bangumi页面数据错误
 */
(function () {
    // 修复追番数
    API.xhrhook(["bangumi.bilibili.com/ext/web_api/season_count?"], function (args) {
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                try {
                    let response = API.jsonCheck(this.responseText);
                    response.result.favorites = response.result.follow;
                    Object.defineProperty(this, 'response', { writable: true });
                    Object.defineProperty(this, 'responseText', { writable: true });
                    (<any>this).response = (<any>this).responseText = JSON.stringify(response);
                } catch (e) { API.debug.trace(e, "restoreData.js") }
            }
        });
        args[1] = args[1].replace('bangumi.bilibili.com/ext/web_api/season_count', 'api.bilibili.com/pgc/web/season/stat');
    })
    // 修复片尾番剧推荐
    API.xhrhook(["api.bilibili.com/pgc/web/recommend/related/recommend"], function (args) {
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                try {
                    let response = API.jsonCheck(this.responseText);
                    if (response.result && response.result.season) response.result = response.result.season;
                    Object.defineProperty(this, 'response', { writable: true });
                    Object.defineProperty(this, 'responseText', { writable: true });
                    (<any>this).response = (<any>this).responseText = JSON.stringify(response);
                } catch (e) { API.debug.trace(e, "restoreData.js") }
            }
        })
    })
    // 修复番剧推荐
    API.xhrhook(["comment.bilibili.com/playtag"], function (args) {
        args[1] = "https://comment.bilibili.com/playtag,2-2?html5=1";
        restoreBangumiRecommand();
    })
    async function restoreBangumiRecommand() {
        let data = API.jsonCheck(await API.xhr({ url: API.objUrl("https://api.bilibili.com/pgc/web/recommend/related/recommend", { season_id: String((<BANGUMI__INITIAL_STATE__>API.__INITIAL_STATE__).ssId) }) })).result;
        let result = API.jsonCheck(await API.xhr({ url: API.objUrl("https://api.bilibili.com/x/tag/info", { tag_name: (<BANGUMI__INITIAL_STATE__>API.__INITIAL_STATE__).mediaInfo.title }) }));
        result = API.jsonCheck(await API.xhr({ url: API.objUrl("https://api.bilibili.com/x/web-interface/tag/top", { tid: result.data.tag_id }) })).data;
        if (!document.querySelector(".bilibili-player-recommend")) {
            await new Promise(r => {
                document.querySelector(".bilibili-player-recommend") && r(true);
            })
        }
        result = result.reduce((s: string, d: any) => {
            s = s + `<li class="recom-item">
                <a href="https://www.bilibili.com/video/av${d.aid}" target="_blank" title="${d.title}">
                <div class="recom-img"><div class="common-lazy-img">
                <img alt="${d.title}" src="${d.pic.replace("http:", "")}@224w_140h.webp" lazy="loaded">
                </div></div>
                <div class="recom-info">
                <div class="info-title">${d.title}</div>
                <div class="info-count">
                <div class="play-count"><i></i><span>${API.unitFormat(d.stat.view)}</span></div>
                <div class="danmu-count"><i></i><span>${API.unitFormat(d.stat.danmaku)}</span></div>
                </div></div></a></li>`;
            return s;
        }, "")
        // @ts-ignore：节点肯定存在
        document.querySelector(".recom-list.clearfix").innerHTML = result;
        data = data.reduce((s: string, d: any) => {
            s = s + `<a class="bilibili-player-recommend-video" href="${d.url}" target="_blank">
                <div class="bilibili-player-recommend-left">
                <img src="${d.new_ep.cover || d.cover}@160w_100h.webp" alt="${d.title}" class="mCS_img_loaded" />
                <span class="player-tooltips-trigger"><i class="bilibili-player-iconfont icon-22wait-normal"></i></span>
                </div>
                <div class="bilibili-player-recommend-right">
                <div class="bilibili-player-recommend-title" title="${d.title}">${d.title}</div>
                <div class="bilibili-player-recommend-click"><i class="bilibili-player-iconfont icon-12iconplayed"></i>${API.unitFormat(d.stat.view)}</div>
                <div class="bilibili-player-recommend-danmaku"><i class="bilibili-player-iconfont icon-12icondanmu"></i>${API.unitFormat(d.stat.danmaku)}</div>
                </div></a>`
            return s;
        }, '')
        let item = <HTMLDivElement>document.querySelector(".bilibili-player-recommend");
        if (!item.querySelector(".mCSB_container")) {
            await new Promise(r => { item.querySelector(".mCSB_container") && r(true) })
        }
        // @ts-ignorei：前面判定了存在节点
        item.querySelector(".mCSB_container").innerHTML = data;
    }
})();