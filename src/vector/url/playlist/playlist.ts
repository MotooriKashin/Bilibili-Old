interface modules {
    /** 重构播单 */
    readonly "playlist.js": string;
    readonly "playlist.html": string;
    readonly "playlist-script.html": string;
}
namespace API {
    if (rebuildType != "重定向") windowClear();
    /** 页面参数 */
    const route = urlObj(location.href);
    let type = 3,
        pl = -1,
        isPl = Boolean(path[5].startsWith("pl")),
        oid = "",
        has_more = false,
        observer = new MutationObserver(d => Observer(d)); // 滚动锚
    path[5].replace(/\d+/, d => pl = <any>d);
    if (route.business) { // 却分medialist类型
        switch (route.business) {
            case "space": type = 1;
                break;
            case "space_series": type = 5; pl = <number>route.business_id;
                break;
            case "space_channel": type = 6; pl = 10 * <number>route.business_id + pl % 10;
                break;
            case "space_collection": type = 8; pl = <number>route.business_id;
                break;
            default: type = 3;
        }
    }
    !isPl && replaceUrl(objUrl(`https://www.bilibili.com/playlist/video/pl${pl}`, route)); // 伪装页面
    /** toview模板 */
    let toview = {
        attr: 2,
        count: 100,
        cover: "https://i0.hdslb.com/bfs/archive/a45ef4fcde397247032cf4ce0c8f71815f9e28d0.jpg",
        ctime: 1529021131,
        description: "bilibili moe 2018 动画角色人气大赏日本动画场应援视频播单 / 每天不定时更新最新的一批",
        faved_count: 0,
        favored: 0,
        favorite: false,
        id: 1826036,
        is_favorite: false,
        like_count: 0,
        list: <any>[],
        mid: 26468955,
        mlid: 182603655,
        mtime: 1533874759,
        name: "bilibili moe 2018 日本动画场应援",
        owner: {
            face: "http://i2.hdslb.com/bfs/face/57389d533621407d36981a99fed93834dd8b20e6.jpg",
            mid: 26468955,
            name: "萌战基"
        },
        pid: 769,
        play_count: 0,
        recent_oids: [],
        recent_res: [],
        reply_count: 0,
        share_count: 0,
        stat: {
            favorite: 1685,
            pid: 769,
            reply: 10,
            share: 0,
            view: 298928
        },
        state: 0,
        type: 2
    };
    function info(obj: Record<string, any>) {
        toview.attr = obj.data.attr;
        toview.count = obj.data.media_count;
        toview.cover = obj.data.cover;
        toview.ctime = obj.data.ctime;
        toview.description = obj.data.intro;
        toview.favored = obj.data.fav_state;
        toview.favorite = Boolean(obj.data.fav_state);
        toview.id = obj.data.id;
        toview.is_favorite = Boolean(obj.data.fav_state);
        toview.like_count = obj.data.like_state;
        toview.mid = obj.data.mid;
        toview.mlid = obj.data.id;
        toview.mtime = obj.data.ctime;
        toview.name = obj.data.title;
        toview.owner = obj.data.upper;
        toview.pid = obj.data.id;
        toview.stat.favorite = obj.data.cnt_info.collect;
        toview.stat.pid = obj.data.id;
        toview.stat.reply = obj.data.cnt_info.reply;
        toview.stat.share = obj.data.cnt_info.share;
        toview.stat.view = obj.data.cnt_info.play;
    }
    function list(obj: Record<string, any>) {
        obj.data.media_list.reduce((s: any, d: any) => {
            s.push({
                aid: d.id,
                attr: d.attr,
                attribute: 0,
                cid: d.pages[0].id,
                copyright: d.copy_right,
                ctime: d.pubtime,
                desc: d.intro,
                dimension: d.pages[0].dimension,
                duration: d.duration,
                dynamic: "",
                owner: d.upper,
                pages: d.pages.reduce((s: any, b: any) => {
                    s.push({
                        cid: b.id,
                        dimension: b.dimension,
                        duration: b.duration,
                        from: b.from,
                        page: b.page,
                        part: b.title,
                        vid: "",
                        weblink: b.link
                    });
                    return s;
                }, []),
                pic: d.cover,
                pubdate: d.pubtime,
                rights: d.rights,
                stat: {
                    aid: d.id,
                    coin: d.cnt_info.coin,
                    danmaku: d.cnt_info.danmaku,
                    dislike: d.cnt_info.thumb_down,
                    favorite: d.cnt_info.collect,
                    his_rank: 0,
                    like: d.cnt_info.thumb_up,
                    now_rank: 0,
                    reply: d.cnt_info.reply,
                    share: d.cnt_info.share,
                    view: d.cnt_info.play
                },
                state: 0,
                tid: d.tid,
                title: d.title,
                tname: "",
                videos: d.page
            });
            return s;
        }, toview.list);
        has_more = obj.data.has_more;
        oid = toview.list.at(-1).aid;
    }
    function Observer(record: MutationRecord[]) {
        record.forEach(d => {
            calcScroll(<HTMLDivElement>d.target)
        })
    }
    function calcScroll(node: HTMLDivElement) {
        const maxHeight = node.scrollHeight;
        const scroll = /\d+/.exec(node.style.top) ? Number(/\d+/.exec(node.style.top)) : 0;
        if (node.className.includes("hidden")) return;
        if (maxHeight - scroll > 0 && maxHeight - scroll < 600) {
            observer.disconnect(); // 暂停监听
            videoFloat("加载更多列表中~");
            xhr.get(`https://api.bilibili.com/x/v2/medialist/resource/list?type=${type}&oid=${oid}&otype=2&biz_id=${pl}&bvid=&with_current=true&mobi_app=web&ps=20&direction=false&sort_field=1&tid=0&desc=true`, { responseType: "json" }).then(d => {
                formatMore(d);
                has_more && startObserver(); // 重新监听
            }).catch(e => {
                toast.error("获取更多列表数据出错~");
                debug.error("播单", e);
            })
        }
    }
    function startObserver() {
        observer.observe(document.querySelector<any>(".bilibili-player-playlist-item").parentElement.parentElement, { attributes: true });
    }
    function formatMore(obj: any) {
        const result = obj.data.media_list.reduce((s: any, d: any) => {
            s.push({
                ao: d.rights && d.rights.pay,
                Sz: d.upper && d.upper.face,
                Te: d.pages.reduce((s: any, f: any) => {
                    s.push({
                        Da: d.bangumi?.ep_id,
                        Fb: d.bangumi?.season?.season_id,
                        aid: d.id,
                        duration: f.duration,
                        from: f.from,
                        j: f.id,
                        ni: f.title,
                        page: f.page
                    })
                    return s;
                }, []),
                Tz: d.upper && d.upper.mid,
                aid: d.id,
                duration: d.duration,
                ko: d.upper && d.upper.name,
                lb: d.cover,
                state: 0,
                title: d.title,
            })
            return s;
        }, []);
        list(obj); // 记录更多数据
        has_more ? (<any>window).player?.updatePlaylist(result) : videoFloat("没有更多了！"); // 推送到播放器脚本
    }
    jsonphookasync("toview", undefined, async url => {
        replaceUrl(path.join("/")); // 撤销伪装
        try {
            if (isPl || pl === 182603655) { // 备份页面
                const result = await xhr({
                    url: "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/Json/pl769.json",
                    responseType: "json"
                });
                toview = result.data;
                toast.warning("原生playlist页面已无法访问，已重定向到脚本备份的pl769~");
                return result;
            } else {
                const rqs = await Promise.all([ // toview数据来源
                    xhr.get(`https://api.bilibili.com/x/v1/medialist/info?type=${type}&biz_id=${pl}&tid=0`, { responseType: "json" }),
                    xhr.get(`https://api.bilibili.com/x/v2/medialist/resource/list?type=${type}&oid=${oid}&otype=2&biz_id=${pl}&bvid=&with_current=true&mobi_app=web&ps=20&direction=false&sort_field=1&tid=0&desc=true`, { responseType: "json" })
                ]);
                info(rqs[0]); // 分别填充模板
                list(rqs[1]);
                return { code: 0, data: toview, message: "0", ttl: 1 }
            }
        } catch (e) {
            toast.error("获取medialist数据失败！请刷新页面或者在脚本设置中关闭重构“medialist”选项");
            throw e;
        }
    });
    switchVideo(() => {
        if (has_more) { // 继续滚动监听
            doWhile(() => document.querySelector(".bilibili-player-playlist-item"), () => startObserver());
        }
    });

    loadVideoScript();
    if (rebuildType == "重定向") {
        document.documentElement.replaceChildren(createElements(htmlVnode(getModule("playlist.html"))));
        appendScripts(getModule("playlist-script.html")).then(() => loadendEvent());
    } else {
        documentWrite(getModule("playlist.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", `${getModule("playlist-script.html")}</body>`));
    }
    config.enlike && new enLike();
    importModule("primaryMenu.js"); // 顶栏分区修正
    importModule("banner.js"); // 顶栏banner修复
    importModule("loadByDmId.js"); // 弹幕ID跳转
    // 跳过充电鸣谢
    config.automate.electric && jsonphookasync("api.bilibili.com/x/web-interface/elec/show", undefined, async () => { return { code: -404 } }, false);
}