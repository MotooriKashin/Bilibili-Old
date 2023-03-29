/**
 * 【后台脚本】更新 declarativeNetRequest 会话规则表  
 * @param tabId 规则所属标签页
 * @param rules 新增规则，可不传递以清空该标签所有已运用的规则
 * @param tab 是否绑定tabid
 */
export function updateSessionRules(tabId: number, rules: chrome.declarativeNetRequest.Rule[], tab = true) {
    // 有规则添加规则
    tab && rules.forEach(d => {
        // 为每条规则限定标签ID
        d.condition.tabIds = [tabId];
    });
    return chrome.declarativeNetRequest.updateSessionRules({ addRules: rules });
}