/**
 * 本模块负责强制拦截视频载入
 */
(function () {
    API.xhrhook(["/playurl?"], function (args) {
        let obj: any = API.urlObj(args[1]);
        obj.aid = 1, obj.cid = 1, obj.ep_id = 1;
        args[1] = API.objUrl(args[1].split("?")[0], obj);
    })
    API.switchVideo(() => {
        API.bofqiMessage(["拦截视频页媒体载入用于呼出下载面板", "取消拦截"], 3, () => {
            config.noVideo = false;
            (<any>window).BilibiliPlayer({ aid: API.aid, cid: API.cid });
        }, true)
    })
})();