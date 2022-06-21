// 用于执行用户脚本中执行不了的操作
import { abv } from "../../runtime/lib/abv";
import { doWhile } from "../../runtime/doWhile";
import { addElement } from "../../runtime/element/addElement";
import { createElements } from "../../runtime/element/createElement";
import { htmlVnode, Vdom } from "../../runtime/element/htmlVnode";
import { urlObj } from "../../runtime/format/url";
import { getTotalTop, jsonCheck } from "../../runtime/unit";
import { jsonphook, jsonphookasync } from "../../runtime/hook/Node";
import { uid } from "../../runtime/variable/uid";
import news from "./news.html";
import { unitFormat } from "../../runtime/format/unit";
import { banner, primaryMenu } from "../global/banner";
import { xhrhook } from "../../runtime/hook/xhr";
import { timeline } from "./timeline";
import { appendScripts } from "../../runtime/element/createScripts";
import { debug } from "../../runtime/debug";
import { toast } from "../../runtime/toast/toast";
import { setting } from "../../runtime/setting";
import { windowClear } from "../../runtime/clearWindow";

// 清理全局变量
windowClear();
const __INITIAL_STATE__: any = (<any>window).__INITIAL_STATE__ = {
    locsData: {
        23: null,
        29: null,
        31: null,
        34: null,
        40: null,
        42: null,
        44: null,
        142: null
    },
    recommendData: null
};
// 启动原生脚本
appendScripts(`
<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js"></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"></script>
<script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"></script>
<script src="//static.hdslb.com/common/js/footer.js"></script>
`);
/**
 * 广告过滤
 * @param prev 原始locsData
 * @returns 无广告数据
 */
function adblock(prev: Record<"is_ad", boolean>[]) {
    return prev.filter(d => !d.is_ad);
}
// 初始化locsData
fetch("https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=4694,29,31,34,40,42,44")
    .then(d => d.text())
    .then((d: any) => {
        d = JSON.parse(d.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (s: string) => "av" + abv(s)));
        __INITIAL_STATE__.locsData[23] = adblock(d.data[4694]);
        __INITIAL_STATE__.locsData[29] = adblock(d.data[29]);
        __INITIAL_STATE__.locsData[31] = adblock(d.data[31]);
        __INITIAL_STATE__.locsData[34] = adblock(d.data[34]);
        __INITIAL_STATE__.locsData[40] = adblock(d.data[40]);
        __INITIAL_STATE__.locsData[42] = adblock(d.data[42]);
        __INITIAL_STATE__.locsData[44] = adblock(d.data[44]);
    }).catch(reason => {
        debug.error("获取推荐数据失败 ಥ_ಥ", reason);
        toast.error("获取推荐数据失败 ಥ_ಥ");
    });
recommendData(setting.privateRecommend).then(d => {
    if (uid && setting.privateRecommend) {
        __INITIAL_STATE__.recommendData = d;
        doWhile(() => document.querySelector(".rec-btn.prev"), () => {
            addElement("span", { class: "rec-btn prev" }, undefined, "刷新", undefined,
                document.querySelector<any>(".rec-btn.prev")).addEventListener("click", () => {
                    recommendData().then(d => __INITIAL_STATE__.recommendData = d);
                });
            addElement("span", { class: "rec-btn next" }, undefined, "刷新", undefined,
                document.querySelector<any>(".rec-btn.next")).addEventListener("click", () => {
                    recommendData().then(d => __INITIAL_STATE__.recommendData = d);
                });
        });
    } else {
        const one = d.splice(0, 10);
        const two = d.splice(0, 10);
        __INITIAL_STATE__.recommendData = [...one];
        jsonphookasync("api.bilibili.com/x/web-interface/ranking/index", undefined, async str => {
            const obj = urlObj(str);
            if (obj.day == "7") {
                return { code: 0, data: two, message: "0", ttl: 1 };
            } else if (obj.day == "1") {
                return { code: 0, data: d, message: "0", ttl: 1 };
            }
            return { code: 0, data: one, message: "0", ttl: 1 };
        }, false);
    }
}).catch(reason => {
    toast.error("获取推荐数据失败 ಥ_ಥ");
    debug.error("获取推荐数据失败 ಥ_ಥ", reason);
});
/** 获取recommendData */
async function recommendData(privateRecommend = false) {
    const d = await fetch("https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3", {
        credentials: privateRecommend ? "include" : "omit"
    }).then(d => d.json());
    d.data.item.forEach((d_1: any, i: number, s: any) => {
        // 修正数据名
        s[i].author = d_1.owner.name;
        s[i].play = d_1.stat.view;
        s[i].aid = d_1.id;
    });
    return d.data.item;
}
// 分区修正
doWhile(() => document.querySelector("#ranking_ad"), () => {
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
    doWhile(() => document.querySelector("#ranking_news"), () => {
        (<any>document.querySelector("#ranking_news")).replaceChildren(createElements(htmlVnode(news)));
    })
});
// 修复直播推荐
xhrhook("api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec", args => {
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
// 用户热点最新投稿修复资讯区最新投稿
jsonphook(["newlist", "rid=202"], url => url.replace("rid=202", "rid=203"), undefined, false);
// 修正电影/电视剧/纪录片排行
jsonphook("api.bilibili.com/x/web-interface/ranking/region", url => {
    const obj = urlObj(url);
    let arr: [HTMLDivElement, number, string] = <any>undefined;
    switch (obj.rid) {
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
        fetch(`https://api.bilibili.com/pgc/season/rank/web/list?season_type=${arr[1]}&day=3`)
            .then(d => d.json())
            .then(d => {
                const data = jsonCheck(d).data;
                let html = `<header class="rank-head"><h3>排行</h3><div class="bili-dropdown rank-dropdown"><span class="selected">三日</span><i class="icon icon-arrow-down"></i><ul class="dropdown-list"><li class="dropdown-item" style="display: none;">三日</li><li class="dropdown-item">一周</li></ul></div></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list">`;
                for (let i = 0; i < 8; i++) {
                    html += `<li class="rank-item${i < 3 ? " highlight" : ""}"><i class="ri-num">${i + 1}</i><a href="${data.list[i].url}" target="_blank" title="${data.list[i].title} 播放:${data.list[i].stat.view}" class="ri-info-wrap"><p class="ri-title">${data.list[i].title}</p><span class="ri-total">${data.list[i].new_ep.index_show}</span></a></li>`;
                }
                html += `</ul></div><a href="${arr[2]}" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>`;
                const vnode = htmlVnode(html);
                (<Vdom[]>vnode[1].children)[0].children?.forEach((d, i) => {
                    let node: any;
                    d.event = {
                        "mouseover": (e) => {
                            const target = <HTMLLIElement>e.target;
                            const nodes = createElements(htmlVnode(`<div class="bangumi-info-module" style="left: ${target.getBoundingClientRect().left}px; top: ${getTotalTop(target) - 150}px;"><div class="v-preview clearfix"><div class="lazy-img cover"><img alt="${data.list[i].title}" src="${data.list[i].cover.replace("http:", "")}" /></div><div><p class="title">${data.list[i].title}</p><p class="desc">${data.list[i].new_ep.index_show}</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>${unitFormat(data.list[i].stat.view)}</span><span class="danmu"><i class="icon"></i>${unitFormat(data.list[i].stat.danmaku)}</span><span class="fav"><i class="icon"></i>${unitFormat(data.list[i].stat.follow)}</span></div></div>`));
                            node = nodes.children[0];
                            document.body.appendChild(nodes);
                        },
                        "mouseout": () => node.remove()
                    }
                });
                arr[0].replaceChildren(createElements(vnode));
            }).catch(e => {
                debug.error(arr[0], e);
            })
    }
    return url;
}, undefined, false);
primaryMenu(); // 顶栏分区修正
banner(); // banner修复
// 添加港澳台新番时间表
xhrhook("api.bilibili.com/pgc/web/timeline?types=1", undefined, res => {
    setting.timeline && timeline();
});