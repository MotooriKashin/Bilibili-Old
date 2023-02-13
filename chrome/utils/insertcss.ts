/** 注入样式 */
export function insertCSS(files: string | string[]) {
    Array.isArray(files) || (files = [files]);
    chrome.runtime.sendMessage({
        $type: "insertCSS",
        data: {
            files
        }
    });
}