/**
 * 本模块负责重写番剧分区主页
 * 本模块未正式启用及完善，待cookies完全失效后再说
 */
(function () {
    try {
        class Anime {
            constructor() {
                API.path.name = "anime";
                this.write()
            }
            write() {
                API.rewriteHTML(API.getModule("anime.html"));
            }
        }
        new Anime();
    } catch (e) { debug.error("anime.js", e); API.importModule("vector.js"); }
})()