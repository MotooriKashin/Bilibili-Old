/**
 * 本模块负责一些自动化处理
 */
(function () {
    API.switchVideo(() => {
        config.danmakuFirst && (<HTMLElement>document.querySelectorAll(".bilibili-player-filter-btn")[1]).click();
        setTimeout(() => {
            config.showBofqi && API.bofqiToView();
            config.screenWide && document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff") && (<HTMLElement>document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen")).click();
            if (config.noDanmaku && !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off")) {
                if (document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")) {
                    (<HTMLElement>document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")).click(); // 自动关闭弹幕
                }
            }
        })
        config.autoPlay && setTimeout(() => { (<any>window).player && (<any>window).player.play && (<any>window).player.play() }, 1000);
    })
})();