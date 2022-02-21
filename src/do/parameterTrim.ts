interface modules {
    /**
     * 网址及超链接清理，转化BV=>av等操作。
     */
    readonly "parameterTrim.js": string;
}
class ParameterTrim {
    /**
     * 过滤参数
     * */
    param = [
        "spm_id_from",
        "from_source",
        "msource",
        "bsource",
        "seid",
        "source",
        "session_id",
        "visit_id",
        "sourceFrom",
        "from_spmid",
        "share_source",
        "share_medium",
        "share_plat",
        "share_session_id",
        "share_tag",
        "unique_k"
    ];
    /**
     * 地址变动参考
     */
    url: string[] = [];
    /**
     * 地址栏
     */
    location() {
        this.url[1] = location.href; // 暂存URL，以便比较URL变化
        if (this.url[0] != this.url[1]) {
            let href = this.triming(location.href); // 处理链接
            window.history.replaceState(window.history.state, "", href); // 推送到地址栏
            this.url[0] = location.href; // 刷新暂存
        }
    }
    /**
     * 处理a标签
     * @param list a标签集
     */
    anchor(list: any) {
        list.forEach((d: HTMLAnchorElement) => {
            if (!d.href) return;
            d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com")); // 重定向tv域名
            d.href.includes("www.bilibili.com/tag") && (d.href = d.href.replace("tag", "topic")); // 重定向视频标签
            d.href.includes("account.bilibili.com/login?act=exit") && (d.href = "javascript:void(0);", d.onclick = () => API.loginExit()); // 修复退出页面
            d.href = this.triming(d.href);
        })
    }
    /**
     * 处理引导
     * @param url 源URL
     * @returns URL
     */
    triming(url: string) {
        const obj = Format.urlObj(url);
        obj.bvid && (obj.aid = <string>API.abv(obj.bvid), obj.bvid = undefined); // 旧版页面一般不支持bvid，转化为aid
        obj.aid && !Number(obj.aid) && (obj.aid = <string>API.abv(obj.aid)); // 部分写作aid读作bvid也得转化
        obj.from == "search" && (obj.from = undefined); // from=search 在直播页面是有效参数
        this.param.forEach(d => obj[d] = undefined); // 清理参数，undefined在objUrl中会被过滤
        return Format.objUrl(url, obj).replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, s => "av" + API.abv(s)); // 非参数型bv号转化为av号
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
{
    const parameterTrim = new ParameterTrim();
    parameterTrim.location(); // 清理网址
    API.switchVideo(() => { parameterTrim.location() });
    API.observerAddedNodes(async (node) => { // 清理新注入节点的a标签
        node.querySelectorAll && parameterTrim.anchor(node.querySelectorAll("a"));
        node.tagName == "A" && parameterTrim.anchor([node]);
    })
    window.addEventListener("click", e => parameterTrim.click(e), !1); // spm参数在DOM回调中注入，冒泡到window便能将其抹去
}