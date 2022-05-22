interface modules {
    /** 
     * 重定向往player https://player.bilibili.com/html5player.html
     */
    readonly "player.js": string;
    readonly "player.html": string;
    readonly "player-script.html": string;
}
namespace API {
    if (rebuildType != "重定向") windowClear();
    document.domain = "bilibili.com";
    loadVideoScript();
    function run() {
        return urlParam(location.href).then(d => {
            if (!d.cid) throw d;
            const playerParam = { // 基础视频信息
                aid: d.aid,
                cid: d.cid,
                p: getUrlValue("P"),
                // autoplay: getUrlValue("autoplay"), 深恶痛绝
                as_wide: getUrlValue("as_wide"),
                bnj: getUrlValue("bnj"),
                player_type: getUrlValue("player_type"),
                season_type: getUrlValue("season_type")
            }
            if (d.pgc || d.ssid || d.epid) {
                !playerParam.season_type && (playerParam.season_type = "1");
                Reflect.set(playerParam, "seasonId", d.ssid)
                Reflect.set(playerParam, "episodeId", d.epid)
                Reflect.set(playerParam, "urlparam", `module%3Dbangumi%26season_type%3D${playerParam.season_type}`)
            }
            // 初始化播放器
            window.EmbedPlayer("player", "//static.hdslb.com/play.swf", objUrl("", <Record<string, string | number>>playerParam));
            // 暴露嵌入播放器
            doWhile(() => window.player, () => {
                try { (<any>window).parent.oldPlayer = window.player } catch (e) { }
            });
        });
    }
    if (rebuildType == "重定向") {
        document.documentElement.replaceChildren(createElements(htmlVnode(getModule("player.html"))));
        appendScripts(getModule("player-script.html")).then(run).catch(e => {
            toast.error("获取视频信息出错 ಥ_ಥ");
            debug.error("获取视频信息出错", e);
        })
    } else {
        documentWrite(getModule("player.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", `${getModule("player-script.html")}</body>`));
        run();
    }
}