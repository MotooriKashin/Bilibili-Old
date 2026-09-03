import { Matrix3D } from "./Matrix3D";
import { Vector3D } from "./Vector3D";

/**
 * 朝着某个位置插补对象的方向。pointTowards() 方法结合了 Matrix3D.pointAt() 和 Matrix3D.interpolateTo() 方法的功能。  
 * pointTowards() 方法允许对方向进行就地修改。此方法将对显示对象的 Matrix3D 进行分解，并将旋转元素替换为可使对象朝着目标位置进行不同的百分比转变的元素。此对象可以在仍按自己的方向移动的同时，逐步向目标转变。对 pointTowards() 的连续调用（后跟一个转换方法）可生成对象追逐或紧随移动的目标运动的动画。首先将对象指向一个朝向目标的百分比点，然后沿某个轴逐步移动对象。
 * 
 * @param percent 一个介于 0 和 1 之间的数字，它使对象逐步朝着目标转变。
 * @param mat 转换的对象的 Matrix3D 属性。
 * @param pos 目标对象的相对于现实世界的位置。相对于现实世界定义了相对于所有对象所在的现实世界空间和坐标的对象转换。
 * @param at 用于定义显示对象所指向的位置的相对于对象的矢量。相对于对象定义了相对于对象空间（即对象自己的参照帧和坐标系统）的对象转换。默认值为 (0,0,-1)。
 * @param up 用于为显示对象定义“向上”方向的相对于对象的矢量。如果从上至下绘制对象，则 +z 轴为该对象的“up”矢量。相对于对象定义了相对于对象空间（即对象自己的参照帧和坐标系统）的对象转换。默认值为 (0,-1,0)。
 * @returns 第二个参数中指定的 Matrix3D 对象的修改后版本。要使用 pointTowards() 方法转换显示对象，请将显示对象的 Matrix3D 属性设置为返回的 Matrix3D 对象。
 */
export function pointTowards(percent: number, mat: Matrix3D, pos: Vector3D, at = new Vector3D(), up = new Vector3D(0, 1, 0)) {
    // 计算目标方向
    const zAxis = at.subtract(pos);
    zAxis.normalize();

    // 计算正交基
    let xAxis = up.crossProduct(zAxis);
    if (xAxis.length < 0.0001) {
        // 如果目标方向与上方向平行，使用备用上方向
        xAxis = new Vector3D(0, 0, 1).crossProduct(zAxis);
    }
    xAxis.normalize();

    const yAxis = zAxis.crossProduct(xAxis);

    // 创建目标矩阵
    const targetMat = new Matrix3D([
        xAxis.x, yAxis.x, zAxis.x, 0,
        xAxis.y, yAxis.y, zAxis.y, 0,
        xAxis.z, yAxis.z, zAxis.z, 0,
        pos.x, pos.y, pos.z, 1,
    ]);

    // 插值当前矩阵和目标矩阵
    if (percent < 1) {
        Matrix3D.interpolate(mat, targetMat, percent);
    } else {
        mat.copyFrom(targetMat);
    }

    return mat;
}

/**
 * 利用投影 Matrix3D 对象，将 Vector3D 对象从一个空间坐标投影到另一个空间坐标。projectVector() 方法与 Matrix3D.transformVector() 方法类似，只不过 projectVector() 方法将按照投影深度值来划分原始 Vector3D 对象的 x、y 和 z 元素。深度值是指视图或视角空间中从视点到 Vector3D 对象的距离。此距离的默认值为 z 元素的值。
 * 
 * @param m 一个用于实现投影转换的投影 Matrix3D 对象。如果某个显示对象中包含 PerspectiveProjection 对象，则可以使用 perspectiveProjection.toMatrix() 方法生成适用于该显示对象的子级的投影 Matrix3D 对象。对于更高级的投影，请使用 matrix3D.rawData 属性创建自定义投影矩阵。不存在用于创建投影 Matrix3D 对象的内置的 Matrix3D 方法。
 * @param v 投影到新的空间坐标的 Vector3D 对象。
 * @returns 一个具有转换后的空间坐标的新 Vector3D。
 */
export function projectVector(m: Matrix3D, v: Vector3D) {
    // 应用矩阵变换
    const transformed = m.transformVector(v);

    // 透视除法
    const wInv = 1 / transformed.w;
    const [projectedX, projectedY, projectedZ] = [transformed.x * wInv, transformed.y * wInv, transformed.z * wInv];

    return new Vector3D(projectedX, projectedY, projectedZ, 1);
}

/**
 * 利用投影 Matrix3D 对象，将一个三维空间坐标矢量 (verts) 投影到一个二维空间坐标矢量 (projectedVerts)。在将投影的 Vector 对象用作参数之前，应预先分配该对象。  
 * projectVectors() 方法还会设置 uvt 数据的 t 值。应预先分配一个矢量，并且该矢量应可以容纳每个投影的坐标集矢量的 uvts 数据。还应指定 uvt 数据的 u 和 v 值。uvt 数据是一个用于纹理映射的标准化坐标矢量。对于 UV 坐标，(0,0) 是位图的左上角，(1,1) 是位图的右下角。  
 * 可将此方法与 Graphics.drawTriangles() 方法和 GraphicsTrianglePath 类配合使用。
 * 
 * @param m 一个用于实现投影转换的投影 Matrix3D 对象。可以使用 Matrix3D.rawData 属性生成投影 Matrix3D 对象。
 * @param verts 一个由数字构成的矢量，其中的每三个数字表示一个三维空间的 x、y 和 z 坐标，如 Vector3D(x,y,z)。
 * @param projectedVerts 一个由数字构成的矢量，其中的每两个数字表示一个投影的二维坐标，如 Point(x,y)。应预先分配相应的矢量。projectVectors() 方法将为每个投影的点填充值。
 * @param uvts 一个由数字构成的矢量，其中的每三个数字表示 uvt 数据的 u、v 和 t 元素。u 和 v 是每个投影的点的纹理坐标。t 值为投影深度值，即视图或视角空间中从视点到 Vector3D 对象的距离。应预先分配相应的矢量并指定 u 和 v 值。projectVectors 方法将为每个投影的点填充 t 值。
 */
export function projectVectors(m: Matrix3D, verts: number[], projectedVerts: number[], uvts: number[]) {
    // 确保输出数组有足够空间
    if (projectedVerts.length < verts.length) {
        projectedVerts.length = verts.length;
    }

    // 临时向量用于变换
    const tempVec = new Vector3D();

    // 遍历所有顶点
    for (let i = 0; i < verts.length; i += 3) {
        // 设置临时向量
        tempVec.x = verts[i]!;
        tempVec.y = verts[i + 1]!;
        tempVec.z = verts[i + 2]!;
        tempVec.w = 1;

        // 应用变换
        const transformed = m.transformVector(tempVec);

        // 透视除法
        const wInv = 1 / transformed.w;

        // 存储投影结果
        projectedVerts[i] = transformed.x * wInv;
        projectedVerts[i + 1] = transformed.y * wInv;
        projectedVerts[i + 2] = transformed.z * wInv;

        // 如果提供了UV坐标，进行简单的透视校正
        if (uvts && i < uvts.length) {
            const [u, v] = [uvts[i]!, uvts[i + 1]!];

            uvts[i] = u * wInv;
            uvts[i + 1] = v * wInv;
        }
    }
}