import { loadScript } from "../../runtime/element/addElement";
import { createElements } from "../../runtime/element/createElement";
import { htmlVnode } from "../../runtime/element/htmlVnode";
import html from "./search.html";

// 备份标题
const title = document.title;
// 清理样式表
Array.from(document.styleSheets).forEach(d => d.disabled = true);
// 刷新样式表
document.documentElement.replaceWith(createElements(htmlVnode(html)));
// 还原标题
title && !title.includes("404") && (document.title = title);
// 降级内容脚本
loadScript(chrome.runtime.getURL("content/search/userscript.js"));
// 监听页面重定向
window.addEventListener("beforeunload", () => {
    // 注销针对性请求拦截
    chrome.runtime.sendMessage({
        $type: "updateSessionRules"
    }).catch(e => console.error(e))
});