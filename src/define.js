/*
 * @module "define.js"
 * @description 函数声明模块，定义了一些很少改动的函数，统统挂载在BLOD下
 */
(function () {
    const BLOD = window.BLOD;

    class Define {
        constructor() {
            console.debug('import module "define.js"');
        }
        // 格式化时间
        timeFormat(time = new Date(), type) {
            let date = new Date(time),
                Y = date.getFullYear() + '-',
                M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
                D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ',
                h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':',
                m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':',
                s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return type ? Y + M + D + h + m + s : h + m + s;
        }
        // 格式化存储
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
        // 格式化进位
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
        // 冒泡排序
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
        // 随机抽取
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
        // av/BV互转 @https://www.zhihu.com/question/381784377/answer/1099438784
        abv(str) {
            if (!str) return;
            let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            let tr = {}, s = [11, 10, 3, 8, 4, 6], xor = 177451812, add = 8728348608;
            for (let i = 0; i < 58; i++) tr[table[i]] = i;
            if (!(1 * str)) {
                let r = 0;
                for (let i = 0; i < 6; i++) r += tr[str[s[i]]] * 58 ** i;
                return (r - add) ^ xor;
            } else {
                str = (str ^ xor) + add;
                let r = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
                for (let i = 0; i < 6; i++) r[s[i]] = table[parseInt(str / 58 ** i) % 58];
                return r.join("");
            }
        }
        // keysecret
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
        // 对象转链接
        objUrl(url, obj) {
            obj = typeof obj === "object" ? obj : {};
            let arr = [], i = 0;
            for (let key in obj) {
                if (obj[key] !== "undefined" && obj[key] !== null) {
                    arr[i] = key + "=" + obj[key];
                    i++;
                }
            }
            if (url) url = url + "?" + arr.join("&");
            else url = arr.join("&");
            if (url.charAt(url.length - 1) == "?") url = url.split("?")[0];
            return url;
        }
        // 链接转对象
        urlObj(url) {
            url = url || "";
            url = url.split('#')[0];
            url = url.split('?')[1] ? url.split('?')[1].split('&') : "";
            let obj = {};
            if (url) for (let i = 0; i < url.length; i++) obj[url[i].split('=')[0]] = url[i].split('=')[1] || "";
            return obj;
        }
        // cookie对象
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
        // 添加样式
        addCss(css) {
            if (!css) return;
            let style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(css));
            if (document.head) document.head.appendChild(style);
            else {
                setTimeout(() => {
                    if (document.head) document.head.appendChild(style);
                })
            }
        }
        // json校验
        jsonCheck(data) {
            data = JSON.parse(data);
            if ("code" in data && data.code !== 0) {
                let msg = data.msg || data.message || "";
                throw [data.code, msg, data]
            }
            return data;
        }
        // 节点垂直偏移
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
        // 重写页面
        write(html) {
            document.open();
            document.write(html);
            document.close();
        }
        // 滚动到播放器
        bofqiToView() {
            let bofqi = document.querySelector("#__bofqi") || document.querySelector(".bangumi_player") || document.querySelector("#bofqi") || "";
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
    BLOD.addCss = makeExports("addCss");
    BLOD.jsonCheck = makeExports("jsonCheck");
    BLOD.getTotalTop = makeExports("getTotalTop");
    BLOD.write = makeExports("write");
    BLOD.bofqiToView = makeExports("bofqiToView");
})()