import { port } from "../utils/bridge";

// 代理来自MAIN世界的请求
port.onmessage = async (event) => {
    const { id, type, payload } = event.data;
    if (!id) return;

    switch (type) {
        case 'STORAGE_CALL': {
            // --- 1. Storage API 处理 ---
            const { method, args } = payload;
            try {
                let result;
                if (method === 'getItem') {
                    const data = await chrome.storage.local.get(args[0]);
                    result = data[args[0]];
                } else if (method === 'setItem') {
                    await chrome.storage.local.set({ [args[0]]: args[1] });
                } else if (method === 'removeItem') {
                    await chrome.storage.local.remove(args[0]);
                } else if (method === 'clear') {
                    await chrome.storage.local.clear();
                }
                port.postMessage({ id, result });
            } catch (err: any) {
                port.postMessage({ id, error: err.message });
            }
            break;
        }
        case 'ENABLE_CORS_FOR_URL':
        case 'DISABLE_CORS_RULE':
        case 'SIDE_PANEL_SET_OPTIONS': {
            // --- 2. DNR 与 Fetch 等扩展 API 消息透传 ---
            try {
                const response = await chrome.runtime.sendMessage({ type, payload });
                port.postMessage({ id, result: response });
            } catch (err: any) {
                port.postMessage({ id, error: err.message });
            }
            break;
        }
    }
};

browser.runtime.onConnect.addListener(connect => {
    if (connect.name === 'sidePanel') {
        const abortController = new AbortController();
        connect.onDisconnect.addListener(() => { abortController.abort() });
        port.when('message').subscribe(event => {
            const { type, payload } = event.data;
            switch (type) {
                case 'ONLINE_NUMBER': {
                    connect.postMessage({ type, payload });
                    break
                }
            }
        }, { signal: abortController.signal });
        port.start();
        port.postMessage({ type: 'SIDE_PANEL_CONNECT' });

        connect.onMessage.addListener(message => {
            port.postMessage(message);
        });
    }
});