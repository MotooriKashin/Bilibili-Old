/**
 * 本模块负责截除页面复制限制及右键锁  
 * 本模块代码参考自{@see Absolute Enable Right Click & Copy {@link https://chrome.google.com/webstore/detail/jdocbkpgdakpekjlhemmfcncgdjeiika}}
 */
(function () {
    try {
        API.addCss(`* {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }`);
        [].forEach.call(['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'], function (event) {
            document.addEventListener(event, function (e) {
                e.stopPropagation();
            }, true);
        });
    } catch (e) { API.trace(e, "user-select.js") }
})();