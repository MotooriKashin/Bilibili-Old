/** 简单请求头 */
const CORS_safelisted_request_header = [
    "accept",
    "accept-language",
    "content-language",
    "content-type",
    "user-agent",
    "referer"
];
/**
 * 拦截修改ajax禁止修改表头
 * @param input 目标url
 * @param headers 请求头
 * @returns 请求完成后用于取消对于该请求的拦截
 */
export function escapeForbidHeader(input: RequestInfo | URL, headers?: Record<string, any>) {
    if (input instanceof Request) {
        input = input.url;
    } else if (input instanceof URL) {
        input = input.toJSON();
    }
    /** 随机互斥ID */
    const id = Math.ceil(Math.random() * 1e8);
    /** 拦截规则 */
    const rule: chrome.declarativeNetRequest.Rule = {
        id,
        action: {
            type: <any>'modifyHeaders',
            requestHeaders: [
                {
                    header: 'origin', // origin会暴露拓展名，必须去掉
                    operation: <any>'remove'
                }
            ],
            responseHeaders: [ // 允许跨域
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
            ]
        },
        condition: {
            urlFilter: input, // 精确匹配网址
            resourceTypes: [<any>'xmlhttprequest'] // 当前只有xmlhttprequest需求
        }
    };
    /** 非法请求头 */
    const forbiddenHeader = ['Content-Type']; // `Content-Type`特殊处理
    headers && Object.entries(headers).forEach(d => {
        CORS_safelisted_request_header.includes(d[0].toLocaleLowerCase()) || (d[1] && forbiddenHeader.push(d[0]));
        const header: chrome.declarativeNetRequest.ModifyHeaderInfo = {
            header: d[0],
            operation: d[1] ? <any>'set' : <any>'remove'
        };
        d[1] && (header.value = d[1]);
        rule.action.requestHeaders?.push(header);
        if (d[1] === 'application/grpc') { // 允许检索grpc返回头
            rule.action.responseHeaders?.push({
                header: 'Access-Control-Expose-Headers',
                operation: <any>'set',
                value: 'grpc-status,grpc-message,grpc-status-details-bin,grpc-encoding'
            });
        }
    });
    // 允许非法请求头
    forbiddenHeader.length && rule.action.responseHeaders?.push({
        header: 'Access-Control-Allow-Headers',
        operation: <any>'set',
        value: forbiddenHeader.join(',')
    });
    return <[chrome.declarativeNetRequest.Rule, number]>[rule, id];
}
/**
 * 【后台脚本】拦截修改ajax禁止修改表头
 * @param input 目标url
 * @param headers 请求头
 * @returns 请求完成后用于取消对于该请求的拦截
 */
export function swFetchHeader(input: RequestInfo | URL, headers?: Record<string, any>) {
    if (input instanceof Request) {
        input = input.url;
    } else if (input instanceof URL) {
        input = input.toJSON();
    }
    /** 随机互斥ID */
    const id = Math.ceil(Math.random() * 1e8);
    /** 拦截规则 */
    const rule: chrome.declarativeNetRequest.Rule = {
        id,
        action: {
            type: <any>'modifyHeaders',
            requestHeaders: [
                {
                    header: 'origin', // origin会暴露拓展名，必须去掉
                    operation: <any>'remove'
                }
            ]
        },
        condition: {
            urlFilter: input, // 精确匹配网址
        }
    };
    headers && Object.entries(headers).forEach(d => {
        const header: chrome.declarativeNetRequest.ModifyHeaderInfo = {
            header: d[0],
            operation: d[1] ? <any>'set' : <any>'remove'
        };
        d[1] && (header.value = d[1]);
        rule.action.requestHeaders?.push(header);
    });
    return <[chrome.declarativeNetRequest.Rule, number]>[rule, id];
}