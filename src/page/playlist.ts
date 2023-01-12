import { BLOD } from "../bilibili-old";
import { Comment } from "../core/comment";
import { switchVideo } from "../core/observer";
import { Player } from "../core/player";
import { Like } from "../core/ui/like";
import html from '../html/playlist.html';
import { IAidDatail, IAidInfo, jsonCheck } from "../io/api";
import toview from '../json/toview.json';
import { addCss } from "../utils/element";
import { objUrl, urlObj } from "../utils/format/url";
import { jsonpHook } from "../utils/hook/node";
import { xhrHook } from "../utils/hook/xhr";
import { poll } from "../utils/poll";
import { Header } from "./header";
import { Page } from "./page";

export class PagePlaylist extends Page {
    /** 查询参数 */
    protected route = urlObj(location.href);
    /** 播单类型 */
    protected type = 3;
    /** 播单号 */
    protected pl = -1;
    /** 是否播单 */
    protected isPl = false;
    protected like: Like;
    constructor(protected BLOD: BLOD) {
        super(html);
        this.like = new Like(this.BLOD);
        new Comment(BLOD);
        this.init();
        this.EmbedPlayer();
        this.toviewHook();
        this.updateDom();
        this.elecShow();
        this.enLike();
        Header.primaryMenu();
        Header.banner();
        this.isPl || switchVideo(this.switchVideo);
    }
    /** 初始化 */
    protected init() {
        this.isPl = Boolean(this.BLOD.path[5].startsWith("pl"));
        this.BLOD.path[5].replace(/\d+/, d => this.pl = <any>d);
        // 区分medialist类型
        if (this.route.business) {
            switch (this.route.business) {
                case "space": this.type = 1;
                    break;
                case "space_series": this.type = 5; this.pl = <number>this.route.business_id;
                    break;
                case "space_channel": this.type = 6; this.pl = 10 * <number>this.route.business_id + this.pl % 10;
                    break;
                case "space_collection": this.type = 8; this.pl = <number>this.route.business_id;
                    break;
                default: this.type = 3;
            }
        }
        // 伪装页面
        this.isPl || this.BLOD.urlCleaner.updateLocation(objUrl(`https://www.bilibili.com/playlist/video/pl${this.pl}`, this.route));
    }
    /** 过滤播放启动参数 */
    protected EmbedPlayer() {
        // 伪造的播单页面的启动命令不对，修改后代发
        if (!this.isPl) {
            Player.addModifyArgument(args => {
                const obj = urlObj(`?${args[2]}`);
                delete obj.playlist;
                obj.playlistType = this.type;
                obj.playlistId = this.pl;
                obj.playBvid = NaN;
                obj.playlistOid = '';
                obj.playlistOtype = NaN;
                obj.sort_field = 1;
                args[2] = objUrl('', obj);
            });
            xhrHook('x/v2/medialist/resource/list?', undefined, async res => {
                const data = jsonCheck(res.response);
                data.data.media_list.forEach((d: IAidInfo) => {
                    this.BLOD.videoInfo.aidInfo(d);
                });
            })
        }
    }
    /** 拦截并修改页面初始化请求 */
    protected toviewHook() {
        jsonpHook.async("toview", undefined, async () => {
            // 撤销伪装
            this.BLOD.urlCleaner.updateLocation(this.BLOD.path.join('/'));
            return { code: 0, data: toview, message: "0", ttl: 1 }
        });
        this.BLOD.videoInfo.toview(toview);
    }
    /** 跳过充电鸣谢 */
    protected elecShow() {
        if (this.BLOD.status.elecShow) {
            jsonpHook("api.bilibili.com/x/web-interface/elec/show", undefined, res => {
                try {
                    res.data.av_list = [];
                } catch { }
                return res;
            }, false)
        } else {
            jsonpHook.async("api.bilibili.com/x/web-interface/elec/show", undefined, async () => { return { code: -404 } }, false)
        }
    }
    /** 伪造的播单页不应有识别参数 */
    protected switchVideo = () => {
        this.BLOD.urlCleaner.updateLocation(this.BLOD.path.join('/'));
    }
    /** 点赞功能 */
    protected enLike() {
        if (this.BLOD.status.like) {
            poll(() => document.querySelector<HTMLSpanElement>('.u.coin'), d => {
                d.parentElement?.insertBefore(this.like, d);
                addCss('.video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}', 'ulike-playlist');
            });
            jsonpHook('x/web-interface/view?', undefined, d => {
                setTimeout(() => {
                    const data: IAidDatail = jsonCheck(d).data;
                    this.BLOD.aid = data.aid;
                    this.like.likes = data.stat.like;
                });
                return d;
            }, false);
            switchVideo(() => {
                this.like.init();
            });
        }
    }
}