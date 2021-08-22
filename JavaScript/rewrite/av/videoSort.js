"use strict";
/**
 * 本模块负责修复分区数据
 * B站已经进行过几次分区调整了，旧版页面可能识别不出来那些新分区
 */
(() => {
    let sort = JSON.parse(GM.getResourceText("videoSort.json"));
    API.runWhile(() => document.querySelector(".tm-info"), async () => {
        if (!API.tid) {
            try {
                API.tid = API.jsonCheck(await API.xhr({
                    url: API.objUrl("https://api.bilibili.com/x/web-interface/view", { aid: API.aid })
                })).data.tid;
                if (!(API.tid in sort))
                    return;
                let nodes = document.querySelector(".tm-info").childNodes;
                nodes[2].replaceWith(nodes[0].cloneNode(true));
                nodes[4].replaceWith(nodes[0].cloneNode(true));
                nodes[4].childNodes[1].remove();
                nodes[2].childNodes[0].href = sort[sort[API.tid][0]][2];
                nodes[2].childNodes[0].innerText = sort[sort[API.tid][0]][1];
                nodes[4].childNodes[0].href = sort[API.tid][2];
                nodes[4].childNodes[0].innerText = sort[API.tid][1];
            }
            catch (e) {
                API.debug.trace(e, "videoSort.js");
            }
        }
        else if (!(API.tid in sort)) {
            let nodes = document.querySelector(".tm-info").childNodes;
            nodes[1].replaceWith(nodes[0].cloneNode(true));
            nodes[2].replaceWith(nodes[0].cloneNode(true));
            nodes[2].childNodes[1].remove();
            nodes[1].childNodes[0].href = sort[sort[API.tid][0]][2];
            nodes[1].childNodes[0].innerText = sort[sort[API.tid][0]][1];
            nodes[2].childNodes[0].href = sort[API.tid][2];
            nodes[2].childNodes[0].innerText = sort[API.tid][1];
        }
    });
})();
