(function () {
    class Xhr {
        static catches: [string, any][] = [];
        static log = () => this.catches;
        /**
         * `XMLHttpRequest`的`Promise`封装
         * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
         * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外，直接返回结果
         */
        static xhr(details: xhrDetails & { async: boolean }): any {
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
    }
    // @ts-ignore
    API.xhr = (details: xhrDetails) => Xhr.xhr(details), API.xhr.GM = (details: GMxhrDetails) => Xhr.GM(details), API.xhr.log = () => Xhr.log();
})();
declare const xhr: {
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
}
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
    headers?: { [name: string]: string };
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
/**
 * `API.xhr.GM`的传参，用于配置`GM_xmlhttpRequest`
 */
interface GMxhrDetails {
    /**
     * one of GET, HEAD, POST
     */
    method?: "GET" | "HEAD" | "POST";
    /**
     * the destination URL
     */
    url: string;
    /**
     * ie. user-agent, referer, ... (some special headers are not supported by Safari and Android browsers)
     */
    headers?: { [name: string]: string };
    /**
     * some string to send via a POST request
     */
    data?: string;
    /**
     * a cookie to be patched into the sent cookie set
     */
    cookie?: string;
    /**
     * send the data string in binary mode
     */
    binary?: boolean;
    /**
     * don't cache the resource
     */
    nocache?: boolean;
    /**
     * revalidate maybe cached content
     */
    revalidate?: boolean;
    /**
     * a timeout in ms
     */
    timeout?: number;
    /**
     * a property which will be added to the response object
     */
    context?: any;
    /**
     * one of arraybuffer, blob, json
     */
    responseType?: "arraybuffer" | "blob" | "json";
    /**
     * a MIME type for the request
     */
    overrideMimeType?: String;
    /**
     * don't send cookies with the requests (please see the fetch notes)
     */
    anonymous?: boolean;
    /**
     * (beta) use a fetch instead of a xhr request
     * (at Chrome this causes xhr.abort, details.timeout and xhr.onprogress to not work and makes xhr.onreadystatechange receive only readyState 4 events)
     */
    fetch?: boolean;
    /**
     * a user name for authentication
     */
    user?: string;
    /**
     * a password
     */
    password?: string;
    /**
     * callback to be executed if the request was aborted
     */
    onabort?: (response: GMxhrResponse) => void;
    /**
     * callback to be executed if the request ended up with an error
     */
    onerror?: (response: GMxhrResponse) => void;
    /**
     * callback to be executed if the request started to load
     */
    onloadstart?: (response: GMxhrResponse) => void;
    /**
     * callback to be executed if the request made some progress
     */
    onprogress?: (response: GMxhrResponse) => void;
    /**
     * callback to be executed if the request's ready state changed
     */
    onreadystatechange?: (response: GMxhrResponse) => void;
    /**
     * callback to be executed if the request failed due to a timeout
     */
    ontimeout?: (response: GMxhrResponse) => void;
    /**
     * callback to be executed if the request was loaded
     */
    onload?: (response: GMxhrResponse) => void;
}