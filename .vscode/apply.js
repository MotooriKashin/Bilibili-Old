// 生成接口索引表
const fs = require("fs");
const files = require("./files").getFiles;

const path = ["src"]; // TypeScript源代码目录
/**
 * 提取导出接口名  
 * 导出接口请声明在命名空间`API`中，并标记有`export`关键词
 * @param {string} str 模块源码
 * @returns 接口名数组
 */
function getProperty(str) {
    const ns = str.search("namespace API {"); // 导出关键词起点
    let n = 0; // 延迟结束标记
    let result = ""; // 初始化正则匹配范围
    let end = false; // 检索结束标记
    if (ns >= 0) { // 从索引起点开始取出正则匹配范围
        for (let i = ns; i < str.length; i++) {
            switch (str[i]) {
                case "{": n++; // 延迟结束标记+1
                    result += str[i];
                    break;
                case "}": n--; // 延迟结束标记-1
                    result += str[i];
                    if (n === 0) end = true; // 检索结束
                    break;
                default: if (n > 0) result += str[i]; // 记录当前数据
            }
            if (end) break;
        }
    }
    return result.match(/(?<=export +(let|function|async function|const|var|class) *\*? *)[A-Za-z0-9_$]+(?=(\(|:| |\<))/g) || []; // 正则匹配接口名
}
console.log("%c提取接口索引表>>>", "color: yellow;");
new files(path).run().then(d => { // 读取所有模块文件
    const json = d.reduce((s, d) => { // 提取所有模块中的导出接口
        const names = getProperty(String(d.data)); // 当前文件导出接口组
        names.forEach(n => { // 标记接口所在文件名
            s[n] = d.fileFullName.replace(".ts", ".js"); // 实际使用时模块后缀名是.js
        });
        return s;
    }, {});
    fs.writeFile("./json/apply.json", JSON.stringify(json, undefined, "\t"), () => { });
});