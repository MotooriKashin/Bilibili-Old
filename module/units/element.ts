/**
 * 本模块负责提供一些内置的可复用的HTMLEliment组件
 */
(function () {
    try {
        class ClickRemove {
            /**
             * 对一个节点添加监听，点击该节点之外的地方移除该节点
             * @param ele 目标节点
             */
            constructor(ele: HTMLElement) {
                setTimeout(() => {
                    function remove() {
                        ele.remove();
                        document.removeEventListener("click", remove);
                    }
                    document.addEventListener("click", remove);
                    ele.addEventListener("click", e => e.stopPropagation());
                }, 100)
            }
        }
        class Element {
            /**
             * 弹出一个空白浮动窗口，点击该窗口外的节点该窗口会自动关闭  
             * 浮动窗口上的内容请通过返回的节点进行后续添加  
             * @param style 添加style样式，直接写进element，具有最高优先级
             * @param hold 禁用自动关闭，转而提供一个关闭按钮
             * @returns 浮动窗口实际可操作节点，可以往上面添加需要显示在浮动窗口上的内容
             */
            static popupbox(style: Partial<CSSStyleDeclaration> = {}, hold?: boolean) {
                const box = API.addElement("div", { class: "ui-popup-box" });
                const real = box.attachShadow({ mode: "closed" });
                const div = API.addElement("div", { class: "box" }, real);
                const popup = API.addElement("div", { class: "contain" }, div);
                API.addCss(API.getModule("ui-popup-box.css"), undefined, real);
                Object.keys(style).forEach(d => popup.style[d] = style[d]);
                hold ? this.close(div, box) : new ClickRemove(box);
                return <HTMLDivElement>popup;
            }
            /**
             * 添加关闭按钮
             * @param ele 按钮所在节点
             * @param box 点击按钮关闭的节点，不存在则取ele
             */
            static close(ele: HTMLElement, box?: HTMLElement) {
                const svg = this.svg('<svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#212121" stroke-linecap="round"></path></svg>');
                svg.setAttribute("style", "position: absolute;transform: scale(0.8);right: 10px;top: 10px;");
                svg.onclick = () => box ? box.remove() : ele.remove();
                ele.appendChild(svg);
            }
            /**
             * 封装hr标签，一条水平直线，一般用于隔断节点
             * @returns 封装好的节点
             */
            static hr() {
                const hr = document.createElement("div");
                const real = hr.attachShadow({ mode: "closed" });
                API.addElement("div", { class: "hr" }, real);
                API.addCss(API.getModule("hr.css"), undefined, real);
                return <HTMLDivElement>hr;
            }
            /**
             * 封装svg图标标签
             * @param svg svg节点字符串
             * @returns 封装好的节点
             */
            static svg(svg: string) {
                const root = document.createElement("div");
                const real = root.attachShadow({ mode: "closed" });
                API.addElement("div", { class: "icon" }, real, svg);
                API.addCss(API.getModule("icon.css"), undefined, real);
                return <HTMLDivElement>root;
            }
            /**
             * 封装好的滑块快关标签
             * @param callback 一个用于接收滑块开关响应的回调函数，必须，否则外部无法获取或响应开关状态
             * @param value 开关初始状态，非必须，默认为false
             * @returns 封装好的节点
             */
            static switch(callback: (this: HTMLDivElement, v: boolean) => void, value?: boolean) {
                const root = document.createElement("div");
                const real = root.attachShadow({ mode: "closed" });
                const div = API.addElement("div", {
                    class: "switch"
                }, real, `<span class="bar"></span>
            <span class="knob"><i class="circle"></i></span>`);
                API.addCss(API.getModule("switch.css"), undefined, real);
                value = value ? true : false;
                value && (div.children[0].setAttribute("checked", "checked"),
                    div.children[1].setAttribute("checked", "checked"),
                    div.children[1].children[0].setAttribute("checked", "checked"));
                div.onclick = () => {
                    value = !value;
                    value ? (div.children[0].setAttribute("checked", "checked"),
                        div.children[1].setAttribute("checked", "checked"),
                        div.children[1].children[0].setAttribute("checked", "checked")) : (
                        div.children[0].removeAttribute("checked"),
                        div.children[1].removeAttribute("checked"),
                        div.children[1].children[0].removeAttribute("checked"));
                    callback.call(div, value);
                }
                return root;
            }
            /**
             * 获取并整合内置Css模块
             * @param svg Css模块名序列
             * @returns 整合好的Css模块
             */
            static getCss(...svg: string[]) {
                return svg.reduce((s, d) => {
                    s += `\r\n${API.getModule(d)}`;
                    return s;
                }, "")
            }
            /**
             * 封装好的下拉列表标签（单选）
             * @param list 下拉表值组
             * @param callback 一个用于接收下拉选择响应的回调函数，必须，否则外部无法获取或响应选择状态
             * @param value 初始选定值
             * @returns 封装好的节点
             */
            static select(list: string[], callback: (this: HTMLDivElement, v: string) => void, value?: string) {
                const root = document.createElement("div");
                const real = root.attachShadow({ mode: "closed" });
                const div = API.addElement("div", { class: "select" }, real);
                const select = list.reduce((s, d) => {
                    API.addElement("option", {}, s, d);
                    return s;
                }, <HTMLSelectElement>API.addElement("select", {}, div));
                API.addCss(this.getCss("select.css"), undefined, real);
                select.value = value || select.options[0].text;
                select.onchange = () => callback.call(div, select.value);
                return root;
            }
            /**
             * 封装好的按钮标签
             * @param callback 响应按钮点击的回调函数，必须，否则无法响应按钮点击事件
             * @param text 按钮上的文字，默认为“确定”
             * @param disabled 点击按钮后的CD，单位：/s，默认为1，取0表示一直禁用
             * @returns 封装好的节点
             */
            static button(callback: (this: HTMLDivElement) => void, text?: string, disabled = 1) {
                const root = document.createElement("div");
                const real = root.attachShadow({ mode: "closed" });
                const div = API.addElement("div", { class: "button" }, real, text || "确定");
                API.addCss(this.getCss("button.css"), undefined, real);
                div.onclick = () => {
                    div.setAttribute("disabled", "disabled");
                    callback.call(div);
                    disabled && setTimeout(() => div.removeAttribute("disabled"), disabled * 1000);
                }
                return root;
            }
            /**
             * 封装好的输入框，响应回车事件
             * @param callback 响应输入确认的回调函数，必须，否则无法响应输入
             * @param text 输入框内默认数据，非必须
             * @param attribute input标签的标准属性，用于指定输入框类型等
             * @param pattern 检测输入的正则表达式，将过滤非法输入并弹出toast警告
             * @returns 封装好的节点
             */
            static input(callback: (this: HTMLInputElement, value: string) => void, text?: string, attribute?: input, pattern?: RegExp) {
                const root = document.createElement("div");
                const real = root.attachShadow({ mode: "closed" });
                const div = API.addElement("div", { class: "input" }, real);
                const input = <HTMLInputElement>API.addElement("input", {}, div);
                API.addCss(this.getCss("input.css"), undefined, real);
                attribute && Object.entries(attribute).forEach(d => { input.setAttribute(d[0], d[1]) });
                text && (input.value = text);
                input.onchange = () => {
                    if (pattern && !pattern.test(input.value)) return toast.warning(`值 ${input.value} 不符合要求！`, `正则表达式：${pattern.toString()}`);
                    callback.call(input, input.value);
                }
                return root;
            }
            /**
             * 封装好的文件选择按钮，特化版的输入框
             * @param callback 响应文件选择结果的回调函数，必须，否则无法响应文件选择
             * @param multiple 是否允许多选，默认为false
             * @param text 选择按钮上的文字，默认为“选择”
             * @param accept 指定文件类型拓展名组，不指定默认取所有类型文件
             * @returns 封装好的节点
             */
            static file(callback: (this: HTMLInputElement, value: FileList) => void, multiple?: boolean, text = "选择", accept?: string[]) {
                const root = document.createElement("div");
                const real = root.attachShadow({ mode: "closed" });
                const input = <HTMLInputElement>API.addElement("input", { type: "file", style: "width: 0;position: absolute;" }, real);
                accept && (input.accept = accept.join(","));
                multiple && (input.multiple = true);
                real.appendChild(this.button(() => input.click(), text, 0));
                input.onchange = () => input.files && callback.call(input, input.files);
                return root;
            }
            /**
             * 封装好的复选框（多选）
             * @param list 复选框的值组
             * @param callback 响应选择操作的回调函数，必须，否则无法响应文件选择
             * @param value list中的默认选中数据组，非必须
             * @returns 封装好的节点
             */
            static checkbox(list: string[], callback: (this: HTMLDivElement, value: string[]) => void, value: string[] = []) {
                const root = document.createElement("div");
                const real = root.attachShadow({ mode: "closed" });
                const div = API.addElement("div", { class: "box" }, real);
                API.addCss(this.getCss("checkbox.css"), undefined, real);
                const checkboxs = list.reduce((s: HTMLDivElement[], d) => {
                    s.push(<HTMLDivElement>API.addElement("div", { class: "checkbox" }, div, `<div class="checklabel">
                        <div class="disc-border"></div>
                        <div class="disc"></div>
                    </div>
                    <div class="checkvalue">${d}</div>`))
                    return s;
                }, [])
                const checks = list.reduce((s: boolean[], d) => {
                    s.push(value.includes(d))
                    return s;
                }, []);
                checkboxs.forEach((d, i) => {
                    checks[i] && (d.children[0].children[0].setAttribute("checked", "checked"),
                        d.children[0].children[1].setAttribute("checked", "checked"));
                    d.onclick = () => {
                        checks[i] = !checks[i];
                        checks[i] ? (d.children[0].children[0].setAttribute("checked", "checked"),
                            d.children[0].children[1].setAttribute("checked", "checked")) : (
                            d.children[0].children[0].removeAttribute("checked"),
                            d.children[0].children[1].removeAttribute("checked"));
                        callback.call(div, checks.reduce((s: string[], d, i) => { d && s.push(list[i]); return s; }, []));
                    }
                })
                return root;
            }
        }
        API.element = {
            popupbox: (style?: Partial<CSSStyleDeclaration>, hold?: boolean) => Element.popupbox(style, hold),
            hr: () => Element.hr(),
            svg: (svg: string) => Element.svg(svg),
            switch: (callback: (v: boolean) => void, value?: boolean) => Element.switch(callback, value),
            select: (list: string[], callback: (this: HTMLDivElement, v: string) => void, value?: string) => Element.select(list, callback, value),
            button: (callback: (this: HTMLDivElement) => void, text?: string, disabled?: number) => Element.button(callback, text, disabled),
            input: (callback: (this: HTMLInputElement, value: string) => void, text?: string, attribute?: input, pattern?: RegExp) => Element.input(callback, text, attribute, pattern),
            file: (callback: (this: HTMLInputElement, value: FileList) => void, multiple?: boolean, text?: string, accept?: string[]) => Element.file(callback, multiple, text, accept),
            checkbox: (list: string[], callback: (this: HTMLDivElement, value: string[]) => void, value?: string[]) => Element.checkbox(list, callback, value)
        }
        API.getCss = (...svg: string[]) => Element.getCss(...svg);
    } catch (e) { API.trace(e, "element.js", true) }
})();
declare namespace API {
    let element: {
        /**
         * 弹出一个空白浮动窗口，点击该窗口外的节点该窗口会自动关闭
         * 浮动窗口上的内容请通过返回的节点进行后续添加
         * @returns 浮动窗口实际可操作节点，可以往上面添加需要显示在浮动窗口上的内容
         */
        popupbox(style?: Partial<CSSStyleDeclaration>, hold?: boolean): HTMLDivElement;
        /**
         * 封装hr标签，一条水平直线，一般用于隔断节点
         * @returns 封装好的节点
         */
        hr(): HTMLDivElement;
        /**
         * 封装svg图标标签
         * @param svg svg节点字符串
         * @returns 封装好的节点
         */
        svg(svg: string): HTMLDivElement;
        /**
         * 封装好的滑块快关标签
         * @param callback 一个用于接收滑块开关响应的回调函数，必须，否则外部无法获取或响应开关状态
         * @param value 开关初始状态，非必须，默认为false
         * @returns 封装好的节点
         */
        switch(callback: (this: HTMLDivElement, v: boolean) => void, value?: boolean): HTMLDivElement;
        /**
         * 封装好的下拉列表标签（单选）
         * @param list 下拉表值组
         * @param callback 一个用于接收下拉选择响应的回调函数，必须，否则外部无法获取或响应选择状态
         * @param value 初始选定值
         * @returns 封装好的节点
         */
        select(list: string[], callback: (this: HTMLDivElement, v: string) => void, value?: string): HTMLDivElement;
        /**
         * 封装好的按钮标签
         * @param callback 响应按钮点击的回调函数，必须，否则无法响应按钮点击事件
         * @param text 按钮上的文字，默认为“确定”
         * @param disabled 点击按钮后的CD，单位：/s，默认为1，取0表示一直禁用
         * @returns 封装好的节点
         */
        button(callback: (this: HTMLDivElement) => void, text?: string, disabled?: number): HTMLDivElement;
        /**
         * 封装好的输入框，响应回车事件
         * @param callback 响应输入确认的回调函数，必须，否则无法响应输入
         * @param text 输入框内默认数据，非必须
         * @param attribute input标签的标准属性，用于指定输入框类型等
         * @param pattern 检测输入的正则表达式，将过滤非法输入并弹出toast警告
         * @returns 封装好的节点
         */
        input(callback: (this: HTMLInputElement, value: string) => void, text?: string, attribute?: input, pattern?: RegExp): HTMLDivElement;
        /**
         * 封装好的文件选择按钮，特化版的输入框
         * @param callback 响应文件选择结果的回调函数，必须，否则无法响应文件选择
         * @param multiple 是否允许多选，默认为false
         * @param text 选择按钮上的文字，默认为“选择”
         * @param accept 指定文件类型拓展名组，不指定默认取所有类型文件
         * @returns 封装好的节点
         */
        file(callback: (this: HTMLInputElement, value: FileList) => void, multiple?: boolean, text?: string, accept?: string[]): HTMLDivElement;
        /**
         * 封装好的复选框（多选）
         * @param list 复选框的值组
         * @param callback 响应选择操作的回调函数，必须，否则无法响应文件选择
         * @param value list中的默认选中数据组，非必须
         * @returns 封装好的节点
         */
        checkbox(list: string[], callback: (this: HTMLDivElement, value: string[]) => void, value?: string[]): HTMLDivElement;
    }
    /**
     * 获取并整合合内置Css模块
     * @param svg Css模块名序列
     * @returns 整合好的Css模块
     */
    function getCss(...svg: string[]): string
}