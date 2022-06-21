const esbuild = require('esbuild')
esbuild.build(
    {
        entryPoints: [ // 入口脚本
            'src/background.ts', // 背景脚本
            'src/options/options.ts', // 选项页面
            'src/popup/popup.ts', // 操作页面
            'src/content/content.ts', // 全局默认
            'src/content/global/global.ts', // 非重构页面
            'src/content/global/userscript.ts', // 非重构页面用户脚本
            'src/content/index/index.ts', // 主页
            'src/content/index/userscript.ts', // 主页用户脚本
            'src/content/av/av.ts', // av页
            'src/content/av/userscript.ts', // av页用户脚本
            'src/content/bangumi/bangumi.ts', // bangumi
            'src/content/bangumi/userscript.ts', // bangumi用户脚本
            'src/content/watchlater/watchlater.ts', // 稍后再看
            'src/content/watchlater/userscript.ts', // 稍后再看用户脚本
            'src/content/player/player.ts', // 嵌入式播放器
            'src/content/player/userscript.ts', // 嵌入式播放器用户脚本
            'src/content/playlist/playlist.ts', // playlist
            'src/content/playlist/userscript.ts', // playlist用户脚本
            'src/content/ranking/ranking.ts', // 排行榜
            'src/content/ranking/userscript.ts', // 排行榜用户脚本
            'src/content/read/read.ts', // 专栏
            'src/content/read/userscript.ts', // 专栏用户脚本
            'src/content/search/search.ts', // 搜索
            'src/content/search/userscript.ts', // 搜索用户脚本
        ],
        bundle: true, // 打包
        sourcemap: true, // map文件
        minify: true, // 压缩
        outdir: 'dist', // 输出目录
        outbase: "src", // 输入目录
        format: 'iife', // 输入格式
        treeShaking: true, // 清除无效代码
        metafile: true, // 打印报表
        charset: 'utf8', // 文件编码
        loader: { // 文件对应的解析方式
            '.html': 'text', // HTML文件解析为字符串
            '.svg': 'text' // HTML文件解析为字符串
        }
    }
)
    .then(d => esbuild.analyzeMetafile(d.metafile)) // 仅当 `metafile: true`
    .then(d => console.log(d))
    .catch(e => {
        console.error(e);
        process.exit(1);
    })