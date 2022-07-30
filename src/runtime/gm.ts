import { mutex } from "./variable/mutex";

/** xmlHttpRequest栈 */
const xhrGM: [(value: string) => void, (reason?: any) => void][] = [];
/** getValue栈 */
const getValue: [(value: any) => void, (reason?: any) => void][] = [];
/** cookies栈 */
const cookiesEs: [(value: chrome.cookies.Cookie[]) => void, (reason?: any) => void][] = [];
// 内容脚本回调
window.addEventListener("message", ev => {
    // 用户脚本兼容
    if (GM_getValue) return GM_getValue("config");
    if (typeof ev.data === "object" && ev.data.flag === mutex) {
        switch (ev.data.$type) {
            case "xhrGMResponse":
                if (xhrGM[ev.data.index]) {
                    Reflect.has(ev.data, "resolve") && xhrGM[ev.data.index][0](ev.data.resolve);
                    Reflect.has(ev.data, "reject") && xhrGM[ev.data.index][1](ev.data.reject);
                    delete xhrGM[ev.data.index];
                }
                break;
            case "getValueResponse":
                if (getValue[ev.data.index]) {
                    Reflect.has(ev.data, "resolve") && getValue[ev.data.index][0](ev.data.resolve);
                    Reflect.has(ev.data, "reject") && getValue[ev.data.index][1](ev.data.reject);
                    delete getValue[ev.data.index];
                }
                break;
            case "cookiesResponse":
                if (cookiesEs[ev.data.index]) {
                    Reflect.has(ev.data, "resolve") && cookiesEs[ev.data.index][0](ev.data.resolve);
                    Reflect.has(ev.data, "reject") && cookiesEs[ev.data.index][1](ev.data.reject);
                    delete cookiesEs[ev.data.index];
                }
                break;
        }
    }
})
export const GM = {
    /** 跨域请求 */
    xmlHttpRequest(input: URL | RequestInfo, init?: RequestInit | undefined) {
        return new Promise((resolve: (value: string) => void, reject) => {
            window.postMessage({
                $type: "xhrGM",
                data: {
                    index: xhrGM.push([resolve, reject]) - 1,
                    input,
                    init,
                    flag: mutex
                }
            })
        });
    },
    /** 读取存储 */
    getValue(key: string, def?: any) {
        return new Promise((resolve: (value: any) => void, reject) => {
            window.postMessage({
                $type: "getValue",
                data: {
                    index: getValue.push([resolve, reject]) - 1,
                    key,
                    def,
                    flag: mutex
                }
            })
        });
    },
    /** 储存数据 */
    setValue(key: string, value: any) {
        const obj: Record<string, any> = {};
        obj[key] = value;
        window.postMessage({
            $type: "setValue",
            data: obj
        })
    },
    /** 删除存储 */
    deleteValue(...key: string[]) {
        window.postMessage({
            $type: "setValue",
            data: key
        })
    },
    /** 获取cookie */
    cookie() {
        return new Promise((resolve: (value: chrome.cookies.Cookie[]) => void, reject) => {
            const host = location.host;
            const arr = host.split(".");
            arr.length > 2 && arr.shift();
            window.postMessage({
                $type: "getCookies",
                data: {
                    url: arr.join("."),
                    index: cookiesEs.push([resolve, reject]) - 1,
                    flag: mutex
                }
            })
        })
    }
}