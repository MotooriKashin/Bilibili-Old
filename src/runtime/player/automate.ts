import { doWhile } from "../do_while";
import { GM } from "../gm";
import { setting } from "../setting";
import { sessionStorage, localStorage } from "../storage";
import { switchVideo } from "../switch_video";
import { setMediaSession } from "./media_meta";

/** 滚动到播放器 */
function bofqiToView() {
    let str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
    let node = str.reduce((s, d) => {
        s = s || document.querySelector(d);
        return s;
    }, document.querySelector("#__bofqi"));
    node && node.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
/** 自动化操作 */
export function automate() {
    switchVideo(() => {
        // 自动网页全屏
        setting.automate.webFullScreen && doWhile(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen.icon-24webfull.player-tooltips-trigger"), () => (<HTMLElement>document.querySelector(".bilibili-player-video-web-fullscreen")).click());
        // 自动关闭弹幕
        setting.automate.noDanmaku && doWhile(() => document.querySelector<HTMLDivElement>(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku"), d => {
            !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off") && d.click();
        });
        setting.videoDisableAA && doWhile(() => document.querySelector<HTMLVideoElement>("#bilibiliPlayer .bilibili-player-video video"), d => d.style.filter += "contrast(1)");
        setTimeout(() => {
            // 滚动到播放器
            setting.automate.showBofqi && bofqiToView();
        }, 500);
        setMediaSession();
    });
    // 切换到弹幕列表
    setting.automate.danmakuFirst && sessionStorage.setItem("player_last_filter_tab_info", 4);
    // 备份播放数据
    let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
    if (bilibili_player_settings) {
        if (bilibili_player_settings.video_status?.autopart !== "") {
            GM.setValue("bilibili_player_settings", bilibili_player_settings);
        }
    } else {
        GM.getValue("bilibili_player_settings").then(d => {
            d && localStorage.setItem("bilibili_player_settings", d);
        })
    }
    // 记忆播放器速率
    if (setting.automate.videospeed) {
        GM.getValue("videospeed").then(videospeed => {
            if (videospeed) {
                let setting = sessionStorage.getItem("bilibili_player_settings");
                setting ? setting.video_status ? setting.video_status.videospeed = videospeed : setting.video_status = { videospeed } : setting = { video_status: { videospeed } };
                sessionStorage.setItem("bilibili_player_settings", setting);
            }
        });
        switchVideo(() => {
            doWhile(() => document.querySelector("#bofqi")?.querySelector<HTMLVideoElement>("video"), d => {
                d.addEventListener("ratechange", e => {
                    GM.setValue("videospeed", (<HTMLVideoElement>e.target).playbackRate || 1);
                });
            })
        })
    }
}