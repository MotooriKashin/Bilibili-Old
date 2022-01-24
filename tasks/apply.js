// 提取导出函数
const fs = require("fs");

class Apply {
    extend = [".ts"];
    path = ["src"];
    async run() {
        const arr = await this.listPath();
        const files = await Promise.all(arr.reduce((s, d) => {
            s.push(fs.promises.readFile(d));
            return s;
        }, []));
        const json = files.reduce((s, d, i) => {
            const names = this.getProperty(String(d));
            const path = arr[i].split("/");
            const file = path[path.length - 1].replace(".ts", ".js");
            names.forEach(d => {
                s[d] = file;
            });
            return s;
        }, {});
        fs.writeFile("./json/apply.json", JSON.stringify(json, undefined, "\t"), (err) => { if (err) throw err });
    }
    /**
     * 提取属性名称
     * @param {*} str 
     * @returns 
     */
    getProperty(str) {
        const ns = str.search("namespace API {");
        let n = 0;
        let result = "";
        let end = false;
        if (ns >= 0) {
            for (let i = ns; i < str.length; i++) {
                switch (str[i]) {
                    case "{": n++;
                        result += str[i];
                        break;
                    case "}": n--;
                        result += str[i];
                        if (n === 0) end = true;
                        break;
                    default: if (n > 0) result += str[i];
                }
                if (end) break;
            }
        }
        return result.match(/(?<=export +(let|function|const|var) +)[A-Za-z0-9_$]+(?=(\(|:| |\<))/g) || [];
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
        return (await Apply.getDir(path)).reduce((s, d) => {
            this.extend.find(b => d.includes(b)) && s.push(d);
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
                s.push(Apply.getStat(`${path}/${d}`))
                return s;
            }, []))
            let deep = await Promise.all(check.reduce((s, d, i) => {
                d ? list.push(`${path}/${items[i]}`) : s.push(Apply.getDir(`${path}/${items[i]}`))
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
new Apply().run();