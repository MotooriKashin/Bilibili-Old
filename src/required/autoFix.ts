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
        API.path.name && API.observerAddedNodes(e => {
            if (e.className && /bilibili-player-danmaku-setting-lite-panel/.test(e.className)) {
                API.runWhile(() => document.querySelector(".bilibili-player-setting-dmask-wrap"), () => {
                    const node = document.querySelector(".bilibili-player-setting-dmask-wrap").parentElement;
                    const lebel = API.addElement("label", { class: "bpui-checkbox-text", style: "cursor: pointer;display: inline-table;" }, node, "本地文件");
                    const input = API.addElement("input", { type: "file", accept: ".mp4,.xml,.json", multiple: "multiple", style: "width: 0;" }, lebel);
                    input.onchange = () => {
                        (!window.player?.setDanmaku) && toast.warning("内部组件丢失，无法载入弹幕文件！");
                        API.localMedia(input.files);
                    }
                })
            }
        })
    } catch (e) { debug.error("autoFix.js", e) }
})();