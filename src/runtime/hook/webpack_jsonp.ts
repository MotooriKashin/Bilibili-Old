import { isArray } from "../lib/typeof.js";
import { API } from "../variable/variable.js";

/** 暂存 */
let hook: any;
const arr: Record<number, ((code: string) => typeof code)[]>[] = [];
const param: [string, string, string][] = [];
/** 备份已写入的分片数据，因为全局原生脚本可能启动比本脚本快，直接覆盖会出问题 */
let webpackJsonp = (<any>window).webpackJsonp;
Object.defineProperty(window, "webpackJsonp", {
    set: v => hook = v,
    get: () => {
        if (hook) {
            if (isArray(hook)) {
                // 新版页面如果写入了数据会导致重构的旧版页面出问题
                // 旧版页面分片不会大于1，直接弹出已有数据应该可以，不然还真不好处理，如何区分新旧版页面分片数据？
                if (API.rewrite && hook.length > 1) hook.shift();
                return hook;
            };
            return (chunkIds: any[], moreModules: any[], executeModules: any[]) => {
                if (arr[moreModules.length]) {
                    const obj = arr[moreModules.length];
                    const pam = param[moreModules.length];
                    Object.entries(obj).forEach(d => {
                        let code = moreModules[<any>d[0]];
                        if (code) {
                            code = code.toString();
                            d[1].forEach(e => code = e(code));
                            moreModules[<any>d[0]] = new Function(pam[0], pam[1], pam[2], `(${code})(${pam[0]},${pam[1]},${pam[2]})`);
                        }
                    })
                }
                return hook(chunkIds, moreModules, executeModules);
            }
        }
    },
    configurable: true
});
(<any>window).webpackJsonp = webpackJsonp;
/**
 * hook webpack打包的代码并进行修复
 * @param len 索引总长度，用于唯一定位该脚本
 * @param pos 要修复的代码所在索引
 * @param rpc 修复代码的回调函数，原代码以字符串形式传入，请修改后仍以字符串返回
 * @param params 源代码函数的参数名称序列
 */
export function webpackhook(len: number, pos: number, rpc: (code: string) => typeof code, params: [string, string, string] = ["t", "e", "i"]) {
    if (!arr[len]) {
        arr[len] = {};
        param[len] = params;
    }
    arr[len][pos] = arr[len][pos] || [];
    arr[len][pos].push((code: string) => rpc(code));
}