import toview from "./toview.json";
import script from "./script.html";
import html from "./playlist.html";
import { createElements } from "../../runtime/element/create_element";
import { htmlVnode } from "../../runtime/element/html_vnode";
import { loadVideoScript } from "../../runtime/player/embed_player";
import { sessionStorage } from "../../runtime/storage";
import { loadComment } from "../comment";
import { urlObj, objUrl } from "../../runtime/format/url";
import { replaceUrl } from "../../runtime/url_clean";
import { path } from "../../runtime/variable/path";
import { debug } from "../../runtime/debug";
import { doWhile } from "../../runtime/do_while";
import { appendScripts } from "../../runtime/element/create_scripts";
import { jsonphookasync } from "../../runtime/hook/node";
import { videoFloat } from "../../runtime/player/video_float";
import { setting } from "../../runtime/setting";
import { switchVideo } from "../../runtime/switch_video";
import { toast } from "../../runtime/toast/toast";
import { xhr } from "../../runtime/xhr";
import { enLike } from "../av/en_like";
import { loadByDmId } from "../av/load_by_dm_id";
import { primaryMenu, banner } from "../banner";
import { globalVector } from "../global";
import { keepNewCheck } from "../av/keep_new";

// 重写检查
keepNewCheck();
// 重写标记
sessionStorage.setItem("rebuild", true);
// 备份标题
const title = document.title;
// 刷新样式表
document.documentElement.replaceWith(createElements(htmlVnode(html)));
// 还原标题
title && !title.includes("404") && (document.title = title);
// 加载播放器脚本
loadVideoScript();
// 评论脚本
loadComment();

/** 页面参数 */
const route = urlObj(location.href);
/** medialist类型 */
let type = 3,
    /** playlist id */
    pl = -1,
    /** 原生playlist页面 */
    isPl = Boolean(path[5].startsWith("pl")),
    /** 已加载列表锚点 */
    oid = "",
    /** 还有更多 */
    has_more = false,
    /** 滚动锚 */
    observer = new MutationObserver(d => Observer(d));
path[5].replace(/\d+/, d => pl = <any>d);
// 区分medialist类型
if (route.business) {
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
// 伪装页面
!isPl && replaceUrl(objUrl(`https://www.bilibili.com/playlist/video/pl${pl}`, route));
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
    oid = <any>toview.list.at(-1)?.aid;
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
            toast.warning("原生playlist页面已无法访问，已重定向到备份的pl769~");
        } else {
            toview.list = [];
            const rqs = await Promise.all([ // toview数据来源
                xhr.get(`https://api.bilibili.com/x/v1/medialist/info?type=${type}&biz_id=${pl}&tid=0`, { responseType: "json" }),
                xhr.get(`https://api.bilibili.com/x/v2/medialist/resource/list?type=${type}&oid=${oid}&otype=2&biz_id=${pl}&bvid=&with_current=true&mobi_app=web&ps=20&direction=false&sort_field=1&tid=0&desc=true`, { responseType: "json" })
            ]);
            info(rqs[0]); // 分别填充模板
            list(rqs[1]);
        }
        return { code: 0, data: toview, message: "0", ttl: 1 }
    } catch (e) {
        toast.error("获取medialist数据失败！请刷新页面或者在设置中关闭重构“medialist”选项");
        throw e;
    }
});
switchVideo(() => {
    if (has_more) { // 继续滚动监听
        doWhile(() => document.querySelector(".bilibili-player-playlist-item"), () => startObserver());
    }
});
// 加载原生脚本
appendScripts(script);
// 点赞功能
setting.enlike && new enLike();
// 顶栏分区修正
primaryMenu();
// 顶栏banner修复
banner();
// 弹幕ID跳转
loadByDmId();
// 跳过充电鸣谢
setting.automate.electric && jsonphookasync("api.bilibili.com/x/web-interface/elec/show", undefined, async () => { return { code: -404 } }, false);
// 全局入口
globalVector();