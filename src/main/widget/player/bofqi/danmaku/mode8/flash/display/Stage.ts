import type { BitmapFilter } from "../filters";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { Transform } from "../geom/Transform";
import { Vector3D } from "../geom/Vector3D";
import { BlendMode } from "./BlendMode";
import { target, type DisplayObject } from "./DisplayObject";

export class Stage {
    #target: HTMLElement;
    #parent: ParentNode;
    #names: Record<string, DisplayObject> = {};
    get numChildren() {
        return this.#parent.childElementCount;
    }
    get alpha() {
        return 1;
    }
    get blendMode() {
        return BlendMode.NORMAL;
    }
    get filters(): BitmapFilter[] {
        return [];
    }
    get height() {
        return this.#target.clientHeight;
    }
    name = '';
    get parent() {
        return this;
    };
    get root() {
        return this.stage;
    }
    get rotation() {
        return 0;
    }
    get rotationX() {
        return 0;
    }
    get rotationY() {
        return 0;
    }
    get rotationZ() {
        return 0;
    }
    get scaleX() {
        return 1;
    }
    get scaleY() {
        return 1;
    }
    get scaleZ() {
        return 1;
    }
    get scrollRect() {
        return new Rectangle(0, 0, this.width, this.height);
    }
    get stage() {
        return this;
    }
    get transform() {
        return new Transform(<any>this);
    }
    get visible() {
        return true;
    }
    get width() {
        return this.#target.clientWidth;
    }
    get x() {
        return 0;
    }
    get y() {
        return 0;
    }
    get z() {
        return 0;
    }
    /** 获取并设置舞台的帧速率。 */
    frameRate = 60;
    get fullScreenHeight() {
        return screen.height;
    }
    get fullScreenWidth() {
        return screen.width;
    }
    get stageHeight() {
        return this.height;
    }
    get stageWidth() {
        return this.width;
    }
    /** 兼容：[【BILIBILI合作】2012夜神月圣诞祭](https://www.bilibili.com/video/av222938) */
    Xname = 'Akari';
    constructor(target: HTMLElement, parent: ParentNode) {
        this.#target = target;
        this.#parent = parent;
    }
    addEventListener(_type: string, _listener: EventListenerOrEventListenerObject, _useCapture?: boolean, _priority?: number, _useWeakReference?: boolean) { }
    dispatchEvent(event: Event) {
        return this.#target.dispatchEvent(event);
    }
    getBounds({ x, y }: DisplayObject) {
        return new Rectangle(x, y, this.width, this.height);
    }
    getRect(targetCoordinateSpace: DisplayObject) {
        return this.getBounds(targetCoordinateSpace);
    }
    globalToLocal({ x, y }: Point) {
        return new Point(x, y);
    }
    globalToLocal3D({ x, y }: Point) {
        return new Vector3D(x, y, 0);
    }
    hitTestObject({ x, y, width, height }: DisplayObject) {
        // 计算每个矩形的右边界和下边界
        const [rect1Right, rect1Bottom, rect2Right, rect2Bottom] = [this.width, this.height, x + width, y + height];

        // 检查是否不重叠的情况
        const noOverlap =
            this.x >= rect2Right ||        // rect1在rect2右边
            rect1Right <= x ||        // rect1在rect2左边
            this.y >= rect2Bottom ||       // rect1在rect2下边
            rect1Bottom <= y;         // rect1在rect2上边

        // 如果不是不重叠的情况，就是重叠
        return !noOverlap;
    }
    hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean {
        // 计算矩形右边界和下边界
        const [rectRight, rectBottom] = [this.width, this.height];

        // 基础坐标范围判断
        const [inXRange, inYRange] = [shapeFlag ? x > 0 && x < rectRight : x >= 0 && x <= rectRight, shapeFlag ? y > 0 && y < rectBottom : y >= 0 && y <= rectBottom];

        return inXRange && inYRange;
    }
    local3DToGlobal({ x, y }: Vector3D): Point {
        return new Point(x, y);
    }
    localToGlobal({ x, y }: Point): Point {
        return new Point(x, y);
    }
    removeEventListener(_type: string, _listener: EventListenerOrEventListenerObject, _useCapture?: boolean): void { }
    addChild(child: DisplayObject) {
        this.#parent.appendChild(child[target]);
        child.parent = <any>this;
        child.stage = this.stage;
        this.#names[child.name] = child;
        return child;
    }
    addChildAt(child: DisplayObject, index: number) {
        this.#parent.insertBefore(child[target], this.#parent.children[index] || null);
        child.parent = <any>this;
        child.stage = this.stage;
        this.#names[child.name] = child;
        return child;
    }
    contains(child: DisplayObject) {
        return this.#parent.contains(child[target]);
    }
    getChildAt(index: number) {
        const e = this.#parent.children[index];
        return Object.values(this.#names).find(d => d[target] === e);
    }
    getChildByName(name: string) {
        return this.#names[name];
    }
    getChildIndex(child: DisplayObject) {
        return Array.from(this.#parent.children).findIndex(d => d === child[target]);
    }
    removeChild(child: DisplayObject) {
        child[target].remove();
        delete child.parent;
        delete child.stage;
        for (const [name, d] of Object.entries(this.#names)) {
            if (d === child) {
                delete this.#names[name];
                break;
            }
        }
        return child;
    }
    removeChildAt(index: number) {
        const res = this.getChildAt(index);
        res?.[target].remove();
        return Object.entries(this.#names).find(([name, child]) => {
            if (child === res) {
                delete child.parent;
                delete child.stage;
                delete this.#names[name];
                return true;
            }
            return false;
        })?.[1];
    }
    removeChildren(beginIndex = 0, endIndex = 0x7fffffff) {
        const { length } = this.#parent.children;
        for (; beginIndex < length && beginIndex < endIndex; beginIndex++) {
            this.removeChildAt(beginIndex);
        }
    }
    setChildIndex(child: DisplayObject, index: number) {
        this.addChildAt(child, index);
    }
    swapChildren(child1: DisplayObject, child2: DisplayObject) {
        const temp = document.createElement('div');
        child1[target].after(temp);
        this.#parent.moveBefore(child1[target], child2[target]);
        this.#parent.moveBefore(child2[target], temp);
        temp.remove();
    }
    swapChildrenAt(index1: number, index2: number) {
        const [child1, child2] = [this.#parent.children[index1], this.#parent.children[index2]];
        if (child1 && child2) {
            const temp = document.createElement('div');
            child1.after(temp);
            this.#parent.moveBefore(child1, child2);
            this.#parent.moveBefore(child2, temp);
            temp.remove();
        }
    }
}