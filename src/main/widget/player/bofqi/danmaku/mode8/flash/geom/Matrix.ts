import { Point } from "./Point";
import type { Vector3D } from "./Vector3D";

/**
 * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix 对象应用于 Transform 对象的 matrix 属性，然后应用该 Transform 对象作为显示对象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。  
 * 这些转换类型统称为仿射转换。仿射转换在转换时保持线条笔直，因此平行线保持平行。  
 * 要对显示对象应用转换矩阵，请创建一个 Transform 对象，将其 matrix 属性设置为转换矩阵，然后将显示对象的 transform 属性设置为 Transform 对象。Matrix 对象也被用作某些方法的参数，例如以下方法：
 *   - BitmapData 对象的 draw() 方法
 *   - Graphics 对象的 beginBitmapFill() 方法、beginGradientFill() 方法或 lineGradientStyle() 方法
 * 
 * 转换矩阵对象为具有如下内容的 3 x 3 的矩阵：
 * | | | |
 * | - | - | - |
 * | a | c | tx |
 * | b | d | ty |
 * | u | v | w |
 * 
 * 在传统的转换矩阵中，u、v 和 w 属性具有其他功能。Matrix 类只能在二维空间中操作，因此始终假定属性值 u 和 v 为 0.0，属性值 w 为 1.0。矩阵的有效值如下：
 * | | | |
 * | - | - | - |
 * | a | c | tx |
 * | b | d | ty |
 * | 0 | 0 | 1 |
 * 
 * 您可以获取和设置 Matrix 对象的全部六个其他属性的值：a、b、c、d、tx 和 ty。  
 * Matrix 类支持四种主要类型的转换：平移、缩放、旋转和倾斜。  
 * 每个转换函数都将更改当前矩阵的属性，所以您可以有效地合并多个转换。为此，请先调用多个转换函数，再将矩阵应用于其显示对象目标（通过使用该显示对象的 transform 属性）。  
 * 使用 new Matrix() 构造函数创建 Matrix 对象后，才能调用 Matrix 对象的方法。
 */
export class Matrix {
    /**
     * 使用指定参数创建新的 Matrix 对象。在矩阵表示法中，按如下方式组织属性：
     * | | | |
     * | - | - | - |
     * | a | c | tx |
     * | b | d | ty |
     * | 0 | 0 | 1 |
     * 
     * 如果不向 new Matrix() 构造函数提供任何参数，它将创建一个具有以下值的恒等矩阵：
     * ```
     * a = 1
     * b = 0
     * c = 0
     * d = 1
     * tx = 0
     * ty = 0
     * ```
     * 
     * 在矩阵表示法中，恒等矩阵如下所示：
     * | | | |
     * | - | - | - |
     * | 1 | 0 | 0 |
     * | 0 | 1 | 0 |
     * | 0 | 0 | 1 |
     * 
     * @param a (default = 1) — 缩放或旋转图像时影响像素沿 x 轴定位的值。
     * @param b (default = 0) — 旋转或倾斜图像时影响像素沿 y 轴定位的值。
     * @param c (default = 0) — 旋转或倾斜图像时影响像素沿 x 轴定位的值。
     * @param d (default = 1) — 缩放或旋转图像时影响像素沿 y 轴定位的值。
     * @param tx (default = 0) — 沿 x 轴平移每个点的距离。
     * @param ty (default = 0) — 沿 y 轴平移每个点的距离。
     */
    constructor(
        /** 缩放或旋转图像时影响像素沿 x 轴定位的值。 */
        public a = 1,
        /** 旋转或倾斜图像时影响像素沿 y 轴定位的值。 */
        public b = 0,
        /** 旋转或倾斜图像时影响像素沿 x 轴定位的值。 */
        public c = 0,
        /** 缩放或旋转图像时影响像素沿 y 轴定位的值。 */
        public d = 1,
        /** 沿 x 轴平移每个点的距离。 */
        public tx = 0,
        /** 沿 y 轴平移每个点的距离。 */
        public ty = 0,
    ) { }
    /**
     * 返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
     * 
     * @returns 一个 Matrix 对象。
     */
    clone() {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }
    /**
     * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。在数学术语中，将两个矩阵连接起来与使用矩阵乘法将它们结合起来是相同的。  
     * 例如，如果矩阵 m1 使用系数 4 缩放某个对象，而矩阵 m2 使用 1.5707963267949 弧度 (Math.PI/2) 旋转该对象，则 m1.concat(m2) 会将 m1 转换为一个使用系数 4 缩放对象并使用 Math.PI/2 弧度旋转该对象的矩阵。  
     * 此方法将源矩阵替换为连接矩阵。如果要在不更改两个源矩阵中的任何一个的情况下连接这两个矩阵，则可以通过使用 clone() 方法首先复制源矩阵，如“类示例”部分中所示。
     * 
     * @param param0 要连接到源矩阵的矩阵。
     */
    concat({ a, b, c, d, tx, ty }: Matrix) {
        [this.a, this.b, this.c, this.d, this.tx, this.ty] = [
            this.a * a + this.b * c,
            this.a * b + this.b * d,
            this.c * a + this.d * c,
            this.c * b + this.d * d,
            this.tx * a + this.ty * c + tx,
            this.tx * b + this.ty * d + ty,
        ];
    }
    /**
     * 将 Vector3D 对象复制到调用方 Matrix3D 对象的特定列中。
     * 
     * @param column 要从中复制数据的列。
     * @param param1 要从中复制数据的 Vector3D 对象。
     */
    copyColumnFrom(column: number, { x, y }: Vector3D) {
        switch (column) {
            case 0: {
                [this.a, this.b] = [x, y];
                break;
            }
            case 1: {
                [this.c, this.d] = [x, y];
                break;
            }
            case 2: {
                [this.tx, this.ty] = [x, y];
                break;
            }
        }
    }
    /**
     * 将调用方 Matrix 对象的特定列复制到 Vector3D 对象中。将不会更改 Vector3D 对象的 w 元素。
     * 
     * @param column 要从中复制数据的列。
     * @param vector3D 要从中复制数据的 Vector3D 对象。
     */
    copyColumnTo(column: number, vector3D: Vector3D) {
        switch (column) {
            case 0: {
                [vector3D.x, vector3D.y, vector3D.z] = [this.a, this.b, 0];
                break;
            }
            case 1: {
                [vector3D.x, vector3D.y, vector3D.z] = [this.c, this.d, 0];
                break;
            }
            case 2: {
                [vector3D.x, vector3D.y, vector3D.z] = [this.tx, this.ty, 1];
                break;
            }
        }
    }
    /**
     * 将源 Point 对象中的所有矩阵数据复制到调用方 Matrix 对象中。
     * 
     * @param param0 要从中复制数据的 Matrix 对象。
     */
    copyFrom({ a, b, c, d, tx, ty }: Matrix) {
        [this.a, this.b, this.c, this.d, this.tx, this.ty] = [a, b, c, d, tx, ty];
    }
    /**
     * 将 Vector3D 对象复制到调用方 Matrix 对象的特定行中。
     * 
     * @param row 要从中复制数据的行。
     * @param param1 要从中复制数据的 Vector3D 对象。
     */
    copyRowFrom(row: number, { x, y, z }: Vector3D) {
        switch (row) {
            case 0: {
                [this.a, this.c, this.tx] = [x, y, z];
                break;
            }
            case 1: {
                [this.b, this.d, this.ty] = [x, y, z];
                break;
            }
        }
    }
    /**
     * 将调用方 Matrix 对象的特定行复制到 Vector3D 对象中。将不会更改 Vector3D 对象的 w 元素。
     * 
     * @param row 要从中复制数据的行。
     * @param vector3D 要从中复制数据的 Vector3D 对象。
     */
    copyRowTo(row: number, vector3D: Vector3D) {
        switch (row) {
            case 0: {
                [vector3D.x, vector3D.y, vector3D.z] = [this.a, this.c, this.tx];
                break;
            }
            case 1: {
                [vector3D.x, vector3D.y, vector3D.z] = [this.b, this.d, this.ty];
                break;
            }
            case 2: {
                [vector3D.x, vector3D.y, vector3D.z] = [0, 0, 1];
                break;
            }
        }
    }
    /**
     * 包括用于缩放、旋转和转换的参数。当应用于矩阵时，该方法会基于这些参数设置矩阵的值。  
     * 通过使用 createBox() 方法，您可以获得与依次应用 identity()、rotate()、scale() 和 translate() 方法时得到的矩阵相同的矩阵。
     * 
     * @param scaleX 水平缩放所用的系数。
     * @param scaleY 垂直缩放所用的系数。
     * @param rotation (default = 0) — 旋转量（以弧度为单位）。
     * @param tx (default = 0) — 沿 x 轴向右平移（移动）的像素数。
     * @param ty (default = 0) — 沿 y 轴向下平移（移动）的像素数。
     */
    createBox(scaleX: number, scaleY: number, rotation = 0, tx = 0, ty = 0) {
        this.identity();
        this.rotate(rotation);
        this.scale(scaleX, scaleY);
        this.translate(tx, ty);
    }
    /**
     * 创建 Graphics 类的 beginGradientFill() 和 lineGradientStyle() 方法所需的矩阵的特定样式。宽度和高度被缩放为 scaleX/scaleY 对，而 tx/ty 值偏移了宽度和高度的一半。
     * 
     * @param width 渐变框的宽度。
     * @param height 渐变框的高度。
     * @param rotation (default = 0) — 旋转量（以弧度为单位）。
     * @param tx (default = 0) — 沿 x 轴向右平移的距离（以像素为单位）。此值将偏移 width 参数的一半。
     * @param ty (default = 0) — 沿 y 轴向下平移的距离（以像素为单位）。此值将偏移 height 参数的一半。
     */
    createGradientBox(width: number, height: number, rotation = 0, tx = 0, ty = 0) {
        this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
    }
    /**
     * 如果给定预转换坐标空间中的点，则此方法返回发生转换后该点的坐标。与使用 transformPoint() 方法应用的标准转换不同，deltaTransformPoint() 方法的转换不考虑转换参数 tx 和 ty。
     * 
     * @param param0 想要获得其矩阵转换结果的点。
     * @returns 由应用矩阵转换所产生的点。
     */
    deltaTransformPoint({ x, y }: Point) {
        return new Point(this.a * x + this.c * y, this.d * y + this.b * x);
    }
    /**
     * 为每个矩阵属性设置一个值，该值将导致 null 转换。通过应用恒等矩阵转换的对象将与原始对象完全相同。  
     * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。  
     * 在矩阵表示法中，恒等矩阵如下所示：
     * | | | |
     * | - | - | - |
     * | 1 | 0 | 0 |
     * | 0 | 1 | 0 |
     * | 0 | 0 | 1 |
     */
    identity() {
        [this.a, this.b, this.c, this.d, this.tx, this.ty] = [1, 0, 0, 1, 0, 0];
    }
    /**
     * 执行原始矩阵的逆转换。您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
     */
    invert() {
        // 计算行列式
        const det = this.a * this.d - this.b * this.c;

        if (det === 0) {
            throw new Error("矩阵不可逆，行列式为0");
        }

        [this.a, this.b, this.c, this.d, this.tx, this.ty] = [this.d / det, -this.b / det, -this.c / det, this.a / det, (this.c * this.ty - this.d * this.tx) / det, (this.b * this.tx - this.a * this.ty) / det];
    }
    /**
     * 对 Matrix 对象应用旋转转换。  
     * rotate() 方法将更改 Matrix 对象的 a、b、c 和 d 属性。在矩阵表示法中，当前矩阵与以下矩阵连接也产生同样的结果：
     * | | | |
     * | - | - | - |
     * | cos(q) | -sin(q) | 0 |
     * | sin(q) | cos(q) | 0 |
     * | 0 | 0 |1 |
     * 
     * @param angle 以弧度为单位的旋转角度。
     */
    rotate(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        [this.a, this.b, this.c, this.d, this.tx, this.ty] = [this.a * cos + this.b * sin, -this.a * sin + this.b * cos, this.c * cos + this.d * sin, -this.c * sin + this.d * cos, this.tx * cos + this.ty * sin, -this.tx * sin + this.ty * cos];
    }
    /**
     * 对矩阵应用缩放转换。x 轴乘以 sx，y 轴乘以 sy。  
     * scale() 方法将更改 Matrix 对象的 a 和 d 属性。在矩阵表示法中，当前矩阵与以下矩阵连接也产生同样的结果：
     * | | | |
     * | - | - | - |
     * | sx | 0 | 0 |
     * | 0 | sy | 0 |
     * | 0 | 0 | 1 |
     * 
     * @param sx 用于沿 x 轴缩放对象的乘数。
     * @param sy 用于沿 y 轴缩放对象的乘数。
     */
    scale(sx: number, sy: number) {
        this.a *= sx;
        this.b *= sx;
        this.c *= sy;
        this.d *= sy;
        this.tx *= sx;
        this.ty *= sy;
    }
    /**
     * 将 Matrix 的成员设置为指定值
     * 
     * @param aa 要将 Matrix.a 设置为的值。
     * @param ba 要将 Matrix.b 设置为的值。
     * @param ca 要将 Matrix.c 设置为的值。
     * @param da 要将 Matrix.d 设置为的值。
     * @param txa 要将 Matrix.tx 设置为的值。
     * @param tya 要将 Matrix.ty 设置为的值。
     */
    setTo(aa: number, ba: number, ca: number, da: number, txa: number, tya: number) {
        [this.a, this.b, this.c, this.d, this.tx, this.ty] = [aa, ba, ca, da, txa, tya];
    }
    /** 返回列出该 Matrix 对象属性的文本值。 */
    toString() {
        return `(a=${this.a},b=${this.b},c=${this.c},d=${this.d},tx=${this.tx},ty=${this.ty})`;
    }
    /**
     * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
     * 
     * @param param0 想要获得其矩阵转换结果的点。
     * @returns 由应用矩阵转换所产生的点。
     */
    transformPoint({ x, y }: Point) {
        return new Point(this.a * x + this.c * y + this.tx, this.d * y + this.b * x + this.ty);
    }
    /**
     * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
     * 
     * @param dx 沿 x 轴向右移动的量（以像素为单位）。
     * @param dy 沿 y 轴向下移动的量（以像素为单位）。
     */
    translate(dx: number, dy: number) {
        this.tx += this.a * dx + this.c * dy;
        this.ty += this.b * dx + this.d * dy;
    }
}