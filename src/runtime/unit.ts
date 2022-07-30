import { loadScript } from "./element/add_element";

/**
 * 检查B站json接口返回值并格式化为json  
 * 对于code异常将直接抛出错误！
 * @param data B站接口的response
 * @returns 格式化后的json
 */
export function jsonCheck(data: string | Record<string, any>) {
    let result: Record<string, any> = typeof data === "string" ? JSON.parse(data) : data;
    if ("code" in result && result.code !== 0) {
        let msg = result.msg || result.message || "";
        throw [result.code, msg];
    }
    return result;
}
/**
 * 节点到页面顶部的距离
 * @param node 目标节点
 * @returns 距离：/px
 */
export function getTotalTop(node: HTMLElement) {
    var sum = 0;
    do {
        sum += node.offsetTop;
        node = <HTMLElement>node.offsetParent;
    }
    while (node);
    return sum;
}
/**
 * 拉起B站快捷登录面板
 */
export function biliQuickLogin() {
    (<any>window).biliQuickLogin ? (<any>window).biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => biliQuickLogin());
}
/**
 * 从url中提取指定参数
 * @param name 参数名
 * @returns 参数值，不存在返回null
 */
export function getUrlValue(name: string) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}
/** 检查xhr.status是否符合正常 */
export function statusCheck(status: number) {
    return (status >= 200 && status < 300) || status === 304
}