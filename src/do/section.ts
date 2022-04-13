interface modules {
    /** 还原旧版顶栏 */
    readonly "section.js": string;
    readonly "avatarAnimation.css": string;
}
namespace API {
    // 替换顶栏
    runWhile(() => document.querySelector("#internationalHeader"), async () => {
        if (path.name) return;
        addCss(".nav-item.live {width: auto;}");
        (<HTMLDivElement>document.querySelector("#internationalHeader")).setAttribute("style", "visibility:hidden;");
        if (!(<any>window).$?.ajax) await loadScript("//static.hdslb.com/js/jquery.min.js");
        ((document.querySelector(".mini-type") &&
            !location.href.includes("blackboard/topic_list") &&
            !location.href.includes("blackboard/x/act_list")) ||
            /festival/.test(location.href)) ?
            addElement("div", { class: "z-top-container" }, undefined, undefined, true) :
            addElement("div", { class: "z-top-container has-menu" }, undefined, undefined, true);
        loadScript("//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
    })
    // 替换底栏
    runWhile(() => document.querySelector(".international-footer"), async () => {
        if (path.name) return;
        (<HTMLDivElement>document.querySelector(".international-footer")).remove();
        if (!(<any>window).$?.ajax) await loadScript("//static.hdslb.com/js/jquery.min.js");
        addElement("div", { class: "footer bili-footer report-wrap-module", id: "home_footer" });
        loadScript("//static.hdslb.com/common/js/footer.js");
    })
    // 移除新版顶栏
    runWhile(() => document.querySelector("#bili-header-m"), () => {
        (<HTMLDivElement>document.querySelector("#internationalHeader"))?.remove();
        addCss(getModule("avatarAnimation.css"));
    })
    // 替换第三版顶栏
    runWhile(() => (document.body && document.body.classList.contains("header-v3")) || document.querySelector("#bili-header-container"), async () => {
        if (path.name) return;
        document.body.classList.remove("header-v3");
        if (!(<any>window).$?.ajax) await loadScript("//static.hdslb.com/js/jquery.min.js");
        loadScript("//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
    })
}