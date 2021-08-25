const { exec } = require("child_process");
const fs = require("fs");
/**
 * 无需包含的文件名(含拓展名)
 */
const del = [
    "JavaScript/index.js",
    "JavaScript/video.js"
];
/**
 * 要求哈希表的子目录
 */
const path = ["CSS", "HTML", "Json", "JavaScript"];

class File {
    constructor() {
        Promise.all(path.reduce((s, d) => {
            s.push(this.readir(`./${d}`))
            return s;
        }, [])).then(d => {
            let result = d.reduce((s, d) => {
                s = { ...s, ...d }
                return s;
            }, {});
            fs.writeFile("./resource.json", JSON.stringify(result, "", "\t"), (err) => { if (err) throw err })
        })
    }
    /**
     * 读取目录下所有文件commit值
     * @param {string} path 目录名称
     * @returns {Promise<{}>} 哈希值对象
     */
    async readir(path) {
        let arr = (await File.getDir(path)).reduce((s, d) => {
            d = d.split("./")[1];
            !del.includes(d) && s.push(d);
            return s;
        }, []);
        let hash = await Promise.all(arr.reduce((s, d) => {
            s.push(this.getHash(`./${d}`));
            return s;
        }, []))
        return hash.reduce((s, d, i) => {
            s[arr[i]] = d;
            return s;
        }, {})
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
                s.push(File.getStat(`${path}/${d}`))
                return s;
            }, []))
            let deep = await Promise.all(check.reduce((s, d, i) => {
                d ? list.push(`${path}/${items[i]}`) : s.push(File.getDir(`${path}/${items[i]}`))
                return s;
            }, []))
            deep.forEach(d => list.push(...d))
            return list;
        } catch { return [] }
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
    /**
    * 获取文件的`commit`哈希值
    * @param {string} path 文件路径：相对/绝对
    * @returns {Promise<string>} `commit`哈希值
    */
    getHash(path) {
        return new Promise((s, r) => {
            exec(`git log -1 ${path}`, (e, d) => {
                e && r(e);
                d && s(d.match(/[a-f0-9]{40}/)[0]);
            })
        })
    }
}
new File();