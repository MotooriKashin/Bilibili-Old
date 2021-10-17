// 构建脚本主体
const fs = require("fs");
const https = require('https');
const meta = require("../json/meta.json");
const resource = require("../json/resource.json");
const path = "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old";

resource.push(`${path}/dist/comment.js`);

class Build {
    extend = [".d.ts", ".map", "dist/index.js", "dist/bilibiliPlayer.js", "dist/comment.js", "dist/video.js", "meta.json", "resource.json", ".md"]; // 排除文件或拓展名
    path = ["CSS", "HTML", "Json", "dist"]; // 模块所在目录
    /**
     * 构建入口
     */
    async output() {
        const arr = await this.listPath();
        const files = await Promise.all(arr.reduce((s, d) => {
            s.push(fs.promises.readFile(d));
            return s;
        }, []));
        const modules = files.reduce((s, d, i) => {
            let t = arr[i].split("/");
            s += arr[i].endsWith(".json") ? `
    modules["${t[t.length - 1]}"] = ${String(d)};` : `
    modules["${t[t.length - 1]}"] = \`${String(d).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;`
            return s;
        }, "");
        fs.readFile("./dist/index.js", "utf-8", (err, data) => {
            if (err) throw err;
            let content = Object.keys(meta).reduce((s, d) => {
                s = Array.isArray(meta[d]) ? meta[d].reduce((a, b) => {
                    a = `${a}// @${d.padEnd(13, " ")}${b}\r\n`;
                    return a;
                }, s) : `${s}// @${d.padEnd(13, " ")}${meta[d]}\r\n`;
                return s;
            }, "// ==UserScript==\r\n");
            content = resource.reduce((s, d) => {
                let arr = d.split("/");
                s = `${s}// @resource     ${arr[arr.length - 1]} ${d}\r\n`
                return s;
            }, content);
            content = content + "// ==/UserScript==\r\n\r\n" + data.replace("/* 模块占位 */", modules);
            fs.writeFile("./main.user.js", content, (err) => { if (err) throw err });
        })
    }
    /**
     * 汇总所有模块文件
     * @returns 模块列表
     */
    listPath() {
        return new Promise(r => {
            Promise.all(this.path.reduce((s, d) => {
                s.push(this.listDir(`./${d}`))
                return s;
            }, [])).then(d => {
                r(d.reduce((s, d) => {
                    s = [...s, ...d];
                    return s;
                }, []))
            })
        })
    }
    /**
     * 记录目录下所有模块位置
     * @param {*} path 目录名字，path的元素
     */
    async listDir(path) {
        return (await Build.getDir(path)).reduce((s, d) => {
            !this.extend.find(b => d.includes(b)) && s.push(d);
            return s;
        }, []);
    }
    /**
     * 递归检索所有子目录文件
     * @param {string} path 目录名称
     * @returns {Promise<[]>} 文件列表
     */
    static async getDir(path) {
        try {
            const items = await fs.promises.readdir(`${path}/`);
            let list = [];
            let check = await Promise.all(items.reduce((s, d) => {
                s.push(Build.getStat(`${path}/${d}`))
                return s;
            }, []))
            let deep = await Promise.all(check.reduce((s, d, i) => {
                d ? list.push(`${path}/${items[i]}`) : s.push(Build.getDir(`${path}/${items[i]}`))
                return s;
            }, []))
            deep.forEach(d => list.push(...d))
            return list;
        } catch (e) { return [] }
    }
    /**
     * 区分文件还是目录
     * @param {string} path 目录名称
     * @returns {Promise<boolean>}
     */
    static async getStat(path) {
        const result = await fs.promises.stat(path);
        return result.isDirectory() ? false : true;
    }
}
new Build().output();