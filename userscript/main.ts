import { BLOD } from "@blod/blod";
import { GM as GMC } from "@blod/extension/utils/gm";
import './gm';
import './polyfill/polyfill';

new BLOD(GM);

//////////////////////////// 全局定义 ////////////////////////////
declare global {
    const GM: typeof GMC;
}