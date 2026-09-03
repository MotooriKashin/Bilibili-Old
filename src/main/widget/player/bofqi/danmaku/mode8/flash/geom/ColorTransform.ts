import { applyFilter } from "../filters";

/**
 * 可使用 ColorTransform 类调整显示对象的颜色值。可以将颜色调整或颜色转换应用于所有四种通道：红色、绿色、蓝色和 Alpha 透明度。  
 * 当 ColorTransform 对象应用于显示对象时，将按如下方法为每个颜色通道计算新值：
 *   - 新红色值 = (旧红色值 * redMultiplier) + redOffset
 *   - 新绿色值 = (旧绿色值 * greenMultiplier) + greenOffset
 *   - 新蓝色值 = (旧蓝色值 * blueMultiplier) + blueOffset
 *   - 新 Alpha 值 = (旧 Alpha 值 * alphaMultiplier) + alphaOffset
 * 
 * 如果计算后任何一个颜色通道值大于 255，则该值将被设置为 255。如果该值小于 0，它将被设置为 0。  
 * 可以通过下列方式使用 ColorTransform 对象：
 *   - 在 BitmapData 类的 colorTransform() 方法的 colorTransform 参数中
 *   - 作为 Transform 对象（此对象可以用作显示对象的 transform 属性）的 colorTransform 属性
 */
export class ColorTransform {
    /**
     * ColorTransform 对象的 RGB 颜色值。  
     * 设置此属性时，会相应地更改三种颜色的偏移量值（redOffset、greenOffset 和 blueOffset），并将这三个颜色乘数值（redMultiplier、greenMultiplier 和 blueMultiplier）设置为 0。Alpha 透明度乘数和偏移量值不变。  
     * 在传递此属性的值时，请使用格式 0x RRGGBB。RR、GG 和 BB 均包含两个十六进制数字，这些数字指定每个颜色成分的偏移量。ActionScript 编译器从 0x 获知数字是十六进制值。
     */
    get color() {
        const r = Math.max(0, Math.min(255, Math.round(this.redOffset)));
        const g = Math.max(0, Math.min(255, Math.round(this.greenOffset)));
        const b = Math.max(0, Math.min(255, Math.round(this.blueOffset)));
        return (r << 16) | (g << 8) | b;
    }
    set color(v) {
        // 设置颜色时，重置乘数为0，只使用偏移值
        this.redMultiplier = 0;
        this.greenMultiplier = 0;
        this.blueMultiplier = 0;

        // 提取RGB分量
        this.redOffset = (v >> 16) & 0xFF;
        this.greenOffset = (v >> 8) & 0xFF;
        this.blueOffset = v & 0xFF;
    }
    /**
     * 用指定的颜色通道值和 Alpha 值为显示对象创建 ColorTransform 对象。
     * 
     * @param redMultiplier 红色乘数的值，在 0 到 1 范围内。
     * @param greenMultiplier 绿色乘数的值，在 0 到 1 范围内。
     * @param blueMultiplier 蓝色乘数的值，在 0 到 1 范围内。
     * @param alphaMultiplier Alpha 透明度乘数的值，在 0 到 1 范围内。
     * @param redOffset 红色通道值的偏移量，在 -255 到 255 范围内。
     * @param greenOffset 绿色通道值的偏移量，在 -255 到 255 范围内。
     * @param blueOffset 蓝色通道值的偏移量，在 -255 到 255 范围内。
     * @param alphaOffset Alpha 透明度通道值的偏移量，在 -255 到 255 范围内。
     */
    constructor(
        /** 与红色通道值相乘的十进制值。 */
        public redMultiplier = 1.0,
        /** 与绿色通道值相乘的十进制值。 */
        public greenMultiplier = 1.0,
        /** 与蓝色通道值相乘的十进制值。 */
        public blueMultiplier = 1.0,
        /**
         * 与 Alpha 透明度通道值相乘的十进制值。  
         * 如果您使用 DisplayObject 实例的 alpha 属性直接设置显示对象的 Alpha 透明度值，它将影响该显示对象的 transform.colorTransform 属性的 alphaMultiplier 属性的值。
         */
        public alphaMultiplier = 1.0,
        /** -255 到 255 之间的数字，它先与 redMultiplier 值相乘，再与红色通道值相加。 */
        public redOffset = 0,
        /** -255 到 255 之间的数字，它先与 greenMultiplier 值相乘，再与绿色通道值相加。 */
        public greenOffset = 0,
        /** -255 到 255 之间的数字，它先与 blueMultiplier 值相乘，再与蓝色通道值相加。 */
        public blueOffset = 0,
        /** -255 到 255 之间的数字，加到 Alpha 透明度通道值和 alphaMultiplier 值的乘积上。 */
        public alphaOffset = 0,
    ) { }
    /**
     * 将 second 参数指定的 ColorTranform 对象与当前 ColorTransform 对象连接，并将当前对象设置为结果，即两个颜色转换的相加组合。在应用级联的 ColorTransform 对象时，其效果与在原始 颜色转换后应用 second 颜色转换的效果相同。
     * 
     * @param param0 要与当前 ColorTransform 对象合并的 ColorTransform 对象。
     */
    concat({ redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset }: ColorTransform) {
        this.redMultiplier *= redMultiplier;
        this.greenMultiplier *= greenMultiplier;
        this.blueMultiplier *= blueMultiplier;
        this.alphaMultiplier *= alphaMultiplier;

        this.redOffset = redMultiplier * this.redOffset + redOffset;
        this.greenOffset = greenMultiplier * this.greenOffset + greenOffset;
        this.blueOffset = blueMultiplier * this.blueOffset + blueOffset;
        this.alphaOffset = alphaMultiplier * this.alphaOffset + alphaOffset;
    }
    /** 设置字符串格式并将其返回，该字符串描述 ColorTransform 对象的所有属性。 */
    toString() {
        return `(redMultiplier=${this.redMultiplier},greenMultiplier=${this.greenMultiplier},blueMultiplier=${this.blueMultiplier},alphaMultiplier=${this.alphaMultiplier},redOffset=${this.redOffset},greenOffset=${this.greenOffset},blueOffset=${this.blueOffset},alphaOffset=${this.alphaOffset})`;
    }
    /**
     * 将 ColorTransform 转换为 SVG 滤镜基元字符串（含 feColorMatrix 和 feComponentTransfer）
     * 
     * @param inPrimitive 上一个滤镜基元的输出结果ID，用于串联滤镜链
     * @returns 包含 SVG 滤镜基元字符串和最终输出ID的对象
     */
    [applyFilter](inPrimitive: string) {
        // 1. 生成唯一结果ID，避免多滤镜冲突
        const resultId = `colortransform-${Math.random().toString(36).substring(2, 9)}`;

        // 2. 构建 feColorMatrix 的 values 矩阵（映射 ColorTransform 参数）
        const colorMatrixValues = [
            this.redMultiplier, 0, 0, 0, this.redOffset,    // 红色通道：红乘数 + 红偏移
            0, this.greenMultiplier, 0, 0, this.greenOffset,  // 绿色通道：绿乘数 + 绿偏移
            0, 0, this.blueMultiplier, 0, this.blueOffset,   // 蓝色通道：蓝乘数 + 蓝偏移
            0, 0, 0, this.alphaMultiplier, this.alphaOffset  // Alpha通道：Alpha乘数 + Alpha偏移
        ].join(' '); // 转换为空格分隔的字符串，符合 SVG 属性要求

        // 3. 构建 SVG 滤镜基元（含颜色变换 + 数值钳位）
        const primitives = `
            <!-- 颜色变换：对应 ColorTransform 的乘法与偏移逻辑 -->
            <feColorMatrix 
                in="${inPrimitive}" 
                type="matrix" 
                values="${colorMatrixValues}" 
                result="${resultId}-temp" 
            />
            <!-- 数值钳位：确保结果在 0-255 范围内，与 Flash 行为一致 -->
            <feComponentTransfer in="${resultId}-temp" result="${resultId}">
                <feFuncR type="clamp" min="0" max="255" /> <!-- 红色通道钳位 -->
                <feFuncG type="clamp" min="0" max="255" /> <!-- 绿色通道钳位 -->
                <feFuncB type="clamp" min="0" max="255" /> <!-- 蓝色通道钳位 -->
                <feFuncA type="clamp" min="0" max="255" /> <!-- Alpha通道钳位 -->
            </feComponentTransfer>
        `.trim(); // 去除多余空格，保证输出整洁

        // 4. 返回滤镜基元与最终结果ID（供后续滤镜串联）
        return { primitives, result: resultId };
    }
}