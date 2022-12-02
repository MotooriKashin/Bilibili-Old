// XMLHttpRequest => fetch
GM.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    return new Promise((resolve: (value: Response) => void, reject) => {
        try {
            input = (<Request>input).url ? (<Request>input).url : <URL>input;
            // 正确处理相对路径
            input = new URL(input, location.origin).toJSON();
        } catch (e) {
            reject(e);
        }
        GM.xmlHttpRequest({
            url: <string>input,
            method: <any>init?.method,
            data: <any>init?.body,
            anonymous: init ? init.credentials === 'include' ? false : true : true,
            headers: <any>init?.headers,
            onload: xhr => {
                const response = new Response(xhr.response, { status: xhr.status, statusText: xhr.statusText });
                Object.defineProperties(response, {
                    url: { value: xhr.finalUrl }
                });
                resolve(response);
            },
            onerror: reject
        });
    });
}