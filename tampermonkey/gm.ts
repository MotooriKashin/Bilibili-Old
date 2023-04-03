// XMLHttpRequest => fetch
GM.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    return new Promise((resolve: (value: Response) => void, reject) => {
        if (input instanceof Request) {
            input = input.url;
        } else if (input instanceof URL) {
            input = input.toJSON();
        }
        if (init?.body instanceof ArrayBuffer) {
            init.body = new Blob([init.body]);
        }
        input = new URL(input, location.href).toJSON();
        GM.xmlHttpRequest({
            url: input,
            method: <any>init?.method,
            data: <any>init?.body,
            anonymous: init ? init.credentials === 'include' ? false : true : true,
            headers: <any>init?.headers,
            responseType: 'arraybuffer',
            onload: ({ response, status, statusText, finalUrl, responseHeaders }) => {
                const headers = responseHeaders.replace(/\r/g, '').split('\n').reduce((s, d) => {
                    const arr = d.split(':');
                    arr[0] && (s[arr[0]] = arr[1] || '');
                    return s;
                }, <Record<string, string>>{});
                if (!response) return reject(statusText);
                const res = new Response(response, { status: status, statusText: statusText, headers });
                Object.defineProperties(res, {
                    url: { value: finalUrl }
                });
                resolve(res);
            },
            onerror: reject
        });
    });
}