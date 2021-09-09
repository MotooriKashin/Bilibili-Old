/**
 * 本模块负责提供jQuery库中jsonp的hook工具
 * 通过调用jQuery的ajaxSetup方法实现此功能
 * 包含URL在内的对象将以this的方式传递，jsonp本身则作为参数传递
 */
(function () {
    const jsonp: [string[], Function][] = [];
    API.jsonphook = (url: string[], callback: (this: any, xhr: any) => void) => jsonp.push([url, callback]);
    API.removeJsonphook = (id: number) => jsonp.splice(id - 1, 1);
    API.runWhile(() => (<any>window).$ && (<any>window).$.ajax, () => {
        const $: any = (<any>window).$;
        Object.defineProperty(window, "$", {
            set: (v) => { v },
            get: () => $
        });
        $.ajaxSetup({
            beforeSend: function (this: any, xhr: any) {
                this.url && jsonp.forEach(d => {
                    d[0].every(d => this.url.includes(d)) && d[1].call(this, xhr);
                })
            }
        })
    })
})();
declare namespace API {
    /**
     * 注册jsonphook  
     * jsonp对象结构比较杂乱，this和传参的具体细节需要自行摸索
     * @param url 需要hook的URL符合的条件，URL包含的字符串构成的数组，必须都满足才会回调
     * @param callback hook到指定URL后执行的回调函数，信息传递给了this和第一个传参
     * @returns 注册编号，用于使用`removeJsonphook`方法注销当前hook
     */
    function jsonphook(url: string[], callback: (this: any, xhr: any) => void): number;
    /**
     * 注销jsonphook
     * @param id 注册`jsonphook`时的返回值
     */
    function removeJsonphook(id: number): [string[], Function][];
}