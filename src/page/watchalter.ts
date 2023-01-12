import { BLOD } from "../bilibili-old";
import { Comment } from "../core/comment";
import { Like } from "../core/ui/like";
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
    constructor(protected BLOD: BLOD) {
        super(html);
        this.like = new Like(this.BLOD);
        new Comment(BLOD);
        this.enLike();
        this.toview();
        this.updateDom();
        this.living();
        this.commentAgent();
        Header.primaryMenu();
        Header.banner();
    }
    /** 记录视频数据 */
    protected toview() {
        jsonpHook('history/toview/web?', undefined, d => {
            setTimeout(() => {
                d.data.list.forEach((d: IAidDatail) => this.BLOD.videoInfo.aidDatail(d));
            });
            return d;
        })
    }
    /** 点赞功能 */
    protected enLike() {
        if (this.BLOD.status.like) {
            poll(() => document.querySelector<HTMLSpanElement>('.u.coin'), d => {
                d.parentElement?.insertBefore(this.like, d);
                addCss('.video-info-module .number .ulike {margin-left: 15px;margin-right: 5px;}', 'ulike-watchlater');
            }, undefined, 0);
            jsonpHook('x/web-interface/view?', undefined, d => {
                setTimeout(() => {
                    const data: IAidDatail = jsonCheck(d).data;
                    this.BLOD.aid = data.aid;
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