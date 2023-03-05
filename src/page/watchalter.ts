import { BLOD } from "../core/bilibili-old";
import { Comment } from "../core/comment";
import { Like } from "../core/ui/like";
import { user } from "../core/user";
import { videoInfo } from "../core/video-info";
import html from '../html/watchlater.html';
import { IAidDatail, jsonCheck } from "../io/api";
import { addCss } from "../utils/element";
import { jsonpHook } from "../utils/hook/node";
import { xhrHook } from "../utils/hook/xhr";
import { poll } from "../utils/poll";
import { Header } from "./header";
import { Page } from "./page";

export class PageWatchlater extends Page {
    protected like: Like;
    constructor() {
        super(html);
        this.like = new Like();
        new Comment();
        this.enLike();
        this.toview();
        this.living();
        this.commentAgent();
        Header.primaryMenu();
        Header.banner();
        this.updateDom();
    }
    /** 记录视频数据 */
    protected toview() {
        jsonpHook('history/toview/web?', undefined, d => {
            setTimeout(() => {
                d.data.list.forEach((d: IAidDatail) => videoInfo.aidDatail(d));
            });
            return d;
        })
    }
    /** 点赞功能 */
    protected enLike() {
        if (user.userStatus!.like) {
            poll(() => document.querySelector<HTMLSpanElement>('#viewlater-app > div > div > div > div.video-top-info.clearfix.bili-wrapper.bili-wrapper > div.video-info-module > div.number > span.u.coin.on'), d => {
                d.parentElement?.insertBefore(this.like, d);
                addCss('.video-info-module .number .ulike {margin-left: 15px;margin-right: 5px;}', 'ulike-watchlater');
            }, undefined, 0);
            jsonpHook('x/web-interface/view?', undefined, d => {
                setTimeout(() => {
                    const data: IAidDatail = jsonCheck(d).data;
                    BLOD.aid = data.aid;
                    this.like.likes = data.stat.like;
                    this.like.init();
                });
                return d;
            }, false);
        }
    }
    /** 修正直播错误 */
    protected living() {
        xhrHook("api.live.bilibili.com/bili/living_v2/", undefined, r => { r.response = r.responseText = ` ${r.response}` }, false);
    }
    /** 修复评论播放跳转 */
    protected commentAgent() {
        (<any>window).commentAgent = { seek: (t: number) => (<any>window).player && (<any>window).player.seek(t) };
    }
}