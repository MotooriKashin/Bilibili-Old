<<<<<<< HEAD
// module "define.js"
=======
/*
 * @module "define.js"
 * @description 函数声明模块，定义了一些很少改动的函数，统统挂载在BLOD下
 */
(function () {
    const BLOD = window.BLOD;
<<<<<<< HEAD
<<<<<<< HEAD
    console.log('import module "define.js"');
>>>>>>> 604ec62 (fix debug message)
=======
    console.debug('import module "define.js"');
>>>>>>> ad21ab5 (fix deal with debug message)

<<<<<<< HEAD
const BLOD = window.BLOD;

// 格式化时间
const timeFormat = (time,type) => {
    let date = new Date(time);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
    return type ? Y + M + D + h +m + s : h + m + s;
}
// 格式化存储
const sizeFormat = (size) => {
    let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
    while (dex > 1) {
        if (size >= vor) {
            size = (size / dex).toFixed(2);
            break;
=======
    // 时间格式化
    BLOD.timeFormat = (time, type) => {
        if (!time) return;
        let date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return type ? Y + M + D + h + m + s : h + m + s;
    }

    // 格式化存储
    BLOD.sizeFormat = (size) => {
        if (!size) return;
        let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
        while (dex > 1) {
            if (size >= vor) {
                size = (size / dex).toFixed(2);
                break;
            }
            dex = dex / 1024;
            vor = vor / 1000;
            i--;
>>>>>>> bc602f1 (添加参数无效判定)
        }
        dex = dex / 1024;
        vor = vor / 1000;
        i--;
    }
<<<<<<< HEAD
    return size + unit[i];
}
// 格式化进位
const unitFormat = (num) => {
    let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
    while (dex > 1) {
        if (num >= dex) {
            num = (num / dex).toFixed(1);
            break;
=======

    // 格式化进位
    BLOD.unitFormat = (num) => {
        if (!num) return;
        let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
        while (dex > 1) {
            if (num >= dex) {
                num = (num / dex).toFixed(1);
                break;
            }
            dex = dex / 10000;
            i--;
>>>>>>> bc602f1 (添加参数无效判定)
        }
        dex = dex / 10000;
        i--;
    }
<<<<<<< HEAD
    return num + unit[i];
}
// 冒泡排序
const bubbleSort = (arr) => {
    let temp=[];
    for (let i = 0; i < arr.length - 1; i++) {
        let bool = true;
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if(arr[j] > arr[j+1]){
                temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
                bool = false;
=======

    // 冒泡排序
    BLOD.bubbleSort = (arr) => {
        if (!arr) return;
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
>>>>>>> bc602f1 (添加参数无效判定)
            }
        }
        if (bool) break;
    }
<<<<<<< HEAD
    return arr;
}
// 随机抽取
const randomArray = (arr, num) => {
    let out = [];
    num = num || 1;
    num = num < arr.length ? num : arr.length;
    while(out.length < num){
        var temp = (Math.random()*arr.length) >> 0;
        out.push(arr.splice(temp,1)[0]);
    }
<<<<<<< HEAD
    return out;
}
// av/BV互转
// https://www.zhihu.com/question/381784377/answer/1099438784
const abv = (str) => {
    let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
    let tr = {}, s = [11, 10, 3, 8, 4, 6], xor = 177451812, add = 8728348608;
    for (let i = 0; i < 58; i++) tr[table[i]] = i;
    if (!(1 * str)) {
        let r = 0;
        for (let i = 0; i < 6; i++) r += tr[str[s[i]]]*58**i;
        return (r-add)^xor;
    } else {
        str = (str^xor) + add;
        let r = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
        for (let i = 0; i < 6; i++) r[s[i]] = table[parseInt(str/58**i)%58];
        return r.join("");
=======

    // 随机抽取
    BLOD.randomArray = (arr, num) => {
        if (!arr) return;
        let out = [];
        num = num || 1;
        num = num < arr.length ? num : arr.length;
        while (out.length < num) {
            var temp = (Math.random() * arr.length) >> 0;
            out.push(arr.splice(temp, 1)[0]);
        }
        return out;
>>>>>>> bc602f1 (添加参数无效判定)
    }
}
// 加密密钥
const appkeySign = () => {
    let table = 'rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg', str = '';
    for (let i = table.length -1; i >= 0; i--) str = str + String.fromCharCode(table[i].charCodeAt() + 2);
    return str.split(':')
}
// 对象转链接
const objUrl = (url, obj) => {
    if (obj) {
        let arr = [],i = 0;
        for (let key in obj) {
            if(obj[key] !== "" && obj[key] !== "undefined" && obj[key] !== null) {
=======

    // av/BV互转
    // https://www.zhihu.com/question/381784377/answer/1099438784
    BLOD.abv = (str) => {
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
    BLOD.urlSign = (url, obj, id) => {
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
            '16_d52_d/d22_2c0a.6573355/b`./bd8a`bc6114a30_4.`d'  // blink
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
    BLOD.objUrl = (url, obj) => {
        obj = typeof obj === "object" ? obj : {};
        let arr = [], i = 0;
        for (let key in obj) {
            if (obj[key] !== "undefined" && obj[key] !== null) {
>>>>>>> 884b647 (优化部分函数)
                arr[i] = key + "=" + obj[key];
                i++;
=======

    class Define {
        constructor() {
            console.debug('import module "define.js"');
        }
        // 格式化时间
        timeFormat(time, type) {
            if (time) {
                let date = new Date(time),
                    Y = date.getFullYear() + '-',
                    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
                    D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ',
                    h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':',
                    m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':',
                    s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return type ? Y + M + D + h + m + s : h + m + s;
            }
        }
        // 格式化存储
        sizeFormat(size) {
            if (size) {
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
        }
        // 格式化进位
        unitFormat(num) {
            if (1 * num) {
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
>>>>>>> dbc2aff (修复区域限制番剧“请求被拦截”错误)
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
                '16_d52_d/d22_2c0a.6573355/b`./bd8a`bc6114a30_4.`d'  // blink
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
        async addCss(css) {
            if (!css) return;
            let style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(css));
            setTimeout(() => {
                if (document.head) document.head.appendChild(style)
            });
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
<<<<<<< HEAD
        if (url) url = url + "?" + arr.join("&");
        else url = arr.join("&");
<<<<<<< HEAD
    }
    return url;
}
// 链接转对象
const urlObj = (url) => {
    url = url.split('#')[0];
    url = url.split('?')[1] ? url.split('?')[1].split('&') : "";
    if (!url) return;
    let obj = {};
    for (let i = 0; i < url.length; i++) obj[url[i].split('=')[0]] = url[i].split('=')[1];
    return obj;
}
// cookie对象
const getCookies = () => {
    let cookies = document.cookie.split('; ');
    let obj = cookies.reduce((pre, next) => {
        let key = next.split('=')[0];
        let val = next.split('=')[1];
        pre[key] = val;
        return pre;
    }, {});
    return obj;
}
// proto => xml
const toXml = (danmaku, cid) => {
    return new Promise(function (resolve) {
        danmaku.sort(function (a, b) {
            return a.progress - b.progress;
=======
        if (url.charAt(url.length - 1) == "?") url = url.split("?")[0];
        return url;
    }

    // 链接转对象
    BLOD.urlObj = (url) => {
        url = url || "";
        url = url.split('#')[0];
        url = url.split('?')[1] ? url.split('?')[1].split('&') : "";
        let obj = {};
        if (url) for (let i = 0; i < url.length; i++) obj[url[i].split('=')[0]] = url[i].split('=')[1] || "";
        return obj;
    }

    // cookie对象
    BLOD.getCookies = () => {
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
    BLOD.addCss = async (css) => {
        if (!css) return;
        let style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.appendChild(document.createTextNode(css));
        setTimeout(() => {
            if (document.head) document.head.appendChild(style)
>>>>>>> 884b647 (优化部分函数)
        });
        let dom = (new DOMParser()).parseFromString('<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>' + cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source></i>', "text/xml");
        let root = dom.childNodes[0];
        let d, attr, dmk;
        for (let i in danmaku) {
            dmk = danmaku[i];
            d = dom.createElement("d");
            attr = [dmk.progress / 1000, dmk.mode, dmk.fontsize, dmk.color, dmk.ctime, 0, dmk.midHash, dmk.id];
            d.setAttribute("p", attr.join(","));
            d.appendChild(dom.createTextNode(dmk.content));
            root.appendChild(d);
        }
        resolve(new XMLSerializer().serializeToString(dom));
    });
}
// 添加样式
const addCss = async (css) => {
    let style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.appendChild(document.createTextNode(css));
    setTimeout(() => {
        if (document.head) document.head.appendChild(style)
    });
}
// json校验
const jsonCheck = (data, toast) => {
    data = JSON.parse(data);
    if ("code" in data && data.code !== 0) {
        let msg = data.msg || data.message || "";
         if (toast) debug.msg("xhr错误：", data.code + " " + msg);
        throw [data.code, msg, data]
    }
<<<<<<< HEAD
    return data;
}
// 重写页面
const write = (html) => {
    window.stop();
    document.open();
    document.write(html);
    document.close();
}
const tryModule = (name, callback) => {
    try {
        callback();
    } catch(e) {
        e = Array.isArray(e) ? e : [e]; debug.error(name, ...e)
=======

    // 节点垂直偏移
    BLOD.getTotalTop = (node) => {
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
    BLOD.write = (html) => {
        document.open();
        document.write(html);
        document.close();
>>>>>>> bc602f1 (添加参数无效判定)
    }
}
// 播放器通知
const message = (...msg) => {
    let node = document.getElementsByClassName("bilibili-player-video-toast-bottom")[0];
        if (!node) {
            debug.log(...msg);
            return;
        }
        let item = document.createElement("div");
        item.setAttribute("class","bilibili-player-video-toast-item bilibili-player-video-toast-msg");
        item.appendChild(text);
        item.innerHTML = '<div class="bilibili-player-video-toast-item-text"><span class="video-float-hint-text"></span><span class="video-float-hint-btn hint-red"></span></div>';
        item.children[0].innerHTML = msg[0];
        item.children[1].innerHTML = msg[1];
        node.children[0] ? node.children[0].replaceWith(item) : node.appendChild(item);
        setTimeout(() => item.remove(), 3000);
}
// 通知封装
const debug = {
    log : (...msg) => console.log("[" + timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
    error : (...msg) => console.error("[" + timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
    warn : (...msg) => console.warn("[" + timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
    debug : (...msg) => console.debug("[" + timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
    msg : (...msg) => message(...msg)
}
const xhr = {
    // 同步方法
    'false' : (url) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.withCredentials = true;
        xhr.send(null);
        return xhr;
    },
    // 异步方法
    'true' : (url) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.withCredentials = true;
            xhr.onload = () => resolve(xhr);
            xhr.onerror = () => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
            xhr.send();
        });
    },
    // 跨域方法
    GM : (url) => {
        return new Promise((resolve, reject) => {
            BLOD.xmlHttpRequest({
                method    : "GET",
                url       : url,
                onload    : (xhr) => resolve(xhr),
                onerror   : (xhr) => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT"),
            });
        })
    },
    // 表单方法
    post : (url, header, data) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            header = header ? header : "application/x-www-form-urlencoded";
            xhr.open('post', url, true);
            xhr.setRequestHeader("Content-type", header);
            xhr.withCredentials = true;
            xhr.onload = () => resolve(xhr);
            xhr.onerror = () => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
            xhr.send(data);
        });
    }
}
// 暴露接口
BLOD.timeFormat = timeFormat;
BLOD.sizeFormat = sizeFormat;
BLOD.unitFormat = unitFormat;
BLOD.bubbleSort = bubbleSort;
BLOD.randomArray = randomArray;
BLOD.abv = abv;
BLOD.appkeySign = appkeySign;
BLOD.objUrl = objUrl;
BLOD.urlObj = urlObj;
BLOD.getCookies = getCookies;
BLOD.toXml = toXml;
BLOD.addCss = addCss;
BLOD.jsonCheck = jsonCheck;
BLOD.write = write;
BLOD.try = tryModule;
BLOD.debug = debug;
BLOD.xhr = xhr;
=======
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
>>>>>>> dbc2aff (修复区域限制番剧“请求被拦截”错误)
