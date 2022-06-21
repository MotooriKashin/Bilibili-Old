import { loadScript } from "../../runtime/element/addElement";
import { storage } from "../../runtime/storage";

loadScript(chrome.runtime.getURL("content/global/userscript.js"));
// 监听页面重定向
window.addEventListener("beforeunload", () => {
    // 清理缓存
    storage.ss.removeItem("title");
    storage.ss.removeItem("cover");
    storage.ss.removeItem("__playinfo__");
    // 注销针对性请求拦截
    chrome.runtime.sendMessage({
        $type: "updateSessionRules"
    }).catch(e => console.error(e))
});