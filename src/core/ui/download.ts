import { CustomElementsInterface } from "../../utils/customelement";
import html from '../../html/download.html';
import { propertryChangeHook } from "../../utils/hook/method";
import { addElement } from "../../utils/element";

export interface IDownlodData {
    url?: string[];
    fileName?: string;
    quality: string;
    size: string;
    color?: IDownloadColor;
    onClick?: (ev: MouseEvent) => void;
}
export type IDownloadColor = 'yellow' | 'pink' | 'purple' | 'red' | 'orange' | 'blue' | 'green'
    | 'lv9' | 'lv8' | 'lv7' | 'lv6' | 'lv5' | 'lv4' | 'lv3' | 'lv2' | 'lv1';
export type IDownloadCell = 'mp4' | 'flv' | 'av1' | 'avc' | 'hev' | 'aac' | '';
export class BilioldDownload extends HTMLElement implements CustomElementsInterface {
    private _container: HTMLDivElement;
    private _cells: Partial<Record<IDownloadCell, HTMLDivElement>> = {};
    private _noData: HTMLDivElement;
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        root.innerHTML = html;
        this._container = <HTMLDivElement>root.children[0];
        this.addEventListener('click', e => e.stopPropagation());
        this._noData = addElement('div', undefined, this._container, '正在获取下载数据~');
    }
    private updateItem = (key: IDownloadCell, value: IDownlodData[]) => {
        this._container.contains(this._noData) && this._noData.remove();
        this._cells[key] || (this._cells[key] = addElement('div', { class: "cell" }, this._container));
        this._cells[key]!.innerHTML = `<div class="type ${key}">${key}</div>`;
        value ? value.forEach(d => {
            const a = addElement('a', { class: "item", target: "_blank" }, this._cells[key], `<div class="up${d.color ? ` ${d.color}` : ""}">${d.quality}</div><div class="down">${d.size}</div>`);
            d.url && (a.href = d.url[0]);
            d.fileName && (a.download = d.fileName);
            d.onClick && a.addEventListener('click', e => d.onClick!(e));
        }) : this._cells[key]?.remove();
        this._container.firstChild || this._container.replaceChildren(this._noData);
    }
    show() {
        document.contains(this) || document.body.appendChild(this);
        this.style.display = '';
        window.addEventListener('click', () => {
            this.style.display = 'none';
        }, { once: true });
    }
    init() {
        return propertryChangeHook(<Record<IDownloadCell, IDownlodData[]>>{}, this.updateItem);
    }
    disconnectedCallback(): void {
        this.destory();
    }
    private destory() {
        this._cells = {};
        this._container.replaceChildren(this._noData);
    }
}
customElements.get(`download-${_MUTEX_}`) || customElements.define(`download-${_MUTEX_}`, BilioldDownload);