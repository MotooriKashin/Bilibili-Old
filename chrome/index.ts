export { GM } from "./utils/gm";


//////////////////////////// 全局定义 ////////////////////////////
declare global {
    /** 脚本编译时生成的唯一标记，用于唯一标志脚本身份 */
    const _MUTEX_: string;
    const _UserScript_: string;
}