/**
 * Xhr封装，模块内请使用`xhr`实例
 */
class Xhr {
    static catches: [string, any][] = [];
    static log = () => this.catches;
    /**
     * `XMLHttpRequest`的`Promise`封装
     * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
     * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外，直接返回结果
     */
    static xhr(details: xhrDetails & { async: boolean }) {
        details.method == "POST" && (details.headers = details.headers || {}, !details.headers["Content-Type"] && Reflect.set(details.headers, "Content-Type", "application/x-www-form-urlencoded"));
        if (details.hasOwnProperty("async") && Boolean(details.async) === false) {
            let xhr = new XMLHttpRequest();
            xhr.open(details.method || 'GET', details.url, false);
            details.responseType && (xhr.responseType = details.responseType);
            details.credentials && (xhr.withCredentials = true);
            details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
            details.timeout && (xhr.timeout = details.timeout);
            xhr.send(details.data);
            return xhr.response;
        }
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(details.method || 'GET', details.url);
            details.responseType && (xhr.responseType = details.responseType);
            details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
            details.credentials && (xhr.withCredentials = true);
            details.timeout && (xhr.timeout = details.timeout);
            xhr.onabort = details.onabort || ((ev) => reject(ev));
            xhr.onerror = details.onerror || ((ev) => reject(ev));
            details.onloadstart && (xhr.onloadstart = details.onloadstart);
            details.onprogress && (xhr.onprogress = details.onprogress);
            details.onreadystatechange && (xhr.onreadystatechange = details.onreadystatechange);
            xhr.ontimeout = details.ontimeout || ((ev) => reject(ev));
            xhr.onload = details.onload || (() => resolve(xhr.response));
            xhr.send(details.data);
        })
    }
    /**
     * `GM_xmlhttpRequest`的`Promise`封装，用于跨域`XMLHttpRequest`请求
     * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
     * @returns `Promise`托管的请求结果或者报错信息
     */
    static GM(details: GMxhrDetails): Promise<any> {
        return new Promise((resolve, reject) => {
            details.method = details.method || 'GET';
            details.onload = details.onload || ((xhr) => { this.catches.push([details.url, xhr.response]); resolve(xhr.response) });
            details.onerror = details.onerror || ((xhr) => { this.catches.push([details.url, xhr.response]); reject(xhr.response) });
            GM.xmlHttpRequest(details);
        })
    }
    /**
     * `XMLHttpRequest`的GET方法的快捷模式  
     * 将url独立为第一个参数，剩余参数放在第二个参数，方便快速发送ajax  
     * **注意本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @param details url外的参数对象
     * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外，直接返回结果
     */
    static get(url: string, details: { [P in Exclude<keyof xhrDetails, "url">]?: xhrDetails[P] } = {}) {
        !Reflect.has(details, "credentials") && (details.credentials = true);
        // @ts-ignore
        return this.xhr({ url: url, ...details });
    }
    /**
     * `XMLHttpRequest`的POST方法的快捷模式  
     * 将url、data，Content-Type分别独立为参数，剩余参数放在末尾，方便快速发送ajax  
     * **注意本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @param data post数据
     * @param contentType 发送数据使用的编码，默认"application/x-www-form-urlencoded"
     * @param details url、data外的参数对象
     * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外，直接返回结果
     */
    static post(url: string, data: string, contentType: string = "application/x-www-form-urlencoded", details: { [P in Exclude<keyof xhrDetails, "url" | "data">]?: xhrDetails[P] } = {}) {
        !Reflect.has(details, "credentials") && (details.credentials = true);
        details.headers = { "Content-Type": contentType, ...details.headers };
        // @ts-ignore
        return this.xhr({ url: url, method: "POST", data: data, ...details })
    }
}
const xhr: xhr = new Proxy(<any>Xhr, { apply: (target, thisArg, argArray) => { return target.xhr.apply(target, argArray) } });
/**
* `GM_xmlhttpRequest`的返回值
*/
interface GMxhrResponse {
    /**
     * the final URL after all redirects from where the data was loaded
     */
    finalUrl: string;
    /**
     * the ready state
     */
    readyState: number;
    /**
     * the request status
     */
    status: number;
    /**
     * the request status text
     */
    statusText: string;
    /**
     * the request response headers
     */
    responseHeaders: any;
    /**
     * the response data as object if details.responseType was set: ArrayBuffer | Blob | JSON | string
     */
    response: any;
    /**
     * the response data as XML document
     */
    responseXML: Document;
    /**
     * the response data as plain string
     */
    responseText: string;
}
/**
 * `API.xhr`的传参，用于配置`XMLHttpRequest`
 */
interface xhrDetails {
    /**
     * one of GET, HEAD, POST
     */
    method?: "GET" | "HEAD" | "POST";
    /**
     * the destination URL
     */
    url: string;
    /**
     * most headers are not supported by Safari and Android browsers
     */
    headers?: Record<string, string>;
    /**
     * some string to send via a POST request
     */
    data?: string;
    /**
     * a timeout in ms
     */
    timeout?: number;
    /**
     * one of arraybuffer, blob, json
     */
    responseType?: "arraybuffer" | "blob" | "json";
    /**
     * send cookies of CROS request
     */
    credentials?: boolean;
    /**
     * callback to be executed if the request was aborted
     */
    onabort?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * callback to be executed if the request ended up with an error
     */
    onerror?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * callback to be executed if the request started to load
     */
    onloadstart?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * callback to be executed if the request made some progress
     */
    onprogress?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * callback to be executed if the request's ready state changed
     */
    onreadystatechange?: ((this: XMLHttpRequest, ev: Event) => any) | null;
    /**
     * callback to be executed if the request failed due to a timeout
     */
    ontimeout?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * callback to be executed if the request was loaded
     */
    onload?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
}
interface xhr {
    /**
     * `XMLHttpRequest`的`Promise`封装
     * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
     * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外，直接返回结果
     */
    (details: xhrDetails): Promise<any>;
    (details: {
        /**
         * use async request  
         * the third argument of XMLHttpRequest.open  
         * **many properties are forbid, such as 'responseType'**
         */
        async: false
    } & xhrDetails): any;
    /**
     * `GM_xmlhttpRequest`的`Promise`封装，用于跨域`XMLHttpRequest`请求
     * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
     * @returns `Promise`托管的请求结果或者报错信息
     */
    GM(details: GMxhrDetails): Promise<any>;
    /**
     * 跨域xhr记录
     */
    log(): [string, any][];
    /**
     * `XMLHttpRequest`的GET方法的快捷模式  
     * 将url独立为第一个参数，剩余参数放在第二个参数，方便快速发送ajax  
     * **注意本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @param details url外的参数对象
     * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外，直接返回结果
     */
    get(url: string, details?: { [P in Exclude<keyof xhrDetails, "url">]?: xhrDetails[P] }): Promise<any>;
    get(url: string, details: { [P in Exclude<keyof xhrDetails, "url">]?: xhrDetails[P] } & {
        /**
         * use async request  
         * the third argument of XMLHttpRequest.open  
         * **many properties are forbid, such as 'responseType'**
         */
        async: false
    }): any;
    /**
     * `XMLHttpRequest`的POST方法的快捷模式  
     * 将url、data，Content-Type分别独立为参数，剩余参数放在末尾，方便快速发送ajax  
     * **注意本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @param data post数据
     * @param contentType 发送数据使用的编码，默认"application/x-www-form-urlencoded"
     * @param details url、data外的参数对象
     * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外，直接返回结果
     */
    post(url: string, data: string, contentType?: string, details?: { [P in Exclude<keyof xhrDetails, "url" | "data">]?: xhrDetails[P] }): Promise<any>;
}