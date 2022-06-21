import { Vdom } from "./htmlVnode.js";

function createSVG(element: Vdom) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", element.tagName);
    element.props && Object.entries(element.props).forEach(d => {
        node.setAttribute(d[0], d[1]);
    });
    element.children && element.children.forEach(d => {
        node.appendChild(createSVG(d));
    });
    return node;
}
/**
 * 创建一个节点
 * @param element 节点数据
 * @returns 节点
 */
export function createElement(element: Vdom) {
    if (element.tagName === "text") {
        return document.createTextNode(<string>element.text)
    }
    if (element.tagName === "svg") {
        return createSVG(element);
    }
    const node = document.createElement(element.tagName);
    element.props && Object.entries(element.props).forEach(d => {
        node.setAttribute(d[0], d[1]);
    });
    element.text && node.appendChild(document.createTextNode(<string>element.text));
    element.event && Object.entries(element.event).forEach(d => {
        node.addEventListener(...d);
    });
    element.children && element.children.forEach(d => {
        node.appendChild(createElement(d));
    });
    return node;
}
/**
 * 创建一组同级节点
 * @param elements 节点列表
 * @returns 节点片段
 */
export function createElements(elements: Vdom[]) {
    const fragment = document.createDocumentFragment();
    elements.forEach(d => {
        fragment.appendChild(createElement(d));
    });
    return fragment;
}