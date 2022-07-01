import { ProxyHandler } from "./lib/proxyHandler.js";
import { doWhile } from "./doWhile.js";
import { sessionStorage } from "./storage.js"

/** 设置数据 */
let SETTING = sessionStorage.getItem("setting");
export let setting = SETTING && new Proxy(SETTING, new ProxyHandler(save));
if (!setting) {
    doWhile(() => sessionStorage.getItem("setting"), d => {
        SETTING = d;
        setting = new Proxy(SETTING, new ProxyHandler(save))
    });
}
/** 保存对于数据的更改 */
function save() {
    sessionStorage.setItem("setting", SETTING);
    window.postMessage({
        $type: "setting",
        data: SETTING
    })
}