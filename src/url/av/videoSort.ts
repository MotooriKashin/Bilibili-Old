interface modules {
    /** 修正视频分区信息 */
    readonly "videoSort.js": string;
    readonly "videoSort.json": Record<number, [number, string, string]>;
}
namespace API {
    runWhile(() => document.querySelector(".tm-info") && aid, () => {
        try {
            const sort = <Record<number, [number, string, string]>>getModule("videoSort.json");
            if (path.name == "av" && tid && tid in sort) {
                const nodes = document.querySelector<any>(".tm-info").childNodes;
                nodes[1].replaceWith(nodes[0].cloneNode(true));
                nodes[2].replaceWith(nodes[0].cloneNode(true));
                nodes[2].childNodes[1].remove();
                (<HTMLAnchorElement>nodes[1].childNodes[0]).href = sort[sort[tid][0]][2];
                (<HTMLAnchorElement>nodes[1].childNodes[0]).text = sort[sort[tid][0]][1];
                (<HTMLAnchorElement>nodes[2].childNodes[0]).href = sort[tid][2];
                (<HTMLAnchorElement>nodes[2].childNodes[0]).text = sort[tid][1];
            } else if (path.name == "watchlater") {
                const nodes = document.querySelector<any>(".tm-info").childNodes;
                if (nodes[2].nodeType === 8) {
                    xhr({
                        url: `https://api.bilibili.com/x/web-interface/view?aid=${aid}`,
                        responseType: "json"
                    }).then(d => {
                        tid = jsonCheck(d).data.tid;
                        if (tid && tid in sort) {
                            nodes[2].replaceWith(nodes[0].cloneNode(true));
                            nodes[4].replaceWith(nodes[0].cloneNode(true));
                            nodes[4].childNodes[1].remove();
                            (<HTMLAnchorElement>nodes[2].childNodes[0]).href = sort[sort[tid][0]][2];
                            (<HTMLAnchorElement>nodes[2].childNodes[0]).text = sort[sort[tid][0]][1];
                            (<HTMLAnchorElement>nodes[4].childNodes[0]).href = sort[tid][2];
                            (<HTMLAnchorElement>nodes[4].childNodes[0]).text = sort[tid][1];
                        }
                    })
                }
            }
        } catch (e) { debug.error("videoSort.js", e) }
    })
}