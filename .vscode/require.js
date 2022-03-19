// 构建模块封装require.js
const fs = require("fs");
const files = require("./files").getFiles;

const path = ["CSS", "HTML", "Json", "dist"]; // 遍历路径
const exclude = ["Json/pl769.json", "dist/index.js", "dist/require.js", "dist/bilibiliPlayer.js", "dist/comment.js"]; // 排除路径关键词
console.log("%c封装模块文件>>>", "color: yellow;");
new files(path, exclude).run().then(d => {
    let modules = ""; // 模块打包处
    let data = d.reduce((s, d) => {
        if (!d.path.includes("/require")) { // 封装普通模块
            if (d.path.endsWith(".json")) {
                modules += `\r\n/**/modules["${d.fileFullName}"] = /*** .${d.path.slice(1)} ***/\r\n${String(d.data)}\r\n/*!***********************!*/`;
            } else if (d.path.endsWith(".js")) {
                modules += `\r\n/**/modules["${d.fileFullName}"] = /*** .${d.path.slice(1)} ***/\r\n\`${String(d.data).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/var API;[\s\S]+\(API\) \{\r?\n/, "").replace(/\}\)\(API \|\| \(API = \{\}\)\);[\s\S]+$/, "")}\r\n//# sourceURL=API://@${d.path.slice(2).replace("dist", "Bilibili-Old")}\`;\r\n/*!***********************!*/`;
                fs.promises.rm(d.path);
            } else {
                modules += `\r\n/**/modules["${d.fileFullName}"] = /*** .${d.path.slice(1)} ***/\r\n\`${String(d.data).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;\r\n/*!***********************!*/`;
            }
        }
        else s += String(d.data); // 预加载模块无需封装
        return s;
    }, "");
    data = data + modules;
    fs.writeFile("./dist/require.js", data, () => { });
});