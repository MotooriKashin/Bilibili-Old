/**
 * 本模块负责提供`XMLHttpRequest`的hook工具  
 * 拦截`open`参数组并传入`XMLHttpRequest`对象本身给回调函数
 */
(function () {
    const rules: [string[], Function][] = [];
    const open = XMLHttpRequest.prototype.open;
    API.xhrhook = (url: string[], callback: (this: XMLHttpRequest, args: [method: string, url: string, async: boolean, username?: string | null, password?: string | null]) => void) => rules.push([url, callback]);
    API.removeXhrhook = (id: number) => rules.splice(id - 1, 1);
    (<any>XMLHttpRequest.prototype.open) = function (this: XMLHttpRequest, ...rest: [method: string, url: string, async: boolean, username?: string | null, password?: string | null]) {
        let args: [method: string, url: string, async: boolean, username?: string | null, password?: string | null] = [...rest];
        args[1] && rules.forEach(d => {
            d[0].every(d => args[1].includes(d)) && d[1].call(this, args);
        })
        return open.call(this, ...args);
    }
})();
declare namespace API {
    /**
     * 注册xhrhook以拦截URL及返回值  
     * 一次性拦截可以考虑拦截后使用`removeXhrhook`方法注销当前该hook以节约开销！
     * @param url 需要hook的URL符合的条件，URL包含的字符串构成的数组，必须都满足才会回调
     * @param callback hook到指定URL后执行的回调函数，`this`为hook到的XMLHttpRequest对象本身，参数为open参数组成的数组
     * @returns 注册编号，用于使用`removeXhrhook`方法注销当前hook
     */
    function xhrhook(url: string[], callback: (this: XMLHttpRequest, args: [method: string, url: string, async: boolean, username?: string | null, password?: string | null]) => void): number;
    /**
     * 注销xhrhook
     * @param id `xhrhook`注册时的返回值
     */
    function removeXhrhook(id: number): [string[], Function][]
}