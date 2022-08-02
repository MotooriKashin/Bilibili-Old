import { doWhile } from "../../runtime/do_while";
import { createElements } from "../../runtime/element/create_element";
import { appendScripts } from "../../runtime/element/create_scripts";
import { htmlVnode } from "../../runtime/element/html_vnode";
import { replaceUrl } from "../../runtime/url_clean";
import { globalVector } from "../global";
import script from "./script.html";
import html from "./search.html";
import { keepNewCheck } from "../av/keep_new";
import { loadEvent } from "../av/load_event";

export function searchPage() {
    // 重写检查
    keepNewCheck();
    // 备份标题
    const title = document.title;
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
    appendScripts(script).then(loadEvent);
    // 全局入口
    globalVector();
}