/** 简单请求头 */
const CORS_safelisted_request_header = [
    "accept",
    "accept-language",
    "content-language",
    "content-type",
    "user-agent",
    "referer"
];
class Headers {
    private headers: Record<string, chrome.declarativeNetRequest.ModifyHeaderInfo> = {}
    /**
     * 拦截请求头
     * @param headers 要添加的请求头
     */
    constructor(headers?: chrome.declarativeNetRequest.ModifyHeaderInfo | chrome.declarativeNetRequest.ModifyHeaderInfo[]) {
        if (headers) {
            Array.isArray(headers) || (headers = [headers]);
            this.push(...headers);
        }
    }
    /** 添加拦截请求头 */
    push(...headers: chrome.declarativeNetRequest.ModifyHeaderInfo[]) {
        headers.forEach(d => {
            this.headers[d.header] = d;
        });
    }
    /**
     * 移除请求头
     * @param ids 请求头名
     */
    remove(...ids: string[]) {
        ids.forEach(d => {
            delete this.headers[d];
        })
    }
    /**
     * 移除请求头
     * @param headers 请求头数据
     */
    pop(...headers: chrome.declarativeNetRequest.ModifyHeaderInfo[]) {
        this.remove(...headers.map(d => d.header));
    }
    /** 输出请求头数据 */
    toJSON() {
        return Object.values(this.headers);
    }
    set(obj: Record<string, string | undefined>) {
        this.push(...Object.entries(obj).map(d => {
            const header: chrome.declarativeNetRequest.ModifyHeaderInfo = {
                header: d[0],
                operation: d[1] ? <any>'set' : <any>'remove'
            };
            d[1] && (header.value = d[1]);
            return header;
        }))
    }
}
/**
 * 拦截修改ajax禁止修改表头
 * @param input 目标url
 * @param requestHeaders 请求头
 * @returns 请求完成后用于取消对于该请求的拦截
 */
export function escapeForbidHeader(input: RequestInfo | URL, requestHeaders?: Record<string, any>, responseHeaders?: Record<string, any>) {
    if (input instanceof Request) {
        input = input.url;
    } else if (input instanceof URL) {
        input = input.toJSON();
    }
    /** 随机互斥ID */
    const id = Math.ceil(Math.random() * 1e8);
    /** 预设请求头 */
    const request = new Headers({
        header: 'origin', // origin会暴露拓展名，必须去掉
        operation: <any>'remove'
    });
    /** 预设返回头 */
    const response = new Headers([ // 允许跨域
        {
            header: 'Access-Control-Allow-Credentials', // 允许携带cookie
            operation: <any>'set',
            value: 'true'
        },
        {
            header: 'Access-Control-Allow-Methods', // 允许各种请求方法
            operation: <any>'set',
            value: 'GET,POST,PUT,OPTIONS,DELETE'
        },
        {
            header: 'Access-Control-Allow-Origin', // 允许请求来源
            operation: <any>'set',
            value: location.origin
        }
    ]);
    /** 拦截规则 */
    const rule: chrome.declarativeNetRequest.Rule = {
        id,
        action: {
            type: <any>'modifyHeaders'
        },
        condition: {
            urlFilter: input, // 精确匹配网址
            resourceTypes: <any>[
                'main_frame',
                'sub_frame',
                'stylesheet',
                'script',
                'image',
                'font',
                'object',
                'xmlhttprequest',
                'ping',
                'csp_report',
                'media',
                'websocket',
                'other'
            ]
        }
    };
    /** 非法请求头 */
    const forbiddenHeader = ['Content-Type']; // `Content-Type`特殊处理
    requestHeaders && request.set(requestHeaders); // 添加请求头
    requestHeaders && Object.entries(requestHeaders).forEach(d => {
        CORS_safelisted_request_header.includes(d[0].toLocaleLowerCase()) || (d[1] && forbiddenHeader.push(d[0]));
    })
    // 允许非法请求头
    forbiddenHeader.length && response.push({
        header: 'Access-Control-Allow-Headers',
        operation: <any>'set',
        value: forbiddenHeader.join(',')
    });
    responseHeaders && response.set(responseHeaders); // 添加返回头
    const reH = request.toJSON();
    const rpH = response.toJSON();
    reH.length && (rule.action.requestHeaders = reH);
    rpH.length && (rule.action.responseHeaders = rpH);
    return <[chrome.declarativeNetRequest.Rule, number]>[rule, id];
}
/**
 * 【后台脚本】拦截修改ajax禁止修改表头
 * @param input 目标url
 * @param requestHeaders 请求头
 * @returns 请求完成后用于取消对于该请求的拦截
 */
export function swFetchHeader(input: RequestInfo | URL, requestHeaders?: Record<string, any>, responseHeaders?: Record<string, any>) {
    if (input instanceof Request) {
        input = input.url;
    } else if (input instanceof URL) {
        input = input.toJSON();
    }
    /** 随机互斥ID */
    const id = Math.ceil(Math.random() * 1e8);
    /** 预设请求头 */
    const request = new Headers({
        header: 'origin', // origin会暴露拓展名，必须去掉
        operation: <any>'remove'
    });
    /** 预设返回头 */
    const response = new Headers();
    /** 拦截规则 */
    const rule: chrome.declarativeNetRequest.Rule = {
        id,
        action: {
            type: <any>'modifyHeaders'
        },
        condition: {
            urlFilter: input, // 精确匹配网址
            resourceTypes: <any>[
                'main_frame',
                'sub_frame',
                'stylesheet',
                'script',
                'image',
                'font',
                'object',
                'xmlhttprequest',
                'ping',
                'csp_report',
                'media',
                'websocket',
                'other'
            ]
        }
    };
    requestHeaders && request.set(requestHeaders); // 添加请求头
    responseHeaders && response.set(responseHeaders); // 添加返回头
    const reH = request.toJSON();
    const rpH = response.toJSON();
    reH.length && (rule.action.requestHeaders = reH);
    rpH.length && (rule.action.responseHeaders = rpH);
    return <[chrome.declarativeNetRequest.Rule, number]>[rule, id];
}