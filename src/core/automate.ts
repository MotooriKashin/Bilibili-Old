import { apiArticleCards } from "../io/api-article-cards";
import { debug } from "../utils/debug";
import { objUrl, urlObj } from "../utils/format/url";
import { poll } from "../utils/poll";
import { BLOD } from "./bilibili-old";
import { switchVideo } from "./observer";
import { player } from "./player";
import { sessionStorage } from "./storage";
import { user } from "./user";
import { videoInfo } from "./video-info";

export class Automate {
    constructor() {
        this.modifyArgument();
        this.danmakuFirst();
        switchVideo(this.switchVideo);
        this.videospeed();
    }
    /** 展开弹幕列表 */
    protected danmakuFirst() {
        user.userStatus!.automate.danmakuFirst && sessionStorage.setItem("player_last_filter_tab_info", 4);
    }
    /** 滚动到播放器 */
    protected showBofqi() {
        const str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
        user.userStatus!.automate.showBofqi && setTimeout(() => {
            // 滚动到播放器
            const node = str.reduce((s, d) => {
                s = s || document.querySelector(d);
                return s;
            }, document.querySelector("#__bofqi"));
            node && node.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 500);
    }
    /** 自动网页全屏 */
    protected webFullScreen() {
        user.userStatus!.automate.webFullScreen && poll(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen.icon-24webfull.player-tooltips-trigger"), () => (<HTMLElement>document.querySelector(".bilibili-player-video-web-fullscreen")).click());
    }
    /** 记忆播放速率 */
    protected videospeed() {
        if (user.userStatus!.automate.videospeed) {
            GM.getValue("videospeed").then(videospeed => {
                if (videospeed) {
                    let setting = sessionStorage.getItem("bilibili_player_settings");
                    setting ? setting.video_status ? setting.video_status.videospeed = videospeed : setting.video_status = { videospeed } : setting = { video_status: { videospeed } };
                    sessionStorage.setItem("bilibili_player_settings", setting);
                }
            });
            switchVideo(() => {
                poll(() => document.querySelector("#bofqi")?.querySelector<HTMLVideoElement>("video"), d => {
                    d.addEventListener("ratechange", e => {
                        GM.setValue("videospeed", (<HTMLVideoElement>e.target).playbackRate || 1);
                    });
                })
            })
        }
    }
    /** 关闭抗锯齿 */
    protected videoDisableAA() {
        user.userStatus!.videoDisableAA && poll(() => document.querySelector<HTMLVideoElement>("#bilibiliPlayer .bilibili-player-video video"), d => d.style.filter += "contrast(1)");
    }
    /** 修改播放器启动参数 */
    private modifyArgument() {
        player.addModifyArgument(args => {
            const obj = urlObj(`?${args[2]}`);
            user.userStatus!.automate.screenWide && (obj.as_wide = 1);
            user.userStatus!.automate.autoPlay && (obj.autoplay = 1);
            user.userStatus!.automate.noDanmaku && (obj.danmaku = 0);
            args[2] = objUrl('', obj);
        })
    }
    /** 切p回调 */
    private switchVideo = async () => {
        this.showBofqi();
        this.webFullScreen();
        this.videoDisableAA();
        if (!videoInfo.metadata && BLOD.aid) {
            apiArticleCards({ av: BLOD.aid })
                .then(d => {
                    Object.values(d).forEach(d => videoInfo.aidDatail(d));
                    videoInfo.mediaSession();
                })
                .catch((e) => { debug.error('获取aid详情出错！', e) })
        } else {
            videoInfo.mediaSession();
        }
    }
}