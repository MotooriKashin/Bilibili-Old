import { createElement, createElements } from "./createElement.js";
import { HorizontalLine } from "./horizontal/horizontal.js";
import { htmlVnode } from "./htmlVnode.js";
import { PopupBox } from "./popupbox.js";
import { PushButton } from "./pushButton/pushButton";

interface Button {
    /** 按钮上的文字 */
    name: string;
    /** 点击按钮的回调函数 */
    callback: () => void;
}
/**
 * 弹出式通知
 * @param data 通知正文
 * @param head 通知抬头
 * @param button 带回调的按钮
 */
export function showAlert(data: string, head?: string, button?: Button[]) {
    const part = createElements(htmlVnode(
        `<div style="text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;">
                <span>${head || "Bilibili Old"}</span>
            </div>
            <div style="margin-bottom: 10px;"><div>${data}</div></div>`
    ));
    let popup: PopupBox;
    if (button && button.length) {
        part.appendChild(new HorizontalLine());
        const node = part.appendChild(createElement({
            tagName: "div",
            props: { style: 'display: flex;align-items: center;justify-content: space-around;' }
        }));
        button.forEach(d => {
            node.appendChild(new PushButton({
                button: d.name, func: () => {
                    d.callback();
                    popup.remove();
                }
            }));
        })
    }
    popup = new PopupBox({ children: part, style: "max-width: 360px; max-height: 300px;" });
}