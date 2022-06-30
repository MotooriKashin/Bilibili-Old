import { debug } from "./debug";

/**
 * 【内容脚本】申请更新 declarativeNetRequest 会话规则表
 * @param rules 规则集
 */
export function sendSessionRules(rules?: any[]) {
    chrome.runtime.sendMessage({
        $type: "updateSessionRules",
        data: rules
    }).catch(e => debug.error(e))
}