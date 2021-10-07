/**
 * 本模块负责视频标题下失效的分区信息  
 * 分区信息表videoSort.json可能需要长期维护
 */
(function () {
    API.runWhile(() => document.querySelector(".tm-info"), () => {
        try {
            const sort = <Record<number, [number, string, string]>>API.getModule("videoSort.json");
            if (API.path.name == "av" && API.tid && API.tid in sort) {
                const nodes = document.querySelector(".tm-info").childNodes;
                nodes[1].replaceWith(nodes[0].cloneNode(true));
                nodes[2].replaceWith(nodes[0].cloneNode(true));
                nodes[2].childNodes[1].remove();
                (<HTMLAnchorElement>nodes[1].childNodes[0]).href = sort[sort[API.tid][0]][2];
                (<HTMLAnchorElement>nodes[1].childNodes[0]).text = sort[sort[API.tid][0]][1];
                (<HTMLAnchorElement>nodes[2].childNodes[0]).href = sort[API.tid][2];
                (<HTMLAnchorElement>nodes[2].childNodes[0]).text = sort[API.tid][1];
            } else if (API.path.name == "watchlater") {
                const nodes = document.querySelector(".tm-info").childNodes;
                if (nodes[2].nodeType === 8) {
                    xhr({
                        url: `https://api.bilibili.com/x/web-interface/view?aid=${API.aid}`,
                        responseType: "json"
                    }).then(d => {
                        API.tid = API.jsonCheck(d).data.tid;
                        if (API.tid && API.tid in sort) {
                            nodes[2].replaceWith(nodes[0].cloneNode(true));
                            nodes[4].replaceWith(nodes[0].cloneNode(true));
                            nodes[4].childNodes[1].remove();
                            (<HTMLAnchorElement>nodes[2].childNodes[0]).href = sort[sort[API.tid][0]][2];
                            (<HTMLAnchorElement>nodes[2].childNodes[0]).text = sort[sort[API.tid][0]][1];
                            (<HTMLAnchorElement>nodes[4].childNodes[0]).href = sort[API.tid][2];
                            (<HTMLAnchorElement>nodes[4].childNodes[0]).text = sort[API.tid][1];
                        }
                    })
                }
            }
        } catch (e) { debug.error("videoSort.js", e) }
    })
})()