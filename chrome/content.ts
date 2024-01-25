import { dispatchCustomEvent } from "./utils/dispatchcustomevent";
import { executeScript } from "./utils/executescript";
import { insertCSS } from "./utils/insertcss";

executeScript('index.js');
/** 会话网络规则集id */
const SessionRules = new Set<number>();
window.addEventListener(_MUTEX_, ev => {
    if (ev instanceof CustomEvent) {
        switch (ev.detail.data.$type) {
            case 'fetch': {
                chrome.runtime.sendMessage({
                    $type: 'fetch',
                    data: ev.detail.data
                }).then(data => {
                    if (data.err) { throw data.err }
                    dispatchCustomEvent(ev.detail.mutex, { data: data.data });
                }).catch(e => {
                    dispatchCustomEvent(ev.detail.mutex, { data: e, reject: true })
                });
                break;
            }
            case 'getValue': {
                chrome.storage.local.get().then(d => {
                    dispatchCustomEvent(ev.detail.mutex, { data: Reflect.has(d, ev.detail.data.key) ? d[ev.detail.data.key] : ev.detail.data.def });
                });
                break;
            }
            case 'setValue': {
                const obj: Record<string, string> = {};
                if (typeof ev.detail.data.key === 'string') {
                    obj[ev.detail.data.key] = ev.detail.data.value;
                    chrome.storage.local.set(obj);
                }
                break;
            }
            case 'deleteValue': {
                chrome.storage.local.remove(ev.detail.data.key);
                break;
            }
            case 'cookie': {
                chrome.runtime.sendMessage({
                    $type: 'cookie',
                    data: ev.detail.data.url
                }).then(data => {
                    if (data.err) { throw data.err }
                    dispatchCustomEvent(ev.detail.mutex, { data: data.data })
                }).catch(e => {
                    dispatchCustomEvent(ev.detail.mutex, { data: e, reject: true })
                });
                break;
            }
            case 'insertCSS': {
                try {
                    const url = chrome.runtime.getURL(ev.detail.data.file);
                    if (chrome.runtime.getURL(ev.detail.data.file)) {
                        ev.detail.data.urlonly || insertCSS(ev.detail.data.file);
                        dispatchCustomEvent(ev.detail.mutex, { data: url });
                    } else {
                        dispatchCustomEvent(ev.detail.mutex, { data: url, reject: true })
                    }
                } catch (e) {
                    dispatchCustomEvent(ev.detail.mutex, { data: e, reject: true })
                }
                break;
            }
            case 'executeScript': {
                try {
                    const url = chrome.runtime.getURL(ev.detail.data.file);
                    if (chrome.runtime.getURL(ev.detail.data.file)) {
                        ev.detail.data.urlonly || executeScript(ev.detail.data.file);
                        dispatchCustomEvent(ev.detail.mutex, { data: url });
                    } else {
                        dispatchCustomEvent(ev.detail.mutex, { data: url, reject: true })
                    }
                } catch (e) {
                    dispatchCustomEvent(ev.detail.mutex, { data: e, reject: true })
                }
                break;
            }
            case 'updateSessionRules': {
                chrome.runtime.sendMessage({
                    $type: "updateSessionRules",
                    data: ev.detail.data.rules,
                    tab: ev.detail.data.tab ?? true
                })
                    .then(data => dispatchCustomEvent(ev.detail.mutex, { data }))
                    .catch(e => {
                        dispatchCustomEvent(ev.detail.mutex, { data: e, reject: true });
                    });
                // 记录规则ID
                (<chrome.declarativeNetRequest.Rule[]>ev.detail.data.rules).forEach(d => {
                    SessionRules.add(d.id);
                })
                break;
            }
            case 'removeSessionRules': {
                chrome.runtime.sendMessage({
                    $type: "removeSessionRules",
                    data: ev.detail.data.ids
                });
                // 移除规则id
                (<number[]>ev.detail.data.ids).forEach(d => {
                    SessionRules.delete(d)
                })
                break;
            }
            default:
                break;
        }
    }
});
window.addEventListener("beforeunload", () => {
    const arr = Array.from(SessionRules);
    // DOM更新时清空已应用规则
    chrome.runtime.sendMessage({
        $type: "removeSessionRules",
        data: arr
    });
});

documentPictureInPicture?.addEventListener('enter', e => {
    if (documentPictureInPicture.window) {
        const url = chrome.runtime.getURL('/player/video.css');
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.href = url;
        documentPictureInPicture.window.document.head.appendChild(link);
    }
});