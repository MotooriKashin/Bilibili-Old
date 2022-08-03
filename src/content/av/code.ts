import { createElements } from "../../runtime/element/create_element";
import { htmlVnode } from "../../runtime/element/html_vnode";
import { jsonphookasync } from "../../runtime/hook/node";
import { webpackhook } from "../../runtime/hook/webpack_jsonp";
import { loadVideoScript } from "../../runtime/player/embed_player";
import { setting } from "../../runtime/setting";
import { loadComment } from "../comment";
import html from "./av.html";
import script from "./script.html";
import menuConfig from "./menu_config.txt";
import { appendScripts } from "../../runtime/element/create_scripts";
import { enLike } from "./en_like";
import { avLostCheck } from "./av_lost_check";
import { banner, primaryMenu } from "../banner";
import { loadByDmId } from "./load_by_dm_id";
import { replaceUrl } from "../../runtime/url_clean";
import { globalVector } from "../global";
import { keepNewCheck } from "./keep_new";
import { loadEvent } from "./load_event";

export function avPage() {
    // 重写检查
    keepNewCheck();
    // 重定向SEO页面
    location.href.includes("/s/video") && replaceUrl(location.href.replace("/s/video", "/video"));
    // 备份标题
    const title = document.title;
    // 刷新样式表
    document.documentElement.replaceWith(createElements(htmlVnode(html)));
    // 还原标题
    title && !title.includes("404") && (document.title = title);
    // 加载播放器脚本
    loadVideoScript();
    // 评论脚本
    loadComment();
    // 717 -> video.b1b7706abd590dd295794f540f7669a5d8d978b3.js
    // 暴露UI组件
    // .onCoinSuccess(n)   页面变为已投币n枚的状态
    // .onFollow()         变为已关注状态
    // .favSubmit(bool)    设置收藏状态，参数bool: true -> “已收藏”状态 false -> 未收藏状态
    webpackhook(717, 274, (code: string) => code.replace("init:function(){", "init:function(){window.biliUIcomponents=this;").replace("this.getAdData()", "this.getAdData"));
    // 修复：收藏视频时，在“添加到收藏夹”弹窗中，如果将视频从收藏夹A删除，并同时添加到收藏夹B，点击确定后窗口不消失的问题
    /* 报错原因示意：
        jQuery.when(deferredA,deferredB).done((resultA,resultB) => {
            let codeA = resultA[0].code; // Cannot read property 'code' of undefined
            let codeA = resultA.code;    // 本应该写成这样
        })
    */
    webpackhook(717, 251, (code: string) => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
    // 修复：视频标签链接
    // tag -> topic
    webpackhook(717, 660, code => code.replace('tag/"+t.info.tag_id+"/?pagetype=videopage', 'topic/"+t.info.tag_id+"/?pagetype=videopage'));
    // 修复：视频分区
    webpackhook(717, 100, code => code.replace(/MenuConfig[\S\s]+?LiveMenuConfig/, `MenuConfig=${menuConfig},e.LiveMenuConfig`));
    // 修复：移除上古顶栏
    webpackhook(717, 609, () => `()=>{}`);
    // 修复：BV/cv -> 超链接
    webpackhook(717, 2, code => code.replace("av$1</a>')", `av$1</a>').replace(/(?!<a[^>]*>)cv([0-9]+)(?![^<]*<\\/a>)/ig, '<a href="//www.bilibili.com/read/cv$1/" target="_blank" data-view="$1">cv$1</a>').replace(/(?!<a[^>]*>)(bv1)(\\w{9})(?![^<]*<\\/a>)/ig, '<a href="//www.bilibili.com/video/bv1$2/" target="_blank">$1$2</a>')`).replace("http://acg.tv/sm", "https://www.nicovideo.jp/watch/sm"));
    // 添加：播放器启动代码
    // 无`__INITIAL_STATE__`启动
    webpackhook(717, 286, code => code.replace('e("setVideoData",t)', `e("setVideoData",t);$("#bofqi").attr("id","__bofqi").html('<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>');new Function(t.embedPlayer)();`));
    // 跳过充电鸣谢
    setting.automate.electric && jsonphookasync("api.bilibili.com/x/web-interface/elec/show", undefined, async () => { return { code: -404 } }, false);
    // 禁用__INITIAL_STATE__干扰
    Reflect.defineProperty(window, "__INITIAL_STATE__", { configurable: true, value: undefined });
    // 加载原生脚本
    appendScripts(script).then(loadEvent);
    // 点赞
    setting.enlike && new enLike();
    // 深度审查
    avLostCheck();
    // 顶栏修正
    primaryMenu();
    // banner修正
    banner();
    // 弹幕ID跳转
    loadByDmId();
    // 全局入口
    globalVector();
}