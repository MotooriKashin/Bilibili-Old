interface modules {
    /**
     * 首页推荐直播
     */
    readonly "biliIndexRec.js": string;
}
API.xhrhook("api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec", args => {
    args[1] = args[1].includes("List") ? args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web') : args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
}, obj => {
    let response: any = obj.responseText?.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
    if (response) {
        response = JSON.parse(response);
        response.data.text_link = { text: "233秒居然能做这些！", link: "//vc.bilibili.com" };
        if (response.data.recommend) {
            for (let i = 0; i < response.data.recommend.length; i++) {
                response.data.recommend[i].pic = response.data.recommend[i].cover;
                response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
            }
        }
        if (response.data.preview) for (let i = 0; i < response.data.preview.length; i++) response.data.preview[i].url = response.data.preview[i].link;
        obj.response = obj.responseText = JSON.stringify(response);
    }
}, false)