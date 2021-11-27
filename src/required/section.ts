/**
 * 本模块负责替换全局顶栏和底栏
 */
(function () {
    try {
        API.runWhile(() => document.querySelector("#internationalHeader"), () => {
            if (API.path.name) return;
            API.addCss(".nav-item.live {width: auto;}");
            (<HTMLDivElement>document.querySelector("#internationalHeader")).setAttribute("style", "visibility:hidden;");
            (!(<any>window).$?.ajax) && API.addElement("script", { type: "text/javascript", src: "//static.hdslb.com/js/jquery.min.js" }, undefined, undefined, true);
            (document.querySelector(".mini-type") && !location.href.includes("blackboard/topic_list") && !location.href.includes("blackboard/x/act_list")) ? API.addElement("div", { class: "z-top-container" }, undefined, undefined, true) : API.addElement("div", { class: "z-top-container has-menu" }, undefined, undefined, true);
            API.addElement("script", { type: "text/javascript", src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js" });
        })
        API.runWhile(() => document.querySelector(".international-footer"), () => {
            if (API.path.name) return;
            (<HTMLDivElement>document.querySelector(".international-footer")).remove();
            (!(<any>window).$?.ajax) && API.addElement("script", { type: "text/javascript", src: "//static.hdslb.com/js/jquery.min.js" }, undefined, undefined, true);
            API.addElement("div", { class: "footer bili-footer report-wrap-module", id: "home_footer" });
            API.addElement("script", { type: "text/javascript", src: "//static.hdslb.com/common/js/footer.js" });
        })
        API.runWhile(() => document.querySelector("#bili-header-m"), () => {
            (<HTMLDivElement>document.querySelector("#internationalHeader"))?.remove();
            API.addCss(API.getModule("avatarAnimation.css"));
        })
    } catch (e) { debug.error("section.js", e) }
})();