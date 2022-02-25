interface modules {
    /** 页面数据修复 */
    readonly "restoreData.js": string;
}
namespace API {
    // 修复追番数
    xhrhook("bangumi.bilibili.com/ext/web_api/season_count?", args => {
        args[1] = args[1].replace('bangumi.bilibili.com/ext/web_api/season_count', 'api.bilibili.com/pgc/web/season/stat');
    }, args => {
        const response = jsonCheck(<string>args.responseText);
        response.result.favorites = response.result.follow;
        args.response = args.responseText = JSON.stringify(response);
    }, false)
    // 修复番剧推荐
    addCss(`#bangumi_recommend_vertial .recom-list{
            height: 960px;
            overflow: auto;
        } .recom-list::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
        }`, "recom-list");
    runWhile(() => document.querySelector(".recom-list.clearfix"), async () => {
        let result: any = jsonCheck(await xhr({ url: Format.objUrl("https://api.bilibili.com/x/tag/info", { tag_name: ((<any>API).__INITIAL_STATE__).mediaInfo.title }) }));
        result = jsonCheck(await xhr({ url: Format.objUrl("https://api.bilibili.com/x/web-interface/tag/top", { tid: result.data.tag_id }) })).data;
        result = result.reduce((s: string, d: any) => {
            s = s + `<li class="recom-item">
                <a href="https://www.bilibili.com/video/av${d.aid}" target="_blank" title="${d.title}">
                <div class="recom-img"><div class="common-lazy-img">
                <img alt="${d.title}" src="${d.pic.replace("http:", "")}@224w_140h.webp" lazy="loaded">
                </div></div>
                <div class="recom-info">
                <div class="info-title">${d.title}</div>
                <div class="info-count">
                <div class="play-count"><i></i><span>${Format.unitFormat(d.stat.view)}</span></div>
                <div class="danmu-count"><i></i><span>${Format.unitFormat(d.stat.danmaku)}</span></div>
                </div></div></a></li>`;
            return s;
        }, "");
        (<HTMLElement>document.querySelector(".recom-list.clearfix")).innerHTML = result;
    })
}