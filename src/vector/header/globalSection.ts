interface modules {
    /** 替换全体顶栏 */
    readonly "globalSection.js": string;
    readonly "avatarAnimation.css": string;
}
namespace API {
    /** 加载底栏脚本 */
    async function header(menu = false) {
        if (menu) {
            importModule("primaryMenu.js"); // 顶栏分区修正
            importModule("banner.js"); // 顶栏banner修复
        }
        if (!(<any>window).jQuery) await loadScript("//static.hdslb.com/js/jquery.min.js");
        loadScript("//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
    }
    /** 底栏脚本 **注意可能要主动出发window.load事件** */
    async function footer() {
        if (!(<any>window).jQuery) await loadScript("//static.hdslb.com/js/jquery.min.js");
        loadScript("//static.hdslb.com/common/js/footer.js");
    }
    addCss(".nav-item.live {width: auto;}.lt-row {display: none !important;}");
    // 顶栏
    doWhile(() => document.querySelector("#internationalHeader"), t => {
        let menu = false; // 是否完整类型
        if (
            document.querySelector(".mini-type")
            || /festival/.test(location.href)
        ) {
            menu = false
        }
        if (
            location.href.includes("blackboard/topic_list")
            || location.href.includes("blackboard/x/act_list")
            || document.querySelector(".large-header")
            || document.querySelector(".bili-banner")
        ) {
            menu = true;
        }
        t.setAttribute("class", `z-top-container${menu ? " has-menu" : ""}`);
        header(menu);
    })
    // 上古顶栏
    doWhile(() => document.querySelector(".z_top_container"), t => {
        t.setAttribute("class", "z-top-container has-menu");
        document.querySelector(".header")?.remove();
        header(true);
    })
    // 底栏
    doWhile(() => document.querySelector(".international-footer"), t => {
        t.setAttribute("class", "footer bili-footer report-wrap-module");
        t.setAttribute("id", "home_footer");
        footer()
    })
    // 鼠标放在顶栏上的动效
    doWhile(() => document.querySelector("#bili-header-m"), () => {
        addCss(getModule("avatarAnimation.css"));
    });
    // v3版顶栏
    doWhile(() => (document.body && document.body.classList.contains("header-v3")) || document.querySelector("#bili-header-container"), () => {
        document.body.classList.remove("header-v3");
        header(true);
    })
}