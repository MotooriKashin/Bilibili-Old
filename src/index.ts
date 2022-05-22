(function () {
    /** 入口点，切回上下文环境 */
    new Function("GM", "modules", <string>modules["main.js"])(GM, modules);
})();