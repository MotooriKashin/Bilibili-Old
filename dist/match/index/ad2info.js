/**
 * 本模块负责将主页失效的广告区转化为资讯区
 */
try {
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
}
catch (e) {
    API.trace(e, "ad2info.js", true);
}
