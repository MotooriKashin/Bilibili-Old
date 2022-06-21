import { loadScript } from "../../runtime/element/addElement";
import { createElements } from "../../runtime/element/createElement";
import { htmlVnode } from "../../runtime/element/htmlVnode";
import html from "./index.html";

// 清理样式表
Array.from(document.styleSheets).forEach(d => d.disabled = true);
// 刷新样式表
document.documentElement.replaceWith(createElements(htmlVnode(html)));
// 降级内容脚本
loadScript(chrome.runtime.getURL("content/index/userscript.js"));
// 顶栏头像动效
chrome.runtime.sendMessage({
    $type: "insertCSS",
    data: {
        files: ["content/global/avatarAnimation.css"]
    }
}).catch(e => console.error(e))
// 注销针对性请求拦截
window.addEventListener("beforeunload", () => {
    chrome.runtime.sendMessage({
        $type: "updateSessionRules"
    }).catch(e => console.error(e))
});