/**
 * 本模块负责重构主页__INITIAL_STATE__  
 * 请以`__INITIAL_STATE__`名义传入原始数据，重构结果以API对象的同名属性的形式返回  
 * 原始数据对应自主页网页文件本身提取  
 * 重构__INITIAL_STATE__是非常精细的工具，请务必耐心细致  
 * 由于数据来源于Ajax，具有非常高的不确定性，主体代码请务必写在`try{}catch{}`结构中以免报错
 */
(function () {
    // @ts-ignore：传递参数
    let data = JSON.parse(__INITIAL_STATE__);
    const result: INDEX__INITIAL_STATE__ = {
        recommendData: [],
        locsData: {
            31: [{ id: 36585, contract_id: "", pos_num: 1, name: "小黑屋弹幕举报", pic: "https://i0.hdslb.com/bfs/archive/0aa2f32c56cb65b6d453192a3015b65e62537b9a.jpg", litpic: "", url: "https://www.bilibili.com/blackboard/activity-dmjbfj.html", style: 0, agency: "", label: "", intro: "", creative_type: 0, request_id: "1546354354629q172a23a61a62q626", src_id: 32, area: 0, is_ad_loc: true, ad_cb: "", title: "", server_type: 0, cm_mark: 0, stime: 1520478000, mid: "14629218" }]
        }
    }
    data.recommendData && data.recommendData.item.forEach((i: any) => {
        result.recommendData.push({
            aid: API.abv(i.bvid),
            typename: "",
            title: i.title,
            subtitle: "",
            play: i.stat.view,
            review: "",
            video_review: "",
            favorites: "",
            mid: i.owner.mid,
            author: i.owner.name,
            creat: "",
            pic: i.pic,
            coins: "",
            duration: i.duration,
            badgepay: false,
            rights: ""
        })
    });
    result.locsData = data.locsData;
    result.locsData[23] = data.locsData[3197].filter((d: any) => d.url);
    if (config.indexLoc) {
        for (let key in result.locsData) {
            if (Array.isArray(result.locsData[key])) {
                result.locsData[key] = result.locsData[key].filter(d => {
                    return d.is_ad ? (debug.debug("移除广告", key, d), false) : true;
                })
            }
        }
    }
    API.__INITIAL_STATE__ = result;
})();
interface INDEX__INITIAL_STATE__ {
    recommendData: any[];
    locsData: { [name: number]: any[] }
}