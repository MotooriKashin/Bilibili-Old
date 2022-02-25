(function () {
    /** 入口点，切换上下文环境回页面 */
    new Function("GM", "modules", <string>modules["main.js"])(GM, modules);
})();