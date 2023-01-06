const manifest = require('./manifest.json');
const esbuild = require('esbuild');

const banner = Object.entries(manifest).reduce((s, d) => {
    if (Array.isArray(d[1])) {
        d[1].forEach(e => {
            s += `// @${d[0].padEnd(13, " ")}${e}\n`
        });
    } else {
        s += `// @${d[0].padEnd(13, " ")}${d[1]}\n`;
    }
    return s;
}, `// ==UserScript==\n`) + '// ==/UserScript==\n\n(function () {\n';
const footer = `\n})();\n`;
esbuild.build({
    entryPoints: [ // 入口脚本
        'userscript/comment/main.ts'
    ],
    bundle: true, // 打包
    format: 'esm', // 输出格式
    treeShaking: true, // 清除无效代码
    charset: 'utf8', // 文件编码
    outfile: 'userscript/comment/main.user.js',
    banner: {
        js: banner
    },
    footer: {
        js: footer
    }
});