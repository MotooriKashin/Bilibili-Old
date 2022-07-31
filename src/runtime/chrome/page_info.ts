/** 【后台脚本】获取页面信息 */
export function getPageInfo() {
    if (!(<any>window).pageInfoOnce) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (typeof message === "object") {
                switch (message.$type) {
                    case "downloadDefault":
                    case "localMedia":
                    case "onlineDanmaku":
                    case "allDanmaku":
                        window.postMessage(message)
                        break;
                }
            }
        });
        window.addEventListener("message", ev => {
            if (typeof ev.data === "object") {
                switch (ev.data.$type) {
                    case "pageInfoResponse":
                        chrome.runtime.sendMessage({
                            $type: "pageInfo",
                            data: ev.data.data
                        })
                        break;
                    default:
                }
            }
        });
    }
    (<any>window).pageInfoOnce = true;
    window.postMessage({
        $type: "getPageInfo"
    });
}