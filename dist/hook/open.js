/**
 * 本模块负责提供`XMLHttpRequest`的hook工具
 * 拦截`open`参数组并传入`XMLHttpRequest`对象本身给回调函数
 */
try {
    const rules = [];
    const open = XMLHttpRequest.prototype.open;
    API.xhrhook = (url, callback) => rules.push([url, callback]);
    API.removeXhrhook = (id) => rules.splice(id - 1, 1);
    XMLHttpRequest.prototype.open = function (...rest) {
        let args = [...rest];
        args[1] && rules.forEach(d => {
            d[0].every(d => args[1].includes(d)) && d[1].call(this, args);
        });
        return open.call(this, ...args);
    };
}
catch (e) {
    API.trace(e, "open.js", true);
}
