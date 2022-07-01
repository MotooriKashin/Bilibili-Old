import { loginExit } from "../content/global/loginExit.js";
import { abv } from "./lib/abv.js";
import { UrlFormat } from "./format/url.js";

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
    const url = new UrlFormat(str);
    const params = url.params();
    // 旧版页面一般不支持bvid，转化为aid
    params.bvid && (params.aid = <string>abv(params.bvid), delete params.bvid);
    // 部分写作aid读作bvid也得转化
    params.aid && (!Number(params.aid)) && (params.aid = <string>abv(params.aid));
    // 通杀
    paramsSet.forEach(d => {
        Reflect.deleteProperty(params, d);
    });
    // 点杀
    paramArr.forEach(d => {
        params[d[0]] && d[1].includes(<string>params[d[0]]) && Reflect.deleteProperty(params, d[0]);
    })
    // 非参数型bv号转化为av号;
    return url.toJSON().replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, s => "av" + abv(s));
}
/** 处理href属性 */
export function anchorClean(list: NodeListOf<HTMLAnchorElement>) {
    list.forEach(d => {
        if (!d.href) return;
        // tv域名失效
        d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com"));
        // 修复退出页面
        d.href.includes("account.bilibili.com/login?act=exit") && (d.href = "javascript:void(0);", d.onclick = () => loginExit());
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