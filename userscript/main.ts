import { BLOD } from "@blod/blod";
import './gm';
import './polyfill/polyfill';
import { GM as GMC } from "@blod/extension/utils/gm";

new BLOD(GM);

//////////////////////////// 全局定义 ////////////////////////////
declare global {
    const GM: typeof GMC;
}