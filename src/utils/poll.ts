/**
 * 轮询以执行回调函数
 * @param check 轮询条件（一个Boolean类型返回值的函数）
 * @param callback 真值回调
 * @param delay 轮询间隔：/ms，默认100ms
 * @param stop 轮询最大延时：/s，默认180s，即3分钟。为0时永不终止直到为真。
 */
export function poll<T>(check: () => T, callback: (tar: Exclude<T, null | false | undefined>) => void, delay: number = 100, stop: number = 180) {
    let timer = setInterval(() => {
        const d = check();
        if (d) {
            clearInterval(timer);
            callback(<Exclude<T, null | false | undefined>>d);
        }
    }, delay);
    stop && setTimeout(() => clearInterval(timer), stop * 1000)
}