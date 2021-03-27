/**
 * @module define
 * @description 定义了一些简单函数
 * @author MotooriKashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main */

    class Format {
        /**
         * 格式化时间
         * @param {number} [time] 时间戳(13位)
         * @param {boolean} [type] 只要有效返回值便加上年月日
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
            return size ? size + unit[i] : "N/A";
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
         * @param {[]} arr 数组
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
         * @param {[]} arr 目标数组
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
         * 将对象键值对转化为URL参数并返回完整URL
         * @param {string} url 原始url，无效则直接输出连接好的参数字符串
         * @param {{}} obj 包含参数键值对的对象，已存在的参数直接覆盖，参数值为 undefined 或 null 则忽略该参数
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
            let obj = {};
            url = url || "";
            url = url.split('?')[1] ? url.split('?')[1].split('&') : [];
            url.forEach(d => {
                if (d.includes("#")) d = d.split("#")[0];
                if (d) obj[d.split('=')[0]] = d.split('=')[1] || "";
            });
            return obj;
        }
    }

    class Abv {
        /**
         * @see mcfx {@link https://www.zhihu.com/question/381784377/answer/1099438784}
         */
        constructor() {
            this.base58Table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            this.digitMap = [11, 10, 3, 8, 4, 6];
            this.xor = 177451812;
            this.add = 8728348608;
            this.bvidTemplate = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
            this.table = {};
            for (let i = 0; i < 58; i++) this.table[this.base58Table[i]] = i;
        }
        /**
         * 输入av/BV，输出对应转化结果
         * @param {string | number} input av/BV
         */
        check(input) {
            if (/^[aA][vV][0-9]+$/.test(input) || /^\d+$/.test(input)) return this.avToBv(Number(/[0-9]+/.exec(input)[0]));
            if (/^1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}$/.test(input)) return this.bvToAv("BV" + input);
            if (/^[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}$/.test(input)) return this.bvToAv(input);
            throw input;
        }
        /**
         * BV => av
         * @param {string} BV 完整12位BV号
         * @return {number} 纯数字av号，不带av前缀
         */
        bvToAv(BV) {
            let r = 0;
            for (let i = 0; i < 6; i++) r += this.table[BV[this.digitMap[i]]] * 58 ** i;
            return (r - this.add) ^ this.xor;
        }
        /**
         * av => BV
         * @param {number} av av号，可以带av前缀
         * @return {string} 完整12位BV号
         */
        avToBv(av) {
            let bv = Array.from(this.bvidTemplate);
            av = (av ^ this.xor) + this.add;
            for (let i = 0; i < 6; i++) bv[this.digitMap[i]] = this.base58Table[parseInt(av / 58 ** i) % 58];
            return bv.join("");
        }
    }

    class UrlSign {
        constructor() {
            this.keySecret = [
                "rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg", // iVGU...uDCf
                "/a_206b`_.61.bca6117.175bcdadc41850c010c..././1``", // bb31...2e27
                "157bdd`6/bc73632.bcd660baa03a.43841211032b5c4`6b/", // 1d8b...3436
                "351a7a6b/.b`d77da1cdccc25_13bc0a81a6d63.7ad13`c50", // 27eb...f8c3
                "4_/54d`3_4_73..2c42`d4.a3__31b358d706d`._7a.3_b5.", // 07da...829f
                "12a.7c4b76c.a`12bb4`2b2b275c667c85b6d`c_c`0d5.051", // 3720...f8d7
                "bb16d652`04.7/121d3474b_2.c12`7386`0/bdd6ca0c7.22", // 4409...12b8
                "244_530/7/.ab`7.//22a15572502b_08c21./_.`3164`c36", // 85eb...034e
                "16_d52_d/d22_2c0a.6573355/b`./bd8a`bc6114a30_4.`d", // fb06...edbc
                "c02ba/d6.33d05cb/5d34.7d_23_`_2785`c60.a`.4343726", // 8495...8eb7
                "2aa2`.1_`_1.73`.70.67d.bc671c16382a3d`71a4.bcb3c7", // 9e5d...f5c4
                "40/171b046c/bcc0a603ac620`372ba_8d706d`._7a.3_b5.", // 07da...829f
                "c4_a.7562_15`_a416a/63/c2cbcb`308a/`//41b30376.b5"  // 7d08...1b1c
            ]
        }
        /**
         * 签名加密url
         * @param {string} url 需要签名的url链接，可以带参数
         * @param {{}} [obj] url的参数键值对，可以覆盖原有参数
         * @param {number} [id] 签名密钥ID
         */
        sign(url, obj = {}, id = 0) {
            if (!BLOD.md5) new Function(BLOD.getResourceText("md5"))();
            let table = {};
            this.restoreKey(Number(id));
            obj = (obj && typeof obj === "object") ? Object.assign(obj, BLOD.urlObj(url)) : BLOD.urlObj(url);
            url = url.split("?")[0];
            delete obj.sign;
            obj.appkey = this.key;
            Object.keys(obj).sort().map(key => { table[key] = obj[key] });
            if (id === 3 && table.api) table.sign = BLOD.md5(BLOD.objUrl("", { api: decodeURIComponent(table.api) }) + this.secret);
            else table.sign = BLOD.md5(BLOD.objUrl("", table) + this.secret);
            return BLOD.objUrl(url, table);
        }
        /**
         * 提取签名密钥
         * @param {number} [index] 签名密钥ID
         */
        restoreKey(index = 0) {
            index = index < this.keySecret.length ? index : 0;
            let table = this.keySecret[index];
            let key = ''
            this.key = '';
            this.secret = '';
            for (let i = table.length - 1; i >= 0; i--) key = key + String.fromCharCode(table[i].charCodeAt() + 2);
            this.key = key.split(':')[0];
            this.secret = key.split(':')[1];
        }
        /**
         * 混淆签名密钥
         * @param {string} key appkey
         * @param {string} secret appcecret
         */
        mixKey(key, secret) {
            let table = key + ":" + secret;
            let str = '';
            for (let i = table.length - 1; i >= 0; i--) str = str + String.fromCharCode(table[i].charCodeAt() - 2);
            return str;
        }
    }
    BLOD.UrlSign = UrlSign;

    class Define {
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
         * @param {{}} [arb] 节点属性对象
         * @param {HTMLElement} [tar] 宿主节点名称
         * @param {boolean} [fir] 是否在宿主中置顶
         * @param {HTMLElement} [rep] 被替换的节点：将忽略fir参数
         */
        addElement(type, arb = {}, tar = document.body, fir = false, rep) {
            let emt = document.createElement(type);
            for (let key in arb) emt.setAttribute(key, arb[key]);
            if (rep) return rep.replaceWith(emt);
            fir ? tar.insertBefore(emt, tar.firstChild) : tar.appendChild(emt);
            return emt;
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
                BLOD.debug.error("JSON error!", data);
                throw [data.code, msg];
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
        /**
         * 比较大小，仅用于弹幕排序
         * @param {string} num1 数字字符串 1
         * @param {string} num2 数字字符串 2
         * @returns {boolean} 前者大于后者返回真，否则返回假，相等也返回假
         */
        bigInt(num1, num2) {
            // 数位不同，前者大为真，否则为假
            if (num1.length > num2.length) return true;
            else if (num1.length < num2.length) return false;
            else {
                // 数位相同，逐位比较
                for (let i = 0; i < num1.length; i++) {
                    // 任意一位前者大为真
                    if (num1[i] > num2[i]) return true;
                    // 任意一位前者小为假
                    if (num1[i] < num2[i]) return false;
                    // 仅当位相等时继续比较下一位
                }
                // 包括相等情况返回假
                return false;
            }
        }
        /**
         * 将弹幕数组按弹幕id升序排序
         * @param  {[]} danmaku 要排序的弹幕数组
         * @param  {string} key 弹幕id的属性名，应为dmid或idStr
         */
        sortDmById(danmaku, key) {
            let egx = /^\d+$/;
            for (let i = 0, d; i < danmaku.length; i++) {
                d = danmaku[i];
                // 判断输入是否纯数字
                if (!egx.test(d[key])) throw "请输入数字字符串";
                // 强制转化输入为字符串
                if (typeof d[key] !== "string") d[key] = String(d[key]);
                // 去除数字开头占位的0
                d[key] = d[key].replace(/^0+/, "");
            }
            danmaku.sort((a, b) => this.bigInt(a[key], b[key]) ? 1 : -1);
        }
    }

    let define = new Define();
    let format = new Format();
    let abv = new Abv();

    BLOD.timeFormat = (...arg) => { return format.timeFormat(...arg) };
    BLOD.sizeFormat = (...arg) => { return format.sizeFormat(...arg) };
    BLOD.unitFormat = (...arg) => { return format.unitFormat(...arg) };
    BLOD.bubbleSort = (...arg) => { return format.bubbleSort(...arg) };
    BLOD.randomArray = (...arg) => { return format.randomArray(...arg) };
    BLOD.objUrl = (...arg) => { return format.objUrl(...arg) };
    BLOD.urlObj = (...arg) => { return format.urlObj(...arg) };
    BLOD.abv = (input) => { return abv.check(input) };
    BLOD.urlSign = (...arg) => { return (new BLOD.UrlSign()).sign(...arg) };
    BLOD.getCookies = () => { return define.getCookies() };
    BLOD.addElement = (...arg) => { return define.addElement(...arg) };
    BLOD.addCss = (...arg) => { return define.addCss(...arg) };
    BLOD.jsonCheck = (...arg) => { return define.jsonCheck(...arg) };
    BLOD.getTotalTop = (node) => { return define.getTotalTop(node) };
    BLOD.write = (html) => { return define.write(html) };
    BLOD.bofqiToView = () => { return define.bofqiToView() };
    BLOD.bigInt = (num1, num2) => { return define.bigInt(num1, num2) };
    BLOD.sortDmById = (danmaku, key) => { return define.sortDmById(danmaku, key) };
})()