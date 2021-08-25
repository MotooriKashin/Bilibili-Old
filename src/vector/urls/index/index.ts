/**
 * 本模块负责重写B站旧版主页
 */
(function () {
    API.path.name = "watchlater";
    try {
        // 准备__INITIAL_STATE__
        if (!(<any>window).__INITIAL_STATE__) {
            let data = API.xhr({ url: location.href, async: false });
            data = data.includes("__INITIAL_STATE__=") ? data.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : "";
            if (!data) throw new Error("获取源__INITIAL_STATE__失败！")
            API.importModule("index-html.js", { __INITIAL_STATE__: data });
        } else {
            let data = JSON.stringify((<any>window).__INITIAL_STATE__);
            API.importModule("index-html.js", { __INITIAL_STATE__: data })
        }
        // __INITIAL_STATE__类型保护
        const isINDEX__INITIAL_STATE__ = (pet: AV__INITIAL_STATE__ | BANGUMI__INITIAL_STATE__ | INDEX__INITIAL_STATE__): pet is INDEX__INITIAL_STATE__ => true;
        if (isINDEX__INITIAL_STATE__(API.__INITIAL_STATE__)) {
            (<any>window).__INITIAL_STATE__ = API.__INITIAL_STATE__;
            API.rewriteHTML(API.getHTMLFrame("index.html"));
            // 移除无效节点
            API.runWhile(() => document.querySelector(".ver"), () => document.querySelector(".ver")?.remove());
            API.runWhile(() => document.querySelector("#fixed_app_download"), () => document.querySelector("#fixed_app_download")?.remove());
            // 修复失效分区
            API.importModule("indexSort.js");
        }
    } catch (e) { API.debug.trace(e, "index.js", true) }
})();