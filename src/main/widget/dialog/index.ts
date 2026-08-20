import html from './index.html' with {type: 'text'};
import style from './index.css' with {type: 'css'};

export class Medal extends HTMLDialogElement {
    static get is() {
        return `medal-${crypto.randomUUID()}`;
    }
    static {
        document.adoptedStyleSheets.push(style);
    }
    /** 销毁所有弹窗 */
    static clear() {
        document.querySelectorAll(Medal.is).forEach(d => d.remove());
    }
    constructor(
        /** 内容 */
        message: TMessage,
        /** 标题 */
        title: TMessage = '⚠',
        /** 添加按钮 */
        ...buttons: IMedalButton[]
    ) {
        super();
        this.classList.add('medal');
        this.innerHTML = html;
        this.firstElementChild?.insertAdjacentText('afterbegin', <any>title);
        this.lastElementChild!.firstElementChild!.textContent = <any>message;
        if (buttons.length) {
            const form = document.createElement('form');
            form.method = 'dialog';
            buttons.forEach(({ label, callback }) => {
                const button = document.createElement('button');
                button.textContent = label;
                callback && button.when('click').subscribe(callback);
                form.append(button);
            });
            this.lastElementChild?.append(form);
        }

        document.body.append(this);
        this.showModal();
    }
    connectedCallback() {
        this.when('close').take(1).subscribe(() => { this.remove() });
    }

}
customElements.define(Medal.is, Medal, { extends: 'dialog' });

type TMessage = string | number | bigint;

interface IMedalButton {
    /** 按钮显示内容 */
    label: string;
    /** 点击按钮回调 */
    callback?: () => void;
}