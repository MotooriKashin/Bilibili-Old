import { windowClear } from "../../runtime/clearWindow";
import { appendScripts } from "../../runtime/element/createScripts";
import { xhrhook } from "../../runtime/hook/xhr";
import { loadVideoScript } from "../../runtime/player/EmbedPlayer";
import { setting } from "../../runtime/setting";
import { loadByDmId } from "../av/loadByDmId";
import { banner, primaryMenu } from "../global/banner";
import { loadComment } from "../global/comment";
import { enLike } from "../global/enLike";
import script from "./script.html";

// 清理全局变量
windowClear();
// 加载播放器脚本
loadVideoScript();
// 评论脚本
loadComment();
// 修正直播错误
xhrhook("api.live.bilibili.com/bili/living_v2/", undefined, r => { r.response = r.responseText = ` ${r.response}` }, false);
// 加载原生脚本
appendScripts(script);
// 修复评论视频跳转接口
(<any>window).commentAgent = { seek: (t: number) => (<any>window).player && (<any>window).player.seek(t) };
// 添加点赞功能
setting.enlike && new enLike("watchlater");
// 顶栏分区修正
primaryMenu();
// 顶栏banner修复
banner();
// 弹幕ID跳转
loadByDmId();