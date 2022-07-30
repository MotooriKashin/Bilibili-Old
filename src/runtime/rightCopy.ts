import { addCss } from "./element/add_element";

/** 右键复制 */
export function rightCopyEnable() {
    addCss(`* {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
    }`);
    [].forEach.call(['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'], function (event) {
        document.addEventListener(event, function (e: any) {
            e.stopPropagation();
        }, true);
    });
}