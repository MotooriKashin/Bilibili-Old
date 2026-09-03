import { Point } from "./Point";

/**
 * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。  
 * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。  
 * 以下方法和属性使用 Rectangle 对象：
 *   - applyFilter()、colorTransform()、copyChannel()、copyPixels()、draw()、fillRect()、generateFilterRect()、getColorBoundsRect()、getPixels()、merge()、paletteMap()、pixelDisolve()、setPixels() 和 threshold() 方法，以及 BitmapData 类的 rect 属性
 *   - getBounds() 和 getRect() 方法，以及 DisplayObject 类的 scrollRect 和 scale9Grid 属性
 *   - TextField 类的 getCharBoundaries() 方法
 *   - Transform 类的 pixelBounds 属性
 *   - Sprite 类的 startDrag() 方法的 bounds 参数
 *   - PrintJob 类的 addPage() 方法的 printArea 参数
 * 
 * 您可以使用 new Rectangle() 构造函数创建 Rectangle 对象。  
 * 注意：Rectangle 类不定义矩形 Shape 显示对象。要在屏幕上绘制矩形 Shape 对象，请使用 Graphics 类的 drawRect() 方法。
 */
export class Rectangle {
    get bottom() {
        return this.y + this.height;
    }
    /** y 和 height 属性的和。 */
    set bottom(v) {
        this.height = v - this.y;
    }
    get bottomRight() {
        return new Point(this.x + this.width, this.y + this.height);
    }
    /** 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置。 */
    set bottomRight({ x, y }) {
        [this.right, this.bottom] = [x, y];
    }
    /**
     * 矩形左上角的 x 坐标。更改 Rectangle 对象的 left 属性对 y 和 height 属性没有影响。但是，它会影响 width 属性，而更改 x 值不会影响 width 属性。  
     * left 属性的值等于 x 属性的值。
     */
    get left() {
        return this.x;
    }
    set left(v) {
        [this.x, this.width] = [v, this.width + this.x - v];
    }
    /** x 和 width 属性的和。 */
    get right() {
        return this.x + this.width;
    }
    set right(v) {
        this.width = v - this.x;
    }
    /** Rectangle 对象的大小，该对象表示为具有 width 和 height 属性的值的 Point 对象。 */
    get size() {
        return new Point(this.width, this.height);
    }
    set size({ x, y }) {
        [this.width, this.height] = [x, y];
    }
    /**
     * 矩形左上角的 y 坐标。更改 Rectangle 对象的 top 属性对 x 和 width 属性没有影响。但是，它会影响 height 属性，而更改 y 值不会影响 height 属性。  
     * top 属性的值等于 y 属性的值。
     */
    get top() {
        return this.y;
    }
    set top(v) {
        [this.y, this.height] = [v, this.height + this.y - v];
    }
    /** 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置。 */
    get topLeft() {
        return new Point(this.x, this.y);
    }
    set topLeft({ x, y }) {
        [this.top, this.left] = [x, y];
    }
    /** 创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。如果调用此函数时不使用任何参数，将创建一个 x、y、width 和 height 属性均设置为 0 的矩形。 */
    constructor(
        /**
         * 矩形左上角的 x 坐标。更改 Rectangle 对象的 x 属性的值对 y、width 和 height 属性没有影响。  
         * x 属性的值等于 left 属性的值。
         */
        public x = 0,
        /**
         * 矩形左上角的 y 坐标。更改 Rectangle 对象的 y 属性的值对 x、width 和 height 属性没有影响。  
         * y 属性的值等于 top 属性的值。
         */
        public y = 0,
        /** 矩形的宽度（以像素为单位）。更改 Rectangle 对象的 width 值对 x、y 和 height 属性没有影响。 */
        public width = 0,
        /** 矩形的高度（以像素为单位）。更改 Rectangle 对象的 height 值对 x、y 和 width 属性没有影响。 */
        public height = 0,
    ) { }
    /**
     * 返回一个新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
     * 
     * @returns 新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
     */
    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
    /**
     * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
     * 
     * @param x 点的 x 坐标（水平位置）。
     * @param y 点的 y 坐标（垂直位置）。
     * @returns 如果 Rectangle 对象包含指定的点，则值为 true；否则为 false。
     */
    contains(x: number, y: number) {
        return this.left <= x && this.right >= x && this.top <= y && this.bottom >= y;
    }
    /**
     * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
     * 
     * @param param0 用其 x 和 y 坐标表示的点。
     * @returns 如果 Rectangle 对象包含指定的点，则值为 true；否则为 false。
     */
    containsPoint({ x, y }: Point) {
        return this.contains(x, y);
    }
    /**
     * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
     * 
     * @param param0 所检查的 Rectangle 对象。
     * @returns 如果此 Rectangle 对象包含您指定的 Rectangle 对象，则返回 true 值，否则返回 false。
     */
    containsRect({ left, right, top, bottom }: Rectangle) {
        return this.left <= left && this.right >= right && this.top <= top && this.bottom >= bottom;
    }
    /**
     * 将源 Rectangle 对象中的所有矩形数据复制到调用方 Rectangle 对象中。
     * 
     * @param param0 要从中复制数据的 Rectangle 对象。
     */
    copyFrom({ x, y, width, height }: Rectangle) {
        [this.x, this.y, this.width, this.height] = [x, y, width, height];
    }
    /**
     * 确定在 toCompare 参数中指定的对象是否等于此 Rectangle 对象。此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
     * 
     * @param param0 要与此 Rectangle 对象进行比较的矩形。
     * @returns 如果对象具有与此 Rectangle 对象完全相同的 x、y、width 和 height 属性值，则返回 true 值，否则返回 false。
     */
    equals({ x, y, width, height }: Rectangle) {
        return x === this.x && y === this.y && width === this.width && height === this.height;
    }
    /**
     * 按指定量增加 Rectangle 对象的大小（以像素为单位）。保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
     * 
     * @param dx Rectangle 对象横向增加的值。
     * @param dy Rectangle 纵向增加的值。
     */
    inflate(dx: number, dy: number) {
        this.x -= dx;
        this.width += 2 * dx;
        this.y -= dy;
        this.height += 2 * dy;
    }
    /**
     * 增加 Rectangle 对象的大小。此方法与 Rectangle.inflate() 方法类似，只不过它采用 Point 对象作为参数。
     * 
     * @param param0 此 Point 对象的 x 属性用于增加 Rectangle 对象的水平尺寸。y 属性用于增加 Rectangle 对象的垂直尺寸。
     */
    inflatePoint({ x, y }: Point) {
        this.inflate(x, y);
    }
    /**
     * 如果在 toIntersect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。如果矩形不相交，则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
     * 
     * @param param0 要对照比较以查看其是否与此 Rectangle 对象相交的 Rectangle 对象。
     * @returns 等于交集区域的 Rectangle 对象。如果该矩形不相交，则此方法返回一个空的 Rectangle 对象；即，其 x、y、width 和 height 属性均设置为 0 的矩形。
     */
    intersection({ x: x1, y: y1, right: r1, bottom: b1 }: Rectangle) {
        // 计算相交矩形的左上角坐标
        const x = Math.max(this.x, x1);
        const y = Math.max(this.y, y1);

        // 计算相交矩形的右下角坐标（不包含）
        const right = Math.min(this.right, r1);
        const bottom = Math.min(this.bottom, b1);

        // 判断是否相交
        if (x < right && y < bottom) {
            return new Rectangle(x, y, right - x, bottom - y);
        } else {
            return new Rectangle();
        }
    }
    /**
     * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
     * 
     * @param toIntersect 要与此 Rectangle 对象比较的 Rectangle 对象。
     * @returns 如果指定的对象与此 Rectangle 对象相交，则返回 true 值，否则返回 false。
     */
    intersects(toIntersect: Rectangle) {
        const { x, y, width, height } = this.intersection(toIntersect);
        return x === 0 && y === 0 && width === 0 && height === 0;
    }
    /**
     * 确定此 Rectangle 对象是否为空。
     * 
     * @returns 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
     */
    isEmpty() {
        return this.width <= 0 || this.height <= 0;
    }
    /**
     * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
     * 
     * @param dx 将 Rectangle 对象的 x 值移动此数量。
     * @param dy 将 Rectangle 对象的 y 值移动此数量。
     */
    offset(dx: number, dy: number) {
        this.x = dx;
        this.y = dy;
    }
    /**
     * 将 Point 对象用作参数来调整 Rectangle 对象的位置。此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
     * 
     * @param param0 要用于偏移此 Rectangle 对象的 Point 对象。
     */
    offsetPoint({ x, y }: Point) {
        this.offset(x, y);
    }
    /**
     * 将 Rectangle 对象的所有属性设置为 0。如果 Rectangle 对象的宽度或高度小于或等于 0，则该对象为空。  
     * 此方法将 x、y、width 和 height 属性设置为 0。
     */
    setEmpty() {
        this.x = this.y = this.width = this.height = 0;
    }
    /**
     * 将 Rectangle 的成员设置为指定值
     * 
     * @param xa 要将 Rectangle 的 x 属性设置为的值。
     * @param ya 要将 Rectangle 的 y 属性设置为的值。
     * @param widtha 要将 Rectangle 的 width 属性设置为的值。
     * @param heighta 要将 Rectangle 的 height 属性设置为的值。
     */
    setTo(xa: number, ya: number, widtha: number, heighta: number) {
        [this.x, this.y, this.width, this.height] = [xa, ya, widtha, heighta];
    }
    /**
     * 生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。
     * 
     * @returns 一个字符串，它列出了 Rectangle 对象的下列各个属性的值：x、y、width 和 height。
     */
    toString() {
        return `(x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height})`;
    }
    /**
     * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
     * **注意**：union() 方法忽略高度或宽度值为 0 的矩形，如：`var rect2:Rectangle = new Rectangle(300,300,50,0);`
     * 
     * @param param0 要添加到此 Rectangle 对象的 Rectangle 对象。
     * @returns 充当两个矩形的联合的新 Rectangle 对象。
     */
    union({ x: x1, y: y1, right: r1, bottom: b1 }: Rectangle) {
        const [x, y, right, bottom] = [Math.min(x1, this.x), Math.min(y1, this.y), Math.max(r1, this.right), Math.max(b1, this.bottom)];
        return new Rectangle(x, y, right - x, bottom - y);
    }
}