interface modules {
    /** toastr */
    readonly "toast.html": string;
}
interface config {
    /** toastr设置 */
    toast: {
        /** 是否启用 */
        status: boolean;
        /** 镜像 */
        rtl: boolean;
        /** 位置 */
        position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
        /** 时长：0表示永久 */
        delay: number;
        /** 类型 测试限定 */
        type: "success" | "error" | "info" | "warning";
        /** 文本 测试限定 */
        test: string;
    }
}
namespace API {
    /** toast节点 */
    interface ToastElement extends HTMLDivElement {
        /** 类型 */
        type: "success" | "error" | "info" | "warning" | "";
        /** 消息 */
        data: any[];
        /** 延时 */
        delay: number;
    }
    class ToastContainer extends HTMLElement {
        /** 位置列表 */
        readonly positionList = ["top-right", "top-left", "bottom-right", "bottom-left"];
        /** 类型列表 */
        readonly typeList = ["success", "error", "info", "warning", ""];
        /** 跟节点 */
        container: HTMLDivElement;
        status = true;
        rtl = false;
        position: "top-right" | "top-left" | "bottom-right" | "bottom-left" = "top-right";
        delay = 4;
        constructor() {
            super();
            const root = this.attachShadow({ mode: "closed" });
            root.appendChild(createElements(htmlVnode(getModule("toast.html"))));
            this.container = <HTMLDivElement>root.children[0];
            // 数据绑定
            Object.defineProperties(this, {
                status: {
                    get: () => config.toast.status,
                    set: v => {
                        if (v === config.toast.status) return;
                        config.toast.status = v;
                    }
                },
                rtl: {
                    get: () => config.toast.rtl,
                    set: v => {
                        if (v === config.toast.rtl) return;
                        config.toast.rtl = v;
                        v
                            ? (<NodeListOf<HTMLDivElement>>this.container.childNodes).forEach(d => { d.classList.add("rtl") })
                            : (<NodeListOf<HTMLDivElement>>this.container.childNodes).forEach(d => { d.classList.remove("rtl") });
                    }
                },
                position: {
                    get: () => config.toast.position,
                    set: v => {
                        if (v === config.toast.position) return;
                        if (!this.positionList.includes(v)) return;
                        config.toast.position = v;
                        this.container.className = `toast-${v}`;
                    }
                },
                delay: {
                    get: () => config.toast.delay,
                    set: v => {
                        if (v === config.toast.delay) return;
                        config.toast.delay = v;
                    }
                }
            });
            document.body.appendChild(this);
        }
        /** 追加toast */
        toast(delay: number, type: ToastElement["type"], ...data: any[]) {
            if (!this.status) return;
            this.container.className = `toast-${this.position}`;
            // html模板
            let html = `<div class="toast${type ? " toast-" + type : ""}${this.rtl ? " rtl" : ""}" aria-live="assertive" style="padding-top: 0px;padding-bottom: 0px;height: 0px;"><div class="toast-message">`;
            !delay && (html += `<div class="toast-close-button">${getModule("fork.svg")}</div>`);
            data.forEach((d, i) => {
                if (isObject(d)) {
                    try {
                        d = JSON.stringify(d, undefined, '<br>');
                    } catch (e) { }
                }
                html += i ? `<br>${d}` : `<label>${d}</label>`;
            });
            html += '</div></div>';
            const node = createElements(htmlVnode(html));
            const toast = <ToastElement>node.children[0];
            this.container.insertBefore(node, this.container.firstChild);
            // 打开特效
            toast.setAttribute("style", `height: ${toast.scrollHeight + 30}px;`);
            let hovering = false;
            toast.addEventListener("mouseover", () => hovering = true);
            toast.addEventListener("mouseout", () => hovering = false);
            // 数据绑定 节点移除前可动态调整
            Object.defineProperties(toast, {
                /** toast类型 */
                "type": {
                    get: () => type,
                    set: v => {
                        if (v === type) return;
                        if (!this.typeList.includes(v)) return;
                        type && toast.classList.remove(`toast-${type}`);
                        v && toast.classList.add(`toast-${v}`);
                        toast.classList
                        type = v;
                    }
                },
                /** 消息队列 */
                "data": {
                    get: () => new Proxy(data, new ProxyHandler(ToastContainer.organizeDate.bind(ToastContainer, toast))),
                    set: v => {
                        if (v === data) return;
                        data = v;
                        ToastContainer.organizeDate(toast);
                    }
                },
                /** 显示剩余时长 */
                "delay": {
                    get: () => delay,
                    set: v => {
                        if (v === delay) return;
                        if (isNaN(v)) return;
                        if (delay === 0) delay = v, ToastContainer.countDown(toast);
                        delay = v;
                        if (v === 0) {
                            hovering ? toast.addEventListener("mouseout", () => ToastContainer.remove(toast)) : ToastContainer.remove(toast);
                        }
                    }
                }
            });
            !delay
                ? (<HTMLElement>toast.children[0].children[0]).addEventListener("click", () => ToastContainer.remove(toast))
                : ToastContainer.countDown(toast);
            return toast;

        }
        /** 倒计时 */
        static countDown(node: ToastElement) {
            node.delay && setTimeout(() => {
                node.delay--;
                this.countDown(node);
            }, 1e3);
        }
        /** 移除消息 */
        static remove(node: ToastElement) {
            // 收起特效
            node.setAttribute("style", "padding-top: 0px;padding-bottom: 0px;height: 0px;");
            setTimeout(() => node.remove(), 1000);
        }
        /** 刷新消息 */
        static organizeDate(node: ToastElement) {
            let html = !node.delay ? `<div class="toast-close-button">${getModule("fork.svg")}</div>` : "";
            node.data.forEach((d, i) => {
                if (isObject(d)) {
                    try {
                        d = JSON.stringify(d, undefined, '<br>');
                    } catch (e) { }
                }
                html += i ? `<br>${d}` : `<label>${d}</label>`;
            });
            node.children[0].replaceChildren(createElements(htmlVnode(html)));
            node.setAttribute("style", `height: ${(<HTMLDivElement>node.firstChild).clientHeight + 30}px;`);
            !node.delay && (<HTMLElement>node.children[0].children[0]).addEventListener("click", () => ToastContainer.remove(node));
        }
    }
    customElements.define("toast-container", ToastContainer);
    const node = new ToastContainer();
    function Toast(type: ToastElement["type"], ...data: any[]) {
        document.body.contains(node) || document.body.appendChild(node);
        return node.toast(node.delay, type, ...data);
    }
    /**
     * toastr
     * @see toast {@link https://github.com/CodeSeven/toastr}
     * @param data 消息队列，一个参数一行，支持使用<a>等行内元素进一步格式化
     * @returns 消息节点，用于改变显示内容
     */
    export function toast(...data: any[]) {
        return Toast.bind(node, "")(...data);
    }
    toast.success = Toast.bind(node, "success");
    toast.error = Toast.bind(node, "error");
    toast.info = Toast.bind(node, "info");
    toast.warning = Toast.bind(node, "warning");
    /**
     * 自定义toast
     * @param delay 显示时长，0 表示不主动移除并添加一个关闭按钮
     * @param type 通知类型
     * @param data 消息队列，一个表示一行，支持部分HTML行内元素
     * @returns 当前toast节点(div)本身，可用于修改/移除等操作
     */
    toast.custom = node.toast.bind(node);
}