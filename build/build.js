// 构建脚本主体
const fs = require("fs");
const meta = require("../meta.json");
// const resource = require("../resource.json");
// const path = "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old";

fs.readFile("./dist/index.js", "utf-8", (err, data) => {
    if (err) throw err;
    let content = Object.keys(meta).reduce((s, d) => {
        s = Array.isArray(meta[d]) ? meta[d].reduce((a, b) => {
            a = `${a}// @${d.padEnd(13, " ")}${b}\r\n`;
            return a;
        }, s) : `${s}// @${d.padEnd(13, " ")}${meta[d]}\r\n`;
        return s;
    }, "// ==UserScript==\r\n");
    content = content + "// ==/UserScript==\r\n\r\n" + data
    // content = Object.keys(resource).reduce((s, d) => {
    //     let arr = d.split("/");
    //     s = `${s}// @resource     ${arr[arr.length - 1]} ${path}@${resource[d]}/${d}\r\n`
    //     return s;
    // }, content) + "// ==/UserScript==\r\n" + data.replace("\"use strict\";", "");
    fs.writeFile("./beta.user.js", content, (err) => { if (err) throw err })
})