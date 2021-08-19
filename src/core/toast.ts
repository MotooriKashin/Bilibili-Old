/**
 * 本模块负责浮动通知模块，使用原生JavaScript重新实现的`toastr`  
 * 感谢开源项目`toastr`，源项目信息如下
 * @see toastr {@link https//github.com/CodeSeven/toastr/}
 * @license BSD-3-Clause
 */
(function () {
    // 注册toast相关设置项
    API.addSetting({
        key: "toast",
        sort: "common",
        label: "浮动通知",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></g></svg>',
        type: "sort",
        float: '开启后脚本将推送右上角浮动通知消息。',
        sub: '<a href="//github.com/CodeSeven/toastr/" target="_blank">toastr</a>',
        list: [
            {
                key: "toastcheck",
                sort: "common",
                label: "浮动通知开关",
                type: "switch",
                value: true
            }, {
                key: "toasttimeout",
                sort: "common",
                label: "通知时长：/s",
                type: "input",
                value: "4",
                input: { type: "number", min: 1, max: 30 }
            }, {
                key: "toaststep",
                sort: "common",
                label: "通知间隔：/ms",
                type: "input",
                value: "250",
                input: { type: "number", min: 50, max: 1000, step: 50 }
            }
        ]
    })

    class Toast {
        /**
         * 配置数据
         */
        static config: { switch: number, timeout: number, step: number };
        /**
         * 通知节点，初始化专用
         */
        static container: HTMLElement;
        /**
         * 通知样式
         */
        static style: HTMLElement;
        /**
         * 判定`body`是否存在
         */
        static check: boolean;
        /**
         * 通知节点，呈现时
         */
        static box: HTMLElement;
        /**
         * 未呈现通知计数
         */
        static count: number = 0;
        /**
         * 动画呈现帧数
         */
        static sence: number = 60;
        static init() {
            this.container = document.createElement("div");
            this.style = document.createElement("link");
            this.container.setAttribute("id", "toast-container");
            this.container.setAttribute("class", "toast-top-right");
            this.style.setAttribute("rel", "stylesheet");
            this.style.setAttribute("id", "toastr-style");
            this.style.setAttribute("href", "https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css")
        }
        static show(type: "info" | "success" | "warning" | "error", ...msg: string[]) {
            if (!config.toastcheck) return;
            if (!document.body) {
                if (this.check) return;
                return setTimeout(() => { this.check = true; this.show(type, ...msg) });
            }
            document.querySelector("#toastr-style") || document.head.appendChild(this.style);
            document.querySelector("#toast-container") || document.body.appendChild(this.container);
            this.box = document.querySelector("#toast-container") || this.container;
            let item = document.createElement("div");
            item.setAttribute("class", "toast toast-" + type);
            item.setAttribute("aria-live", "assertive");
            item.setAttribute("style", "visibility: hidden;position: absolute");
            setTimeout(() => {
                if (this.count > 0) this.count--;
                item = this.box.insertBefore(item, this.box.firstChild);
                item.appendChild(this.msg(...msg));
                this.come(item);
                setTimeout(() => this.quit(item), (Number(config.toasttimeout) || 4) * 1000);
            }, this.count * (Number(config.toaststep) || 250));
            this.count++;
        }
        static come(item: HTMLDivElement, i: number = 0) {
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
        static quit(item: HTMLDivElement, i: number = this.sence) {
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
        static msg(...msg: string[]) {
            let div = document.createElement("div");
            div.setAttribute("class", "toast-message");
            div.innerHTML = msg.reduce((s: string, d, i) => {
                s = s + (i ? "<br />" : "") + String(d);
                return s;
            }, "");
            return div;
        }
    }
    Toast.init();
    const toast = (...msg: string[]) => Toast.show("info", ...msg);
    toast.info = (...msg: string[]) => Toast.show("info", ...msg);
    toast.success = (...msg: string[]) => Toast.show("success", ...msg);
    toast.warning = (...msg: string[]) => Toast.show("warning", ...msg);
    toast.error = (...msg: string[]) => Toast.show("error", ...msg);
    API.toast = toast;
})();
declare namespace API {
    /**
     * 蓝标通知
     * @param msg 通知内容
     */
    let toast: {
        (...msg: string[]): number | undefined;
        /**
         * 蓝标通知
         * @param msg 通知内容
         */
        info(...msg: string[]): number | undefined;
        /**
         * 绿标通知
         * @param msg 通知内容
         */
        success(...msg: string[]): number | undefined;
        /**
         * 黄标通知
         * @param msg 通知内容
         */
        warning(...msg: string[]): number | undefined;
        /**
         * 红标通知
         * @param msg 通知内容
         */
        error(...msg: string[]): number | undefined;
    }
}
declare namespace config {
    /**
     * 通用：浮动通知
     */
    let toastcheck: boolean;
    /**
     * 通用：通知时长：/s
     */
    let toasttimeout: number;
    /**
     * 通用：通知间隔：/ms
     */
    let toaststep: number;
}