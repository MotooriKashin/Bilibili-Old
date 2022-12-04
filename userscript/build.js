const manifest = require('./manifest.json');
const esbuild = require('esbuild');
const { exec } = require("child_process");

/**
 * 获取文件的`commit`哈希值
 * @param {string} path 文件路径：相对/绝对
 * @returns {Promise<string>} `commit`哈希值
 */
function getHash(path) {
    return new Promise((resolve, reject) => {
        exec(`git log -1 ${path}`, (e, d) => {
            e && reject(e);
            d && resolve(d.match(/[a-f0-9]{40}/)[0]);
        })
    })
}
getHash('./extension/player/video.js')
    .then(hash => {
        manifest.version += `-${hash}`;
        const banner = Object.entries(manifest).reduce((s, d) => {
            if (Array.isArray(d[1])) {
                d[1].forEach(e => {
                    s += `// @${d[0].padEnd(13, " ")}${e}\n`
                });
            } else {
                s += `// @${d[0].padEnd(13, " ")}${d[1]}\n`;
            }
            return s;
        }, `// ==UserScript==\n`) + '// ==/UserScript==\n\nconst MODULES = (<><![CDATA[\n';
        const footer = '\n]]></>).toString();\n\nnew Function("GM", MODULES)(GM);\n';
        esbuild.build({
            entryPoints: [ // 入口脚本
                'userscript/main.ts'
            ],
            bundle: true, // 打包
            format: 'esm', // 输出格式
            treeShaking: true, // 清除无效代码
            charset: 'utf8', // 文件编码
            loader: { // 文件对应的解析方式
                '.html': 'text',
                '.svg': 'text',
                ".css": 'text'
            },
            define: {
                _MUTEX_: `'${hash.slice(0, 7)}'`, // 编译时生成的唯一标记
                _UserScript_: true, // 用户脚本标记
            },
            banner: {
                js: banner // 页眉 此处用于脚本元素据及预处理
            },
            footer: {
                js: footer // 页脚 此处用于后处理
            },
            outfile: 'userscript/main.user.js'
        }).catch(e => {
            console.error(`[${manifest.name}(${manifest.version})]：脚本编译出错！`, e);
            process.exit(1);
        }).finally(() => {
            console.log(`[${manifest.name}(${manifest.version})]：脚本编译完成！`);
        });

    }).catch(e => {
        console.error('未获取到播放器脚本版本！', e);
    });