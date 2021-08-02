interface GMWindow extends Window { [name: string]: any }
declare const unsafeWindow: GMWindow;
/**
 * Tampermonkey APIs
 */
declare namespace GM {
    let xmlHttpRequest: typeof GM_xmlhttpRequest;
    let getResourceText: typeof GM_getResourceText;
    let getResourceURL: typeof GM_getResourceURL;
    let getValue: typeof GM_getValue;
    let setValue: typeof GM_setValue;
    let deleteValue: typeof GM_deleteValue;
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
}
declare function GM_xmlhttpRequest(details: GMxhrDetails): { abort: () => void };
declare function GM_getResourceText(name: string): string;
declare function GM_getResourceURL(name: string): string;
declare function GM_getValue<T>(name: string, defaultValue?: T): T;
declare function GM_setValue<T>(name: string, value: T): void;
declare function GM_deleteValue(name: string): void;

/**
 * Global APIs and propertys
 */
declare namespace API {
    const Handler: string;
    const Name: string;
    const Virsion: string;
    const GM: typeof globalThis.GM;
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