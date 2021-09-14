/**
 * 本模块负责重写B站旧版主页
 */
try {
    class Index {
        // __INITIAL_STATE__类型保护
        isINDEX__INITIAL_STATE__ = (pet: AV__INITIAL_STATE__ | BANGUMI__INITIAL_STATE__ | INDEX__INITIAL_STATE__): pet is INDEX__INITIAL_STATE__ => true;
        constructor() {
            API.path.name = "index";
            config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
        }
        async prepareA() {
            await new Promise(r => {
                if (!(<any>window).__INITIAL_STATE__ && !((<any>window).__INITIAL_DATA__ && (<any>window).__INITIAL_DATA__[0])) {
                    (<Promise<string>>xhr({ url: location.href })).then(d => {
                        let data = d.includes("__INITIAL_STATE__=") ? d.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : "";
                        if (data) API.importModule("index-html.js", { __INITIAL_STATE__: data });
                        else {
                            data = d.includes("__INITIAL_DATA__=") ? d.match(/INITIAL_DATA__=.+?<\/script>/)[0].replace(/INITIAL_DATA__=/, "").replace(/<\/script>/, "") : "";
                            data && API.importModule("index-data.js", { __INITIAL_DATA__: data });
                        }
                        r(true);
                    }).catch(e => { toast.error("获取主页数据出错！", e); API.importModule("vector.js"); })
                } else if ((<any>window).__INITIAL_STATE__) {
                    API.importModule("index-html.js", { __INITIAL_STATE__: JSON.stringify((<any>window).__INITIAL_STATE__) });
                    r(true);
                } else if ((<any>window).__INITIAL_DATA__) {
                    API.importModule("index-data.js", { __INITIAL_DATA__: JSON.stringify((<any>window).__INITIAL_DATA__) });
                    r(true);
                }
            })
            this.write();
        }
        prepareB() {
            if (!(<any>window).__INITIAL_STATE__ && !((<any>window).__INITIAL_DATA__ && (<any>window).__INITIAL_DATA__[0])) {
                let d = xhr({ url: location.href, async: false });
                let data = d.includes("__INITIAL_STATE__=") ? d.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : "";
                if (data) API.importModule("index-html.js", { __INITIAL_STATE__: data });
                else {
                    data = d.includes("__INITIAL_DATA__=") ? d.match(/INITIAL_DATA__=.+?<\/script>/)[0].replace(/INITIAL_DATA__=/, "").replace(/<\/script>/, "") : "";
                    data && API.importModule("index-data.js", { __INITIAL_DATA__: data });
                }
            } else if ((<any>window).__INITIAL_STATE__) {
                API.importModule("index-html.js", { __INITIAL_STATE__: JSON.stringify((<any>window).__INITIAL_STATE__) });
            } else if ((<any>window).__INITIAL_DATA__) {
                API.importModule("index-data.js", { __INITIAL_DATA__: JSON.stringify((<any>window).__INITIAL_DATA__) });
            }
            this.write();
        }
        write() {
            if (this.isINDEX__INITIAL_STATE__(API.__INITIAL_STATE__)) {
                (<any>window).__INITIAL_STATE__ = API.__INITIAL_STATE__;
                API.rewriteHTML(API.getModule("index.html"));
                // 移除无效节点
                API.runWhile(() => document.querySelector(".ver"), () => document.querySelector(".ver")?.remove());
                API.runWhile(() => document.querySelector("#fixed_app_download"), () => document.querySelector("#fixed_app_download")?.remove());
                // 修复失效分区
                API.importModule("indexSort.js");
            }
        }
    }
    new Index();
} catch (e) { API.trace(e, "index.js", true); API.importModule("vector.js"); }