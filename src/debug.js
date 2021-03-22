/**
 * @module debug
 * @description 调试模块：封装了console和toastr
 * @author Motoori Kashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main */

    class Debug {
        constructor() {
            console.debug('import module "debug.js"');
        }
        log(...msg) {
            console.log("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        error(...msg) {
            console.error("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        warn(...msg) {
            console.warn("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        debug(...msg) {
            console.debug("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
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

    const debug = () => {
        let debug = new Debug();
        let makeExports = (type) => {
            return (...msg) => {
                return debug[type](...msg);
            }
        }
        let method = makeExports("log");
        method.log = makeExports("log");
        method.error = makeExports("error");
        method.warn = makeExports("warn");
        method.debug = makeExports("debug");
        method.msg = makeExports("msg");
        return method;
    }
    BLOD.debug = debug();

    /**
     * @see toastr {@link https://github.com/CodeSeven/toastr/}
     * @license BSD-3-Clause
     */
    class Toast {
        constructor() {
            this.default = { timeout: 4, step: 250 };
            this.change(BLOD.getValue("toast"));
            BLOD.addCss(BLOD.getResourceText("toast"), "toastr-style");
            this.count = 0; // 未显示的通知数
            this.container = document.createElement("div");
            this.container.setAttribute("id", "toast-container");
            this.container.setAttribute("class", "toast-top-right");
        }
        /**
         * 调整设置
         * @param {{}} config 设置键值对
         */
        change(config) {
            if (config) {
                this.config = config;
                this.timeout = this.config.timeout; // 通知显示时间，单位/秒
                this.step = this.config.step; // 通知间的最小间隔，单位/毫秒
                BLOD.setValue("toast", this.config);
                return config;
            }
            else return this.change(this.default);
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
            if (!document.querySelector("toastr-style")) BLOD.addCss(BLOD.getResourceText("toast"), "toastr-style");
            if (!document.querySelector("#toast-container")) document.body.appendChild(this.container);
            this.box = document.querySelector("#toast-container");
            let item = document.createElement("div");
            item.setAttribute("class", "toast toast-" + type);
            item.setAttribute("aria-live", "assertive");
            item.setAttribute("style", "opacity: 0.0");
            setTimeout(() => {
                if (this.count > 0) this.count--;
                item = this.box.insertBefore(item, this.box.firstChild);
                item.appendChild(this.msg(...msg));
                this.come(item);
                setTimeout(() => this.quit(item), this.timeout * 1000);
            }, this.count * this.step);
            this.count++;
        }
        come(item, i = 0) {
            let timer = setInterval(() => {
                i++;
                item.setAttribute("style", "opacity: ." + i);
                if (i === 8) {
                    clearInterval(timer);
                    item.removeAttribute("style");
                }
            }, 50)
        }
        quit(item, i = 8) {
            let timer = setInterval(() => {
                i--;
                item.setAttribute("style", "opacity: ." + i);
                if (i === 0) {
                    clearInterval(timer);
                    item.remove();
                    if (!this.box.firstChild) this.box.remove();
                }
            }, 50)
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

    const toast = () => {
        let toast = new Toast();
        let makeExports = (type) => {
            return (...arg) => {
                switch (type) {
                    case "info": BLOD.debug.debug(...arg);
                        break;
                    case "error": BLOD.debug.error(...arg);
                        break;
                    case "success": BLOD.debug(...arg);
                        break;
                    case "warning": BLOD.debug.warn(...arg);
                        break;
                }
                return toast.show(type, ...arg);
            }
        }
        let method = makeExports("info");
        method.info = makeExports("info");
        method.error = makeExports("error");
        method.success = makeExports("success");
        method.warning = makeExports("warning");
        method.change = (config) => { return toast.change(config) }
        method.config = toast.config;
        return method;
    }
    BLOD.toast = toast();

})()