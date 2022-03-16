interface modules {
    /** url清理 */
    readonly "parameterTrim.js": string;
}
namespace API {
    class ParameterTrim {
        /** 原始url */
        url: string[] = [];
        /** 垃圾参数 */
        param = {
            spm_id_from: undefined,
            from_source: undefined,
            msource: undefined,
            bsource: undefined,
            seid: undefined,
            source: undefined,
            session_id: undefined,
            visit_id: undefined,
            sourceFrom: undefined,
            from_spmid: undefined,
            share_source: undefined,
            share_medium: undefined,
            share_plat: undefined,
            share_session_id: undefined,
            share_tag: undefined,
            unique_k: undefined,
            from: "search"
        };
        /** url处理 */
        location() {
            this.url[1] = location.href; // 暂存URL，以便比较URL变化
            if (this.url[0] != this.url[1]) {
                let href = this.triming(location.href); // 处理链接
                window.history.replaceState(window.history.state, "", href); // 推送到地址栏
                this.url[0] = location.href; // 刷新暂存
            }
        }
        anchor(list: NodeListOf<HTMLAnchorElement>) {
            list.forEach(d => {
                if (!d.href) return;
                d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com")); // tv域名失效
                d.href.includes("www.bilibili.com/tag") && (d.href = d.href.replace("tag", "topic")); // 视频标签失效
                d.href.includes("account.bilibili.com/login?act=exit") && (d.href = "javascript:void(0);", d.onclick = () => loginExit()); // 修复退出页面
                d.href = this.triming(d.href);
            });
        }
        /**
         * 处理引导
         * @param url 源URL
         * @returns URL
         */
        triming(url: string) {
            const obj = new UrlFormat(url);
            obj.params.bvid && (obj.searchParams.aid = <string>abv(obj.params.bvid), delete obj.searchParams.bvid); // 旧版页面一般不支持bvid，转化为aid
            obj.params.aid && (!Number(obj.params.aid)) && (obj.searchParams.aid = <string>abv(obj.params.aid)); // 部分写作aid读作bvid也得转化
            Object.entries(this.param).forEach(d => {
                (!d[1] || obj.params[d[0]] == d[1]) && (obj.searchParams[d[0]] = <string>d[1], obj.hashParams[d[0]] = <string>d[1]);
            });
            return obj.toJSON().replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, s => "av" + abv(s)); // 非参数型bv号转化为av号;
        }
        click(e: MouseEvent) { // 代码copy自B站spm.js
            var f = <HTMLAnchorElement>e.target;
            for (; f && "A" !== f.tagName;) {
                f = <HTMLAnchorElement>f.parentNode
            }
            if ("A" !== (null == f ? void 0 : f.tagName)) {
                return
            }
            f.href && (f.href = this.triming(f.href))
        }
    }
    const parameterTrim = new ParameterTrim();
    parameterTrim.location(); // 清理网址
    switchVideo(() => { parameterTrim.location() });
    observerAddedNodes((node) => { // 清理新注入节点的a标签
        setTimeout(() => {
            node.querySelectorAll && parameterTrim.anchor(node.querySelectorAll("a"));
            node.tagName == "A" && parameterTrim.anchor(<any>[node]);
        });
    })
    window.addEventListener("click", e => parameterTrim.click(e), !1); // spm参数在DOM回调中注入，冒泡到window便能将其抹去

}