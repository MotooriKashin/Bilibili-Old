/**
 * 本模块代为维护了旧版动态时间线，载入优先级极高  
 * 部分类似功能一并集成在此
 */
(function () {
    API.uid = API.getCookies().DedeUserID;
    API.path = location.href.split("/");
    if (API.uid) {
        // 代理旧版退出登录页面
        if (location.href.includes("bilibili.com/login?act=exit")) API.loginExit(document.referrer);
        // 修复动态时间线
        let offset = API.getCookies()["bp_video_offset_" + API.uid];
        offset && (document.cookie = "bp_t_offset_" + API.uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; BLOD.path=/");
    }
})();