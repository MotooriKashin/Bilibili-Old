(function () {
    API.registerSetting({
        type: "sort",
        key: "toast",
        label: "浮动通知",
        sub: '<a href="https://github.com/CodeSeven/toastr">toastr</a>',
        svg: '<svg viewBox="0 0 16 16"><path d="M8 16a2 2 0 001.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 008 16z"></path><path fill-rule="evenodd" d="M8 1.5A3.5 3.5 0 004.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01l.001.006c0 .002.002.004.004.006a.017.017 0 00.006.004l.007.001h10.964l.007-.001a.016.016 0 00.006-.004.016.016 0 00.004-.006l.001-.007a.017.017 0 00-.003-.01l-1.703-2.554a1.75 1.75 0 01-.294-.97V5A3.5 3.5 0 008 1.5zM3 5a5 5 0 0110 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0113.482 13H2.518a1.518 1.518 0 01-1.263-2.36l1.703-2.554A.25.25 0 003 7.947V5z"></path></svg>',
        sort: "common",
        list: [{
            type: "switch",
            key: "toastcheck",
            label: "通知开关",
            sort: "common",
            value: true,
        }, {
            type: "input",
            key: "toasttimeout",
            label: "通知时长：/s",
            sort: "common",
            value: "4",
            input: { type: "number", min: 1, max: 30 },
            pattern: /^\d+$/
        }, {
            type: "input",
            key: "toaststep",
            label: "通知延时：/ms",
            sort: "common",
            value: "250",
            input: { type: "number", min: 100, max: 1000 },
            pattern: /^\d+$/
        }]
    })
    class Toast {
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
    // @ts-ignore
    API.toast = (...msg: string[]) => { debug.debug(...msg); Toast.show("info", ...msg) };
    Reflect.set(Reflect.get(API, "toast"), "info", (...msg: string[]) => { debug.debug(...msg); Toast.show("info", ...msg) });
    Reflect.set(Reflect.get(API, "toast"), "success", (...msg: string[]) => { debug.log(...msg); Toast.show("success", ...msg) });
    Reflect.set(Reflect.get(API, "toast"), "warning", (...msg: string[]) => { debug.warn(...msg); Toast.show("warning", ...msg) });
    Reflect.set(Reflect.get(API, "toast"), "error", (...msg: string[]) => { debug.error(...msg); Toast.show("error", ...msg) });
})();
declare const toast: {
    (...msg: string[]): void;
    info(...msg: string[]): void;
    success(...msg: string[]): void;
    warning(...msg: string[]): void;
    error(...msg: string[]): void;
}
declare namespace config {
    /**
     * 通用：toastr开关
     */
    let toastcheck: boolean;
    /**
     * 通用：toastr延时
     */
    let toasttimeout: number;
    /**
     * 通用：toastr间隔
     */
    let toaststep: number;
}