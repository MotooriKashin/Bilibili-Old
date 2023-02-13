import { GM as _ } from "@jsc/chrome/utils/gm";
import './gm';
import './polyfill/polyfill';

export { GM };
//////////////////////////// 全局定义 ////////////////////////////
declare global {
    const GM: typeof _;
}