import { abv } from "./lib/abv";
import { URLEs } from "./format/url";

/** 垃圾参数序列 */
const paramsSet = new Set([
    'spm_id_from',
    'from_source',
    'msource',
    'bsource',
    'seid',
    'source',
    'session_id',
    'visit_id',
    'sourceFrom',
    'from_spmid',
    'share_source',
    'share_medium',
    'share_plat',
    'share_session_id',
    'share_tag',
    'unique_k',
    'vd_source',
    'csource'
]);
/** 精准爆破 */
const paramArr = Object.entries({
    from: ["search"]
});
/**
 * 修改当前URL而不出发重定向  
 * **无法跨域操作！**
 * @param url 新URL
 */
export function replaceUrl(url: string) {
    window.history.replaceState(window.history.state, "", url);
}
/**
 * 清理URL中无效参数
 * @param str 原始url
 */
export function urlClean(str: string) {
    const base = str.split("#")[0].split("?")[0];
    const url = new URLEs(str);
    if (url) {
        const params = url.searchParams;
        if (params.has("bvid")) {
            // 旧版页面一般不支持bvid，转化为aid
            params.set("aid", <string>abv(<string>params.get("bvid")));
            params.delete("bvid");
        }
        if (params.has("aid") && !Number(params.get("aid"))) {
            // B站偶有发病出现名为aid实为bvid的情况
            params.set("aid", <string>abv(<string>params.get("aid")));
        }
        paramsSet.forEach(d => {
            // 通杀
            params.delete(d);
        });
        paramArr.forEach(d => {
            // 点杀
            if (params.has(d[0])) {
                if (d[1].includes(<string>params.get(d[0]))) {
                    params.delete(d[0]);
                }
            }
        });
        return url.toJSON().replace(url.origin + url.pathname, base).replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, s => "av" + abv(s));
    }
    else return str;
}
/** 处理href属性 */
export function anchorClean(list: NodeListOf<HTMLAnchorElement>) {
    list.forEach(d => {
        if (!d.href) return;
        d.href = urlClean(d.href);
    });
}
/** 检查a标签 */
export function AnchorClick(e: MouseEvent) { // 代码copy自B站spm.js
    var f = <HTMLAnchorElement>e.target;
    for (; f && "A" !== f.tagName;) {
        f = <HTMLAnchorElement>f.parentNode
    }
    if ("A" !== (null == f ? void 0 : f.tagName)) {
        return
    }
    anchorClean(<any>[f]);
}
/**
 * @see Max3 {@link https://greasyfork.org/zh-CN/scripts/393995/discussions/139993 }
 */
(<any>window).navigation?.addEventListener('navigate', (e: any) => {
    const newURL = urlClean(e.destination.url)
    if (e.destination.url != newURL) {
        e.preventDefault(); // 阻止原事件看情况是否转发
        if (newURL == window.location.href) return // 如果清理后和原来一样就直接返回
        // 否则就处理清理后的链接
        window.history.replaceState(window.history.state, "", newURL);
    }
});
// 处理点击事件
window.addEventListener("click", AnchorClick, !1);
// 处理右键菜单
window.addEventListener("contextmenu", AnchorClick, !1);
// 页面载入完成处理
document.addEventListener("DOMContentLoaded", () => anchorClean(document.querySelectorAll("a")));