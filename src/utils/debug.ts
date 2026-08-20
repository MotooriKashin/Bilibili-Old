import { durationFormat } from "./time";

function sign() {
    return `\x1B[38;2;0;255;0;1m[${durationFormat({ milliseconds: Math.floor(performance.now()) })}]\x1B[m`;
}

export function debug(..._data: any[]) {
    Promise.resolve().finally(console.debug.bind(console, sign(), ...arguments));
}

export function log(..._data: any[]) {
    Promise.resolve().finally(console.log.bind(console, sign(), ...arguments));
}

export function warn(..._data: any[]) {
    Promise.resolve().finally(console.warn.bind(console, sign(), ...arguments))
}

export function error(..._data: any[]) {
    Promise.resolve().finally(console.error.bind(console, sign(), ...arguments));
}