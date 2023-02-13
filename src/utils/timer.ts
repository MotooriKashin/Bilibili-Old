/**
 * 延时返回
 * @param value 返回值
 * @param time 延时：/ms
 */
export function timeout<T>(value: T, time = 0) {
    return new Promise((r: (value: T) => void) => {
        setTimeout(() => {
            r(value);
        }, time);
    })
}