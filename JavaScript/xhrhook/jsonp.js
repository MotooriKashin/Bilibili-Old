"use strict";
/**
 * 本模块负责提供jQuery库中jsonp的hook工具
 * 通过调用jQuery的ajaxSetup方法实现此功能
 * 包含URL在内的对象将以this的方式传递，jsonp本身则作为参数传递
 */
(function () {
    const jsonp = [];
    API.jsonphook = (url, callback) => jsonp.push([url, callback]);
    API.removeJsonphook = (id) => jsonp.splice(id - 1, 1);
    API.runWhile(() => window.$ && window.$.ajax, () => {
        const $ = window.$;
        Object.defineProperty(window, "$", {
            set: (v) => { v; },
            get: () => $
        });
        $.ajaxSetup({
            beforeSend: function (xhr) {
                this.url && jsonp.forEach(d => {
                    d[0].every(d => this.url.includes(d)) && d[1].call(this, xhr);
                });
            }
        });
    });
})();
