import { createElement } from "./createElement.js";
import { htmlVnode, Vdom } from "./htmlVnode.js";

/**
     * 创建script元素组
     * @param elements 虚拟script组
     * @returns script元素组
     */
function createScripts(elements: Vdom[]) {
    return elements.reduce((s, d) => {
        s.push(<HTMLScriptElement>createElement(d))
        return s;
    }, <HTMLScriptElement[]>[])
}
/**
 * 依次创建脚本
 * @param scripts 脚本组
 */
function loopScript(scripts: HTMLScriptElement[]) {
    return new Promise((r, j) => {
        const prev = scripts.shift();
        if (prev) {
            if (prev.src) {
                prev.addEventListener("load", () => r(loopScript(scripts)));
                prev.addEventListener("abort", () => r(loopScript(scripts)));
                prev.addEventListener("error", () => r(loopScript(scripts)));
                return document.body.appendChild(prev);
            }
            document.body.appendChild(prev);
            r(loopScript(scripts));
        } else r(undefined);
    });
}
/**
 * 添加脚本到DOM
 * @param elements script元素字符串（序列）
 */
export function appendScripts(elements: string) {
    return loopScript(createScripts(htmlVnode(elements)));
}