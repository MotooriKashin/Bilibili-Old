import { AV } from "../utils/av";
import { URL } from "../utils/format/url";

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
class UrlCleaner {
    /** 垃圾参数序列 */
    paramsSet = paramsSet;
    /** 精准爆破序列 */
    paramArr = paramArr;
    constructor() {
        this.location();
        // 监听地址栏变动
        window.navigation?.addEventListener('navigate', e => {
            const newURL = this.clear((<NavigateEvent>e).destination.url)
            if ((<NavigateEvent>e).destination.url != newURL) {
                e.preventDefault(); // 阻止原事件看情况是否转发
                if (newURL == window.location.href) return // 如果清理后和原来一样就直接返回
                // 否则就处理清理后的链接
                if ((<NavigateEvent>e).navigationType !== 'traverse') {
                    this.updateLocation(newURL, <any>(<NavigateEvent>e).navigationType);
                }
            }
        });
        // 处理点击事件
        window.addEventListener("click", e => this.anchorClick(e));
        // 处理右键菜单
        window.addEventListener("contextmenu", e => this.anchorClick(e));
        // 页面载入完成处理
        document.addEventListener("DOMContentLoaded", () => {
            this.location();
            this.anchor(document.querySelectorAll("a"));
        }, { once: true });
    }
    /** 净化url */
    clear(str: string) {
        const url = new URL(str);
        if (url && !str.includes('passport.bilibili.com')) {
            const params = url.params;
            // 旧版页面一般不支持bvid，转化为aid
            if (params.bvid) {
                params.aid = <string>AV.fromBV(<string>params.bvid);
            }
            // B站偶有发病出现名为aid实为bvid的情况
            if (params.aid && !Number(params.aid)) {
                params.aid = <string>AV.fromBV(<string>params.aid);
            }
            // 通杀
            paramsSet.forEach(d => { delete params[d]; });
            // 点杀
            paramArr.forEach(d => {
                if (params[d[0]]) {
                    if (d[1].includes(<string>params[d[0]])) {
                        delete params[d[0]];
                    }
                }
            });
            url.base = AV.fromStr(url.base);
            url.hash && (url.hash = AV.fromStr(url.hash));
            return url.toJSON();
        } else return str;
    }
    /** 净化URL */
    location() {
        this.updateLocation(this.clear(location.href));
    }
    /** 更新URL而不触发重定向 */
    updateLocation(url: string, fun?: 'push') {
        const Url = new self.URL(url);
        if (Url.host === location.host) {
            if (fun === 'push') {
                window.history.pushState(window.history.state, "", url);
            } else {
                window.history.replaceState(window.history.state, "", url);
            }
        }
    }
    /** 点击回调 */
    anchorClick(e: MouseEvent) {
        var f = <HTMLAnchorElement>e.target;
        for (; f && "A" !== f.tagName;) {
            f = <HTMLAnchorElement>f.parentNode
        }
        if ("A" !== f?.tagName) {
            return
        }
        this.anchor(<any>[f]);
    }
    /** 净化a标签 */
    anchor(list: NodeListOf<HTMLAnchorElement>) {
        list.forEach(d => {
            if (!d.href) return;
            d.href = this.clear(d.href);
        });
    }
}
/** url净化组件 */
export const urlCleaner = new UrlCleaner();