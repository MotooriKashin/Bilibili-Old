// 构建开发板脚本local.user.js
const fs = require("fs");
const meta = require("../meta.json"); // 脚本元数据
const _requires = ["src/require.js"]; // 模块封装，开发模式下以require本地资源方式加载
const _resource = ["dist/bilibiliPlayer.js", "dist/comment.js"]; // 本地资源项

meta.version = "9.0.0"; // 开发模式无需修改脚本版本，固定为大版本+1

function getRequires() {
    meta.require = _requires.reduce((s, d) => {
        s.push(`file:///${process.cwd().replace(/\\/g, "/")}/${d}`);
        return s;
    }, meta.require || []);
}
function getResource() {
    meta.resource = _resource.reduce((s, d) => {
        const arr = d.split("/");
        s.push(`${arr[arr.length - 1]} file:///${process.cwd().replace(/\\/g, "/")}/${d}`);
        return s;
    }, meta.resource || []);
}
(async function () {
    console.log("%c生成开发版脚本>>>", "color: yellow;");
    getRequires(); // 加载本地依赖
    getResource(); // 加载本地资源
    let result = Object.keys(meta).reduce((s, d) => { // 处理脚本元数据
        s = Array.isArray(meta[d]) ? meta[d].reduce((a, b) => {
            a = `${a}// @${d.padEnd(13, " ")}${b}\r\n`;
            return a;
        }, s) : `${s}// @${d.padEnd(13, " ")}${meta[d]}\r\n`;
        return s;
    }, "// ==UserScript==\r\n");
    result += "// ==/UserScript==\r\n\r\n"; // 元数据关闭标签
    result += await fs.promises.readFile("./src/index.js"); // 脚本主入口
    result = result.replace(/\r?\n?"use strict";/g, ""); // 严格模式标记
    fs.writeFile("./local.user.js", result, (err) => {
        if (err) throw err
        console.log("%c编译完成！", "color: green;");
    });
})();