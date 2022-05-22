interface modules {
    /** 新版弹幕相关 */
    readonly "protobufDanmaku.js": string;
}
namespace API {
    config.protobufDanmaku && importModule("listSoDanmaku.js");
    importModule("historyDanmaku.js");
    importModule("liveDanmaku.js");
}