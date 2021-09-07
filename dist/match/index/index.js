/**
 * 本模块负责重写B站旧版主页
 */
(function () {
    try {
        API.path.name = "index";
        // 准备__INITIAL_STATE__
        new Promise(r => {
            if (!window.__INITIAL_STATE__ && !window.__INITIAL_DATA__) {
                xhr({ url: location.href }).then(d => {
                    d = d.includes("__INITIAL_STATE__=") ? d.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : "";
                    API.importModule("index-html.js", { __INITIAL_STATE__: d });
                    r(true);
                }).catch(e => { toast.error("获取主页数据出错！", e); });
            }
            else if (window.__INITIAL_STATE__) {
                API.importModule("index-html.js", { __INITIAL_STATE__: JSON.stringify(window.__INITIAL_STATE__) });
                r(true);
            }
            else if (window.__INITIAL_DATA__) {
                API.importModule("index-data.js", { __INITIAL_DATA__: JSON.stringify(window.__INITIAL_DATA__) });
                r(true);
            }
        }).finally(() => {
            // __INITIAL_STATE__类型保护
            const isINDEX__INITIAL_STATE__ = (pet) => true;
            if (isINDEX__INITIAL_STATE__(API.__INITIAL_STATE__)) {
                window.__INITIAL_STATE__ = API.__INITIAL_STATE__;
                API.rewriteHTML(API.getModule("index.html"));
                // 移除无效节点
                API.runWhile(() => document.querySelector(".ver"), () => document.querySelector(".ver")?.remove());
                API.runWhile(() => document.querySelector("#fixed_app_download"), () => document.querySelector("#fixed_app_download")?.remove());
                // 修复失效分区
                API.importModule("indexSort.js");
            }
        });
    }
    catch (e) {
        API.trace(e, "index.js", true);
    }
})();
