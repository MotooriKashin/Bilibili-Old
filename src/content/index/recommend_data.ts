/** 获取recommendData */
export async function recommendData(privateRecommend = false) {
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