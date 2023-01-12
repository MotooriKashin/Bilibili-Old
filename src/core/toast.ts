import html from "../html/toast.html";
import { CustomElementsInterface } from "../utils/customelement";
import { debug } from "../utils/debug";
import { svg } from "../utils/svg";
import { toObject, toString } from "../utils/type";
import { isArray } from "../utils/typeof";

/** toast配置 */
export const Toastconfig = {
    position: 'top-right',
    rtl: false,
    delay: 4,
    disabled: false
};
type ObservedAttributesContainer = 'position' | 'rtl' | 'delay' | 'disabled';
type ToastType = "success" | "error" | "info" | "warning" | "";
type Position = 'top-left' | 'top-center' | 'top-right' | 'top-full-width' | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'bottom-full-width'
/** toastr */
export class Toast extends HTMLDivElement implements CustomElementsInterface {
    /** 关闭按钮 */
    protected closeButton = document.createElement('div');
    /** 消息节点 */
    protected message = document.createElement('div');
    /** 延时 */
    protected timer?: number;
    /** 鼠标移入 */
    protected hovering = false;
    /** 延时结束 */
    protected timeout = false;
    constructor() {
        super();
        this.classList.add('toast');
        this.setAttribute('aria-live', 'assertive');
        this.setAttribute('style', 'padding-top: 0px;padding-bottom: 0px;height: 0px;');

        this.appendChild(this.message);
        this.message.className = 'toast-message';
        this.closeButton.className = 'toast-close-button';
        this.closeButton.innerHTML = svg.fork;
        this.closeButton.addEventListener('click', e => {
            this.timeout = true;
            this.delay = 1;
            e.stopPropagation();
        });
        this.addEventListener('mouseover', () => this.hovering = true);
        this.addEventListener("mouseout", () => {
            this.hovering = false;
            this.timeout && (this.delay = 1);
        });
    }
    /** 内容 */
    set data(v: any[]) {
        isArray(v) || (v = [v]);
        let html = '';
        v.forEach((d, i) => {
            d = toString(d);
            html += i ? `<br>${d}` : `<label>${d}</label>`;
        });
        const close = this.message.contains(this.closeButton);
        this.message.innerHTML = html;
        close && (this.delay = 0);
        this.setAttribute("style", `height: ${this.message.scrollHeight + 30}px;`);
    }
    /** 类型 */
    set type(v: ToastType) {
        this.classList.remove('toast-success', 'toast-error', 'toast-info', 'toast-warning');
        v && this.classList.add(`toast-${v}`);
    }
    /** 镜像 */
    set rtl(v: boolean) {
        v ? this.classList.add('rtl') : this.classList.remove('rtl');
    }
    /** 时长 */
    set delay(v: number) {
        clearTimeout(this.timer);
        v = Math.max(Math.trunc(v), 0);
        v
            ? (this.message.contains(this.closeButton) && this.closeButton.remove())
            : (this.message.contains(this.closeButton) || this.message.insertBefore(this.closeButton, this.message.firstChild));
        if (v === 1) {
            if (!this.hovering) {
                this.setAttribute("style", "padding-top: 0px;padding-bottom: 0px;height: 0px;");
                setTimeout(() => this.remove(), 1e3);
            }
        } else if (v !== 0) {
            this.timer = setTimeout(() => {
                this.timeout = true;
                this.delay = 1;
            }, v * 1e3);
        }
    }
}
customElements.get(`toast-${_MUTEX_}`) || customElements.define(`toast-${_MUTEX_}`, Toast, { extends: 'div' });
/** toast组件 */
export class ToastContainer extends HTMLElement implements CustomElementsInterface {
    /** 实际根节点 */
    protected container: HTMLDivElement;
    static get observedAttributes(): ObservedAttributesContainer[] {
        return [
            'position',
            'rtl',
            'delay',
            'disabled'
        ];
    }
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this.container = <HTMLDivElement>root.children[0];
    }
    /** 刷新配置 */
    update(value: typeof Toastconfig) {
        Object.entries(value).forEach(d => { this[<'delay'>d[0]] = <number>d[1] });
    }
    toast(delay: number, type: ToastType = 'info', ...data: any[]) {
        document.body.contains(this) || document.body.appendChild(this);
        const toast = new Toast();
        toast.type = type;
        toast.rtl = this.rtl;
        this.container.insertBefore(toast, this.container.firstChild);
        toast.data = data;
        toast.delay = delay;
        return toast;
    }
    success(...data: any[]) {
        this.toast(this.delay, 'success', ...data);
        return () => { debug(...data) }
    }
    error(...data: any[]) {
        this.toast(this.delay, 'error', ...data);
        return () => { debug.error(...data) }
    }
    info(...data: any[]) {
        this.toast(this.delay, 'info', ...data);
        return () => { debug.debug(...data) }
    }
    warning(...data: any[]) {
        this.toast(this.delay, 'warning', ...data);
        return () => { debug.warn(...data) }
    }
    set position(v: Position) {
        this.setAttribute('position', v);
    }
    /** 位置 */
    get position() {
        return <Position>this.getAttribute('position');
    }
    set rtl(v: boolean) {
        this.setAttribute('rtl', <any>v);
    }
    /** 镜像 */
    get rtl() {
        return toObject(this.getAttribute('rtl')!);
    }
    set delay(v: number) {
        this.setAttribute('delay', <any>v);
    }
    /** 延时 */
    get delay() {
        return toObject(this.getAttribute('delay')!);
    }
    set disabled(v: boolean) {
        this.setAttribute('disabled', <any>v);
    }
    /** 禁用 */
    get disabled() {
        return toObject(this.getAttribute('disabled')!);
    }
    attributeChangedCallback(name: ObservedAttributesContainer, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;
        switch (name) {
            case 'position':
                newValue && (this.container.className = `toast-${newValue}`);
                break;
            case 'rtl':
                this.container.querySelectorAll('.toast').forEach(d => {
                    (<Toast>d).rtl = toObject(newValue);
                });
                break;
            case 'delay':
                this.container.querySelectorAll('.toast').forEach(d => {
                    (<Toast>d).delay = toObject(newValue);
                });
                break;
            case 'disabled':
                this.container.style.display = toObject(newValue) ? 'none' : '';
            default:
                break;
        }
    }
}
customElements.get(`toast-container-${_MUTEX_}`) || customElements.define(`toast-container-${_MUTEX_}`, ToastContainer);