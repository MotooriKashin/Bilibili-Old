/**
 * Tampermonkey 提供的高级API的封装
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
                };
                run_at: string;
            };
            position: number;
            requires: [];
            resources: [{
                [name: string]: string;
            }];
            "run-at": string;
            supportURL: string;
            sync: {
                imported: string;
            };
            unwrap: boolean;
            updateURL: string;
            uuid: string;
            version: string;
            webRequest: string;
        };
    };
}
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_xmlhttpRequest(details: GMxhrDetails): {
    abort: () => void;
};
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_getResourceText(name: string): string;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_getResourceURL(name: string): string;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_getValue<T>(name: string, defaultValue?: T): T;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_setValue<T>(name: string, value: T): void;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_deleteValue(name: string): void;
declare const CONFIG: {
    [name: string]: any;
};
declare const config: {
    [name: string]: any;
};
declare const SETTING: (ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon)[];
declare const LOADING: string[];
declare function modifyConfig(obj: ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon): void;
declare function registerSetting(obj: ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon): void;
declare const MENU: {
    [name: string]: Menuitem;
};
declare function registerMenu(obj: Menuitem): void;
/**
 * 已注册的菜单，通过`registerMenu`新建项请补充这里的可能值
 * **本变量仅作为类型声明接口类似的东西存在，不可参与到任何实际运行代码中！**
 */
declare const settingSort: "common" | "rewrite" | "restore" | "style" | "danmaku" | "player" | "live";
/**
 * 工具栏按钮
 */
interface ToolIcon {
    /**
     * 类型标志，用于识别这是工具栏按钮设置项
     */
    type: "icon";
    /**
     * 按钮 svg 图标字符串
     */
    svg: string;
    /**
     * 鼠标焦点按钮时提示的文字
     */
    title: string;
    /**
     * 鼠标单击时的回调
     */
    action: (node: HTMLDivElement) => void;
}
/**
 * 菜单项
 */
interface Menuitem {
    /**
     * 菜单主键（唯一），可以取已有的，也可以自定义
     */
    key: string;
    /**
     * 主键名字，简短的菜单分类名字，与 key 一一对应
     */
    name: string;
    /**
     * 菜单图标 svg 字符串
     */
    svg?: string;
}
/**
 * 图片类菜单项，可以作为banner或者下一项设置的图解说明等
 */
interface ItemPic {
    /**
     * 类型标志，用于识别这是图片类设置项
     */
    type: "picture";
    /**
     * 菜单归属分类菜单，也可以新建
     */
    sort: string;
    /**
     * 图片 URL
     */
    src: string;
}
interface ItemCommon {
    /**
     * 设置唯一主键，将作为全局变量`config`的属性名。
     * **注意不能与已有设置项重复**
     */
    key: string;
    /**
     * 菜单归属分类菜单
     * 可以使用已有的，参见`API.settingMenu`
     * 若要新建，请到`register.ts`中添加，并补充`settingSort`声明的可能值
     */
    sort: typeof settingSort;
    /**
     * 设置 svg 图片
     */
    svg?: string;
    /**
     * 设置内容
     */
    label: string;
    /**
     * 内容附加简短介绍
     */
    sub?: string;
    /**
     * 鼠标移动到设置项时浮动信息，可以详细介绍设置的信息
     * 该内容可以包含<i>、<strong>等HTML便签用于格式化信息
     * ※ 理论上支持所有能以<div>为父节点的标签
     */
    float?: string;
}
/**
 * 开关类菜单项，用以给用户判断是否开启某些功能等
 * 可以在`action`属性添加回调函数以立即响应用户的开关操作
 * 否则可能需要刷新页面才会生效
 */
interface ItemSwh extends ItemCommon {
    /**
     * 类型标志，用于识别这是开关类设置项
     */
    type: "switch";
    /**
     * 设置的值，添加设置项时将作为默认值
     * 实际时将以用户本地配置`config[key]`为准
     */
    value: boolean;
    /**
     * 点击该设置时的回调函数
     * 将调整后的`value`作为参数传递
     * 设置节点本身将作为`this`传递
     */
    action?: (value: Boolean) => void;
    /**
     * 所依赖的模块名称（带拓展名）
     * `value`为true时脚本会基于此提前从服务器获取模块到本地
     */
    depends?: string[];
}
/**
 * 下拉框类菜单项，用于给用户从多个数值选一个等
 * 可以在`action`属性添加回调函数以立即响应用户的开关操作
 * 否则可能需要刷新页面才会生效
 */
interface ItemRow extends ItemCommon {
    /**
     * 类型标志，用于识别这是下拉框类设置项
     */
    type: "row";
    /**
     * 默认取值
     * 实际时将以用户本地配置`config[key]`为准
     */
    value: string;
    /**
     * 下拉框可选值列表
     */
    list: string[];
    /**
     * 改变选值后的回调函数
     * 将调整后的`value`作为参数传递
     * 设置节点本身将作为`this`传递
     */
    action?: (value: string) => void;
}
/**
 * 按钮设置，用以用户点击按钮执行操作
 * 必须在`action`属性添加回调函数
 */
interface ItemPus extends ItemCommon {
    /**
     * 类型标志，用于识别这是按钮设置项
     */
    type: "action";
    /**
     * 按钮上的文字
     */
    title: string;
    /**
     * 点击按钮执行的回调函数
     * 设置节点本身将作为this传入
     */
    action: () => void;
    /**
     * 点击按钮后临时禁用按钮多长时间，单位：/s，默认为 3
     * 0 表示一直禁用直到刷新面板
     */
    disabled?: number;
}
/**
 * 输入框设置项，用以提供一个输入框与用户交互等
 * 需要自行将HTML的`input`标签配置以对象形式写入`input`属性
 */
interface ItemIpt {
    /**
     * 类型标志，用于识别这是输入框设置项
     */
    type: "input";
    /**
     * 菜单归属分类菜单，也可以新建
     */
    sort: string;
    /**
     * 设置 svg 图片
     */
    svg?: string;
    /**
     * 鼠标移动到设置项时浮动信息，可以详细介绍设置的信息
     * 该内容可以包含<i>、<strong>等HTML便签用于格式化信息
     * ※ 理论上支持所有能以<div>为父节点的标签
     */
    float?: string;
    /**
     * 输入框前面的文字，用来提示该输入框是干什么的
     */
    label: string;
    /**
     * 用于给`input`标签添加的属性
     * 请自行通过合适的属性来指定`input`类型及其他要求
     */
    input: input;
    /**
     * 回调函数，用于接受用户输入内容以执行操作
     * 将输入值作为参数传递
     * 设置节点本身将作为`this`传递
     */
    action?: (value: string) => void;
    /**
     * 输入框后按钮上的文字
     */
    title?: string;
    /**
     * 设置项主键（唯一），可选
     */
    key: string;
    /**
     * 默认值，输入框内的默认值
     * 这意味着本设置将保存到本地 config
     */
    value?: string;
    /**
     * 用于判断输入的正则表达式
     */
    pattern?: RegExp;
    /**
     * 点击按钮后临时禁用按钮多长时间，单位：/s，默认为 3
     * 0 表示一直禁用直到刷新面板
     */
    disabled?: number;
}
/**
 * 文件选择设置项，用于提取本地文件读取等
 */
interface ItemFie extends ItemCommon {
    /**
     * 类型标志，用于识别这是输入框设置项
     */
    type: "file";
    /**
     * 按钮上的文字
     */
    title: string;
    /**
     * 文件拓展名列表：如 `.txt`
     */
    accept?: string[];
    /**
     * 是否允许文件多选
     */
    multiple?: boolean;
    /**
     * 点击按钮执行的回调函数
     * 设置节点本身将作为this传递
     * 将文件列表`input.files`作为参数传递
     */
    action: (files: FileList) => void;
}
/**
 * 多选类菜单项，用以提供一组数据供用户不定多选等
 * 可以在`action`属性添加回调函数以立即响应用户的开关操作
 * 如果值只有一个等于另一种形式的开关菜单只是回调还是数组
 * 注意：任意选项改变都会触发回调
 */
interface ItemMut extends ItemCommon {
    /**
     * 类型标志，用于识别这是输入框设置项
     */
    type: "mutlti";
    /**
     * 设置主键（唯一），将作为用户本地设置`config`的属性名称
     */
    key: string;
    /**
     * 默认取值列表
     * 实际时将以用户本地配置`config[key]`为准
     */
    value: string[];
    /**
     * 所有选项列表
     */
    list: string[];
    /**
     * 改变选值后的回调函数
     * 将调整后的`value`作为参数传递
     * 设置节点本身将作为`this`传递
     */
    action?: (value: string[]) => void;
}
/**
 * input标签的可选属性
 */
interface input {
    /**
     * 选择提交的文件类型，仅限type="file"
     * `audio/*` `video/*` `image/*` `MIME_type`
     */
    accept?: string;
    /**
     * 图像输入的替代文本，仅限type="image"
     */
    alt?: string;
    /**
     * 自动完成输入
     */
    autocomplete?: "on" | "off";
    /**
     * 页面加载时自动焦点
     */
    autofocus?: "autofocus";
    /**
     * 页面加载时自动选中，仅限ype="checkbox"或type="radio"
     */
    checked?: "checked";
    /**
     * 禁用输入框
     */
    disabled?: "disabled";
    /**
     * 所属的表单，复数时以逗号间隔
     */
    form?: string;
    /**
     * 提交表单时的URL，仅限type="submit"或type="image"
     */
    formaction?: string;
    /**
     * 表单数据使用的编码，仅限type="submit"或type="image"
     */
    formenctypeNew?: string;
    /**
     * 表单提交使用的HTTP方法，仅限type="submit"或type="image"
     */
    formmethod?: "GET" | "POST";
    /**
     * 覆盖表单标签的`novalidate`属性
     */
    formnovalidate?: "formnovalidate";
    /**
     * 由谁处理表单相应，取值内置关键词或对应的`framename`
     */
    formtarget?: "_blank" | "_self" | "_parent" | "_top" | string;
    /**
     * 元素高度：/px，仅限type="image"
     */
    height?: number;
    /**
     * 绑定的<datalist>元素的id
     */
    list?: string;
    /**
     * 接受输入的最大值
     */
    max?: number | string;
    /**
     * 输入框最大字符数
     */
    maxlength?: number;
    /**
     * 接受输入的最小值
     */
    min?: number | string;
    /**
     * 允许多个输入，仅限type="file"或type="email"
     */
    multiple?: "multiple";
    /**
     * 元素名称
     */
    name?: string;
    /**
     * 输入提示信息
     */
    placeholder?: string;
    /**
     * 只读元素
     */
    readonly?: "readonly";
    /**
     * 禁止空提交
     */
    required?: "required";
    /**
     * 元素可见宽度
     */
    size?: number;
    /**
     * 提交按钮的图片URL
     */
    src?: string;
    /**
     * 输入的合法间隔
     */
    step?: number;
    /**
     * 输入框类型
     */
    type?: "button" | "checkbox" | "color" | "date" | "datetime" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";
    /**
     * 元素的宽度：/px，仅限type="image"
     */
    width?: number;
}
/**
 * 归档一组设置，这组设置将在点击本条设置后展开
 * 用于分组一些关联性很强或者同类的设置
 * 可以看作是在菜单中再分类
 */
interface ItemSor extends ItemCommon {
    /**
     * 类型标志，用于识别这是分组集合设置项
     */
    type: "sort";
    /**
     * 类别名称
     */
    label: string;
    /**
     * 设置组，包含该类下属设置项
     */
    list: typeof SETTING;
}
declare class Xhr {
    /**
     * `XMLHttpRequest`的`Promise`封装
     * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
     * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外，直接返回结果
     */
    static xhr(details: xhrDetails): any;
    /**
     * `GM_xmlhttpRequest`的`Promise`封装，用于跨域`XMLHttpRequest`请求
     * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
     * @returns `Promise`托管的请求结果或者报错信息
     */
    static GM(details: GMxhrDetails): Promise<any>;
}
declare const xhr: {
    (details: xhrDetails): any;
    GM(details: GMxhrDetails): Promise<any>;
};
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
    headers?: {
        [name: string]: string;
    };
    /**
     * some string to send via a POST request
     */
    data?: string;
    /**
     * async request ? the third argument of XMLHttpRequest.open.
     * many properties will be ignored if this is `false`
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
    headers?: {
        [name: string]: string;
    };
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
declare class Format {
    /**
     * 格式化时间
     * @param time 时间戳
     * @param type 是否包含年月日
     * @returns 时:分:秒 | 年-月-日 时:分:秒
     */
    static timeFormat(time?: number, type?: boolean): string;
    /**
     * 格式化字节
     * @param size 字节/B
     * @returns n B | K | M | G
     */
    static sizeFormat(size?: number): string;
    /**
     * 格式化进位
     * @param num 实数
     * @returns n 万 | 亿
     */
    static unitFormat(num?: number): string;
    /**
     * 冒泡排序
     * @param arr 待排序数组
     * @returns 排序结果
     */
    static bubbleSort(arr: number[]): number[];
    /**
     * 随机截取指定大小子数组
     * @param arr 母数组
     * @param num 子数组大小
     * @returns 子数组
     */
    static randomArray(arr: any[], num: number): any[];
    /**
     * search参数对象拼合回URL
     * @param url URL主体，可含search参数
     * @param obj search参数对象
     * @returns 拼合的URL
     */
    static objUrl(url: string, obj: {
        [name: string]: string;
    }): string;
    /**
     * 提取URL search参数对象
     * @param url 原URL
     * @returns search参数对象
     */
    static urlObj(url?: string): {
        [name: string]: string;
    };
}
declare class Debug {
    static log(...data: any[]): void;
    static info(...data: any[]): void;
    static debug(...data: any[]): void;
    static warn(...data: any[]): void;
    static error(...data: any[]): void;
}
declare const debug: {
    (...data: any[]): void;
    log(...data: any[]): void;
    info(...data: any[]): void;
    debug(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
};
declare class Toast {
    /**
     * 通知节点，初始化专用
     */
    static container: HTMLElement;
    /**
     * 通知样式
     */
    static style: HTMLElement;
    /**
     * 判定`body`是否存在
     */
    static check: boolean;
    /**
     * 通知节点，呈现时
     */
    static box: HTMLElement;
    /**
     * 未呈现通知计数
     */
    static count: number;
    /**
     * 动画呈现帧数
     */
    static sence: number;
    static init(): void;
    static show(type: "info" | "success" | "warning" | "error", ...msg: string[]): number;
    static come(item: HTMLDivElement, i?: number): void;
    static quit(item: HTMLDivElement, i?: number): void;
    static msg(...msg: string[]): HTMLDivElement;
}
declare const toast: {
    (...msg: string[]): void;
    info(...msg: string[]): void;
    success(...msg: string[]): void;
    warning(...msg: string[]): void;
    error(...msg: string[]): void;
};
declare class API {
    static modules: {
        [name: string]: any;
    };
    static inModules: string[];
    static resource: {
        [name: string]: string;
    };
    static toModules: string[];
    static updating: boolean;
    static Virsion: string;
    static API: Object;
    static Name: string;
    static apply: {
        [name: string]: string;
    };
    Name: string;
    Virsion: string;
    Handler: string;
    registerSetting: typeof registerSetting;
    registerMenu: typeof registerMenu;
    runWhile: typeof API.runWhile;
    importModule: typeof API.importModule;
    timeFormat: (time?: number, type?: boolean) => string;
    sizeFormat: (size?: number) => string;
    unitFormat: (num?: number) => string;
    bubbleSort: (arr: number[]) => number[];
    randomArray: (arr: any[], num: number) => any[];
    objUrl: (url: string, obj: {
        [name: string]: string;
    }) => string;
    urlObj: (url?: string) => {
        [name: string]: string;
    };
    trace: (e: Error, label?: string, toastr?: boolean) => void;
    bofqiMessage(msg?: string | [string?, string?, string?], time?: number, callback?: () => void, replace?: boolean): void;
    addElement(tag: keyof HTMLElementTagNameMap, attribute?: {
        [name: string]: string;
    }, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElement | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | HTMLAnchorElement | HTMLAppletElement | HTMLScriptElement | HTMLEmbedElement | HTMLFormElement | HTMLHeadElement | HTMLAreaElement | HTMLObjectElement | HTMLLinkElement | HTMLTrackElement | HTMLProgressElement | HTMLAudioElement | HTMLBaseElement | HTMLQuoteElement | HTMLBodyElement | HTMLBRElement | HTMLButtonElement | HTMLTableCaptionElement | HTMLTableColElement | HTMLDataElement | HTMLDataListElement | HTMLModElement | HTMLDetailsElement | HTMLDialogElement | HTMLDirectoryElement | HTMLDivElement | HTMLDListElement | HTMLFieldSetElement | HTMLFontElement | HTMLFrameElement | HTMLFrameSetElement | HTMLHeadingElement | HTMLHRElement | HTMLHtmlElement | HTMLIFrameElement | HTMLInputElement | HTMLLabelElement | HTMLLegendElement | HTMLLIElement | HTMLMapElement | HTMLMarqueeElement | HTMLMenuElement | HTMLMetaElement | HTMLMeterElement | HTMLOListElement | HTMLOptGroupElement | HTMLOptionElement | HTMLOutputElement | HTMLParagraphElement | HTMLParamElement | HTMLPictureElement | HTMLPreElement | HTMLSelectElement | HTMLSlotElement | HTMLSourceElement | HTMLSpanElement | HTMLStyleElement | HTMLTableElement | HTMLTableSectionElement | HTMLTableDataCellElement | HTMLTemplateElement | HTMLTextAreaElement | HTMLTableHeaderCellElement | HTMLTimeElement | HTMLTitleElement | HTMLTableRowElement | HTMLUListElement;
    addCss(txt: string, id?: string, parrent?: Node): Promise<void>;
    static runWhile(check: Function, callback: Function, delay?: number, stop?: number): void;
    alert(text: string, title?: string): Promise<boolean>;
    getModule(name: string): string;
    static importModule(name?: string, args?: {
        [key: string]: any;
    }, force?: boolean): string[];
    static firstInit(): Promise<void>;
    static updateModule(...msg: string[]): Promise<void>;
    static downloadModule(name: string, url?: string): Promise<void>;
    static init(): void;
    constructor();
}
