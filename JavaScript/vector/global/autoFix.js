"use strict";
/**
 * 本模块负责一些自动化处理
 */
(function () {
    API.switchVideo(() => {
        config.danmakuFirst && document.querySelectorAll(".bilibili-player-filter-btn")[1].click();
        setTimeout(() => {
            config.showBofqi && API.bofqiToView();
            config.screenWide && document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff") && document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").click();
            if (config.noDanmaku && !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off")) {
                if (document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")) {
                    document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku").click(); // 自动关闭弹幕
                }
            }
        });
        config.autoPlay && setTimeout(() => { window.player && window.player.play && window.player.play(); }, 1000);
    });
})();
