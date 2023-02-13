import manifest from './manifest.json' assert { type: 'json' };
import fs from 'fs-extra';
import esbuild from 'esbuild';
import { exec } from 'child_process';

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

// 获取播放器脚本版本哈希
const hash = await getHash('./chrome/player/video.js');
// 写入版本号
manifest.version += `-${hash}`;
// 生成文件页眉
const banner = Object.entries(manifest).reduce((s, d) => {
    if (Array.isArray(d[1])) {
        d[1].forEach(e => {
            s += `// @${d[0].padEnd(13, " ")}${e}\n`
        });
    } else {
        s += `// @${d[0].padEnd(13, " ")}${d[1]}\n`;
    }
    return s;
}, `// ==UserScript==\n`) + '// ==/UserScript==\n\nconst MODULES = `\n';
// 生成文件页脚
const footer = '\n`;\n\nnew Function("GM", MODULES)(GM);\n';
/** 最终处理插件 */
const userscriptPlugin = {
    name: 'example',
    setup(build) {
        build.onEnd(result => {
            result.outputFiles.forEach(d => {
                fs.promises.writeFile(
                    d.path,
                    banner + d.text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$') + footer
                );
            })
        })
    },
};
// 打包用户脚本
esbuild.build({
    entryPoints: [
        'src/index.ts'
    ],
    bundle: true,
    format: 'iife',
    treeShaking: true,
    charset: 'utf8',
    loader: {
        '.html': 'text',
        '.svg': 'text',
        ".css": 'text'
    },
    define: {
        _MUTEX_: `'${hash.slice(0, 7)}'`, // 编译时生成的唯一标记
        _UserScript_: 'true', // 用户脚本标记
    },
    plugins: [
        userscriptPlugin
    ],
    write: false, // 禁用输出以进行后续处理
    inject: ['@jsc/tampermonkey'], // 替换化境变量
    outfile: 'tampermonkey/main.user.js'
})