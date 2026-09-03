import { Orientation3D } from "./Orientation3D";
import { Vector3D } from "./Vector3D";

/**
 * Matrix3D 类表示一个转换矩阵，该矩阵确定三维 (3D) 显示对象的位置和方向。该矩阵可以执行转换功能，包括平移（沿 x、y 和 z 轴重新定位）、旋转和缩放（调整大小）。Matrix3D 类还可以执行透视投影，这会将 3D 坐标空间中的点映射到二维 (2D) 视图。  
 * 单一矩阵可以将多个转换组合在一起，并一次性对 3D 显示对象应用这些转换。例如，可以将一个矩阵应用于 3D 坐标，以便依次执行旋转和平移。  
 * 当明确设置一个显示对象的 z 属性或任何旋转或缩放属性时，将自动创建相应的 Matrix3D 对象。  
 * 可以通过 transform.matrix3d 属性访问 3D 显示对象的 Matrix3D 对象。2D 对象不具有 Matrix3D 对象。  
 * 2D 对象的 z 属性的值为零，并且其 matrix3D 属性的值为 null。  
 * **注意**：如果将同一 Matrix3D 对象分配给两个不同的显示对象，则将引发运行时错误。  
 * Matrix3D 类使用一个 4x4 正方形矩阵，即一个由四行和四列数字构成的表，其中容纳了用于转换的数据。矩阵的前三行容纳每个 3D 轴 (x,y,z) 的数据。平移信息位于最后一列中。方向和缩放数据位于前三个列中。缩放因子是位于前三个列中的对角数字。以下是 Matrix3D 元素的表示形式：
 * | | | | |
 * | - | - | - | - |
 * | scaleX | 0 | 0 | tx |
 * | 0 | scaleY | 0 | ty |
 * | 0 | 0 | scaleZ | tz |
 * | 0 | 0 | 0 | tw |
 * 
 * 无需了解矩阵数学，即可使用 Matrix3D 类。该类提供了一些用于简化转换和投影任务的特定方法，例如 appendTranslation()、appendRotation() 或 interpolateTo() 方法。还可以使用 decompose() 和 recompose() 方法或 rawData 属性来访问基础矩阵元素。  
 * 显示对象会对其轴旋转属性进行缓存，以便使每个轴具有单独的旋转并管理不同的旋转组合。若调用 Matrix3D 对象的某一方法来转换显示对象，则该对象的旋转缓存无效。
 */
export class Matrix3D {
    /**
     * 一个用于确定矩阵是否可逆的数字。  
     * Matrix3D 对象必须是可逆的。可以使用 determinant 属性确保 Matrix3D 对象是可逆的。如果行列式为零，则矩阵没有逆矩阵。例如，如果矩阵的整个行或列为零，或如果两个行或列相等，则行列式为零。行列式还可用于对一系列方程进行求解。  
     * 仅正方形矩阵（例如 Matrix3D 类）具有行列式。
     */
    get determinant() {
        const [
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33
        ] = this.rawData;

        return m00 * (m11 * m22 * m33 - m11 * m23 * m32 - m21 * m12 * m33 +
            m21 * m13 * m32 + m31 * m12 * m23 - m31 * m13 * m22)
            - m10 * (m01 * m22 * m33 - m01 * m23 * m32 - m21 * m02 * m33 +
                m21 * m03 * m32 + m31 * m02 * m23 - m31 * m03 * m22)
            + m20 * (m01 * m12 * m33 - m01 * m13 * m32 - m11 * m02 * m33 +
                m11 * m03 * m32 + m31 * m02 * m13 - m31 * m03 * m12)
            - m30 * (m01 * m12 * m23 - m01 * m13 * m22 - m11 * m02 * m23 +
                m11 * m03 * m22 + m21 * m02 * m13 - m21 * m03 * m12);
    }
    /**
     * 一个保存显示对象在转换参照帧中的 3D 坐标 (x,y,z) 位置的 Vector3D 对象。利用 position 属性，可立即访问显示对象矩阵的平移矢量，而无需分解和重新组合矩阵。  
     * 利用 position 属性，可以获取和设置转换矩阵的平移元素。
     */
    get position() {
        return new Vector3D(this.rawData[12], this.rawData[13], this.rawData[14]);
    }
    set position({ x, y, z }) {
        this.rawData[12] = x;
        this.rawData[13] = y;
        this.rawData[14] = z;
    }
    /**
     * 一个由 16 个数字组成的矢量，其中，每四个元素可以是 4x4 矩阵的一列。  
     * 如果 rawData 属性设置为一个不可逆的矩阵，则会引发异常。Matrix3D 对象必须是可逆的。如果需要不可逆的矩阵，请创建 Matrix3D 对象的子类。
     */
    rawData: IMatrix3D;
    /**
     * 创建 Matrix3D 对象。可以使用一个由 16 个数字组成的矢量来初始化 Matrix3D 对象，其中，每四个元素可以是一列。创建 Matrix3D 对象之后，可以使用 rawData 属性访问该对象的矩阵元素。  
     * 如果未定义任何参数，则构造函数会生成一个恒等或单位 Matrix3D 对象。在矩阵表示法中，恒等矩阵中的主对角线位置上的所有元素的值均为一，而所有其他元素的值均为零。恒等矩阵的 rawData 属性的值为 1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1。恒等矩阵的位置或平移值为 Vector3D(0,0,0)，旋转设置为 Vector3D(0,0,0)，缩放值为 Vector3D(1,1,1)。
     * 
     * @param v (default = null) — 一个由 16 个数字组成的矢量，其中，每四个元素可以是 4x4 矩阵的一列。
     */
    constructor(v: IMatrix3D = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) {
        this.rawData = v;
    }
    /**
     * 通过将另一个 Matrix3D 对象与当前 Matrix3D 对象相乘来后置一个矩阵。得到的结果将合并两个矩阵转换。可以将一个 Matrix3D 对象与多个矩阵相乘。最终的 Matrix3D 对象将包含所有转换的结果。  
     * 矩阵乘法运算与矩阵加法运算不同。矩阵乘法运算是不可交换的。换句话说，A 乘以 B 并不等于 B 乘以 A。在使用 append() 方法时，乘法运算将从左侧开始，这意味着 lhs Matrix3D 对象位于乘法运算符的左侧。  
     * ```
     * thisMatrix = lhs * thisMatrix;
     * ```
     * 首次调用 append() 方法时，此方法会对父级空间进行相关修改。后续调用与后置的 Matrix3D 对象的参照帧相关。  
     * append() 方法会将当前矩阵替换为后置的矩阵。如果要后置两个矩阵，而不更改当前矩阵，请使用 clone() 方法复制当前矩阵，然后对生成的副本应用 append() 方法。
     * @param param0 
     */
    append({ rawData }: Matrix3D) {
        const result = <IMatrix3D><unknown>[];
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                result[col * 4 + row] = [0, 1, 2, 3].reduce(
                    (sum, i) => sum + this.rawData[i * 4 + row]! * rawData[col * 4 + i]!,
                    0
                );
            }
        }
        this.rawData = result;
    }
    /**
     * 在 Matrix3D 对象上后置一个增量旋转。在将 Matrix3D 对象应用于显示对象时，矩阵会在 Matrix3D 对象中先执行其他转换，再执行旋转。  
     * 显示对象的旋转由以下元素定义：一个轴、绕该轴旋转的增量角度和对象旋转中心的可选轴点。轴可以是任何常规方向。常见的轴为 X_AXIS (Vector3D(1,0,0))、Y_AXIS (Vector3D(0,1,0)) 和 Z_AXIS (Vector3D(0,0,1))。在航空术语中，有关 y 轴的旋转称为偏航。有关 x 轴的旋转称为俯仰。有关 z 轴的旋转称为翻滚。  
     * 转换的顺序很重要。先旋转再平移的转换所产生的效果与先平移再旋转的转换所产生的效果不同。  
     * 旋转效果不是绝对效果。它与当前位置和方向相关。要确保对转换矩阵进行绝对更改，请使用 recompose() 方法。appendRotation() 方法也与显示对象的轴旋转属性（例如 rotationX 属性）不同。旋转属性始终先于任何平移执行，而 appendRotation() 方法相对于矩阵中已存在的内容执行。要确保获得与显示对象的轴旋转属性类似的效果，请使用 prependRotation() 方法，该方法会在矩阵中先执行旋转，然后再执行其他转换。  
     * 在将 appendRotation() 方法的转换应用于显示对象的 Matrix3D 对象时，缓存的显示对象旋转属性值无效。  
     * 一种用于让一个显示对象绕相对于其位置的特定点旋转的方法是：将该对象平移设置为指定的点，使用 appendRotation() 方法旋转该对象，然后将该对象向后平移到原始位置。在下面的示例中，myObject 3D 显示对象将围绕坐标 (10,10,0) 进行 y 轴旋转。
     * 
     * @param degrees 旋转的角度。
     * @param param1 旋转的轴或方向。常见的轴为 X_AXIS (Vector3D(1,0,0))、Y_AXIS (Vector3D(0,1,0)) 和 Z_AXIS (Vector3D(0,0,1))。此矢量的长度应为 1。
     * @param pivotPoint (default = null) — 用于确定对象的旋转中心的点。对象的默认轴点为该对象的注册点。
     */
    appendRotation(degrees: number, { x, y, z }: Vector3D, pivotPoint?: Vector3D) {
        // 规范化轴向量
        const len = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        if (len === 0) throw new Error("旋转轴不能为零向量");

        [x, y, z] = [x / len, y / len, z / len];
        const cos = Math.cos(degrees);
        const sin = Math.sin(degrees);
        const oneMinusCos = 1 - cos;

        // 创建轴角旋转矩阵
        const rotMatrix = new Matrix3D([
            cos + x * x * oneMinusCos,
            x * y * oneMinusCos - z * sin,
            x * z * oneMinusCos + y * sin,
            0,
            y * x * oneMinusCos + z * sin,
            cos + y * y * oneMinusCos,
            y * z * oneMinusCos - x * sin,
            0,
            z * x * oneMinusCos - y * sin,
            z * y * oneMinusCos + x * sin,
            cos + z * z * oneMinusCos,
            0,
            0, 0, 0, 1
        ]);

        if (pivotPoint) {
            const { x, y, z } = pivotPoint;
            rotMatrix.appendTranslation(x, y, z);
        }
        this.append(rotMatrix);
    }
    /**
     * 在 Matrix3D 对象上后置一个增量缩放，沿 x、y 和 z 轴改变位置。在将 Matrix3D 对象应用于显示对象时，矩阵会在 Matrix3D 对象中先执行其他转换，然后再执行缩放更改。默认的缩放系数为 (1.0, 1.0, 1.0)。  
     * 缩放将作为沿三个轴（x、y、z）进行的三个增量更改集进行定义。可以将每个轴与不同的数字相乘。在将缩放更改应用于显示对象时，该对象的大小会增大或减小。例如，将 x、y 和 z 轴设置为 2 将使对象大小为原来的两倍，而将轴设置为 0.5 将使对象的大小为原来的一半。要确保缩放转换只影响特定的轴，请将其他参数设置为 1。参数为 1 表示不沿特定的轴进行任何缩放更改。  
     * appendScale() 方法可用于调整大小和管理扭曲（例如显示对象的拉伸或收缩），或用于某个位置上的放大和缩小。在显示对象的旋转和平移过程中，将自动执行缩放转换。  
     * 转换的顺序很重要。先调整大小再平移的转换所产生的效果与先平移再调整大小的转换所产生的效果不同。
     * 
     * @param xScale 用于沿 x 轴缩放对象的乘数。
     * @param yScale 用于沿 y 轴缩放对象的乘数。
     * @param zScale 用于沿 z 轴缩放对象的乘数。
     */
    appendScale(xScale: number, yScale: number, zScale: number) {
        this.append(new Matrix3D([xScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1]));
    }
    /**
     * 在 Matrix3D 对象上后置一个增量平移，沿 x、y 和 z 轴重新定位。在将 Matrix3D 对象应用于显示对象时，矩阵会在 Matrix3D 对象中先执行其他转换，然后再执行平移更改。  
     * 平移将作为沿三个轴（x、y、z）进行的三个增量更改集进行定义。在对显示对象应用转换时，显示对象会从当前位置沿 x、y 和 z 轴按参数指定的增量移动。要确保平移只影响特定的轴，请将其他参数设置为零。参数为零表示不沿特定的轴进行任何更改。  
     * 平移更改不是绝对更改。它们与矩阵的当前位置和方向相关。要确保对转换矩阵进行绝对更改，请使用 recompose() 方法。转换的顺序也很重要。先平移再旋转的转换所产生的效果与先旋转再平移所产生的效果不同。
     * 
     * @param x 沿 x 轴的增量平移。
     * @param y 沿 y 轴的增量平移。
     * @param z 沿 z 轴的增量平移。
     */
    appendTranslation(x: number, y: number, z: number) {
        this.append(new Matrix3D([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]));
    }
    /**
     * 返回一个新 Matrix3D 对象，它是与当前 Matrix3D 对象完全相同的副本。
     * 
     * @returns 一个新 Matrix3D 对象，它是与当前 Matrix3D 对象完全相同的副本。
     */
    clone() {
        return new Matrix3D([...this.rawData]);
    }
    /**
     * 将 Vector3D 对象复制到调用方 Matrix3D 对象的特定列中。
     * 
     * @param column 副本的目标列。
     * @param param1 要从中复制数据的 Vector3D 对象。
     */
    copyColumnFrom(column: number, { x, y, z, w }: Vector3D) {
        switch (column) {
            case 0: {
                this.rawData[0] = x;
                this.rawData[1] = y;
                this.rawData[2] = z;
                this.rawData[3] = w;
                break;
            }
            case 1: {
                this.rawData[4] = x;
                this.rawData[5] = y;
                this.rawData[6] = z;
                this.rawData[7] = w;
                break;
            }
            case 2: {
                this.rawData[8] = x;
                this.rawData[9] = y;
                this.rawData[10] = z;
                this.rawData[11] = w;
                break;
            }
            case 3: {
                this.rawData[12] = x;
                this.rawData[13] = y;
                this.rawData[14] = z;
                this.rawData[15] = w;
                break;
            }
        }
    }
    /**
     * 将调用方 Matrix3D 对象的特定列复制到 Vector3D 对象中。
     * 
     * @param column 要从中复制数据的列。
     * @param vector3D 副本的目标 Vector3D 对象。
     */
    copyColumnTo(column: number, vector3D: Vector3D) {
        switch (column) {
            case 0: {
                vector3D.x = this.rawData[0];
                vector3D.y = this.rawData[1];
                vector3D.z = this.rawData[2];
                vector3D.w = this.rawData[3];
                break;
            }
            case 1: {
                vector3D.x = this.rawData[4];
                vector3D.y = this.rawData[5];
                vector3D.z = this.rawData[6];
                vector3D.w = this.rawData[7];
                break;
            }
            case 2: {
                vector3D.x = this.rawData[8];
                vector3D.y = this.rawData[9];
                vector3D.z = this.rawData[10];
                vector3D.w = this.rawData[11];
                break;
            }
            case 3: {
                vector3D.x = this.rawData[12];
                vector3D.y = this.rawData[13];
                vector3D.z = this.rawData[14];
                vector3D.w = this.rawData[15];
                break;
            }
        }
    }
    /**
     * 将源 Matrix3D 对象中的所有矩阵数据复制到调用方 Matrix3D 对象中。
     * 
     * @param param0 要从中复制数据的 Matrix3D 对象。
     */
    copyFrom({ rawData }: Matrix3D) {
        this.rawData = [...rawData];
    }
    /**
     * 将源 Vector 对象中的所有矢量数据复制到调用方 Matrix3D 对象中。利用可选索引参数，您可以选择矢量中的任何起始文字插槽。
     * 
     * @param vector 要从中复制数据的 Vector 对象。
     * @param index 起始索引
     * @param transpose 行和列互换
     */
    copyRawDataFrom(vector: number[], index = 0, transpose = false) {
        if (transpose) this.transpose();
        const l = vector.length - index;
        {
            let _g = 0;
            while (_g < l) {
                const c = _g++;
                this.rawData[c] = vector[c + index]!;
            }
        };
        if (transpose) this.transpose();
    }
    /**
     * 将调用方 Matrix3D 对象中的所有矩阵数据复制到提供的矢量中。利用可选索引参数，您可以选择矢量中的任何目标起始文字插槽。
     * 
     * @param vector 要从中复制数据的 Vector 对象。
     * @param index 起始索引
     * @param transpose 行和列互换
     */
    copyRawDataTo(vector: number[], index = 0, transpose = false) {
        if (transpose) this.transpose();
        const l = this.rawData.length;
        {
            let _g = 0;
            while (_g < l) {
                const c = _g++;
                vector[c + index] = this.rawData[c]!;
            }
        };
        if (transpose) this.transpose();
    }
    /**
     * 将 Vector3D 对象复制到调用方 Matrix3D 对象的特定行中。
     * 
     * @param row 要将数据复制到的行。
     * @param param1 要从中复制数据的 Vector3D 对象。
     */
    copyRowFrom(row: number, { x, y, z, w }: Vector3D) {
        switch (row) {
            case 0: {
                this.rawData[0] = x;
                this.rawData[4] = y;
                this.rawData[8] = z;
                this.rawData[12] = w;
                break;
            }
            case 1: {
                this.rawData[1] = x;
                this.rawData[5] = y;
                this.rawData[9] = z;
                this.rawData[13] = w;
                break;
            }
            case 2: {
                this.rawData[2] = x;
                this.rawData[6] = y;
                this.rawData[10] = z;
                this.rawData[14] = w;
                break;
            }
            case 3: {
                this.rawData[3] = x;
                this.rawData[7] = y;
                this.rawData[11] = z;
                this.rawData[15] = w;
                break;
            }
        }
    }
    /**
     * 将调用方 Matrix3D 对象的特定行复制到 Vector3D 对象中。
     * 
     * @param row 要从中复制数据的行。
     * @param vector3D 将作为数据复制目的地的 Vector3D 对象。
     */
    copyRowTo(row: number, vector3D: Vector3D) {
        switch (row) {
            case 0: {
                vector3D.x = this.rawData[0];
                vector3D.y = this.rawData[4];
                vector3D.z = this.rawData[8];
                vector3D.w = this.rawData[12];
                break
            }
            case 1: {
                vector3D.x = this.rawData[1];
                vector3D.y = this.rawData[5];
                vector3D.z = this.rawData[9];
                vector3D.w = this.rawData[13];
                break
            }
            case 2: {
                vector3D.x = this.rawData[2];
                vector3D.y = this.rawData[6];
                vector3D.z = this.rawData[10];
                vector3D.w = this.rawData[14];
                break
            }
            case 3: {
                vector3D.x = this.rawData[3];
                vector3D.y = this.rawData[7];
                vector3D.z = this.rawData[11];
                vector3D.w = this.rawData[15];
                break
            }
        }
    }
    /**
     * 将目标 Matrix3D 复刻为当前 Matrix3D 对象
     * 
     * @param dest 目标 Matrix3D
     */
    copyToMatrix3D(dest: Matrix3D) {
        dest.rawData = [...this.rawData];
    }
    /**
     * 将转换矩阵的平移、旋转和缩放设置作为由三个 Vector3D 对象组成的矢量返回。第一个 Vector3D 对象容纳平移元素。第二个 Vector3D 对象容纳旋转元素。第三个 Vector3D 对象容纳缩放元素。  
     * 一些 Matrix3D 方法（例如 interpolateTo() 方法）会自动分解和重新组成矩阵以执行其转换。  
     * 要使用绝对父级参照帧来修改矩阵转换，请使用 decompose() 方法检索设置，然后做出适当的更改。然后，可以使用 recompose() 方法将 Matrix3D 对象设置为修改后的转换。  
     * decompose() 方法的参数指定要用于转换的方向样式。默认方向为 eulerAngles，它通过三个不同的对应于每个轴的旋转角来定义方向。这些旋转是连续发生的，并且相互不更改轴。显示对象的轴旋转属性执行欧拉角方向样式转换。另外两个方向样式选项分别为 axisAngle 和 quaternion。轴角方向结合使用轴和角度来确定方向。对象绕其旋转的轴是一个单位矢量，它表示一个方向。角表示有关矢量的旋转幅度。方向还确定显示对象面对的方向，而角确定哪个方向是向上。appendRotation() 和 prependRotation() 方法使用轴角方向。四元数方向使用复数和矢量的第四个元素。方向由三个旋转轴（x、y、z）和一个旋转角 (w) 表示。interpolate() 方法使用四元数。
     * 
     * @param orientationStyle 一个可选参数，它确定用于矩阵转换的方向样式。
     * @returns 一个由三个 Vector3D 对象组成的矢量，其中，每个对象分别容纳平移、旋转和缩放设置。
     */
    decompose(orientationStyle = Orientation3D.EULER_ANGLES) {
        const vec: Vector3D[] = [];
        const { rawData } = this.clone();
        const mr = <IMatrix3D>[...rawData];
        const pos = new Vector3D(mr[12], mr[13], mr[14]);
        const scale = new Vector3D();
        scale.x = Math.sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
        scale.y = Math.sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
        scale.z = Math.sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);
        if (mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0) scale.z = -scale.z;
        mr[0] /= scale.x;
        mr[1] /= scale.x;
        mr[2] /= scale.x;
        mr[4] /= scale.y;
        mr[5] /= scale.y;
        mr[6] /= scale.y;
        mr[8] /= scale.z;
        mr[9] /= scale.z;
        mr[10] /= scale.z;
        const rot = new Vector3D();
        switch (orientationStyle) {
            case Orientation3D.AXIS_ANGLE:
                {
                    rot.w = Math.acos((mr[0] + mr[5] + mr[10] - 1) / 2);
                    const len = Math.sqrt((mr[6] - mr[9]) * (mr[6] - mr[9]) + (mr[8] - mr[2]) * (mr[8] - mr[2]) + (mr[1] - mr[4]) * (mr[1] - mr[4]));
                    if (len != 0) {
                        rot.x = (mr[6] - mr[9]) / len;
                        rot.y = (mr[8] - mr[2]) / len;
                        rot.z = (mr[1] - mr[4]) / len;
                    }
                    else rot.x = rot.y = rot.z = 0;
                }
                break;
            case Orientation3D.QUATERNION:
                {
                    const tr = mr[0] + mr[5] + mr[10];
                    if (tr > 0) {
                        rot.w = Math.sqrt(1 + tr) / 2;
                        rot.x = (mr[6] - mr[9]) / (4 * rot.w);
                        rot.y = (mr[8] - mr[2]) / (4 * rot.w);
                        rot.z = (mr[1] - mr[4]) / (4 * rot.w);
                    }
                    else if (mr[0] > mr[5] && mr[0] > mr[10]) {
                        rot.x = Math.sqrt(1 + mr[0] - mr[5] - mr[10]) / 2;
                        rot.w = (mr[6] - mr[9]) / (4 * rot.x);
                        rot.y = (mr[1] + mr[4]) / (4 * rot.x);
                        rot.z = (mr[8] + mr[2]) / (4 * rot.x);
                    }
                    else if (mr[5] > mr[10]) {
                        rot.y = Math.sqrt(1 + mr[5] - mr[0] - mr[10]) / 2;
                        rot.x = (mr[1] + mr[4]) / (4 * rot.y);
                        rot.w = (mr[8] - mr[2]) / (4 * rot.y);
                        rot.z = (mr[6] + mr[9]) / (4 * rot.y);
                    }
                    else {
                        rot.z = Math.sqrt(1 + mr[10] - mr[0] - mr[5]) / 2;
                        rot.x = (mr[8] + mr[2]) / (4 * rot.z);
                        rot.y = (mr[6] + mr[9]) / (4 * rot.z);
                        rot.w = (mr[1] - mr[4]) / (4 * rot.z);
                    }
                }
                break;
            case Orientation3D.EULER_ANGLES:
                {
                    rot.y = Math.asin(-mr[2]);
                    if (mr[2] != 1 && mr[2] != -1) {
                        rot.x = Math.atan2(mr[6], mr[10]);
                        rot.z = Math.atan2(mr[1], mr[0]);
                    }
                    else {
                        rot.z = 0;
                        rot.x = Math.atan2(mr[4], mr[5]);
                    }
                }
                break;
        };
        vec.push(pos);
        vec.push(rot);
        vec.push(scale);
        return vec;
    }
    /**
     * 使用不含平移元素的转换矩阵将 Vector3D 对象从一个空间坐标转换到另一个空间坐标。返回的 Vector3D 对象将容纳应用旋转和缩放转换之后的新坐标。如果 deltaTransformVector() 方法应用的是仅包含平移转换的矩阵，则返回的 Vector3D 对象与原始 Vector3D 对象相同。  
     * 通过使用 deltaTransformVector() 方法，可以让一个坐标空间中的显示对象对第二个显示对象的旋转转换做出响应。该对象不复制旋转；它只是更改其位置以反映旋转中的更改。例如，为了使用 display.Graphics API 绘制一个旋转的 3D 显示对象，则必须将该对象的旋转坐标映射到一个 2D 点。首先，在每次旋转后使用 deltaTransformVector() 方法检索对象的 3D 坐标。然后，应用显示对象的 local3DToGlobal() 方法，以将 3D 坐标平移到 2D 点。然后，可以使用 2D 点来绘制旋转的 3D 对象。  
     * 注意：此方法会将所传递的 Vector3D 的 w 分量自动设置为 0.0。
     * 
     * @param param0 一个容纳要转换的坐标的 Vector3D 对象。
     * @returns 一个包含转换后的坐标的 Vector3D 对象。
     */
    deltaTransformVector({ x, y, z }: Vector3D) {
        return new Vector3D(x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[3], x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[7], x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[11], 0);
    }
    /**
     * 将当前矩阵转换为恒等或单位矩阵。恒等矩阵中的主对角线位置上的元素的值为一，而所有其他元素的值为零。生成的结果是一个矩阵，其中，rawData 值为 1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1，旋转设置为 Vector3D(0,0,0)，位置或平移设置为 Vector3D(0,0,0)，缩放设置为 Vector3D(1,1,1)。以下是恒等矩阵的表示形式。  
     * 通过应用恒等矩阵转换的对象不执行任何转换。换句话说，如果一个矩阵与一个恒等矩阵相乘，则会生成一个与原始矩阵相同（恒等）的矩阵。
     */
    identity() {
        this.rawData = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
    /**
     * 朝着目标矩阵的平移、旋转和缩放转换插补某个矩阵的这些转换。  
     * interpolate() 方法可避免在使用方法（例如显示对象的轴旋转属性）时出现一些不需要的结果。interpolate() 方法可使缓存的显示对象旋转属性值无效，并在插补前将显示对象矩阵的方向元素转换为四元数。此方法可以确保旋转的路径最短且最有效。它还生成平滑的、无万向节锁定的旋转。当使用欧拉角时（此时将单独处理每个轴）会出现万向节锁定。在绕两个或更多轴旋转的过程中，这些轴可能会对齐，从而导致意外结果。四元数旋转可避免万向节锁定。  
     * 对 interpolate() 方法的连续调用会产生这样的效果：显示对象迅速启动，然后缓慢接近另一个显示对象。例如，如果将 thisMat 参数设置为返回的 Matrix3D 对象，将 toMat 参数设置为目标显示对象关联的 Matrix3D 对象，并将 percent 参数设置为 0.1，则显示对象会朝目标对象移动百分之十。对于后续调用或在后续的帧中，对象会移动剩余的 90% 的百分之十，然后移动剩余的 距离的百分之十，直到对象到达目标。
     * 
     * @param thisMat 要插补的 Matrix3D 对象。
     * @param toMat 目标 Matrix3D 对象。
     * @param percent 一个介于 0 和 1 之间的值，它确定朝目标 Matrix3D 对象插补 thisMat Matrix3D 对象的位置百分比。
     * @returns 一个 Matrix3D 对象，其中包含用于放置原始矩阵和目标矩阵之间的矩阵值的元素。在将返回的矩阵应用于 this 显示对象时，该对象会朝着目标对象移动到指定的百分比位置。
     */
    static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number) {
        const m = new Matrix3D();
        {
            let _g = 0;
            while (_g < 16) {
                const i = _g++;
                m.rawData[i] = thisMat.rawData[i]! + (toMat.rawData[i]! - thisMat.rawData[i]!) * percent;
            }
        };
        return m;
    }
    /**
     * 朝着目标矩阵的平移、旋转和缩放转换插补此矩阵。  
     * interpolateTo() 方法可避免在使用方法（例如显示对象的轴旋转属性）时出现不需要的结果。interpolateTo() 方法可使缓存的显示对象旋转属性值无效，并在插补前将显示对象矩阵的方向元素转换为四元数。此方法可以确保旋转的路径最短且最有效。它还生成平滑的、无万向节锁定的旋转。当使用欧拉角时（此时将单独处理每个轴）会出现万向节锁定。在绕两个或更多轴旋转的过程中，这些轴可能会对齐，从而导致意外结果。四元数旋转可避免万向节锁定。  
     * **注意**：在插值的情况下，矩阵的缩放值将重置，此时将标准化矩阵。  
     * 对 interpolateTo() 方法的连续调用会产生这样的效果：显示对象迅速启动，然后缓慢接近另一个显示对象。例如，如果 percent 参数设置为 0.1，则显示对象会朝 toMat 参数指定的目标对象移动百分之十。对于后续调用或在后续的帧中，对象会移动剩余的 90% 的百分之十，然后移动剩余的 距离的百分之十，直到对象到达目标。
     * 
     * @param toMat 目标 Matrix3D 对象。
     * @param percent 一个介于 0 和 1 之间的值，它确定显示对象相对于目标的位置。该值越接近于 1.0，显示对象就越靠近其当前位置。该值越接近于 0，显示对象就越靠近其目标。
     */
    interpolateTo(toMat: Matrix3D, percent: number) {
        Matrix3D.interpolate(this, toMat, percent);
    }
    /**
     * 反转当前矩阵。逆矩阵具有与原始矩阵相同的大小，但它执行的转换与原始矩阵相反。例如，如果在原始矩阵中，一个对象按某个方向绕 x 轴旋转，那么在逆矩阵中，该对象将按此方向的反方向绕 x 轴旋转。对一个对象应用逆矩阵可撤消原始矩阵执行的转换。如果将一个矩阵与其逆矩阵相乘，则将产生一个恒等矩阵。  
     * 利用矩阵的逆矩阵，可以将一个矩阵除以另一个矩阵。通过将矩阵 A 与矩阵 B 的逆矩阵相乘，可以将矩阵 A 除以矩阵 B。逆矩阵还可以用于摄像头空间。当摄像头在现实世界空间中移动时，现实世界中的对象需按与摄像头相反的方向移动，这样才能从现实世界视点转换到摄像头或视点空间。例如，如果摄像头移动得越近，则对象变得越大。换句话说，如果摄像头沿现实世界的 z 轴下移，则对象会沿此 z 轴上移。  
     * invert() 方法会将当前矩阵替换为逆矩阵。如果要反转矩阵，而不更改当前矩阵，请先使用 clone() 方法复制当前矩阵，然后对生成的副本应用 invert() 方法。  
     * Matrix3D 对象必须是可逆的。
     * 
     * @returns 如果成功反转矩阵，则返回 true。
     */
    invert() {
        const det = this.determinant;
        if (!det) return false;

        const invDet = 1 / det;
        const [
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33
        ] = this.rawData;

        this.rawData = [
            // 第一列
            (m11 * m22 * m33 - m11 * m23 * m32 - m21 * m12 * m33 +
                m21 * m13 * m32 + m31 * m12 * m23 - m31 * m13 * m22) * invDet,

            (-m01 * m22 * m33 + m01 * m23 * m32 + m21 * m02 * m33 -
                m21 * m03 * m32 - m31 * m02 * m23 + m31 * m03 * m22) * invDet,

            (m01 * m12 * m33 - m01 * m13 * m32 - m11 * m02 * m33 +
                m11 * m03 * m32 + m31 * m02 * m13 - m31 * m03 * m12) * invDet,

            (-m01 * m12 * m23 + m01 * m13 * m22 + m11 * m02 * m23 -
                m11 * m03 * m22 - m21 * m02 * m13 + m21 * m03 * m12) * invDet,

            // 第二列
            (-m10 * m22 * m33 + m10 * m23 * m32 + m20 * m12 * m33 -
                m20 * m13 * m32 - m30 * m12 * m23 + m30 * m13 * m22) * invDet,

            (m00 * m22 * m33 - m00 * m23 * m32 - m20 * m02 * m33 +
                m20 * m03 * m32 + m30 * m02 * m23 - m30 * m03 * m22) * invDet,

            (-m00 * m12 * m33 + m00 * m13 * m32 + m10 * m02 * m33 -
                m10 * m03 * m32 - m30 * m02 * m13 + m30 * m03 * m12) * invDet,

            (m00 * m12 * m23 - m00 * m13 * m22 - m10 * m02 * m23 +
                m10 * m03 * m22 + m20 * m02 * m13 - m20 * m03 * m12) * invDet,

            // 第三列和第四列（省略类似计算，保持与官方一致）
            (m10 * m21 * m33 - m10 * m23 * m31 - m20 * m11 * m33 +
                m20 * m13 * m31 + m30 * m11 * m23 - m30 * m13 * m21) * invDet,

            (-m00 * m21 * m33 + m00 * m23 * m31 + m20 * m01 * m33 -
                m20 * m03 * m31 - m30 * m01 * m23 + m30 * m03 * m21) * invDet,

            (m00 * m11 * m33 - m00 * m13 * m31 - m10 * m01 * m33 +
                m10 * m03 * m31 + m30 * m01 * m13 - m30 * m03 * m11) * invDet,

            (-m00 * m11 * m23 + m00 * m13 * m21 + m10 * m01 * m23 -
                m10 * m03 * m21 - m20 * m01 * m13 + m20 * m03 * m11) * invDet,

            (-m10 * m21 * m32 + m10 * m22 * m31 + m20 * m11 * m32 -
                m20 * m12 * m31 - m30 * m11 * m22 + m30 * m12 * m21) * invDet,

            (m00 * m21 * m32 - m00 * m22 * m31 - m20 * m01 * m32 +
                m20 * m02 * m31 + m30 * m01 * m22 - m30 * m02 * m21) * invDet,

            (-m00 * m11 * m32 + m00 * m12 * m31 + m10 * m01 * m32 -
                m10 * m02 * m31 - m30 * m01 * m12 + m30 * m02 * m11) * invDet,

            (m00 * m11 * m22 - m00 * m12 * m21 - m10 * m01 * m22 +
                m10 * m02 * m21 + m20 * m01 * m12 - m20 * m02 * m11) * invDet
        ];

        return true;
    }
    /**
     * 旋转显示对象以使其朝向指定的位置。此方法允许对方向进行就地修改。显示对象（即 at Vector3D 对象）的向前方向矢量指向指定的现实世界相关位置。显示对象的向上方向是用 up Vector3D 对象指定的。  
     * pointAt() 方法可使缓存的显示对象旋转属性值无效。此方法可分解显示对象的矩阵并修改旋转元素，从而让对象转向指定位置。然后，此方法将重新组成（更新）显示对象的矩阵，这将执行转换。如果该对象指向正在移动的目标（例如正在移动的对象位置），则对于每个后续调用，此方法都会让对象朝正在移动的目标旋转。  
     * **注意**：如果使用 Matrix3D.pointAt() 方法，但不设置可选参数，则默认情况下，某个目标对象将不面对所指定的相对于现实世界的位置。您需要将 at 的值设置为 -y 轴 (0,-1,0)，将 up 的值设置为 -z 轴 (0,0,-1)。
     * 
     * @param pos 目标对象的相对于现实世界的位置。相对于现实世界定义了相对于所有对象所在的现实世界空间和坐标的对象转换。
     * @param at (default = null) — 用于定义显示对象所指向的位置的相对于对象的矢量。相对于对象定义了相对于对象空间（即对象自己的参照帧和坐标系统）的对象转换。默认值为 +y 轴 (0,1,0)。
     * @param up (default = null) — 用于为显示对象定义“向上”方向的相对于对象的矢量。如果从上至下绘制对象，则 +z 轴为该对象的“up”矢量。相对于对象定义了相对于对象空间（即对象自己的参照帧和坐标系统）的对象转换。默认值为 +z 轴 (0,0,1)。
     */
    pointAt(pos: Vector3D, at = new Vector3D(0, 0, -1), up = new Vector3D(0, -1, 0)) {
        const dir = at.subtract(pos);
        let vup = up.clone();
        let right: Vector3D;
        dir.normalize();
        vup.normalize();
        const dir2 = dir.clone();
        dir2.scaleBy(vup.dotProduct(dir));
        vup = vup.subtract(dir2);
        if (vup.length > 0) vup.normalize();
        else if (dir.x != 0) vup = new Vector3D(-dir.y, dir.x, 0);
        else vup = new Vector3D(1, 0, 0);
        right = vup.crossProduct(dir);
        right.normalize();
        this.rawData = [
            right.x, vup.x, dir.x, pos.x,
            right.y, vup.y, dir.y, pos.y,
            right.z, vup.z, dir.z, pos.z,
            0, 0, 0, 1
        ]
    }
    /**
     * 通过将当前 Matrix3D 对象与另一个 Matrix3D 对象相乘来前置一个矩阵。得到的结果将合并两个矩阵转换。  
     * 矩阵乘法运算与矩阵加法运算不同。矩阵乘法运算是不可交换的。换句话说，A 乘以 B 并不等于 B 乘以 A。在使用 prepend() 方法时，乘法运算将从右侧开始，这意味着 rhs Matrix3D 对象位于乘法运算符的右侧。
     * ```
     * thisMatrix = thisMatrix * rhs
     * ```
     * prepend() 方法所做的修改与对象空间相关。换句话说，这些修改始终与对象的初始参照帧相关。  
     * prepend() 方法会将当前矩阵替换为前置的矩阵。如果要前置两个矩阵，而不更改当前矩阵，请先使用 clone() 方法复制当前矩阵，然后对生成的副本应用 prepend() 方法。
     * 
     * @param rhs 一个右侧矩阵，它与当前 Matrix3D 对象相乘。
     */
    prepend(rhs: Matrix3D) {
        // 创建当前矩阵的临时副本
        const temp = this.clone();
        // 重置当前矩阵为单位矩阵，然后连接前置矩阵和临时矩阵
        this.identity();
        this.append(rhs);
        this.append(temp);
    }
    /**
     * 在 Matrix3D 对象上前置一个增量旋转。在将 Matrix3D 对象应用于显示对象时，矩阵会在 Matrix3D 对象中先执行旋转，然后再执行其他转换。  
     * 显示对象的旋转由以下元素定义：一个轴、绕该轴旋转的增量角度和对象旋转中心的可选轴点。轴可以是任何常规方向。常见的轴为 X_AXIS (Vector3D(1,0,0))、Y_AXIS (Vector3D(0,1,0)) 和 Z_AXIS (Vector3D(0,0,1))。在航空术语中，有关 y 轴的旋转称为偏航。有关 x 轴的旋转称为俯仰。有关 z 轴的旋转称为翻滚。  
     * 转换的顺序很重要。先旋转再平移的转换所产生的效果与先平移再旋转所产生的效果不同。  
     * 旋转效果不是绝对效果。此效果与对象有关，它与原始位置和方向的参照帧相对。要确保对转换进行绝对更改，请使用 recompose() 方法。  
     * 在将 prependRotation() 方法的转换应用于显示对象的 Matrix3D 对象时，缓存的显示对象旋转属性值无效。  
     * 一种使一个显示对象围绕某个相对于其位置的特定点进行旋转的方法是：将该对象平移到指定的点，使用 prependRotation() 方法旋转该对象，然后将该对象平移回原始位置。在下面的示例中，myObject 3D 显示对象将围绕坐标 (10,10,0) 进行 y 轴旋转。
     * ```
     * myObject.z = 1;
     * myObject.transform.matrix3D.prependTranslation(10,10,0);
     * myObject.transform.matrix3D.prependRotation(1, Vector3D.Y_AXIS);
     * myObject.transform.matrix3D.prependTranslation(-10,-10,0);
     * ```
     * 
     * @param degrees 旋转的角度。
     * @param axis 旋转的轴或方向。常见的轴为 X_AXIS (Vector3D(1,0,0))、Y_AXIS (Vector3D(0,1,0)) 和 Z_AXIS (Vector3D(0,0,1))。此矢量的长度应为 1。
     * @param pivotPoint (default = null) — 一个用于确定旋转中心的点。对象的默认轴点为该对象的注册点。
     */
    prependRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D) {
        const rotMatrix = new Matrix3D();
        rotMatrix.appendRotation(degrees, axis, pivotPoint);
        this.prepend(rotMatrix);
    }
    /**
     * 在 Matrix3D 对象上前置一个增量缩放，沿 x、y 和 z 轴改变位置。在将 Matrix3D 对象应用于显示对象时，矩阵会在 Matrix3D 对象中先执行缩放更改，然后再执行其他转换。这些更改与对象有关，它与原始位置和方向的参照帧相对。默认的缩放系数为 (1.0, 1.0, 1.0)。  
     * 缩放将作为沿三个轴（x、y、z）进行的三个增量更改集进行定义。可以将每个轴与不同的数字相乘。在将缩放更改应用于显示对象时，该对象的大小会增大或减小。例如，将 x、y 和 z 轴设置为 2 将使对象大小为原来的两倍，而将轴设置为 0.5 将使对象的大小为原来的一半。要确保缩放转换只影响特定的轴，请将其他参数设置为 1。参数为 1 表示不沿特定的轴进行任何缩放更改。  
     * prependScale() 方法可用于调整大小和管理扭曲（例如显示对象的拉伸或收缩），还可用于某个位置上的放大和缩小。在显示对象的旋转和平移过程中，将自动执行缩放转换。  
     * 转换的顺序很重要。先调整大小再平移的转换所产生的效果与先平移再调整大小的转换所产生的效果不同。
     * 
     * @param xScale 用于沿 x 轴缩放对象的乘数。
     * @param yScale 用于沿 y 轴缩放对象的乘数。
     * @param zScale 用于沿 z 轴缩放对象的乘数。
     */
    prependScale(xScale: number, yScale: number, zScale: number) {
        const scaleMatrix = new Matrix3D();
        scaleMatrix.appendScale(xScale, yScale, zScale);
        this.prepend(scaleMatrix);
    }
    /**
     * 在 Matrix3D 对象上前置一个增量平移，沿 x、y 和 z 轴重新定位。在将 Matrix3D 对象应用于显示对象时，矩阵会在 Matrix3D 对象中先执行平移更改，然后再执行其他转换。  
     * 平移指定显示对象从其当前位置沿 x、y 和 z 轴移动的距离。prependTranslation() 方法将平移设置为沿三个轴（x、y、z）进行的三个增量更改集。要让平移只影响特定的轴，请将其他参数设置为零。参数为零表示不沿特定的轴进行任何更改。  
     * 平移更改不是绝对更改。此效果与对象有关，它与原始位置和方向的参照帧相对。要确保对转换矩阵进行绝对更改，请使用 recompose() 方法。转换的顺序也很重要。先平移再旋转的转换所产生的效果与先旋转再平移的转换所产生的效果不同。当使用 prependTranslation() 时，显示对象将继续按照其面对的方向移动，这与其他转换无关。例如，如果显示对象面向的是正向 x 轴，则该对象将继续按照 prependTranslation() 方法指定的方向移动，这与对象旋转的方式无关。要让平移更改在其他转换之后发生，请使用 appendTranslation() 方法。
     * 
     * @param x 沿 x 轴的增量平移。
     * @param y 沿 y 轴的增量平移。
     * @param z 沿 z 轴的增量平移。
     */
    prependTranslation(x: number, y: number, z: number) {
        this.prepend(new Matrix3D([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]));
    }
    /**
     * 设置转换矩阵的平移、旋转和缩放设置。与显示对象的旋转属性或 Matrix3D 对象的旋转方法所做的增量更改不同，recompose() 方法所做的更改是绝对更改。recompose() 方法将覆盖矩阵转换。  
     * 要使用绝对父级参照帧来修改矩阵转换，请使用 decompose() 方法检索设置，然后做出适当的更改。然后，可以使用 recompose() 方法将 Matrix3D 对象设置为修改后的转换。  
     * recompose() 方法的参数指定用于转换的方向样式。默认方向为 eulerAngles，它通过三个不同的对应于每个轴的旋转角来定义方向。这些旋转是连续发生的，并且相互不更改轴。显示对象的轴旋转属性执行欧拉角方向样式转换。另外两个方向样式选项分别为 axisAngle 和 quaternion。轴角方向结合使用轴和角度来确定方向。对象绕其旋转的轴是一个单位矢量，它表示一个方向。角表示有关矢量的旋转幅度。方向还确定显示对象面对的方向，而角确定哪个方向是向上。appendRotation() 和 prependRotation() 方法使用轴角方向。四元数方向使用复数和矢量的第四个元素。方向由三个旋转轴（x、y、z）和一个旋转角 (w) 表示。interpolate() 方法使用四元数。
     * 
     * @param components 一个由三个 Vector3D 对象组成的矢量，这些对象将替代 Matrix3D 对象的平移、旋转和缩放元素。
     * @param orientationStyle 一个可选参数，它确定用于矩阵转换的方向样式。
     * @returns components 矢量的任何 Vector3D 元素不存在或为 null 时返回 false
     */
    recompose(components: Vector3D[], orientationStyle: Orientation3D.EULER_ANGLES) {
        if (components.length < 3 || components[2]!.x == 0 || components[2]!.y == 0 || components[2]!.z == 0) return false;
        this.identity();
        const scale: number[] = [];
        scale[0] = scale[1] = scale[2] = components[2]!.x;
        scale[4] = scale[5] = scale[6] = components[2]!.y;
        scale[8] = scale[9] = scale[10] = components[2]!.z;

        switch (orientationStyle) {
            case Orientation3D.EULER_ANGLES: {
                const [cx, cy, cz, sx, sy, sz] = [
                    Math.cos(components[1]!.x), Math.cos(components[1]!.y), Math.cos(components[1]!.z),
                    Math.sin(components[1]!.x), Math.sin(components[1]!.y), Math.sin(components[1]!.z)
                ];
                this.rawData = [
                    cy * cz * scale[0], cy * sz * scale[1], -sy * scale[2], 0,
                    (sx * sy * cz - cx * sz) * scale[4], (sx * sy * sz + cx * cz) * scale[5], sx * cy * scale[6], 0,
                    (cx * sy * cz + sx * sz) * scale[8], (cx * sy * sz - sx * cz) * scale[9], cx * cy * scale[10], 0,
                    components[0]!.x, components[0]!.y, components[0]!.z, 1,
                ];
                break;
            }
            default: {
                let [x, y, z, w] = [components[1]!.x, components[1]!.y, components[1]!.z, components[1]!.w];
                if (orientationStyle == Orientation3D.AXIS_ANGLE) {
                    x *= Math.sin(w / 2);
                    y *= Math.sin(w / 2);
                    z *= Math.sin(w / 2);
                    w = Math.cos(w / 2);
                };
                this.rawData = [
                    (1 - 2 * y * y - 2 * z * z) * scale[0], (2 * x * y + 2 * w * z) * scale[1], (2 * x * z - 2 * w * y) * scale[2], 0,
                    (2 * x * y - 2 * w * z) * scale[4], (1 - 2 * x * x - 2 * z * z) * scale[5], (2 * y * z + 2 * w * x) * scale[6], 0,
                    (2 * x * z + 2 * w * y) * scale[8], (2 * y * z - 2 * w * x) * scale[9], (1 - 2 * x * x - 2 * y * y) * scale[10], 0,
                    components[0]!.x, components[0]!.y, components[0]!.z, 1,
                ];
                break;
            }
        };
        if (components[2]!.x === 0) this.rawData[0] = 1e-15;
        if (components[2]!.y === 0) this.rawData[5] = 1e-15;
        if (components[2]!.z === 0) this.rawData[10] = 1e-15;
        return !(components[2]!.x === 0 || components[2]!.y === 0 || components[2]!.y === 0);
    }
    /**
     * 使用转换矩阵将 Vector3D 对象从一个空间坐标转换到另一个空间坐标。返回的 Vector3D 对象将容纳转换后的新坐标。将对 Vector3D 对象中应用所有矩阵转换（包括平移）。  
     * 如果已将 transformVector() 方法的结果应用于显示对象的位置，则仅显示对象的位置会发生更改。显示对象的旋转和缩放元素保持不变。  
     * **注意**：此方法会将所传递的 Vector3D 的 w 分量自动设置为 1.0。
     * 
     * @param param0 一个容纳要转换的坐标的 Vector3D 对象。
     * @returns 一个包含转换后的坐标的 Vector3D 对象。
     */
    transformVector({ x, y, z }: Vector3D) {
        return new Vector3D(x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12], x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13], x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14], x * this.rawData[3] + y * this.rawData[7] + z * this.rawData[11] + this.rawData[15]);
    }
    /**
     * 使用转换矩阵将由数字构成的矢量从一个空间坐标转换到另一个空间坐标。tranformVectors() 方法将读取 vin Vector 对象中的每三个数字作为一个 3D 坐标 (x,y,z)，并将转换后的 3D 坐标放置到 vout Vector 对象中。所有矩阵转换（包括平移）将应用于 vin Vector 对象。可以使用 transformVectors() 方法将 3D 对象作为网格进行呈现和转换。网格是一个顶点集合，这些顶点定义了对象的形状。
     * 
     * @param vin 一个由多个数字组成的矢量，其中每三个数字构成一个要转换的 3D 坐标 (x,y,z)。
     * @param vout 一个由多个数字组成的矢量，其中每三个数字构成一个已转换的 3D 坐标 (x,y,z)。
     */
    transformVectors(vin: number[], vout: number[]) {
        let i = 0;
        while (i + 3 <= vin.length) {
            const [x, y, z] = [vin[i]!, vin[i + 1]!, vin[i + 2]!];
            vout[i] = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
            vout[i + 1] = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
            vout[i + 2] = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
            i += 3;
        }
    }
    /**
     * 将当前 Matrix3D 对象转换为一个矩阵，并将互换其中的行和列。例如，如果当前 Matrix3D 对象的 rawData 包含以下 16 个数字：1,2,3,4,11,12,13,14,21,22,23,24,31,32,33,34，则 transpose() 方法会将每四个元素作为一个行读取并将这些行转换为列。生成的结果是一个矩阵，其 rawData 为：1,11,21,31,2,12,22,32,3,13,23,33,4,14,24,34。  
     * transpose() 方法会将当前矩阵替换为转置矩阵。如果要转置矩阵，而不更改当前矩阵，请先使用 clone() 方法复制当前矩阵，然后对生成的副本应用 transpose() 方法。  
     * 正交矩阵是一个正方形矩阵，该矩阵的转置矩阵和逆矩阵相同。
     */
    transpose() {
        this.rawData = [
            this.rawData[0], this.rawData[4], this.rawData[8], this.rawData[12],
            this.rawData[1], this.rawData[5], this.rawData[9], this.rawData[13],
            this.rawData[2], this.rawData[6], this.rawData[10], this.rawData[14],
            this.rawData[3], this.rawData[7], this.rawData[11], this.rawData[15],
        ];
    }
}

export type IMatrix3D = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];