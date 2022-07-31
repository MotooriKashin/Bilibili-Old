import { debug } from "../debug.js";
import { doWhile } from "../do_while";

/** 特殊键盘事件 */
interface keySpecial {
    /** Alt */
    altKey: boolean;
    /** Ctrl */
    ctrlKey: boolean;
    /** Windows/Command */
    metaKey: boolean;
    /** 长按 */
    repeat: boolean;
    /** Shift */
    shiftKey: boolean;
}
/** 回调事件栈 */
const bindMap: Record<string, (Partial<keySpecial> & {
    /** 回调函数 */
    callback: () => void;
    /** 禁止回调 */
    disable: boolean;
})[]> = {};
/** 是否输入中 */
const isTyping = () => {
    const { activeElement } = document;
    if (!activeElement) {
        return false
    }
    if (activeElement.hasAttribute('contenteditable')) {
        return true
    }
    return ['input', 'textarea'].includes(activeElement.nodeName.toLowerCase())
}
doWhile(() => document.body, d => {
    d.addEventListener("keydown", e => {
        if (isTyping()) return;
        const key = e.key.toLowerCase();
        e.key && bindMap[key] && bindMap[key].forEach(d => {
            let disable = d.disable;
            (Number(d.altKey) ^ Number(e.altKey)) && (disable = true);
            (Number(d.ctrlKey) ^ Number(e.ctrlKey)) && (disable = true);
            (Number(d.metaKey) ^ Number(e.metaKey)) && (disable = true);
            (Number(d.repeat) ^ Number(e.repeat)) && (disable = true);
            (Number(d.shiftKey) ^ Number(e.shiftKey)) && (disable = true);
            try {
                !disable && d.callback();
            } catch (e) { debug.error("keymap.js", e) }
        });
    });
})
/**
 * 注册键盘输入监听
 * @param key 标准按键名（不区分大小写）
 * @param callback 回调函数
 * @param special 附加条件，如长按（长按事件可能会对此触发，请正确添加回调函数以免重复操作）、Ctrl激活等。
 * @returns 用于禁用事件监听的函数，参数表示是否禁用，不传递参数将根据当前状态进行反操作。
 */
export function bindKeyMap(key: string, callback: () => void, special: Partial<keySpecial> = {}) {
    const keyl = key.toLowerCase();
    const map = Object.assign(special, { callback, disable: false });
    bindMap[keyl] ? bindMap[keyl].push(map) : bindMap[keyl] = [map];
    /**
     * 用于禁用事件监听的函数
     * @param bind 是否禁用，不传递时将根据当前状态进行反操作。
     */
    return function changeKeyMap(disable?: boolean) {
        if (arguments.length) {
            map.disable = <boolean>disable;
        } else {
            map.disable = !map.disable;
        }
    }
}