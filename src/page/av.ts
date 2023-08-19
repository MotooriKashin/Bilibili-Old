import { BLOD } from "../core/bilibili-old";
import { Comment } from "../core/comment";
import { player } from "../core/player";
import { toast } from "../core/toast";
import { Like } from "../core/ui/like";
import { urlCleaner } from "../core/url";
import { user } from "../core/user";
import { videoInfo } from "../core/video-info";
import cssUplist from '../css/uplist.css';
import html from '../html/av.html';
import { IStaf } from "../io/api";
import { apiArticleCards } from "../io/api-article-cards";
import { apiBiliplusView } from "../io/api-biliplus-view";
import { apiViewDetail, ApiViewDetail } from "../io/api-view-detail";
import menuConfig from '../json/sort.txt';
import toview from '../json/toview.json';
import { addCss } from "../utils/element";
import { objUrl, urlObj } from "../utils/format/url";
import { propertyHook } from "../utils/hook/method";
import { jsonpHook } from "../utils/hook/node";
import { webpackHook } from "../utils/hook/webpack";
import { xhrHook } from "../utils/hook/xhr";
import { poll } from "../utils/poll";
import { Scrollbar } from "../utils/scrollbar";
import { PageBangumi } from "./bangumi";
import { Header } from "./header";
import { Page } from "./page";

export class PageAV extends Page {
    /** 销毁标记，当前已不是av页，部分回调禁止生效 */
    protected destroy = false;
    protected like: Like;
    protected webpackJsonp = true;
    protected get aid() {
        return BLOD.aid;
    }
    protected set aid(v) {
        BLOD.aid = v;
    }
    constructor() {
        super(html);
        location.href.replace(/av\d+/i, d => this.aid = <any>d.slice(2));
        new Comment();
        this.like = new Like();
        propertyHook(window, '__INITIAL_STATE__', undefined);
        propertyHook(window, '__playinfo__', undefined);
        location.href.includes("/s/video") && urlCleaner.updateLocation(location.href.replace("s/video", "video"));
        this.enLike();
        this.aidLostCheck();
        // this.biliUIcomponents();
        this.favCode();
        this.tagTopic();
        this.menuConfig();
        this.ancientHeader();
        this.hyperLink();
        this.embedPlayer();
        this.elecShow();
        this.biliUIcomponents();
        this.crumbFirstLink();
        Header.primaryMenu();
        Header.banner();
        this.updateDom();
    }
    /**
     * 暴露UI组件
     * 717 -> video.b1b7706abd590dd295794f540f7669a5d8d978b3.js
     * .onCoinSuccess(n)   页面变为已投币n枚的状态
     * .onFollow()         变为已关注状态
     * .favSubmit(bool)    设置收藏状态，参数bool: true -> “已收藏”状态 false -> 未收藏状态
     */
    protected biliUIcomponents() {
        webpackHook(717, 274, (code: string) => code
            .replace("this.getAdData()", "this.getAdData")
            .replace('ut.MenuConfig[e].name', 'ut.MenuConfig[e].name,url:ut.MenuConfig[e].url,subUrl: ut.MenuConfig[e].sub[a].url')
        );
    }
    /** 修复分区列表 */
    protected crumbFirstLink() {
        webpackHook(717, 271, (code: string) => code
            .replace(/breadCrumbFirstLink:[\S\s]+?breadCrumbSecondName:/, 'breadCrumbFirstLink:function() {return this.breadcrumb.url},breadCrumbSecondName:')
            .replace(/breadCrumbSecondLink:[\S\s]+?coined:/, 'breadCrumbSecondLink:function() {return this.breadcrumb.subUrl},coined:')
        );
    }
    /**
     * 修复：收藏视频时，在“添加到收藏夹”弹窗中，如果将视频从收藏夹A删除，并同时添加到收藏夹B，点击确定后窗口不消失的问题
     * @example
     * // 报错原因示意：
     * jQuery.when(deferredA,deferredB).done((resultA,resultB) => {
     *      let codeA = resultA[0].code; // Cannot read property 'code' of undefined
     *      let codeA = resultA.code;    // 本应该写成这样
     * })
     */
    protected favCode() {
        webpackHook(717, 251, (code: string) => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
    }
    /** 修复：视频标签链接（tag -> topic） */
    protected tagTopic() {
        webpackHook(717, 660, code => code.replace('tag/"+t.info.tag_id+"/?pagetype=videopage', 'topic/"+t.info.tag_id+"/?pagetype=videopage'));
    }
    /** 修复：视频分区 */
    protected menuConfig() {
        webpackHook(717, 100, code => code.replace(/MenuConfig[\S\s]+?LiveMenuConfig/, `MenuConfig=${menuConfig},e.LiveMenuConfig`));
    }
    /** 移除上古顶栏 */
    protected ancientHeader() {
        webpackHook(717, 609, () => `()=>{}`);
    }
    /** 修复：超链接跳转 */
    protected hyperLink() {
        webpackHook(717, 2, code => code.replace("av$1</a>')", `av$1</a>').replace(/(?!<a[^>]*>)cv([0-9]+)(?![^<]*<\\/a>)/ig, '<a href="//www.bilibili.com/read/cv$1/" target="_blank" data-view="$1">cv$1</a>').replace(/(?!<a[^>]*>)(bv1)(\\w{9})(?![^<]*<\\/a>)/ig, '<a href="//www.bilibili.com/video/bv1$2/" target="_blank">$1$2</a>')`).replace("http://acg.tv/sm", "https://www.nicovideo.jp/watch/sm"));
    }
    /**
     * 添加：播放器启动代码
     * 无`__INITIAL_STATE__`启动
     */
    protected embedPlayer() {
        webpackHook(717, 286, code => code.replace('e("setVideoData",t)', `e("setVideoData",t);$("#bofqi").attr("id","__bofqi").html('<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>');new Function('EmbedPlayer',t.embedPlayer)(window.EmbedPlayer);`));
    }
    /** 跳过充电鸣谢 */
    protected elecShow() {
        if (user.userStatus!.elecShow) {
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
    /** 检查页面是否失效及bangumi跳转 */
    protected aidLostCheck() {
        jsonpHook("api.bilibili.com/x/web-interface/view/detail", undefined, (res, r, call) => {
            if (0 !== res.code) {
                const obj = urlObj(r);
                if (obj.aid) {
                    this.aid = <number>obj.aid;
                    this.getVideoInfo().then(d => call(d)).catch(() => call(res));
                    return true
                }
            } else {
                if (res.data && res.data.View) {
                    const response = `{ "code": 0, "message": "0", "ttl": 1, "data": ${JSON.stringify(res.data.View.stat)} }`;
                    xhrHook.async('/x/web-interface/archive/stat?', undefined, async () => {
                        // 原接口被429，使用本处数据替代
                        return { response, responseText: response, responseType: 'json' };
                    });
                    Promise.resolve().then(() => {
                        user.userStatus!.staff && res.data.View.staff && this.staff(res.data.View.staff);
                    });
                    if (user.userStatus!.ugcSection && res.data.View.ugc_season) {
                        this.ugcSection(res.data.View.ugc_season, res.data.View.owner);
                    }
                    // 记录视频数据
                    videoInfo.aidDatail(res.data.View);
                }
            }
        }, false);
    }
    /** 通过其他接口获取aid数据 */
    protected async getVideoInfo() {
        const msg = toast.list(`av${this.aid}可能无效，尝试其他接口 >>>`);
        try {
            const card = await apiArticleCards({ av: this.aid });
            if (card[`av${this.aid}`]) {
                if (card[`av${this.aid}`].redirect_url) {
                    msg.push(`> bangumi重定向：${card[`av${this.aid}`].redirect_url}`);
                    msg.type = 'warning';
                    setTimeout(() => {
                        urlCleaner.updateLocation(card[`av${this.aid}`].redirect_url!);
                        new PageBangumi(); // 跳转Bangumi
                        BLOD.flushToast();
                        this.destroy = true;
                        msg.delay = 4;
                    }, 100);
                    return new ApiViewDetail(); // 必须先返回，否则超时跳转404
                }
            }
            const view = await new apiBiliplusView(this.aid).toDetail();
            if (view?.data.View.season) {
                msg.push(`> bangumi重定向：${(<any>view).data.View.season.ogv_play_url}`);
                msg.type = 'warning';
                view.data.View.season = undefined;
                setTimeout(() => {
                    urlCleaner.updateLocation(card[`av${this.aid}`].redirect_url!);
                    new PageBangumi(); // 跳转Bangumi
                    BLOD.flushToast();
                    this.destroy = true;
                    msg.delay = 4;
                }, 100);
                return new ApiViewDetail();
            }
            setTimeout(() => {
                videoInfo.aidDatail(view.data.View); // 记录视频数据
                msg.push('> 获取缓存数据成功！但这可能是个失效视频！');
                msg.type = 'success';
                msg.delay = 4;
            }, 100);
            return view;
        } catch (e) {
            msg.push('> 获取数据出错！', <any>e);
            msg.type = 'error';
            msg.delay = 4;
            throw e;
        }
    }
    /** 合作UP */
    protected staff(staff: IStaf[]) {
        poll(() => document.querySelector<HTMLDivElement>("#v_upinfo"), node => {
            let fl = '<span class="title">UP主列表</span><div class="up-card-box">';
            fl = staff.reduce((s, d) => {
                s = s + `<div class="up-card">
                    <a href="//space.bilibili.com/${d.mid}" data-usercard-mid="${d.mid}" target="_blank" class="avatar">
                    <img src="${d.face}@48w_48h.webp" /><!---->
                    <span class="info-tag">${d.title}</span><!----></a>
                    <div class="avatar">
                    <a href="//space.bilibili.com/${d.mid}" data-usercard-mid="${d.mid}" target="_blank" class="${(d.vip && d.vip.status) ? 'name-text is-vip' : 'name-text'}">${d.name}</a>
                    </div></div>`
                return s;
            }, fl) + `</div>`;
            node.innerHTML = fl;
            addCss(cssUplist, "up-list");
            const box = node.querySelector<HTMLElement>('.up-card-box');
            box && new Scrollbar(box, true, false);
        });
    }
    /** 合集（使用播单模拟） */
    protected ugcSection(season: Record<string, any>, owner: any) {
        toview.cover = season.cover;
        toview.count = season.ep_count;
        toview.id = season.id;
        toview.description = season.intro;
        toview.mid = season.mid;
        toview.type = season.season_type;
        toview.state = season.sign_state;
        toview.stat.favorite = season.stat.fav;
        toview.stat.reply = season.stat.reply;
        toview.stat.share = season.stat.share;
        toview.stat.view = season.stat.view;
        toview.pid = -1 // 隐藏播单号
        toview.list = season.sections.reduce((s: any[], d: any) => {
            d.episodes.forEach((d: any) => {
                s.push({
                    aid: d.aid,
                    attribute: d.attribute,
                    cid: d.cid,
                    copyright: d.arc.copyright,
                    ctime: d.arc.ctime,
                    desc: d.arc.desc,
                    dimension: d.arc.dimension,
                    duration: d.arc.duration,
                    dynamic: d.arc.dynamic,
                    owner,
                    pages: [d.page],
                    pic: d.arc.pic,
                    pubdate: d.arc.pubdate,
                    rights: d.arc.rights,
                    stat: d.arc.stat,
                    state: d.arc.state,
                    tid: d.arc.type_id,
                    title: d.title,
                    tname: '',
                    videos: 1,
                })
            });
            return s;
        }, []);
        player.addModifyArgument(args => {
            if (this.destroy) return;
            const obj = urlObj(`?${args[2]}`);
            obj.playlist = encodeURIComponent(JSON.stringify({ code: 0, data: toview, message: "0", ttl: 1 }));
            args[2] = objUrl('', obj);
        });
        propertyHook(window, 'callAppointPart', this.callAppointPart);
        // 修正播单列表高度
        addCss('.bilibili-player .bilibili-player-auxiliary-area .bilibili-player-playlist .bilibili-player-playlist-playlist {height: calc(100% - 45px);}.bilibili-player-playlist-nav-title,.bilibili-player-playlist-nav-ownername{display: none;}');
    }
    /** hook合集切p回调 */
    protected callAppointPart = (p: number, state: Record<'aid' | 'cid', number>) => {
        if (this.destroy) return Reflect.deleteProperty(window, 'callAppointPart');
        const vue = document.querySelector<any>("#app")?.__vue__;
        if (vue) {
            // 评论和标签通过修改组件aid刷新
            vue.$store.state.aid = state.aid;
            // 简介, 标题, 视频统计
            apiViewDetail(state.aid)
                .then(d => {
                    vue.setVideoData(d.View);
                    // 下方视频推荐
                    document.querySelector<any>('#recommend_report')?.__vue__.init(d.Related);
                    // 标签
                    document.querySelector<any>('#v_tag').__vue__.$data.tags = d.Tags;
                    // 记录视频数据
                    videoInfo.aidDatail(d.View);
                })
                .catch(e => {
                    toast.error('更新视频信息失败', e)();
                })
                .finally(() => {
                    history.pushState(history.state, '', `/video/av${state.aid}`);
                });
        }
    }
    /** 点赞功能 */
    protected enLike() {
        if (user.userStatus!.like) {
            poll(() => document.querySelector<HTMLSpanElement>('#viewbox_report > div.number > span.u.coin'), d => {
                if (this.destroy) return this.like.remove();
                d.parentElement?.insertBefore(this.like, d);
                addCss('.video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}', 'ulike-av');
            });
            const destroy = videoInfo.bindChange(v => {
                if (this.destroy) {
                    destroy();
                    return this.like.remove();
                }
                this.like.likes = v.stat?.like!;
                this.like.init();
            })
        }
    }
}
