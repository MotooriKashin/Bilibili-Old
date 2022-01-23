/**
 * 本模块负责重写B站旧版主页
 */
(function () {
    try {
        class Index {
            constructor() {
                API.path.name = "index";
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            async prepareA() {
                const data = (await xhr({
                    url: "https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=4694,34,31",
                    responseType: "json"
                })).data;
                let result = { locsData: { 23: data[4694], 34: data[34], 31: data[31] } };
                config.indexLoc && this.reAD(result);
                (<any>window).__INITIAL_STATE__ = result;
                this.write();
            }
            prepareB() {
                const data = API.jsonCheck(xhr({
                    url: "https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=4694,34,31",
                    async: false
                })).data;
                let result = { locsData: { 23: data[4694], 34: data[34], 31: data[31] } };
                config.indexLoc && this.reAD(result);
                (<any>window).__INITIAL_STATE__ = result;
                this.write();
            }
            reAD(data: any) {
                for (let key in data.locsData) {
                    if (Array.isArray(data.locsData[key])) {
                        data.locsData[key] = data.locsData[key].filter((d: any) => {
                            return d.is_ad ? (debug.debug("移除广告", key, d), false) : true;
                        })
                    }
                }
            }
            write() {
                (<any>window).__INITIAL_STATE__ = API.__INITIAL_STATE__;
                API.rewriteHTML(API.getModule("index.html"));
                // 移除无效节点
                API.runWhile(() => document.querySelector(".ver"), () => document.querySelector(".ver")?.remove());
                API.runWhile(() => document.querySelector("#fixed_app_download"), () => document.querySelector("#fixed_app_download")?.remove());
                // 修复失效分区
                API.importModule("indexSort.js");
                API.addCss(".bili-tab.rank-tab, .bili-dropdown.rank-dropdown { pointer-events: none; }");
            }
        }
        new Index();
    } catch (e) { toast.error("index.js", e); API.importModule("vector.js"); }
})();