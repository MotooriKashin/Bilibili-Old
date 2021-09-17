/**
 * 本模块负责处理URL，包括地址栏和a标签
 */
(function () {
    class ParameterTrim {
        constructor() {
            /**
             * 过滤参数
             */
            this.param = {
                "spm_id_from": null,
                "from_source": null,
                "msource": null,
                "bsource": null,
                "seid": null,
                "source": null,
                "session_id": null,
                "visit_id": null,
                "sourceFrom": null,
                "from_spmid": null
            };
            /**
             * 地址变动参考
             */
            this.url = [];
        }
        /**
         * 地址栏
         */
        location() {
            this.url[1] = location.href; // 暂存URL，以便比较URL变化
            if (this.url[0] != this.url[1]) {
                let href = this.triming(location.href); // 处理链接
                if (!href.includes("#") && location.href.includes("#"))
                    href = href + location.hash; // 还原锚
                window.history.replaceState(null, "", href); // 推送到地址栏
                this.url[0] = location.href; // 刷新暂存
            }
        }
        /**
         * 处理a标签
         * @param list a标签集
         */
        anchor(list) {
            list.forEach((d) => {
                if (!d.href)
                    return;
                let hash = (d.href.includes("?") && d.href.split("#")[1]) || "";
                d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com"));
                d.href.includes("www.bilibili.com/tag") && (d.href = d.href.replace("tag", "topic"));
                d.href.includes("account.bilibili.com/login?act=exit") && (d.href = "javascript:void(0);", d.onclick = () => API.loginExit());
                d.href = this.triming(d.href) + (hash ? "#" + hash : "");
            });
        }
        /**
         * 处理引导
         * @param url 源URL
         * @returns URL
         */
        triming(url) {
            let obj = this.search(url);
            url = this.hash(url);
            return API.objUrl(url, obj);
        }
        /**
         * 处理查询参数部分
         * @param url 源URL
         * @returns 参数对象
         */
        search(url) {
            let obj = API.urlObj(url);
            obj.bvid && (obj.aid = API.abv(obj.bvid)); // 存在bvid，添加aid
            obj.aid && !Number(obj.aid) && (obj.aid = API.abv(obj.aid)); // aid误为bvid，转化
            (obj.from && obj.from == "search") && (obj.from = null);
            obj = { ...obj, ...this.param };
            return obj;
        }
        /**
         * 处理非查询部分
         * @param url 源URL
         * @returns URL
         */
        hash(url) {
            let arr = url.split("?")[0].split("/"); // 分割URL
            arr.forEach((d, i, e) => {
                d.includes("#") && (d = d.split("#")[0]);
                (d.toLowerCase().startsWith('bv')) && (e[i] = "av" + API.abv(d));
            });
            return arr.join("/");
        }
        click(e) {
            var f = e.target;
            for (; f && "A" !== f.tagName;) {
                f = f.parentNode;
            }
            if ("A" !== (null == f ? void 0 : f.tagName)) {
                return;
            }
            f.href && (f.href = this.triming(f.href));
        }
    }
    const parameterTrim = new ParameterTrim();
    parameterTrim.location();
    API.switchVideo(() => { parameterTrim.location(); });
    API.observerAddedNodes(async (node) => {
        node.querySelectorAll && parameterTrim.anchor(node.querySelectorAll("a"));
        node.tagName == "A" && parameterTrim.anchor([node]);
    });
    document.addEventListener("click", e => parameterTrim.click(e), !1);
})();
