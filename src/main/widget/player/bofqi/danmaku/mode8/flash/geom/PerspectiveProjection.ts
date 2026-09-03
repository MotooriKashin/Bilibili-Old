import { Matrix3D } from "./Matrix3D";
import { Point } from "./Point";

/**
 * 利用 PerspectiveProjection 类，可以轻松分配或修改显示对象及其所有子级的透视转换。对于更加复杂的或自定义的透视转换，请使用 Matrix3D 类。PerspectiveProjection 类提供了基本的三维演示属性，而 Matrix3D 类提供了针对显示对象的三维演示的更细化的控制。  
 * 投影是一种用于在二维空间内表示三维对象的方式，例如，投影到计算机屏幕上的立方体。透视投影使用视见平截头体（四棱锥）来建模并将三维世界及其对象投影到屏幕上。随着视见平截头体远离视点原点，它会变得越来越宽。视点原点可以是面向屏幕的摄像头或观察者的眼睛。投影透视会在深度和距离上产生三维错觉，其中接近屏幕的对象比远离屏幕的对象要大得多。
 */
export class PerspectiveProjection {
    /**
     * 为三维视野指定一个角度（介于 0 度到 180 度之间）。此值可确定应用于具有非零 z 坐标的三维显示对象的透视转换和扭曲的强度。  
     * 若角度接近于 0，则表示屏幕的二维 x 和 y 坐标与三维 x、y 和 z 坐标大致相同，只不过具有少许扭曲或无扭曲。换句话说，若角度较小，则沿 z 轴下移的显示对象看起来大小不变且移动距离很小。  
     * 若值接近于 180 度，则会产生鱼眼镜头效果，即 z 值小于 0 的位置将被放大，而 z 值大于 0 的位置将被最小化。若角度较大，则沿 z 轴下移的显示对象看起来大小变化很快且移动距离很大。如果视野设置为 0 或 180，则屏幕上不会显示任何内容。
     */
    fieldOfView = 60;
    get focalLength() {
        return 1 / Math.tan((this.fieldOfView / 2) * Math.PI / 180);
    }
    /** 眼睛或视点的原点 (0,0,0) 与位于 z 轴的显示对象之间的距离。在透视转换过程中，将使用视野的角度和舞台的高宽比（舞台宽度除以舞台高度）来自动计算 focalLength。 */
    set focalLength(v) {
        this.fieldOfView = (2 * Math.atan(1 / v)) * 180 / Math.PI;
    }
    /**
     * 表示投影中心的二维点，它是显示对象的消失点。  
     * projectionCenter 属性是相对于默认注册点（即舞台左上角的点 (0,0)）的偏移量。默认的投影转换中心位于舞台中间，这意味着当三维显示对象沿 z 轴后移时，这些对象会朝着舞台中心消失。
     */
    projectionCenter = new Point(0, 0);
    /**
     * 返回显示对象的基本 Matrix3D 对象。  
     * 显示对象（例如 root 对象）可以包含 PerspectiveProjection 对象，而无需为其转换定义 Matrix3D 属性。实际上，将使用 PerspectiveProjection 或 Matrix3D 对象指定透视转换。如果在使用 PerspectiveProjection 对象时需要 Matrix3D 对象，则 toMatrix3D() 方法可以检索显示对象的基本 Matrix3D 对象。例如，toMatrix3D() 方法可以与 Utils3D.projectVectors() 方法配合使用。
     * 
     * @returns 基本 Matrix3D 对象。
     */
    toMatrix3D() {
        const [far, near] = [1000, 0.1];
        const { x, y } = this.projectionCenter;
        return new Matrix3D([
            this.focalLength, 0, x, 0,
            0, this.focalLength, y, 0,
            0, 0, -(far + near) / (far - near), -1,
            0, 0, -2 * far * near / (far - near), 0,
        ]);
    }
}