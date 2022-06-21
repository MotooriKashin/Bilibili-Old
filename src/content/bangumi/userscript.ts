import { windowClear } from "../../runtime/clearWindow";
import { debug } from "../../runtime/debug";
import { addCss } from "../../runtime/element/addElement";
import { appendScripts } from "../../runtime/element/createScripts";
import { xhrhook, xhrhookAsync } from "../../runtime/hook/xhr";
import { loadVideoScript } from "../../runtime/player/EmbedPlayer";
import { setting } from "../../runtime/setting";
import { storage } from "../../runtime/storage";
import { jsonCheck } from "../../runtime/unit";
import { xhr } from "../../runtime/xhr";
import { loadByDmId } from "../av/loadByDmId";
import { banner, primaryMenu } from "../global/banner";
import { loadComment } from "../global/comment";
import { enLike } from "../global/enLike";
import { bangumiInitialState } from "./bangumi-initial-state";
import { episodeData } from "./episodeData";
import script from "./script.html";

// 清理全局变量
windowClear();
// bangumi标记
storage.ss.setItem("pgc", 1);
// bangumi参数信息
location.href.replace(/[sS][sS]\d+/, d => <any>storage.ss.setItem("ssid", d.substring(2)));
location.href.replace(/[eE][pP]\d+/, d => <any>storage.ss.setItem("epid", d.substring(2)));
// 加载播放器脚本
loadVideoScript();
// 评论脚本
loadComment();
// 修复末尾番剧推荐
xhrhook("api.bilibili.com/pgc/web/recommend/related/recommend", args => {
    // 原接口不返回针对ssid/epid的数据
    args[1] = args[1].replace("web/recommend", "season/web");
}, r => {
    try {
        const result = jsonCheck(r.response);
        result.result = result.data.season;
        r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
    } catch (e) { }
});
// 修复追番数据
xhrhook("bangumi.bilibili.com/ext/web_api/season_count", args => {
    // bangumi接口已追番数据恒等于0
    args[1] = args[1].replace("bangumi.bilibili.com/ext/web_api/season_count", "api.bilibili.com/pgc/web/season/stat");
}, r => {
    try {
        const result = jsonCheck(r.response);
        result.result.favorites = result.result.follow;
        r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
    } catch (e) { }
}, true);
// 解除区域限制（重定向模式）
setting.videoLimit.switch && xhrhook("bangumi.bilibili.com/view/web_api/season/user/status", undefined, res => {
    try {
        const data = res.responseType === "json" ? res.response : JSON.parse(res.response);
        data.result.area_limit = 0;
        data.result.ban_area_show = 0;
        res.responseType === "json" || (res.response = res.responseText = JSON.stringify(data));
    } catch (e) { }
}, false);
// 修复相关视频推荐 接口来自md页面
const related: Record<string, string> = {};
xhrhookAsync("x/web-interface/archive/related", () => ((<any>window).__INITIAL_STATE__).mediaInfo.title, async (u, t) => {
    let result = '{ code: 0, data: [], message: "0" }';
    if (related[((<any>window).__INITIAL_STATE__).mediaInfo.title]) {
        result = related[((<any>window).__INITIAL_STATE__).mediaInfo.title];
    } else {
        try {
            const info = await xhr({
                url: `https://api.bilibili.com/x/tag/info?tag_name=${((<any>window).__INITIAL_STATE__).mediaInfo.title}`,
                responseType: "json"
            }, true);
            related[((<any>window).__INITIAL_STATE__).mediaInfo.title] = result = await xhr({
                url: `https://api.bilibili.com/x/web-interface/tag/top?tid=${info.data.tag_id}`
            }, true);
        } catch (e) {
            debug.error("相关视频推荐", e);
        }
    }
    return t === "json" ? { response: JSON.parse(result) } : { response: result, responseText: result }
}, false);

// 加载原生脚本
appendScripts(script);
// 初始化__INITIAL_STATE__
bangumiInitialState().then(() => {
    setting.enlike && new enLike("bangumi", (<any>window).__INITIAL_STATE__.mediaInfo.stat.likes);
    if ((<any>window).__INITIAL_STATE__.special) {
        // 带海报的bangumi隐藏顶栏banner和wrapper
        addCss("#bili-header-m > #banner_link,#bili-header-m > .bili-wrapper{ display: none; }");
    }
    // -> bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js:1148
    // epid回调经常无法触发导致不加载评论区，手动加载之
    // doWhile(() => (<any>document).querySelector("#app")?.__vue__, d => d.loadComment());
});
// 顶栏分区修正
primaryMenu();
// 顶栏banner修复
banner();
// 弹幕ID跳转
loadByDmId();
// 分集数据
episodeData();