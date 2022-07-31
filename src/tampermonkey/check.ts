/** 检查是否用户脚本模式 */
export let isUserScript = false;
try {
    GM_getValue("config");
    isUserScript = true;
} catch { }