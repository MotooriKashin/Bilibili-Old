/**
 * 本模块负责取消主页个性化推荐
 */
(function () {
    let indexRecommend: any[], indexFlag: number;
    API.runWhile(() => document.querySelector(".bili-wrapper"), async function () {
        try {
            let node = <HTMLDivElement>document.querySelector(".recommend-module.clearfix"); // 父节点
            let prev = API.addElement("span", { class: "rec-btn prev" }, node, undefined, undefined, <HTMLDivElement>document.querySelector(".rec-btn.prev")); // 替换切换按钮
            let next = API.addElement("span", { class: "rec-btn next" }, node, undefined, undefined, <HTMLDivElement>document.querySelector(".rec-btn.next")); // 替换切换按钮
            prev.innerHTML = next.innerHTML = "切换"; // 命名按钮
            prev.onclick = next.onclick = async () => {
                // 按钮单击回调
                document.querySelectorAll(".groom-module.home-card").forEach(d => d.remove()); // 移除现有数据
                let wait = API.addElement("div", { class: "load-state" }, node, undefined, true); // 添加loading临时节点
                wait.innerHTML = '<span class="loading">正在加载...</span><!----><!---->'; // 写入loading提示
                indexRecommend = indexRecommend && indexRecommend.length > 20 ? indexRecommend : API.jsonCheck(await xhr({
                    url: "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",
                    credentials: !config.privateRecommend
                })).data.item; // 请求推荐数据，分情况，个性化推荐每次都请求，全站推荐只请求一次
                indexFlag = indexRecommend.length < 20 ? 10 : indexFlag || ((API.uid && config.privateRecommend) ? 10 : 20); // 设置遍历起始点，个性化推荐固定为10
                wait.remove(); // 移除loading节点
                for (let i = indexFlag - 1; i >= indexFlag - 10; i--) {
                    // 依次创建推荐数据，长度固定为10
                    API.addElement("div", { class: "groom-module home-card" }, node, undefined, true).innerHTML = `<a href="//www.bilibili.com/video/av${indexRecommend[i].aid || indexRecommend[i].id}" target="_blank" title="${indexRecommend[i].title}">
                        <img src="${indexRecommend[i].pic.replace("http:", "")}@160w_100h.webp" alt="${indexRecommend[i].title}" width="160" height="100" class="pic">
                        "><!----><div class="card-mark"><p class="title">${indexRecommend[i].title}</p><p class="author">up主：${indexRecommend[i].owner.name}</p><p class="play">播放：${API.unitFormat(indexRecommend[i].stat.view)}</p></div></a><div class="watch-later-trigger w-later"></div></div>`
                }
                indexFlag = indexRecommend.length < 20 ? 10 : indexFlag < 30 ? indexFlag + 10 : 10; // 对于全站推荐，刷新遍历起始点
            }
            if (API.uid && config.privateRecommend) prev.click(); // 移除个性化推荐
        } catch (e) { API.trace(e, "indexRecommend.js") }
    })
})();