/**
 * 本模块负责处理URL，包括地址栏和a标签
 */
(function () {
    try {
        class ParameterTrim {
            /**
             * 过滤参数
             */
            param = {
                "spm_id_from": null,
                "from_source": null,
                "msource": null,
                "bsource": null,
                "seid": null,
                "source": null,
                "session_id": null,
                "visit_id": null,
                "sourceFrom": null,
                "from_spmid": null,
                "share_source": null,
                "share_medium": null,
                "share_plat": null,
                "share_session_id": null,
                "share_tag": null,
                "unique_k": null,
            };
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
                    window.history.replaceState(null, "", href); // 推送到地址栏
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
                    d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com"));
                    d.href.includes("www.bilibili.com/tag") && (d.href = d.href.replace("tag", "topic"));
                    d.href.includes("account.bilibili.com/login?act=exit") && (d.href = "javascript:void(0);", d.onclick = () => API.loginExit());
                    (!/^.+:/.test(d.href) || /^(https?:)?\/\//.test(d.href)) && (d.href = this.triming(d.href));
                })
            }
            /**
             * 处理引导
             * @param url 源URL
             * @returns URL
             */
            triming(url: string) {
                const search = API.urlObj(url);
                search.bvid && (search.aid = <string>API.abv(search.bvid));
                search.aid && !Number(search.aid) && (search.aid = <string>API.abv(search.aid));
                (search.from && search.from == "search") && (search.from = null);
                let rsearch = { ...search, ...this.param };
                const hash = url.split("#");
                let shash = (hash[1] && url.includes("?") && !hash[1].includes("?")) ? hash[1] : "";
                return API.objUrl(url.split("?")[0], rsearch).replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, s => "av" + API.abv(s)) + shash;
            }
            click(e: MouseEvent) {
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
        // @ts-ignore 重写标记
        if (Before) return parameterTrim.location();
        API.switchVideo(() => { parameterTrim.location() });
        API.observerAddedNodes(async (node) => {
            node.querySelectorAll && parameterTrim.anchor(node.querySelectorAll("a"));
            node.tagName == "A" && parameterTrim.anchor([node]);
        })
        document.addEventListener("click", e => parameterTrim.click(e), !1);
    } catch (e) { debug.error("parameterTrim.js", e) }
})();