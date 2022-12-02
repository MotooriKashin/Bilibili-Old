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
        _MUTEX_: `'${Math.random().toString(36).substring(2)}'`, // 编译时生成的唯一标记
        _UserScript_: true // 用户脚本标记
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
