/**
 * @module define
 * @description 预定义了一些基本函数
 * @author MotooriKashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main*/
    /**
     * @class Config
     * @description 处理脚本设置
     */
    class Config {
        constructor() {
            // 获取默认设置
            BLOD.config = JSON.parse(BLOD.getResourceText("config"));
            this.sort = ["rewrite", "reset"];
            this.default = BLOD.defaultConfig = JSON.parse(JSON.stringify(BLOD.config));
        }
        /**
         * 初始化设置数据，模块载入时运行一次
         */
        init() {
            this.config = BLOD.getValue("config");
            // 过滤无须储存设置
            for (let key in BLOD.config) if (!this.sort.includes(key)) delete BLOD.config[key];
            if (this.config) {
                this.sort.forEach(d => {
                    // 读取本地设置
                    for (let key in this.config[d]) if (key in BLOD.config[d]) BLOD.config[d][key] = this.config[d][key];
                    // 初始化新增设置
                    for (let key in BLOD.config[d]) BLOD.config[d][key] = Array.isArray(BLOD.config[d][key]) ? BLOD.config[d][key][0] : BLOD.config[d][key];
                })
            } else {
                // 初始化默认设置
                this.sort.forEach(d => {
                    for (let key in BLOD.config[d]) BLOD.config[d][key] = BLOD.config[d][key][0];
                })
                BLOD.setValue("config", BLOD.config);
            }
        }
        /**
         * 恢复默认设置
         */
        reset() {
            // 恢复默认设置
            this.sort.forEach(d => {
                for (let key in BLOD.config[d]) BLOD.config[d][key] = this.default[d][key][0];
            })
            BLOD.setValue("config", BLOD.config);
        }
    }
    /**
     * @class ForMat
     * @description 定义各种格式化工具
     */
    class ForMat {
        /**
         * 格式化时间
         * @param {number} [time] 13位时间戳
         * @param {boolean} [type] 是否包括年月日
         * @returns {string} 时:分:秒 | 年-月-日 时:分:秒
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
         * @returns {string} x B | K | M | G
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
         * @returns {string} x /万/亿
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
         * @returns {[]} 排序后的数组
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
         * @returns {[]} 抽取结果组成的新数组
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
         * @param {string} url 原始url
         * @param {{}} obj 包含参数键值对的对象，已存在的参数直接覆盖，参数值为 undefined 或 null 则忽略该参数
         * @returns {string} URL+参数，URL无效直接输出连接好的参数字符串
         */
        objUrl(url, obj) {
            let data = this.urlObj(url);
            obj = typeof obj === "object" ? obj : {};
            data = Object.assign(data, obj);
            let arr = [], i = 0;
            for (let key in data) {
                if (data[key] !== undefined && data[key] !== null) {
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
         * @param {string} url 原始URL
         * @param {{}} 包含参数键值对的对象，原URL不含参数则返回空对象
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

    /**
     * @class Abv
     * @description av/BV互转
     */
    class Abv {
        /**
         * @class Abv
         * @description av/BV转化工具
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
         * @returns {number | string} BV/av
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
         * @returns {number} 纯数字av号，不带av前缀
         */
        bvToAv(BV) {
            let r = 0;
            for (let i = 0; i < 6; i++) r += this.table[BV[this.digitMap[i]]] * 58 ** i;
            return (r - this.add) ^ this.xor;
        }
        /**
         * av => BV
         * @param {number} av av号，可以带av前缀
         * @returns {string} 完整12位BV号
         */
        avToBv(av) {
            let bv = Array.from(this.bvidTemplate);
            av = (av ^ this.xor) + this.add;
            for (let i = 0; i < 6; i++) bv[this.digitMap[i]] = this.base58Table[parseInt(av / 58 ** i) % 58];
            return bv.join("");
        }
    }

    /**
     * @class UrlSign
     * @description URL签名
     */
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
         * 签名加密URL
         * @param {string} url 需要签名的URL链接，可以带参数
         * @param {{}} [obj] URL的参数键值对，可以覆盖原有参数
         * @param {number} [id] 签名密钥ID
         * @param {string} 签名过的URL
         */
        sign(url, obj = {}, id = 0) {
            BLOD.importModule("md5");
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
         * @returns {[]} [key, secret]
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
            return [this.key, this.secret];
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

    /**
     * @class Define
     * @description 其他工具
     */
    class Define {
        /**
         * 输出cookies对象
         * @returns {{}} cookies对象
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
         * @returns {HTMLElement} 所添加的新节点
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
         * @returns {JSON} JSON数据
         */
        jsonCheck(data) {
            data = typeof data === "string" ? JSON.parse(data) : data;
            if ("code" in data && data.code !== 0) {
                let msg = data.msg || data.message || "";
                BLOD.debug.error("JSON error!", data);
                throw [data.code, msg];
            }
            return data;
        }
        /**
         * 计算当前节点相对于文档的垂直偏移
         * @param {HTMLElement} node 所需计算的节点
         * @returns {number} 相对于文档的垂直便宜，单位/px
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
            if (window.self != window.top && BLOD.config.reset.viewbofqi != 2) return;
            let bofqi = document.querySelector("#__bofqi") || document.querySelector(".bangumi_player") || document.querySelector("#bofqi") || document.querySelector("#bilibiliPlayer");
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
        /**
         * 代理退出登录
         * @param {string} [referer] 退出成功后跳转的页面
         * @returns {Promise<void>} 无
         */
        async loginExit(referer) {
            if (!BLOD.uid) return BLOD.toast.warning("本就未登录，无法退出登录！");
            BLOD.toast.warning("正在退出登录...");
            let data = BLOD.jsonCheck(await xhr.post("https://passport.bilibili.com/login/exit/v2", "biliCSRF=" + BLOD.getCookies().bili_jct + "&gourl=" + encodeURIComponent(location.href)));
            if (data.status) {
                BLOD.toast.success("退出登录！");
                if (referer) return location.replace(referer);
                setTimeout(() => location.reload(), 1000);
            }
        }
        /**
         * 变量捕获
         * @param {object} origin 变量所属对象
         * @param {string} target 变量名称
         * @param {string} [record] 挂在于BLOD的用于记录变量赋值的变量，留空则取target
         * @param {[]} [result] 固定变量的值（包含于数组之内）：仅用于强制指定变量的值，否则请留空！
         * @param {Boolean} [configurable] 改变量是否可以重新捕获，默认为真
         */
        getVariable(origin, target, record, result = [], configurable = true) {
            let obj = {};
            record = record || target;
            obj.set = (v) => { BLOD.record = v };
            obj.get = () => { return result[0] || BLOD.record };
            obj.configurable = configurable;
            Object.defineProperty(origin, target, obj);
        }
        /**
         * 保护旧版播放器设置
         */
        playerSetting() {
            let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
            if (bilibili_player_settings) {
                bilibili_player_settings = JSON.parse(bilibili_player_settings);
                // 记录防挡字幕状态
                if (bilibili_player_settings.setting_config && bilibili_player_settings.setting_config.preventshade) BLOD.preventshade = 1;
                if (bilibili_player_settings.video_status.autopart !== "") BLOD.setValue("bilibili_player_settings", bilibili_player_settings);
                else if (BLOD.getValue("bilibili_player_settings")) localStorage.setItem("bilibili_player_settings", JSON.stringify(BLOD.getValue("bilibili_player_settings")));
            } else if (BLOD.getValue("bilibili_player_settings")) {
                localStorage.setItem("bilibili_player_settings", JSON.stringify(BLOD.getValue("bilibili_player_settings")));
            }
        }
    }

    /**
     * @class Debug
     * @description 控制台消息封装
     */
    class Debug {
        log(...data) {
            console.log(`%c[${BLOD.timeFormat()}]`, "color: blue;", ...data);
        }
        info(...data) {
            console.info(`%c[${BLOD.timeFormat()}]`, "color: green;", ...data);
        }
        debug(...data) {
            console.debug(`[${BLOD.timeFormat()}]`, ...data);
        }
        warn(...data) {
            console.warn(`[${BLOD.timeFormat()}]`, ...data);
        }
        error(...data) {
            console.error(`[${BLOD.timeFormat()}]`, ...data);
        }
        /**
         * 旧版播放器消息
         * @param {number} [time] 消息停留时间，单位/秒，默认为 3
         * @param {string} text 所需显示的消息
         * @param {string} [red] 所需显示的消息，标红
         * @param {string} [yellow] 所需显示的消失，标黄
         * @param {Boolean} [replace] 是否替换当前已显示的消息，默认为真
         * @param {Function} [callback] 红色消息被点击时的回调函数，用于交互
         * @returns 旧版播放器不存在时将所有消息打印到控制台
         */
        msg(time = 3, text, red, yellow, replace = true, callback) {
            BLOD.config.reset.preview = 0;
            this.node = document.querySelector(".bilibili-player-video-toast-bottom");
            time = time * 1000 || 3000;
            if (!this.node) return this.log(text, red, yellow);
            if (replace) {
                if (this.node.children[0]) this.node = BLOD.addElement("div", { class: "bilibili-player-video-toast-item bilibili-player-video-toast-pay" }, this.node, false, this.node.children[0]);
                else this.node = BLOD.addElement("div", { class: "bilibili-player-video-toast-item bilibili-player-video-toast-pay" }, this.node);
            } else this.node = BLOD.addElement("div", { class: "bilibili-player-video-toast-item bilibili-player-video-toast-pay" }, this.node);
            this.node.innerHTML = '<div class="bilibili-player-video-toast-item-text"></div>';
            this.item = this.node.children[0];
            if (text) {
                this.text = BLOD.addElement("span", { class: "video-float-hint-text" }, this.item);
                this.text.innerHTML = text;
            }
            if (red) {
                this.red = BLOD.addElement("span", { class: "video-float-hint-btn hint-red" }, this.item);
                this.red.innerHTML = red;
            }
            if (yellow) {
                this.yellow = BLOD.addElement("span", { class: "video-float-hint-btn" }, this.item);
                this.yellow.innerHTML = yellow;
            }
            if (callback) {
                this.red.setAttribute("style", "cursor: pointer;");
                this.red.onclick = () => {
                    this.node.remove();
                    clearTimeout(this.timeout);
                    callback();
                }
            }
            this.timeout = setTimeout(() => this.node.remove(), time);
        }
    }

    /**
     * @class Toast
     * @see toastr {@link https://github.com/CodeSeven/toastr/}
     * @license BSD-3-Clause
     */
    class Toast {
        constructor() {
            this.config = { timeout: 4, step: 250 };
            this.count = 0; // 未显示的通知数
            this.sence = 60; // 动效计数
            this.container = document.createElement("div");
            this.container.setAttribute("id", "toast-container");
            this.container.setAttribute("class", "toast-top-right");
        }
        /**
         * 添加toast样式
         */
        async addCss() {
            BLOD.addCss(BLOD.getResourceText("toast"), "toastr-style");
        }
        /**
         * 调整设置
         * @param {object} [config] 设置键值对
         * @param {number} [config.timeout] 通知浮现时长
         * @param {number} [config.step] 同时通知间隔
         * @param {{}} 调整后的设置
         */
        change(config) {
            if (config) {
                this.config = config;
                this.timeout = this.config.timeout; // 通知显示时间，单位/秒
                this.step = this.config.step; // 通知间的最小间隔，单位/毫秒
                BLOD.setValue("toast", this.config);
                return config;
            }
            else return this.change(this.config);
        }
        /**
         * @param {string} [type = info | success | warning | error] 通知类型
         * @param  {...string} msg 通知内容
         */
        show(type, ...msg) {
            if (!BLOD.config.reset.toast) return;
            if (!document.body) {
                if (this.check) return;
                return setTimeout(() => { this.check = 1; this.show(type, ...msg) });
            }
            this.addCss();
            if (!document.querySelector("#toast-container")) document.body.appendChild(this.container);
            this.box = document.querySelector("#toast-container");
            let item = document.createElement("div");
            item.setAttribute("class", "toast toast-" + type);
            item.setAttribute("aria-live", "assertive");
            item.setAttribute("style", "visibility: hidden;position: absolute");
            setTimeout(() => {
                if (this.count > 0) this.count--;
                item = this.box.insertBefore(item, this.box.firstChild);
                item.appendChild(this.msg(...msg));
                this.come(item);
                setTimeout(() => this.quit(item), this.timeout * 1000);
            }, this.count * this.step);
            this.count++;
        }
        /**
         * 展开toast通知
         * @param {HTMLElement} item 通知节点
         * @param {number} [i] 声明用，禁填！设定将一个通知分成i等分0->i逐渐展开动效
         */
        come(item, i = 0) {
            let height = item.clientHeight;
            item.setAttribute("style", "display: none;");
            let timer = setInterval(() => {
                i++;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === this.sence) {
                    clearInterval(timer);
                    item.removeAttribute("style");
                }
            })
        }
        /**
         * 收起toast通知
         * @param {HTMLElement} item 通知节点
         * @param {number} [i] 声明用，禁填！设定将一个通知分成i等分i->0逐渐收起动效
         */
        quit(item, i = this.sence) {
            let height = item.clientHeight;
            let timer = setInterval(() => {
                i--;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === 0) {
                    clearInterval(timer);
                    item.remove();
                    if (!this.box.firstChild) this.box.remove();
                }
            })
        }
        msg(...msg) {
            let div = document.createElement("div");
            div.setAttribute("class", "toast-message");
            div.innerHTML = "";
            msg.forEach(d => {
                d = d || "";
                d = String(d);
                div.innerHTML = div.innerHTML ? div.innerHTML + "<br />" + d : div.innerHTML + d;
            });
            return div;
        }
    }

    /**
     * @class Xhr
     * @description XMLHttpRequest封装
     */
    class Xhr {
        constructor() {
            BLOD.xhrLog = [];
        }
        /**
         * 同步链接
         * @param {string} url 链接url
         * @param {boolean} [credentials] 设定是否携带cookies，默认为 true
         * @returns {string | JSON | ArrayBuffer | Blob | Document} xhr返回值
         */
        false(url, credentials = true) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.withCredentials = credentials;
            xhr.send(null);
            return xhr.responseText;
        }
        /**
         * 异步链接
         * @param {string} url 链接url
         * @param {string} [responseType] 设定服务器返回值
         * @param {{}} [headers] 设定请求头键值对，注意有些属性是不可修改的
         * @param {boolean} [credentials] 设定是否携带cookies，默认为 true
         * @returns {Promise<string | JSON | ArrayBuffer | Blob | Document>} xhr返回值
         */
        true(url, responseType = "text", headers = {}, credentials = true) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.responseType = responseType;
                for (let key in headers) if (key && headers[key]) xhr.setRequestHeader(key, headers[key]);
                xhr.withCredentials = credentials;
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => {
                    toast.error("method：GET", "url：" + url, xhr.statusText || "");
                    reject(xhr.statusText || "xhr出错！");
                }
                xhr.send();
            });
        }
        /**
         * 跨域链接
         * @param {string} url 链接url
         * @param {{}} [headers] 设定请求头：user-agent, referer, ...
         * @returns {Promise<string | JSON | ArrayBuffer | Blob | Document>} xhr返回值
         */
        GM(url, headers = {}) {
            return new Promise((resolve, reject) => {
                BLOD.xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: headers,
                    onload: (xhr) => {
                        BLOD.xhrLog.push([BLOD.timeFormat(), url, (String(xhr.responseText).startsWith("{") ? JSON.parse(xhr.responseText) : xhr.responseText)]);
                        resolve(xhr.responseText);
                    },
                    onerror: (xhr) => {
                        toast.error("method：GET", "url：" + url, xhr.statusText || "");
                        reject(xhr.statusText || "xhr出错！");
                    }
                });
            })
        }
        /**
         * post方法
         * @param {string} url 链接url
         * @param {*} [data] 所需提交的数据，post方法专属
         * @param {{}} [headers] 设定请求头，注意有些属性是不可修改的
         * @param {boolean} [credentials] 设定是否携带cookies，默认为 true
         * @returns {Promise<string>} xhr返回值
         */
        post(url, data, headers = { "Content-type": "application/x-www-form-urlencoded" }, credentials = true) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('post', url, true);
                for (let key in headers) if (key && headers[key]) xhr.setRequestHeader(key, headers[key]);
                xhr.withCredentials = credentials;
                xhr.onload = () => resolve(xhr.responseText);
                xhr.onerror = () => {
                    toast.error("method：POST", "url：" + url, xhr.statusText || "");
                    reject(xhr.statusText || "xhr出错！");
                }
                xhr.send(data);
            });
        }
    }

    // 模块初始化
    let config = new Config();
    let format = new ForMat();
    let define = new Define();
    let debug = new Debug();
    let toast = new Toast();
    let xhr = new Xhr();
    config.init();
    BLOD.initConfig = () => { config.reset() }
    BLOD.timeFormat = (time, type) => { return format.timeFormat(time, type) }
    BLOD.sizeFormat = (size) => { return format.sizeFormat(size) }
    BLOD.unitFormat = (num) => { return format.unitFormat(num) }
    BLOD.bubbleSort = (arr) => { return format.bubbleSort(arr); }
    BLOD.randomArray = (arr, num) => { return format.randomArray(arr, num) }
    BLOD.objUrl = (url, obj) => { return format.objUrl(url, obj) }
    BLOD.urlObj = (url) => { return format.urlObj(url) }
    BLOD.abv = (input) => { return new Abv().check(input) }
    BLOD.urlSign = (url, obj, id) => { return new UrlSign().sign(url, obj, id) }
    BLOD.urlSign.restoreKey = (id) => { return new UrlSign().restoreKey(id) }
    BLOD.urlSign.mixKey = (key, secret) => { return new UrlSign().mixKey(key, secret) }
    BLOD.getCookies = () => { return define.getCookies() }
    BLOD.addElement = (type, arb, tar, fir, rep) => { return define.addElement(type, arb, tar, fir, rep) }
    BLOD.addCss = (css, id) => { return define.addCss(css, id) }
    BLOD.jsonCheck = (data) => { return define.jsonCheck(data) }
    BLOD.getTotalTop = (node) => { return define.getTotalTop(node) }
    BLOD.write = (html) => { return define.write(html) }
    BLOD.bofqiToView = () => { return define.bofqiToView() }
    BLOD.bigInt = (num1, num2) => { return define.bigInt(num1, num2) }
    BLOD.sortDmById = (danmaku, key) => { return define.sortDmById(danmaku, key) }
    BLOD.getVariable = (origin, target, record, result, configurable) => { define.getVariable(origin, target, record, result, configurable) }
    BLOD.playerSetting = () => { define.playerSetting() }
    BLOD.loginExit = (referer) => { define.loginExit(referer) }
    BLOD.debug = (...data) => { debug.log(...data) }
    BLOD.debug.log = (...data) => { debug.log(...data) }
    BLOD.debug.info = (...data) => { debug.info(...data) }
    BLOD.debug.debug = (...data) => { debug.debug(...data) }
    BLOD.debug.warn = (...data) => { debug.warn(...data) }
    BLOD.debug.error = (...data) => { debug.error(...data) }
    BLOD.toast = (...data) => { toast.show("info", ...data); debug.log(...data) }
    BLOD.toast.info = (...data) => { toast.show("info", ...data); debug.log(...data) }
    BLOD.toast.success = (...data) => { toast.show("success", ...data); debug.info(...data) }
    BLOD.toast.warning = (...data) => { toast.show("warning", ...data); debug.warn(...data) }
    BLOD.toast.error = (...data) => { toast.show("error", ...data); debug.error(...data) }
    BLOD.toast.config = toast.config;
    BLOD.toast.config.change = (config) => { return toast.change(config) }
    BLOD.xhr = (url, responseType, headers, credentials) => { return xhr.true(url, responseType, headers, credentials) }
    BLOD.xhr.true = (url, responseType, headers, credentials) => { return xhr.true(url, responseType, headers, credentials) }
    BLOD.xhr.false = (url, credentials) => { return xhr.false(url, credentials) }
    BLOD.xhr.post = (url, data, headers, credentials) => { return xhr.post(url, data, headers, credentials) }
    BLOD.xhr.GM = (url, headers) => { return xhr.GM(url, headers) }

    // 捕获全局变量
    define.getVariable(window, "aid"); // aid
    define.getVariable(window, "cid"); // cid
    // 禁用BV
    define.getVariable(window, "__BILI_CONFIG__", undefined, [{ "show_bv": false }]);

    // 初始化toast
    toast.change(BLOD.getValue("toast"));
    toast.addCss();

    BLOD.uid = BLOD.getCookies().DedeUserID; // 记录用户uid：用于判断是否登录
    BLOD.path = document.location.href.split('/'); // URL数组，用于页面分离
    if (BLOD.uid) {
        // 代理旧版退出页面
        if (location.href.includes("bilibili.com/login?act=exit")) define.loginExit(document.referrer);
        // 修复动态记录
        let offset = BLOD.getCookies()["bp_video_offset_" + BLOD.uid];
        if (offset) document.cookie = "bp_t_offset_" + BLOD.uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; BLOD.path=/";
    }

})();
