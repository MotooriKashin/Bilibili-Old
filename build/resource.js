const { exec } = require("child_process");
const fs = require("fs");
/**
 * 无需包含的文件名(含拓展名)
 */
const del = ["index.js", "comment.js", "bilibiliPlayer.js"];
/**
 * 要求哈希表的子目录
 */
const path = ["CSS", "image", "HTML", "Json", "JavaScript"]

/**
 * 获取文件的`commit`哈希值
 * @param {string} path 文件路径：相对/绝对
 * @returns {Promise<string>} `commit`哈希值
 */
function getHash(path) {
    return new Promise((s, r) => {
        exec(`git log -1 ${path}`, (e, d) => {
            e && r(e);
            d && s(d.match(/[a-f0-9]{40}/)[0]);
        })
    })
}
/**
 * 获取子目录所有文件`commit`表
 * @param {string} path 子目录名字
 * @returns {Promise<{}>} 该子目录的`commit`表
 */
function dirPath(path) {
    return new Promise((s, r) => {
        fs.readdir(`./${path}/`, (err, files = []) => {
            files = files.reduce((s, d) => {
                !del.includes(d) && s.push(d)
                return s;
            }, [])
            Promise.all(files.reduce((s, d) => {
                s.push(getHash(`./${path}/${d}`))
                return s;
            }, [])).then(d => {
                s(d.reduce((s, d, i) => {
                    s[`${path}/${files[i]}`] = d;
                    return s;
                }, {}))
            })
        })
    })
}
Promise.all(path.reduce((s, d) => {
    s.push(dirPath(d));
    return s
}, [])).then(d => {
    let result = d.reduce((s, d) => {
        s = { ...s, ...d }
        return s;
    }, {})
    fs.writeFile("./resource.json", JSON.stringify(result, "", "\t"), (err) => { if (err) throw err })
})