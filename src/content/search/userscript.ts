import { windowClear } from "../../runtime/clearWindow";
import { doWhile } from "../../runtime/doWhile";
import { appendScripts } from "../../runtime/element/createScripts";
import { replaceUrl } from "../../runtime/urlClean";
import script from "./script.html";

// 清理全局变量
windowClear();
// 无关键词搜索应使用裸origin
doWhile(() => location.href.endsWith('all'), () => {
    replaceUrl(location.origin);
}, 10, 30);
// 禁用__INITIAL_STATE__干扰
Object.defineProperty(window, "__INITIAL_STATE__", { configurable: true, value: undefined });
// 启动原生脚本
appendScripts(script);