import { toast } from '../core/toast';
import { user } from '../core/user';
import html from '../html/index.html';
import news from '../html/news.html';
import { IAidDatail } from "../io/api";
import { apiArticleCards } from "../io/api-article-cards";
import { apiIndexTopRcmd } from "../io/api-index-top-rcmd";
import { apiNewlist } from "../io/api-newlist";
import { apiSeasonRankList } from "../io/api-season-rank-list";
import { apiWebshowLocs, IApiWebshowLocsResponse } from "../io/api-webshow-locs";
import { uid } from "../utils/conf/uid";
import { debug } from "../utils/debug";
import { addElement, offset } from "../utils/element";
import { integerFormat } from "../utils/format/integer";
import { unitFormat } from "../utils/format/unit";
import { urlObj } from "../utils/format/url";
import { jsonpHook } from "../utils/hook/node";
import { xhrHook } from "../utils/hook/xhr";
import { htmlVnode, Vdom } from "../utils/htmlvnode";
import { poll } from "../utils/poll";
import { VdomTool } from "../utils/vdomtool";
import { Header } from "./header";
import { Page } from "./page";
import recommendData from "../json/recommend.txt";

/** 初始化数据 */
const __INITIAL_STATE__ = {
    locsData: {
        23: <unknown>null,
        29: <unknown>null,
        31: <unknown>null,
        34: <unknown>null,
        40: <unknown>null,
        42: <unknown>null,
        44: <unknown>null,
        142: <unknown>null
    },
    recommendData: <unknown>null
};

/** 重构主页 */
export class PageIndex extends Page {
    constructor() {
        super(html);
        this.avcheck();
        (<any>window).__INITIAL_STATE__ = __INITIAL_STATE__;
        this.locsData();
        this.recommendData();
        this.roomRecommend();
        this.ranking();
        this.newlist();
        this.region();
        this.recommendSpecial();
        Header.primaryMenu();
        Header.banner();
        user.userStatus!.timeLine && this.timeLine();
        this.updateDom();
    }
    protected locsData() {
        apiWebshowLocs({ ids: [4694, 29, 31, 34, 40, 42, 44] })
            .then(d => {
                __INITIAL_STATE__.locsData[23] = this.adblock(d[4694]);
                __INITIAL_STATE__.locsData[29] = this.adblock(d[29]);
                __INITIAL_STATE__.locsData[31] = this.adblock(d[31]);
                __INITIAL_STATE__.locsData[34] = this.adblock(d[34]);
                __INITIAL_STATE__.locsData[40] = this.adblock(d[40]);
                __INITIAL_STATE__.locsData[42] = this.adblock(d[42]);
                __INITIAL_STATE__.locsData[44] = this.adblock(d[44]);
            })
            .catch(e => {
                toast.error('locsData Error!', e)();
            });
    }
    protected recommendData() {
        apiIndexTopRcmd()
            .then(d => {
                if (uid) {
                    __INITIAL_STATE__.recommendData = d;
                    poll(() => document.querySelector(".rec-btn.prev"), () => {
                        addElement("span", { class: "rec-btn prev" }, undefined, "刷新", undefined,
                            document.querySelector<any>(".rec-btn.prev")).addEventListener("click", () => {
                                apiIndexTopRcmd().then(d => __INITIAL_STATE__.recommendData = d);
                            });
                        addElement("span", { class: "rec-btn next" }, undefined, "刷新", undefined,
                            document.querySelector<any>(".rec-btn.next")).addEventListener("click", () => {
                                apiIndexTopRcmd().then(d => __INITIAL_STATE__.recommendData = d);
                            });
                    })
                } else {
                    const one = d.splice(0, 10);
                    const two = d.splice(0, 10);
                    __INITIAL_STATE__.recommendData = [...one];
                    jsonpHook.async("api.bilibili.com/x/web-interface/ranking/index", undefined, async str => {
                        const obj = urlObj(str);
                        if (obj) {
                            if (obj.day == "7") {
                                return { code: 0, data: two, message: "0", ttl: 1 };
                            } else if (obj.day == "1") {
                                return { code: 0, data: d, message: "0", ttl: 1 };
                            }
                            return { code: 0, data: one, message: "0", ttl: 1 };
                        }
                    }, false);
                }
            })
            .catch(e => {
                toast.error('recommendData Error!', e)();
            });
    }
    /** 修复分区排行 */
    protected ranking() {
        poll(() => document.querySelector("#ranking_ad"), () => {
            const vue = (<any>document.querySelector("#app > div.report-wrap-module.elevator-module")).__vue__;
            const ranking_ad = (<any>document.querySelector("#ranking_ad")).__vue__;
            const ranking_technology = (<any>document.querySelector("#ranking_technology")).__vue__;
            const ranking_digital = (<any>document.querySelector("#ranking_digital")).__vue__;
            vue.config[13].morelink = "/v/information/";
            vue.config[13].name = "资讯";
            vue.config[13].tid = 202;
            vue.config[13].type = "news";
            vue.config[8].morelink = "/v/knowledge/";
            vue.config[8].name = "知识";
            vue.config[9].morelink = "/v/tech/";
            vue.config[9].name = "科技";
            ranking_ad.config.morelink = "/v/information/";
            ranking_ad.config.name = "资讯";
            ranking_ad.config.tid = 202;
            ranking_ad.config.type = "news";
            ranking_technology.config.morelink = "/v/knowledge/";
            ranking_technology.config.name = "知识";
            ranking_digital.config.morelink = "/v/tech/";
            ranking_digital.config.name = "科技";
            poll(() => document.querySelector<HTMLElement>("#ranking_news"), d => {
                new VdomTool(news).replace(d);
            })
        });
    }
    /** 修复直播推荐 */
    protected roomRecommend() {
        xhrHook("api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec", args => {
            args[1] = args[1].includes("List") ? args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web') : args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
        }, obj => {
            let response: any = obj.responseText?.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
            if (response) {
                response = JSON.parse(response);
                response.data.text_link = { text: "233秒居然能做这些！", link: "//vc.bilibili.com" };
                if (response.data.recommend) {
                    for (let i = 0; i < response.data.recommend.length; i++) {
                        response.data.recommend[i].pic = response.data.recommend[i].cover;
                        response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
                    }
                }
                if (response.data.preview) for (let i = 0; i < response.data.preview.length; i++) response.data.preview[i].url = response.data.preview[i].link;
                obj.response = obj.responseText = JSON.stringify(response);
            }
        }, false);
    }
    /** 用户热点最新投稿修复资讯区最新投稿 */
    protected newlist() {
        jsonpHook(["newlist", "rid=202"], url => url.replace("rid=202", "rid=203"), undefined, false);
    }
    /** 修正电影/电视剧/纪录片排行 */
    protected region() {
        jsonpHook("api.bilibili.com/x/web-interface/ranking/region", url => {
            const obj = new URL(url);
            let arr: [HTMLDivElement, number, string] = <any>undefined;
            switch (obj.searchParams.get("rid")) {
                case "23":
                    arr = [<HTMLDivElement>document.querySelector("#ranking_movie"), 2, "/ranking/cinema/23/0/3"];
                    break;
                case "11":
                    arr = [<HTMLDivElement>document.querySelector("#ranking_teleplay"), 5, "/ranking/cinema/11/0/3"];
                    break;
                case "177":
                    arr = [<HTMLDivElement>document.querySelector("#ranking_documentary"), 3, "/ranking/cinema/177/0/3"];
                    break;
            }
            if (arr) {
                apiSeasonRankList({ season_type: arr[1] })
                    .then(d => {
                        let html = `<header class="rank-head"><h3>排行</h3><div class="bili-dropdown rank-dropdown"><span class="selected">三日</span><i class="icon icon-arrow-down"></i><ul class="dropdown-list"><li class="dropdown-item" style="display: none;">三日</li><li class="dropdown-item">一周</li></ul></div></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list">`;
                        for (let i = 0; i < 8; i++) {
                            html += `<li class="rank-item${i < 3 ? " highlight" : ""}"><i class="ri-num">${i + 1}</i><a href="${d[i].url}" target="_blank" title="${d[i].title} 播放:${d[i].stat.view}" class="ri-info-wrap"><p class="ri-title">${d[i].title}</p><span class="ri-total">${d[i].new_ep.index_show}</span></a></li>`;
                        }
                        html += `</ul></div><a href="${arr[2]}" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>`;
                        const vnode = htmlVnode(html);
                        (<Vdom[]>vnode[1].children)[0].children?.forEach((t, i) => {
                            let node: any;
                            t.event = {
                                "mouseover": (e) => {
                                    const target = <HTMLLIElement>e.target;
                                    const nodes = `<div class="bangumi-info-module" style="left: ${target.getBoundingClientRect().left}px; top: ${offset(target).top - 150}px;"><div class="v-preview clearfix"><div class="lazy-img cover"><img alt="${d[i].title}" src="${d[i].cover.replace("http:", "")}@72w_72h.webp" /></div><div><p class="title">${d[i].title}</p><p class="desc">${d[i].new_ep.index_show}</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>${unitFormat(d[i].stat.view)}</span><span class="danmu"><i class="icon"></i>${unitFormat(d[i].stat.danmaku)}</span><span class="fav"><i class="icon"></i>${unitFormat(d[i].stat.follow)}</span></div></div>`;
                                    node = new VdomTool(nodes).toFragment().children[0];
                                    document.body.appendChild(node);
                                },
                                "mouseout": () => node.remove()
                            }
                        });
                        arr[0].replaceChildren(new VdomTool(vnode).toFragment());
                    }).catch(e => {
                        debug.error(arr[0], e);
                    })
            }
            return url;
        }, undefined, false);
    }
    protected adblock(arr: IApiWebshowLocsResponse[]) {
        return arr?.filter(d => !d.is_ad && d.id);
    }
    /** 港澳台新番时间表 */
    protected timeLine() {
        poll(() => document.querySelector<any>("#bili_bangumi > .bangumi-module")?.__vue__, vue => {
            apiNewlist(33)
                .then(async d => {
                    const eps = d.reduce((s, d) => {
                        if (d.redirect_url && d.owner.mid === 11783021) {
                            const arr = d.redirect_url.split('/');
                            const ep = arr.at(-1);
                            if (ep) {
                                ep.replace(/\d+/, e => (<any>d).episode_id = e);
                                s[ep] = d;
                            }
                        }
                        return s;
                    }, <Record<string, IAidDatail>>{});
                    const cards = await apiArticleCards(Object.keys(eps));
                    Object.entries(cards).forEach(d => {
                        if (eps[d[0]]) {
                            eps[d[0]] = Object.assign(eps[d[0]], d[1]);
                        }
                    });
                    const timingData: any[] = vue.timingData;
                    Object.values(eps).forEach(d => {
                        const date = new Date(d.pubdate * 1000);
                        for (let i = timingData.length - 1; i >= 0; i--) {
                            if (date.getDay() + 1 === timingData[i].day_of_week) {
                                timingData[i].episodes.push({
                                    cover: (<any>d).cover || d.pic,
                                    delay: 0,
                                    delay_id: 0,
                                    delay_index: "",
                                    delay_reason: "",
                                    ep_cover: (<any>d).cover || d.pic,
                                    episode_id: (<any>d).episode_id,
                                    follows: (<any>d).follow_count,
                                    plays: (<any>d).play_count,
                                    pub_index: d.desc,
                                    pub_time: `${integerFormat(date.getHours())}:${integerFormat(date.getMinutes())}`,
                                    pub_ts: d.pubdate,
                                    published: 1,
                                    season_id: (<any>d).season_id,
                                    square_cover: (<any>d).cover || d.pic,
                                    title: d.title
                                })
                                break;
                            }
                        }
                    });
                    vue.timingData = timingData;
                })
                .catch(e => {
                    debug.error('港澳台新番时间表', e);
                })
        });
    }

    protected recommendSpecial() {
        xhrHook.async('www.bilibili.com/index/recommend.json', undefined, async () => {
            return { response: recommendData, responseText: recommendData, responseType: "json" }
        }, false);
    }

    protected avcheck() {
        const obj = urlObj(location.href);
        if (obj.aid) {
            location.replace(`/video/av${obj.aid}`);
        }
    }
}