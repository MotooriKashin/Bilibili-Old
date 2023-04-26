import { debug } from "../debug";

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
 * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递`false`，然后自行使用返回值注销。
 * @returns 取消拦截的方法
 */
export function xhrHook(url: string | string[], modifyOpen?: (args: XMLHttpRequestOpenParams) => void, modifyResponse?: (response: XMLHttpRequestResponses) => void, once = true) {
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
                        Reflect.defineProperty(this, "response", { configurable: true, value: response.response });
                        try {
                            if (response.responseXML) {
                                response.responseXML && Reflect.defineProperty(this, "responseXML", { configurable: true, value: response.responseXML });
                            } else if (response.response) {
                                response.responseText = typeof response.response === 'object' ? JSON.stringify(response.response) : response.response;
                                Reflect.defineProperty(this, "responseText", { configurable: true, value: response.responseText });
                            }
                        } catch { }
                    }
                } catch (e) { debug.error("modifyResponse of xhrhook", one, e) }
            })
        } catch (e) { debug.error("modifyResponse of xhrhook", one, e) }
    }
    const iid = rules.push([one, two]);
    return () => { removeXhrhook(iid) };
}
/**
 * `xhrhook`的异步版本，可以用异步方法获取到的返回值替换xhr请求返回值。  
 * 本方法或阻断原xhr请求，您可以在`condition`根据url等信息进一步判定是否真的需要拦截。  
 * 注意部分xhr请求可能有额外的超时判定，所以`modifyResponse`修改未必会生效。
 * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
 * @param condition 二次判定**同步**回调函数，不提供或者返回真值时开始拦截，可以通过url等精确判定是否真要拦截。
 * @param modifyResponse 提供XMLHttpRequest返回值的回调函数，第一个参数为数组，包含原xhr的open方法传递的所有参数，其中索引2位置上就是原url。请以XMLHttpRequestResponses格式提供返回值，您可以指定responseType返回值类型，如果处理出错，可将默认值以异常或`Promise.reject`形式抛出。
 * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递`false`，然后自行使用返回值注销。
 * @returns 取消拦截的方法
 */
xhrHook.async = (url: string | string[], condition?: (args: XMLHttpRequestOpenParams) => boolean, modifyResponse?: (args: XMLHttpRequestOpenParams) => Promise<Omit<XMLHttpRequestResponses, "status" | "statusText">>, once = true) => {
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
                Reflect.defineProperty(this, "status", { configurable: true, value: 200 });
                Reflect.defineProperty(this, "readyState", { configurable: true, value: 2 });
                this.dispatchEvent(new ProgressEvent("readystatechange"));
                modifyResponse ? modifyResponse(args).then(d => {
                    clearInterval(et);
                    if (d) {
                        Reflect.defineProperty(this, "response", { configurable: true, value: d.response });
                        d.responseType && setResponseType(d.responseType, this);
                        d.responseText && Reflect.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
                        d.responseXML && Reflect.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
                        !this.responseURL && Reflect.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
                        Reflect.defineProperty(this, "readyState", { configurable: true, value: 4 });
                        this.dispatchEvent(new ProgressEvent("readystatechange"));
                        this.dispatchEvent(new ProgressEvent("load"));
                        this.dispatchEvent(new ProgressEvent("loadend"));
                    }
                }).catch(d => {
                    if ((<any>this).xhrhookTimes === 1) {
                        if (d && d.response) { // 抛出的返回值有效，作为默认值还给调用处
                            Reflect.defineProperty(this, "response", { configurable: true, value: d.response });
                            d.responseType && setResponseType(d.responseType, this);
                            d.responseText && Reflect.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
                            d.responseXML && Reflect.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
                            !this.responseURL && Reflect.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
                            Reflect.defineProperty(this, "readyState", { configurable: true, value: 4 });
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
                }) : (this.abort(), !once && (id = rules.push(temp)))
                clearInterval(et);
            }
        } catch (e) { debug.error("condition of xhrhook", one, e) }
    }
    const iid = rules.push([one, two]);
    return () => { removeXhrhook(iid) };
}
/**
 * 注销xhrhook以节约开销，只在注册时设置了`once=false`时才需要使用本方法！ 
 * @param id `xhrhook`注册时的返回值，一个id只允许使用一次！
 */
function removeXhrhook(id: number) { id >= 0 && delete rules[id - 1]; }
/**
 * `xhrhook`高级版本，用于另外两种封装的hook方法实现不了的操作，通过modify回调理论上可以实现任何xhrhook操作。
 * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
 * @param modify 实现hook的回调函数，`this`和第一个参数为该XMLHttpRequest实例，第二个参数为传递给实例open方法的参数序列。
 * @returns 取消拦截的方法
 */
xhrHook.ultra = (url: string | string[], modify: (this: XMLHttpRequest, xhr: XMLHttpRequest, args: XMLHttpRequestOpenParams) => void) => {
    const one = Array.isArray(url) ? url : [url];
    const two = function (this: XMLHttpRequest, args: XMLHttpRequestOpenParams) {
        try {
            modify.call(this, this, args);
        } catch (e) { debug.error("xhrhook modify", one, modify, e) }
    }
    const iid = rules.push([one, two]);
    return () => { removeXhrhook(iid) };
}
/**
 * 修改返回值类型
 * @param responseType 
 * @param xhr 
 */
function setResponseType(responseType: XMLHttpRequestResponseType, xhr: XMLHttpRequest) {
    Reflect.defineProperty(xhr, "responseType", { configurable: true, value: responseType });
    xhr.getResponseHeader = (name: string) => {
        if (name === 'content-type') {
            switch (xhr.responseType) {
                case 'arraybuffer':
                case 'blob':
                    return 'application/octet-stream';
                case 'document':
                    return 'text/xml; charset=utf-8';
                case 'json':
                    return 'application/json; charset=utf-8';
                default:
                    return 'text/plain; charset=utf-8';
            }
        }
        return 'text/plain; charset=utf-8';
    }
    xhr.getAllResponseHeaders = () => {
        switch (xhr.responseType) {
            case 'arraybuffer':
            case 'blob':
                return 'content-type: application/octet-stream\r\n';
            case 'document':
                return 'content-type: text/xml; charset=utf-8\r\n';
            case 'json':
                return 'content-type: application/json; charset=utf-8\r\n';
            default:
                return 'content-type: text/plain; charset=utf-8\r\n';
        }
    }
}