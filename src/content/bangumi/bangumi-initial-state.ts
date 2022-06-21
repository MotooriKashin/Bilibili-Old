import { debug } from "../../runtime/debug";
import { doWhile } from "../../runtime/doWhile";
import { objUrl } from "../../runtime/format/url";
import { xhrhook } from "../../runtime/hook/xhr";
import { setting } from "../../runtime/setting";
import { storage } from "../../runtime/storage";
import { toast } from "../../runtime/toast/toast";
import { xhr } from "../../runtime/xhr";

/** epStat，用于判定ep状态。同样由于原生缺陷，ep_id初始化时不会更新本信息，需要主动更新 */
function setEpStat(status: number, pay: number, payPackPaid: number, loginInfo: Record<string, any>) {
    var s = 0
        , o = !1
        , a = (1 === loginInfo.vipType || 2 === loginInfo.vipType) && 1 === loginInfo.vipStatus
        , r = "number" == typeof payPackPaid ? payPackPaid : -1;
    return 1 === pay ? s = 0 : 6 === status || 7 === status ? s = loginInfo.isLogin ? a ? 0 : 1 : 2 : 8 === status || 9 === status ? (s = loginInfo.isLogin ? 1 : 2,
        o = !0) : 12 === status ? s = loginInfo.isLogin ? 1 === r ? 0 : 1 : 2 : 13 === status && (s = loginInfo.isLogin ? a ? 0 : 1 : 2),
    {
        status: s,
        isPay: 6 === status || 7 === status || 8 === status || 9 === status || 12 === status || 13 === status,
        isVip: a,
        vipNeedPay: o,
        payPack: r
    }
}
function V(t: any, e: any) {
    var i: any = Number(t)
        , n = 1 === e || 4 === e || "番剧" === e || "国创" === e ? "话" : "集";
    return isNaN(i) ? t : "第".concat(i).concat(n)
}
function Q(t: any, e?: any) {
    var i: any = {
        1: "番剧",
        2: "电影",
        3: "纪录片",
        4: "国创",
        5: "电视剧",
        7: "综艺",
        music: "音乐"
    };
    return [26484, 26481].indexOf(e) > -1 ? i.music : i[t] || "番剧"
}
function setTitle(t: any, e: any, i: any, n: any) {
    var s = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4]
        , o: any = "";
    if (i = void 0 === i ? "番剧" : i,
        e && i)
        if (s && t) {
            var a = V(t, i);
            o = "".concat(e, "：").concat(a, "_").concat(i).concat(n ? "_bilibili" : "", "_哔哩哔哩")
        } else
            o = "".concat(e, "_").concat(i).concat(n ? "_bilibili" : "", "_哔哩哔哩");
    else
        o = "番剧".concat(n ? "_bilibili" : "", "_哔哩哔哩");
    if ("undefined" != typeof window) {
        var r: any = window.document.createElement("div");
        r.innerHTML = o,
            o = r.innerText || r.textContent,
            r = null
    }
    return o
}
export async function bangumiInitialState(): Promise<any> {
    try {
        let ssid = Number(storage.ss.getItem("ssid"));
        let epid = Number(storage.ss.getItem("epid"));
        const obj: Record<string, string | number> = epid ? { ep_id: epid } : { season_id: ssid };
        const result = await Promise.allSettled([
            xhr({ // bangumi接口，更符合旧版数据构造
                url: objUrl("https://bangumi.bilibili.com/view/web_api/season", obj),
                responseType: "json",
                credentials: true
            }, true),
            xhr({ // api接口，带有历史记录信息，同时备用
                url: objUrl("https://api.bilibili.com/pgc/view/web/season/user/status", obj),
                responseType: "json",
                credentials: true
            }, true)
        ]);
        const data = <Record<"bangumi" | "status", Record<PropertyKey, any>>>{};
        await new Promise(r => doWhile(() => (<any>window).__INITIAL_STATE__, r));
        const t = (<any>window).__INITIAL_STATE__;
        result[0].status === "fulfilled" && (result[0].value.code === 0) && (data.bangumi = result[0].value.result);
        result[1].status === "fulfilled" && (result[1].value.code === 0) && (data.status = result[1].value.result);
        if (data.status) {
            const i = data.status.progress ? data.status.progress.last_ep_id : -1
                , n = data.status.progress ? data.status.progress.last_ep_index : ""
                , s = data.status.progress ? data.status.progress.last_time : 0
                , o = data.status.vip_info || {};
            !epid && i > 0 && (epid = i); // 正常启动必须
            t.userStat = {
                loaded: !0,
                error: void 0 === data.status.pay,
                follow: data.status.follow || 0,
                pay: data.status.pay || 0,
                payPackPaid: data.status.pay_pack_paid || 0,
                sponsor: data.status.sponsor || 0,
                watchProgress: {
                    lastEpId: 0 === i ? -1 : i,
                    lastEpIndex: n,
                    lastTime: s
                },
                vipInfo: {
                    due_date: o.due_date || 0,
                    status: o.status || 0,
                    type: o.type || 0
                }
            };
            data.status.paster && (t.paster = data.status.paster || {});
            storage.ss.setItem("limit", data.status.area_limit || 0);
            !setting.videoLimit.switch && (t.area = storage.ss.getItem("limit"));
            t.seasonFollowed = 1 === data.status.follow;
        }
        if (data.bangumi) {
            // -> bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js:1148
            // 原数据有些问题导致一些回调事件不会正常加载需要主动写入epId、epInfo（顺序）
            // 如果没有这个错误，根本必须手动重构`__INITIAL_STATE__` 🤣
            const i = JSON.parse(JSON.stringify(data.bangumi));
            delete i.episodes;
            delete i.seasons;
            delete i.up_info;
            delete i.rights;
            delete i.publish;
            delete i.newest_ep;
            delete i.rating;
            delete i.pay_pack;
            delete i.payment;
            delete i.activity;
            if (setting.bangumiEplist) delete i.bkg_cover;
            // APP限制
            setting.videoLimit.switch && data.bangumi.rights && (data.bangumi.rights.watch_platform = 0);
            t.mediaInfo = i;
            t.mediaInfo.bkg_cover && (t.special = !0, storage.ss.setItem("bkg_cover", t.mediaInfo.bkg_cover));
            t.ssId = data.bangumi.season_id || -1;
            t.mdId = data.bangumi.media_id;
            t.epInfo = (epid && data.bangumi.episodes.find((d: any) => d.ep_id == epid)) || data.bangumi.episodes[0];
            t.epList = data.bangumi.episodes || [];
            t.seasonList = data.bangumi.seasons || [];
            t.upInfo = data.bangumi.up_info || {};
            t.rightsInfo = data.bangumi.rights || {};
            t.app = 1 === t.rightsInfo.watch_platform;
            t.pubInfo = data.bangumi.publish || {};
            t.newestEp = data.bangumi.newest_ep || {};
            t.mediaRating = data.bangumi.rating || {};
            t.payPack = data.bangumi.pay_pack || {};
            t.payMent = data.bangumi.payment || {};
            t.activity = data.bangumi.activity || {};
            t.epStat = setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
            t.epId = epid || data.bangumi.episodes[0].ep_id;
            storage.ss.setItem("ssid", t.ssId);
            storage.ss.setItem("epid", t.epId);
            if (t.epInfo.badge === "互动") {
                // 番剧能互动？ .e.g: https://www.bilibili.com/bangumi/play/ep385091
                storage.ss.setItem("keepNew", 1);
                location.reload();
            }
            if (t.upInfo.mid == /** Classic_Anime */677043260 || t.upInfo.mid == /** Anime_Ongoing */688418886) {
                storage.ss.setItem("th", 1);
            }
            const title = setTitle(t.epInfo.index, t.mediaInfo.title, Q(t.mediaInfo.season_type), !0);
            function loopTitle() {
                doWhile(() => document.title != title, () => {
                    document.title = title;
                    if (document.title != title) loopTitle();
                })
            }
            loopTitle();
        } else {
            debug.error(result[0]);
            debug.error(result[1]);
            return globalSession();
        }
    } catch (e) {
        toast.error("获取视频数据出错 ಥ_ಥ");
        debug.error("视频数据", e);
    }
}
async function globalSession() {
    toast.info("Bangumi号可能无效~", "正在尝试泰区代理接口~");
    let ssid = Number(storage.ss.getItem("ssid"));
    let epid = Number(storage.ss.getItem("epid"));
    const obj: Record<string, string | number> = epid ? { ep_id: epid } : { season_id: ssid };
    Object.assign(obj, {
        access_key: setting.accessKey.key || undefined,
        build: 108003,
        mobi_app: "bstar_a",
        s_locale: "zh_SG"
    });
    try {
        const result = await xhr({
            url: objUrl(`https://${setting.videoLimit.th || 'api.global.bilibili.com'}/intl/gateway/v2/ogv/view/app/season`, obj),
            responseType: "json"
        }, true);
        if (result.code === 0) {
            window.postMessage({ $type: "th" }); // 更新泰区请求规则
            await new Promise(r => doWhile(() => (<any>window).__INITIAL_STATE__, r));
            const t = (<any>window).__INITIAL_STATE__;
            const i = JSON.parse(JSON.stringify(result.result));
            const episodes = result.result.modules.reduce((s: any[], d: any) => {
                d.data.episodes.forEach((d: any) => {
                    s.push({
                        aid: d.aid,
                        cid: d.id,
                        cover: d.cover,
                        ep_id: d.id,
                        episode_status: d.status,
                        from: d.from,
                        index: d.title,
                        index_title: d.title_display,
                        subtitles: d.subtitles
                    })
                });
                return s;
            }, []);
            t.mediaInfo = {
                actors: i.actor?.info,
                alias: i.alias,
                areas: i.areas,
                cover: i.cover,
                evaluate: i.evaluate,
                is_paster_ads: 0,
                jp_title: i.origin_name,
                link: i.link,
                media_id: -1,
                mode: i.mode,
                paster_text: "",
                season_id: i.season_id,
                season_status: i.status,
                season_title: i.season_title,
                season_type: i.type,
                series_title: i.title,
                square_cover: i.square_cover,
                staff: i.actor?.info,
                stat: i.stat,
                style: i.styles?.reduce((s: any[], d: any) => {
                    s.push(d.name);
                    return s;
                }, []),
                title: i.title,
                total_ep: i.total,
            };
            t.mediaInfo.bkg_cover && (t.special = !0, storage.ss.setItem("bkg_cover", t.mediaInfo.bkg_cover));
            t.ssId = result.result.season_id || -1;
            t.epInfo = (epid && episodes.find((d: any) => d.ep_id == epid)) || episodes[0];
            t.epList = episodes;
            t.seasonList = result.result.series?.seasons?.reduce((s: any[], d: any) => {
                s.push({
                    badge: "独家",
                    badge_type: 1,
                    cover: "",
                    media_id: -1,
                    new_ep: {},
                    season_id: d.season_id,
                    season_title: d.quarter_title,
                    season_type: 1,
                    stat: {},
                    title: d.quarter_title
                })
                return s;
            }, []) || [];
            t.upInfo = result.result.up_info || {};
            t.rightsInfo = result.result.rights || {};
            t.app = 1 === t.rightsInfo.watch_platform;

            result.result.publish.is_started = 1;
            result.result.publish?.time_length_show === "已完结" && (result.result.publish.is_finish = 1);
            t.pubInfo = result.result.publish || {};

            result.result.new_ep.desc = result.result.new_ep.new_ep_display;
            result.result.new_ep.index = result.result.new_ep.title;
            t.newestEp = result.result.new_ep || {};

            t.mediaRating = result.result.rating || {};
            t.payPack = result.result.pay_pack || {};
            t.payMent = result.result.payment || {};
            t.activity = result.result.activity_dialog || {};
            t.epStat = setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
            t.epId = epid || episodes[0].ep_id;
            storage.ss.setItem("ssid", t.ssId);
            storage.ss.setItem("epid", t.epId);
            storage.ss.setItem("th", 1);
            xhrhook("api.bilibili.com/pgc/web/season/stat", undefined, (res) => {
                const t = `{"code": 0,"message":"0","ttl":1,"result":${JSON.stringify(result.result.stat)}}`;
                res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
            }, false);
            toast.warning("这大概是一个泰区专属Bangumi，可能没有弹幕和评论区，可以使用【在线弹幕】【播放本地文件】等功能载入弹幕~", "另外：播放泰区番剧还可能导致历史记录错乱，请多担待🤣");
            const title = setTitle(t.epInfo.index, t.mediaInfo.title, Q(t.mediaInfo.season_type), !0);
            function loopTitle() {
                doWhile(() => document.title != title, () => {
                    document.title = title;
                    if (document.title != title) loopTitle();
                })
            }
            loopTitle();
        }
        else throw result;
    } catch (e) {
        toast.error("访问泰区B站出错，请检查泰区代理服务器设置~", "或许这就是个无效Bangumi？", e);
        debug.error("BilibiliGlobal", e);
    }
}