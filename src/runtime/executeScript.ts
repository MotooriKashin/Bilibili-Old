import { isArray } from "./lib/typeof"

/**
 * 【内容脚本】注入静态脚本到页面上下文
 * @param path 扩展相对路径（序列）
 */
export function executeScript(path: string | string[]) {
    const arr = isArray(path) ? path : [path];
    chrome.runtime.sendMessage({
        $type: "executeScript",
        data: {
            world: "MAIN",
            files: arr,
            injectImmediately: true
        }
    })
}