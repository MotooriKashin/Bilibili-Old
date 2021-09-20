/**
 * 移除未登录弹窗
 */
(function () {
    try {
        API.runWhile(() => document.querySelector(".lt-row"), () => document.querySelector(".lt-row").remove());
        API.runWhile(() => document.querySelector(".unlogin-popover"), () => document.querySelector(".unlogin-popover").remove());
    }
    catch (e) {
        API.trace(e, "unloginPopover.js");
    }
})();
