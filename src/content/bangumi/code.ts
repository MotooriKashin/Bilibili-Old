import script from "./script.html";
import html from "./bangumi.html";
import { createElements } from "../../runtime/element/create_element";
import { htmlVnode } from "../../runtime/element/html_vnode";
import { API } from "../../runtime/variable/variable";
import { loadVideoScript } from "../../runtime/player/embed_player";
import { loadComment } from "../comment";
import { xhrhook, xhrhookAsync } from "../../runtime/hook/xhr";
import { jsonCheck } from "../../runtime/unit";
import { setting } from "../../runtime/setting";
import { debug } from "../../runtime/debug";
import { xhr } from "../../runtime/xhr";
import { appendScripts } from "../../runtime/element/create_scripts";
import { addCss } from "../../runtime/element/add_element";
import { enLike } from "../av/en_like";
import { bangumiInitialState } from "./bangumi_initial_state";
import { loadByDmId } from "../av/load_by_dm_id";
import { primaryMenu, banner } from "../banner";
import { episodeData } from "./episode_data";
import { globalVector } from "../global";
import { keepNewCheck } from "../av/keep_new";
import { loadEvent } from "../av/load_event";

export function bangumiPage() {
    // 重写检查
    keepNewCheck();
    // 备份标题
    const title = document.title;
    // 刷新样式表
    document.documentElement.replaceWith(createElements(htmlVnode(html)));
    // 还原标题
    title && !title.includes("404") && (document.title = title);

    // bangumi标记
    API.pgc = true;
    // bangumi参数信息
    location.href.replace(/[sS][sS]\d+/, d => API.ssid = <any>Number(d.substring(2)));
    location.href.replace(/[eE][pP]\d+/, d => API.epid = <any>Number(d.substring(2)));
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
    xhrhookAsync("x/web-interface/archive/related", () => ((<any>window).__INITIAL_STATE__)?.mediaInfo?.title, async (u, t) => {
        let result = '{ code: 0, data: [], message: "0" }';
        if (related[((<any>window).__INITIAL_STATE__)?.mediaInfo?.title]) {
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
    // 初始化__INITIAL_STATE__
    bangumiInitialState().then(() => {
        setting.enlike && new enLike("bangumi", (<any>window).__INITIAL_STATE__?.mediaInfo?.stat?.likes);
        if ((<any>window).__INITIAL_STATE__.special) {
            // 带海报的bangumi隐藏顶栏banner和wrapper
            addCss("#bili-header-m > #banner_link,#bili-header-m > .bili-wrapper{ display: none; }");
        }
        // -> bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js:1148
        // epid回调经常无法触发导致不加载评论区，手动加载之
        // doWhile(() => (<any>document).querySelector("#app")?.__vue__, d => d.loadComment());
    });
    // 精确爆破新版番剧脚本
    (<any>window).__Iris__ = true;
    // 加载原生脚本
    appendScripts(script).then(loadEvent);
    // 顶栏分区修正
    primaryMenu();
    // 顶栏banner修复
    banner();
    // 弹幕ID跳转
    loadByDmId();
    // 分集数据
    episodeData();
    // 全局入口
    globalVector();
}