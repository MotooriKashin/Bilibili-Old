interface modules {
    /** 右键解锁 */
    readonly "user-select.js": string;
}
namespace API {
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