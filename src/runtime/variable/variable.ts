import { sessionStorage } from "../storage";

/** 全局变量挂载对象 */
export const VAR = {
    get aid() {
        return <number>(<any>window).aid || sessionStorage.getItem("aid");
    },
    set aid(v) {
        (<any>window).aid = v;
        sessionStorage.setItem("aid", v);
    },
    get cid() {
        return <number>(<any>window).cid || sessionStorage.getItem("cid");
    },
    set cid(v) {
        (<any>window).cid = v;
        sessionStorage.setItem("cid", v);
    },
    get ssid() {
        return <number>(<any>window).ssid || sessionStorage.getItem("ssid");
    },
    set ssid(v) {
        (<any>window).ssid = v;
        sessionStorage.setItem("ssid", v);
    },
    get epid() {
        return <number>(<any>window).epid || sessionStorage.getItem("epid");
    },
    set epid(v) {
        (<any>window).epid = v;
        sessionStorage.setItem("epid", v);
    },
    get player() {
        return <Record<string, any>>(<any>window).player;
    },
    get __INITIAL_STATE__() {
        return <Record<string, any>>(<any>window).__INITIAL_STATE__;
    },
    set __INITIAL_STATE__(v) {
        (<any>window).__INITIAL_STATE__ = v;
    },
    get __playinfo__() {
        return <Record<string, any>>sessionStorage.getItem("__playinfo__");
    },
    set __playinfo__(v) {
        sessionStorage.setItem("__playinfo__", v);
    },
    get limit() {
        return <number>sessionStorage.getItem("limit");
    },
    set limit(v) {
        sessionStorage.setItem("limit", v);
    },
    get bkg_cover() {
        return <string>sessionStorage.getItem("bkg_cover");
    },
    set bkg_cover(v) {
        sessionStorage.setItem("bkg_cover", v);
    },
    get cover() {
        return <string>sessionStorage.getItem("cover");
    },
    set cover(v) {
        sessionStorage.setItem("cover", v);
    },
    get title() {
        return <string>sessionStorage.getItem("title");
    },
    set title(v) {
        sessionStorage.setItem("title", v);
    },
    get th() {
        return <number>sessionStorage.getItem("th");
    },
    set th(v) {
        sessionStorage.setItem("th", v);
    },
    get pgc() {
        return <number>sessionStorage.getItem("pgc");
    },
    set pgc(v) {
        sessionStorage.setItem("pgc", v);
    }
}