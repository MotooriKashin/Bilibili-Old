/**
 * 脚本主入口，因为运行上下文为独立的沙盒，功能实现极不方便，实际负责提供接口和切换运行上下文并引导实际入口`main`。
 */
(function () {
    new Function("GM", "modules", "config", "debug", "Format", "toast", "xhr", modules["main.js"])(GM, modules, config, debug, Format, toast, xhr);
})();