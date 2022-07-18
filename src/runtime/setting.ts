import { ProxyHandler } from "./lib/proxyHandler.js";
import { doWhile } from "./doWhile.js";
import { sessionStorage } from "./storage.js"
import { SETTING } from "../include/setting.js";

/** 设置数据 */
let SET: typeof SETTING = sessionStorage.getItem("setting");
export let setting = SET && new Proxy(SET, new ProxyHandler(save));
if (!setting) {
    doWhile(() => sessionStorage.getItem("setting"), d => {
        SET = d;
        setting = new Proxy(SET, new ProxyHandler(save))
    });
}
/** 保存对于数据的更改 */
function save() {
    sessionStorage.setItem("setting", SET);
    window.postMessage({
        $type: "setting",
        data: SET
    })
}