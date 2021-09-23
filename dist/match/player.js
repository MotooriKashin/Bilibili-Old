/**
 * 本模块负责重写旧版嵌入播放器
 */
(function () {
    try {
        API.path.name = "player";
        // 备份还原旧版播放器设置数据
        const obj = API.urlObj(location.href);
        obj.avid && (Number(obj.avid) ? Reflect.set(window, "aid", obj.avid) : Reflect.set(window, "aid", API.abv(obj.avid)));
        !Reflect.has(window, "aid") && obj.bvid && Reflect.set(window, "aid", API.abv(obj.bvid));
        obj.cid && Number(obj.cid) && Reflect.set(window, "cid", obj.cid);
        API.restorePlayerSetting();
        API.rewriteHTML(API.getModule("player.html"));
    }
    catch (e) {
        API.trace(e, "player.js", true);
    }
})();
