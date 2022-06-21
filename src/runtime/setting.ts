import { ProxyHandler } from "./lib/proxyHandler.js";
import { doWhile } from "./doWhile.js";
import { storage } from "./storage.js"

/** 设置数据 */
let SETTING = storage.ss.getItem("setting");
export let setting = SETTING && new Proxy(SETTING, new ProxyHandler(save));
if (!setting) {
    doWhile(() => storage.ss.getItem("setting"), d => {
        SETTING = d;
        setting = new Proxy(SETTING, new ProxyHandler(save))
    });
}
/** 保存对于数据的更改 */
function save() {
    storage.ss.setItem("setting", SETTING);
    window.postMessage({
        $type: "setting",
        data: SETTING
    })
}