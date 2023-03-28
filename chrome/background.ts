import { getCookie } from "./utils/cookie";
import { swFetchHeader } from "./utils/escape-header";
import { updateSessionRules } from "./utils/session-rule";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.tab && typeof message === "object") {
        switch (message.$type) {
            case 'fetch': {
                const [rule, id] = swFetchHeader(message.data.input, message.data.init?.headers);
                chrome.declarativeNetRequest.updateSessionRules({ addRules: [rule] })
                    .then(() => fetch(message.data.input, message.data.init))
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
                    .finally(() => chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [id] }));
                return true;
            }
            case 'cookie': {
                getCookie(message.data)
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }))
                return true;
            }
            case 'executeScript': {
                chrome.scripting.executeScript(Object.assign(message.data, {
                    target: {
                        tabId: sender.tab.id,
                        frameIds: [sender.frameId]
                    }
                }))
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                break;
            }
            case 'insertCSS': {
                chrome.scripting.executeScript(Object.assign(message.data, {
                    target: {
                        tabId: sender.tab.id,
                        frameIds: [sender.frameId]
                    }
                }))
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                break;
            }
            case "updateRulesetOptions": { // 更新静态规则
                chrome.declarativeNetRequest.updateEnabledRulesets(message.data)
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                break;
            }
            case "updateSessionRules": { // 更新会话规则 data不存在表示移除对应标签页的规则
                updateSessionRules(sender.tab.id!, message.data)
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                break;
            }
            case 'removeSessionRules': {
                chrome.declarativeNetRequest.updateSessionRules({
                    removeRuleIds: message.data
                })
                break;
            }
            default:
                break;
        }
    }
});