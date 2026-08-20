import { error, log } from './utils/debug';
import './slogan';

// 安装事件
browser.runtime.onInstalled.addListener(async () => {
    // 直播
    registerContentScripts('live', ['main/live/index.js'], ['*://live.bilibili.com/*'], undefined, 'MAIN');
    // av页
    registerContentScripts('av', ['main/av/index.js'], ['*://*.bilibili.com/video/*'], undefined, 'MAIN');
    // 移除后台脚本发送的请求头
    const extensionId = browser.runtime.id;
    const id = await getNextRuleId();
    browser.runtime.onInstalled.addListener(() => {
        browser.declarativeNetRequest.updateDynamicRules({
            addRules: [
                {
                    id,
                    action: {
                        type: 'modifyHeaders',
                        requestHeaders: [
                            { header: 'Origin', operation: 'remove' },
                            { header: 'Referer', operation: 'remove' }
                        ]
                    },
                    condition: {
                        // 仅匹配由当前扩展发起的请求
                        initiatorDomains: [extensionId],
                        // 覆盖 fetch 和 XHR
                        resourceTypes: ['xmlhttprequest', 'ping', 'websocket']
                    }
                }
            ]
        });
    });
});

/**
 * 注册内容脚本
 * 
 * @param id 内容脚本的 ID。
 * @param js 要注入到匹配页面的扩展包中的 JavaScript 文件的路径。将按照数组中的顺序注入脚本。
 * @param matches 内容脚本将要注入的页面。
 * @param excludeMatches 此内容脚本排除而不注入的页面列表。
 */
export function registerContentScripts(
    id: string,
    js: string[],
    matches: string[],
    excludeMatches?: string[],
    world?: `${browser.scripting.ExecutionWorld}`
) {
    browser.scripting.registerContentScripts([{
        id,
        js,
        matches,
        excludeMatches,
        runAt: 'document_start',
        allFrames: true,
        world,
    }]).then(() => {
        log('注册内容脚本：', ...js);
    }).catch(e => {
        error('注册内容脚本失败：', ...js, e);
    });
}

/**
 * 动态寻找一个当前未被使用的 Rule ID
 */
async function getNextRuleId() {
    const activeRules = await browser.declarativeNetRequest.getSessionRules();
    const usedIds = new Set(activeRules.map(r => r.id));

    let id = 1;
    while (usedIds.has(id)) {
        id++;
    }
    return id;
}

// 消息传递
browser.runtime.onMessage.addListener(async ({ type, payload }, { tab }) => {
    switch (type) {
        case 'ENABLE_CORS_FOR_URL': {
            const id = await getNextRuleId();
            const corsRule = { ...payload.corsRule, id }
            await browser.declarativeNetRequest.updateSessionRules({
                addRules: [corsRule],
            });
            return id;
        }
        case 'DISABLE_CORS_RULE': {
            await browser.declarativeNetRequest.updateSessionRules({
                removeRuleIds: [payload.ruleId],
            });
            return;
        }
        case 'SIDE_PANEL_SET_OPTIONS': {
            if (tab?.id) {
                await browser.sidePanel.setOptions({
                    path: payload.path,
                    tabId: tab.id,
                    enabled: true,
                });
                return true;
            }
            return false;
        }
    }
    return;
});

// 启用侧边栏
browser.action.onClicked.addListener(async ({ url, id: tabId }) => {
    if (url && tabId) {
        browser.sidePanel.open({ tabId }).catch(() => { });
    }
});