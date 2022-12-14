import { BLOD } from "../bilibili-old";
import { Page } from "./page";
import html from '../html/read.html';
import { propertyHook } from "../utils/hook/method";
import { IUserInfo } from "../io/api-view-detail";
import { IStat } from "../io/api";
import { addCss } from "../utils/element";
import { Comment } from "../core/comment";

interface ReadInfo {
    act_id: number;
    apply_time: string;
    authenMark: unknown;
    author: IUserInfo;
    banner_url: string;
    categories: ReadInfo['category'][];
    category: { id: number; name: string; parent_id: number };
    check_state: number;
    check_time: string;
    content: string;
    cover_avid: number;
    ctime: number;
    dispute: unknown;
    id: number;
    image_urls: string[];
    is_like: boolean;
    keywords: string;
    list: unknown;
    media: { area: string; cover: string; media_id: number; score: number; season_id: number; spoiler: number; title: string; type_id: number; type_name: string; };
    origin_image_urls: string[];
    original: number;
    publish_time: number;
    reprint: number;
    state: number;
    stats: IStat;
    summary: string;
    tags: { name: string; tid: number }[];
    template_id: number;
    title: string;
    top_video_info: unknown;
    type: number;
    version_id: number;
    words: number;
}
export class PageRead extends Page {
    protected readInfo!: ReadInfo;
    protected cvid!: number;
    protected bars: [number, string, string][] = [
        [0, "推荐", "home"],
        [2, "动画", "douga"],
        [1, "游戏", "game"],
        [28, "影视", "cinephile"],
        [3, "生活", "life"],
        [29, "兴趣", "interest"],
        [16, "轻小说", "lightnovel"],
        [17, "科技", "technology"],
        [41, "笔记", "note"]
    ];
    protected readInfoStr = '';
    constructor(protected BLOD: BLOD) {
        super(html);
        new Comment(BLOD);
        this.initState();
    }
    /** 获取专栏信息 */
    protected initState() {
        this.readInfo = (<any>window).__INITIAL_STATE__?.readInfo;
        if (this.readInfo) {
            this.cvid = (<any>window).__INITIAL_STATE__.cvid;
            this.buildReadInfo();
        } else {
            Reflect.defineProperty(window, '__INITIAL_STATE__', {
                configurable: true,
                set: v => {
                    this.readInfo = v.readInfo;
                    this.cvid = v.cvid;
                    propertyHook(window, '__INITIAL_STATE__', v);
                    this.buildReadInfo();
                }
            })
        }
    }
    /** 构造专栏节点 */
    protected buildReadInfo() {
        this.navTabBar();
        this.upInfoHolder();
        this.headContainer();
        this.articleHolder();
        this.tagContainer();
        this.articleAction();
        this.updateDom();
    }
    protected navTabBar() {
        this.readInfoStr += this.bars.reduce((s, d) => {
            s += `<a href="//www.bilibili.com/read/${d[2]}?from=articleDetail" target="_self" class="tab-item${this.readInfo.category.parent_id == d[0] ? " on" : ""}" data-tab-id="${d[0]}"><span>${d[1]}</span></a>`
            return s;
        }, '<div class="nav-tab-bar"><a href="https://www.bilibili.com/read/home?from=articleDetail" target="_self" class="logo"></a>') + '</div>';
    }
    protected upInfoHolder() {
        this.readInfoStr += `<div class="up-info-holder"><div class="fixed-box"><div class="up-info-block">
        <a class="up-face-holder" href="//space.bilibili.com/${this.readInfo.author.mid}" target="_blank"><img class="up-face-image" data-face-src="${this.readInfo.author.face.replace("http:", "")}" src="//static.hdslb.com/images/member/noface.gif" /></a><div class="up-info-right-block"><div class="row">
        <a class="up-name" href="//space.bilibili.com/${this.readInfo.author.mid}" target="_blank">${this.readInfo.author.name}</a> <span class="level"></span><div class="nameplate-holder"><i class="nameplate"></i></div></div><div class="row-2">粉丝: <span class="fans-num"></span> <span class="view">阅读:</span> <span class="view-num"></span></div></div></div><div class="follow-btn-holder"><span class="follow-btn">关注</span></div><div class="up-article-list-block hidden"><div class="block-title">推荐文章</div><ul class="article-list"></ul></div><div class="more"><div class="top-bar"><label>更多</label></div><a class="ac-link" href="//www.bilibili.com/read/apply/" target="_blank"><div class="link"><span class="icon"></span><p class="title">成为创作者</p><p class="info">申请成为专栏UP主</p></div></a> <a href="//www.bilibili.com/blackboard/help.html#%C3%A4%C2%B8%C2%93%C3%A6%C2%A0%C2%8F%C3%A7%C2%9B%C2%B8%C3%A5%C2%85%C2%B3" target="_blank"><div class="help"><span class="icon"></span><p class="title">专栏帮助</p><p class="info">查看专栏使用说明</p></div></a></div></div>
        </div><div class="right-side-bar"><div class="to-comment"><div class="comment-num-holder"><span class="comment-num"></span></div></div><div class="to-top"></div></div>`;
    }
    protected headContainer() {
        this.readInfoStr += `<div class="head-container"><div class="banner-img-holder"></div><div class="bangumi-rating-container"></div><div class="argue-flag hidden"></div><div class="title-container">
        <h1 class="title">${this.readInfo.title}</h1><div class="info">
        <a class="category-link" href="//www.bilibili.com/read/${(this.bars.find(d => {
            if (d[0] == this.readInfo.category.parent_id) return d;
        }))![2]}#rid=${this.readInfo.category.id}" target="_blank"><span>${this.readInfo.category.name}</span></a> <span class="create-time" data-ts="${this.readInfo.ctime}"></span><div class="article-data"></div>
        </div></div><div style="display:none" class="author-container">
        <a class="author-face" href="//space.bilibili.com/${this.readInfo.author.mid}" target="_blank"><img data-face-src="${this.readInfo.author.face.replace("http:", "")}" src="${this.readInfo.author.face.replace("http:", "")}" class="author-face-img" /></a> <a class="author-name" href="//space.bilibili.com/${this.readInfo.author.mid}" target="_blank">${this.readInfo.author.name}</a><div class="attention-btn slim-border">关注</div></div></div>`;
    }
    protected articleHolder() {
        this.readInfoStr += `<div class="article-holder">${this.readInfo.content}</div><p class="original">本文为我原创</p>`;
    }
    protected tagContainer() {
        this.readInfoStr += (this.readInfo.tags || []).reduce((o, d) => {
            o = o + `<li data-tag-id="${d.tid}" class="tag-item"><span class="tag-border"><span class="tag-border-inner"></span></span> <span class="tag-content">${d.name}</span></li>`;
            return o;
        }, `<ul class="tag-container">`) + '</ul>';
    }
    protected articleAction() {
        this.readInfoStr += `<div class="article-action"><div class="ops"><span class="like-btn"><i class="icon-video-details_like"></i> <span>--</span></span> <span class="coin-btn"><i class="icon-video-details_throw-coin"></i> <span>--</span></span> <span class="fav-btn"><i class="icon-video-details_collection"></i> <span>--</span></span> <span class="share-container share-btn">分享到：<span></span></span></div><div class="more"><!-- <i class="icon-general_more-actions"></i> --><div class="more-ops-list"><ul><li value="0">投诉或建议</li></ul></div></div></div><div class="article-list-holder-block"></div><div class="draft-holder-block"></div><div class="b-head comment-title-block"><span class="b-head-t comment-results" style="display: inline;"></span> <span class="b-head-t">评论</span></div><div class="comment-holder"></div>`;
    }
    protected updateDom() {
        // 写入 original
        (<any>window).original = {
            cvid: this.cvid,
            author: {
                name: this.readInfo.author.name,
                mid: this.readInfo.author.mid,
            },
            banner_url: this.readInfo.banner_url || (this.readInfo && this.readInfo.image_urls[0]) || null,
            reprint: this.readInfo.reprint,
            summary: this.readInfo.summary,
            media: "",
            actId: this.readInfo.act_id,
            dispute: {
                dispute: "",
                dispute_url: ""
            },
            spoiler: "0"
        };
        // 备份标题
        const title = document.title;
        this.vdom.replace(document.documentElement);
        document.querySelector(".page-container")!.innerHTML = this.readInfoStr;
        this.vdom.loadScript().then(() => {
            this.loadedCallback();
            PageRead.rightCopyEnable();
        });
        // 还原标题
        title && !title.includes("404") && (document.title = title);
    }
    /** 解锁右键菜单及复制 */
    static rightCopyEnable() {
        addCss(`* {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }`);
        [].forEach.call(['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'], function (event) {
            document.addEventListener(event, function (e: Event) {
                e.stopPropagation();
            }, true);
        });
    }
}