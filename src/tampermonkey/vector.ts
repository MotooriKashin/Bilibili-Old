import { avPage } from "../content/av/code";
import { bangumiPage } from "../content/bangumi/code";
import { globalVector } from "../content/global";
import { indexPage } from "../content/index/code";
import { palyerPage } from "../content/player/code";
import { playlistPage } from "../content/playlist/code";
import { rankingPage } from "../content/ranking/code";
import { readPage } from "../content/read/code";
import { searchPage } from "../content/search/code";
import { watchlaterPage } from "../content/watchlater/code";
import { setting } from "../runtime/setting";
import { replaceUrl, urlClean } from "../runtime/url_clean";
import { path } from "../runtime/variable/path";

// 网址清理
replaceUrl(urlClean(location.href));
// 重构引导
if (setting.index && path[2] == 'www.bilibili.com' && (!path[3] || (path[3].startsWith('\?') || path[3].startsWith('\#') || path[3].startsWith('index.')))) {
    indexPage();
}
if (setting.av && /(\/s)?\/video\/[AaBb][Vv]/.test(location.href)) {
    path[3] === "s" && replaceUrl(location.href.replace("s/video", "video")); // SEO重定向
    avPage();
}
if (setting.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href)) {
    bangumiPage();
}
if (setting.watchlater && /\/watchlater/.test(location.href)) {
    watchlaterPage();
}
if (setting.player && /player\./.test(location.href) && !location.href.includes("ancient")) {
    palyerPage();
}
if ((setting.playlist && /\/medialist\/play\//.test(location.href) && !/watchlater/.test(location.href)) || /\/playlist\/video\/pl/.test(location.href)) {
    playlistPage();
}
if (setting.ranking && /\/v\/popular\//.test(location.href)) {
    rankingPage();
}
if (setting.read && /\/read\/[Cc][Vv]/.test(location.href)) {
    readPage();
}
if (setting.search && path[2] == "search.bilibili.com") {
    searchPage();
};
globalVector();