import { debug } from "./debug";
import { htmlVnode, Vdom } from "./htmlvnode";

export class VdomTool {
    protected vdom: Vdom[];
    protected script: Vdom[] = [];
    constructor(html: string | Vdom[]) {
        if (typeof html === 'string') {
            this.vdom = htmlVnode(html);
        } else {
            this.vdom = html;
        }
    }
    /** 生成 DocumentFragment（会过滤script标签，请稍后使用`loadScript`方法依次运行所有script） */
    toFragment() {
        const fragment = document.createDocumentFragment();
        this.vdom.forEach(d => {
            fragment.appendChild(this.createElement(d));
        });
        return fragment;
    }
    /** 根据vdom生成真DOM（过滤script标签） */
    protected createElement(element: Vdom) {
        if (element.tagName === "text") {
            return document.createTextNode(<string>element.text)
        }
        if (element.tagName === "svg") {
            return this.createSVG(element);
        }
        const node = document.createElement(element.tagName);
        element.props && Object.entries(element.props).forEach(d => {
            node.setAttribute(d[0], d[1]);
        });
        element.text && node.appendChild(document.createTextNode(<string>element.text));
        element.event && Object.entries(element.event).forEach(d => {
            node.addEventListener(...d);
        });
        if (element.tagName === 'script') {
            // 保障脚本依次执行
            (<HTMLScriptElement>node).async = false;
        }
        element.children && element.children.forEach(d => {
            node.appendChild(this.createElement(d));
        });
        return node;
    }
    /** svg限定生成方法 */
    protected createSVG(element: Vdom) {
        const node = document.createElementNS("http://www.w3.org/2000/svg", element.tagName);
        element.props && Object.entries(element.props).forEach(d => {
            node.setAttribute(d[0], d[1]);
        });
        element.children && element.children.forEach(d => {
            node.appendChild(this.createSVG(d));
        });
        return node;
    }
    async loadScript() {
        const scripts = this.script.map(d => {
            const script = <HTMLScriptElement>this.createElement(d);
            script.async = false; // 保证所有脚本有序执行
            return script
        });
        document.body.append(...scripts);
    }
    /** 添加为目标节点的子节点 */
    appendTo(node: HTMLElement | ShadowRoot) {
        node.append(this.toFragment());
    }
    /** 替换目标节点 */
    replace(node: HTMLElement) {
        node.replaceWith(this.toFragment());
    }
    /**
     * 添加事件监听（转化为DocumentFragment之前限定，否则请使用DOM接口操作）
     * @param target 目标节点序号序列
     * @param type 事件类型
     * @param listener 事件回调
     * @example 
     * this.addEventListener('320','click',e=>{}) // 监听第4个节点的第3个子节点的第1个子节点的点击事件
     */
    addEventListener<K extends keyof DocumentEventMap>(target: string, type: string, listener: EventListenerOrEventListenerObject): void
    addEventListener<K extends keyof DocumentEventMap>(target: string, type: K, listener: (this: Document, ev: DocumentEventMap[K]) => void) {
        try {
            const arr = target.split('');
            let dom: Vdom[] = this.vdom;
            let ele!: Vdom;
            while (dom && arr.length) {
                const i = Number(arr.shift());
                if (i) {
                    ele = dom[i];
                    dom = ele.children!
                }
            }
            ele.event || (ele.event = {})
            ele.event[type] = <any>listener;
        } catch (e) { debug.error(e) }
    }
    /**
     * 移除事件监听（转化为DocumentFragment之前限定，否则请使用DOM接口操作）
     * @param target 目标节点序号序列
     * @param type 事件类型
     * @example
     * this.removeEventListener('320','click') // 移除对第4个节点的第3个子节点的第1个子节点的点击事件的监听
     */
    removeEventListener<K extends keyof DocumentEventMap>(target: string, type: string): void
    removeEventListener<K extends keyof DocumentEventMap>(target: string, type: K) {
        try {
            const arr = target.split('');
            let dom: Vdom[] = this.vdom;
            let ele!: Vdom;
            while (dom && arr.length) {
                const i = Number(arr.shift());
                if (i) {
                    ele = dom[i];
                    dom = ele.children!
                }
            }
            delete ele.event?.[type]
        } catch (e) { debug.error(e) }
    }
}