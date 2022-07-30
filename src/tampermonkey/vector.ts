import { indexPage } from "../content/index/code";
import { setting } from "../runtime/setting";
import { replaceUrl, urlClean } from "../runtime/url_clean";
import { path } from "../runtime/variable/path";

// 网址清理
replaceUrl(urlClean(location.href));
// 重构引导
if (setting.index && path[2] == 'www.bilibili.com' && (!path[3] || (path[3].startsWith('\?') || path[3].startsWith('\#') || path[3].startsWith('index.')))) {
    indexPage();
}