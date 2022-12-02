import { addElement } from "../../utils/element";
import { isArray } from "../../utils/typeof";
import { PushButton } from "./utils/button";
import { PopupBox } from "./utils/popupbox";

interface IButton {
    text: string;
    callback?: Function;
}
/**
 * 弹窗通知
 * @param msg 通知内容
 * @param title 通知标题
 * @param buttons 显示在通知下方的按钮
 */
export function alert(msg: string | string[], title?: string, buttons?: IButton[]) {
    isArray(msg) || (msg = [msg]);
    msg = msg.join('</br>');
    const popup = new PopupBox();
    popup.fork = false;
    popup.setAttribute('style', 'max-width: 400px; max-height: 300px;line-height: 16px;');
    popup.innerHTML = `<div style="text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;">
    <span>${title || "Bilibili Old"}</span>
</div>
<div><div style="padding-block: 10px;padding-inline: 15px;">${msg}</div></div>`;
    if (buttons) {
        addElement('hr', { style: 'width: 100%;opacity: .3;' }, popup);
        const div = addElement('div', { style: 'display: flex;align-items: center;justify-content: space-around;' }, popup);
        buttons.forEach(d => {
            const button = new PushButton();
            button.text = d.text;
            button.addEventListener('change', () => {
                d.callback?.();
                popup.remove();
            });
            div.appendChild(button);
        })
    }
}