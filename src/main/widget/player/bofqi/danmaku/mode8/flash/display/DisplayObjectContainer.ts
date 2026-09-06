import { DisplayObject, target } from "./DisplayObject";

/** 可用作显示列表中显示对象容器的所有对象的基类 */
export abstract class DisplayObjectContainer extends DisplayObject {
    #names: Record<string, DisplayObject> = {};
    /** 返回此对象的子项数目。 */
    get numChildren() {
        return Math.max(this[target].div.childElementCount - 1, 0);
    }
    /** 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。 */
    addChild(child: DisplayObject) {
        this[target].div.appendChild(child[target]);
        child.parent = this;
        child.stage = this.stage;
        this.#names[child.name] = child;
        return child;
    }
    /** 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。 */
    addChildAt(child: DisplayObject, index: number) {
        this[target].div.insertBefore(child[target], this[target].div.children[index] || null);
        child.parent = this;
        child.stage = this.stage;
        this.#names[child.name] = child;
        return child;
    }
    /** 确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。 */
    contains(child: DisplayObject) {
        return this[target].contains(child[target]);
    }
    /** 返回位于指定索引处的子显示对象实例。 */
    getChildAt(index: number) {
        const e = this[target].div.children[index];
        return Object.values(this.#names).find(d => d[target] === e);
    }
    /** 返回具有指定名称的子显示对象。 */
    getChildByName(name: string) {
        return this.#names[name];
    };
    /** 返回 DisplayObject 的 child 实例的索引位置。 */
    getChildIndex(child: DisplayObject) {
        return Array.from(this[target].div.children).findIndex(d => d === child[target]);
    }
    /** 从 DisplayObjectContainer 实例的子列表中删除指定的 child DisplayObject 实例。 */
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
    /** 从 DisplayObjectContainer 的子列表中指定的 index 位置删除子 DisplayObject。 */
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
    /** 从 DisplayObjectContainer 实例的子级列表中删除所有子 DisplayObject 实例。 */
    removeChildren(beginIndex = 0, endIndex = 0x7fffffff) {
        const { length } = this[target].div.children;
        for (; beginIndex < length && beginIndex < endIndex; beginIndex++) {
            this.removeChildAt(beginIndex);
        }
    }
    /** 更改现有子项在显示对象容器中的位置。 */
    setChildIndex(child: DisplayObject, index: number) {
        this.addChildAt(child, index);
    }
    /** 交换两个指定子对象的 Z 轴顺序（从前到后顺序）。 */
    swapChildren(child1: DisplayObject, child2: DisplayObject) {
        const temp = document.createElement('div');
        child1[target].after(temp);
        this[target].div.moveBefore(child1[target], child2[target]);
        this[target].div.moveBefore(child2[target], temp);
        temp.remove();
    }
    /** 在子级列表中两个指定的索引位置，交换子对象的 Z 轴顺序（前后顺序）。 */
    swapChildrenAt(index1: number, index2: number) {
        const [child1, child2] = [this[target].div.children[index1], this[target].div.children[index2]];
        if (child1 && child2) {
            const temp = document.createElement('div');
            child1.after(temp);
            this[target].div.moveBefore(child1, child2);
            this[target].div.moveBefore(child2, temp);
            temp.remove();
        }
    }
}