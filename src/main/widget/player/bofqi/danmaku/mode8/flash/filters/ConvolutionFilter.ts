import { applyFilter, type BitmapFilter } from ".";

/**
 * 应用矩阵盘绕滤镜效果。  
 * 卷积将输入图像的像素与相邻的像素合并以生成图像。通过卷积，可以实现大量的图像效果，包括模糊、边缘检测、锐化、浮雕和斜角。
 */
export class ConvolutionFilter implements BitmapFilter {
    constructor(
        /** 矩阵的 x 维度（矩阵中列的数目）。默认值为 0。 */
        public matrixX = 0,
        /** 矩阵的 y 维度（矩阵中行的数目）。默认值为 0。 */
        public matrixY = 0,
        /**
         * 用于矩阵转换的值的数组。数组中的项数必须等于 matrixX * matrixY。  
         * 矩阵盘绕基于一个 n x m 矩阵，该矩阵说明输入图像中的给定像素值如何与其相邻的像素值合并以生成最终的像素值。每个结果像素通过将矩阵应用到相应的源像素及其相邻像素来确定。
         */
        public matrix: number[] = [],
        /** 矩阵转换中使用的除数。默认值为 1。如果除数是所有矩阵值的总和，则可调平结果的总体色彩强度。忽略 0 值，此时使用默认值。 */
        public divisor = 1.0,
        /** 要添加到矩阵转换结果中的偏差量。偏差可增加每个通道的颜色值，以便暗色变得较明亮。默认值为 0。 */
        public bias = 0.0,
        /** 表示是否已保留 Alpha 通道并且不使用滤镜效果，或是否对 Alpha 通道以及颜色通道应用卷积滤镜。值为 false 表示卷积应用于所有通道，包括 Alpha 通道。值为 true 表示只对颜色通道应用卷积。默认值为 true。 */
        public preserveAlpha = true,
        /** 表示是否应锁定图像。对于源图像之外的像素，如果值为 true，则表明通过复制输入图像每个相应的边缘处的颜色值，沿着输入图像的每个边框按需要扩展输入图像。如果值为 false，则表明应按照 color 和 alpha 属性中的指定使用其他颜色。默认值为 true。 */
        public clamp = true,
        /** 要替换源图像之外的像素的十六进制颜色。它是一个没有 Alpha 成分的 RGB 值。默认值为 0。 */
        public color = 0,
        /** 替换颜色的 Alpha 透明度值。有效值为 0 到 1.0。默认值为 0。例如，0.25 设置透明度值为 25%。 */
        public alpha = 0.0,
    ) { }
    clone() {
        return <this>new ConvolutionFilter(this.matrixX, this.matrixY, this.matrix, this.divisor, this.bias, this.preserveAlpha, this.clamp, this.color, this.alpha);
    }
    [applyFilter](inPrimitive: string) {
        const resultId = `convolve-${Math.random().toString(36).substring(2, 9)}`;

        // 如果 divisor 为 0，则计算矩阵所有值的总和
        let calculatedDivisor = this.divisor;
        if (calculatedDivisor === 0) {
            calculatedDivisor = this.matrix.reduce((sum, value) => sum + value, 0);
            if (calculatedDivisor === 0) {
                calculatedDivisor = 1;
            }
        }

        // 映射 Flash 的 clamp 属性到 SVG 的 edgeMode
        const edgeMode = this.clamp ? 'duplicate' : 'none';

        const primitives = `<feConvolveMatrix
            in="${inPrimitive}"
            order="${this.matrixX},${this.matrixY}"
            kernelMatrix="${this.matrix.join(' ')}"
            divisor="${calculatedDivisor}"
            bias="${this.bias}"
            edgeMode="${edgeMode}"
            preserveAlpha="${this.preserveAlpha}"
            result="${resultId}"
        />`;

        return { primitives, result: resultId };
    }
}