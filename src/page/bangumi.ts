import { BLOD } from "../bilibili-old";
import { Page } from "./page";
import html from '../html/bangumi.html';
import { xhrHook } from "../utils/hook/xhr";
import { jsonCheck } from "../io/api";
import { apiTagInfo } from "../io/api-tag-info";
import { apiTagTop } from "../io/api-tag-top";
import { debug } from "../utils/debug";
import { Header } from "./header";
import { apiBangumiSeason, IBangumiEpisode, IBangumiSeasonResponse } from "../io/api-bangumi-season";
import { apiSeasonStatus, ISeasonStatusResponse } from "../io/api-season-status";
import { poll } from "../utils/poll";
import { ApiSeasonSection } from "../io/api-season-section";
import { ApiGlobalOgvView } from "../io/api-global-view";
import { propertyHook } from "../utils/hook/method";
import { Comment } from "../core/comment";
import { addCss } from "../utils/element";
import { ISubtitle, PlayerResponse } from "../io/api-player";
import { urlObj } from "../utils/format/url";
import { Like } from "../core/ui/like";
import { switchVideo } from "../core/observer";

export class PageBangumi extends Page {
    protected like: Like;
    protected get ssid() {
        return this.BLOD.ssid;
    }
    protected set ssid(v) {
        this.BLOD.ssid = v;
    }
    protected get epid() {
        return this.BLOD.epid;
    }
    protected set epid(v) {
        this.BLOD.epid = v;
    }
    protected get th() {
        return this.BLOD.th;
    }
    protected set th(v) {
        this.BLOD.th = v;
    }
    protected get limit() {
        return this.BLOD.limit;
    }
    protected set limit(v) {
        this.BLOD.limit = v;
    }
    protected get pgc() {
        return this.BLOD.pgc;
    }
    protected set pgc(v) {
        this.BLOD.pgc = v;
    }
    /** 字幕暂存 */
    protected subtitles: ISubtitle[][] = [];
    constructor(protected BLOD: BLOD) {
        super(html);
        Reflect.deleteProperty(window, '__INITIAL_STATE__');
        this.like = new Like(this.BLOD);
        new Comment(BLOD);
        // 精确爆破新版番剧脚本
        (<any>window).__Iris__ = true;
        this.pgc = true;
        location.href.replace(/[sS][sS]\d+/, d => this.ssid = <any>Number(d.substring(2)));
        location.href.replace(/[eE][pP]\d+/, d => this.epid = <any>Number(d.substring(2)));
        this.updateDom();
        this.recommend();
        this.seasonCount();
        BLOD.status.videoLimit?.status && this.videoLimit();
        this.related();
        this.initialState();
        this.enLike();
        Header.primaryMenu();
        Header.banner();
    }
    /** 修复：末尾番剧推荐 */
    protected recommend() {
        xhrHook("api.bilibili.com/pgc/web/recommend/related/recommend", args => {
            // 原接口不返回针对ssid/epid的数据
            args[1] = args[1].replace("web/recommend", "season/web");
        }, r => {
            try {
                const result = jsonCheck(r.response);
                result.result = result.data.season;
                r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
                // 补全播放器获取到的数据
                propertyHook.modify<Function>(window, 'getPlayerExtraParams', d => {
                    const res = d();
                    res.recommend = result.result;
                    return () => res;
                })
            } catch (e) { }
        });
    }
    /** 修复追番数据 */
    protected seasonCount() {
        xhrHook("bangumi.bilibili.com/ext/web_api/season_count", args => {
            // bangumi接口已追番数据恒等于0
            args[1] = args[1].replace("bangumi.bilibili.com/ext/web_api/season_count", "api.bilibili.com/pgc/web/season/stat");
        }, r => {
            try {
                const result = jsonCheck(r.response);
                result.result.favorites = result.result.follow;
                r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
            } catch (e) { }
        }, true);
    }
    /** 解除区域限制（重定向模式） */
    protected videoLimit() {
        xhrHook("bangumi.bilibili.com/view/web_api/season/user/status", undefined, res => {
            try {
                const data = res.responseType === "json" ? res.response : JSON.parse(res.response);
                data.result.area_limit = 0;
                data.result.ban_area_show = 0;
                res.responseType === "json" || (res.response = res.responseText = JSON.stringify(data));
            } catch (e) { }
        }, false);
    }
    /** 修复相关视频推荐 接口来自md页面 */
    protected related() {
        const related: Record<string, any> = {};
        xhrHook.async("x/web-interface/archive/related", () => ((<any>window).__INITIAL_STATE__)?.mediaInfo?.title, async () => {
            let response = { code: 0, data: <any>[], message: "0" };
            if (related[((<any>window).__INITIAL_STATE__)?.mediaInfo?.title]) {
                response.data = related[((<any>window).__INITIAL_STATE__).mediaInfo.title];
            } else {
                await apiTagInfo((<any>window).__INITIAL_STATE__.mediaInfo.title)
                    .then(d => {
                        return apiTagTop(d.tag_id)
                    })
                    .then(d => {
                        response.data = related[(<any>window).__INITIAL_STATE__.mediaInfo.title] = d;
                    })
                    .catch(e => {
                        debug.error("相关视频推荐", e);
                    })
            }
            return { response, responseType: 'json', responseText: JSON.stringify(response) }
        }, false);
    }
    /** 初始化`__INITIAL_STATE__` */
    protected initialState() {
        const data = this.epid ? { ep_id: this.epid } : { season_id: this.ssid };
        Promise.allSettled([apiBangumiSeason(data), apiSeasonStatus(data), new Promise(r => poll(() => this.initilized, r))])
            .then(d => <[IBangumiSeasonResponse?, ISeasonStatusResponse?]>d.map(d => d.status === 'fulfilled' && d.value))
            .then(async d => {
                const t = (<any>window).__INITIAL_STATE__;
                const bangumi = d[0];
                const status = d[1];
                if (status) {
                    const i = status.progress ? status.progress.last_ep_id : -1
                        , n = status.progress ? status.progress.last_ep_index : ""
                        , s = status.progress ? status.progress.last_time : 0
                        , o = status.vip_info || {};
                    !this.epid && i > 0 && (this.epid = i); // 正常启动必须
                    t.userStat = {
                        loaded: !0,
                        error: void 0 === status.pay,
                        follow: status.follow || 0,
                        pay: status.pay || 0,
                        payPackPaid: status.pay_pack_paid || 0,
                        sponsor: status.sponsor || 0,
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
                    status.paster && (t.paster = status.paster || {});
                    this.limit = status.area_limit || 0;
                    this.BLOD.status.videoLimit.status || (t.area = this.limit);
                    t.seasonFollowed = 1 === status.follow;
                }
                if (bangumi) {
                    if (bangumi.season_id && bangumi.total_ep && !bangumi.episodes?.[0]) {
                        await new ApiSeasonSection(bangumi.season_id)
                            .toEpisodes()
                            .then(d => { bangumi.episodes = d })
                            .catch(e => { debug.warn('episodes数据获取出错', e) });
                    }
                    // -> bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js:1148
                    // 原数据有些问题导致一些回调事件不会正常加载需要主动写入epId、epInfo（顺序）
                    // 如果没有这个错误，根本必须手动重构`__INITIAL_STATE__`
                    const i = JSON.parse(JSON.stringify(bangumi));
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
                    if (this.BLOD.status.bangumiEplist) delete i.bkg_cover;
                    this.BLOD.status.videoLimit.status && bangumi.rights && (bangumi.rights.watch_platform = 0);
                    t.mediaInfo = i;
                    t.mediaInfo.bkg_cover && (t.special = !0, this.BLOD.bkg_cover = t.mediaInfo.bkg_cover);
                    t.ssId = bangumi.season_id || -1;
                    t.mdId = bangumi.media_id;
                    t.epInfo = (this.epid && bangumi.episodes.find(d => d.ep_id == this.epid)) || bangumi.episodes[0] || {};
                    t.epList = bangumi.episodes || [];
                    t.seasonList = bangumi.seasons || [];
                    t.upInfo = bangumi.up_info || {};
                    t.rightsInfo = bangumi.rights || {};
                    t.app = 1 === t.rightsInfo.watch_platform;
                    t.pubInfo = bangumi.publish || {};
                    t.newestEp = bangumi.newest_ep || {};
                    t.mediaRating = bangumi.rating || {};
                    t.payPack = bangumi.pay_pack || {};
                    t.payMent = bangumi.payment || {};
                    t.activity = bangumi.activity || {};
                    t.epStat = this.setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
                    t.epId = Number(this.epid || t.epInfo.ep_id);
                    this.ssid = t.ssId;
                    this.epid = t.epId;

                    if (t.upInfo.mid == /** Classic_Anime */677043260 || t.upInfo.mid == /** Anime_Ongoing */688418886) {
                        this.th = true;
                    }
                    const title = this.setTitle(t.epInfo.index, t.mediaInfo.title, this.Q(t.mediaInfo.season_type), !0);
                    function loopTitle() {
                        poll(() => document.title != title, () => {
                            document.title = title;
                            if (document.title != title) loopTitle();
                        })
                    }
                    loopTitle();
                    // 记录视频数据
                    this.BLOD.videoInfo.bangumiSeason(bangumi);
                } else {
                    return this.initGlobal();
                }
            })
            .catch(e => {
                this.BLOD.toast.error('初始化bangumi数据出错！', e)();
            })
            .finally(() => {
                if ((<any>window).__INITIAL_STATE__.special) {
                    // 带海报的bangumi隐藏顶栏banner和wrapper
                    addCss("#bili-header-m > #banner_link,#bili-header-m > .bili-wrapper{ display: none; }");
                }
                // 修复怪异模式下人类所不能理解的样式问题 ಥ_ಥ
                if (document.compatMode === "BackCompat") addCss(".header-info > .count-wrapper {height: 18px !important;}");
            });
    }
    /** epStat，用于判定ep状态。同样由于原生缺陷，ep_id初始化时不会更新本信息，需要主动更新 */
    protected setEpStat(status: number, pay: number, payPackPaid: number, loginInfo: Record<string, any>) {
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
    /** 更新标题 */
    protected setTitle(t: any, e: any, i: any, n: any) {
        var s = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4]
            , o: any = "";
        if (i = void 0 === i ? "番剧" : i,
            e && i)
            if (s && t) {
                var a = this.V(t, i);
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
    protected Q(t: any, e?: any) {
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
    protected V(t: any, e: any) {
        var i: any = Number(t)
            , n = 1 === e || 4 === e || "番剧" === e || "国创" === e ? "话" : "集";
        return isNaN(i) ? t : "第".concat(i).concat(n)
    }
    /** 尝试东南亚接口 */
    protected async initGlobal() {
        const data = this.epid ? { ep_id: this.epid } : { season_id: this.ssid };
        Object.assign(data, { access_key: this.BLOD.status.accessKey.token });
        const d = await new ApiGlobalOgvView(<any>data, this.BLOD.status.videoLimit.th)
            .getDate();
        this.BLOD.networkMock();
        await new Promise(r => poll(() => (<any>window).__INITIAL_STATE__, r));
        const t = (<any>window).__INITIAL_STATE__;
        const i: typeof d = JSON.parse(JSON.stringify(d));
        const episodes: IBangumiEpisode[] = d.modules.reduce((s, d_1) => {
            d_1.data.episodes.forEach(d_2 => {
                s.push({
                    aid: d_2.aid,
                    cid: d_2.id,
                    cover: d_2.cover,
                    ep_id: d_2.id,
                    episode_status: d_2.status,
                    from: d_2.from,
                    index: <any>d_2.title,
                    index_title: <any>d_2.title_display,
                    subtitles: d_2.subtitles
                });
                if (d_2.subtitles) {
                    this.subtitles[d_2.id] = [];
                    d_2.subtitles.forEach(d => {
                        this.subtitles[d_2.id].push({
                            ai_status: 2,
                            ai_type: Number(d.is_machine),
                            id: d.id,
                            id_str: String(d.id),
                            is_lock: false,
                            lan: d.key,
                            lan_doc: d.title,
                            subtitle_url: d.url,
                            type: 1,
                        })
                    })
                }
            });
            return s;
        }, <any[]>[]);
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
            style: i.styles?.map(d_3 => d_3.name),
            title: i.title,
            total_ep: i.total,
        };
        t.mediaInfo.bkg_cover && (t.special = !0, this.BLOD.bkg_cover = t.mediaInfo.bkg_cover);
        t.ssId = i.season_id || -1;
        t.epInfo = (this.epid && episodes.find((d_4: any) => d_4.ep_id == this.epid)) || episodes[0] || {};
        t.epList = episodes;
        t.seasonList = d.series?.seasons?.map(d_5 => {
            return {
                badge: "独家",
                badge_type: 1,
                cover: "",
                media_id: -1,
                new_ep: {},
                season_id: d_5.season_id,
                season_title: d_5.quarter_title,
                season_type: 1,
                stat: {},
                title: d_5.quarter_title
            };
        }) || [];
        t.upInfo = d.up_info || {};
        t.rightsInfo = d.rights || {};
        t.app = 1 === t.rightsInfo.watch_platform;
        d.publish.is_started = 1;
        d.publish?.time_length_show === "已完结" && (d.publish.is_finish = 1);
        t.pubInfo = d.publish || {};
        if (d.new_ep) {
            (<any>d).new_ep.desc = d.new_ep.new_ep_display;
            (<any>d).new_ep.index = d.new_ep.title;
        }
        t.newestEp = d.new_ep || {};
        t.mediaRating = d.rating || {};
        t.payPack = d.pay_pack || {};
        t.payMent = d.payment || {};
        t.activity = d.activity_dialog || {};
        t.epStat = this.setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
        t.epId = Number(this.epid || t.epInfo.ep_id);
        this.ssid = t.ssId;
        this.epid = t.epId;
        this.th = true;
        xhrHook("api.bilibili.com/pgc/web/season/stat", undefined, (res) => {
            const t_1 = `{"code": 0,"message":"0","ttl":1,"result":${JSON.stringify(d.stat)}}`;
            res.responseType === "json" ? res.response = JSON.parse(t_1) : res.response = res.responseText = t_1;
        }, false);
        this.player();
        this.BLOD.toast.warning("这大概是一个泰区专属Bangumi，可能没有弹幕和评论区，可以使用【在线弹幕】【播放本地文件】等功能载入弹幕~", "另外：播放泰区番剧还可能导致历史记录错乱，请多担待🤣");
        const title = this.setTitle(t.epInfo.index, t.mediaInfo.title, this.Q(t.mediaInfo.season_type), !0);
        function loopTitle() {
            poll(() => document.title != title, () => {
                document.title = title;
                if (document.title != title)
                    loopTitle();
            });
        }
        loopTitle();
        // 记录视频数据
        this.BLOD.videoInfo.bangumiEpisode(episodes, i.title, i.actor?.info, i.cover, t.mediaInfo.bkg_cover);
    }
    /** 修复泰区player接口 */
    protected player() {
        xhrHook.async('api.bilibili.com/x/player/v2?', undefined, async (args) => {
            const obj = urlObj(args[1]);
            const aid = <number>obj.aid;
            const cid = <number>obj.cid;
            const response = { code: 0, message: "0", data: new PlayerResponse(aid, cid) };
            if (this.subtitles[cid]) {
                response.data.subtitle.subtitles = this.subtitles[cid]
            }
            return { response, responseType: 'json', responseText: JSON.stringify(response) }
        }, false);
    }
    /** 点赞功能 */
    protected enLike() {
        if (this.BLOD.status.like) {
            poll(() => document.querySelector<HTMLSpanElement>('[report-id*=coin]'), d => {
                d.parentElement?.insertBefore(this.like, d);
                addCss('.ulike {margin-left: 15px;position: relative;float: left;height: 100%;line-height: 18px;font-size: 12px;color: #222;}', 'ulike-bangumi');
            });
            xhrHook('pgc/web/season/stat?', undefined, async res => {
                try {
                    const result = typeof res.response === 'string' ? jsonCheck(res.response) : res.response;
                    this.like.likes = result.result.likes;
                } catch { }
            });
            switchVideo(() => {
                this.like.init();
            })
        }
    }
}