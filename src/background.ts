import { updateSessionRules } from "./include/updateSessionRules.js";
import { SETTING } from "./include/setting.js";
import { chromeCookies } from "./include/cookie.js";

// 初始化设置
chrome.storage.local.get(SETTING).then(setting => {
    // 更新 declarativeNetRequest 静态规则集
    const updateRulesetOptions = Object.entries(setting).reduce((s, d) => {
        switch (d[0]) {
            case "report": d[1] ? s.enableRulesetIds.push("report") : s.disableRulesetIds.push("report");
                break;
        }
        return s;
    }, <Required<chrome.declarativeNetRequest.UpdateRulesetOptions>>{ disableRulesetIds: [], enableRulesetIds: [] });
    chrome.declarativeNetRequest.updateEnabledRulesets(updateRulesetOptions);

    // 保存设置
    chrome.storage.local.set(setting);
});

// 消息接收
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
                            index: message.data.index
                        })
                    }, d => {
                        sender.tab?.id && chrome.tabs.sendMessage(sender.tab.id, {
                            $type: "xhrGMResponse",
                            reject: d,
                            index: message.data.index
                        })
                    })
                break;
            case "getCookies":
                chromeCookies(message.data.url).then(d => {
                    sender.tab?.id && chrome.tabs.sendMessage(sender.tab.id, {
                        $type: "cookiesResponse",
                        resolve: d,
                        index: message.data.index
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