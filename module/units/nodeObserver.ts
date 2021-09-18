/**
 * 本模块负责DOM节点变动监听
 * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
 */
try {
    const nodelist: Function[] = [];
    /**
     * 注册节点添加监听  
     * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
     * @param callback 添加节点后执行的回调函数
     * @returns 注册编号，用于使用`removeObserver`销毁监听
     */
    function observerAddedNodes(callback: (node: HTMLElement) => void) {
        if (typeof callback === "function") nodelist.push(callback);
        return nodelist.length - 1;
    }
    API.observerAddedNodes = (callback: (node: HTMLElement) => void) => observerAddedNodes(callback);
    /**
     * 销毁`observerAddedNodes`监听
     * @param id 注册`observerAddedNodes`监听是返回的编号
     */
    function removeObserver(id: number) {
        nodelist.splice(id, 1);
    }
    API.removeObserver = (id: number) => removeObserver(id);
    (new MutationObserver(d => d.forEach(d => {
        d.addedNodes[0] && nodelist.forEach(async f => f(d.addedNodes[0]))
    }))).observe(document, { childList: true, subtree: true });
} catch (e) { API.trace(e, "nodeObserver.js", true) }
declare namespace API {
    /**
     * 注册节点添加监听  
     * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
     * @param callback 添加节点后执行的回调函数
     * @returns 注册编号，用于使用`removeObserver`销毁监听
     */
    function observerAddedNodes(callback: (node: HTMLElement) => void): number;
    /**
     * 销毁`observerAddedNodes`监听
     * @param id 注册`observerAddedNodes`监听是返回的编号
     */
    function removeObserver(id: number): void;
}