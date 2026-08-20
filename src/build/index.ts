import { rm, cp, type CpOptions } from 'fs/promises';

import '../slogan';
console.log('\x1B[102;95;4m开始构建-->\x1B[m');
console.log('\t1. 清空输出目录')
await rm('./dist', { recursive: true, force: true });

console.log('\t2. 拷贝资源文件');
const cpOptions: CpOptions = { recursive: true, force: true, filter: src => !(src.endsWith('.ts') || src.endsWith('.css')) };
await Promise.all([
    cp('./_locales', './dist/_locales', cpOptions),
    cp('./assets', './dist/assets', cpOptions),
    cp('./src/sidePanel', './dist/sidePanel', cpOptions),
]);

console.log('\t3. 编译资源文件');
await Promise.all([
    import('./manifest'),
    import('./esbuild')
]);

console.log('\x1B[102;95;4m<--构建成功\x1B[m');