import { sendSessionRules } from "./runtime/content/session_rule";
import { debug } from "./runtime/debug";
import th from "./rules/th.json";
import { replaceUrl, urlClean } from "./runtime/url_clean";
import { sessionStorage } from "./runtime/storage";
import SETTING_DEFAULT from "./runtime/chrome/setting.json";

// 初始化设置数据
chrome.storage.local.get().then(({ setting }) => {
    setting || (setting = SETTING_DEFAULT, chrome.storage.local.set({ setting }));
    sessionStorage.setItem("setting", setting);
});
// 监听设置变动
chrome.storage.onChanged.addListener((changes, areaName) => {
    areaName === "local" && chrome.storage.local.get().then(({ setting }) => {
        sessionStorage.setItem("setting", setting);
    });
})
// 监听来自拓展的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof message === "object") {
        switch (message.$type) {
            case "xhrGMResponse":
                window.postMessage(message);
                break;
            case "cookiesResponse":
                window.postMessage(message);
                break;
        }
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
            case "executeScript": // 载入样式文件
                chrome.runtime.sendMessage({
                    $type: "executeScript",
                    data: {
                        world: "MAIN",
                        files: ev.data.data,
                        injectImmediately: true
                    }
                }).catch(e => debug.error(e))
                break;
            case "xhrGM": // 跨域请求
                chrome.runtime.sendMessage({
                    $type: "xhrGM",
                    data: ev.data.data
                })
                break;
            case "setValue": // 储存数据
                chrome.storage.local.set(ev.data.data);
                break;
            case "getValue": // 读取存储
                chrome.storage.local.get().then(d => {
                    window.postMessage({
                        $type: "getValueResponse",
                        resolve: Reflect.has(d, ev.data.data.key) ? d[ev.data.data.key] : ev.data.data.def,
                        flag: ev.data.data.flag,
                        index: ev.data.data.index
                    })
                })
                break;
            case "deleteValue": // 移除存储
                chrome.storage.local.remove(ev.data.data);
                break;
            case "getCookies": // 读取cookie
                chrome.runtime.sendMessage({
                    $type: "getCookies",
                    data: ev.data.data
                })
                break;
            case "th": // 泰区规则集
                sendSessionRules(th);
                break;
        }
    }
});

// 匹配B站域名
if (location.host.includes("bilibili.com")) {
    // 网址清理
    replaceUrl(urlClean(location.href));
    // 页面卸载
    window.addEventListener("beforeunload", () => {
        // 清空已应用规则
        sendSessionRules();
    });
}
// 暴露拓展ID
sessionStorage.setItem("bilibili-old", chrome.runtime.id);