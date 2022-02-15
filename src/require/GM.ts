// GM系列高级API的封装
GM.xmlHttpRequest = GM_xmlhttpRequest;
GM.getValue = GM_getValue;
GM.setValue = GM_setValue;
GM.deleteValue = GM_deleteValue;
GM.listValues = GM_listValues;
GM.getResourceText = GM_getResourceText;
GM.getResourceURL = GM_getResourceText;
GM.DOM = document;

declare namespace GM {
    interface cookieDetails {
        /**
         * 域
         */
        domain: string,
        /**
         * 截止日期时间戳（10位）
         */
        expirationDate: number;
        /**
         * 客户端专用，不会发送给服务端
         */
        hostOnly: boolean;
        /**
         * 服务端专用，客户端js无法获取/修改
         */
        httpOnly: boolean;
        /**
         * 名称
         */
        name: string;
        /**
         * 子页面路径
         */
        path: string;
        /**
         * 同源策略
         */
        sameSite: string;
        /**
         * 是否允许通过非安全链接发送给服务器
         */
        secure: boolean;
        /**
         * 会话型cookie，临时有效，随页面一起销毁
         */
        session: boolean;
        /**
         * 值
         */
        value: string
    }
    let xmlHttpRequest: typeof GM_xmlhttpRequest;
    let getValue: typeof GM_getValue;
    let setValue: typeof GM_setValue;
    let deleteValue: typeof GM_deleteValue;
    let listValues: typeof GM_listValues;
    let getResourceText: typeof GM_getResourceText;
    let getResourceURL: typeof GM_getResourceURL;
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
    let DOM: Document;
}
declare function GM_xmlhttpRequest(details: GMxhrDetails): { abort: () => void };
declare function GM_getResourceText(name: string): string;
declare function GM_getResourceURL(name: string): string;
declare function GM_getValue<T>(name: string, defaultValue?: T): T;
declare function GM_setValue<T>(name: string, value: T): void;
declare function GM_deleteValue(name: string): void;
declare function GM_listValues(): string[];
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