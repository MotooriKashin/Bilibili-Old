import { debug } from "../debug";

/**
 * 【内容脚本】申请更新 declarativeNetRequest 会话规则表
 * @param rules 规则集
 */
export function sendSessionRules(rules?: any[]) {
    // 有规则添加规则
    rules && rules.forEach(d => {
        // 为每条规则随机唯一id
        d.id = Math.ceil(Math.random() * 1e8);
    });
    chrome.runtime.sendMessage({
        $type: "updateSessionRules",
        data: rules
    }).catch(e => debug.error(e))
}