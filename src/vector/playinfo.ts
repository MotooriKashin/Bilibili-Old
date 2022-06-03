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
    xhrhook("api.bilibili.com/x/player.so", () => {
        if (!tag && th && (<any>window).__INITIAL_STATE__?.epInfo?.subtitles) {
            if ((<any>window).__INITIAL_STATE__.epInfo.subtitles[0]) {
                config.closedCaption && closedCaption.getCaption((<any>window).__INITIAL_STATE__.epInfo.subtitles.reduce((s: any[], d: any) => {
                    s.push({
                        ai_type: 0,
                        id: d.id,
                        id_str: d.id,
                        is_lock: false,
                        lan: d.key,
                        lan_doc: d.title,
                        subtitle_url: d.url,
                        type: 0
                    })
                    return s;
                }, []));
                tag = true;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    tag = false
                }, 1000);
            }
        }
        return true;
    }, res => {
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
    xhrhookAsync("api.bilibili.com/x/player/carousel.so", undefined, async () => {
        let str = `<msg><item bgcolor="#000000" catalog="news"><![CDATA[<a href="//app.bilibili.com/?from=bfq" target="_blank"><font color="#ffffff">客户端下载</font></a>]]></item><item bgcolor="#000000" catalog="news"><![CDATA[<a href="http://link.acg.tv/forum.php" target="_blank"><font color="#ffffff">bug反馈传送门</font></a>]]></item></msg>'`;
        try {
            const arr = await Promise.all([
                xhr.get("//api.bilibili.com/pgc/operation/api/slideshow?position_id=531", { responseType: "json" }).then(d => {
                    return d.result.reduce((s: any, d: any, i: any) => {
                        s += `<item tooltip="" bgcolor="#000000" catalog="bangumi" resourceid="2319" srcid="${2320 + i}" id="${314825 + i}"><![CDATA[<a href="${d.blink}" target="_blank"><font color="#FFFFFF">${d.title}</font></a>]]></item>`;
                        return s;
                    }, "");
                }).catch(e => {
                    debug.error("播放器消息", "bangumi", e);
                    return "";
                }),
                xhr.get("https://api.bilibili.com/x/web-show/res/loc?pf=0&id=4694", { responseType: "json" }).then(d => {
                    return d.data.reduce((s: any, d: any, i: any) => {
                        d.name && (s += `<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="${2320 + i}" id="${314825 + i}"><![CDATA[<a href="${d.url}" target="_blank"><font color="#FFFFFF">${d.name}</font></a>]]></item>`);
                        return s;
                    }, "");
                }).catch(e => {
                    debug.error("播放器消息", "system", e);
                    return "";
                }),
                xhr.get("https://api.bilibili.com/x/web-interface/search/square?limit=10", { responseType: "json" }).then(d => {
                    return d.data.trending.list.reduce((s: any, d: any, i: any) => {
                        s += `<item tooltip="" bgcolor="#000000" catalog="news" resourceid="2319" srcid="${2320 + i}" id="${314825 + i}"><![CDATA[<a href="https://search.bilibili.com/all?keyword=${encodeURIComponent(d.keyword)}" target="_blank"><font color="#FFFFFF">${d.keyword}</font></a>]]></item>`;
                        return s;
                    }, "<msg>");
                }).catch(e => {
                    debug.error("播放器消息", "news", e);
                    return "";
                })
            ]);
            str = arr.sort(() => 0.5 - Math.random()).reduce((s, d) => {
                s += d;
                return s;
            }, "<msg>") + "</msg>";
        } catch (e) { debug.error("播放器消息", e) }
        const dom = new DOMParser().parseFromString(str, "text/xml");
        return {
            response: dom,
            responseXML: dom
        }
    }, false);
}
declare namespace API {
    /**
     * playurl存档
     */
    let __playinfo__: any;
}