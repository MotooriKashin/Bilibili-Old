/** 注入内容脚本 */
export function executeScript(files: string | string[]) {
    Array.isArray(files) || (files = [files]);
    chrome.runtime.sendMessage({
        $type: "executeScript",
        data: {
            world: "MAIN",
            files,
            injectImmediately: true
        }
    });
}