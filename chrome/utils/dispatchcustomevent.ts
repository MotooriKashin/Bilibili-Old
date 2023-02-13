/**
 * 发起自定义事件
 * @param name 名称
 * @param detail 内容
 */
export function dispatchCustomEvent(name: string, detail?: any) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
}