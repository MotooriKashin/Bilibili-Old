namespace API {
    /** `API.xhr`的传参，用于配置`XMLHttpRequest` */
    interface xhrDetails {
        /** one of GET, HEAD, POST */
        method?: "GET" | "HEAD" | "POST";
        /** the destination URL */
        url: string;
        /** most headers are not supported by Safari and Android browsers */
        headers?: Record<string, string>;
        /** some string to send via a POST request */
        data?: string;
        /** a timeout in ms */
        timeout?: number;
        /** one of arraybuffer, blob, json */
        responseType?: "arraybuffer" | "blob" | "json";
        /** send cookies of CROS request */
        credentials?: boolean;
        /** callback to be executed if the request was aborted */
        onabort?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        /** callback to be executed if the request ended up with an error */
        onerror?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        /** callback to be executed if the request started to load */
        onloadstart?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        /** callback to be executed if the request made some progress */
        onprogress?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        /** callback to be executed if the request's ready state changed */
        onreadystatechange?: ((this: XMLHttpRequest, ev: Event) => any) | null;
        /** callback to be executed if the request failed due to a timeout */
        ontimeout?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        /** callback to be executed if the request was loaded */
        onload?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    }
    /** 异步请求 */
    interface xhrDetailsAsync extends xhrDetails {
        async?: true;
    }
    /** 同步请求 */
    interface xhrDetailsSync extends xhrDetails {
        async?: false
    }
    /** 跨域请求及其值栈 */
    const catches: [string, any] = <any>[];
    /** 请求栈 */
    const Record: Record<string, any> = {
        default: {}, arraybuffer: {}, blob: {}, document: {}, json: {}, text: {}
    };
    /**
     * `XMLHttpRequest`的`Promise`封装
     * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
     * @returns `Promise`托管的请求结果或者报错信息
     */
    export function xhr(details: xhrDetailsAsync): Promise<any>;
    /**
     * `XMLHttpRequest`的封装
     * @param details 以对象形式传递的参数
     * @returns 请求结果或者报错信息
     */
    export function xhr(details: xhrDetailsSync): any;
    export function xhr(details: xhrDetailsAsync | xhrDetailsSync) {
        details.method == "POST" && (details.headers = details.headers || {}, !details.headers["Content-Type"] && Reflect.set(details.headers, "Content-Type", "application/x-www-form-urlencoded"));
        if (details.async === false) {
            if (Record[details.responseType || "default"][details.url]) return Record[details.responseType || "default"][details.url];
            let xhr = new XMLHttpRequest();
            xhr.open(details.method || 'GET', details.url, false);
            details.responseType && (xhr.responseType = details.responseType);
            details.credentials && (xhr.withCredentials = true);
            details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
            details.timeout && (xhr.timeout = details.timeout);
            xhr.send(details.data);
            Promise.resolve().then(() => Record[details.responseType || "default"][details.url] = xhr.response);
            return xhr.response;
        } else return new Promise((resolve, reject) => {
            if (Record[details.responseType || "default"][details.url]) return resolve(Record[details.responseType || "default"][details.url]);
            let xhr = new XMLHttpRequest();
            xhr.open(details.method || 'GET', details.url);
            details.responseType && (xhr.responseType = details.responseType);
            details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
            details.credentials && (xhr.withCredentials = true);
            details.timeout && (xhr.timeout = details.timeout);
            xhr.onabort = details.onabort || reject;
            xhr.onerror = details.onerror || reject;
            details.onloadstart && (xhr.onloadstart = details.onloadstart);
            details.onprogress && (xhr.onprogress = details.onprogress);
            details.onreadystatechange && (xhr.onreadystatechange = details.onreadystatechange);
            xhr.ontimeout = details.ontimeout || reject;
            xhr.onload = details.onload || (() => resolve(xhr.response));
            xhr.addEventListener("load", () => { Promise.resolve().then(() => Record[details.responseType || "default"][details.url] = xhr.response); });
            xhr.send(details.data);
        })
    }
    /**
     * 跨域请求日志
     * @returns 跨域请求及其结果
     */
    xhr.log = () => catches;
    /**
     * `GM_xmlhttpRequest`的`Promise`封装，用于跨域`XMLHttpRequest`请求
     * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
     * @returns `Promise`托管的请求结果或者报错信息
     */
    xhr.GM = function (details: GMxhrDetails): Promise<any> {
        return new Promise((resolve, reject) => {
            if (Record[details.responseType || "default"][details.url]) return resolve(Record[details.responseType || "default"][details.url]);
            details.method = details.method || 'GET';
            details.onload = details.onload || ((xhr) => {
                Promise.resolve().then(() => Record[details.responseType || "default"][details.url] = xhr.response);
                catches.push([details.url, xhr.response]);
                resolve(xhr.response);
            });
            details.onerror = details.onerror || ((xhr) => {
                catches.push([details.url, xhr.response]);
                reject(xhr.response);
            });
            GM.xmlHttpRequest(details);
        })
    }
    /**
     * `XMLHttpRequest`的GET方法的快捷模式  
     * **本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @returns `Promise`托管的请求结果或者报错信息。
     */
    function get(url: string): Promise<any>;
    /**
     * `XMLHttpRequest`的GET方法的快捷模式  
     * **本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @param details url外的参数对象
     * @returns `Promise`托管的请求结果或者报错信息
     */
    function get(url: string, details: Omit<xhrDetailsAsync, "url">): Promise<any>;
    /**
     * `XMLHttpRequest`的GET方法的快捷模式  
     * **本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @param details url外的参数对象
     * @returns 请求结果或者报错信息
     */
    function get(url: string, details: Omit<xhrDetailsSync, "url">): any;
    function get(url: string, details: Omit<xhrDetailsAsync, "url"> | Omit<xhrDetailsSync, "url"> = {}) {
        !Reflect.has(details, "credentials") && (details.credentials = true);
        return (<any>xhr)({ url: url, ...details });
    }
    xhr.get = get;
    /**
     * `XMLHttpRequest`的POST方法的快捷模式  
     * 将url、data，Content-Type分别独立为参数，剩余参数放在末尾，方便快速发送ajax  
     * **本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @param data post数据
     * @param contentType 发送数据使用的编码，默认"application/x-www-form-urlencoded"
     * @returns `Promise`托管的请求结果或者报错信息
     */
    function post(url: string, data: string, contentType?: string): Promise<any>;
    /**
     * `XMLHttpRequest`的POST方法的快捷模式  
     * 将url、data，Content-Type分别独立为参数，剩余参数放在末尾，方便快速发送ajax  
     * **本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @param data post数据
     * @param contentType 发送数据使用的编码，默认"application/x-www-form-urlencoded"
     * @param details url、data外的参数对象
     * @returns `Promise`托管的请求结果或者报错信息
     */
    function post(url: string, data: string, contentType?: string, details?: Omit<xhrDetailsAsync, "url" | "data">): Promise<any>;
    /**
     * `XMLHttpRequest`的POST方法的快捷模式  
     * 将url、data，Content-Type分别独立为参数，剩余参数放在末尾，方便快速发送ajax  
     * **本方法默认带上了cookies，如需禁用请在details中提供headers对象并将其credentials属性置为false**
     * @param url url链接
     * @param data post数据
     * @param contentType 发送数据使用的编码，默认"application/x-www-form-urlencoded"
     * @param details url、data外的参数对象
     * @returns 请求结果或者报错信息
     */
    function post(url: string, data: string, contentType?: string, details?: Omit<xhrDetailsSync, "url" | "data">): any;
    function post(url: string, data: string, contentType: string = "application/x-www-form-urlencoded", details: Omit<xhrDetailsAsync, "url" | "data"> | Omit<xhrDetailsSync, "url" | "data"> = {}) {
        !Reflect.has(details, "credentials") && (details.credentials = true);
        details.headers = { "Content-Type": contentType, ...details.headers };
        return (<any>xhr)({ url: url, method: "POST", data: data, ...details })
    }
    xhr.port = post;
}