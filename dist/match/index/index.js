/**
 * 本模块负责重写B站旧版主页
 */
API.path.name = "index";
(async function () {
    try {
        // 准备__INITIAL_STATE__
        await new Promise(r => {
            if (!window.__INITIAL_STATE__ && !window.__INITIAL_DATA__) {
                xhr({ url: location.href }).then(d => {
                    let data = d.includes("__INITIAL_STATE__=") ? d.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : "";
                    if (data)
                        API.importModule("index-html.js", { __INITIAL_STATE__: data });
                    else {
                        data = d.includes("__INITIAL_DATA__=") ? d.match(/INITIAL_DATA__=.+?<\/script>/)[0].replace(/INITIAL_DATA__=/, "").replace(/<\/script>/, "") : "";
                        data && API.importModule("index-data.js", { __INITIAL_DATA__: data });
                    }
                    r(true);
                }).catch(e => { toast.error("获取主页数据出错！", e); API.importModule("vector.js"); });
            }
            else if (window.__INITIAL_STATE__) {
                API.importModule("index-html.js", { __INITIAL_STATE__: JSON.stringify(window.__INITIAL_STATE__) });
                r(true);
            }
            else if (window.__INITIAL_DATA__) {
                API.importModule("index-data.js", { __INITIAL_DATA__: JSON.stringify(window.__INITIAL_DATA__) });
                r(true);
            }
        });
        // __INITIAL_STATE__类型保护
        const isINDEX__INITIAL_STATE__ = (pet) => true;
        if (isINDEX__INITIAL_STATE__(API.__INITIAL_STATE__)) {
            window.__INITIAL_STATE__ = API.__INITIAL_STATE__;
            API.rewriteHTML(API.getModule("index.html"));
            // 移除无效节点
            API.runWhile(() => document.querySelector(".ver"), () => { var _a; return (_a = document.querySelector(".ver")) === null || _a === void 0 ? void 0 : _a.remove(); });
            API.runWhile(() => document.querySelector("#fixed_app_download"), () => { var _a; return (_a = document.querySelector("#fixed_app_download")) === null || _a === void 0 ? void 0 : _a.remove(); });
            // 修复失效分区
            API.importModule("indexSort.js");
        }
    }
    catch (e) {
        API.trace(e, "index.js", true);
        API.importModule("vector.js");
    }
})();
