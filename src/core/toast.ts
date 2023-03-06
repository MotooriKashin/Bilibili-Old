import html from "../html/toast.html";
import { CustomElementsInterface } from "../utils/customelement";
import { debug } from "../utils/debug";
import { propertryChangeHook } from "../utils/hook/method";
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
type Position = 'top-left' | 'top-center' | 'top-right' | 'top-full-width' | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'bottom-full-width';

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
        this.fadeOut();

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
    /** 更新内容 */
    protected value(v: any[]) {
        isArray(v) || (v = [v]);
        let html = '';
        v.forEach((d, i) => {
            d = toString(d);
            html += i ? `<br>${d}` : `<label>${d}</label>`;
        });
        // 无内容时隐藏
        v.length || this.fadeOut();
        const close = this.message.contains(this.closeButton);
        this.message.innerHTML = html;
        close && (this.delay = 0);
        v.length && this.fadeIn();
    }
    /** 代理对象暂存 */
    protected _data: any[] = [];
    get data() {
        return this._data;
    }
    /** 内容 */
    set data(v: any[]) {
        this.value(v);
        this._data = propertryChangeHook(v, () => this.value(v));
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
                this.fadeOut(true);
            }
        } else if (v !== 0) {
            this.timer = setTimeout(() => {
                this.timeout = true;
                this.delay = 1;
            }, v * 1e3);
        }
    }
    /** 添加消息 */
    push(...items: any[]) {
        return this.data.push(...items);
    }
    /** 弹出第一条消息 */
    shift() {
        return this.data.shift();
    }
    /** 添加置顶消息 */
    unshift(...items: any[]) {
        return this.data.unshift(...items);
    }
    /** 弹出末尾的消息 */
    pop(): void {
        return this.data.pop();
    }
    /** 淡入 */
    fadeIn() {
        this.style.paddingTop = '';
        this.style.paddingBottom = '';
        this.style.height = `${this.message.scrollHeight + 30}px`;
    }
    /** 淡出 */
    fadeOut(remove = false) {
        this.style.paddingTop = '0px';
        this.style.paddingBottom = '0px';
        this.style.height = '0px';
        remove && setTimeout(() => this.remove(), 1e3);
    }
}
customElements.get(`toast-${_MUTEX_}`) || customElements.define(`toast-${_MUTEX_}`, Toast, { extends: 'div' });

/** toast组件 */
class ToastContainer extends HTMLElement implements CustomElementsInterface {
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
    /**
     * 可拓展toast，用于需要动态增减消息。  
     * 无数据时隐藏，有数据时显现。默认为info类型。
     * @param data 初始信息，可为空。
     * @example
     * const T = toast.list(); // 生成toast(隐藏)。
     * T.data.push(123); // 添加一条消息123，toast显现。data属性本质是数组，可以使用任何数组方法更改消息。
     * T.type = 'warning'; // 更改toast样式为warning。
     * T.rtl = true; // 镜像toast。
     * T.data.pop(); // 删除最后一条消息，消息变为空，toast自动隐藏。
     * T.delay = 4; // 启用倒计时，单位/秒，倒计时结束后toast将被移除。也就是对象`T`不再响应任何操作，所以除非不需要再拓展，否则请不要修改`delay`属性。
     * T.fadeOut(); // 隐藏toast但不移除。
     * T.fadeOut(true); // 移除toast，效果同T.delay = 1。
     */
    list(...data: any[]) {
        return this.toast(0, 'info', ...data);
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

/**
 * 浮动通知  
 * 获取到用户配置后请通过`update`方法更新，否则将使用默认配置。
 */
export const toast = new ToastContainer();