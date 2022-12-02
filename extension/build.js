import('fs-extra').then(d => {
    d.emptyDir("./dist").then(() => {
        d.copy("./extension/_locales", "./dist/_locales");
        d.copy("./extension/images", "./dist/images");
        d.copy("./extension/player", "./dist/player");
        d.copy("./extension/rules", "./dist/rules");
        d.copy("./extension/manifest.json", "./dist/manifest.json");
    });
    import('esbuild').then(esbuild => {
        esbuild.build(
            {
                entryPoints: [ // 入口脚本
                    'extension/background.ts',
                    'extension/content.ts',
                    'extension/main.ts',
                ],
                bundle: true, // 打包
                sourcemap: true, // map文件
                minify: true, // 压缩
                outdir: 'dist', // 输出目录
                outbase: "extension", // 基准目录
                format: 'iife', // 输出格式
                treeShaking: true, // 清除无效代码
                // metafile: true, // 打印报表
                charset: 'utf8', // 文件编码
                loader: { // 文件对应的解析方式
                    '.html': 'text',
                    '.svg': 'text',
                    ".css": 'text'
                },
                // splitting: true, // 拆分文件 文件拆分只支持esm格式暂时不现实
                // chunkNames: 'chunks/[name]-[hash]', // 拆分块名称
                define: {
                    _MUTEX_: `'${Math.random().toString(36).substring(2)}'`, // 编译时生成的唯一标记
                    _UserScript_: false // 用户脚本标记
                }
            }
        ).catch(e => {
            console.error("编译扩展出错！", e);
            process.exit(1);
        }).finally(() => {
            console.log("编译扩展完成！", "使用【加载已解压的扩展程序】加载dist目录可进行调试。");
        });
    });
})