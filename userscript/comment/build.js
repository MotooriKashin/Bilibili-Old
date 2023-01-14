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
    loader: { // 文件对应的解析方式
        '.html': 'text',
        '.svg': 'text',
        ".css": 'text'
    },
    define: {
        _MUTEX_: `'${Math.random().toString(36).substring(2)}'`, // 编译时生成的唯一标记
    },
    banner: {
        js: banner
    },
    footer: {
        js: footer
    }
});