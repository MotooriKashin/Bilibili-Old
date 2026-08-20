import { portMessage } from "../../utils/bridge";

/**
 * 解除限制的fetch。  
 * 如非必要，请直接使用原生fetch。  
 * 无视CORS，没有预检，绕过混合内容限制，无额外开销！
 */
export async function fetch(input: URL | RequestInfo, init?: RequestInit) {

    const targetUrl = typeof input === 'string' ? input : input instanceof URL ? input : input.url;
    const absoluteUrl = new URL(targetUrl, location.href).href;
    const rawHeaders = init?.headers ? new Headers(init?.headers) : new Headers();
    const headersForDnr = {};
    const headersForNativeFetch = new Headers();
    const SIMPLE_HEADERS = ['accept', 'accept-language', 'content-language'];

    rawHeaders.forEach((value, key) => {
        if (SIMPLE_HEADERS.includes(key.toLowerCase())) {
            headersForNativeFetch.append(key, value);
        } else {
            Reflect.set(headersForDnr, key, value)
        }
    });
    let $origin = true; let $referer = true;
    const requestHeaders = Object.entries(headersForDnr).map(([key, value]) => {
        if (key.toLocaleLowerCase() === 'origin') {
            $origin = false;
        }
        if (key.toLocaleLowerCase() === 'referer') {
            $referer = false;
        }
        return {
            header: key,
            operation: <'set'>'set',
            value: String(value)
        }
    });
    // 移除 Origin 和 Referer
    $origin && requestHeaders.push(<any>{ header: 'Origin', operation: 'remove' });
    $referer && requestHeaders.push(<any>{ header: 'Referer', operation: 'remove' });
    const corsRule: browser.declarativeNetRequest.Rule = {
        id: 1,
        action: {
            type: 'modifyHeaders',
            responseHeaders: [
                { header: 'Access-Control-Allow-Origin', operation: 'set', value: location.origin },
                { header: 'Access-Control-Allow-Methods', operation: 'set', value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH' },
                { header: 'Access-Control-Allow-Headers', operation: 'set', value: '*' },
                { header: 'Access-Control-Allow-Credentials', operation: 'set', value: 'true' },
                { header: 'Set-Cookie', operation: 'remove' },
            ],
            ...(requestHeaders.length > 0 && { requestHeaders })
        },
        condition: {
            urlFilter: absoluteUrl,
            resourceTypes: ['xmlhttprequest'],
        }
    };

    let ruleId = null;

    try {
        ruleId = await portMessage('ENABLE_CORS_FOR_URL', { corsRule });
        return await globalThis.fetch(input, { ...init, headers: headersForNativeFetch });
    } finally {
        if (ruleId !== null) {
            portMessage('DISABLE_CORS_RULE', { ruleId }).catch(() => { });
        }
    }
}