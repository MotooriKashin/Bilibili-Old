/**
 * 添加条件回调，条件为真时执行回调函数，用于检测函数运行时机  
 * @param check 一个返回布尔值的函数，用于轮询，当函数返回值为真时执行回调函数
 * @param callback 待执行的回调函数，check的返回值会作为参数传入
 * @param delay 轮询间隔：/ms，默认100ms
 * @param stop 轮询最大延时：/s，多长时间后终止轮询，不做无谓的等待，默认180s，即3分钟。为0时永不终止直到为真。
 */
export function doWhile<T>(check: () => T, callback: (tar: Exclude<T, null | false | undefined>) => void, delay: number = 100, stop: number = 180) {
    let timer = setInterval(() => {
        const d = check();
        if (d) {
            clearInterval(timer);
            callback(<Exclude<T, null | false | undefined>>d);
        }
    }, delay);
    stop && setTimeout(() => clearInterval(timer), stop * 1000)
}