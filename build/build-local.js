const fs = require("fs");
const meta = require("../meta.json");
const resource = require("../resource.json")

fs.readFile("./JavaScript/index.js", "utf-8", (err, data) => {
    if (err) throw err;
    let content = Object.keys(meta).reduce((s, d) => {
        s = Array.isArray(meta[d]) ? meta[d].reduce((a, b) => {
            a = `${a}// @${d.padEnd(13, " ")}${b}\r\n`;
            return a;
        }, s) : `${s}// @${d.padEnd(13, " ")}${meta[d]}\r\n`;
        return s;
    }, "// ==UserScript==\r\n");
    content = Object.keys(resource).reduce((s, d) => {
        switch (d.split(".")[1]) {
            case "js": s = `${s}// @resource     ${d} file:///${process.argv[2].replace(/\\/g, "/")}/JavaScript/${d}\r\n`;
                break;
            case "json": s = `${s}// @resource     ${d} file:///${process.argv[2].replace(/\\/g, "/")}/Json/${d}\r\n`;
                break;
            case "html": s = `${s}// @resource     ${d} file:///${process.argv[2].replace(/\\/g, "/")}/HTML/${d}\r\n`;
                break;
            case "css": s = `${s}// @resource     ${d} file:///${process.argv[2].replace(/\\/g, "/")}/CSS/${d}\r\n`;
                break;
            default: s = `${s}// @resource     ${d} file:///${process.argv[2].replace(/\\/g, "/")}/image/${d}\r\n`;
                break;
        }
        return s;
    }, content) + "// ==/UserScript==\r\n" + data.replace("\"use strict\";", "");
    fs.writeFile("./local.user.js", content, (err) => { if (err) throw err })
})