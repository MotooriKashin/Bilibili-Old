// 构建发行版脚本main.user.js
const fs = require("fs");
const { exec } = require("child_process"); // 用于执行git命令获取模块commit哈希值
const meta = require("../meta.json"); // 脚本元数据
const cdn = "https://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old"; // 远程仓库CDN路径，resource资源用
/**
 * 脚本相对路径：resource名称（GM_getRresouceText参数名）  
 * 外部资源请直接以resource格式添加进`meta.json`。
 */
const _resource = {
    "dist/bilibiliPlayer.js": "bilibiliPlayer.js",
    "dist/comment.js": "comment.js"
};

/**
 * 获取文件的`commit`哈希值
 * @param {string} path 文件路径：相对/绝对
 * @returns {Promise<string>} `commit`哈希值
 */
function getHash(path) {
    return new Promise((s, r) => {
        exec(`git log -1 ${path}`, (e, d) => {
            e && r(e);
            d && s(d.match(/[a-f0-9]{40}/)[0]);
        })
    })
}
/**
 * 整理资源项
 */
async function getResource() {
    meta["resource"] = meta["resource"] || [];
    await Promise.all(Object.keys(_resource).reduce((s, d) => {
        s.push(getHash(d).then(n => { meta["resource"].push(`${_resource[d]} ${cdn}@${n}/${d.replace(".js", ".min.js")}`) }));
        return s;
    }, []));
}
(async function () {
    console.log("%c生成发行版脚本>>>", "color: yellow;");
    await getResource(_resource, "resource"); // 整理资源项
    let result = Object.keys(meta).reduce((s, d) => { // 处理脚本元数据
        s = Array.isArray(meta[d]) ? meta[d].reduce((a, b) => {
            a = `${a}// @${d.padEnd(13, " ")}${b}\r\n`;
            return a;
        }, s) : `${s}// @${d.padEnd(13, " ")}${meta[d]}\r\n`;
        return s;
    }, "// ==UserScript==\r\n");
    result += "// ==/UserScript==\r\n\r\n"; // 元数据关闭标签
    result += await fs.promises.readFile("./dist/require.js"); // 模块封装
    result += await fs.promises.readFile("./dist/index.js"); // 脚本主入口
    fs.writeFile("./main.user.js", result, (err) => {
        if (err) throw err
        console.log("%c编译完成！", "color: green;");
    });
})();