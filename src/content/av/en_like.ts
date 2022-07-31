import { debug } from "../../runtime/debug";
import { doWhile } from "../../runtime/do_while";
import { addCss } from "../../runtime/element/add_element";
import { unitFormat } from "../../runtime/format/unit";
import { getCookies } from "../../runtime/cookies";
import { switchVideo } from "../../runtime/switch_video";
import { toast } from "../../runtime/toast/toast";
import { biliQuickLogin, jsonCheck } from "../../runtime/unit";
import { uid } from "../../runtime/variable/uid";
import { xhr } from "../../runtime/xhr";
import dislike from "../../images/svg/dislike.svg";
import like from "../../images/svg/like.svg";
import { API } from "../../runtime/variable/variable";

export class enLike {
    /** aid备份 */
    aid: number = <any>undefined;
    /** 锚节点 */
    coin: HTMLElement = <any>undefined;
    span: HTMLSpanElement = <any>undefined;
    /** 点赞了吗？ */
    liked = false;
    /** 点赞数 */
    number = 0;
    /** 页面类型 */
    type?: "bangumi" | "watchlater";
    /** 未点赞图标 */
    svgLike = dislike;
    /** 已点赞图标 */
    svgEnLike = like;
    constructor(type?: "bangumi" | "watchlater", num = 0) {
        this.type = type;
        this.number = num;
        doWhile(() => { // 目标节点存在后才初始化
            this.coin = type === "watchlater" ? document.querySelector<any>(".u.coin") : document.querySelector<any>("[report-id*=coin]");
            return this.coin && API.aid;
        }, () => this.init())
    }
    init() {
        this.style();
        this.aid = API.aid;
        this.span = document.createElement("span");
        this.span.classList.add("ulike");
        (<any>this).coin.parentElement.insertBefore(this.span, this.coin);
        this.changeLiked();
        this.span.addEventListener("click", () => this.setLike());
        switchVideo(() => this.switch());
        try {
            !this.number && xhr({ // 获取点赞数
                url: `https://api.bilibili.com/x/web-interface/view?aid=${API.aid}`,
                credentials: true,
                responseType: "json"
            }, true).then(d => {
                this.number = jsonCheck(d).data.stat.like;
                this.changeLiked();
            })
            uid && xhr({ // 获取点赞了吗？
                url: `https://api.bilibili.com/x/web-interface/archive/has/like?aid=${API.aid}`,
                credentials: true,
                responseType: "json"
            }).then(d => {
                d = jsonCheck(d).data;
                d === 1 && (this.liked = true, this.changeLiked());
            })
        } catch (e) {
            toast.error("点赞失败！");
            debug.error("点赞失败！", e);
        }
    }
    /** 修补样式 */
    style() {
        let style = `.ulike {cursor: pointer;}.ulike svg{vertical-align: middle;margin-right: 10px;}`;
        switch (this.type) {
            case "bangumi": style += `.ulike {margin-left: 15px;position: relative;float: left;height: 100%;line-height: 18px;font-size: 12px;color: #222;}`;
                break;
            case "watchlater": style += `.video-info-module .number .ulike {margin-left: 15px;margin-right: 5px;}`;
                break;
            default: style += `.video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}`;
        }
        addCss(style);
    }
    /** 点赞响应 */
    setLike() {
        if (uid) {
            const like = this.liked ? 2 : 1;
            xhr({
                url: "https://api.bilibili.com/x/web-interface/archive/like",
                method: "POST",
                data: `aid=${API.aid}&like=${like}&csrf=${getCookies().bili_jct}`,
                credentials: true,
                responseType: "json"
            }).then(d => {
                jsonCheck(d).ttl;
                this.liked = !this.liked;
                this.number = this.liked ? this.number + 1 : this.number - 1;
                this.changeLiked();
            })
        } else {
            toast.warning("请先登录 щ(ʘ╻ʘ)щ");
            biliQuickLogin();
        }
    }
    /** 图标及数目变化 */
    changeLiked() {
        this.span.innerHTML = `${this.liked ? this.svgEnLike : this.svgLike}</i>点赞 ${unitFormat(this.number) || "--"}`;
    }
    /** 切p后刷新数据 */
    switch() {
        if (this.aid != API.aid) {
            this.aid = API.aid;
            xhr({
                url: `https://api.bilibili.com/x/web-interface/view?aid=${API.aid}`,
                credentials: true,
                responseType: "json"
            }).then(d => {
                this.number = jsonCheck(d).data.stat.like;
                this.changeLiked();
            })
        }
    }
}