import { postMessage } from "./message";

/** 提权操作接口 */
export const GM = new (class GM {
    /** 【脚本限定】跨域XMLHttpRequest */
    xmlHttpRequest!: (details: GMxhrDetails) => { abort: () => void };
    /**
     * 跨域fetch。请求完成后才会返回，原则上禁止请求**太大的二进制数据**！传递的参数也必须是JSON-serializable的数据类型！  
     * 【用户脚本】里使用`GM.xmlHttpRequest`模拟成了fetch，**禁止请求二进制数据**！请直接使用`GM.xmlHttpRequest`。
     */
    fetch(input: RequestInfo | URL, init?: RequestInit) {
        return new Promise((resolve: (value: Response) => void, reject) => {
            try {
                input = (<Request>input).url ? (<Request>input).url : <URL>input;
                // 正确处理相对路径
                input = new URL(input, location.origin).toJSON();
            } catch (e) {
                reject(e);
            }
            postMessage({ $type: 'xmlHttpRequest', input, init }, ({ data, status, statusText, url, redirected, type }: any) => {
                const response = new Response(new Uint8Array(data), { status, statusText });
                Object.defineProperties(response, {
                    url: { value: url },
                    redirected: { value: redirected },
                    type: { value: type },
                })
                resolve(response);
            }, reject);
        });
    }
    /**
     * 读取本地存储
     * @param key 主键
     * @param def 默认值
     */
    getValue<T>(key: string, def?: T) {
        return new Promise((resolve: (value: T) => void, reject) => {
            postMessage({ $type: 'getValue', key, def }, resolve, reject);
        });
    }
    /**
     * 修改本地存储
     * @param key 主键
     * @param value 内容
     */
    setValue(key: string, value: any) {
        postMessage({ $type: 'setValue', key, value });
    }
    /**
     * 删除本地存储
     * @param key 主键（序列）
     */
    deleteValue(...key: string[]) {
        postMessage({ $type: 'deleteValue', key });
    }
    /** cookie 提权 */
    cookie() {
        return new Promise((resolve: (value: chrome.cookies.Cookie[]) => void, reject) => {
            const arr = location.host.split(".");
            arr.length > 2 && arr.shift();
            postMessage({ $type: 'cookie', url: arr.join(".") }, resolve, reject);
        })
    }
    /**
     * 【扩展限定】注入用户样式
     * @param file 样式文件在扩展中的相对路径
     * @param urlonly 返回绝对路径而不直接注入
     */
    insertCSS(file: string, urlonly = false) {
        return new Promise((resolve: (value: string) => void, reject) => {
            postMessage({ $type: 'insertCSS', file, urlonly }, resolve, reject);
        });
    }
    /**
     * 【扩展限定】注入用户脚本
     * @param file 脚本文件在扩展中的相对路径
     * @param urlonly 返回绝对路径而不直接注入
     */
    executeScript(file: string, urlonly = false) {
        return new Promise((resolve: (value: string) => void, reject) => {
            postMessage({ $type: 'executeScript', file, urlonly }, resolve, reject);
        });
    }
    /** 【扩展限定】更新网络拦截规则 */
    updateSessionRules(rules: chrome.declarativeNetRequest.Rule[]) {
        return new Promise((resolve: (value: void) => void, reject) => {
            postMessage({ $type: 'updateSessionRules', rules }, resolve, reject);
        });
    }
})();
interface GMxhrDetails {
    /** one of GET, HEAD, POST */
    method?: "GET" | "HEAD" | "POST";
    /** the destination URL */
    url: string;
    /** ie. user-agent, referer, ... (some special headers are not supported by Safari and Android browsers) */
    headers?: { [name: string]: string };
    /** some string to send via a POST request */
    data?: Document | XMLHttpRequestBodyInit | null;
    /** a cookie to be patched into the sent cookie set */
    cookie?: string;
    /** send the data string in binary mode */
    binary?: boolean;
    /** don't cache the resource */
    nocache?: boolean;
    /** revalidate maybe cached content */
    revalidate?: boolean;
    /** a timeout in ms */
    timeout?: number;
    /** a property which will be added to the response object */
    context?: any;
    /** one of arraybuffer, blob, json */
    responseType?: "arraybuffer" | "blob" | "json";
    /** a MIME type for the request */
    overrideMimeType?: String;
    /** don't send cookies with the requests (please see the fetch notes) */
    anonymous?: boolean;
    /** (beta) use a fetch instead of a xhr request. (at Chrome this causes xhr.abort, details.timeout and xhr.onprogress to not work and makes xhr.onreadystatechange receive only readyState 4 events) */
    fetch?: boolean;
    /** a user name for authentication */
    user?: string;
    /** a password */
    password?: string;
    /** callback to be executed if the request was aborted */
    onabort?: (response: GMxhrResponse) => void;
    /** callback to be executed if the request ended up with an error */
    onerror?: (response: GMxhrResponse) => void;
    /** callback to be executed if the request started to load */
    onloadstart?: (response: GMxhrResponse) => void;
    /** callback to be executed if the request made some progress */
    onprogress?: (response: GMxhrResponse) => void;
    /** callback to be executed if the request's ready state changed */
    onreadystatechange?: (response: GMxhrResponse) => void;
    /** callback to be executed if the request failed due to a timeout */
    ontimeout?: (response: GMxhrResponse) => void;
    /** callback to be executed if the request was loaded */
    onload?: (response: GMxhrResponse) => void;
}
/** `GM_xmlhttpRequest`返回值 */
interface GMxhrResponse {
    /** the final URL after all redirects from where the data was loaded */
    finalUrl: string;
    /** the ready state */
    readyState: number;
    /** the request status */
    status: number;
    /** the request status text */
    statusText: string;
    /** the request response headers */
    responseHeaders: any;
    /** the response data as object if details.responseType was set: ArrayBuffer | Blob | JSON | string */
    response: any;
    /** the response data as XML document */
    responseXML: Document;
    /** the response data as plain string */
    responseText: string;
    /** A boolean value indicating if the total work to be done, and the amount of work already done, by the underlying process is calculable. In other words, it tells if the progress is measurable or not. It defaults to `false`. */
    lengthComputable: boolean;
    /** A number representing the amount of work already performed by the underlying process. The ratio of work done can be calculated with the property and `ProgressEvent.total`. When downloading a resource using HTTP, this only represent the part of the content itself, not headers and other overhead. It defaults to `0`. */
    loaded: number;
    /** A number representing the total amount of work that the underlying process is in the progress of performing. When downloading a resource using HTTP, this only represent the content itself, not headers and other overhead. It defaults to `0`. */
    total: number;
}