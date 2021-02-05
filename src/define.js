/**
 * @module define
 * @description 定义了一些简单函数
 * @author MotooriKashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main */

    class Define {
        constructor() {
            console.debug('import module "define.js"');
        }
        /**
         * 格式化时间
         * @param {number} [time] 时间戳(13位)
         * @param {*} [type] 只要有效返回值便加上年月日
         */
        timeFormat(time = new Date().getTime(), type) {
            let date = new Date(time),
                Y = date.getFullYear() + '-',
                M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
                D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ',
                h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':',
                m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':',
                s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return type ? Y + M + D + h + m + s : h + m + s;
        }
        /**
         * 格式化字节
         * @param {number} [size] 字节大小/bit
         */
        sizeFormat(size = 0) {
            let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
            while (dex > 1) {
                if (size >= vor) {
                    size = (size / dex).toFixed(2);
                    break;
                }
                dex = dex / 1024;
                vor = vor / 1000;
                i--;
            }
            return size + unit[i];
        }
        /**
         * 格式化进位
         * @param {number} [num] 数字
         */
        unitFormat(num = 0) {
            num = 1 * num || 0;
            let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
            while (dex > 1) {
                if (num >= dex) {
                    num = (num / dex).toFixed(1);
                    break;
                }
                dex = dex / 10000;
                i--;
            }
            return num + unit[i];
        }
        /**
         * 冒泡排序
         * @param {Array} arr 数组
         */
        bubbleSort(arr) {
            let temp = [];
            for (let i = 0; i < arr.length - 1; i++) {
                let bool = true;
                for (let j = 0; j < arr.length - 1 - i; j++) {
                    if (arr[j] > arr[j + 1]) {
                        temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                        bool = false;
                    }
                }
                if (bool) break;
            }
            return arr;
        }
        /**
         * 随机抽取数组元素
         * @param {Array} arr 目标数组
         * @param {number} [num] 抽取数目，超过数组元素量时返回随机排列的整个数组
         */
        randomArray(arr, num) {
            let out = [];
            num = num || 1;
            num = num < arr.length ? num : arr.length;
            while (out.length < num) {
                var temp = (Math.random() * arr.length) >> 0;
                out.push(arr.splice(temp, 1)[0]);
            }
            return out;
        }
        /**
         * av/BV互转
         * @see mcfx {@link https://www.zhihu.com/question/381784377/answer/1099438784}
         * @param {*} arg av {number} <==> BV {string}
         * @example <caption>av => BV</caption>
         * BLOD.abv(51568); // return "BV1hx411c7TB"
         * @example <caption>BV => av</caption>
         * BLOD.abv("BV1hx411c7TB"); // return 51568
         */
        abv(arg) {
            if (!arg) return;
            let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            let tr = {}, s = [11, 10, 3, 8, 4, 6], xor = 177451812, add = 8728348608;
            for (let i = 0; i < 58; i++) tr[table[i]] = i;
            if (!(1 * arg)) {
                let r = 0;
                for (let i = 0; i < 6; i++) r += tr[arg[s[i]]] * 58 ** i;
                return (r - add) ^ xor;
            } else {
                arg = (arg ^ xor) + add;
                let r = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
                for (let i = 0; i < 6; i++) r[s[i]] = table[parseInt(arg / 58 ** i) % 58];
                return r.join("");
            }
        }
        /**
         * URL签名
         * @param {string} [url] 需要签名的url
         * @param {Object} [obj] 包含需要往url中添加的参数键值对的数组，已存在的参数直接覆盖
         * @param {number} [id] 签名用的密钥序号，默认取0
         */
        urlSign(url, obj, id) {
            if (!BLOD.md5) new Function(BLOD.getResourceText("md5"))();
            id = 1 * id || 0;
            url = url || "";
            let _obj = {}, table = [
                'rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg', // stream default
                '/a_206b`_.61.bca6117.175bcdadc41850c010c..././1``', // app pgc
                '157bdd`6/bc73632.bcd660baa03a.43841211032b5c4`6b/', // app normal use
                '351a7a6b/.b`d77da1cdccc25_13bc0a81a6d63.7ad13`c50', // special: api=<endpoint><appsecret>
                '4_/54d`3_4_73..2c42`d4.a3__31b358d706d`._7a.3_b5.', // Android normal
                '12a.7c4b76c.a`12bb4`2b2b275c667c85b6d`c_c`0d5.051', // BiliLink
                'bb16d652`04.7/121d3474b_2.c12`7386`0/bdd6ca0c7.22', // TV
                '244_530/7/.ab`7.//22a15572502b_08c21./_.`3164`c36',
                '16_d52_d/d22_2c0a.6573355/b`./bd8a`bc6114a30_4.`d', // blink
                'c02ba/d6.33d05cb/5d34.7d_23_`_2785`c60.a`.4343726', // thuwp
                '2aa2`.1_`_1.73`.70.67d.bc671c16382a3d`71a4.bcb3c7' // thailand
            ][id], key = "";
            obj = (obj && typeof obj === "object") ? Object.assign(obj, BLOD.urlObj(url)) : BLOD.urlObj(url);
            url = url.split("?")[0];
            delete obj.sign;
            for (let i = table.length - 1; i >= 0; i--) key = key + String.fromCharCode(table[i].charCodeAt() + 2);
            obj = Object.assign(obj, { appkey: key.split(":")[0] });
            Object.keys(obj).sort().map(key => {
                _obj[key] = obj[key];
            })
            if (id === 3 && _obj.api) obj = Object.assign(_obj, { sign: BLOD.md5(BLOD.objUrl("", { api: decodeURIComponent(_obj.api) }) + key.split(":")[1]) });
            else obj = Object.assign(_obj, { sign: BLOD.md5(BLOD.objUrl("", _obj) + key.split(":")[1]) });
            return BLOD.objUrl(url, obj);
        }
        /**
         * 将对象键值对转化为URL参数并返回完整URL
         * @param {string} url 原始url，无效则直接输出连接好的参数字符串
         * @param {Object} obj 包含参数键值对的对象，已存在的参数直接覆盖，参数值为 undefined 或 null 则忽略该参数
         */
        objUrl(url, obj) {
            let data = this.urlObj(url);
            obj = typeof obj === "object" ? obj : {};
            data = Object.assign(data, obj);
            let arr = [], i = 0;
            for (let key in data) {
                if (data[key] !== "undefined" && data[key] !== null) {
                    arr[i] = key + "=" + data[key];
                    i++;
                }
            }
            if (url) url = url + "?" + arr.join("&");
            else url = arr.join("&");
            if (url.charAt(url.length - 1) == "?") url = url.split("?")[0];
            return url;
        }
        /**
         * 将链接中的参数输出为键值对象，锚直接忽略
         * @param {string} url 原始url
         */
        urlObj(url) {
            url = url || "";
            url = url.split('#')[0];
            url = url.split('?')[1] ? url.split('?')[1].split('&') : undefined;
            let obj = {};
            if (url) for (let i = 0; i < url.length; i++) obj[url[i].split('=')[0]] = url[i].split('=')[1] || "";
            return obj;
        }
        /**
         * 输出cookies键值对象
         */
        getCookies() {
            let cookies = document.cookie.split('; ');
            let obj = cookies.reduce((pre, next) => {
                let key = next.split('=')[0];
                let val = next.split('=')[1];
                pre[key] = val;
                return pre;
            }, {});
            return obj;
        }
        /**
         * 添加新的DOM节点
         * @param {string} type 节点tag名称
         * @param {Object} arb 节点属性对象
         * @param {boolean} [fir] 是否在body中置顶
         * @param {HTMLElement} [rep] 被替换的节点：将忽略fir参数
         */
        addElement(type, arb, fir, rep) {
            arb = arb || {};
            let emt = document.createElement(type);
            for (let key in arb) emt.setAttribute(key, arb[key]);
            if (rep) return rep.replaceWith(emt);
            fir ? document.body.insertBefore(emt, document.body.firstChild) : document.body.appendChild(emt);
        }
        /**
         * 添加css样式到<head>标签底部
         * @param {string} css css代码
         * @param {string} [id] <style>标签的id属性，用作唯一性检查
         */
        addCss(css, id) {
            if (!css) return;
            if (!document.head) {
                if (this.check) return;
                return setTimeout(() => { this.check = 1; this.addCss(css, id) });
            }
            let style = document.createElement("style");
            if (id) {
                if (document.querySelector("#" + id)) return;
                style.setAttribute("id", id);
            }
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(css));
            if (document.head) document.head.appendChild(style);
        }
        /**
         * 检查B站后端返回json的有效性，直接抛出错误信息！
         * @param {string} data json字符串
         */
        jsonCheck(data) {
            data = JSON.parse(data);
            if ("code" in data && data.code !== 0) {
                let msg = data.msg || data.message || "";
                throw [data.code, msg, data]
            }
            return data;
        }
        /**
         * 计算当前节点相对于文档的垂直偏移
         * @param {HTMLElement} node 节点
         */
        getTotalTop(node) {
            if (!node) return;
            var sum = 0;
            do {
                sum += node.offsetTop;
                node = node.offsetParent;
            }
            while (node);
            return sum;
        }
        /**
         * 重写页面
         * @param {string} html 页面文档字符串
         */
        write(html) {
            document.open();
            document.write(html);
            document.close();
        }
        /**
         * 滚动到旧版播放器
         */
        bofqiToView() {
            let bofqi = document.querySelector("#__bofqi") || document.querySelector(".bangumi_player") || document.querySelector("#bofqi");
            bofqi ? bofqi.scrollIntoView({ behavior: 'smooth', block: 'center' }) : "";
        }
    }

    let define = new Define();
    let makeExports = (type) => {
        return function (...msg) {
            return define[type](...msg);
        }
    }
    BLOD.timeFormat = makeExports("timeFormat");
    BLOD.sizeFormat = makeExports("sizeFormat");
    BLOD.unitFormat = makeExports("unitFormat");
    BLOD.bubbleSort = makeExports("bubbleSort");
    BLOD.randomArray = makeExports("randomArray");
    BLOD.abv = makeExports("abv");
    BLOD.urlSign = makeExports("urlSign");
    BLOD.objUrl = makeExports("objUrl");
    BLOD.urlObj = makeExports("urlObj");
    BLOD.getCookies = makeExports("getCookies");
    BLOD.addElement = makeExports("addElement");
    BLOD.addCss = makeExports("addCss");
    BLOD.jsonCheck = makeExports("jsonCheck");
    BLOD.getTotalTop = makeExports("getTotalTop");
    BLOD.write = makeExports("write");
    BLOD.bofqiToView = makeExports("bofqiToView");
})()