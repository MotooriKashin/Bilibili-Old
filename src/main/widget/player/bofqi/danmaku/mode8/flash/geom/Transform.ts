import type { DisplayObject } from "../display/DisplayObject";
import { ColorTransform } from "./ColorTransform";
import { Matrix } from "./Matrix";
import { Matrix3D } from "./Matrix3D";
import { PerspectiveProjection } from "./PerspectiveProjection";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

/**
 * 利用 Transform 类，可以访问可应用于显示对象的颜色调整属性和二维或三维转换对象。在转换过程中，会将显示对象的颜色或方向和位置从当前值或坐标调整（偏移）到新值或坐标。Transform 类还收集有关应用于显示对象及其所有父对象的颜色和二维矩阵转换的数据。可以通过 concatenatedColorTransform 和 concatenatedMatrix 属性访问这些组合转换。  
 * 要应用颜色转换，请执行下列操作：创建一个 ColorTransform 对象，并使用该对象的方法和属性设置颜色调整，然后将显示对象的 transform 属性的 colorTransformation 属性分配给新的 ColorTransformation 对象。  
 * 要应用二维转换，请执行下列操作：创建一个 Matrix 对象，并设置该矩阵的二维转换，然后将显示对象的 transform.matrix 属性分配给新的 Matrix 对象。  
 * 要应用三维转换，应首先创建一个三维显示对象。三维显示对象具有一个非零的 z 属性值。您无需创建 Matrix3D 对象。对于所有三维对象，当您为显示对象分配 z 值时，将自动创建 Matrix3D 对象。可以通过显示对象的 transform 属性访问显示对象的 Matrix3D 对象。使用 Matrix3D 类的方法，可以添加或修改现有转换设置。还可以创建自定义 Matrix3D 对象，并设置该对象的转换元素，然后使用 transform.matrix 属性将新的 Matrix3D 对象分配给显示对象。  
 * 要修改舞台或 root 对象的透视投影，请执行下列操作：使用 root 显示对象的 transform.matrix 属性以访问 PerspectiveProjection 对象。或者，通过设置显示对象的父级的透视投影属性，对显示对象应用不同的透视投影属性。子显示对象会继承新属性。具体而言，创建一个 PerspectiveProjection 对象并设置其属性，然后将此 PerspectiveProjection 对象分配给父显示对象的 transform 属性的 perspectiveProjection 属性。然后，指定的投影转换将应用于显示对象的所有三维子级。  
 * 由于 PerspectiveProjection 对象和 Matrix3D 对象都会执行透视转换，因此不要将二者同时分配给显示对象。将 PerspectiveProjection 对象用于焦距和投影中心更改。要获取对透视转换的更多控制，请创建透视投影 Matrix3D 对象。
 * 
 * *为了统一计算方式，内部实现将matrix、perspectiveProjection等转换为了Matrix3D 对象*
 */
export class Transform {
    #target: DisplayObject;
    #colorTransform = new ColorTransform();
    /** 一个 ColorTransform 对象，其中包含整体调整显示对象颜色的值。 */
    get colorTransform() {
        return this.#colorTransform;
    }
    set colorTransform(v) {
        this.#colorTransform = v;
        this.#target.filters = <any>[...this.#target.filters.filter(d => !(d instanceof ColorTransform)), this.#colorTransform];
    }
    /** 一个 ColorTransform 对象，表示应用于此显示对象及其所有父级对象的组合颜色转换，回到根级别。如果在不同级别上应用了不同的颜色转换，则将其中所有转换连接成此属性的一个 ColorTransform 对象。 */
    get concatenatedColorTransform() {
        return this.colorTransform;
    }
    /** 一个 Matrix 对象，表示此显示对象及其所有父级对象的组合转换矩阵，回到根级别。如果在不同级别上应用了不同的转换矩阵，则将其中所有矩阵连接成此属性的一个矩阵。此外，对于浏览器中运行的可调整大小的 SWF 内容，此属性将因调整窗口大小而造成的舞台坐标与窗口坐标之差视为重要因素。因此，该属性将局部坐标转换为窗口坐标，后者可能与舞台的坐标空间不同。 */
    get concatenatedMatrix() {
        return this.#matrix3D;
    }
    get matrix() {
        const { rawData: [a, b, , , c, d, , , , , , , tx, ty] } = this.matrix3D;
        return new Matrix(a, b, c, d, tx, ty);
    }
    /**
     * 一个 Matrix 对象，其中包含更改显示对象的缩放、旋转和平移的值。  
     * 如果将 matrix 属性设置为某个值（非 null），则 matrix3D 属性为 null。如果将 matrix3D 属性设置为某个值（非 null），则 matrix 属性为 null。
     */
    set matrix(v) {
        const { a, b, c, d, tx, ty } = v;
        this.matrix3D = new Matrix3D([a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1]);
    }
    #matrix3D = new Matrix3D();
    get matrix3D() {
        return this.#matrix3D;
    }
    /**
     * 提供对三维显示对象的 Matrix3D 对象的访问。Matrix3D 对象表示一个转换矩阵，它确定显示对象的位置和方向。Matrix3D 对象还可以执行透视投影。  
     * 如果将 matrix 属性设置为某个值（非 null），则 matrix3D 属性为 null。如果将 matrix3D 属性设置为某个值（非 null），则 matrix 属性为 null。
     */
    set matrix3D(v) {
        this.#matrix3D = v;
        const { rawData } = v;
        // 提取移动因子
        this.#target.x = rawData[12];
        this.#target.y = rawData[13];
        // 提取缩放因子
        this.#target.scaleX = Math.hypot(rawData[0], rawData[1], rawData[2]);
        this.#target.scaleY = Math.hypot(rawData[4], rawData[5], rawData[6]);
        this.#target.scaleZ = Math.hypot(rawData[8], rawData[9], rawData[10]);
        // 检查矩阵是否为左手坐标系（行列式为负）
        const det = rawData[0] * (rawData[5] * rawData[10] - rawData[6] * rawData[9]) -
            rawData[1] * (rawData[4] * rawData[10] - rawData[6] * rawData[8]) +
            rawData[2] * (rawData[4] * rawData[9] - rawData[5] * rawData[8]);

        if (det < 0) {
            this.#target.scaleX = -this.#target.scaleX;
        }
        // 创建归一化的旋转矩阵（去除缩放影响）
        const rotMatrix = [
            rawData[0] / this.#target.scaleX, rawData[1] / this.#target.scaleX, rawData[2] / this.#target.scaleX, 0,
            rawData[4] / this.#target.scaleY, rawData[5] / this.#target.scaleY, rawData[6] / this.#target.scaleY, 0,
            rawData[8] / this.#target.scaleZ, rawData[9] / this.#target.scaleZ, rawData[10] / this.#target.scaleZ, 0,
            0, 0, 0, 1
        ];
        // 使用欧拉角分解旋转矩阵（ZXY 顺序，对应 Flash 的旋转顺序）
        if (Math.abs(rotMatrix[8]!) < 0.99999) {
            this.#target.rotationY = Math.asin(rotMatrix[8]!);
            const cosY = Math.cos(this.#target.rotationY);

            if (cosY !== 0) {
                this.#target.rotationX = Math.atan2(-rotMatrix[9]!, rotMatrix[10]!);
                this.#target.rotationZ = Math.atan2(-rotMatrix[4]!, rotMatrix[0]!);
            } else {
                // 万向节锁情况
                this.#target.rotationX = 0;
                this.#target.rotationZ = Math.atan2(rotMatrix[1]!, rotMatrix[5]!);
            }
        } else {
            // 另一种万向节锁情况
            this.#target.rotationZ = 0;

            if (rotMatrix[8]! > 0) {
                this.#target.rotationY = Math.PI / 2;
                this.#target.rotationX = this.#target.rotationZ + Math.atan2(rotMatrix[2]!, rotMatrix[10]!);
            } else {
                this.#target.rotationY = -Math.PI / 2;
                this.#target.rotationX = -this.#target.rotationZ + Math.atan2(-rotMatrix[2]!, rotMatrix[10]!);
            }
        }

    }
    /**
     * 提供对三维显示对象的 PerspectiveProjection 对象的访问。可以使用 PerspectiveProjection 对象修改舞台的透视转换，也可以将透视转换分配给显示对象的所有三维子级。  
     * 基于视野和舞台的高宽比（尺寸），将默认的 PerspectiveProjection 对象分配给 root 对象。
     */
    get perspectiveProjection() {
        const { rawData } = this.matrix3D;
        const res = new PerspectiveProjection();
        res.focalLength = rawData[11];
        res.projectionCenter = new Point(rawData[2], rawData[6]);
        return res;
    };
    set perspectiveProjection(v) {
        this.matrix3D = v.toMatrix3D();
    }
    /** 一个 Rectangle 对象，它定义舞台上的显示对象的边界矩形。 */
    get pixelBounds() {
        return new Rectangle(this.#target.x, this.#target.y, this.#target.width, this.#target.height);
    }
    /**
     * 返回一个 Matrix3D 对象，该对象可以相对于当前显示对象的空间转换指定显示对象的空间。可以使用 getRelativeMatrix3D() 方法，将一个三维显示对象相对于另一个三维显示对象移动。
     * 
     * @param param0 相对于其发生转换的显示对象。要获取相对于舞台的 Matrix3D 对象，请将该参数设置为 root 或 stage 对象。要获取显示对象的相对于现实世界的矩阵，请将该参数设置为一个已应用透视转换的显示对象。
     * @returns 一个 Matrix3D 对象，该对象可用于将 relativeTo 显示对象的空间转换为当前显示对象的空间。
     */
    getRelativeMatrix3D({ x, y, z, scaleX, scaleY, scaleZ }: DisplayObject) {
        return new Matrix3D([
            scaleX, 0, 0, x,
            0, scaleY, 0, y,
            0, 0, scaleZ, z,
            0, 0, 0, 1,
        ]);
    }
    constructor(
        target: DisplayObject,
    ) {
        this.#target = target;
    }
}