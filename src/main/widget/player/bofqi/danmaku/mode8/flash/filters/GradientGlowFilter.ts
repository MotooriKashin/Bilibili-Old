import { applyFilter, type BitmapFilter } from ".";
import { BitmapFilterQuality } from "./BitmapFilterQuality";
import { BitmapFilterType } from "./BitmapFilterType";

/**
 * 对显示对象应用渐变发光效果。  
 * 渐变发光是一种非常逼真的发光效果，您可以控制颜色渐变。可以在对象的内缘或外缘的周围或者对象的顶部应用渐变发光。
 */
export class GradientGlowFilter implements BitmapFilter {
    constructor(
        /** 光晕的偏移距离。默认值为 4。 */
        public distance = 4.0,
        /**
         * 角度，以度为单位。有效值为 0 到 360。默认值为 45。  
         * 角度值表示理论上的光源落在对象上的角度，它决定了效果相对于该对象的位置。如果 distance 设置为 0，则效果相对于对象没有偏移，因此 angle 属性不起作用。
         */
        public angle = 45,
        /**
         * 定义渐变的颜色数组。例如，红色为 0xFF0000，蓝色为 0x0000FF 等等。  
         * colors 属性不能通过直接修改它的值来进行更改。相反，必须获得对 colors 的引用，对该引用进行更改，然后将 colors 设置为该引用。  
         * colors、alphas 和 ratios 属性是相关的。colors 数组中的第一个元素对应于 alphas 数组中的第一个元素以及 ratios 数组中的第一个元素，依此类推。
         */
        public colors: number[] = [],
        /**
         * colors 数组中对应颜色的 Alpha 透明度值的数组。数组中每个元素的有效值为 0 到 1。例如，0.25 将 Alpha 透明度值设置为 25%。  
         * alphas 属性不能通过直接修改它的值来进行更改。相反，必须获得对 alphas 的引用，对该引用进行更改，然后将 alphas 设置为该引用。  
         * colors、alphas 和 ratios 属性是相关的。colors 数组中的第一个元素对应于 alphas 数组中的第一个元素以及 ratios 数组中的第一个元素，依此类推。
         */
        public alphas: number[] = [],
        /**
         * 对应于 colors 数组中颜色的一组颜色分布比率。有效值为 0 到 255。  
         * ratios 属性不能通过直接修改它的值来进行更改。相反，必须获得对 ratios 的引用，对该引用进行更改，然后将 ratios 设置为该引用。  
         * colors、alphas 和 ratios 属性是相关的。colors 数组中的第一个元素对应于 alphas 数组中的第一个元素以及 ratios 数组中的第一个元素，依此类推。  
         * 如果 distance 值设置为 0，则将渐变发光滤镜看作从对象中心发出的具有渐变（即相互混合的颜色条纹）的发光。colors 数组中的第一种颜色是光晕最外面的颜色。最后一种颜色是光晕最里面的颜色。  
         * ratios 数组中的每个值设置颜色在渐变的半径上的位置，其中 0 表示渐变最外面的点，255 表示渐变最里面的点。比例值范围是从 0 到 255 像素，它们的值依次增加；例如 [0, 64, 128, 200, 255]。从 0 到 128 的值出现在光晕的外缘上。从 129 到 255 的值出现在光晕的内侧区域中。根据颜色的比例值和滤镜的 type 值，滤镜颜色可能会被应用滤镜的对象遮住。  
         * 在下面的代码和图像中，将滤镜应用于黑色的圆影片剪辑，并将类型设置为 "full"。基于教学目的，colors 数组中的第一种颜色（粉色）的 alpha 值为 1，以便与白色文档背景形成鲜明对比。（实际上，您可能不希望这样显示第一种颜色。） 数组中的最后一种颜色（黄色）遮住了应用滤镜的黑色圆盘：
         * 
         * ```
         * var colors:Array = [0xFFCCFF, 0x0000FF, 0x9900FF, 0xFF0000, 0xFFFF00];
         * var alphas:Array = [1, 1, 1, 1, 1];
         * var ratios:Array = [0, 32, 64, 128, 225];
         * var myGGF:GradientGlowFilter = new GradientGlowFilter(0, 0, colors, alphas, ratios, 50, 50, 1, 2, "full", false);
         * ```
         * 
         * 要在将 type 值设置为 "outer" 或 "full" 时实现与文档背景的无缝效果，请将数组中的第一种颜色设置为与文档背景相同的颜色，或将第一种颜色的 Alpha 值设置为 0；或者使用技巧将滤镜与背景混合在一起。  
         * 如果在代码中进行两处小的更改，发光效果可能会大不相同，即使采用相同的 ratios 和 colors 数组。将数组中第一种颜色的 Alpha 值设置为 0，以便滤镜和文档的白色背景混合在一起；并将 type 属性设置为 "outer" 或 "inner"。  
         * 请记住，颜色在渐变中的散布基于 blurX、blurY、strength 和 quality 属性的值以及 ratios 值。
         */
        public ratios: number[] = [],
        /** 水平模糊量。有效值为 0 到 255。如果模糊量小于或等于 1，则表明原始图像是按原样复制的。默认值为 4。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈现速度比其他值更快。 */
        public blurX = 4.0,
        /** 垂直模糊量。有效值为 0 到 255。如果模糊量小于或等于 1，则表明原始图像是按原样复制的。默认值为 4。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈现速度比其他值更快。 */
        public blurY = 4.0,
        /** 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。值为 0 表示未应用滤镜。 默认值为 1。 */
        public strength = 1,
        /**
         * 应用滤镜的次数。默认值为 BitmapFilterQuality.LOW，与应用一次滤镜等效。值 BitmapFilterQuality.MEDIUM 两次应用滤镜；值 BitmapFilterQuality.HIGH 三次应用滤镜。滤镜的值越小，呈示速度越快。  
         * 对于大多数应用，quality 的值为低、中或高就足够了。您可以使用其他数值（最高为 15）来达到不同的效果，但是值越高，呈示速度越慢。除了增加 quality 的值，仅增加 blurX 和 blurY 属性的值通常也可以获得类似的效果，而且呈现速度更快。
         */
        public quality = BitmapFilterQuality.LOW,
        /** 滤镜效果的放置。 */
        public type = BitmapFilterType.INNER,
        /** 指定对象是否具有挖空效果。应用挖空效果将使对象的填充变为透明，并显示文档的背景颜色。值为 true 将指定应用挖空效果；默认值为 false，即不应用挖空效果。 */
        public knockout = false,
    ) { }
    clone() {
        return <this>new GradientGlowFilter(this.distance, this.angle, this.colors, this.alphas, this.ratios, this.blurX, this.blurY, this.strength, this.quality, this.type, this.knockout);
    }
    [applyFilter](inPrimitive: string) {
        if (!this.colors || !this.alphas || !this.ratios || this.colors.length === 0 || this.alphas.length === 0 || this.ratios.length === 0) {
            return { primitives: '', result: inPrimitive };
        }

        const glowResult = `gglowResult-${Math.random().toString(36).substring(2, 9)}`;
        const componentTransfer = `componentTransfer-${Math.random().toString(36).substring(2, 9)}`;
        const finalGlow = `finalGlow-${Math.random().toString(36).substring(2, 9)}`;

        let primitives = '';

        // 步骤 1: 模糊
        const qualityCount = this.quality;
        let lastBlurInput = inPrimitive;
        for (let i = 0; i < qualityCount; i++) {
            const tempBlurResult = `tempBlur-${i}`;
            primitives += `<feGaussianBlur in="${lastBlurInput}" stdDeviation="${this.blurX} ${this.blurY}" result="${tempBlurResult}" />`;
            lastBlurInput = tempBlurResult;
        }

        // 步骤 2: 生成渐变函数
        let feComponentTransfer = `<feComponentTransfer in="${lastBlurInput}" result="${componentTransfer}">`;

        // 红、绿、蓝、透明度通道
        const colorsSortedByRatio = this.colors
            .map((color, index) => ({ color: color, ratio: this.ratios[index], alpha: this.alphas[index] }))
            .sort((a, b) => a.ratio! - b.ratio!);

        const rFunc = colorsSortedByRatio.map(c => Math.floor(((c.color >> 16) & 0xFF) * (255 / 255)));
        const gFunc = colorsSortedByRatio.map(c => Math.floor(((c.color >> 8) & 0xFF) * (255 / 255)));
        const bFunc = colorsSortedByRatio.map(c => Math.floor((c.color & 0xFF) * (255 / 255)));
        const aFunc = colorsSortedByRatio.map(c => Math.floor(c.alpha! * 255));

        const rTable = rFunc.join(' ');
        const gTable = gFunc.join(' ');
        const bTable = bFunc.join(' ');
        const aTable = aFunc.join(' ');

        feComponentTransfer += `<feFuncR type="table" tableValues="${rTable}" />`;
        feComponentTransfer += `<feFuncG type="table" tableValues="${gTable}" />`;
        feComponentTransfer += `<feFuncB type="table" tableValues="${bTable}" />`;
        feComponentTransfer += `<feFuncA type="table" tableValues="${aTable}" />`;
        feComponentTransfer += `</feComponentTransfer>`;

        primitives += feComponentTransfer;

        // 步骤 3: 结合发光和挖空效果
        if (this.type === BitmapFilterType.OUTER || this.type === BitmapFilterType.FULL) {
            primitives += `<feMerge result="${finalGlow}">
                <feMergeNode in="${componentTransfer}" />
                <feMergeNode in="${inPrimitive}" />
            </feMerge>`;
        } else if (this.type === BitmapFilterType.INNER) {
            const innerGlowComposite = `innerGlowComposite-${Math.random().toString(36).substring(2, 9)}`;
            primitives += `<feComposite in="${componentTransfer}" in2="SourceGraphic" operator="in" result="${innerGlowComposite}" />`;
            primitives += `<feMerge result="${finalGlow}">
                <feMergeNode in="${inPrimitive}" />
                <feMergeNode in="${innerGlowComposite}" />
            </feMerge>`;
        }

        // 处理挖空效果
        if (this.knockout) {
            primitives += `<feComposite in="${finalGlow}" in2="SourceGraphic" operator="xor" result="${glowResult}" />`;
        } else {
            primitives += `<feMerge result="${glowResult}">
                <feMergeNode in="${finalGlow}" />
            </feMerge>`;
        }

        return { primitives, result: glowResult };
    }
}