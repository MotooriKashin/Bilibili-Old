import { anchorClean, AnchorClick, replaceUrl, urlClean } from "../runtime/urlClean";
import section from "../rules/section.json";
import index from "../rules/index.json";
import av from "../rules/av.json";
import bangumi from "../rules/bangumi.json";
import watchlater from "../rules/watchlater.json";
import player from "../rules/player.json";
import playlist from "../rules/playlist.json";
import ranking from "../rules/ranking.json";
import read from "../rules/read.json";
import search from "../rules/search.json";
import th from "../rules/th.json";
import { observerAddedNodes } from "../runtime/nodeObserver";
import { sessionStorage } from "../runtime/storage";
import { debug } from "../runtime/debug";
import { sendSessionRules } from "../runtime/sessionRule";
import { backCompat } from "../runtime/backCompat";
import { executeScript } from "../runtime/executeScript";


// 监听来自拓展的消息（全局启用以避免弹出页面缺乏接收端口）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof message === "object") {
        switch (message.$type) {
            case "xhrGMResponse":
                window.postMessage(message);
                break;
            case "cookiesResponse":
                window.postMessage(message);
                break;
            case "getPageInfo":
                if (location.href.includes("www.bilibili.com")) {
                    // 由于 sendResponse 是只此一次先到先得
                    // 还是先判断一下页面所在域
                    sendResponse({
                        aid: sessionStorage.getItem("aid"),
                        cid: sessionStorage.getItem("cid"),
                        pgc: sessionStorage.getItem("pgc"),
                        playerParam: sessionStorage.getItem("playerParam"),
                        cover: sessionStorage.getItem("cover"),
                        title: sessionStorage.getItem("title")
                    })
                }
                break;
            case "downloadDefault":
            case "localMedia":
            case "onlineDanmaku":
            case "allDanmaku":
                window.postMessage(message)
                break;
        }
    }
})

// 只匹配B站域名
if (location.host.endsWith("bilibili.com")) {
    // 404 怪异模式处理
    const is404 = sessionStorage.getItem("404");
    if (is404) {
        sessionStorage.removeItem("404");
        replaceUrl(is404);
    }

    // 网址清理
    replaceUrl(urlClean(location.href));
    // 路径析分
    const path = location.href.split("/");
    // 页面类型栈
    let pageName: string;
    if (window.self == window.top && path[2] == 'www.bilibili.com') document.domain = "bilibili.com";
    // 重写判定
    switch (true) {
        case (path[2] == 'www.bilibili.com' && (!path[3] || (path[3].startsWith('\?') || path[3].startsWith('\#') || path[3].startsWith('index.')))):
            pageName = "index";
            break;
        case (/(\/s)?\/video\/[AaBb][Vv]/.test(location.href)):
            pageName = "av";
            break;
        case (/\/bangumi\/play\/(ss|ep)/.test(location.href)):
            pageName = "bangumi";
            break;
        case (/\/watchlater/.test(location.href)):
            pageName = "watchlater";
            break;
        case (/player\./.test(location.href) && !location.href.includes("ancient")):
            pageName = "player";
            break;
        case ((/\/medialist\/play\//.test(location.href) && !/watchlater/.test(location.href)) || /\/playlist\/video\/pl/.test(location.href)):
            pageName = "playlist";
            break;
        case (/\/v\/popular\//.test(location.href)):
            pageName = "ranking";
            break;
        case (/\/read\/[Cc][Vv]/.test(location.href)):
            pageName = "read";
            break;
        case (path[2] == "search.bilibili.com"):
            pageName = "search";
            break;
    }

    // 读取设置数据 *只能异步，可能会造成部分功能执行太迟，可也没有别的办法。叹叹！*
    chrome.storage.local.get().then(setting => {
        /** 暴露设置给所有内容脚本以免异步获取 */
        Object.defineProperty(window, "setting", { value: setting });
        sessionStorage.setItem("setting", setting);
        const files: string[] = [];
        switch (pageName) {
            case "index": // 主页
                if (setting[pageName]) {
                    // 追加拦截新版页面资源的 declarativeNetRequest 规则 下同
                    sendSessionRules(index);
                    sendSessionRules(section);
                    executeScript("content/index/index.js");
                } else {
                    executeScript("content/global/global.js");
                }
                break;
            case "av":
                if (setting[pageName]) {
                    sendSessionRules(av);
                    sendSessionRules(section);
                    executeScript("content/av/av.js");
                } else {
                    executeScript("content/global/global.js");
                }
                break;
            case "bangumi":
                if (setting[pageName]) {
                    backCompat();
                    sendSessionRules(bangumi);
                    sendSessionRules(section);
                    executeScript("content/bangumi/bangumi.js");
                } else {
                    executeScript("content/global/global.js");
                }
                break;
            case "watchlater":
                if (setting[pageName]) {
                    sendSessionRules(watchlater);
                    sendSessionRules(section);
                    executeScript("content/watchlater/watchlater.js");
                } else {
                    executeScript("content/global/global.js");
                }
                break;
            case "player":
                if (setting[pageName]) {
                    sendSessionRules(player);
                    sendSessionRules(section);
                    executeScript("content/player/player.js");
                } else {
                    executeScript("content/global/global.js");
                }
                break;
            case "playlist":
                if (setting[pageName]) {
                    sendSessionRules(playlist);
                    sendSessionRules(section);
                    executeScript("content/playlist/playlist.js");
                } else {
                    executeScript("content/global/global.js");
                }
                break;
            case "ranking":
                if (setting[pageName]) {
                    sendSessionRules(ranking);
                    sendSessionRules(section);
                    executeScript("content/ranking/ranking.js");
                } else {
                    executeScript("content/global/global.js");
                }
                break;
            case "read":
                if (setting[pageName]) {
                    sendSessionRules(read);
                    sendSessionRules(section);
                    executeScript("content/read/read.js");
                } else {
                    executeScript("content/global/global.js");
                }
                break;
            case "search":
                if (setting[pageName]) {
                    sendSessionRules(search);
                    sendSessionRules(section);
                    executeScript("content/search/search.js");
                } else {
                    executeScript("content/global/global.js");
                }
                break;
            default: // 未重写页面，用于启动全局默认 userscript
                setting.section && sendSessionRules(section);
                executeScript("content/global/global.js");
                break;
        }
    });
    // 监听来自页面的消息
    window.addEventListener("message", ev => {
        if (typeof ev.data === "object") {
            switch (ev.data.$type) {
                case "insertCSS": // 载入样式文件
                    chrome.runtime.sendMessage({
                        $type: "insertCSS",
                        data: {
                            files: ev.data.data
                        }
                    }).catch(e => debug.error(e))
                    break;
                case "download": // TODO
                    break;
                case "xhrGM":
                    chrome.runtime.sendMessage({
                        $type: "xhrGM",
                        data: ev.data.data
                    })
                    break;
                case "setting":
                    chrome.storage.local.set(ev.data.data);
                case "getCookies":
                    chrome.runtime.sendMessage({
                        $type: "getCookies",
                        data: ev.data.data
                    })
                    break;
                case "th":
                    sendSessionRules(th);
                    break;
            }
        }
    });
    // 网址清理
    // 处理点击事件
    window.addEventListener("click", AnchorClick, !1);
    // 处理右键菜单
    window.addEventListener("contextmenu", AnchorClick, !1);
    // 页面载入完成处理
    document.addEventListener("DOMContentLoaded", () => anchorClean(document.querySelectorAll("a")));
    // 页面卸载
    window.addEventListener("beforeunload", () => {
        // 清空已应用规则
        sendSessionRules();
        // 清理缓存
        sessionStorage.clear();
    })
    // 处理注入的节点
    let timer: number;
    observerAddedNodes((node) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            replaceUrl(urlClean(location.href));
            node.querySelectorAll && anchorClean(node.querySelectorAll("a"));
            node.tagName == "A" && anchorClean(<any>[node]);
        }, 250);
    });

    // 暴露拓展ID
    sessionStorage.setItem("bilibili-old", chrome.runtime.id);
}