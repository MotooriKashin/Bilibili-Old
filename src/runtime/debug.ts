import { timeFormat } from "./format/time.js";

/** 分组标记 */
const group = {
    /** 分组层次 */
    i: 0,
    /** 分组栈 */
    call: <any[]>[]
};
/** console的封装，可链式调用 */
export function debug(...data: any[]) {
    group.call.push(console.log.bind(console, `%c[${timeFormat()}]`, "color: blue;", ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
}
debug.assert = function (condition?: boolean, ...data: any[]) {
    group.call.push(console.assert.bind(console, `[${timeFormat()}]`, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
}
debug.clear = function () {
    group.i = 0;
    group.call = [];
    setTimeout(console.clear.bind(console));
    return debug;
}
debug.debug = function (...data: any[]) {
    group.call.push(console.debug.bind(console, `[${timeFormat()}]`, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
}
debug.error = function (...data: any[]) {
    group.call.push(console.error.bind(console, `[${timeFormat()}]`, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
}
debug.group = function (...data: any[]) {
    group.i++;
    group.call.push(console.group.bind(console, `[${timeFormat()}]`, ...arguments));
    return debug;
}
debug.groupCollapsed = function (...data: any[]) {
    group.i++;
    group.call.push(console.groupCollapsed.bind(console, `[${timeFormat()}]`, ...arguments));
    return debug;
}
debug.groupEnd = function () {
    if (group.i) {
        group.i--;
        group.call.push(console.groupEnd.bind(console));
        !group.i && (group.call.push(() => group.call = []), group.call.forEach(d => setTimeout(d)));
    }
    return debug;
}
debug.info = function (...data: any[]) {
    group.call.push(console.info.bind(console, `%c[${timeFormat()}]`, "color: blue;", ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
}
debug.log = function (...data: any[]) {
    group.call.push(console.log.bind(console, `%c[${timeFormat()}]`, "color: blue;", ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
}
debug.table = function (tabularData?: any, properties?: string[]) {
    group.call.push(console.table.bind(console, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
}
debug.time = function (label?: string) {
    console.time(label);
    return debug;
}
debug.timeEnd = function (label?: string) {
    console.timeEnd(label);
    return debug;
}
debug.timeLog = function (label?: string, ...data: any[]) {
    console.timeLog(label, `[${timeFormat()}]`, ...data);
    return debug;
}
debug.trace = function (...data: any[]) {
    group.call.push(console.trace.bind(console, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
}
debug.warn = function (...data: any[]) {
    group.call.push(console.warn.bind(console, `[${timeFormat()}]`, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
}