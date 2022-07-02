import("fs-extra").then(d => {
    d.emptyDir("./dist").then(() => {
        // 源代码已打包大部分资源，以下是扩展以绝对路径访问的资源
        // 包括扩展 manifest 及其依赖和未打包的 css （`addCssEs`方法）样式
        d.copy("./src/manifest.json", "./dist/manifest.json");
        d.copy("./src/rules", "./dist/rules");
        d.copy("./src/images", "./dist/images");
        d.copy("./src/bilibili", "./dist/bilibili");
        d.copy("./src/_locales", "./dist/_locales");
        d.copy("./src/popup/popup.html", "./dist/popup/popup.html");
        d.copy("./src/popup/popup.css", "./dist/popup/popup.css");
        d.copy("./src/options/options.html", "./dist/options/options.html");
        d.copy("./src/options/options.css", "./dist/options/options.css");
        d.copy("./src/runtime/player/closedCaption.css", "./dist/runtime/player/closedCaption.css");
        d.copy("./src/runtime/danmaku/danmakuHashId.css", "./dist/runtime/danmaku/danmakuHashId.css");
        d.copy("./src/runtime/danmaku/commandDm.css", "./dist/runtime/danmaku/commandDm.css");
        d.copy("./src/content/player/bnj.css", "./dist/content/player/bnj.css");
        d.copy("./src/content/message/message.css", "./dist/content/message/message.css");
        d.copy("./src/content/global/avatarAnimation.css", "./dist/content/global/avatarAnimation.css");
        d.copy("./src/content/global/comment.css", "./dist/content/global/comment.css");
        d.copy("./src/content/av/upList.css", "./dist/content/av/upList.css");
    })
})