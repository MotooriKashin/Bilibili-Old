/** 封装脚本管理器提供的API */
Object.defineProperties(GM, {
    xmlHttpRequest: { value: GM_xmlhttpRequest },
    getValue: { value: GM_getValue },
    setValue: { value: GM_setValue },
    deleteValue: { value: GM_deleteValue },
    listValues: { value: GM_listValues },
    getResourceText: { value: GM_getResourceText },
    getResourceURL: { value: GM_getResourceURL },
    DOM: { value: document },
    protobuf: { value: (<any>window).protobuf }
})

/** 封装脚本管理器API的顶级对象 */
declare namespace GM {
    interface cookieDetails {
        /** 域 */
        domain: string,
        /** 截止日期时间戳（10位） */
        expirationDate: number;
        /** 客户端专用，不会发送给服务端 */
        hostOnly: boolean;
        /** 服务端专用，客户端js无法获取/修改 */
        httpOnly: boolean;
        /** 名称 */
        name: string;
        /** 路径 */
        path: string;
        /** 同源策略 */
        sameSite: string;
        /** 安全策略 */
        secure: boolean;
        /** 会话型cookie，临时有效，随页面一起销毁 */
        session: boolean;
        /** 值 */
        value: string
    }
    const xmlHttpRequest: typeof GM_xmlhttpRequest;
    const getValue: typeof GM_getValue;
    const setValue: typeof GM_setValue;
    const deleteValue: typeof GM_deleteValue;
    const listValues: typeof GM_listValues;
    const getResourceText: typeof GM_getResourceText;
    const getResourceURL: typeof GM_getResourceURL;
    const info: {
        downloadMode: string;
        isFirstPartyIsolation: boolean;
        isIncognito: boolean;
        scriptHandler: string;
        scriptMetaStr: string;
        scriptSource: string;
        scriptUpdateURL: string;
        scriptWillUpdate: string;
        version: string;
        script: {
            antifeatures: {};
            author: string;
            blockers: [];
            copyright: string;
            description: string;
            description_i18n: {};
            evilness: number;
            excludes: [];
            grant: [];
            header: string;
            homepage: string;
            icon: string;
            icon64: string;
            includes: [];
            lastModified: number;
            matches: [];
            name: string;
            name_i18n: [];
            namespace: string;
            options: {
                check_for_updates: boolean;
                comment: string;
                compat_foreach: boolean;
                compat_metadata: boolean;
                compat_prototypes: boolean;
                compat_wrappedjsobject: boolean;
                compatopts_for_requires: boolean;
                noframes: boolean;
                override: {
                    merge_connects: boolean;
                    merge_excludes: boolean;
                    merge_includes: boolean;
                    merge_matches: boolean;
                    orig_connects: [];
                    orig_excludes: [];
                    orig_includes: [];
                    orig_matches: [];
                    orig_noframes: boolean;
                    orig_run_at: string;
                    use_blockers: [];
                    use_connects: [];
                    use_excludes: [];
                    use_includes: [];
                    use_matches: [];
                }
                run_at: string;
            }
            position: number;
            requires: [];
            resources: [{ [name: string]: string }];
            "run-at": string;
            supportURL: string;
            sync: { imported: string };
            unwrap: boolean;
            updateURL: string;
            uuid: string;
            version: string;
            webRequest: string;
        }
    }
    const cookie: {
        /**
         * **警告：此实验性特性仅在Tampermonkey Beta中可用，否则将抛出语法错误！**  
         * 新版Tampermonkey Beta v4.14.615中已不可用，请直接调用用对应方法。
         */
        <T extends keyof typeof cookie>(method: T, ...args: Parameters<(typeof cookie)[T]>): ReturnType<(typeof cookie)[T]>;
        /**
         * 以数组形式返回所有cookie  
         * **警告：此实验性特性仅在Tampermonkey Beta中可用，否则将抛出语法错误！**
         * @param details 筛选条件，无条件请使用空对象{}会返回所有cookie
         * @returns 符合条件的cookie对象数组
         */
        list(details: Partial<Record<"domain" | "name" | "path", string>>): Promise<cookieDetails[]>;
        /**
         * 修改/添加cookie  
         * **警告：此实验性特性仅在Tampermonkey Beta中可用，否则将抛出语法错误！**
         * @param args cookie详细信息
         */
        set(details: Partial<cookieDetails>): Promise<void>;
        /**
         * 删除cookie  
         * **警告：此实验性特性仅在Tampermonkey Beta中可用，否则将抛出语法错误！**
         * @param args 删除条件
         */
        delete(details: Record<"name", string>): Promise<void>;
    }
    /**
     * 本属性仅供`document.write`系列方法调用，
     * 其他情况下请一律正常使用`document`！  
     * 原因是`document.write`重写方法的`document`引用必须来自Tampermonkey沙箱环境，
     * 否则脚本自身都无法正常使用`GM_setValue`等API。  
     * 这里通过GM变量传递只是不想暴露到API变量中引发误会，
     * 而且这个`document`引用本就是Tampermonkey提供的，
     * 暴露在GM变量中实至名归。
     */
    const DOM: Document;
    /** protobuf.js */
    const protobuf: Record<string, any>;
}
declare function GM_xmlhttpRequest(details: GMxhrDetails): { abort: () => void };
declare function GM_getResourceText(name: string): string;
declare function GM_getResourceURL(name: string): string;
declare function GM_getValue<T>(name: string, defaultValue?: T): T;
declare function GM_setValue<T>(name: string, value: T): void;
declare function GM_deleteValue(name: string): void;
declare function GM_listValues(): string[];
/** `GM_xmlhttpRequest`方法所需参数 */
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