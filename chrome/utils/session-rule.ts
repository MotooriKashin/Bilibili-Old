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
    return chrome.runtime.sendMessage({
        $type: "updateSessionRules",
        data: rules
    })
}
/**
/**
 * 【后台脚本】更新 declarativeNetRequest 会话规则表  
 * 可不传递`rules`以清空该标签所有已运用的规则
 * @param tabId 规则所属标签页
 * @param rules 新增规则，可不传递以清空该标签所有已运用的规则
 */
export function updateSessionRules(tabId: number, rules?: chrome.declarativeNetRequest.Rule[]) {
    if (rules) {
        // 有规则添加规则
        rules.forEach(d => {
            // 为每条规则限定标签ID
            d.condition.tabIds = [tabId];
        });
        return chrome.declarativeNetRequest.updateSessionRules({ addRules: rules });
    } else {
        // 无规则移除tabId对应的规则
        return chrome.declarativeNetRequest.getSessionRules().then(d => {
            return chrome.declarativeNetRequest.updateSessionRules({
                removeRuleIds: d.reduce((s, d) => {
                    if (d.condition.tabIds?.includes(tabId)) {
                        s.push(d.id);
                    }
                    return s;
                }, <number[]>[])
            });
        })
    }
}