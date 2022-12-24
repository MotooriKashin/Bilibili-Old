import { BLOD } from "../bilibili-old";
import { apiArticleCards } from "../io/api-article-cards";
import { debug } from "../utils/debug";
import { objUrl, urlObj } from "../utils/format/url";
import { poll } from "../utils/poll";
import { switchVideo } from "./observer";
import { Player } from "./player";
import { localStorage, sessionStorage } from "./storage";

export class Automate {
    constructor(protected BLOD: BLOD) {
        this.modifyArgument();
        this.danmakuFirst();
        switchVideo(this.switchVideo);
        this.videospeed();
    }
    /** 展开弹幕列表 */
    protected danmakuFirst() {
        this.BLOD.status.automate.danmakuFirst && sessionStorage.setItem("player_last_filter_tab_info", 4);
    }
    /** 滚动到播放器 */
    protected showBofqi() {
        const str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
        this.BLOD.status.automate.showBofqi && setTimeout(() => {
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
        this.BLOD.status.automate.webFullScreen && poll(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen.icon-24webfull.player-tooltips-trigger"), () => (<HTMLElement>document.querySelector(".bilibili-player-video-web-fullscreen")).click());
    }
    /** 记忆播放速率 */
    protected videospeed() {
        if (this.BLOD.status.automate.videospeed) {
            this.BLOD.GM.getValue("videospeed").then(videospeed => {
                if (videospeed) {
                    let setting = sessionStorage.getItem("bilibili_player_settings");
                    setting ? setting.video_status ? setting.video_status.videospeed = videospeed : setting.video_status = { videospeed } : setting = { video_status: { videospeed } };
                    sessionStorage.setItem("bilibili_player_settings", setting);
                }
            });
            switchVideo(() => {
                poll(() => document.querySelector("#bofqi")?.querySelector<HTMLVideoElement>("video"), d => {
                    d.addEventListener("ratechange", e => {
                        this.BLOD.GM.setValue("videospeed", (<HTMLVideoElement>e.target).playbackRate || 1);
                    });
                })
            })
        }
    }
    /** 关闭抗锯齿 */
    protected videoDisableAA() {
        this.BLOD.status.videoDisableAA && poll(() => document.querySelector<HTMLVideoElement>("#bilibiliPlayer .bilibili-player-video video"), d => d.style.filter += "contrast(1)");
    }
    /** 修改播放器启动参数 */
    private modifyArgument() {
        Player.addModifyArgument(args => {
            const obj = urlObj(`?${args[2]}`);
            this.BLOD.status.automate.screenWide && (obj.as_wide = 1);
            this.BLOD.status.automate.autoPlay && (obj.autoplay = 1);
            this.BLOD.status.automate.noDanmaku && (obj.danmaku = 0);
            args[2] = objUrl('', obj);
        })
    }
    /** 切p回调 */
    private switchVideo = async () => {
        this.showBofqi();
        this.webFullScreen();
        this.videoDisableAA();
        if (!this.BLOD.videoInfo.metadata && this.BLOD.aid) {
            apiArticleCards({ av: this.BLOD.aid })
                .then(d => {
                    Object.values(d).forEach(d => this.BLOD.videoInfo.aidDatail(d));
                    this.BLOD.videoInfo.mediaSession();
                })
                .catch((e) => { debug.error('获取aid详情出错！', e) })
        } else {
            this.BLOD.videoInfo.mediaSession();
        }
    }
}