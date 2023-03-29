import { escapeForbidHeader } from "./escape-header";
import { postMessage } from "./message";

/** 提权操作接口*/
export const GM = new (class GM {
    /** 【用户脚本】脚本信息 */
    info?: { script: { version: string } };
    /** 【脚本限定】跨域XMLHttpRequest */
    xmlHttpRequest!: (details: GMxhrDetails) => { abort: () => void };
    /**
     * 向用户脚本的菜单添加新条目  
     * @param name 菜单项显示的文本的字符串
     * @param callback 菜单项时调用的函数
     * @param accessKey 键盘访问键
     */
    registerMenuCommand!: (name: string, callback: (ev: MouseEvent | KeyboardEvent) => void, accessKey?: string) => number;
    /**
     * 跨域fetch。  
     * 【用户脚本】里使用`GM.xmlHttpRequest`模拟成了fetch，**禁止请求二进制数据**！请直接使用`GM.xmlHttpRequest`。
     * @param sw 【扩展限定】申请后台脚本发起请求，当且仅当跨域出错时的无奈之举。**暂时不支持发送body为非简单类型的POST请求！**
     */
    async fetch(input: RequestInfo | URL, init?: RequestInit, sw = false) {
        if (sw) {
            return new Promise(async (resolve: (value: Response) => void, reject) => {
                if (input instanceof Request) {
                    input = input.url;
                } else if (input instanceof URL) {
                    input = input.toJSON();
                }
                input = new URL(input, location.href).toJSON();
                if (init?.body) {
                    const body = init.body;
                    if (typeof body === 'string') {
                        // 什么都不做
                    } else if (body instanceof Uint8Array) {
                        // 二进制数据无法传递到后台脚本，转化为数组，下同
                        init.body = <any>Array.from(body);
                    } else if (body instanceof ArrayBuffer) {
                        init.body = <any>Array.from(new Uint8Array(body));
                    } else if (body instanceof Blob) {
                        init.body = <any>Array.from(new Uint8Array(await body.arrayBuffer()));
                    } else if (body instanceof FormData) {
                        // 不支持传递的数据类型，抛出错误，下同
                        return reject('FormData is not JSON-serializable!')
                    } else if (body instanceof ReadableStream) {
                        return reject('ReadableStream is not JSON-serializable!');
                    } else {
                        return reject('Something is not JSON-serializable!');
                    }
                }
                postMessage({ $type: 'fetch', input, init }, ({ data, status, statusText, url, redirected, type, header }: any) => {
                    const headers: Record<string, string> = {};
                    (<string[]>header)?.forEach(d => headers[d[0]] = d[1] || '');
                    const response = new Response(new Uint8Array(data), { status, statusText, headers });
                    Object.defineProperties(response, {
                        url: { value: url },
                        redirected: { value: redirected },
                        type: { value: type },
                    })
                    resolve(response);
                }, reject);
            });
        }
        const [rule, id] = escapeForbidHeader(input, init?.headers);
        try {
            await this.updateSessionRules([rule]);
            delete init?.headers;
            const response = await fetch(input, init);
            this.removeSessionRules(id);
            return response;
        } catch (e) {
            this.removeSessionRules(id);
            throw e;
        }
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
    /** 【扩展限定】移除网络规则集 */
    removeSessionRules(ids: number | number[]) {
        Array.isArray(ids) || (ids = [ids]);
        postMessage({ $type: 'removeSessionRules', ids });
    }
    /**
     * 【扩展限定】修改ajax请求头
     * @param input url匹配规则
     * @param headers 请求头，要删除某个请求头请传入非真值
     * @returns 用于取消本拦截规则的回调
     */
    async modifyRequestheader(input: string, headers?: Record<string, any>) {
        const [rule, id] = escapeForbidHeader(input, headers);
        await this.updateSessionRules([rule]);
        return () => {
            this.removeSessionRules(id)
        }
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
    responseHeaders: string;
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