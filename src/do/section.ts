interface modules {
    /** 还原旧版顶栏 */
    readonly "section.js": string;
    readonly "avatarAnimation.css": string;
}
namespace API {
    // 替换顶栏
    runWhile(() => document.querySelector("#internationalHeader"), () => {
        if (path.name) return;
        addCss(".nav-item.live {width: auto;}");
        (<HTMLDivElement>document.querySelector("#internationalHeader")).setAttribute("style", "visibility:hidden;");
        (!(<any>window).$?.ajax) && addElement("script", { type: "text/javascript", src: "//static.hdslb.com/js/jquery.min.js" }, undefined, undefined, true);
        ((document.querySelector(".mini-type") &&
            !location.href.includes("blackboard/topic_list") &&
            !location.href.includes("blackboard/x/act_list")) ||
            /festival/.test(location.href)) ?
            addElement("div", { class: "z-top-container" }, undefined, undefined, true) :
            addElement("div", { class: "z-top-container has-menu" }, undefined, undefined, true);
        addElement("script", { type: "text/javascript", src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js" });
    })
    // 替换底栏
    runWhile(() => document.querySelector(".international-footer"), () => {
        if (path.name) return;
        (<HTMLDivElement>document.querySelector(".international-footer")).remove();
        (!(<any>window).$?.ajax) && addElement("script", { type: "text/javascript", src: "//static.hdslb.com/js/jquery.min.js" }, undefined, undefined, true);
        addElement("div", { class: "footer bili-footer report-wrap-module", id: "home_footer" });
        addElement("script", { type: "text/javascript", src: "//static.hdslb.com/common/js/footer.js" });
    })
    // 移除新版顶栏
    runWhile(() => document.querySelector("#bili-header-m"), () => {
        (<HTMLDivElement>document.querySelector("#internationalHeader"))?.remove();
        addCss(getModule("avatarAnimation.css"));
    })
    // 替换第三版顶栏
    runWhile(() => document.body.classList.contains("header-v3"), () => {
        if (path.name) return;
        document.body.classList.remove("header-v3");
        loadScript("//s1.hdslb.com/bfs/seed/jinkela/header/header.js")//, () => document.body.classList.remove("header-v3"));
    })
}