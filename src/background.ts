import { chromeCookies } from "./runtime/chrome/cookie";
import { changeSetting, initSetting } from "./runtime/chrome/setting";
import { updateSessionRules } from "./runtime/chrome/update_session_rules";

// 安装扩展
chrome.management.onInstalled.addListener(i => {
    initSetting();
});
// 创建浏览器窗口
chrome.windows.onCreated.addListener(w => {
    initSetting();
});
// 存储发生变化
chrome.storage.onChanged.addListener((changes, areaName) => {
    changeSetting();
})

// 消息传递，响应内容脚本提权操作
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof message === "object") {
        switch (message.$type) {
            case "insertCSS":  // 注入样式文件
                sender.tab?.id && chrome.scripting.insertCSS(Object.assign(message.data, {
                    target: {
                        tabId: sender.tab.id,
                        frameIds: [sender.frameId]
                    }
                }))
                break;
            case "executeScript": // 注入内容脚本
                sender.tab?.id && chrome.scripting.executeScript(Object.assign(message.data, {
                    target: {
                        tabId: sender.tab.id,
                        frameIds: [sender.frameId]
                    }
                }))
                break;
            case "updateRulesetOptions": // 更新静态规则
                chrome.declarativeNetRequest.updateEnabledRulesets(message.data);
                break;
            case "updateSessionRules": // 更新会话规则 data不存在表示移除对应标签页的规则
                updateSessionRules(<number>sender.tab?.id, message.data);
                break;
            case "xhrGM":
                fetch(message.data.input, message.data.init)
                    .then(d => d.text())
                    .then(d => {
                        sender.tab?.id && chrome.tabs.sendMessage(sender.tab.id, {
                            $type: "xhrGMResponse",
                            resolve: d,
                            index: message.data.index,
                            flag: message.data.flag
                        })
                    }, d => {
                        sender.tab?.id && chrome.tabs.sendMessage(sender.tab.id, {
                            $type: "xhrGMResponse",
                            reject: d,
                            index: message.data.index,
                            flag: message.data.flag
                        })
                    })
                break;
            case "getCookies":
                chromeCookies(message.data.url).then(d => {
                    sender.tab?.id && chrome.tabs.sendMessage(sender.tab.id, {
                        $type: "cookiesResponse",
                        resolve: d,
                        index: message.data.index,
                        flag: message.data.flag
                    })
                })
                break;
        }
    }
});
// 窗口关闭
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // 移除关联会话规则集
    updateSessionRules(tabId);
});
