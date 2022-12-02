export interface CustomElementsInterface extends HTMLElement {
    /** **必须以静态getter方法创建** attributeChangedCallback监听name数组 */
    observedAttributes?(): string[];
    /** 当 custom element 首次被插入文档 DOM 时，被调用。 */
    connectedCallback?(): void;
    /** 当 custom element 从文档 DOM 中删除时，被调用。 */
    disconnectedCallback?(): void;
    /** 当 custom element 被移动到新的文档时，被调用。 */
    adoptedCallback?(): void;
    /** 当 custom element 增加、删除、修改自身属性时，被调用。 */
    attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
}