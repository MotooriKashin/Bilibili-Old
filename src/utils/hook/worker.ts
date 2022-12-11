/** Worker.prototype.postMessage hook callback. */
type PostMessageCallback = (this: Worker, message: any, transfer: Transferable[]) => boolean;
export class WorkerHook {
    /** Worker.prototype.postMessage backup. */
    static postMessage: typeof Worker.prototype.postMessage;
    static postMessageCallback: PostMessageCallback[] = [];
    /** Worker.prototype.postMessage hook init. */
    static postMessageHook() {
        this.postMessage = Worker.prototype.postMessage;
        Worker.prototype.postMessage = <any>function (this: Worker, message: any, transfer: Transferable[]) {
            let ishook = false;
            WorkerHook.postMessageCallback.forEach(d => {
                d.call(this, message, transfer) && (ishook = true);
            });
            ishook || WorkerHook.postMessage.call(this, message, <any>transfer)
        }
    }
    constructor() {
        WorkerHook.postMessage || WorkerHook.postMessageHook();
    }
    /**
     * Worker.prototype.postMessage hook.
     * @param callback 检查并处理`Worker.prototype.postMessage`的回调函数，继承原传参，返回 **true** 时拦截该实例。
     * @returns 取消该hook的方法，执行后不再hook。
     */
    postMessage(callback: PostMessageCallback) {
        const id = WorkerHook.postMessageCallback.push(callback);
        return () => {
            id >= 0 && delete WorkerHook.postMessageCallback[id - 1];
        }
    }
}