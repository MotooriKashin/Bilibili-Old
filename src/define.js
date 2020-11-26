<<<<<<< HEAD
// module "define.js"
=======
/*
 * module "define.js"
 */
(function () {
    const BLOD = window.BLOD;
    console.log('import module "define.js"');
>>>>>>> 604ec62 (fix debug message)

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
        }
        dex = dex / 1024;
        vor = vor / 1000;
        i--;
    }
    return size + unit[i];
}
// 格式化进位
const unitFormat = (num) => {
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
            }
        }
        if (bool) break;
    }
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
                arr[i] = key + "=" + obj[key];
                i++;
            }
        }
        if (url) url = url + "?" + arr.join("&");
        else url = arr.join("&");
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