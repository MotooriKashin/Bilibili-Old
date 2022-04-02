interface modules {
    /**
     * 各种工具函数
     */
    readonly "units.js": string;
    readonly "alert.css": string;
    readonly "button.css": string;
}
namespace API {
    /**
     * 代理退出登录功能
     * @param referer 退出后跳转的页面URL
     */
    export async function loginExit(referer?: string) {
        if (!uid) return toast.warning("本就未登录，无法退出登录！");
        toast.warning("正在退出登录...");
        let data = jsonCheck(await xhr({
            url: "https://passport.bilibili.com/login/exit/v2",
            data: `biliCSRF=${getCookies().bili_jct}&gourl=${encodeURIComponent(location.href)}`,
            method: "POST",
            credentials: true
        }))
        if (data.status) {
            toast.success("退出登录！");
            if (referer) return location.replace(referer);
            setTimeout(() => location.reload(), 1000);
        }
    }
    /**
     * 检查B站json接口返回值并格式化为json  
     * 对于code异常将直接抛出错误！
     * @param data B站接口的response
     * @returns 格式化后的json
     */
    export function jsonCheck(data: string | Record<string, any>) {
        let result: Record<string, any> = typeof data === "string" ? JSON.parse(data) : data;
        if ("code" in result && result.code !== 0) {
            let msg = result.msg || result.message || "";
            throw [result.code, msg];
        }
        return result;
    }
    /**
     * 拉起B站快捷登录面板
     */
    export function biliQuickLogin() {
        (<any>window).biliQuickLogin ? (<any>window).biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => biliQuickLogin());
    }
    /**
     * 加载外源脚本  
     * 支持加载完成后执行回调函数或者返回Promise
     * @param src 外源脚本url
     * @param onload 加载完成后的回调函数
     */
    export function loadScript(src: string, onload?: () => void) {
        return new Promise((r, j) => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", () => {
                script.remove();
                onload && onload();
                r(true);
            });
            script.addEventListener('error', () => j());
            document.body.appendChild(script);
        });
    }
    /**
     * 节点到页面顶部的距离
     * @param node 目标节点
     * @returns 距离：/px
     */
    export function getTotalTop(node: HTMLElement) {
        var sum = 0;
        do {
            sum += node.offsetTop;
            node = <HTMLElement>node.offsetParent;
        }
        while (node);
        return sum;
    }
    /**
     * 从url中提取指定参数
     * @param name 参数名
     * @returns 参数值，不存在返回null
     */
    export function getUrlValue(name: string) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;
    }
    const aids: Record<number, any> = {};
    /**
     * 获取aid的信息，无效aid除外
     * @param aid aid
     */
    export async function getAidInfo(aid: number) {
        if (!aids[aid]) {
            const data = await xhr({
                url: `https://api.bilibili.com/x/web-interface/view/detail?aid=${aid}`,
                responseType: "json",
                credentials: true
            })
            aids[aid] = data.data;
        }
        return aids[aid];
    }
    /**
     * 求utf-8字符串字节数，一般用于求文件大小。
     * @param str utf-8字符串（js默认字符串格式）
     * @returns 字节数
     */
    export function strSize(str: string) {
        let size = 0;
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code <= 0x007f) size++;
            else if (code <= 0x07ff) size += 2;
            else if (code <= 0xffff) size += 3;
            else size += 4;
        }
        return size;
    }
    /**
     * 添加css样式
     * @param txt css文本
     * @param id 样式ID，用于唯一标记
     * @param parrent 添加到的父节点，默认为head
     */
    export async function addCss(txt: string, id?: string, parrent?: Node) {
        if (!parrent && !document.head) {
            await new Promise(r => runWhile(() => document.body, r));
        }
        parrent = parrent || document.head;
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        id && !(<HTMLElement>parrent).querySelector(`#${id}`) && style.setAttribute("id", id);
        style.appendChild(document.createTextNode(txt));
        parrent.appendChild(style);
    }
    /**
     * 创建HTML节点
     * @param tag 节点名称
     * @param attribute 节点属性对象
     * @param parrent 添加到的父节点，默认为body
     * @param innerHTML 节点的innerHTML
     * @param top 是否在父节点中置顶
     * @param replaced 替换节点而不是添加，被替换的节点，将忽略父节点相关参数
     */
    export function addElement<T extends keyof HTMLElementTagNameMap>(tag: T, attribute?: Record<string, string>, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElementTagNameMap[T] {
        let element = document.createElement(tag);
        attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
        parrent = parrent || document.body;
        innerHTML && (element.innerHTML = innerHTML);
        replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
        return element;
    }
    /**
     * 添加条件回调，条件为真时执行回调函数，用于检测函数运行时机  
     * @param check 一个返回布尔值的函数，用于轮询，当函数返回值为真时执行回调函数
     * @param callback 待执行的回调函数
     * @param delay 轮询间隔：/ms，默认100ms
     * @param stop 轮询最大延时：/s，多长时间后终止轮询，不做无谓的等待，默认180s，即3分钟。为0时永不终止直到为真。
     */
    export function runWhile(check: Function, callback: Function, delay: number = 100, stop: number = 180) {
        let timer = setInterval(() => {
            if (check()) {
                clearInterval(timer);
                callback();
            }
        }, delay);
        stop && setTimeout(() => clearInterval(timer), stop * 1000)
    }
    /**
     * 播放器通知，播放器不存在将转送到控制台
     * @param msg 消息字符串或三项数组，数组时顺序分别为普通、红色、黄色消息，可按位次置空取所需颜色。本值不存在将作为“屏显”使用。
     * @param time 消息时长：/s，默认为3，为0表示永久消息
     * @param callback 点击消息执行的回调函数
     * @param replace 替代已有消息，默认为真，即同时只显示一条消息
     */
    export function bofqiMessage(msg?: string | [string?, string?, string?], time = 3, callback?: () => void, replace = true) {
        let node = document.querySelector(".bilibili-player-video-toast-bottom");
        if (!node) {
            if (msg) {
                if (Array.isArray(msg)) return debug.log(...msg);
                return debug.log(msg)
            }
            return;
        }
        if (!msg) node.childNodes.forEach(d => d.remove());
        const table = document.querySelector(".bilibili-player-video-toast-item.bilibili-player-video-toast-pay") || document.createElement("div");
        table.setAttribute("class", "bilibili-player-video-toast-item bilibili-player-video-toast-pay");
        const ele = document.createElement("div");
        ele.setAttribute("class", "bilibili-player-video-toast-item-text");
        table.appendChild(ele);
        msg = Array.isArray(msg) ? msg : [msg];
        if (!msg[0]) return;
        replace && node.childNodes.forEach(d => d.remove());
        ele.innerHTML = <string>msg.reduce((s, d, i) => {
            if (d) {
                switch (i) {
                    case 0: s += `<span class="video-float-hint-text">${d}</span>`;
                        break;
                    case 1: s += `<span class="video-float-hint-btn hint-red">${d}</span>`;
                        break;
                    case 2: s += `<span class="video-float-hint-btn">${d}</span>`;
                        break;
                }
            }
            return s;
        }, '');
        node.appendChild(table);
        callback && (ele.style.cursor = "pointer") && (ele.onclick = () => callback());
        (time !== 0) && setTimeout(() => {
            ele.remove();
            !table.children[0] && table.remove();
        }, time * 1000);
    }
    /**
     * 弹出提示框  
     * 仿造alert制作的提示框，但不具备中断页面的能力，异步返回用户点击的按钮布尔值
     * @param title 提示标题，默认为脚本名称
     * @param text 提示内容
     * @returns Promise代理的布尔值，取决于用户的点击的按钮
     */
    export async function alertMessage(text: string, title: string = Name) {
        return new Promise((r: (value: boolean) => void) => {
            const root = addElement("div")
            const div = root.attachShadow({ mode: "closed" });
            const table = addElement("div", { class: "table" }, div, `
            <div class="title">${title}</div>
            <div class="text">${text}</div>
            <div class="act">
                <div class="button">确认</div>
                <div class="button">取消</div>
                </div>
            `);
            addCss(getCss("alert.css", "button.css"), '', div);
            table.querySelectorAll<HTMLDivElement>(".button").forEach((d, i) => {
                i ? (d.onclick = () => { root.remove(), r(false) }) : (d.onclick = () => (root.remove(), r(true)))
            })
        })
    }
    /**
     * 获取并整合合内置Css模块
     * @param svg Css模块名序列
     * @returns 整合好的Css模块
     */
    export function getCss(...svg: (keyof modules)[]) {
        return svg.reduce((s, d) => {
            s += `\r\n${getModule(d)}`;
            return s;
        }, "")
    }
}