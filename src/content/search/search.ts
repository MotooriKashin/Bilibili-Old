import { doWhile } from "../../runtime/doWhile";
import { createElements } from "../../runtime/element/createElement";
import { appendScripts } from "../../runtime/element/createScripts";
import { htmlVnode } from "../../runtime/element/htmlVnode";
import { replaceUrl } from "../../runtime/urlClean";
import script from "./script.html";
import html from "./search.html";

// 备份标题
const title = document.title;
// 清理样式表
Array.from(document.styleSheets).forEach(d => d.disabled = true);
// 刷新样式表
document.documentElement.replaceWith(createElements(htmlVnode(html)));
// 还原标题
title && !title.includes("404") && (document.title = title);

// 无关键词搜索应使用裸origin
doWhile(() => location.href.endsWith('all'), () => {
    replaceUrl(location.origin);
}, 10, 30);
// 禁用__INITIAL_STATE__干扰
Object.defineProperty(window, "__INITIAL_STATE__", { configurable: true, value: undefined });
// 启动原生脚本
appendScripts(script);