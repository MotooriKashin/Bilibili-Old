interface modules {
    /**
     * 本模块负责获取视频信息以提供给CC字幕等模块  
     * 视频信息接口`https://api.bilibili.com/x/player/v2`  
     * 备用移动端接口`https://api.bilibili.com/x/v2/dm/view`  
     * 由于载入判定使用了播放器消息接口，在此一并修复。
     */
    readonly "player-v2.js": string;
}
interface config {
    /** 播放器通知 */
    carousel: ("番剧推荐" | "首页推荐" | "实时热搜")[];
    /** 分段进度条 */
    segProgress: boolean;
    /** CC字幕 */
    closedCaption: boolean;
}
namespace API {
    registerSetting({
        key: "carousel",
        sort: "restore",
        label: "修复播放器消息",
        sub: "也可以留空",
        type: "mutlti",
        value: ["番剧推荐"],
        list: ["番剧推荐", "首页推荐", "实时热搜"],
        float: '不定多选，多选时随机呈现其中一种，也可以留空。'
    })
    registerSetting({
        key: "segProgress",
        sort: "player",
        label: "分段进度条",
        sub: "仅限看点视频",
        type: "switch",
        value: false
    })
    switchVideo(() => {
        let ready = false; // 载入时机标记
        xhrhookasync("api.bilibili.com/x/player/carousel.so", () => ready = true, async () => {
            let str = `<msg><item bgcolor="#000000" catalog="news"><![CDATA[<a href="//app.bilibili.com/?from=bfq" target="_blank"><font color="#ffffff">客户端下载</font></a>]]></item><item bgcolor="#000000" catalog="news"><![CDATA[<a href="http://link.acg.tv/forum.php" target="_blank"><font color="#ffffff">bug反馈传送门</font></a>]]></item></msg>'`, result: any; try {
                switch (Format.randomArray(config.carousel)) { // 随机抽选
                    case "番剧推荐": result = await xhr.get("//api.bilibili.com/pgc/operation/api/slideshow?position_id=531", { responseType: "json" });
                        str = result.result.reduce((s: any, d: any, i: any) => {
                            s += `<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="${2320 + i}" id="${314825 + i}"><![CDATA[<a href="${d.blink}" target="_blank"><font color="#FFFFFF">${d.title}</font></a>]]></item>`;
                            return s;
                        }, "<msg>") + "</msg>";
                        break;
                    case "首页推荐": result = await xhr.get("https://api.bilibili.com/x/web-show/res/loc?pf=0&id=4694", { responseType: "json" });
                        str = result.data.reduce((s: any, d: any, i: any) => {
                            d.name && (s += `<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="${2320 + i}" id="${314825 + i}"><![CDATA[<a href="${d.url}" target="_blank"><font color="#FFFFFF">${d.name}</font></a>]]></item>`);
                            return s;
                        }, "<msg>") + "</msg>";
                        break;
                    case "实时热搜": result = await xhr.get("https://api.bilibili.com/x/web-interface/search/square?limit=10", { responseType: "json" });
                        str = result.data.trending.list.reduce((s: any, d: any, i: any) => {
                            s += `<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="${2320 + i}" id="${314825 + i}"><![CDATA[<a href="https://search.bilibili.com/all?keyword=${encodeURIComponent(d.keyword)}" target="_blank"><font color="#FFFFFF">${d.keyword}</font></a>]]></item>`;
                            return s;
                        }, "<msg>") + "</msg>";
                        break;
                }
            } catch (e) { debug.error("获取推荐数据出错！", e) }
            const dom = new DOMParser().parseFromString(str, "text/xml");
            runWhile(() => document.querySelector(".bilibili-player-video-message-show-setting"), () => {
                document.querySelector<any>(".bilibili-player-video-message-show-setting").addEventListener("click", () => {
                    toast.warning("此处设置已失效，请在脚本设置面板“修复播放器消息”中调整！");
                    displaySetting("carousel");
                })
            })
            return {
                response: dom,
                responseXML: dom
            }
        }, false);
        xhr({ // 访问视频信息接口
            url: Format.objUrl("https://api.bilibili.com/x/player/v2", { cid: <any>cid, aid: <any>aid }),
            responseType: "json",
            credentials: true
        }).catch((e: Error) => {
            debug.error("autoFix.js", e);
            return xhr({ // 备用移动端接口
                url: Format.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: <any>cid, aid: <any>aid, type: <any>1 }),
                responseType: "json",
                credentials: true
            })
        }).then((data: any) => {
            runWhile(() => ready, () => {
                // CC字幕
                config.closedCaption && data?.data?.subtitle?.subtitles && closedCaption.getCaption(data);
                // 分段进度条
                config.segProgress && data?.data?.view_points[1] && new SegProgress(data);
            })
        })
    })
}