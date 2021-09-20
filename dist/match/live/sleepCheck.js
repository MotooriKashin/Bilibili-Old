/**
 * 本模块负责禁用直播间挂机检测
 */
(function () {
    try {
        const fun = setInterval;
        let flag = 0;
        window.setInterval = (...args) => {
            if (args[1] && args[1] == 300000 && args[0] && args[0].toString() == "function(){e.triggerSleepCallback()}") {
                if (!flag) {
                    toast.warning("成功阻止直播间挂机检测！");
                    flag++;
                }
                return Number.MIN_VALUE;
            }
            return fun.call(window, ...args);
        };
    }
    catch (e) {
        API.trace(e, "sleepCheck.js", true);
    }
})();
