/**
 * 本模块负责提供一些内置的可复用的HTMLEliment组件
 */
try {
    class ClickRemove {
        /**
         * 对一个节点添加监听，点击该节点之外的地方移除该节点
         * @param ele 目标节点
         */
        constructor(ele) {
            function remove() {
                ele.remove();
                document.removeEventListener("click", remove);
            }
            document.addEventListener("click", remove);
            ele.addEventListener("click", e => e.stopPropagation());
        }
    }
    class Element {
        /**
         * 弹出一个空白浮动窗口，点击该窗口外的节点该窗口会自动关闭
         * 浮动窗口上的内容请通过返回的节点进行后续添加
         * @returns 浮动窗口实际可操作节点，可以往上面添加需要显示在浮动窗口上的内容
         */
        static popupbox() {
            const box = API.addElement("div", { class: "ui-popup-box" });
            const real = box.attachShadow({ mode: "closed" });
            const div = API.addElement("div", { class: "box" }, real);
            const popup = API.addElement("div", { class: "contain" }, div);
            API.addCss(API.getModule("ui-popup-box.css"), undefined, real);
            new ClickRemove(box);
            return popup;
        }
    }
    API.element = {
        popupbox: () => Element.popupbox()
    };
}
catch (e) {
    API.trace(e, "element.js");
}
