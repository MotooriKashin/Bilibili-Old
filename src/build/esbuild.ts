import { build } from "esbuild";
import type { PluginBuild } from "esbuild";
import '../slogan';

/** C导入属性处理插件 */
const importAttributesPlugin = {
    name: 'import attributes',
    setup(pluginBuild: PluginBuild) {
        pluginBuild.onLoad({ filter: /\.css$/ }, async args => {
            switch (args.with['type']) {
                case 'css': {
                    // 编译 CSS 样式文件
                    const result = await build({
                        bundle: true,
                        entryPoints: [args.path],
                        minify: pluginBuild.initialOptions.minify ?? true,
                        charset: 'utf8',
                        loader: {
                            '.woff': 'dataurl',
                            '.gif': 'dataurl',
                        },
                        write: false,
                        sourcemap: true,
                    });
                    return { contents: result.outputFiles[0]!.contents, loader: 'copy' };
                }
                default: return { loader: 'empty' };
            }
        });
    }
}

// 编译脚本
build({
    entryPoints: [
        'src/index.ts',
        'src/isolated/index.ts',
        'src/main/index.ts',
        'src/main/live/index.ts',
        'src/main/av/index.ts',
        'src/main/auto-append-spmid.ts',
        'src/main/bili-collect.ts',
        'src/main/log-reporter.ts',
        'src/main/reporter-pb.ts',
        'src/main/user-fingerprint.ts',
        'src/main/bili-comments.ts',
        'src/main/comment.ts',
        'src/main/video.ts',
        'src/main/core.ts',
        'src/sidePanel/player/index.ts',
    ],
    outdir: 'dist',
    outbase: "src",
    bundle: true,
    minify: true,
    format: 'esm',
    charset: 'utf8',
    splitting: true,
    treeShaking: true,
    sourcemap: true,
    plugins: [importAttributesPlugin],
});