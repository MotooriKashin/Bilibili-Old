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
/**
 * Tampermonkey 提供的高级API的封装
 */
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
    function xmlHttpRequest(details: GMxhrDetails): { abort: () => void };
    function getValue<T>(name: string, defaultValue?: T): T;
    function setValue<T>(name: string, value: T): void;
    function deleteValue(name: string): void;
    function listValues(): string[];
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
}
declare const debug: {
    (...data: any[]): void;
    log(...data: any[]): void;
    info(...data: any[]): void;
    debug(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
}
declare const toast: {
    (...msg: string[]): void;
    info(...msg: string[]): void;
    success(...msg: string[]): void;
    warning(...msg: string[]): void;
    error(...msg: string[]): void;
}
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
}
/**
 * 模块间共享数据的对象，相当于`window`的替代
 */
declare namespace API {
    /**
     * 脚本管理器信息
     */
    let Handler: string;
    /**
     * 脚本名称
     */
    let Name: string;
    /**
     * 脚本版本
     */
    let Virsion: string;
    /**
     * 视频aid
     */
    let aid: number;
    /**
     * 视频 cid
     */
    let cid: number;
    /**
     * 视频 bvid
     */
    let bvid: string;
    /**
     * 用户 uid
     */
    let uid: string | number;
    /**
     * 视频分区编号
     */
    let tid: string | number;
    /**
     * 格式化时间
     * @param time 时间戳
     * @param type 是否包含年月日
     * @returns 时:分:秒 | 年-月-日 时:分:秒
     */
    function timeFormat(time?: number, type?: boolean): string;
    /**
     * 格式化字节
     * @param size 字节/B
     * @returns n B | K | M | G
     */
    function sizeFormat(size?: number): string;
    /**
     * 格式化进位
     * @param num 实数
     * @returns n 万 | 亿
     */
    function unitFormat(num?: number): string;
    /**
     * 冒泡排序
     * @param arr 待排序数组
     * @returns 排序结果
     */
    function bubbleSort(arr: number[]): number[];
    /**
     * 随机截取指定大小子数组
     * @param arr 母数组
     * @param num 子数组大小
     * @returns 子数组
     */
    function randomArray(arr: any[], num: number): any[];
    /**
     * search参数对象拼合回URL
     * @param url URL主体，可含search参数
     * @param obj search参数对象
     * @returns 拼合的URL
     */
    function objUrl(url: string, obj: { [name: string]: string | number }): string;
    /**
     * 提取URL search参数对象
     * @param url 原URL
     * @returns search参数对象
     */
    function urlObj(url?: string): { [name: string]: string };
    /**
     * 错误收集
     * @param e 错误信息
     * @param label 标签，用于定位错误来源
     * @param toastr 是否弹出通知
     */
    function trace(e: Error, label?: string, toastr?: boolean): void;
    /**
     * 播放器通知，播放器不存在将转送到控制台
     * @param msg 消息字符串或数组，数组时顺序分别为普通、红色、黄色消息，可按位次置空取所需颜色。本值不存在将作为“屏显”使用。
     * @param time 消息时长：/s，默认为3，为0表示永久消息
     * @param callback 点击消息执行的回调函数
     * @param replace 替代已有消息，默认为真，即同时只显示一条消息
     */
    function bofqiMessage(msg?: string | [string?, string?, string?], time?: number, callback?: () => void, replace?: boolean): void;
    /**
     * 创建HTML节点
     * @param tag 节点名称
     * @param attribute 节点属性对象
     * @param parrent 添加到的父节点，默认为body
     * @param innerHTML 节点的innerHTML
     * @param top 是否在父节点中置顶
     * @param replaced 替换节点而不是添加，被替换的节点，将忽略父节点相关参数
     */
    function addElement<T extends keyof HTMLElementTagNameMap>(tag: T, attribute?: {
        [name: string]: string
    }, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElementTagNameMap[T];
    /**
     * 添加css样式
     * @param txt css文本
     * @param id 样式ID，用于唯一标记
     * @param parrent 添加到的父节点，默认为head
     */
    function addCss(txt: string, id?: string, parrent?: Node): Promise<void>;
    /**
     * 添加条件回调，条件为真时执行回调函数，用于检测函数运行时机  
     * @param check 一个返回布尔值的函数，用于轮询，当函数返回值为真时执行回调函数
     * @param callback 待执行的回调函数
     * @param delay 轮询间隔：/ms，默认100ms
     * @param stop 轮询最大延时：/ms，多长时间后终止轮询，不做无谓的等待，默认180ms，即3分钟。为0时永不终止直到为真。
     */
    function runWhile(check: Function, callback: Function, delay?: number, stop?: number): void;
    /**
     * 标准导入模块函数  
     * 对于按需加载的模块，如果已在`apply.json`中配置好其暴露的属性/方法信息，那么无需主动导入模块，脚本会在调用到对应属性/方法时自动加载模块！
     * @param name js模块名称（含拓展名）
     * @param args 额外传递给该模块的全局变量对象，属性名=变量名，属性值=变量值
     * @param force 是否强制导入，默认否。指定该值可以二次导入已导入过的模块
     */
    function importModule(name?: string, args?: { [key: string]: any }, force?: boolean): { [name: string]: any };
    /**
     * 弹出提示框  
     * 仿造alert制作的提示框，但不具备中断页面的能力，异步返回用户点击的按钮布尔值
     * @param title 提示标题，默认为脚本名称
     * @param text 提示内容
     * @returns Promise代理的布尔值，取决于用户的点击的按钮
     */
    function alertMessage(text: string, title?: string): Promise<boolean>;
    /**
     * 获取模块文本，类似于GM.getResourceText  
     * 一般用于获取css文件
     * @param name 模块名字（含拓展名）
     */
    function getModule(name: string): string;
    /**
     * 重写网页框架
     * @param html 网页模板
     */
    function rewriteHTML(html: string): void;
    /**
     * 修改设置项的显示状态，只能改变有key的设置项  
     * 可配合displaySetting([key])立即刷新当前设置面板显示
     * @param mode key：是否隐藏 构成的对象，注意真值表示隐藏
     */
    function changeSettingMode(mode: { [key: string]: boolean }): void;
}