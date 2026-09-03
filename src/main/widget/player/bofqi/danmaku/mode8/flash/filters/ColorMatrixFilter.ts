import { applyFilter, type BitmapFilter } from ".";

/**
 * 可以将 4 x 5 矩阵转换应用于输入图像上的每个像素的 RGBA 颜色和 Alpha 值，以生成具有一组新的 RGBA 颜色和 Alpha 值的结果。该类允许饱和度更改、色相旋转、亮度为 Alpha 以及各种其他效果。  
 * 注意：对于 RGBA 值，最高有效字节代表红色通道值，其后的有效字节分别代表绿色、蓝色和 Alpha 通道值。
 */
export class ColorMatrixFilter implements BitmapFilter {
    constructor(
        /**
         * 由 20 个项目组成的数组，适用于 4 x 5 颜色转换。matrix 属性不能通过直接修改它的值来更改（例如 myFilter.matrix[2] = 1;）。相反，必须先获取对数组的引用，对引用进行更改，然后重置该值。  
         * 颜色矩阵滤镜将每个源像素分离成它的红色、绿色、蓝色和 Alpha 成分，分别以 srcR、srcG、srcB 和 srcA 表示。要计算四个通道中每个通道的结果，可将图像中每个像素的值乘以转换矩阵中的值。（可选）可以将偏移量（介于 -255 至 255 之间）添加到每个结果（矩阵的每行中的第五项）中。滤镜将各颜色成分重新组合为单一像素，并写出结果。在下列公式中，a[0] 到 a[19] 对应于由 20 个项目组成的数组中的条目 0 至 19，该数组已传递到 matrix 属性：
         *   - redResult   = (a[0]  * srcR) + (a[1]  * srcG) + (a[2]  * srcB) + (a[3]  * srcA) + a[4]
         *   - greenResult = (a[5]  * srcR) + (a[6]  * srcG) + (a[7]  * srcB) + (a[8]  * srcA) + a[9]
         *   - blueResult  = (a[10] * srcR) + (a[11] * srcG) + (a[12] * srcB) + (a[13] * srcA) + a[14]
         *   - alphaResult = (a[15] * srcR) + (a[16] * srcG) + (a[17] * srcB) + (a[18] * srcA) + a[19]
         * 
         * 对于数组中的每个颜色值，值 1 等于正发送到输出的通道的 100%，同时保留颜色通道的值。  
         * 计算是对非相乘的颜色值执行的。如果输入图形由预先相乘的颜色值组成，这些值会自动转换为非相乘的颜色值以执行此操作。
         */
        public matrix: IMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
        ],
    ) { }
    clone() {
        return <this>new ColorMatrixFilter(this.matrix);
    }
    /**
     * 将 ColorMatrixFilter 转换为 SVG 滤镜基元字符串。
     * @param inPrimitive 上一个滤镜基元的输出结果ID，用于串联。
     * @returns 包含 SVG 滤镜基元和其最终输出ID的对象。
     */
    [applyFilter](inPrimitive: string) {
        const resultId = `colorMatrix-${Math.random().toString(36).substring(2, 9)}`;
        const matrixString = this.matrix.join(' ');

        const primitives = `<feColorMatrix type="matrix" values="${matrixString}" in="${inPrimitive}" result="${resultId}" />`;

        return { primitives, result: resultId };
    }
}
export type IMatrix = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];