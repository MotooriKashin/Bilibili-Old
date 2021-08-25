"use strict";
/**
 * 本模块负责恢复翻页评论区
 */
(function () {
    class ReplyList {
        init() {
            // 拦截评论脚本
            if (window.bbComment)
                return this.cover(); // 评论已载入直接覆盖
            // 监听评论脚本载入并覆盖
            Object.defineProperty(window, "bbComment", {
                set: () => { this.cover(); },
                get: () => undefined,
                configurable: true
            });
        }
        cover() {
            delete window.bbComment; // 取消拦截
            API.importModule("reply"); // 载入新评论脚本
        }
    }
})();
