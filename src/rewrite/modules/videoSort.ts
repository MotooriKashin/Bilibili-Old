/**
 * 本模块负责修复分区数据  
 * B站已经进行过几次分区调整了，旧版页面可能识别不出来那些新分区
 */
(() => {
    let sort = JSON.parse(GM.getResourceText("videoSort.json"));
    API.runWhile(() => document.querySelector(".tm-info"), () => {
        if (!(API.tid in sort)) {
            let nodes = (<HTMLElement>document.querySelector(".tm-info")).childNodes;
            nodes[1].replaceWith(nodes[0].cloneNode(true));
            nodes[2].replaceWith(nodes[0].cloneNode(true));
            nodes[2].childNodes[1].remove();
            (<any>nodes[1].childNodes[0]).href = sort[sort[API.tid][0]][2];
            (<any>nodes[1].childNodes[0]).innerText = sort[sort[API.tid][0]][1];
            (<any>nodes[2].childNodes[0]).href = sort[API.tid][2];
            (<any>nodes[2].childNodes[0]).innerText = sort[API.tid][1];
        }
    })
})();