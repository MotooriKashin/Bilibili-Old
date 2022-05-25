interface modules {
    /** 视频信息记录 */
    readonly "playinfo.js": string;
}
namespace API {
    xhrhook("/playurl?", args => {
        const param = urlObj(args[1]);
        args[1].includes("84956560bc028eb7") && (args[1] = urlsign(args[1], {}, 8)); // 修复失效的appid
        args[1].includes("pgc") && (pgc = true); // ogv视频
        // 更新关键参数
        param.aid && (aid = Number(param.aid));
        param.avid && (aid = Number(param.avid));
        param.cid && (cid = Number(param.cid));
        param.seasonId && (ssid = Number(param.seasonId));
        param.episodeId && (epid = Number(param.episodeId));
    }, async obj => {
        try {
            __playinfo__ = obj.responseType === "json" ? obj.response : jsonCheck(obj.response);
        } catch (e) { }
    }, false);
    let timer: number, tag = false; // 过滤栈
    xhrhook("api.bilibili.com/x/player.so", undefined, res => {
        try {
            if (statusCheck(res.status)) {
                let subtitle = "", view_points;
                res.response.replace(/<subtitle>.+?<\/subtitle>/, (d: string) => {
                    subtitle = d.replace("<subtitle>", "").replace("</subtitle>", "");
                });
                res.response.replace(/<view_points>.+?<\/view_points>/, (d: string) => {
                    view_points = d.replace("<view_points>", "").replace("</view_points>", "");
                });
                subtitle && config.closedCaption && closedCaption.getCaption(JSON.parse(subtitle).subtitles);
                view_points && config.segProgress && new SegProgress(JSON.parse(view_points));
            } else {
                // 404会触发接口多次请求，需要过滤
                !tag && xhr({
                    url: objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: cid, aid: aid, type: 1 }),
                    responseType: "json",
                    credentials: true
                }, true).then(data => {
                    config.closedCaption && data?.data?.subtitle?.subtitles && closedCaption.getCaption(data.data.subtitle.subtitles);
                    config.segProgress && data.data.view_points && data.data.view_points[1] && new SegProgress(data.data.view_points);
                });
                tag = true;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    tag = false
                }, 1000);
            }
        } catch (e) { }
    }, false);
}
declare namespace API {
    /**
     * playurl存档
     */
    let __playinfo__: any;
}