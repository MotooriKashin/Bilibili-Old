namespace API {
    /** URL解构 */
    export let path = location.href.split("/");
    /** 标题记录 */
    export let title: string = "";
    /** 重构模式 */
    export let rebuildType = config.rebuildType;
    /** pgc标记 */
    export let pgc = false;
    /** ssid */
    export let ssid = 0;
    /** epid */
    export let epid = 0;
    /**
     * 重构重定向
     * @param name 判定名
     * @param url url记录
     * @param title title记录
     */
    export function redirect(name: string, url: string = location.href, title: string = document.title) {
        sessionStorage.setItem("vector", `${name} ${url + (title ? (" " + title) : "")}`);
        location.replace(`${location.origin}/favicon.ico`);
    }
    /**
     * 修改当前URL而不出发重定向  
     * **无法跨域操作！**
     * @param url 新URL
     */
    export function replaceUrl(url: string) {
        window.history.replaceState(window.history.state, "", url);
    }
    /** 主动出发页面加载完成事件 */
    export function loadendEvent() {
        document.dispatchEvent(new ProgressEvent("readystatechange"));
        document.dispatchEvent(new ProgressEvent("DOMContentLoaded"));
        window.dispatchEvent(new ProgressEvent("DOMContentLoaded"));
        window.dispatchEvent(new ProgressEvent("load"));
    }
    /**
     * 添加条件回调，条件为真时执行回调函数，用于检测函数运行时机  
     * @param check 一个返回布尔值的函数，用于轮询，当函数返回值为真时执行回调函数
     * @param callback 待执行的回调函数，check的返回值会作为参数传入
     * @param delay 轮询间隔：/ms，默认100ms
     * @param stop 轮询最大延时：/s，多长时间后终止轮询，不做无谓的等待，默认180s，即3分钟。为0时永不终止直到为真。
     */
    export function doWhile<T>(check: () => T, callback: (tar: Exclude<T, null | false | undefined>) => void, delay: number = 100, stop: number = 180) {
        let timer = setInterval(() => {
            const d = check();
            if (d) {
                clearInterval(timer);
                callback(<Exclude<T, null | false | undefined>>d);
            }
        }, delay);
        stop && setTimeout(() => clearInterval(timer), stop * 1000)
    }
    /**
     * 节点到页面顶部的距离
     * @param node 目标节点
     * @returns 距离：/px
     */
    export function getTotalTop(node: HTMLElement) {
        var sum = 0;
        do {
            sum += node.offsetTop;
            node = <HTMLElement>node.offsetParent;
        }
        while (node);
        return sum;
    }
    /**
     * 添加css样式
     * @param txt css文本
     * @param id 样式ID，用于唯一标记
     * @param parrent 添加到的父节点，默认为head
     */
    export async function addCss(txt: string, id?: string, parrent?: Node) {
        if (!parrent && !document.head) {
            await new Promise(r => doWhile(() => document.body, r));
        }
        parrent = parrent || document.head;
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        id && !(<HTMLElement>parrent).querySelector(`#${id}`) && style.setAttribute("id", id);
        style.appendChild(document.createTextNode(txt));
        parrent.appendChild(style);
    }
    /**
     * 加载外源脚本  
     * 支持加载完成后执行回调函数或者返回Promise
     * @param src 外源脚本url
     * @param onload 加载完成后的回调函数
     */
    export function loadScript(src: string, onload?: () => void) {
        return new Promise((r, j) => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", () => {
                script.remove();
                onload && onload();
                r(true);
            });
            script.addEventListener('error', () => {
                script.remove();
                j();
            });
            document.body.appendChild(script);
        });
    }
    /**
     * 从url中提取指定参数
     * @param name 参数名
     * @returns 参数值，不存在返回null
     */
    export function getUrlValue(name: string) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;
    }
    /**
     * 创建HTML节点
     * @param tag 节点名称
     * @param attribute 节点属性对象
     * @param parrent 添加到的父节点，默认为body
     * @param innerHTML 节点的innerHTML
     * @param top 是否在父节点中置顶
     * @param replaced 替换节点而不是添加，被替换的节点，将忽略父节点相关参数
     */
    export function addElement<T extends keyof HTMLElementTagNameMap>(tag: T, attribute?: Record<string, string>, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElementTagNameMap[T] {
        let element = document.createElement(tag);
        attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
        parrent = parrent || document.body;
        innerHTML && (element.innerHTML = innerHTML);
        replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
        return element;
    }
    /** 检查xhr.status是否符合正常 */
    export function statusCheck(status: number) {
        return (status >= 200 && status < 300) || status === 304
    }
}