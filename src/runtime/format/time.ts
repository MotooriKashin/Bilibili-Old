import { integerFormat } from "./integer.js";

/**
 * 格式化时间
 * @param time 时间戳（13位）
 * @param type 是否包含年月日
 * @returns 时:分:秒 | 年-月-日 时:分:秒
 * @example
 * timeFormat() // 00:00:00
 * timeFormat(0, true) // 1970-1-1 08:00:00
 */
export function timeFormat(time: number = new Date().getTime(), type?: boolean) {
    const date = new Date(time);
    const arr = date.toLocaleString().split(" ");
    const day = arr[0].split("/");
    day[1] = <string>integerFormat(<any>day[1], 2);
    day[2] = <string>integerFormat(<any>day[2], 2);
    return type ? day.join("-") + " " + arr[1] : arr[1];
}
/**
 * 格式化秒数
 * @param second 秒数
 * @returns hh: mm: ss
 * @example
 * s2hms(60) // 1:00
 */
export function s2hms(second: number) {
    const s = second % 60;
    let m = parseInt(String(second / 60));
    const h = parseInt(String(m / 60));
    m = m % 60;
    return (h > 0 ? h + ":" : "") + (h > 0 || m > 0 ? (Array(2).join('0') + m).slice(-2) + ":" : "") + (Array(2).join('0') + s).slice(-2);
}
/**
 * 相对当前时间
 * @param time 时间戳
 * @returns 相对时间
 */
export function timePass(time: number) {
    time >= 1e11 && (time = Math.floor(time / 1e3));
    const now = Math.floor((new Date).getTime() / 1e3);
    let t: any = new Date;
    if (t.setHours(0), t.setMinutes(0), t.setSeconds(0), (t = Math.floor(t.getTime() / 1e3)) < time && 0 <= now - time) {
        if (now - time <= 50) {
            var r = 10 * Math.floor((now - time) % 60 / 10);
            return (10 < time ? r : 10) + "秒前"
        }
        return now - time < 3600 ? Math.floor((now - time) / 60) + "分钟前" : Math.floor((now - time) / 3600) + "小时前"
    }
    return timeFormat(time * 1e3, true);
}
