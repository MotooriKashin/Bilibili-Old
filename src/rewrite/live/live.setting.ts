/**
 * 本模块负责注册直播相关设置
 */
(function () {
    API.addSetting({
        type: "switch",
        key: "liveStream",
        label: "拦截直播",
        sub: "包括轮播",
        value: false,
        sort: "live",
        float: "将直播间设为未开播状态，不加载直播流或者轮播视频，适用于想打开直播间但不想浪费带宽或流量的情况。</br>※ 脚本注入不够快时可能拦截失败，硬刷新`Ctrl+Shift+R`/`Shift + F5`可解。"
    })
    API.addSetting({
        type: "switch",
        key: "liveP2p",
        label: "禁止P2P上传",
        sub: "隐私+带宽",
        value: true,
        sort: "live",
        float: "禁止直播间使用WebRTC进行P2P共享上传，以免暴露ip地址，并为小水管节约带宽。"
    })
    API.addSetting({
        type: "switch",
        key: "sleepCheck",
        label: "禁止挂机检测",
        sub: "允许后台直播",
        value: true,
        sort: "live",
        float: "禁止直播间5分钟不操作判定挂机并切断直播，可以放心挂后台听个响。"
    })
    API.addSetting({
        type: "switch",
        key: "anchor",
        label: "禁用天选时刻",
        value: false,
        sort: "live"
    })
    API.addSetting({
        type: "switch",
        key: "pkvm",
        label: "禁用大乱斗",
        value: false,
        sort: "live"
    })
})();
declare namespace config {
    /**
     * 直播：拦截直播流
     */
    let liveStream: boolean;
    /**
     * 直播：P2P上传
     */
    let liveP2p: boolean;
    /**
     * 直播：禁止挂机检测
     */
    let sleepCheck: boolean;
    /**
     * 直播：禁用天选时刻
     */
    let anchor: boolean;
    /**
     * 直播：禁用大乱斗
     */
    let pkvm: boolean;
}