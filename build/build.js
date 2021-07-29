const fs = require("fs");
const meta = require("../meta.json");

fs.readFile("./JavaScript/index.js", "utf-8", (err, data) => {
    if (err) throw err;
    let content = Object.keys(meta).reduce((s, d) => {
        s = Array.isArray(meta[d]) ? meta[d].reduce((a, b) => {
            a = `${a}// @${d.padEnd(13, " ")}${b}\r\n`;
            return a;
        }, s) : `${s}// @${d.padEnd(13, " ")}${meta[d]}\r\n`;
        return s;
    }, "// ==UserScript==\r\n") + "// ==/UserScript==\r\n" + data.replace("\"use strict\";", "");
    fs.writeFile("./main.user.js", content, (err) => { if (err) throw err })
})