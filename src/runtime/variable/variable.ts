import { GM } from "../gm";
import { objUrl, URLEs, urlObj } from "../format/url";
import { urlsign } from "../lib/sign";
import { urlParam } from "../url_param";
import { xhr } from "../xhr";
import { setting } from "../setting";

/** 全局变量挂载对象 本变量将在开发者模式下暴露到window下，需要调试的接口可挂载于此 */
export const API = {
    get aid() {
        return <number>(<any>window).aid;
    },
    set aid(v) {
        (<any>window).aid = v;
    },
    get cid() {
        return <number>(<any>window).cid;
    },
    set cid(v) {
        (<any>window).cid = v;
    },
    get ssid() {
        return <number>(<any>window).ssid;
    },
    set ssid(v) {
        (<any>window).ssid = v;
    },
    get epid() {
        return <number>(<any>window).epid;
    },
    set epid(v) {
        (<any>window).epid = v;
    },
    get __INITIAL_STATE__() {
        return <Record<string, any>>(<any>window).__INITIAL_STATE__;
    },
    set __INITIAL_STATE__(v) {
        (<any>window).__INITIAL_STATE__ = v;
    },
    /** 当前播放数据 */
    __playinfo__: <Record<"data" | "result" | "durl" | "dash", any>><unknown>undefined,
    /** 是否限制视频 */
    limit: <boolean><unknown>undefined,
    /** bangumi特殊海报 */
    bkg_cover: <string><unknown>undefined,
    /** 视频封面 */
    cover: <string><unknown>undefined,
    /** 视频标题 */
    title: <string><unknown>undefined,
    /** 泰区视频标记 */
    th: <boolean><unknown>undefined,
    /** bangumi视频标记 */
    pgc: <boolean><unknown>undefined,
    /** 播放器启动参数 */
    playerParam: <Record<string, string>><unknown>undefined,
    /** 是否已重写页面 */
    rewrite: false,
    // 调试接口集成 
    GM,
    urlParam,
    xhr,
    urlsign,
    objUrl,
    urlObj,
    URLEs
}
setting.development && Reflect.set(window, "API", API);