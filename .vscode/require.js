// 构建模块封装require.js
const fs = require("fs");
const files = require("./files").getFiles;

const path = ["src"]; // 遍历路径
const exclude = [ // 排除路径关键词
    "tsconfig.json", // TS配置文件
    ".ts", // 不可运行代码
    "src/index.js", // 脚本本源
    "src/require.js", // 资源缓存
    ".md" // 说明文档
];
console.log("%c封装模块文件>>>", "color: yellow;");
new files(path, exclude).run().then(d => {
    let modules = ""; // 模块打包处
    let data = d.reduce((s, d) => {
        if (!d.path.includes("/require")) { // 封装普通模块
            if (d.path.endsWith(".json")) {
                modules += `\r\n/**/modules["${d.fileFullName}"] = /*** .${d.path.slice(1)} ***/\r\n${String(d.data)}\r\n/*!***********************!*/`;
            } else if (d.path.endsWith(".js")) {
                modules += `\r\n/**/modules["${d.fileFullName}"] = /*** .${d.path.slice(1)} ***/\r\n\`${String(d.data).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/var API;[\s\S]+\(API\) \{\r?\n/, "").replace(/\}\)\(API \|\| \(API = \{\}\)\);[\s\S]+$/, "")}\r\n//# sourceURL=file://@${d.path.slice(2).replace("src", "Bilibili-Old")}\`;\r\n/*!***********************!*/`;
                fs.promises.rm(d.path);
            } else {
                modules += `\r\n/**/modules["${d.fileFullName}"] = /*** .${d.path.slice(1)} ***/\r\n\`${String(d.data).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;\r\n/*!***********************!*/`;
            }
        }
        else s += String(d.data); // 预加载模块无需封装
        return s;
    }, "");
    data = data + modules;
    data = data.replace(/\r?\n?"use strict";/g, ""); // 严格模式标记
    fs.writeFile("./src/require.js", data, () => { });
});