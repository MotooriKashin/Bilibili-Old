/**
 * 本模块负责将主页电影、电视剧、纪录片排行转化为番剧样式
 */
(function () {
    try {
        async function fixRank(node: HTMLDivElement) {
            const sorts = {
                bili_movie: ["ranking_movie", 2, "https://www.bilibili.com/ranking/cinema/23/0/3"],
                bili_teleplay: ["ranking_teleplay", 5, "https://www.bilibili.com/ranking/cinema/11/0/3"],
                bili_documentary: ["ranking_documentary", 3, "https://www.bilibili.com/ranking/cinema/177/0/3"]
            }
            const sort = (<any>sorts)[node.id];
            if (!sort) return;
            let section = node.getElementsByClassName("sec-rank report-wrap-module zone-rank")[0];
            section.innerHTML = '<header class="rank-head"><h3>排行</h3></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list"></ul></div><a href="' + sort[2] + '" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>';
            try {
                let data = await xhr({ url: API.objUrl("https://api.bilibili.com/pgc/season/rank/web/list", { season_type: sort[1], day: '3' }) });
                data = API.jsonCheck(data).data;
                let div = node.getElementsByClassName("bangumi-rank-list rank-list")[0];
                for (let i = 0; i < 8; i++) {
                    let li = document.createElement("li"),
                        cl = i < 3 ? "rank-item highlight" : "rank-item",
                        fw: any;
                    li.setAttribute("class", cl);
                    li.innerHTML = '<i class="ri-num">' + (i + 1) + '</i><a href="' + data.list[i].url + '" target="_blank" title="' + data.list[i].title + ' 播放:' + data.list[i].stat.view + '" class="ri-info-wrap"><p class="ri-title">' + data.list[i].title + '</p><span class="ri-total">' + data.list[i].new_ep.index_show + '</span></a>';
                    li.onmouseover = () => {
                        fw = document.createElement("div");
                        fw.setAttribute("class", "bangumi-info-module");
                        fw.setAttribute("style", 'left: ' + li.getBoundingClientRect().left + 'px; top: ' + (API.getTotalTop(li) - 150) + 'px;');
                        fw.innerHTML = '<div class="v-preview clearfix"><div class="lazy-img cover"><img alt="' + data.list[i].title + '" src="' + data.list[i].cover + '" /></div><div><p class="title">' + data.list[i].title + '</p><p class="desc">' + data.list[i].new_ep.index_show + '</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>' + API.unitFormat(data.list[i].stat.view) + '</span><span class="danmu"><i class="icon"></i>' + API.unitFormat(data.list[i].stat.danmaku) + '</span><span class="fav"><i class="icon"></i>' + API.unitFormat(data.list[i].stat.follow) + '</span></div>';
                        document.body.appendChild(fw);
                    }
                    li.onmouseout = () => fw.remove();
                    div.appendChild(li);
                }
            }
            catch (e) { debug.error("indexSort.js", e) }
        }
        API.runWhile(() => document.querySelector("#bili_movie"), () => fixRank(<HTMLDivElement>document.querySelector("#bili_movie")))
        API.runWhile(() => document.querySelector("#bili_teleplay"), () => fixRank(<HTMLDivElement>document.querySelector("#bili_teleplay")))
        API.runWhile(() => document.querySelector("#bili_documentary"), () => fixRank(<HTMLDivElement>document.querySelector("#bili_documentary")))
    } catch (e) { toast.error("mediaRank.js", e) }
})();