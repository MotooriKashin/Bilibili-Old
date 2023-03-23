import manifest from './manifest.json' assert { type: 'json' };
import esbuild from 'esbuild';

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
    entryPoints: [
        'src/comment.ts'
    ],
    target: "chrome76",
    bundle: true,
    format: 'esm',
    treeShaking: true,
    charset: 'utf8',
    outfile: 'tampermonkey/comment/main.user.js',
    loader: {
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