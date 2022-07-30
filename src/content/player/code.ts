import script from "./script.html";
import html from "./player.html";
import { createElements } from "../../runtime/element/create_element";
import { htmlVnode } from "../../runtime/element/html_vnode";
import { loadVideoScript } from "../../runtime/player/embed_player";
import { sessionStorage } from "../../runtime/storage";
import { doWhile } from "../../runtime/do_while";
import { appendScripts } from "../../runtime/element/create_scripts";
import { objUrl } from "../../runtime/format/url";
import { getUrlValue } from "../../runtime/unit";
import { urlParam } from "../../runtime/url_param";
import { globalVector } from "../global";

export function palyerPage() {
    // 重写标记
    sessionStorage.setItem("rebuild", true);
    // 刷新样式表
    document.documentElement.replaceWith(createElements(htmlVnode(html)));
    // 加载播放器脚本
    loadVideoScript(undefined, true);
    // 正域
    document.domain = "bilibili.com";
    // 加载原生脚本
    appendScripts(script).then(() => {
        const playerParam = { // 基础视频信息
            aid: getUrlValue("aid") || getUrlValue("avid"),
            cid: getUrlValue("cid"),
            p: getUrlValue("P"),
            // autoplay: getUrlValue("autoplay"), 深恶痛绝
            as_wide: getUrlValue("as_wide"),
            bnj: getUrlValue("bnj"),
            player_type: getUrlValue("player_type"),
            season_type: getUrlValue("season_type")
        }
        if (playerParam.bnj) {
            try {
                (<any>window).parent.EmbedPlayer = (<any>window).EmbedPlayer;
                (<any>window).parent.bnj = true;
            } catch (e) { }
        } else {
            // 读取信息
            urlParam(location.href).then(d => {
                if (!d.cid) throw d;
                playerParam.aid = d.aid;
                playerParam.cid = d.cid;
                if (d.pgc || d.ssid || d.epid) {
                    !playerParam.season_type && (playerParam.season_type = "1");
                    Reflect.set(playerParam, "seasonId", d.ssid)
                    Reflect.set(playerParam, "episodeId", d.epid)
                    Reflect.set(playerParam, "urlparam", `module%3Dbangumi%26season_type%3D${playerParam.season_type}`)
                }
                // 初始化播放器
                (<any>window).EmbedPlayer("player", "//static.hdslb.com/play.swf", objUrl("", <Record<string, string | number>>playerParam));
            });
        }
        // 暴露嵌入播放器
        doWhile(() => (<any>window).player, () => {
            try {
                (<any>window).parent.player = (<any>window).player;
            } catch (e) { }
        });
    });
    // 全局入口
    globalVector();
}