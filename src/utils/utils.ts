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