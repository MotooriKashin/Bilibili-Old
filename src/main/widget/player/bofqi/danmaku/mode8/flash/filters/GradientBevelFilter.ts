import { applyFilter, type BitmapFilter } from ".";
import { BitmapFilterQuality } from "./BitmapFilterQuality";
import { BitmapFilterType } from "./BitmapFilterType";

/**
 * 对显示对象应用渐变斜角效果。  
 * 渐变斜角是位于对象外部、内部或顶部的使用渐变色增强的有斜面的边缘。有斜面的边缘使对象具有三维外观。
 */
export class GradientBevelFilter implements BitmapFilter {
    constructor(
        /** 偏移距离。有效值为 0 到 8。默认值为 4.0。 */
        public distance = 4.0,
        /**
         * 角度，以度为单位。有效值为 0 到 360。默认值为 45。  
         * 角度值表示理论上的光源落在对象上的角度。该值确定将渐变颜色应用到对象上的角度：加亮和阴影出现的位置，或数组中第一种颜色出现的位置。然后，按这些颜色在数组中出现的顺序应用颜色。
         */
        public angle = 45,
        /**
         * 渐变中使用的 RGB 十六进制颜色值数组。例如，红色为 0xFF0000，蓝色为 0x0000FF 等等。  
         * colors 属性不能通过直接修改它的值来进行更改。相反，必须获得对 colors 的引用，对该引用进行更改，然后将 colors 设置为该引用。  
         * colors、alphas 和 ratios 属性是相关的。colors 数组中的第一个元素对应于 alphas 数组中的第一个元素以及 ratios 数组中的第一个元素，依此类推。
         */
        public colors: number[] = [],
        /**
         * colors 数组中对应颜色的 Alpha 透明度值的数组。数组中每个元素的有效值为 0 到 1。例如，0.25 设置透明度值为 25%。  
         * alphas 属性不能通过直接修改它的值来进行更改。相反，必须获得对 alphas 的引用，对该引用进行更改，然后将 alphas 设置为该引用。  
         * colors、alphas 和 ratios 属性是相关的。colors 数组中的第一个元素对应于 alphas 数组中的第一个元素以及 ratios 数组中的第一个元素，依此类推。
         */
        public alphas: number[] = [],
        /**
         * 对应于 colors 数组中颜色的一组颜色分布比率。数组中每个元素的有效值为 0 到 255。  
         * ratios 属性不能通过直接修改它的值来进行更改。相反，必须获得对 ratios 的引用，对该引用进行更改，然后将 ratios 设置为该引用。  
         * colors、alphas 和 ratios 属性是相关的。colors 数组中的第一个元素对应于 alphas 数组中的第一个元素以及 ratios 数组中的第一个元素，依此类推。  
         * 要了解渐变斜角中的颜色是如何分布的，请先考虑您希望在渐变斜角中使用的颜色。考虑到简单斜角具有加亮颜色和阴影颜色；渐变斜角具有加亮渐变和阴影渐变。假定加亮出现在左上角，阴影出现在右下角。假定滤镜的一种可能用法：滤镜在加亮中使用四种颜色，在阴影中也使用四种颜色。除了加亮和阴影，滤镜还使用一种基本的填充颜色，这种颜色出现在加亮和阴影接合的边缘。因此所使用的颜色总数是九，比例数组中相应的元素数目也是九。  
         * 如果您将渐变看作由互相混合的各种颜色的条纹组成，则每一个比例值设置颜色在渐变半径上的位置，其中 0 表示渐变最外面的点，255 表示渐变最里面的点。对于一种典型用法，中间值为 128，这是基本的填充值。要获得下面图像中显示的斜角效果，请使用这九种颜色的示例分配比例值，如下所示：
         * 
         * - 前四种颜色的范围是从 0 到 127，它们的值依次增加，以便每个值都大于等于前一个值。这就形成了加亮斜角边缘。
         * - 第五种颜色（中间颜色）是基本填充，设置为 128。像素值为 128 将设置基本填充，如果类型设置为 outer，基本填充将出现在形状外侧（以及斜角边缘周围）；或者，如果类型设置为 inner，基本填充将出现在形状内侧，将有效地覆盖对象自己的填充。
         * - 后四种颜色范围是从 129 到 255，它们的值依次增加，以便每个值都大于等于前一个值。这就形成了阴影斜角边缘。
         * 
         * 如果希望平均分布每个边缘的颜色，则使用奇数种颜色，其中中间的颜色为基本填充。平均分布颜色中 0 到 127 以及 129 到 255 之间的值，然后调整值以更改渐变中颜色的每个条纹的宽度。对于具有九种颜色的渐变斜角，可能的数组为 [16, 32, 64, 96, 128, 160, 192, 224, 235]。  
         * 请记住，颜色在渐变中的散布基于 blurX、blurY、strength 和 quality 属性的值以及 ratios 值。
         */
        public ratios: number[] = [],
        /** 水平模糊量。有效值为 0 到 255。如果模糊量小于或等于 1，则表明原始图像是按原样复制的。默认值为 4。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其它值更快。 */
        public blurX = 4.0,
        /** 垂直模糊量。有效值为 0 到 255。如果模糊量小于或等于 1，则表明原始图像是按原样复制的。默认值为 4。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其它值更快。 */
        public blurY = 4.0,
        /** 印记或跨页的强度。该值越高，压印的颜色越深，而且斜角与背景之间的对比度也越强。有效值为 0 到 255。值为 0 表示未应用滤镜。 默认值为 1。 */
        public strength = 1,
        /**
         * 应用滤镜的次数。默认值为 BitmapFilterQuality.LOW，与应用一次滤镜等效。值 BitmapFilterQuality.MEDIUM 两次应用滤镜；值 BitmapFilterQuality.HIGH 三次应用滤镜。滤镜的值越小，呈示速度越快。  
         * 对于大多数应用，quality 的值为低、中或高就足够了。您可以使用其他数值（最高为 15）来达到不同的效果，但是值越高，呈示速度越慢。除了增加 quality 的值，仅增加 blurX 和 blurY 属性的值通常也可以获得类似的效果，而且呈现速度更快。
         */
        public quality = BitmapFilterQuality.LOW,
        /** 斜角效果的放置。 */
        public type = BitmapFilterType.INNER,
        /** 指定对象是否具有挖空效果。应用挖空效果将使对象的填充变为透明，并显示文档的背景颜色。值为 true 将指定应用挖空效果；默认值为 false，即不应用挖空效果。 */
        public knockout = false,
    ) { }
    clone() {
        return <this>new GradientBevelFilter(this.distance, this.angle, this.colors, this.alphas, this.ratios, this.blurX, this.blurY, this.strength, this.quality, this.type, this.knockout);
    }
    [applyFilter](inPrimitive: string) {
        if (!this.colors || !this.alphas || !this.ratios || this.colors.length === 0 || this.alphas.length === 0 || this.ratios.length === 0) {
            return { primitives: '', result: inPrimitive };
        }

        const angleRad = (this.angle - 90) * Math.PI / 180;
        const offsetX = Math.cos(angleRad) * this.distance;
        const offsetY = Math.sin(angleRad) * this.distance;

        const bevelResult = `bevelResult-${Math.random().toString(36).substring(2, 9)}`;
        const offsetResult = `offsetResult-${Math.random().toString(36).substring(2, 9)}`;
        const componentTransfer = `componentTransfer-${Math.random().toString(36).substring(2, 9)}`;

        let primitives = '';

        // 步骤 1: 模糊
        const qualityCount = this.quality;
        let lastBlurInput = inPrimitive;
        for (let i = 0; i < qualityCount; i++) {
            const tempBlurResult = `tempBlur-${i}`;
            primitives += `<feGaussianBlur in="${lastBlurInput}" stdDeviation="${this.blurX} ${this.blurY}" result="${tempBlurResult}" />`;
            lastBlurInput = tempBlurResult;
        }

        primitives += `<feOffset in="${lastBlurInput}" dx="${offsetX}" dy="${offsetY}" result="${offsetResult}" />`;

        // 步骤 2: 生成渐变函数
        let feComponentTransfer = `<feComponentTransfer in="${offsetResult}" result="${componentTransfer}">`;

        // 红、绿、蓝通道
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

        // 步骤 3: 结合斜角和挖空效果
        const finalBevel = `finalBevel-${Math.random().toString(36).substring(2, 9)}`;

        if (this.type === BitmapFilterType.OUTER) {
            primitives += `<feMerge result="${finalBevel}">
                <feMergeNode in="${inPrimitive}" />
                <feMergeNode in="${componentTransfer}" />
            </feMerge>`;
        } else if (this.type === BitmapFilterType.INNER) {
            primitives += `<feComposite in="${componentTransfer}" in2="SourceGraphic" operator="in" result="${finalBevel}" />`;
        } else if (this.type === BitmapFilterType.FULL) {
            primitives += `<feMerge result="${finalBevel}">
                <feMergeNode in="${inPrimitive}" />
                <feMergeNode in="${componentTransfer}" />
            </feMerge>`;
        }

        // 处理挖空效果
        if (this.knockout) {
            const tempResult = `tempResult-${Math.random().toString(36).substring(2, 9)}`;
            primitives += `<feComposite in="SourceGraphic" in2="${finalBevel}" operator="out" result="${tempResult}" />`;
            primitives += `<feMerge result="${bevelResult}">
                <feMergeNode in="${tempResult}" />
                <feMergeNode in="${componentTransfer}" />
            </feMerge>`;
        } else {
            primitives += `<feMerge result="${bevelResult}">
                <feMergeNode in="${finalBevel}" />
            </feMerge>`;
        }

        return { primitives, result: bevelResult };
    }
}