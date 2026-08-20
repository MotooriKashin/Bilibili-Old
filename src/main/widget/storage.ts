import { port } from "../../utils/bridge";

function request<T>(method: string, ...args: any[]) {
    return new Promise((resolve: (value: T) => void, reject) => {
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

        port.postMessage({
            id,
            type: 'STORAGE_CALL',
            payload: { method, args }
        });
    });
}

/**
 * 获取存储的指定key的值。
 * 代理的 chrome.storage API。
 * @param key 存储用的key
 * @returns 存储的值
 * @example
 * await getItem('bilibili'); // 结果：123
 */
export async function getItem<T>(key: string) { return request<T>('getItem', key); }
/**
 * 设置或更新存储的指定key的值。
 * 代理的 chrome.storage API。
 * @param key 存储用的key
 * @param val 存储的值
 * @example
 * await setItem('bilibili', 123); // 无返回值
 */
export async function setItem<T>(key: string, val: T) { return request<void>('setItem', key, val); }
/**
 * 删除存储的指定key的值。
 * 代理的 chrome.storage API。
 * @param key 存储用的key
 * @example
 * await removeItem('bilibili'); // 无返回值
 */
export async function removeItem(key: string) { return request<void>('removeItem', key); }
/**
 * 清除所有存储。
 * 代理的 chrome.storage API。
 * @example
 * await clear(); // 无返回值
 */
export async function clear() { return request<void>('clear'); }