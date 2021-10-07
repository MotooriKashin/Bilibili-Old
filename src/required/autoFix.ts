/**
 * 本模块负责一些自动化处理
 */
(function () {
    try {
        function bofqiToView() {
            let str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
            let node = str.reduce((s, d) => {
                s = s || document.querySelector(d);
                return s;
            }, document.querySelector("#__bofqi"));
            node && node.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        API.switchVideo(() => {
            config.danmakuFirst && (<HTMLElement>document.querySelectorAll(".bilibili-player-filter-btn")[1]).click();
            setTimeout(() => {
                config.showBofqi && bofqiToView();
                config.screenWide && document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff") && (<HTMLElement>document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen")).click();
                if (config.noDanmaku && !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off")) {
                    if (document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")) {
                        (<HTMLElement>document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")).click(); // 自动关闭弹幕
                    }
                }
            }, 500)
            config.autoPlay && setTimeout(() => { (<any>window).player && (<any>window).player.play && (<any>window).player.play() }, 1000);
        })
    } catch (e) { debug.error("autoFix.js", e) }
})();