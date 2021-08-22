"use strict";
/**
 * 本模块负责修复主页失效分区
 */
(function () {
    // 修复直播数据
    API.xhrhook(["api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec"], function (args) {
        args[1] = args[1].includes("List") ? args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web') : args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                try {
                    let response = this.responseText.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
                    response = JSON.parse(response);
                    response.data.text_link = { text: "233秒居然能做这些！", link: "//vc.bilibili.com" };
                    if (response.data.recommend) {
                        for (let i = 0; i < response.data.recommend.length; i++) {
                            response.data.recommend[i].pic = response.data.recommend[i].cover;
                            response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
                        }
                    }
                    if (response.data.preview)
                        for (let i = 0; i < response.data.preview.length; i++)
                            response.data.preview[i].url = response.data.preview[i].link;
                    Object.defineProperty(this, 'response', { writable: true });
                    Object.defineProperty(this, 'responseText', { writable: true });
                    this.response = this.responseText = JSON.stringify(response);
                }
                catch (e) {
                    API.debug.trace(e, "roomRecommend.js");
                }
            }
        });
    });
    // 广告取转资讯区
    API.jsonphook(["region", "rid=165"], function (xhr) {
        this.url = this.url.replace("rid=165", "rid=202");
    });
    // 用户热点最新投稿修复资讯区最新投稿
    API.jsonphook(["newlist", "rid=165"], function (xhr) {
        this.url = this.url.replace("rid=165", "rid=203");
    });
    // 取消原创排行榜
    API.jsonphook(["region", "original=1"], function (xhr) {
        this.url = this.url.replace("original=1", "original=0");
    });
    // 修复置顶推荐
    API.jsonphook(["api.bilibili.com/x/web-interface/ranking/index"], function (xhr) {
        this.url = this.url.replace("ranking/index", "index/top");
    });
    // 转换的失效分区
    API.runWhile(() => document.querySelector("#bili_ad"), function () {
        const node = document.querySelector("#bili_ad");
        const sight = node.querySelectorAll("a");
        const title = node.querySelector(".name");
        const technology = document.querySelector("#bili_technology").querySelector(".name");
        const digital = document.querySelector("#bili_digital").querySelector(".name");
        title && (title.innerText = "资讯");
        sight.forEach(d => {
            d.href && d.href.includes("www.bilibili.com/v/ad/ad/") && (d.href = "https://www.bilibili.com/v/information/");
        });
        API.addElement("div", { class: "r-con" }, undefined, '<div class="r-con"><header style="margin-bottom: 14px"><h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3></header><div class="carousel-module"><div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp" width="260" height="280"/></a></div></div></div>', undefined, document.querySelector("#ranking_ad"));
        technology.href = "//www.bilibili.com/v/knowledge/";
        technology.innerHTML = "知识";
        digital.href = "//www.bilibili.com/v/tech/";
        digital.innerHTML = "科技";
        document.querySelector(".icon.icon_t.icon-ad").setAttribute("style", "background-image: url(//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/image/news.png);background-position: unset;");
    });
    API.runWhile(() => document.querySelector(".report-wrap-module.elevator-module"), function () {
        const node = document.querySelector(".report-wrap-module.elevator-module");
        for (let item of node.children[1].children) {
            if (item.innerHTML == "广告")
                item.innerHTML = "资讯";
            if (item.innerHTML == "科技")
                item.innerHTML = "知识";
            if (item.innerHTML == "数码")
                item.innerHTML = "科技";
        }
    });
    // 修复电影、电视剧、纪录片排行
    async function fixRank(node) {
        const sorts = {
            bili_movie: ["ranking_movie", 2, "https://www.bilibili.com/ranking/cinema/23/0/3"],
            bili_teleplay: ["ranking_teleplay", 5, "https://www.bilibili.com/ranking/cinema/11/0/3"],
            bili_documentary: ["ranking_documentary", 3, "https://www.bilibili.com/ranking/cinema/177/0/3"]
        };
        const sort = sorts[node.id];
        if (!sort)
            return;
        let section = node.getElementsByClassName("sec-rank report-wrap-module zone-rank")[0];
        section.innerHTML = '<header class="rank-head"><h3>排行</h3></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list"></ul></div><a href="' + sort[2] + '" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>';
        try {
            let data = await API.xhr({ url: API.objUrl("https://api.bilibili.com/pgc/season/rank/web/list", { season_type: sort[1], day: '3' }) });
            data = API.jsonCheck(data).data;
            let div = node.getElementsByClassName("bangumi-rank-list rank-list")[0];
            for (let i = 0; i < 8; i++) {
                let li = document.createElement("li"), cl = i < 3 ? "rank-item highlight" : "rank-item", fw;
                li.setAttribute("class", cl);
                li.innerHTML = '<i class="ri-num">' + (i + 1) + '</i><a href="' + data.list[i].url + '" target="_blank" title="' + data.list[i].title + ' 播放:' + data.list[i].stat.view + '" class="ri-info-wrap"><p class="ri-title">' + data.list[i].title + '</p><span class="ri-total">' + data.list[i].new_ep.index_show + '</span></a>';
                li.onmouseover = () => {
                    fw = document.createElement("div");
                    fw.setAttribute("class", "bangumi-info-module");
                    fw.setAttribute("style", 'left: ' + li.getBoundingClientRect().left + 'px; top: ' + (API.getTotalTop(li) - 150) + 'px;');
                    fw.innerHTML = '<div class="v-preview clearfix"><div class="lazy-img cover"><img alt="' + data.list[i].title + '" src="' + data.list[i].cover + '" /></div><div><p class="title">' + data.list[i].title + '</p><p class="desc">' + data.list[i].new_ep.index_show + '</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>' + API.unitFormat(data.list[i].stat.view) + '</span><span class="danmu"><i class="icon"></i>' + API.unitFormat(data.list[i].stat.danmaku) + '</span><span class="fav"><i class="icon"></i>' + API.unitFormat(data.list[i].stat.follow) + '</span></div>';
                    document.body.appendChild(fw);
                };
                li.onmouseout = () => fw.remove();
                div.appendChild(li);
            }
        }
        catch (e) {
            API.debug.trace(e, "indexSort.js");
        }
    }
    API.runWhile(() => document.querySelector("#bili_movie"), () => fixRank(document.querySelector("#bili_movie")));
    API.runWhile(() => document.querySelector("#bili_teleplay"), () => fixRank(document.querySelector("#bili_teleplay")));
    API.runWhile(() => document.querySelector("#bili_documentary"), () => fixRank(document.querySelector("#bili_documentary")));
    // 清洗个性化推荐
    let indexRecommend, indexFlag;
    API.runWhile(() => document.querySelector(".bili-wrapper"), async function () {
        try {
            let node = document.querySelector(".recommend-module.clearfix"); // 父节点
            let prev = API.addElement("span", { class: "rec-btn prev" }, node, undefined, undefined, document.querySelector(".rec-btn.prev")); // 替换切换按钮
            let next = API.addElement("span", { class: "rec-btn next" }, node, undefined, undefined, document.querySelector(".rec-btn.next")); // 替换切换按钮
            prev.innerHTML = next.innerHTML = "切换"; // 命名按钮
            prev.onclick = next.onclick = async () => {
                // 按钮单击回调
                document.querySelectorAll(".groom-module.home-card").forEach(d => d.remove()); // 移除现有数据
                let wait = API.addElement("div", { class: "load-state" }, node, undefined, true); // 添加loading临时节点
                wait.innerHTML = '<span class="loading">正在加载...</span><!----><!---->'; // 写入loading提示
                indexRecommend = indexRecommend && indexRecommend.length > 20 ? indexRecommend : API.jsonCheck(await API.xhr({
                    url: "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",
                    credentials: !config.privateRecommend
                })).data.item; // 请求推荐数据，分情况，个性化推荐每次都请求，全站推荐只请求一次
                indexFlag = indexRecommend.length < 20 ? 10 : indexFlag || ((API.uid && config.privateRecommend) ? 10 : 20); // 设置遍历起始点，个性化推荐固定为10
                wait.remove(); // 移除loading节点
                for (let i = indexFlag - 1; i >= indexFlag - 10; i--) {
                    // 依次创建推荐数据，长度固定为10
                    API.addElement("div", { class: "groom-module home-card" }, node, undefined, true).innerHTML = `<a href="//www.bilibili.com/video/av${indexRecommend[i].aid || indexRecommend[i].id}" target="_blank" title="${indexRecommend[i].title}">
                        <img src="${indexRecommend[i].pic.replace("http:", "")}@160w_100h.webp" alt="${indexRecommend[i].title}" width="160" height="100" class="pic">
                        "><!----><div class="card-mark"><p class="title">${indexRecommend[i].title}</p><p class="author">up主：${indexRecommend[i].owner.name}</p><p class="play">播放：${API.unitFormat(indexRecommend[i].stat.view)}</p></div></a><div class="watch-later-trigger w-later"></div></div>`;
                }
                indexFlag = indexRecommend.length < 20 ? 10 : indexFlag < 30 ? indexFlag + 10 : 10; // 对于全站推荐，刷新遍历起始点
            };
            if (API.uid && config.privateRecommend)
                prev.click(); // 移除个性化推荐
        }
        catch (e) {
            API.debug.trace(e, "indexSort.js");
        }
    });
})();
