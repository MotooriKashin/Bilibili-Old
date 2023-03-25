import md5 from "md5";
import { base64 } from "../utils/base64";
import { debug } from "../utils/debug";
import { objUrl, urlObj } from "../utils/format/url";
import { htmlVnode } from "../utils/htmlvnode";
import { danmaku } from "./danmaku";
import { download } from "./download";
import { toast } from "./toast";
import { UI } from "./ui";
import { videoInfo } from "./video-info";
import { urlSign } from "../io/api-sign";
import { fileRead, saveAs } from "../utils/file";
import { PNG } from "../utils/png";

/** 用于暴露的统一接口 */
export const BLOD = new (class {
    /** 路径拆分 */
    path = location.href.split('/');
    /** bangumi标记 */
    pgc = false;
    ui?: UI;
    get aid() {
        return (<any>window).aid;
    };
    set aid(v) {
        (<any>window).aid = v;
    }
    get cid() {
        return (<any>window).cid;
    };
    set cid(v) {
        (<any>window).cid = v;
    }
    /** bangumi ssid */
    ssid!: number;
    /** bangumi epid */
    epid!: number;
    /** 限制视频 */
    limit!: number;
    /** 东南亚视频标记 */
    th!: boolean;
    /** 播放器已加载 */
    playLoaded = false;
    /** 已模拟APP端取流 */
    networkMocked = false;
    /** 是否大会员 */
    isVip = false;
    /** 播放器哈希值 */
    version?: string;

    // 调试接口
    GM = GM;
    urlSign = urlSign;
    objUrl = objUrl;
    urlObj = urlObj;
    download = download;
    danmaku = danmaku;
    toast = toast;
    debug = debug;
    videoInfo = videoInfo;
    base64 = base64;
    md5 = md5;
    htmlVnode = htmlVnode;
    saveAs = saveAs;
    fileRead = fileRead;
    PNG = PNG;

    /** 刷新toast，多用于重构页面后刷新显示 */
    flushToast() {
        document.body.contains(toast) || document.body.appendChild(toast)
    }
})();
