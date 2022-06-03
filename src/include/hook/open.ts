namespace API {
    /** XMLHttpRequest.open 参数 */
    export type XMLHttpRequestOpenParams = [method: string, url: string, async?: boolean, username?: string | null, password?: string | null];
    /** XMLHttpRequest返回值 */
    export type XMLHttpRequestResponses = {
        response: any;
        responseType?: XMLHttpRequestResponseType
        responseText?: string;
        responseXML?: Document;
        status: number;
        statusText: string;
    };
    const rules: [string[], Function][] = [];
    const open: any = XMLHttpRequest.prototype.open;
    (<any>XMLHttpRequest.prototype.open) = function (this: XMLHttpRequest, ...rest: XMLHttpRequestOpenParams) {
        const args: [method: string, url: string, async?: boolean, username?: string | null, password?: string | null] = [...rest];
        args[1] && rules.forEach(d => {
            d && d[0].every(d => args[1].includes(d)) && d[1].call(this, args);
        })
        return open.call(this, ...args);
    }
    /**
     * 注册拦截修改xhr，本方法必须传入同步返回的回调函数，要使用异步回调请考虑左转`xhrhookasync`。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param modifyOpen 修改XMLHttpRequest.open参数的回调函数，第一个参数为数组，包含原xhr的open方法传递的所有参数，其中索引2位置上就是原url。
     * @param modifyResponse 修改XMLHttpRequest返回值的回调函数，第一个参数为一个对象，可能包含response、responseType、responseText、responseXML中的一种或多种原始数据，可以在其基础上进行修改并赋值回去，**注意每种返回值的格式！**
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递`false`，然后自行在不再需要拦截后使用`removeXhrhook`注销。
     * @returns 注册编号，`once=false`时才有用，用于使用`removeXhrhook`取消拦截。
     */
    export function xhrhook(url: string | string[], modifyOpen?: (args: XMLHttpRequestOpenParams) => void, modifyResponse?: (response: XMLHttpRequestResponses) => void, once = true) {
        let id: number;
        const one = Array.isArray(url) ? url : [url];
        const two = function (this: XMLHttpRequest, args: XMLHttpRequestOpenParams) {
            once && id && delete rules[id - 1];
            if (modifyOpen) try { modifyOpen(args) } catch (e) { debug.error("modifyOpen of xhrhook", one, e) }
            if (modifyResponse) try {
                this.addEventListener("readystatechange", () => {
                    try {
                        if (this.readyState === 4) {
                            const response: XMLHttpRequestResponses = { response: this.response, responseType: this.responseType, status: this.status, statusText: this.statusText };
                            (this.responseType === "" || this.responseType === "text") && (response.responseText = <string>this.responseText);
                            (this.responseType === "" || this.responseType === "document") && (response.responseXML = <Document>this.responseXML);
                            modifyResponse(response);
                            Object.defineProperty(this, "response", { configurable: true, value: response.response });
                            response.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: response.responseText });
                            response.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: response.responseXML });
                        }
                    } catch (e) { debug.error("modifyResponse of xhrhook", one, e) }
                })
            } catch (e) { debug.error("modifyResponse of xhrhook", one, e) }
        }
        return id = rules.push([one, two]);
    }
    /**
     * `xhrhook`的异步版本，可以用异步方法获取到的返回值替换xhr请求返回值。  
     * 本方法或阻断原xhr请求，您可以在`condition`根据url等信息进一步判定是否真的需要拦截。  
     * 注意部分xhr请求可能有额外的超时判定，所以`modifyResponse`修改未必会生效。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param condition 二次判定**同步**回调函数，不提供或者返回真值时开始拦截，可以通过url等精确判定是否真要拦截。
     * @param modifyResponse 提供XMLHttpRequest返回值的回调函数，第一个参数为数组，包含原xhr的open方法传递的所有参数，其中索引2位置上就是原url。请以XMLHttpRequestResponses格式提供返回值，第二个参数为responseType类型，你可以据此确定需要哪些返回值，**注意每种返回值的格式！**。如果处理出错，可将默认值以异常或`Promise.reject`形式抛出。
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递`false`，然后自行在不再需要拦截后使用`removeXhrhook`注销。
     * @returns 注册编号，`once=false`时才有用，用于使用`removeXhrhook`取消拦截。
     */
    export function xhrhookAsync(url: string | string[], condition?: (args: XMLHttpRequestOpenParams) => boolean, modifyResponse?: (args: XMLHttpRequestOpenParams, type: XMLHttpRequestResponseType) => Promise<Omit<XMLHttpRequestResponses, "status" | "statusText">>, once = true) {
        let id: number, temp: [string[], Function];
        const one = Array.isArray(url) ? url : [url];
        const two = function (this: XMLHttpRequest, args: XMLHttpRequestOpenParams) {
            try {
                if (!condition || condition(args)) {
                    (<any>this).xhrhookTimes = (<any>this).xhrhookTimes ? (<any>this).xhrhookTimes++ : 1; // 同意实例拦截次数
                    id && (temp = rules[id - 1]); // 临时移除同条件URL的hook，避免代理中使用了同url造成死循环
                    delete rules[id - 1];
                    this.send = () => true; // 禁用XMLHttpRequest.send
                    (!args[2] || args[2] === true) && (this.timeout = 0); // 禁用超时
                    const et = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")); }, 50);
                    Object.defineProperty(this, "status", { configurable: true, value: 200 });
                    Object.defineProperty(this, "readyState", { configurable: true, value: 2 });
                    this.dispatchEvent(new ProgressEvent("readystatechange"));
                    modifyResponse && modifyResponse(args, this.responseType).then(d => {
                        clearInterval(et);
                        if (d) {
                            Object.defineProperty(this, "response", { configurable: true, value: d.response });
                            d.responseType && Object.defineProperty(this, "responseType", { configurable: true, value: d.responseType });
                            d.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
                            d.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
                            !this.responseURL && Object.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
                            Object.defineProperty(this, "readyState", { configurable: true, value: 4 });
                            this.dispatchEvent(new ProgressEvent("readystatechange"));
                            this.dispatchEvent(new ProgressEvent("load"));
                            this.dispatchEvent(new ProgressEvent("loadend"));
                        }
                    }).catch(d => {
                        if ((<any>this).xhrhookTimes === 1) {
                            if (d && d.response) { // 抛出的返回值有效，作为默认值还给调用处
                                Object.defineProperty(this, "response", { configurable: true, value: d.response });
                                d.responseType && Object.defineProperty(this, "responseType", { configurable: true, value: d.responseType });
                                d.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
                                d.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
                                !this.responseURL && Object.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
                                Object.defineProperty(this, "readyState", { configurable: true, value: 4 });
                                this.dispatchEvent(new ProgressEvent("readystatechange"));
                                this.dispatchEvent(new ProgressEvent("load"));
                                this.dispatchEvent(new ProgressEvent("loadend"));
                            } else { // 抛出返回值无效，通知xhr事件
                                this.dispatchEvent(new ProgressEvent("error"));
                            }
                        } else { // xhr被其他hook处理中，此处不做任何处理
                            (<any>this).xhrhookTimes--;
                        }
                        debug.error("modifyResponse of xhrhookasync", one, d);
                    }).finally(() => {
                        clearInterval(et);
                        !once && (id = rules.push(temp)); // 恢复多次监听
                    })
                    clearInterval(et);
                }
            } catch (e) { debug.error("condition of xhrhook", one, e) }
        }
        return id = rules.push([one, two]);
    }
    /**
     * 注销xhrhook以节约开销，只在注册时设置了`once=false`时才需要使用本方法！ 
     * @param id `xhrhook`注册时的返回值，一个id只允许使用一次！
     */
    export function removeXhrhook(id: number) { id >= 0 && delete rules[id - 1]; }
    /**
     * `xhrhook`高级版本，用于另外两种封装的hook方法实现不了的操作，通过modify回调理论上可以实现任何xhrhook操作。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param modify 实现hook的回调函数，`this`和第一个参数为该XMLHttpRequest实例，第二个参数为传递给实例open方法的参数序列。
     * @returns 注册编号，用于使用`removeXhrhook`取消拦截。
     */
    export function xhrhookUltra(url: string | string[], modify: (this: XMLHttpRequest, xhr: XMLHttpRequest, args: XMLHttpRequestOpenParams) => void) {
        const one = Array.isArray(url) ? url : [url];
        const two = function (this: XMLHttpRequest, args: XMLHttpRequestOpenParams) {
            try {
                modify.call(this, this, args);
            } catch (e) { debug.error("xhrhook modify", one, modify, e) }
        }
        return rules.push([one, two]);
    }
}