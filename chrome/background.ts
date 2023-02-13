import { getCookie } from "./utils/cookie";
import { updateSessionRules } from "./utils/session-rule";

// 注册时机始终是个问题，改道由内容脚本发起吧
// chrome.windows.onCreated.addListener(() => {
//     chrome.scripting.getRegisteredContentScripts().then(d => {
//         d.map(d => d.id).includes('main') || chrome.scripting.registerContentScripts([
//             {
//                 id: 'main',
//                 allFrames: true,
//                 runAt: "document_start",
//                 world: "MAIN",
//                 js: ['main.js'],
//                 matches: ['*://*.bilibili.com/*']
//             }
//         ]);
//     });
// });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.tab && typeof message === "object") {
        switch (message.$type) {
            case 'xmlHttpRequest':
                fetch(message.data.input, message.data.init)
                    .then(async d => {
                        return {
                            status: d.status,
                            statusText: d.statusText,
                            url: d.url,
                            redirected: d.redirected,
                            type: d.type,
                            data: Array.from(new Uint8Array(await d.arrayBuffer())) // JSON-serializable
                        };
                    })
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }))
                return true;
            case 'cookie':
                getCookie(message.data)
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }))
                return true;
            case 'executeScript':
                chrome.scripting.executeScript(Object.assign(message.data, {
                    target: {
                        tabId: sender.tab.id,
                        frameIds: [sender.frameId]
                    }
                }))
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                break;
            case 'insertCSS':
                chrome.scripting.executeScript(Object.assign(message.data, {
                    target: {
                        tabId: sender.tab.id,
                        frameIds: [sender.frameId]
                    }
                }))
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                break;
            case "updateRulesetOptions": // 更新静态规则
                chrome.declarativeNetRequest.updateEnabledRulesets(message.data)
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                break;
            case "updateSessionRules": // 更新会话规则 data不存在表示移除对应标签页的规则
                updateSessionRules(sender.tab.id!, message.data)
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                break;
            default:
                break;
        }
    }
});