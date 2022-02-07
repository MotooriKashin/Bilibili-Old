const fs = require("fs");

module.exports.getFiles = class Files {
    /**
     * 遍历目录指定目录并返回所偶文件信息
     * @param {string[]} path 根目录下的路径名组(无需`./`开头)，将遍历所有子目录
     * @param {string[]} [exclude] 排除路径关键词，过滤相关路径中的文件
     */
    constructor(path, exclude) {
        this.path = path;
        this.exclude = exclude;
    }
    /**
     * 开启遍历
     * @returns {Promise<{path:string,fileFullName:string,fileName:string,data:string}>} 遍历结果
     */
    async run() {
        const arr = await this.listPath();
        const files = await Promise.all(arr.reduce((s, d) => {
            s.push(fs.promises.readFile(d));
            return s;
        }, []));
        return files.reduce((s, d, i) => {
            s.push({
                path: arr[i],
                fileFullName: Files.getFullName(arr[i]),
                fileName: Files.getName(arr[i]),
                data: d
            });
            return s;
        }, []);
    }
    /**
     * 提取文件全名（含拓展名）
     * @param {string} path 文件路径
     * @returns 文件全名
     */
    static getFullName(path) {
        const arr = path.split("/");
        if (!arr[1]) return arr[0];
        return arr[arr.length - 1];
    }
    /**
     * 提取文件名
     * @param {string} path 文件路径
     * @returns 文件名
     */
    static getName(path) {
        const arr = this.getFullName(path).split(".");
        if (!arr[1]) return arr[0];
        return arr.slice(0, arr.length - 1).join(".");
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
        return (await Files.getDir(path)).reduce((s, d) => {
            (!this.exclude || !this.exclude.find(b => d.includes(b))) && s.push(d);
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
                s.push(Files.getStat(`${path}/${d}`))
                return s;
            }, []))
            let deep = await Promise.all(check.reduce((s, d, i) => {
                d ? list.push(`${path}/${items[i]}`) : s.push(Files.getDir(`${path}/${items[i]}`))
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