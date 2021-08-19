"use strict";
/**
 * 本模块提供一些小函数，这些函数没有大到专门添加为一个模块
 */
(function () {
    /**
     * json化xhr返回值
     * @param data xhr返回的response
     * @returns 转化成`json`的xhr.response
     */
    API.jsonCheck = (data) => {
        let result = typeof data === "string" ? JSON.parse(data) : data;
        if ("code" in result && result.code !== 0) {
            let msg = result.msg || result.message || "";
            throw [result.code, msg];
        }
        return result;
    };
    /**
     * 计算当前节点相对于文档的垂直偏移
     * @param  node 所需计算的节点
     * @returns  相对于文档的垂直便宜，单位/px
     */
    API.getTotalTop = (node) => {
        var sum = 0;
        do {
            sum += node.offsetTop;
            node = node.offsetParent;
        } while (node);
        return sum;
    };
    /**
     * 滚动到播放器
     */
    API.bofqiToView = () => {
        let str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
        let node = str.reduce((s, d) => {
            s = s || document.querySelector(d);
            return s;
        }, document.querySelector("#__bofqi"));
        node && node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    /**
     * 退出登录
     * @param referer 退出成功后跳转的页面URL
     */
    API.loginExit = async (referer) => {
        if (!API.uid)
            return API.toast.warning("本就未登录，无法退出登录！");
        API.toast.warning("正在退出登录...");
        let data = API.jsonCheck(await API.xhr({
            url: "https://passport.bilibili.com/login/exit/v2",
            data: `biliCSRF=${API.getCookies().bili_jct}&gourl=${encodeURIComponent(location.href)}`,
            method: "POST",
        }));
        if (data.status) {
            API.toast.success("退出登录！");
            if (referer)
                return location.replace(referer);
            setTimeout(() => location.reload(), 1000);
        }
    };
    /**
     * 捕获指定的变量并存储到API的同名属性中
     * 注意：配置如指定`record`属性可以修改储存到API中的属性名
     * **使用本函数务必拓展API对象的声明以确保类型检查有target/record对应的属性名**
     * @param obj 捕获配置
     */
    API.getVariable = (obj) => {
        let temp = {};
        obj.configurable = obj.configurable || true;
        obj.record = obj.record || obj.target;
        temp.set = (v) => API[obj.record] = v;
        temp.get = () => obj.hasOwnProperty("result") ? obj.result : API[obj.record];
        obj.configurable && (temp.configurable = true);
        Object.defineProperty(obj.origin, obj.target, temp);
    };
    /**
     * 拉起B站快捷登陆方法
     */
    API.biliQuickLogin = () => {
        window.biliQuickLogin ? window.biliQuickLogin() : window.$ ? window.$.getScript("//static.hdslb.com/account/bili_quick_login.js", () => window.biliQuickLogin()) : false;
    };
    /**
     * 获取网页框架
     * @param html 网页框架名
     * @returns 网页框架文本
     */
    API.getHTMLFrame = (html) => {
        html = GM.getResourceText(html);
        if (!config.proxyScript)
            return html;
        let comment = config.oldReply ? "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c74067196af49a16cb6e520661df7d4d1e7f04e5/src/comment.min.js" : "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/comment.min.js";
        html = html.replace("//static.hdslb.com/js/video.min.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/video.min.js");
        html = html.replace("//static.hdslb.com/player/js/bilibiliPlayer.min.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/bilibiliPlayer.min.js");
        // CDN未更新前，两种conment.js都匹配一次
        html = html.replace("//static.hdslb.com/phoenix/dist/js/comment.min.js", comment);
        html = html.replace("//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js", comment);
        html = html.replace("//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/JavaScript/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js");
        return html;
    };
    /**
     * 循环检查然后执行回调函数
     * @param term 检查为真的条件
     * @param callback 条件为真时执行的回调函数
     * @param delay 循环检查的时间间隔：/ms，默认100ms
     * @param stop 如果条件永远达不到，多长时间后停止检查：/s，默认3分钟
     */
    API.runWhile = (term, callback, delay = 100, stop = 180) => {
        let timer = setInterval(() => {
            if (term()) {
                clearInterval(timer);
                callback();
            }
        }, delay);
        setTimeout(() => clearInterval(timer), stop * 1000);
    };
})();
