import { windowClear } from "../../runtime/clearWindow";
import { addCss } from "../../runtime/element/addElement";
import { appendScripts } from "../../runtime/element/createScripts";
import { jsonphook } from "../../runtime/hook/Node";
import { replaceUrl } from "../../runtime/urlClean";
import { banner, primaryMenu } from "../global/banner";
import script from "./script.html";

// 还原旧版排行榜URL 原生脚本赖以初始化
replaceUrl(/ranking/.test(document.referrer) ? document.referrer : "https://www.bilibili.com/ranking");
// 三日接口以外过期
// 清理全局变量
windowClear();
jsonphook(["api.bilibili.com/x/web-interface/ranking", "arc_type=0"], d => d.replace(/day=\d+/, "day=3"), undefined, false);
// 禁用__INITIAL_STATE__干扰
Object.defineProperty(window, "__INITIAL_STATE__", { configurable: true, value: undefined });
// 启动原生脚本
appendScripts(script);
// 高分辨率屏修补
addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
// 顶栏分区修正
primaryMenu();
// 顶栏banner修复
banner();