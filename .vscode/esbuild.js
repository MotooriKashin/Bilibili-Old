const fs = require("fs");
const { exec } = require("child_process"); // 用于执行git命令获取模块commit哈希值
const meta = require("../src/tampermonkey/meta.json"); // 脚本元数据
const cdn = "https://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old"; // 远程仓库CDN路径，resource资源用

/**
 * 脚本相对路径：resource名称（GM_getRresouceText参数名）  
 * 外部资源请直接以resource格式添加进`meta.json`。
 */
const _resource = {
    "src/bilibili/bilibiliPlayer.js": "bilibiliPlayer.js",
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

import("fs-extra").then(d => {
    d.emptyDir("./dist").then(() => {
        // 源代码已打包大部分资源，以下是扩展以绝对路径访问的资源
        // 包括扩展 manifest 及其依赖和未打包的 css （`addCssEs`方法）样式
        d.copy("./src/manifest.json", "./dist/manifest.json");
        d.copy("./src/rules", "./dist/rules");
        d.copy("./src/images", "./dist/images");
        d.copy("./src/bilibili", "./dist/bilibili");
        d.copy("./src/_locales", "./dist/_locales");
        d.copy("./src/options.html", "./dist/options.html");
        d.copy("./src/popup.html", "./dist/popup.html");
        d.copy("./src/runtime/chrome/popup.css", "./dist/runtime/chrome/popup.css");
        d.copy("./src/runtime/chrome/options.css", "./dist/runtime/chrome/options.css");
        d.copy("./src/runtime/player/closed_caption.css", "./dist/runtime/player/closed_caption.css");
        d.copy("./src/runtime/danmaku/danmaku_hash_id.css", "./dist/runtime/danmaku/danmaku_hash_id.css");
        d.copy("./src/runtime/danmaku/command_dm.css", "./dist/runtime/danmaku/command_dm.css");
        d.copy("./src/content/player/bnj.css", "./dist/content/player/bnj.css");
        d.copy("./src/content/message/message.css", "./dist/content/message/message.css");
        d.copy("./src/content/avatar_animation.css", "./dist/content/avatar_animation.css");
        d.copy("./src/content/av/up_list.css", "./dist/content/av/up_list.css");
        // 使用esbuild打包
        import('esbuild').then(esbuild => {
            // 扩展
            esbuild.build(
                {
                    entryPoints: [ // 入口脚本
                        'src/background.ts', // 背景脚本
                        'src/content.ts', // 背景脚本
                        'src/runtime/chrome/popup.ts', // 弹出窗口
                        'src/runtime/chrome/options.ts', // 选项页面
                        'src/content/vector.ts', // 全局
                        'src/content/index/index.ts', // 主页
                        'src/content/av/av.ts', // av页
                        'src/content/bangumi/bangumi.ts', // bangumi
                        'src/content/watchlater/watchlater.ts', // 稍后再看
                        'src/content/player/player.ts', // 嵌入播放器
                        'src/content/playlist/playlist.ts', // playlist
                        'src/content/ranking/ranking.ts', // 全站排行榜
                        'src/content/read/read.ts', // 专栏
                        'src/content/search/search.ts' // 搜索
                    ],
                    bundle: true, // 打包
                    sourcemap: process.env.NODE_ENV === "development", // map文件
                    minify: process.env.NODE_ENV === "production", // 压缩
                    outdir: 'dist', // 输出目录
                    outbase: "src", // 输入目录
                    format: 'iife', // 输出格式
                    treeShaking: true, // 清除无效代码
                    // metafile: true, // 打印报表
                    charset: 'utf8', // 文件编码
                    loader: { // 文件对应的解析方式
                        '.html': 'text', // HTML文件解析为字符串
                        '.svg': 'text' // HTML文件解析为字符串
                    },
                    // splitting: true, // 拆分文件 文件拆分只支持esm格式暂时不现实
                    // chunkNames: 'chunks/[name]-[hash]', // 拆分块名称
                }
            ).catch(e => {
                console.error("编译扩展出错！", e);
                process.exit(1);
            }).finally(() => {
                console.log("编译扩展完成！", "使用【加载已解压的扩展程序】加载dist目录可进行调试。");
            });
            // 用户脚本
            esbuild.build(
                {
                    entryPoints: [ // 入口脚本
                        'src/tampermonkey/vector.ts', // 用户脚本
                        'src/tampermonkey/index.ts' // 脚本本体
                    ],
                    bundle: true, // 打包
                    outdir: 'dist', // 输出目录
                    outbase: "src", // 输入目录
                    format: 'esm', // 输出格式
                    treeShaking: true, // 清除无效代码
                    charset: 'utf8', // 文件编码
                    loader: { // 文件对应的解析方式
                        '.html': 'text', // HTML文件解析为字符串
                        '.svg': 'text' // HTML文件解析为字符串
                    }
                }
            ).then(async () => {
                await getResource(_resource, "resource"); // 整理资源项
                let result = Object.keys(meta).reduce((s, d) => { // 处理脚本元数据
                    s = Array.isArray(meta[d]) ? meta[d].reduce((a, b) => {
                        a = `${a}// @${d.padEnd(13, " ")}${b}\r\n`;
                        return a;
                    }, s) : `${s}// @${d.padEnd(13, " ")}${meta[d]}\r\n`;
                    return s;
                }, "// ==UserScript==\r\n");
                result += "// ==/UserScript==\r\n\r\n"; // 元数据关闭标签
                result += await fs.promises.readFile("./dist/tampermonkey/index.js"); // 脚本主入口
                result = result.replace('const modules = "";', `const modules = \`\r\n${String(await fs.promises.readFile("./dist/tampermonkey/vector.js")).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;`);
                await fs.promises.writeFile("./main.user.js", result.replace(/\r/g, '').replace(/\n/g, '\r\n'));
                await d.remove("./dist/tampermonkey");
            }).catch(e => {
                console.error("编译用户脚本出错", e);
                process.exit(1);
            }).finally(() => {
                console.log("编译用户脚本完成！");
            });
        })
    })
})