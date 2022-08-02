import { createElements } from "../../runtime/element/create_element";
import { appendScripts } from "../../runtime/element/create_scripts";
import { htmlVnode } from "../../runtime/element/html_vnode";
import { xhrhook } from "../../runtime/hook/xhr";
import { loadVideoScript } from "../../runtime/player/embed_player";
import { setting } from "../../runtime/setting";
import { enLike } from "../av/en_like";
import { loadByDmId } from "../av/load_by_dm_id";
import { primaryMenu, banner } from "../banner";
import { loadComment } from "../comment";
import { globalVector } from "../global";
import script from "./script.html";
import html from "./watchlater.html";
import { keepNewCheck } from "../av/keep_new";
import { loadEvent } from "../av/load_event";

export function watchlaterPage() {
    // 重写检查
    keepNewCheck();
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
    // 修正直播错误
    xhrhook("api.live.bilibili.com/bili/living_v2/", undefined, r => { r.response = r.responseText = ` ${r.response}` }, false);
    // 加载原生脚本
    appendScripts(script).then(loadEvent);
    // 修复评论视频跳转接口
    (<any>window).commentAgent = { seek: (t: number) => (<any>window).player && (<any>window).player.seek(t) };
    // 添加点赞功能
    setting.enlike && new enLike("watchlater");
    // 顶栏分区修正
    primaryMenu();
    // 顶栏banner修复
    banner();
    // 弹幕ID跳转
    loadByDmId();
    // 全局入口
    globalVector();
}