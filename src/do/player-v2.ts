interface modules {
    /**
     * 本模块负责获取视频信息以提供给CC字幕等模块  
     * 视频信息接口`https://api.bilibili.com/x/player/v2`  
     * 备用移动端接口`https://api.bilibili.com/x/v2/dm/view`
     */
    readonly "player-v2.js": string;
}
API.switchVideo(() => {
    let ready = false; // 载入时机标记
    config.carousel ? API.xhrhookasync("api.bilibili.com/x/player/carousel.so", () => ready = true, async () => {
        let str = `<msg><item bgcolor="#000000" catalog="news"><a href="//app.bilibili.com/?from=bfq" target="_blank"><font color="#ffffff">客户端下载</font></a></item><item bgcolor="#000000" catalog="news"><a href="http://link.acg.tv/forum.php" target="_blank"><font color="#ffffff">bug反馈传送门</font></a></item></msg>'`;
        try {
            const result = await xhr.get("//api.bilibili.com/pgc/operation/api/slideshow?position_id=531", { responseType: "json" });
            str = result.result.reduce((s, d, i) => {
                s += `<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="${2320 + i}" id="${314825 + i}"><![CDATA[<a href="${d.blink}" target="_blank"><font color="#FFFFFF">${d.title}</font></a>]]></item>`;
                return s;
            }, "<msg>") + "</msg>";
        } catch (e) { debug.error("获取番剧推荐出错！", e) }
        const dom = new DOMParser().parseFromString(str, "text/xml");
        return {
            response: dom,
            responseXML: dom
        }
    }, false) : API.xhrhook("api.bilibili.com/x/player/carousel.so", () => ready = true);
    xhr({
        url: Format.objUrl("https://api.bilibili.com/x/player/v2", { cid: <any>API.cid, aid: <any>API.aid }),
        responseType: "json",
        credentials: true
    }).catch((e: Error) => {
        debug.error("autoFix.js", e);
        return xhr({
            url: Format.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: <any>API.cid, aid: <any>API.aid, type: <any>1 }),
            responseType: "json",
            credentials: true
        })
    }).then((data: any) => {
        API.runWhile(() => ready, () => {
            // CC字幕
            data?.data?.subtitle?.subtitles && API.closedCaption.getCaption(data);
            // 分段进度条
            config.segProgress && data?.data?.view_points[1] && new API.segProgress(data);
        })
    })
})
interface config {
    /**
     * 修复：播放器通知
     */
    carousel: boolean;
}