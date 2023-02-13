import { dispatchCustomEvent } from "./utils/dispatchcustomevent";
import { executeScript } from "./utils/executescript";
import { insertCSS } from "./utils/insertcss";
import { sendSessionRules } from "./utils/session-rule";

executeScript('index.js');

window.addEventListener(_MUTEX_, ev => {
    if (typeof (<CustomEvent>ev).detail.data === "object") {
        switch ((<CustomEvent>ev).detail.data.$type) {
            case 'xmlHttpRequest':
                chrome.runtime.sendMessage({
                    $type: 'xmlHttpRequest',
                    data: (<CustomEvent>ev).detail.data
                }).then(data => {
                    if (data.err) { throw data.err }
                    dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: data.data });
                }).catch(e => {
                    dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: e, reject: true })
                });
                break;
            case 'getValue':
                chrome.storage.local.get().then(d => {
                    dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: Reflect.has(d, (<CustomEvent>ev).detail.data.key) ? d[(<CustomEvent>ev).detail.data.key] : (<CustomEvent>ev).detail.data.def });
                });
                break;
            case 'setValue':
                const obj: Record<string, string> = {};
                if (typeof (<CustomEvent>ev).detail.data.key === 'string') {
                    obj[(<CustomEvent>ev).detail.data.key] = (<CustomEvent>ev).detail.data.value;
                    chrome.storage.local.set(obj);
                }
                break;
            case 'deleteValue':
                chrome.storage.local.remove((<CustomEvent>ev).detail.data.key);
                break;
            case 'cookie':
                chrome.runtime.sendMessage({
                    $type: 'cookie',
                    data: (<CustomEvent>ev).detail.data.url
                }).then(data => {
                    if (data.err) { throw data.err }
                    dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: data.data })
                }).catch(e => {
                    dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: e, reject: true })
                });
                break;
            case 'insertCSS':
                try {
                    const url = chrome.runtime.getURL((<CustomEvent>ev).detail.data.file);
                    if (chrome.runtime.getURL((<CustomEvent>ev).detail.data.file)) {
                        (<CustomEvent>ev).detail.data.urlonly || insertCSS((<CustomEvent>ev).detail.data.file);
                        dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: url });
                    } else {
                        dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: url, reject: true })
                    }
                } catch (e) {
                    dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: e, reject: true })
                }
                break;
            case 'executeScript':
                try {
                    const url = chrome.runtime.getURL((<CustomEvent>ev).detail.data.file);
                    if (chrome.runtime.getURL((<CustomEvent>ev).detail.data.file)) {
                        (<CustomEvent>ev).detail.data.urlonly || executeScript((<CustomEvent>ev).detail.data.file);
                        dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: url });
                    } else {
                        dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: url, reject: true })
                    }
                } catch (e) {
                    dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: e, reject: true })
                }
                break;
            case 'updateSessionRules':
                sendSessionRules((<CustomEvent>ev).detail.data.rules)
                    .then(data => dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data }))
                    .catch(e => {
                        dispatchCustomEvent((<CustomEvent>ev).detail.mutex, { data: e, reject: true });
                    })
                break;
            default:
                break;
        }
    }
});
window.addEventListener("beforeunload", () => {
    sendSessionRules(); // DOM更新时清空已应用规则
});