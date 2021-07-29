interface GMWindow extends Window { BLOD: {} }
declare const unsafeWindow: GMWindow;
/**
 * Tampermonkey APIs
 */
declare namespace GM {
    function xmlHttpRequest(details: GMxhrDetails): { abort: () => void };
    function getResourceText(name: string): string;
    function getResourceURL(name: string): string;
    function getValue<T>(name: string, defaultValue?: T): T;
    function setValue<T>(name: string, value: T): void;
    function deleteValue(name: string): void;
    namespace info {
        const downloadMode: string;
        const isFirstPartyIsolation: boolean;
        const isIncognito: boolean;
        const scriptHandler: string;
        const scriptMetaStr: string;
        const scriptSource: string;
        const scriptUpdateURL: string;
        const scriptWillUpdate: string;
        const version: string;
        function toString(): string;
        const script: {
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
}
/**
 * Global APIs and propertys
 */
declare namespace API {
    const Handler: string;
    const Name: string;
    const Virsion: string;
    /**
     * 导入模块
     * @param moduleName 模块名字
     * @param args 传递给模块的变量
     * @returns 模块返回值或者提示信息
     */
    function importModule(moduleName?: string | undefined, args?: { [key: string]: object; }): any;
    /**
     * 获取`cookies`信息
     * @returns `cookies`对象
     */
    function getCookies(): { [name: string]: string; }
    /**
     * 添加网页节点
     * @param div 节点名字
     * @param attribute 节点属性组成的对象
     * @param parrent 父节点
     * @param innerHTML 节点的`innerHTML`
     * @param top 是否在父节点置顶
     * @param replaced 被替换的节点，忽略父节点参数
     * @returns 所添加的节点
     */
    function addElement(div: string, attribute?: { [name: string]: string; } | undefined, parrent?: HTMLElement | undefined, innerHTML?: string | undefined, top?: boolean | undefined, replaced?: HTMLElement | undefined): void | HTMLElement;
    /**
     * 移除或隐藏页面节点
     * @param name 检索名称
     * @param type 检索类型`class`、`id`还是`div`
     * @param hidden 隐藏而不移除
     * @param index 检索结果有复数个时的序号
     * @param callback 移除后的回调函数
     */
    function removeElement(name: string, type: 'class' | 'id' | 'tag', hidden?: boolean, index?: number, callback?: (() => void) | undefined): void;
    /**
     * 添加CSS样式
     * @param text 样式
     * @param id 唯一ID，防止重复
     */
    function addCss(text: string, id?: string | undefined): number | undefined;
    /**
     * json化xhr返回值
     * @param data xhr返回的response
     * @returns 转化成`json`的xhr.response
     */
    function jsonCheck(data: String | JSON): { [name: string]: unknown; };
}
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
     * the response data as object if details.responseType was set
     */
    response: ArrayBuffer | Blob | JSON | string;
    /**
     * the response data as XML document
     */
    responseXML: Document;
    /**
     * the response data as plain string
     */
    responseText: string;
}
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
     * 
     */
    async?: boolean;
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

interface ModuleValue {
    [name: string]: any
}
declare namespace config {
    let toast: number;
}
declare function GM_xmlhttpRequest(details: GMxhrDetails): { abort: () => void };
declare function GM_getResourceText(name: string): string;
declare function GM_getResourceURL(name: string): string;
declare function GM_getValue<T>(name: string, defaultValue?: T): T;
declare function GM_setValue<T>(name: string, value: T): void;
declare function GM_deleteValue(name: string): void;