import { GM } from "./gm";
import SETTING_TYPE from "./chrome/setting.json";
import { ProxyHandler } from "./lib/proxy_handler";
import { sessionStorage } from "./storage";
import { isUserScript } from "../tampermonkey/check";

/** 设置数据 由于MV3不提供同步方法获取存储数据，只能优先导出默认设置，等异步返回再更新，好在经测试需要用时设置数据的确已更新。🤣——除了重写页面功能，但那是在后台脚本里注册的无须担心。 */
export let setting = SETTING_TYPE;
/** 实际设置数据 */
let newSetting: any;
function getSetting() {
    if (isUserScript) {
        newSetting = GM_getValue("config", SETTING_TYPE);
        setting = new Proxy(newSetting, new ProxyHandler(saveConfig));
    } else {
        newSetting = sessionStorage.getItem("setting");
        newSetting ? setting = new Proxy(newSetting, new ProxyHandler(saveConfig)) : setTimeout(getSetting);
    }
}
/** 保存设置数据 */
export function saveConfig() {
    if (newSetting) {
        if (isUserScript) {
            GM_setValue("config", JSON.parse(JSON.stringify(newSetting)));
        } else {
            GM.setValue("setting", JSON.parse(JSON.stringify(newSetting)));
            sessionStorage.setItem("setting", JSON.parse(JSON.stringify(newSetting)));
        }
    }
}
getSetting();
// TODO: 如果未来MV3支持将注册任意代码为内容脚本，设置数据只能异步获取的问题将迎刃而解。——应该会支持的吧，否则Tampermonkey等用户脚本管理器真的得死了🤣