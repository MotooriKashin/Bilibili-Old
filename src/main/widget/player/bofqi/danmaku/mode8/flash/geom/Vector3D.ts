/**
 * Vector3D 类使用笛卡尔坐标 x、y 和 z 表示三维空间中的点或位置。与在二维空间中一样，x 属性表示水平轴，y 属性表示垂直轴。在三维空间中，z 属性表示深度。当对象向右移动时，x 属性的值会增大。当对象向下移动时，y 属性的值会增大。当对象远离视点时，z 属性的值会增大。若使用透视投影和缩放，则对象在靠近屏幕时会显得大一些，而在远离屏幕时会显得小一些。正如右手三维坐标系中一样，正向 z 轴指向远离查看者的方向，并且当对象远离查看者的视线时，z 属性的值增大。全局空间的原点 (0,0,0) 位于舞台的左上角。  
 * Vector3D 类还可以表示方向，即一个从坐标原点（例如 (0,0,0)）指向一个端点的箭头；或表示 RGB（红、绿、蓝）颜色模型的一个浮点组件。  
 * 四元数表示法引入了第四个元素（w 属性），该元素提供额外的方向信息。例如，w 属性可以定义 Vector3D 对象的旋转角度。旋转角度和坐标 x、y 和 z 的组合可确定显示对象的方向。以下是 Vector3D 元素在矩阵表示法中的表示形式：
 * | |
 * | - |
 * | x |
 * | y |
 * | z |
 * | w |
 */
export class Vector3D {
    /** 定义为 Vector3D 对象的 x 轴，坐标为 (1,0,0)。 */
    static X_AXIS = new Vector3D(1, 0, 0);
    /** 定义为 Vector3D 对象的 y 轴，坐标为 (0,1,0)。 */
    static Y_AXIS = new Vector3D(0, 1, 0);
    /** 定义为 Vector3D 对象的 z 轴，坐标为 (0,0,1)。 */
    static Z_AXIS = new Vector3D(0, 0, 1);
    /** 当前 Vector3D 对象的长度（大小），即从原点 (0,0,0) 到该对象的 x、y 和 z 坐标的距离。w 属性将被忽略。单位矢量具有的长度或大小为一。 */
    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }
    /** 当前 Vector3D 对象长度的平方，它是使用 x、y 和 z 属性计算出来的。w 属性将被忽略。尽可能使用 lengthSquared() 方法，而不要使用 Vector3D.length() 方法的 Math.sqrt() 方法调用，后者速度较慢。 */
    get lengthSquared() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }
    /**
     * 创建 Vector3D 对象的实例。如果未指定构造函数的参数，则将使用元素 (0,0,0,0) 创建 Vector3D 对象。
     * 
     * @param x (default = 0.) — 第一个元素，例如 x 坐标。
     * @param y (default = 0.) — 第二个元素，例如 y 坐标。
     * @param z (default = 0.) — 第三个元素，例如 z 坐标。
     * @param w (default = 0.) — 表示额外数据的可选元素，例如旋转角度。
     */
    constructor(
        /** Vector3D 对象中的第一个元素，例如，三维空间中某个点的 x 坐标。默认值为 0。 */
        public x = 0,
        /** Vector3D 对象中的第二个元素，例如，三维空间中某个点的 y 坐标。默认值为 0。 */
        public y = 0,
        /** Vector3D 对象中的第三个元素，例如，三维空间中某个点的 z 坐标。默认值为 0。 */
        public z = 0,
        /**
         * Vector3D 对象的第四个元素（除了 x、y 和 z 属性之外）可以容纳数据，例如旋转角度。默认值为 0。  
         * 四元数表示法在三维旋转计算中，会将角度用作第四个元素。w 属性可用于定义有关 Vector3D 对象的旋转角度。旋转角度和坐标（x、y、z）的组合可确定显示对象的方向。  
         * 此外，可以将 w 属性用作投影的三维位置的透视变形因子，或用作表示投影到二维空间中的三维坐标的投影转换值。例如，可以使用 Matrix3D.rawData 属性创建一个投影矩阵，在将此矩阵应用于 Vector3D 对象时，该对象的第四个元素（w 属性）中会生成一个转换值。然后，将该 Vector3D 对象的其他元素除以此转换值可生成一个投影的 Vector3D 对象。可以使用 Vector3D.project() 方法将 Vector3D 对象的前三个元素除以它的第四个元素。
         */
        public w = 0,
    ) { }
    /**
     * 将当前 Vector3D 对象的 x、y 和 z 元素的值与另一个 Vector3D 对象的 x、y 和 z 元素的值相加。add() 方法不更改当前的 Vector3D 对象。相反，此方法将返回具有新值的新 Vector3D 对象。  
     * 将两个矢量相加即可获得一个合成矢量。一种用于可视化结果的方法是，从第一个矢量的原点或尾部到第二个矢量的结束点或开头绘制一个矢量。合成矢量是第一个矢量的原点与第二个矢量的结束点之间的距离。
     * 
     * @param param0 要与当前 Vector3D 对象相加的 Vector3D 对象。
     * @returns 一个 Vector3D 对象，它是将当前 Vector3D 对象与另一个 Vector3D 对象相加所产生的结果。
     */
    add({ x, y, z }: Vector3D) {
        return new Vector3D(this.x + x, this.y + y, this.z + z);
    }
    /**
     * 返回两个矢量之间的弧度的角度。返回的角度是第一个 Vector3D 对象旋转到与第二个 Vector3D 对象对齐的位置时所形成的最小弧度。  
     * angleBetween() 方法是静态方法。可以将此方法直接用作 Vector3D 类的方法。  
     * 要将一个角度转换成弧度，可以使用以下公式：
     * ```
     * radian = Math.PI/180 * degree
     * ```
     * 
     * @param param0 第一个 Vector3D 对象。
     * @param param1 第二个 Vector3D 对象。
     * @returns 两个 Vector3D 对象之间的角度。
     */
    static angleBetween({ x: x1, y: y1, z: z1, length: al }: Vector3D, { x: x2, y: y2, z: z2, length: bl }: Vector3D) {
        return Math.acos((x1 * x2 + y1 * y2 + z1 * z2) / (al * bl))
    }
    /**
     * 返回一个新 Vector3D 对象，它是与当前 Vector3D 对象完全相同的副本。
     * 
     * @returns 一个新 Vector3D 对象，它是当前 Vector3D 对象的副本。
     */
    clone() {
        return new Vector3D(this.x, this.y, this.z, this.w);
    }
    /**
     * 将源 Vector3D 对象中的所有矢量数据复制到调用方 Vector3D 对象中。
     * 
     * @param param0 要从中复制数据的 Vector3D 对象。
     */
    copyFrom({ x, y, z }: Vector3D) {
        [this.x, this.y, this.z] = [x, y, z];
    }
    /**
     * 返回一个新的 Vector3D 对象，它与当前 Vector3D 对象和另一个 Vector3D 对象垂直（成直角）。如果返回的 Vector3D 对象的坐标为 (0,0,0)，则表示两个 Vector3D 对象互相平行。  
     * 可以将多边形表面的两个顶点的标准化叉积与摄像头或眼睛视点的标准化矢量结合使用来获取点积。点积的值可以确定是否从视点中隐藏三维对象的某个表面。
     * 
     * @param param0 第二个 Vector3D 对象。
     * @returns 一个新的 Vector3D 对象，它与当前 Vector3D 对象和作为参数指定的 Vector3D 对象垂直。
     */
    crossProduct({ x, y, z }: Vector3D) {
        return new Vector3D(this.y * z - this.z * y, this.z * x - this.x * z, this.x * y - this.y * x, 1);
    }
    /**
     * 按照指定的 Vector3D 对象的 x、y 和 z 元素的值递减当前 Vector3D 对象的 x、y 和 z 元素的值。与 Vector3D.subtract() 方法不同，decrementBy() 方法会更改当前的 Vector3D 对象并且不返回新的 Vector3D 对象。
     * 
     * @param param0 包含要从当前 Vector3D 对象中减去的值的 Vector3D 对象。
     */
    decrementBy({ x, y, z }: Vector3D) {
        this.x -= x;
        this.y -= y;
        this.z -= z;
    }
    /**
     * 返回两个 Vector3D 对象之间的距离。distance() 方法是静态方法。可以将此方法直接用作 Vector3D 类的方法，以获取两个三维点之间的欧几里德距离。
     * 
     * @param pt1 用作第一个三维点的 Vector3D 对象。
     * @param pt2 用作第二个三维点的 Vector3D 对象。
     * @returns 两个 Vector3D 对象之间的距离。
     */
    static distance(pt1: Vector3D, pt2: Vector3D) {
        return pt1.subtract(pt2).length;
    }
    /**
     * 如果当前 Vector3D 对象和作为参数指定的 Vector3D 对象均为单位顶点，此方法将返回这两个顶点之间所成角的余弦值。单位顶点是指向同一方向且长度为一的顶点。它们会在结果中将矢量长度作为一个因子删除。可以使用 normalize() 方法将一个矢量转换为单位矢量。  
     * dotProduct() 方法会找出两个顶点之间所成的角。它还用于背面剔除或照明计算。背面剔除是一个用于确定从视点中隐藏哪些表面的过程。可以使用摄像头或眼睛视点的标准化顶点和多边形表面的顶点的叉积来获取点积。如果点积小于零，则表面将面向摄像头或查看者。如果两个单位顶点互相垂直，则二者正交且点积为零。如果两个单位顶点互相平行，则点积为一。
     * 
     * @param param0 第二个 Vector3D 对象。
     * @returns 一个标量，它是当前 Vector3D 对象与指定的 Vector3D 对象之间的点积。
     */
    dotProduct({ x, y, z }: Vector3D) {
        return this.x * x + this.y * y + this.z * z;
    }
    /**
     * 通过将当前 Vector3D 对象的 x、y 和 z 元素与指定的 Vector3D 对象的 x、y 和 z 元素进行比较，确定这两个对象是否相等。如果这些元素的值相同，则两个 Vector3D 对象相等。如果第二个可选参数设置为 true，则将对 Vector3D 对象的所有四个元素（包括 w 属性）进行比较。
     * 
     * @param param0 要与当前 Vector3D 对象进行比较的 Vector3D 对象。
     * @param allFour (default = false) — 一个可选参数，它指定在比较时是否使用 Vector3D 对象的 w 属性。
     * @returns 如果指定的 Vector3D 对象与当前 Vector3D 对象相等，则为 true 值；否则为 false。
     */
    equals({ x, y, z, w }: Vector3D, allFour = false) {
        return this.x === x && this.y === y && this.z === z && (allFour ? this.w === w : true);
    }
    /**
     * 按照指定的 Vector3D 对象的 x、y 和 z 元素的值递增当前 Vector3D 对象的 x、y 和 z 元素的值。与 Vector3D.add() 方法不同，incrementBy() 方法会更改当前的 Vector3D 对象并且不返回新的 Vector3D 对象。
     * 
     * @param param0 要与当前的 Vector3D 对象相加的 Vector3D 对象。
     */
    incrementBy({ x, y, z }: Vector3D) {
        this.x += x;
        this.y += y;
        this.z += z;
    }
    /**
     * 将当前 Vector3D 对象的元素与指定的 Vector3D 对象的元素进行比较，以确定它们是否大致相同。如果两个顶点的所有元素的值都相等或比较的结果在容差范围内，则两个 Vector3D 对象大致相等。两个元素的值之差必须小于作为 tolerance 参数指定的数字。如果第三个可选参数设置为 true，则将对 Vector3D 对象的所有四个元素（包括 w 属性）进行比较。否则，比较中仅包含 x、y 和 z 元素。
     * 
     * @param param0 要与当前 Vector3D 对象进行比较的 Vector3D 对象。
     * @param tolerance 一个用于确定容差因子的数字。如果 toCompare 参数中指定的 Vector3D 元素的值与当前 Vector3D 元素的值之差小于容差数，则将这两个值视为大致相等。
     * @param allFour (default = false) — 一个可选参数，它指定在比较时是否使用 Vector3D 对象的 w 属性。
     * @returns 如果指定的 Vector3D 对象与当前 Vector3D 对象相等，则为 true 值；否则为 false。
     */
    nearEquals({ x, y, z, w }: Vector3D, tolerance: number, allFour = false) {
        let diff = this.x - x;
        diff = diff < 0 ? 0 - diff : diff;
        let goodEnough = diff < tolerance;
        if (goodEnough) {
            diff = this.y - y;
            diff = diff < 0 ? 0 - diff : diff;
            goodEnough = diff < tolerance;
            if (goodEnough) {
                diff = this.z - z;
                diff = diff < 0 ? 0 - diff : diff;
                goodEnough = diff < tolerance;
                if (goodEnough && allFour) {
                    diff = this.w = w;
                    diff = diff < 0 ? 0 - diff : diff;
                    goodEnough = diff < tolerance;
                }
            }
        }
        return goodEnough;
    }
    /** 将当前 Vector3D 对象设置为其逆对象。也可以将逆对象视为与原始对象相反的对象。当前 Vector3D 对象的 x、y 和 z 属性的值将更改为 -x、-y 和 -z。 */
    negate() {
        [this.x, this.y, this.z] = [-this.x, -this.y, -this.z];
    }
    /**
     * 通过将最前面的三个元素（x、y、z）除以矢量的长度可将 Vector3D 对象转换为单位矢量。单位顶点是具有同一方向且长度为一的顶点。它们通过将长度作为一个因子删除，从而简化了矢量计算。
     * 
     * @returns 当前 Vector3D 对象的长度。
     */
    normalize() {
        const { length } = this;
        this.x /= length;
        this.y /= length;
        this.z /= length;
        return this.length;
    }
    /**
     * 将当前 Vector3D 对象的 x、y 和 z 属性的值除以其 w 属性的值。  
     * 如果当前 Vector3D 对象是将一个 Vector3D 对象与一个投影 Matrix3D 对象相乘后获得的结果，则 w 属性可以容纳转换值。然后，project() 方法可以通过将这些元素除以 w 属性来完成投影。使用 Matrix3D.rawData 属性可创建投影 Matrix3D 对象。
     */
    project() {
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;
    }
    /**
     * 按标量（大小）缩放当前的 Vector3D 对象。Vector3D 对象的 x、y 和 z 元素乘以参数中指定的标量数字。例如，如果将矢量放大 10 倍，则得到的矢量的长度比原来的矢量大 10 倍。标量还可以更改矢量的方向。若将矢量乘以一个负数，则将反转该矢量的方向。
     * 
     * @param s 一个用于缩放 Vector3D 对象的乘数（标量）。
     */
    scaleBy(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }
    /**
     * 将 Vector3D 的成员设置为指定值
     * 
     * @param xa 要将 Vector x 设置为的值。
     * @param ya 要将 Vector y 设置为的值。
     * @param za 要将 Vector z 设置为的值。
     */
    setTo(xa: number, ya: number, za: number) {
        [this.x, this.y, this.z] = [xa, ya, za];
    }
    /**
     * 从另一个 Vector3D 对象的 x、y 和 z 元素的值中减去当前 Vector3D 对象的 x、y 和 z 元素的值。subtract() 方法不更改当前的 Vector3D 对象。相反，此方法将返回一个具有新值的新的 Vector3D 对象。
     * 
     * @param param0 要从当前 Vector3D 对象中减去的 Vector3D 对象。
     * @returns 一个新的 Vector3D 对象，它是当前 Vector3D 对象与指定的 Vector3D 对象之差。
     */
    subtract({ x, y, z }: Vector3D) {
        return new Vector3D(this.x - x, this.y - y, this.z - z);
    }
    /**
     * 返回当前 Vector3D 对象的字符串表示形式。该字符串包含 x、y 和 z 属性的值。
     * 
     * @returns 一个字符串，它包含 x、y 和 z 属性的值。
     */
    toString() {
        return `(x=${this.x},y=${this.y},z=${this.z})`;
    }
}