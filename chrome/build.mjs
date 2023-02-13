import fs from 'fs-extra';
import esbuild from 'esbuild';

// 随机互斥标记
const _MUTEX_ = Math.random().toString(36).substring(2);

// 清空输出目录并复制资源
await fs.emptyDir('./dist');
fs.copy("./chrome/_locales", "./dist/_locales");
fs.copy("./chrome/images", "./dist/images");
fs.copy("./chrome/player", "./dist/player");
fs.copy("./chrome/rules", "./dist/rules");
fs.copy("./chrome/manifest.json", "./dist/manifest.json");

// 打包后台脚本和内容脚本
esbuild.build({
    entryPoints: [
        'chrome/background.ts',
        'chrome/content.ts',
    ],
    bundle: true,
    // sourcemap: true,
    minify: true,
    outdir: 'dist',
    outbase: "chrome",
    format: 'iife',
    treeShaking: true,
    charset: 'utf8',
    define: {
        _MUTEX_: `'${_MUTEX_}'`
    }
});

// 打包MAIN脚本
esbuild.build({
    entryPoints: [
        'src/index.ts'
    ],
    bundle: true,
    // sourcemap: true,
    minify: true,
    outdir: 'dist',
    outbase: "src",
    format: 'iife',
    treeShaking: true,
    charset: 'utf8',
    loader: {
        '.html': 'text',
        '.svg': 'text',
        ".css": 'text'
    },
    define: {
        _MUTEX_: `'${_MUTEX_}'`,
        _UserScript_: 'false', // 用户脚本标记
    },
    inject: ['@jsc/chrome'], // 替换化境变量
});