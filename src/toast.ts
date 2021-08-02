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
    constructor() {
        let config = GM.getValue<{ switch: number, timeout: number, step: number }>("toast", { switch: 1, timeout: 4, step: 250 });
        Toast.config = new Proxy(config, {
            set: (_target, p: "timeout" | "step" | "switch", value) => {
                config[p] = value;
                GM.setValue<{ switch: number, timeout: number, step: number }>("toast", config);
                return true;
            },
            get: (_target, p: "timeout" | "step" | "switch") => config[p]
        });
        Toast.init();
    }
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
        if (!this.config.switch) return;
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
            setTimeout(() => this.quit(item), this.config.timeout * 1000);
        }, this.count * this.config.step);
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
new Toast();
const _toast = (...msg: string[]) => Toast.show("info", ...msg);
_toast.info = (...msg: string[]) => Toast.show("info", ...msg);
_toast.success = (...msg: string[]) => Toast.show("success", ...msg);
_toast.warning = (...msg: string[]) => Toast.show("warning", ...msg);
_toast.error = (...msg: string[]) => Toast.show("error", ...msg);
_toast.config = Toast.config;
declare namespace API { let toast: typeof _toast }
API.toast = _toast;