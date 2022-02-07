interface modules {
    /**
     * Bangumi分集数据
     */
    readonly "episodeData.js": string;
}
{
    let first = 0; // 首p指示
    API.switchVideo(async () => {
        try {
            first++;
            let views = <HTMLSpanElement>(<HTMLDivElement>document.querySelector(".view-count")).querySelector("span");
            let danmakus = <HTMLSpanElement>(<HTMLDivElement>document.querySelector(".danmu-count")).querySelector("span");
            if (first === 1) {
                // 首p时辈分总播放数和总弹幕数
                views.setAttribute("title", "总播放数 " + views.innerText);
                danmakus.setAttribute("title", "总弹幕数 " + danmakus.innerText);
                debug.debug("总播放数", views.innerText, " 总弹幕数", danmakus.innerText);
            }
            let data = await xhr({
                url: Format.objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": String(API.aid) }),
                credentials: true
            }); // 获取分集数据
            data = API.jsonCheck(data).data;
            let view = data.view;
            let danmaku = data.danmaku;
            view = Format.unitFormat(view);
            danmaku = Format.unitFormat(danmaku);
            views.innerText = view;
            danmakus.innerText = danmaku;
            debug.debug("播放", view + " 弹幕", danmaku);
        } catch (e) { debug.error("episodeData.js", e) }
    })
}