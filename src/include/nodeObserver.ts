namespace API {
    const nodelist: Function[] = [];
    /**
     * 注册节点添加监听  
     * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
     * @param callback 添加节点后执行的回调函数
     * @returns 注册编号，用于使用`removeObserver`销毁监听
     */
    export function observerAddedNodes(callback: (node: HTMLElement) => void) {
        try {
            if (typeof callback === "function") nodelist.push(callback);
            return nodelist.length - 1;
        } catch (e) { debug.error(e) }
    }
    /**
     * 销毁`observerAddedNodes`监听
     * @param id 注册`observerAddedNodes`监听是返回的编号
     */
    export function removeObserver(id: number) {
        nodelist.splice(id, 1);
    }
    const observe = new MutationObserver(d => d.forEach(d => {
        d.addedNodes[0] && nodelist.forEach(async f => {
            try {
                f(d.addedNodes[0])
            } catch (e) { debug.error(d).error(e) }
        })
    }));
    loadAfterClear(() => {
        try { observe.disconnect(); } catch (e) { }
        observe.observe(document, { childList: true, subtree: true });
    });
}