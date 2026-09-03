import { popEl, pushEl } from "../../ScriptManager";
import { applyFilter, type BitmapFilter } from "../filters";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { Transform } from "../geom/Transform";
import { Vector3D } from "../geom/Vector3D";
import { BlendMode } from "./BlendMode";
import type { DisplayObjectContainer } from "./DisplayObjectContainer";
import type { Stage } from "./Stage";
import style from './index.css' with {type: 'css'};

/** DisplayObject target 属性键 */
export const target = Symbol('mode-8');

class Mode9DisplayObject extends HTMLElement {
    static get is() {
        return 'mode-8';
    }
    override shadowRoot = this.attachShadow({ mode: 'closed' });
    div = this.shadowRoot.appendChild(document.createElement('div'));
    filterSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    constructor() {
        super();

        this.shadowRoot.adoptedStyleSheets.push(style);
    }
    connectedCallback() {
        pushEl(this);
        this.dispatchEvent(new Event('added')); // 将显示对象添加到显示列表中时调度。以下方法会触发此事件：DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
        this.dispatchEvent(new Event('addedToStage')); // 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。以下方法会触发此事件：DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
        this.dispatchEvent(new Event('enterFrame')); // [播放事件] 播放头进入新帧时调度。如果播放头不移动，或者只有一帧，则会继续以帧速率调度此事件。此事件为广播事件，这意味着具有注册了此事件的侦听器的所有显示对象都会调度此事件。
        this.dispatchEvent(new Event('frameConstructed')); // [广播事件] 在帧显示对象的构造函数运行之后但在帧脚本运行之前调度。如果播放头不移动，或者只有一帧，则会继续以帧速率调度此事件。此事件为广播事件，这意味着具有注册了此事件的侦听器的所有显示对象都会调度此事件。
        this.dispatchEvent(new Event('render')); // [广播事件] 将要更新和呈现显示列表时调度。此事件为侦听此事件的对象在呈现显示列表之前进行更改提供了最后的机会。每次希望调度 render 事件时，必须调用 Stage 对象的 invalidate() 方法。只有当 Render 事件与调用 Stage.invalidate() 的对象互相信任时，才会将这些事件调度给某个对象。此事件为广播事件，这意味着具有注册了此事件的侦听器的所有显示对象都会调度此事件。注意：如果显示未呈现，则不会调度此事件。当内容最小化或遮蔽时会出现这种情况。
    }
    disconnectedCallback() {
        popEl(this);
        this.dispatchEvent(new Event('enterFrame')); // [广播事件] 播放头退出当前帧时调度。所有帧脚本已运行。如果播放头不移动，或者只有一帧，则会继续以帧速率调度此事件。此事件为广播事件，这意味着具有注册了此事件的侦听器的所有显示对象都会调度此事件。
        this.dispatchEvent(new Event('removed')); // 将要从显示列表中删除显示对象时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
        this.dispatchEvent(new Event('removedFromStage'));// 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
    }
}
customElements.define(Mode9DisplayObject.is, Mode9DisplayObject);

/** 可放在显示列表中的所有对象的基类 */
export abstract class DisplayObject {
    /** 对象对应的 HTML 元素 */
    [target] = new Mode9DisplayObject();
    /** 表示指定对象的 Alpha 透明度值。 */
    get alpha() {
        const { opacity } = this[target].dataset;
        if (opacity === undefined) {
            return 1;
        } else {
            return Number(opacity);
        }
    };
    set alpha(v) {
        this[target].dataset["opacity"] = <any>v;
    }
    #blendMode = BlendMode.NORMAL;
    /** BlendMode 类中的一个值，用于指定要使用的混合模式。 */
    get blendMode() {
        return this.#blendMode;
    }
    set blendMode(v) {
        this[target].classList.remove('layer');
        switch (v) {
            case BlendMode.ADD: {
                this.#blendMode = v;
                this[target].style.mixBlendMode = 'plus-lighter';
                break;
            }
            case BlendMode.DARKEN: {
                this.#blendMode = v;
                this[target].style.mixBlendMode = 'darken';
                break;
            }
            case BlendMode.DIFFERENCE: {
                this.#blendMode = v;
                this[target].style.mixBlendMode = 'difference';
                break;
            }
            case BlendMode.HARDLIGHT: {
                this.#blendMode = v;
                this[target].style.mixBlendMode = 'hard-light';
                break;
            }
            case BlendMode.LAYER: {
                this.#blendMode = v;
                this[target].classList.add('layer');
                break;
            }
            case BlendMode.LIGHTEN: {
                this.#blendMode = v;
                this[target].style.mixBlendMode = 'lighten';
                break;
            }
            case BlendMode.MULTIPLY: {
                this.#blendMode = v;
                this[target].style.mixBlendMode = 'multiply';
                break;
            }
            case BlendMode.OVERLAY: {
                this.#blendMode = v;
                this[target].style.mixBlendMode = 'overlay';
                break;
            }
            case BlendMode.SCREEN: {
                this.#blendMode = v;
                this[target].style.mixBlendMode = 'screen';
                break;
            }
            default: {
                this.#blendMode = BlendMode.NORMAL;
                this[target].style.mixBlendMode = '';
                break;
            }
        }
    }
    #filters: BitmapFilter[] = [];
    /** 包含当前与显示对象关联的每个滤镜对象的索引数组。 */
    get filters() {
        return this.#filters;
    }
    set filters(v) {
        if (!v || v.length === 0) {
            this[target].filterSvg.replaceChildren();
            this[target].filterSvg.remove();
            this[target].style.filter = '';
        } else {
            let primitivesChain = '';
            let lastResult = 'SourceGraphic'; // 第一个滤镜的输入是 SourceGraphic

            // 遍历滤镜数组，串联所有基元
            v.forEach(filter => {
                if (filter) {
                    const { primitives, result } = filter[applyFilter](lastResult);
                    primitivesChain += primitives;
                    lastResult = result;
                }
            });

            // 最终合成
            const finalMerge = `<feMerge><feMergeNode in="${lastResult}" /></feMerge>`;
            primitivesChain += finalMerge;

            const svgFilterString = `<filter id="filter-chain">${primitivesChain}</filter>`;

            this[target].filterSvg.id = 'filter-container';
            this[target].filterSvg.innerHTML = svgFilterString;
            this[target].shadowRoot.prepend(this[target].filterSvg);
        }
    }
    /** 表示显示对象的高度，以像素为单位。 */
    get height() {
        return this[target].offsetHeight * this.#scaleY;
    }
    set height(v) {
        this.scaleY = v / this[target].offsetHeight;
    }
    /** 调用显示对象被指定的 mask 对象遮罩。 */
    // abstract mask: DisplayObject;
    /** 表示 DisplayObject 的实例名称。 */
    name = '';
    /** 表示包含此显示对象的 DisplayObjectContainer 对象。 */
    parent?: DisplayObjectContainer;
    /** 对于加载的 SWF 文件中的显示对象，root 属性是此 SWF 文件所表示的显示列表树结构部分中的顶级显示对象。 */
    get root() {
        return this.stage;
    }
    /** 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。 */
    get rotation() {
        return this.#rotationZ;
    }
    set rotation(v) {
        this.rotationZ = v;
    }
    #rotationX = 0;
    /** 表示 DisplayObject 实例相对于 3D 父容器距离其原始方向的 x 轴旋转（以度为单位）。 */
    get rotationX() {
        return this.#rotationX;
    }
    set rotationX(v) {
        this[target].dataset["rotateX"] = this.#rotationX = <any>v;
    }
    #rotationY = 0;
    /** 表示 DisplayObject 实例相对于 3D 父容器距离其原始方向的 y 轴旋转（以度为单位）。 */
    get rotationY() {
        return this.#rotationY;
    }
    set rotationY(v) {
        this[target].dataset["rotateY"] = this.#rotationY = <any>v;
    }
    #rotationZ = 0;
    /** 表示 DisplayObject 实例相对于 3D 父容器距离其原始方向的 z 轴旋转（以度为单位）。 */
    get rotationZ() {
        return this.#rotationZ;
    }
    set rotationZ(v) {
        this[target].dataset["rotateZ"] = this.#rotationZ = <any>v;
    }
    #scaleX = 1;
    /** 表示从注册点开始应用的对象的水平缩放比例（百分比）。 */
    get scaleX() {
        return this.#scaleX;
    }
    set scaleX(v) {
        this[target].dataset["scaleX"] = this.#scaleX = <any>v;
    }
    #scaleY = 1;
    /** 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。 */
    get scaleY() {
        return this.#scaleY;
    }
    set scaleY(v) {
        this[target].dataset["scaleY"] = this.#scaleY = <any>v;
    }
    #scaleZ = 1;
    /** 表示从对象的注册点开始应用的对象的深度缩放比例（百分比）。 */
    get scaleZ() {
        return this.#scaleZ;
    }
    set scaleZ(v) {
        this[target].dataset["scaleZ"] = this.#scaleZ = <any>v;
    }
    /** 显示对象的滚动矩形范围。 */
    get scrollRect() {
        return new Rectangle(this.#x, this.#y, this.width, this.height);
    }
    set scrollRect({ x, y, width, height }) {
        [this.x, this.y, this.width, this.height] = [Math.max(x, 0), Math.max(y, 0), Math.max(width, 0), Math.max(height, 0)];
    }
    /** 显示对象的舞台。 */
    stage?: Stage;
    #transform = new Transform(this);
    /** 一个对象，具有与显示对象的矩阵、颜色转换和像素范围有关的属性。 */
    get transform() {
        return this.#transform;
    }
    set transform({ colorTransform, matrix3D }) {
        [this.#transform.colorTransform, this.#transform.matrix3D] = [colorTransform, matrix3D];
    }
    /** 显示对象是否可见。 */
    get visible() {
        return this[target].checkVisibility({ visibilityProperty: true });
    }
    set visible(v) {
        this[target].style.visibility = v ? '' : 'hidden';
    }
    /** 表示显示对象的宽度，以像素为单位。 */
    get width() {
        return this[target].offsetWidth * this.#scaleX;
    }
    set width(v) {
        this.scaleX = v / this[target].offsetWidth;
    }
    #x = 0;
    /** 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。 */
    get x() {
        return this.#x;
    }
    set x(v) {
        this[target].dataset["x"] = this.#x = <any>v;
    }
    #y = 0;
    /** 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。 */
    get y() {
        return this.#y;
    }
    set y(v) {
        this[target].dataset["y"] = this.#y = <any>v;
    }
    #z = 0;
    /** 表示 DisplayObject 实例相对于 3D 父容器沿 z 轴的 z 坐标位置。 */
    get z() {
        return this.#z;
    }
    set z(v) {
        this[target].dataset["z"] = this.#z = <any>v;
    }
    /** 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知。 */
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean, _priority?: number, _useWeakReference?: boolean) {
        this[target].addEventListener(type, listener, useCapture)
    };
    /** 将事件调度到事件流中。 */
    dispatchEvent(event: Event) {
        return this[target].dispatchEvent(event);
    };
    /** 返回一个矩形，该矩形定义相对于 targetCoordinateSpace 对象坐标系的显示对象区域。 */
    getBounds({ x, y }: DisplayObject) {
        return new Rectangle(x + this.#x, y + this.#y, this.width, this.height);
    }
    /** 返回一个矩形，该矩形根据 targetCoordinateSpace 参数定义的坐标系定义显示对象的边界，但不包括形状上的任何笔触。 */
    getRect(targetCoordinateSpace: DisplayObject) {
        return this.getBounds(targetCoordinateSpace);
    }
    /** 将 point 对象从舞台（全局）坐标转换为显示对象的（本地）坐标。 */
    globalToLocal({ x, y }: Point) {
        return new Point(x - this.#x, y - this.#y);
    }
    /** 将二维点从舞台（全局）坐标转换为三维显示对象的（本地）坐标。 */
    globalToLocal3D({ x, y }: Point) {
        return new Vector3D(x - this.#x, y - this.#y, -this.#z);
    }
    /** 计算显示对象的边框，以确定它是否与 obj 显示对象的边框重叠或相交。 */
    hitTestObject({ x, y, width, height }: DisplayObject) {
        // 计算每个矩形的右边界和下边界
        const [rect1Right, rect1Bottom, rect2Right, rect2Bottom] = [this.#x + this.width, this.#y + this.height, x + width, y + height];

        // 检查是否不重叠的情况
        const noOverlap =
            this.x >= rect2Right ||        // rect1在rect2右边
            rect1Right <= x ||        // rect1在rect2左边
            this.y >= rect2Bottom ||       // rect1在rect2下边
            rect1Bottom <= y;         // rect1在rect2上边

        // 如果不是不重叠的情况，就是重叠
        return !noOverlap;
    }
    /** 计算显示对象，以确定它是否与 x 和 y 参数指定的点重叠或相交。 */
    hitTestPoint(x: number, y: number, shapeFlag = false) {
        // 计算矩形右边界和下边界
        const [rectRight, rectBottom] = [this.#x + this.width, this.#y + this.height];

        // 基础坐标范围判断
        const [inXRange, inYRange] = [shapeFlag ? x > this.#x && x < rectRight : x >= this.#x && x <= rectRight, shapeFlag ? y > this.#y && y < rectBottom : y >= this.#y && y <= rectBottom];

        return inXRange && inYRange;
    }
    /** 将三维显示对象的（本地）坐标的三维点转换为舞台（全局）坐标中的二维点。 */
    local3DToGlobal({ x, y }: Vector3D) {
        return new Point(x + this.#x, y + this.#y);
    }
    /** 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。 */
    localToGlobal({ x, y }: Point) {
        return new Point(x + this.#x, y + this.#y);
    }
    /** 从 EventDispatcher 对象中删除侦听器。 */
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean) {
        this[target].removeEventListener(type, listener, useCapture);
    };
    /** 移除元素 */
    remove() {
        this[target].remove();
    }
}