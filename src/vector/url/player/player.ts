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
    loadVideoScript(undefined, true);
    function run() {
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