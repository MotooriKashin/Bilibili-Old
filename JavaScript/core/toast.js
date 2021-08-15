"use strict";
class Toast {
    /**
     * 配置数据
     */
    static config;
    /**
     * 通知节点，初始化专用
     */
    static container;
    /**
     * 通知样式
     */
    static style;
    /**
     * 判定`body`是否存在
     */
    static check;
    /**
     * 通知节点，呈现时
     */
    static box;
    /**
     * 未呈现通知计数
     */
    static count = 0;
    /**
     * 动画呈现帧数
     */
    static sence = 60;
    constructor() {
        Toast.init();
    }
    static init() {
        this.container = document.createElement("div");
        this.style = document.createElement("link");
        this.container.setAttribute("id", "toast-container");
        this.container.setAttribute("class", "toast-top-right");
        this.style.setAttribute("rel", "stylesheet");
        this.style.setAttribute("id", "toastr-style");
        this.style.setAttribute("href", "https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css");
    }
    static show(type, ...msg) {
        if (!config.toastcheck)
            return;
        if (!document.body) {
            if (this.check)
                return;
            return setTimeout(() => { this.check = true; this.show(type, ...msg); });
        }
        document.querySelector("#toastr-style") || document.head.appendChild(this.style);
        document.querySelector("#toast-container") || document.body.appendChild(this.container);
        this.box = document.querySelector("#toast-container") || this.container;
        let item = document.createElement("div");
        item.setAttribute("class", "toast toast-" + type);
        item.setAttribute("aria-live", "assertive");
        item.setAttribute("style", "visibility: hidden;position: absolute");
        setTimeout(() => {
            if (this.count > 0)
                this.count--;
            item = this.box.insertBefore(item, this.box.firstChild);
            item.appendChild(this.msg(...msg));
            this.come(item);
            setTimeout(() => this.quit(item), (Number(config.toasttimeout) || 4) * 1000);
        }, this.count * (Number(config.toaststep) || 250));
        this.count++;
    }
    static come(item, i = 0) {
        let height = item.clientHeight;
        item.setAttribute("style", "display: none;");
        let timer = setInterval(() => {
            i++;
            item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
            if (i === this.sence) {
                clearInterval(timer);
                item.removeAttribute("style");
            }
        });
    }
    static quit(item, i = this.sence) {
        let height = item.clientHeight;
        let timer = setInterval(() => {
            i--;
            item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
            if (i === 0) {
                clearInterval(timer);
                item.remove();
                if (!this.box.firstChild)
                    this.box.remove();
            }
        });
    }
    static msg(...msg) {
        let div = document.createElement("div");
        div.setAttribute("class", "toast-message");
        div.innerHTML = msg.reduce((s, d, i) => {
            s = s + (i ? "<br />" : "") + String(d);
            return s;
        }, "");
        return div;
    }
}
new Toast();
const _toast = (...msg) => Toast.show("info", ...msg);
_toast.info = (...msg) => Toast.show("info", ...msg);
_toast.success = (...msg) => Toast.show("success", ...msg);
_toast.warning = (...msg) => Toast.show("warning", ...msg);
_toast.error = (...msg) => Toast.show("error", ...msg);
_toast.config = Toast.config;
API.toast = _toast;
API.addSetting({
    key: "toast",
    sort: { key: "common", name: "通用" },
    label: "浮动通知",
    svg: '<svg viewBox="0 0 24 24"><g><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></g></svg>',
    type: "sort",
    float: '开启后脚本将推送右上角浮动通知消息。',
    sub: '<a href="//github.com/CodeSeven/toastr/" target="_blank">toastr</a>',
    list: [
        {
            key: "toastcheck",
            sort: { key: "common", name: "通用" },
            label: "浮动通知开关",
            type: "switch",
            value: true
        }, {
            key: "toasttimeout",
            sort: { key: "common", name: "通用" },
            label: "通知时长：/s",
            type: "input",
            value: "4",
            input: { type: "number", min: 1, max: 30 }
        }, {
            key: "toaststep",
            sort: { key: "common", name: "通用" },
            label: "通知间隔：/ms",
            type: "input",
            value: "250",
            input: { type: "number", min: 50, max: 1000, step: 50 }
        }
    ]
});
