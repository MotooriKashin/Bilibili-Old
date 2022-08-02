import script from "./script.html";
import html from "./ranking.html";
import { addCss } from "../../runtime/element/add_element";
import { createElements } from "../../runtime/element/create_element";
import { appendScripts } from "../../runtime/element/create_scripts";
import { htmlVnode } from "../../runtime/element/html_vnode";
import { jsonphook } from "../../runtime/hook/node";
import { replaceUrl } from "../../runtime/url_clean";
import { primaryMenu, banner } from "../banner";
import { globalVector } from "../global";
import { keepNewCheck } from "../av/keep_new";
import { loadEvent } from "../av/load_event";

export function rankingPage() {
    // 重写检查
    keepNewCheck();
    // 备份标题
    const title = document.title;
    // 刷新样式表
    document.documentElement.replaceWith(createElements(htmlVnode(html)));
    // 还原标题
    title && !title.includes("404") && (document.title = title);
    // 还原旧版排行榜URL 原生脚本赖以初始化
    replaceUrl(/ranking/.test(document.referrer) ? document.referrer : "https://www.bilibili.com/ranking");
    // 三日接口以外过期
    jsonphook(["api.bilibili.com/x/web-interface/ranking", "arc_type=0"], d => d.replace(/day=\d+/, "day=3"), undefined, false);
    // 禁用__INITIAL_STATE__干扰
    Object.defineProperty(window, "__INITIAL_STATE__", { configurable: true, value: undefined });
    // 启动原生脚本
    appendScripts(script).then(loadEvent);
    // 高分辨率屏修补
    addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
    // 顶栏分区修正
    primaryMenu();
    // 顶栏banner修复
    banner();
    // 全局入口
    globalVector();
}