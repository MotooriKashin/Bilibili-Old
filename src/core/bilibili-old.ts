import { UI } from "./ui";

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
})();