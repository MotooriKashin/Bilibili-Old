/**
 * 【内容脚本】拦截修改ajax禁止修改表头
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
    const id = Math.ceil(Math.random() * 1e8);
    const rule: chrome.declarativeNetRequest.Rule = {
        id,
        action: {
            type: <any>'modifyHeaders',
            requestHeaders: [
                {
                    header: 'origin',
                    operation: <any>'remove'
                }
            ],
            responseHeaders: [
                {
                    header: 'access-control-allow-credentials',
                    operation: <any>'set',
                    value: 'true'
                },
                {
                    header: 'access-control-allow-methods',
                    operation: <any>'set',
                    value: 'GET,POST,PUT,DELETE'
                },
                {
                    header: 'Access-Control-Allow-Origin',
                    operation: <any>'set',
                    value: location.origin
                },
                {
                    header: 'Access-Control-Expose-Headers',
                    operation: <any>'set',
                    value: 'Content-Length,Content-Range,x-service-module'
                }
            ]
        },
        condition: {
            urlFilter: input,
            resourceTypes: [<any>'xmlhttprequest']
        }
    };
    headers && Object.entries(headers).forEach(d => {
        d[0] = d[0].toLocaleLowerCase();
        switch (d[0]) {
            case 'cookie':
            case 'referer':
            case 'user-agent': {
                const header: chrome.declarativeNetRequest.ModifyHeaderInfo = {
                    header: d[0],
                    operation: d[1] ? <any>'set' : <any>'remove'
                };
                d[1] && (header.value = d[1]);
                rule.action.requestHeaders?.push(header)
                break;
            }
            default: break;
        }
    });
    return <[chrome.declarativeNetRequest.Rule, number]>[rule, id];
}