import { setting } from "../runtime/setting";
import { path } from "../runtime/variable/path";
import { API } from "../runtime/variable/variable";
import { loadComment } from "./comment";
import { dynamicPage } from "./dynamic";
import { historyPage } from "./history";
import { timeline } from "./index/timeline";
import { livePage } from "./live/live";
import { blockReport } from "./log_report";
import { mediaPage } from "./media";
import { messagePage } from "./message/message";
import { bnj } from "./player/bnj";
import { section } from "./section";
import { album } from "./space/album";
import { spacePage } from "./space/space";
import { disableWebRTC } from "./web_rtc";
import { isUserScript } from "../tampermonkey/check";

export function globalVector() {
    // 主脚本有可能多次注入，全局脚本只运行一次
    if ((<any>window).BILIOLD_GOLBAL) return;
    (<any>window).BILIOLD_GOLBAL = true;

    // 旧版顶栏底栏
    setting.section && section();
    // 翻页评论区
    setting.comment && loadComment();
    // 日志拦截
    setting.logReport && blockReport();
    // 拜年祭
    setting.player && /\/festival\//.test(location.href) && bnj();
    // message页面
    path[2] == "message.bilibili.com" && messagePage();
    // 禁用p2p上传
    setting.liveP2p && disableWebRTC();
    // live页面
    /live\.bilibili\.com/.test(location.href) && livePage();
    // space页面
    /space\.bilibili\.com/.test(location.href) && spacePage();
    // 动态
    path[2] == "t.bilibili.com" && setting.liveRecord && dynamicPage();
    // 历史记录
    location.href.includes("www.bilibili.com/account/history") && historyPage();
    // bangumi详情页
    /bangumi\/media\/md/.test(location.href) && mediaPage();
    // 港澳台番剧时间表
    setting.timeline && /anime\/timeline/.test(location.href) && timeline();
    // 相簿
    setting.album && /t.bilibili.com\/\d+/.test(location.href) && album();
    // 与内容脚本传递数据
    window.addEventListener("message", ev => {
        if (isUserScript) return;
        if (typeof ev.data === "object") {
            switch (ev.data.$type) {
                case "getPageInfo":
                    window.postMessage({
                        $type: "pageInfoResponse",
                        data: {
                            aid: API.aid,
                            cid: API.cid,
                            pgc: API.pgc,
                            cover: API.cover,
                            title: API.title,
                            playerParam: API.playerParam
                        }
                    });
                    break;
                default:
            }
        }
    })
}