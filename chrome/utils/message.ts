/**
 * 发送数据到到拓展
 * @param data 要发送的数据，必须是JSON-serializable的
 * @param resolve 数据返回的回调
 * @param reject 出错时的回调
 */
export function postMessage(data: any, resolve?: Function, reject: Function = () => { }) {
    const mutex = Math.random().toString(36).substring(2);
    if (resolve && typeof resolve === "function") {
        window.addEventListener(mutex, (ev) => {
            if (typeof (<CustomEvent>ev).detail === "object") {
                (<CustomEvent>ev).detail.reject ? reject((<CustomEvent>ev).detail.data) : resolve((<CustomEvent>ev).detail.data);
                ev.stopImmediatePropagation();
            }
        }, { once: true });
    }
    window.dispatchEvent(new CustomEvent(_MUTEX_, { detail: JSON.parse(JSON.stringify({ mutex, data })) }));
}