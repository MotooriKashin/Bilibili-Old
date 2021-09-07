/**
 * 本模块负责重构主页__INITIAL_STATE__
 * 请以`__INITIAL_DATA__`名义传入原始数据，重构结果以API对象的同名属性的形式返回
 * 原始数据对应自主页网页文件本身提取
 * 重构__INITIAL_STATE__是非常精细的工具，请务必耐心细致
 */
(function () {
    // @ts-ignore：传递参数
    let arr = JSON.parse(__INITIAL_DATA__);
    const result = {
        recommendData: [],
        locsData: {
            31: [{ id: 36585, contract_id: "", pos_num: 1, name: "小黑屋弹幕举报", pic: "https://i0.hdslb.com/bfs/archive/0aa2f32c56cb65b6d453192a3015b65e62537b9a.jpg", litpic: "", url: "https://www.bilibili.com/blackboard/activity-dmjbfj.html", style: 0, agency: "", label: "", intro: "", creative_type: 0, request_id: "1546354354629q172a23a61a62q626", src_id: 32, area: 0, is_ad_loc: true, ad_cb: "", title: "", server_type: 0, cm_mark: 0, stime: 1520478000, mid: "14629218" }]
        }
    };
    arr.forEach(d => {
        if (d.response.item) {
            d.response.item.forEach(d => {
                result.recommendData.push({
                    aid: API.abv(d.bvid),
                    typename: "",
                    title: d.title,
                    subtitle: "",
                    play: d.stat.view,
                    review: "",
                    video_review: "",
                    favorites: "",
                    mid: d.owner.mid,
                    author: d.owner.name,
                    creat: "",
                    pic: d.pic,
                    coins: "",
                    duration: d.duration,
                    badgepay: false,
                    rights: ""
                });
            });
        }
        if (d.response[4694])
            result.locsData[23] = d.response[4694]; //滚动推荐
        if (d.response[34])
            result.locsData[34] = d.response[34]; // 推广
    });
    API.__INITIAL_STATE__ = result;
})();
