/**
 * Invoker Commands API 的拓展定义。
 * 此定义包括 HTMLElementEventMap 的扩展。
 * @see https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API
 */


/**
 * 拓展 HTMLElementEventMap：注册 command 事件的类型映射
 * 作用：让 TypeScript 知道 'command' 事件对应 CommandEvent 对象
 * 影响范围：所有继承 HTMLElement 的元素（如 div、dialog、img 等）均自动支持
 */
interface HTMLElementEventMap {
    // 添加 command 事件映射：事件名 -> 事件对象类型
    command: CommandEvent;
}