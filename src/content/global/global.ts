import { setting } from "../../runtime/setting";
import { disableWebRTC } from "../../runtime/WebRTC";
import { dynamicPage } from "../dynamic";
import { historyPage } from "../history";
import { timeline } from "../index/timeline";
import { livePage } from "../live/live";
import { mediaPage } from "../media";
import { messagePage } from "../message/message";
import { bnj } from "../player/bnj";
import { album } from "../space/album";
import { spacePage } from "../space/space";
import { loadComment } from "./comment";
import { blockReport } from "./logReport";
import { section } from "./section";

const path = location.href.split("/");
// 日志拦截
setting.report && blockReport();
// // 拜年祭
setting.player && /\/festival\//.test(location.href) && bnj();
// // message页面
path[2] == "message.bilibili.com" && messagePage();
// // 禁用p2p上传
setting.liveP2p && disableWebRTC();
// // 翻页评论区
setting.comment && loadComment();
// 旧版顶栏底栏
setting.section && section();
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