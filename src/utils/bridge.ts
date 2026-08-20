import { md5 } from "./md5";

const SYMBOL_KEY = md5(location.href);
const HANDSHAKE_ACTION = '__CHROME_EXT_BRIDGE_HANDSHAKE__';

async function establishPort() {
    let channelId = sessionStorage.getItem(SYMBOL_KEY);

    if (!channelId) {
        // ---------------------------------------------------------------
        // 角色 A：先到者 (Receiver / 充当监听端)
        // ---------------------------------------------------------------
        channelId = crypto.randomUUID();

        sessionStorage.setItem(SYMBOL_KEY, channelId);

        const { promise, resolve } = Promise.withResolvers<MessagePort>();

        const abortController = new AbortController();
        when('message').subscribe(({ source, data, ports }) => {
            // 1. 只响应来自于同一 window 且匹配当前 channelId 的握手消息
            if (source !== window) return;

            if (data && data.action === HANDSHAKE_ACTION && data.channelId === channelId) {
                // 2. 获取转移进来的 MessagePort
                if (ports && ports[0]) {
                    const port = ports[0];

                    // 3. 握手成功，清理事件监听与临时全局属性
                    abortController.abort();
                    sessionStorage.removeItem(SYMBOL_KEY);

                    resolve(port);
                }
            }
        }, { signal: abortController.signal });

        return promise;
    } else {
        // ---------------------------------------------------------------
        // 角色 B：后到者 (Initiator / 充当发起端)
        // ---------------------------------------------------------------
        // 1. 创建全新的 MessageChannel
        const channel = new MessageChannel();

        // 2. 通过 postMessage 将 port2 转移给先到者 (第3个参数为 Transferable 数组)
        postMessage(
            {
                action: HANDSHAKE_ACTION,
                channelId: channelId
            },
            '*',
            [channel.port2] // 必须在这里转移 MessagePort！
        );

        // 3. 握手发起完成，清理标记
        sessionStorage.removeItem(SYMBOL_KEY);

        // 4. 返回属于自己的 port1
        return channel.port1;
    }
}

// Top-Level Await 导出构建完成的端口

/**
 * `MAIN`世界与`ISOLATED`世界相互通信的`MessagePort`。
 * 安全，高效，开箱即用！
 */
export const port = await establishPort();

/**
 * `MAIN`世界与`ISOLATED`世界相互通信 promise 封装
 * 
 * @param type 消息类型标志
 * @param payload 消息内容
 */
export function portMessage(type: string, payload: any) {
    return new Promise((resolve: (value: any) => void, reject) => {
        const id = crypto.randomUUID();

        const abortController = new AbortController();
        port.when('message').subscribe(({ data }) => {
            if (data && data.id === id) {
                abortController.abort();
                const { result, error } = data;
                if (error) reject(new Error(error));
                else resolve(result);
            }
        }, { signal: abortController.signal });
        port.start();

        port.postMessage({ id, type, payload });
    });
}