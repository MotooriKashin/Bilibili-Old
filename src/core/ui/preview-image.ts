import { CustomElementsInterface } from "../../utils/customelement";
import html from '../../html/preview-image.html'
import { isArray } from "../../utils/typeof";
import { addElement } from "../../utils/element";
import svgFork from "../../svg/fork.svg";
import svgLeft from "../../svg/left.svg";
import svgRight from "../../svg/right.svg";
import { Scrollbar } from "../../utils/scrollbar";

export class PreviewImage extends HTMLElement implements CustomElementsInterface {
    private _image: HTMLElement;
    private _list: HTMLElement;
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        const close = root.querySelector<HTMLElement>('.svg-icon.close.use-color')!;
        const left = root.querySelector<HTMLElement>('.svg-icon.left-arrow.use-color')!;
        const right = root.querySelector<HTMLElement>('.svg-icon.right-arrow.use-color')!;
        close.innerHTML = svgFork;
        left.innerHTML = svgLeft;
        right.innerHTML = svgRight;
        this._image = root.querySelector<HTMLElement>('.show-image-wrap')!;
        this._list = root.querySelector<HTMLElement>('.preview-list')!;

        new Scrollbar(this._image, true, true, true);

        close.parentElement!.addEventListener('click', e => {
            this.remove();
            document.body.style.overflow = '';
            e.stopPropagation();
        });
        left.parentElement!.addEventListener('click', e => {
            this.togger(e, false);
            e.stopPropagation();
        });
        right.parentElement!.addEventListener('click', e => {
            this.togger(e);
            e.stopPropagation();
        });
        // 点击空白区域退出
        this._image.addEventListener('click', e => {
            if (e.target === this._image) {
                this.remove();
                document.body.style.overflow = '';
                e.stopPropagation();
            }
        })
    }
    private togger(e: MouseEvent, right = true) {
        const list = this._list.querySelectorAll('.preview-item-box');
        if (list.length) {
            let i = 0;
            list.forEach((d, j) => {
                if (d.classList.contains('active')) {
                    d.classList.remove('active');
                    if (right) {
                        i = j + 1;
                        i < list.length || (i = 0);
                    } else {
                        i = j - 1;
                        i < 0 && (i = list.length - 1);
                    }
                }
            });
            list[i].classList.add('active');
            const img = list[i].querySelector('img');
            if (img) {
                this._image.innerHTML = `<img class="image-content" src="${img.src}">`;
            }
        }
        e.stopPropagation();
    }
    /**
     * 初始化
     * @param imgs 图片链接（组）
     * @param vertical 是否垂直
     * @param active 显示第几张图片
     */
    value(imgs: string | string[], vertical = false, active = 0) {
        imgs = isArray(imgs) ? imgs : [imgs];
        active < imgs.length || (active = 0);
        this._image.innerHTML = `<img class="image-content" src="${imgs[active]}">`;
        vertical ? this.classList.add('vertical') : this.classList.remove('vertical');
        this._list.innerHTML = '';
        imgs.forEach((d, i) => {
            const item = addElement('div', {
                class: `preview-item-box${i === active ? ' active' : ''}`,
                style: 'min-width: 54px; max-width: 54px; height: 54px;'
            }, this._list, `<div class="preview-item-wrap${vertical ? ' vertical' : ''}"><img src="${d}"></div>`);
            item.addEventListener('click', e => {
                this._list.querySelector('.preview-item-box.active')?.classList.remove('active');
                item.classList.add('active');
                this._image.innerHTML = `<img class="image-content" src="${d}">`;
                e.stopPropagation();
            });
        });
        document.body.contains(this) || document.body.appendChild(this);
        document.body.style.overflow = "hidden";
    }
}
customElements.get(`preview-image-${_MUTEX_}`) || customElements.define(`preview-image-${_MUTEX_}`, PreviewImage);